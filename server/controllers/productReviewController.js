import pool from "../config/db.js";

const validId = (value) =>
  Number.isInteger(Number(value)) && Number(value) > 0;

// GET: All reviews for one perfume
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!validId(productId)) {
      return res.status(400).json({ message: "Invalid product ID." });
    }

    const result = await pool.query(
      `SELECT
         pr.id,
         pr.rating,
         pr.review_text,
         pr.created_at,
         pr.updated_at,
         pr.is_edited,
         u.full_name AS customer_name,
         CASE WHEN $2::integer IS NOT NULL AND pr.user_id = $2
              THEN TRUE ELSE FALSE END AS is_mine
       FROM product_reviews pr
       JOIN users u ON u.id = pr.user_id
       WHERE pr.product_id = $1
       ORDER BY pr.created_at DESC, pr.id DESC`,
      [Number(productId), req.user?.id ?? null]
    );

    const summary = await pool.query(
  `SELECT
     COALESCE(ROUND(AVG(rating)::numeric, 1), 0) AS average_rating,
     COUNT(*)::integer AS review_count,
     COUNT(*) FILTER (WHERE rating = 5)::integer AS five_star,
     COUNT(*) FILTER (WHERE rating = 4)::integer AS four_star,
     COUNT(*) FILTER (WHERE rating = 3)::integer AS three_star,
     COUNT(*) FILTER (WHERE rating = 2)::integer AS two_star,
     COUNT(*) FILTER (WHERE rating = 1)::integer AS one_star
   FROM product_reviews
   WHERE product_id = $1`,
  [Number(productId)]
);

    return res.json({
  reviews: result.rows,
  average_rating: Number(summary.rows[0].average_rating),
  review_count: summary.rows[0].review_count,
  rating_distribution: {
    5: summary.rows[0].five_star,
    4: summary.rows[0].four_star,
    3: summary.rows[0].three_star,
    2: summary.rows[0].two_star,
    1: summary.rows[0].one_star,
  },
});
  } catch (error) {
    console.error("Get product reviews error:", error);
    return res.status(500).json({ message: "Unable to load product reviews." });
  }
};

// POST: Submit a new review
export const createProductReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const rating = Number(req.body.rating);
    const reviewText = String(req.body.review_text ?? "").trim();

    if (!validId(productId)) {
      return res.status(400).json({ message: "Invalid product ID." });
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Please select a rating from 1 to 5." });
    }

    if (!reviewText || reviewText.length > 2000) {
      return res.status(400).json({
        message: "Your review must contain between 1 and 2000 characters.",
      });
    }

    const product = await pool.query(
      "SELECT id FROM products WHERE id = $1",
      [Number(productId)]
    );

    if (product.rows.length === 0) {
      return res.status(404).json({ message: "Perfume not found." });
    }

    const result = await pool.query(
      `INSERT INTO product_reviews (product_id, user_id, rating, review_text)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (product_id, user_id) DO NOTHING
       RETURNING id, product_id, rating, review_text, created_at, updated_at, is_edited`,
      [Number(productId), req.user.id, rating, reviewText]
    );

    if (result.rows.length === 0) {
      return res.status(409).json({
        message: "You have already reviewed this perfume. You can edit your existing review.",
      });
    }

    return res.status(201).json({
      message: "Your review has been submitted.",
      review: result.rows[0],
    });
  } catch (error) {
    console.error("Create product review error:", error);
    return res.status(500).json({ message: "Unable to submit your review." });
  }
};

// PUT: Edit your review
export const updateProductReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const rating = Number(req.body.rating);
    const reviewText = String(req.body.review_text ?? "").trim();

    if (!validId(reviewId)) {
      return res.status(400).json({ message: "Invalid review ID." });
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Please select a rating from 1 to 5." });
    }

    if (!reviewText || reviewText.length > 2000) {
      return res.status(400).json({
        message: "Your review must contain between 1 and 2000 characters.",
      });
    }

    const result = await pool.query(
      `UPDATE product_reviews
       SET rating = $1,
           review_text = $2,
           updated_at = NOW(),
           is_edited = TRUE
       WHERE id = $3 AND user_id = $4
       RETURNING id, product_id, rating, review_text, created_at, updated_at, is_edited`,
      [rating, reviewText, Number(reviewId), req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Review not found or you are not allowed to edit it.",
      });
    }

    return res.json({
      message: "Your review has been updated.",
      review: result.rows[0],
    });
  } catch (error) {
    console.error("Update product review error:", error);
    return res.status(500).json({ message: "Unable to update your review." });
  }
};

// DELETE: Delete your review
export const deleteProductReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    if (!validId(reviewId)) {
      return res.status(400).json({ message: "Invalid review ID." });
    }

    const result = await pool.query(
      `DELETE FROM product_reviews
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [Number(reviewId), req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Review not found or you are not allowed to delete it.",
      });
    }

    return res.json({ message: "Your review has been deleted." });
  } catch (error) {
    console.error("Delete product review error:", error);
    return res.status(500).json({ message: "Unable to delete your review." });
  }
};
