import express from "express";
import {
  createRazorpayOrder,
  verifyPaymentAndCreateOrder,
  createCodOrder,
  handlePlaceOrder,
  getMyOrders,
} from "../controllers/orderController.js";
import { protect, optionalAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-razorpay-order", optionalAuth, createRazorpayOrder);
router.post("/verify-payment", optionalAuth, verifyPaymentAndCreateOrder);
router.post("/cod", optionalAuth, createCodOrder);
router.post("/", optionalAuth, handlePlaceOrder);
router.get("/my-orders", protect, getMyOrders);

export default router;
