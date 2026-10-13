import express from "express";
import {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET all reviews (public) & POST a review (authenticated)
router.route("/").get(getReviews).post(protect, createReview);

// PUT and DELETE review (author only)
router.route("/:id").put(protect, updateReview).delete(protect, deleteReview);

export default router;
