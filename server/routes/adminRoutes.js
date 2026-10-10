import express from "express";
import {
  getAdminStats,
  getAllOrders,
  updateOrderStatus,
  getAllCustomers,
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Require both authentication and admin authorization for all /api/admin routes
router.use(protect, adminOnly);

router.get("/stats", getAdminStats);
router.get("/orders", getAllOrders);
router.put("/orders/:id/status", updateOrderStatus);
router.get("/customers", getAllCustomers);

export default router;
