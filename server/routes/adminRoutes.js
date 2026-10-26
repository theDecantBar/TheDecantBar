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
  updateVariantStock,
  bulkUpdateAllStock,
  uploadProductImage,
} from "../controllers/adminController.js";
import { updateReview, deleteReview } from "../controllers/reviewController.js";
import { resendOrderConfirmation } from "../controllers/orderController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Enforce both authentication AND admin privileges across all admin routes
router.use(protect, adminOnly);

// Dashboard KPI stats
router.get("/stats", getAdminStats);

// Orders management
router.get("/orders", getAdminOrders);
router.put("/orders/:id/status", updateOrderStatus);
router.post("/orders/:id/resend-confirmation", resendOrderConfirmation);

// Image Upload
router.post("/upload-image", uploadProductImage);

// Fragrance Products & Decant Variants CRUD
router.get("/products", getAdminProducts);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

// Decant Variant Stock & Restock Operations
router.put("/variants/:id/stock", updateVariantStock);
router.post("/variants/bulk-stock", bulkUpdateAllStock);

// Review Moderation
router.get("/reviews", getAdminReviews);
router.put("/reviews/:id", updateReview);
router.delete("/reviews/:id", deleteReview);

export default router;
