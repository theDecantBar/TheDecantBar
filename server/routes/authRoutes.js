import express from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  sendSignupOtp,
  verifySignupOtpAndRegister,
  sendForgotPasswordOtp,
  resetPasswordWithOtp,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { otpIpLimiter, authLimiter, checkEmailCooldown } from "../middleware/rateLimiter.js";

const router = express.Router();

// General Auth
router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);

// OTP Verification & Registration with Rate Limiting (60s cooldown, max 5 / 15m)
router.post("/send-signup-otp", otpIpLimiter, checkEmailCooldown, sendSignupOtp);
router.post("/verify-signup-otp", authLimiter, verifySignupOtpAndRegister);

// Forgot & Reset Password with OTP
router.post("/forgot-password-otp", otpIpLimiter, checkEmailCooldown, sendForgotPasswordOtp);
router.post("/reset-password-otp", authLimiter, resetPasswordWithOtp);

// User Profile (Protected)
router.get("/me", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

export default router;
