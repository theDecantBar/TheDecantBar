console.log("PRODUCT REVIEW ROUTES LOADED");
import express from "express";
import rateLimit from "express-rate-limit";

import {
  getProductReviews,
  createProductReview,
  updateProductReview,
  deleteProductReview,
} from "../controllers/productReviewController.js";

import { protect, optionalAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

const writeLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many review changes. Please try again later." },
});

router.get("/:productId", optionalAuth, getProductReviews);
router.post("/:productId", protect, writeLimit, createProductReview);
router.put("/:reviewId", protect, writeLimit, updateProductReview);
router.delete("/:reviewId", protect, writeLimit, deleteProductReview);

console.log(
  "REGISTERED REVIEW ROUTES:",
  router.stack.map((layer) => layer.route?.path)
);

export default router;
