import express from "express";
import {
  getAdminStats,
  getAdminOrders,
  updateOrderStatus,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminReviews,
  deleteReview,
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Enforce both authentication AND admin privileges across all admin routes
router.use(protect, adminOnly);

// Dashboard KPI stats
router.get("/stats", getAdminStats);

// Orders management
router.get("/orders", getAdminOrders);
router.put("/orders/:id/status", updateOrderStatus);

// Fragrance Products & Decant Variants CRUD
router.get("/products", getAdminProducts);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

// Review Moderation
router.get("/reviews", getAdminReviews);
router.delete("/reviews/:id", deleteReview);

export default router;
