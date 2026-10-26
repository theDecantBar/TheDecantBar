import pool from "../config/db.js";
import { isConfiguredAdminEmail } from "../config/adminConfig.js";
const isAdmin = user => Boolean(user?.is_admin) || isConfiguredAdminEmail(user?.email);
const validId = id => /^[1-9]\d*$/.test(String(id)) && Number.isSafeInteger(Number(id));
const mayManage = (user, row) => Boolean(user && (isAdmin(user) || (row.user_id != null && String(row.user_id) === String(user.id))));
export function formatReview(row) {
  return { id: row.id, name: row.author_name, city: row.city || "", fragrance: row.fragrance || "", rating: Number(row.rating), text: row.review_text,
    photo: row.photo || null, isEdited: Boolean(row.is_edited), editedByAdmin: Boolean(row.edited_by_admin), timestamp: new Date(row.created_at).getTime(),
    date: new Date(row.created_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) };
}
function field(value, label, max, required = false) {
  if (typeof value !== "string") throw new Error(`${label} must be text.`);
  const clean = value.trim();
  if (required && !clean) throw new Error(`Please enter ${label.toLowerCase()}.`);
  if (clean.length > max) throw new Error(`${label} must be ${max} characters or fewer.`);
  return clean;
}
function photoValue(value, previous) {
  if (value == null || value === "") return null;
  if (typeof value !== "string") throw new Error("Invalid photo.");
  if (value === previous) return value;
  const match = value.match(/^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/);
  if (!match) throw new Error("Please upload a JPG, PNG or WebP photo.");
  const bytes = Buffer.from(match[2], "base64");
  if (bytes.length > 1024 * 1024 || bytes.length < 12) throw new Error("Photo must be a valid image under 1MB.");
  const valid = match[1] === "jpeg" ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
    : match[1] === "png" ? bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))
    : bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
  if (!valid) throw new Error("Photo contents do not match the image type.");
  return value;
}
function validate(body, previous = null) {
  const rating = body.rating === undefined && previous ? Number(previous.rating) : body.rating;
  if (typeof rating !== "number" || !Number.isInteger(rating) || rating < 1 || rating > 5) throw new Error("Choose a whole rating from 1 to 5.");
  return { rating, text: field(body.text ?? previous?.review_text, "Review", 2000, true), city: field(body.city ?? previous?.city ?? "", "City", 100),
    fragrance: field(body.fragrance ?? previous?.fragrance ?? "", "Fragrance", 255), photo: body.photo === undefined && previous ? previous.photo : photoValue(body.photo, previous?.photo) };
}
export const getReviews = async (req, res) => {
  try {
    res.set("Cache-Control", "no-store");
    const result = await pool.query(`SELECT id, author_name, city, fragrance, rating, review_text,
      (photo IS NOT NULL AND photo <> '') AS has_photo, is_edited, edited_by_admin, created_at
      FROM reviews WHERE deleted_at IS NULL ORDER BY created_at DESC, id DESC`);
    const reviews = result.rows.map(row => ({ ...formatReview(row), photo: row.has_photo ? `/api/reviews/${row.id}/photo` : null }));
    return res.json({ success: true, count: reviews.length, reviews });
  } catch (error) { console.error("Fetch reviews failed:", error.message); return res.status(500).json({ message: "Unable to load reviews. Please try again." }); }
};
export const getManageableReviews = async (req, res) => {
  try {
    res.set("Cache-Control", "private, no-store");
    const result = await pool.query("SELECT id FROM reviews WHERE deleted_at IS NULL AND ($1::boolean OR user_id = $2)", [isAdmin(req.user), req.user.id]);
    return res.json({ ids: result.rows.map(row => row.id) });
  } catch { return res.status(500).json({ message: "Unable to load review permissions." }); }
};
export const getReviewPhoto = async (req, res) => {
  if (!validId(req.params.id)) return res.status(404).end();
  try {
    const result = await pool.query("SELECT photo FROM reviews WHERE id = $1 AND deleted_at IS NULL", [req.params.id]);
    const photo = result.rows[0]?.photo;
    const match = typeof photo === "string" && photo.match(/^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/);
    res.set("Cache-Control", "no-store"); res.set("X-Content-Type-Options", "nosniff");
    if (match) return res.type(`image/${match[1]}`).send(Buffer.from(match[2], "base64"));
    if (typeof photo === "string" && photo.startsWith("https://")) return res.redirect(302, photo);
    return res.status(404).end();
  } catch { return res.status(500).end(); }
};
export const createReview = async (req, res) => {
  let data;
  try { data = validate(req.body); } catch (error) { return res.status(400).json({ message: error.message }); }
  try {
    const name = field(req.user.full_name || "Customer", "Name", 255, true);
    const result = await pool.query(`INSERT INTO reviews (user_id, author_name, author_email, city, fragrance, rating, review_text, photo, verified_buyer)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,false) RETURNING *`, [req.user.id, name, req.user.email, data.city, data.fragrance, data.rating, data.text, data.photo]);
    res.set("Cache-Control", "private, no-store");
    return res.status(201).json({ success: true, review: formatReview(result.rows[0]) });
  } catch (error) { console.error("Create review failed:", error.message); return res.status(500).json({ message: "Unable to save your review. Please try again." }); }
};
export const updateReview = async (req, res) => {
  if (!validId(req.params.id)) return res.status(404).json({ message: "Review not found." });
  try {
    const found = await pool.query("SELECT * FROM reviews WHERE id = $1 AND deleted_at IS NULL", [req.params.id]);
    const previous = found.rows[0];
    if (!previous) return res.status(404).json({ message: "Review not found." });
    if (!mayManage(req.user, previous)) return res.status(403).json({ message: "Only the author or an administrator can edit this review." });
    const body = { ...req.body };
    if (body.photo === `/api/reviews/${previous.id}/photo`) delete body.photo;
    let data;
    try { data = validate(body, previous); } catch (error) { return res.status(400).json({ message: error.message }); }
    const result = await pool.query(`UPDATE reviews SET rating=$1, review_text=$2, photo=$3, city=$4, fragrance=$5,
      is_edited=true, updated_at=NOW(), edited_by=$6, edited_by_admin=$7
      WHERE id=$8 AND deleted_at IS NULL AND ($9::boolean OR user_id=$6) RETURNING *`,
      [data.rating, data.text, data.photo, data.city, data.fragrance, req.user.id, isAdmin(req.user) && String(previous.user_id) !== String(req.user.id), req.params.id, isAdmin(req.user)]);
    if (!result.rows[0]) return res.status(404).json({ message: "Review is no longer available." });
    res.set("Cache-Control", "private, no-store");
    return res.json({ success: true, review: formatReview(result.rows[0]) });
  } catch (error) { console.error("Update review failed:", error.message); return res.status(500).json({ message: "Unable to update your review. Please try again." }); }
};
export const deleteReview = async (req, res) => {
  if (!validId(req.params.id)) return res.status(404).json({ message: "Review not found." });
  try {
    const result = await pool.query(`UPDATE reviews SET deleted_at=NOW(), deleted_by=$2, updated_at=NOW()
      WHERE id=$1 AND deleted_at IS NULL AND ($3::boolean OR user_id=$2) RETURNING id`, [req.params.id, req.user.id, isAdmin(req.user)]);
    if (!result.rows[0]) return res.status(404).json({ message: "Review not found or you do not have permission to delete it." });
    res.set("Cache-Control", "private, no-store");
    return res.json({ success: true, message: "Review removed from the website." });
  } catch (error) { console.error("Delete review failed:", error.message); return res.status(500).json({ message: "Unable to delete your review. Please try again." }); }
};
