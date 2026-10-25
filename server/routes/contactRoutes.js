import express from "express";
import { submitContactEnquiry } from "../controllers/contactController.js";
import rateLimit from "express-rate-limit";

// Rate limiter: Max 5 enquiries per IP per 15 minutes to prevent spam abuse
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many messages sent from this device. Please wait a few minutes before submitting another enquiry.",
  },
});

const router = express.Router();

router.post("/", contactLimiter, submitContactEnquiry);

export default router;

