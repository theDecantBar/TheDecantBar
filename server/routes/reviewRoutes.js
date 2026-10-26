import express from "express";
import rateLimit from "express-rate-limit";
import { getReviews, getManageableReviews, getReviewPhoto, createReview, updateReview, deleteReview } from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();
const writeLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: true, legacyHeaders: false,
  message: { message: "Too many review changes. Please try again later." } });
router.get("/", getReviews);
router.get("/manageable", protect, getManageableReviews);
router.get("/:id/photo", getReviewPhoto);
router.post("/", protect, writeLimit, createReview);
router.put("/:id", protect, writeLimit, updateReview);
router.delete("/:id", protect, writeLimit, deleteReview);
export default router;
