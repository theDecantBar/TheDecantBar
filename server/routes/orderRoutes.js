import express from "express";
import {
  createRazorpayOrder,
  verifyPaymentAndCreateOrder,
  createCodOrder,
  handlePlaceOrder,
  getMyOrders,
  getOrderById,
  resendOrderConfirmation,
} from "../controllers/orderController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-razorpay-order", protect, createRazorpayOrder);
router.post("/verify-payment", protect, verifyPaymentAndCreateOrder);
router.post("/cod", protect, createCodOrder);
router.post("/", protect, handlePlaceOrder);
router.get("/my-orders", protect, getMyOrders);
router.post("/:id/resend-confirmation", protect, adminOnly, resendOrderConfirmation);
router.get("/:id", protect, getOrderById);

export default router;
