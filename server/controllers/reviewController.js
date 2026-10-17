import pool from "../config/db.js";

// @desc    Get all public verified reviews
// @route   GET /api/reviews
// @access  Public
export const getReviews = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, user_id, author_name, author_email, city, fragrance,
              order_number, rating, review_text, photo, verified_buyer,
              is_edited, created_at
       FROM reviews
       ORDER BY created_at DESC`
    );

    const reviews = result.rows.map((row) => ({
      id: row.id,
      authorId: row.user_id,
      authorEmail: row.author_email,
      name: row.author_name,
      city: row.city || "India",
      fragrance: row.fragrance,
      orderNumber: row.order_number,
      rating: Number(row.rating) || 5,
      text: row.review_text,
      photo: row.photo || null,
      verifiedBuyer: Boolean(row.verified_buyer),
      isEdited: Boolean(row.is_edited),
      timestamp: new Date(row.created_at).getTime(),
      date: new Date(row.created_at).toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      }),
    }));

    return res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({ message: "Server error fetching reviews." });
  }
};

// @desc    Create a new verified review
// @route   POST /api/reviews
// @access  Private (Authenticated users only)
export const createReview = async (req, res) => {
  try {
    const { fragrance, rating, text, photo, city, orderNumber } = req.body;

    if (!text || !rating) {
      return res.status(400).json({
        message: "Please provide your rating and review text.",
      });
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5 stars." });
    }

    const userId = req.user.id;
    const userEmail = req.user.email;
    const userName = req.user.full_name || req.body.name || "Customer";
    const userCity = city?.trim() || req.user.city || "India";

    // Optional: check if customer has previous orders to link order_number if not provided
    let verifiedOrderNumber = orderNumber?.trim() || null;
    if (!verifiedOrderNumber) {
      try {
        const orderCheck = await pool.query(
          `SELECT order_number FROM orders WHERE (user_id = $1 OR LOWER(customer_email) = LOWER($2)) ORDER BY created_at DESC LIMIT 1`,
          [userId, userEmail]
        );
        if (orderCheck.rows.length > 0) {
          verifiedOrderNumber = orderCheck.rows[0].order_number;
        }
      } catch (err) {
        console.warn("Optional order lookup note:", err.message);
      }
    }

    const cleanFragrance = fragrance?.trim() || null;

    const insertResult = await pool.query(
      `INSERT INTO reviews
        (user_id, author_name, author_email, city, fragrance, order_number, rating, review_text, photo, verified_buyer)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)
       RETURNING *`,
      [
        userId,
        userName.trim(),
        userEmail.trim().toLowerCase(),
        userCity,
        cleanFragrance,
        verifiedOrderNumber,
        numRating,
        text.trim(),
        photo || null,
      ]
    );

    const row = insertResult.rows[0];

    const formattedReview = {
      id: row.id,
      authorId: row.user_id,
      authorEmail: row.author_email,
      name: row.author_name,
      city: row.city || "India",
      fragrance: row.fragrance,
      orderNumber: row.order_number,
      rating: Number(row.rating) || 5,
      text: row.review_text,
      photo: row.photo || null,
      verifiedBuyer: Boolean(row.verified_buyer),
      isEdited: false,
      timestamp: new Date(row.created_at).getTime(),
      date: new Date(row.created_at).toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      }),
    };

    return res.status(201).json({ success: true, review: formattedReview });
  } catch (error) {
    console.error("Error creating review:", error);
    return res.status(500).json({ message: "Server error submitting review." });
  }
};

// @desc    Update own review
// @route   PUT /api/reviews/:id
// @access  Private (Author only)
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, text, photo, city, fragrance } = req.body;

    const findResult = await pool.query("SELECT * FROM reviews WHERE id = $1", [id]);
    if (findResult.rows.length === 0) {
      return res.status(404).json({ message: "Review not found." });
    }

    const review = findResult.rows[0];

    // Author authorization check
    const isOwner =
      review.user_id === req.user.id ||
      review.author_email?.toLowerCase() === req.user.email?.toLowerCase();

    if (!isOwner) {
      return res.status(403).json({ message: "You are not authorized to edit this review." });
    }

    const numRating = rating ? Number(rating) : review.rating;
    const updatedText = text !== undefined ? text.trim() : review.review_text;
    const updatedPhoto = photo !== undefined ? photo : review.photo;
    const updatedCity = city !== undefined ? city.trim() : review.city;
    const updatedFragrance =
      fragrance !== undefined ? (fragrance?.trim() || null) : review.fragrance;

    const updateResult = await pool.query(
      `UPDATE reviews
       SET rating = $1, review_text = $2, photo = $3, city = $4, fragrance = $5, is_edited = true, updated_at = NOW()
       WHERE id = $6
       RETURNING *`,
      [numRating, updatedText, updatedPhoto, updatedCity, updatedFragrance, id]
    );

    const row = updateResult.rows[0];

    const formattedReview = {
      id: row.id,
      authorId: row.user_id,
      authorEmail: row.author_email,
      name: row.author_name,
      city: row.city || "India",
      fragrance: row.fragrance,
      orderNumber: row.order_number,
      rating: Number(row.rating) || 5,
      text: row.review_text,
      photo: row.photo || null,
      verifiedBuyer: Boolean(row.verified_buyer),
      isEdited: true,
      timestamp: new Date(row.created_at).getTime(),
      date: new Date(row.created_at).toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      }),
    };

    return res.json({ success: true, review: formattedReview });
  } catch (error) {
    console.error("Error updating review:", error);
    return res.status(500).json({ message: "Server error updating review." });
  }
};

// @desc    Delete own review
// @route   DELETE /api/reviews/:id
// @access  Private (Author only)
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const findResult = await pool.query("SELECT * FROM reviews WHERE id = $1", [id]);
    if (findResult.rows.length === 0) {
      return res.status(404).json({ message: "Review not found." });
    }

    const review = findResult.rows[0];

    const isOwner =
      review.user_id === req.user.id ||
      review.author_email?.toLowerCase() === req.user.email?.toLowerCase();

    if (!isOwner) {
      return res.status(403).json({ message: "You are not authorized to delete this review." });
    }

    await pool.query("DELETE FROM reviews WHERE id = $1", [id]);

    return res.json({ success: true, message: "Review deleted successfully." });
  } catch (error) {
    console.error("Error deleting review:", error);
    return res.status(500).json({ message: "Server error deleting review." });
  }
};
