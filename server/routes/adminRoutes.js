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
  searchFragranceNoteImages,
  saveFragranceNoteImage,
  getCustomFragranceNotes,
} from "../controllers/adminController.js";
import { updateReview, deleteReview } from "../controllers/reviewController.js";
import { resendOrderConfirmation, checkAdminPayment } from "../controllers/orderController.js";
import { getAdminOffers, updateAdminOffers } from "../controllers/offersController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Enforce both authentication AND admin privileges across all admin routes
router.use(protect, adminOnly);

// Dashboard KPI stats
router.get("/stats", getAdminStats);

// Orders management
router.get("/orders", getAdminOrders);
router.post("/orders/:id/check-payment", checkAdminPayment);
router.put("/orders/:id/status", updateOrderStatus);
router.post("/orders/:id/resend-confirmation", resendOrderConfirmation);

// Image Upload
router.post("/upload-image", uploadProductImage);

// Fragrance Note Image Search & Shared Library
router.get("/notes/search-images", searchFragranceNoteImages);
router.post("/notes/save-image", saveFragranceNoteImage);
router.get("/notes", getCustomFragranceNotes);

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

// Store Offers & Top Banner Management
router.get("/offers", getAdminOffers);
router.put("/offers", updateAdminOffers);

export default router;
