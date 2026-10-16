import rateLimit from "express-rate-limit";
import pool from "../config/db.js";

/**
 * Strict IP-level rate limiter for sending OTPs
 * Allows max 5 OTP requests per IP every 15 minutes
 */
export const otpIpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests from this device. Please wait 15 minutes before requesting another code.",
  },
});

/**
 * General authentication rate limiter (login / signup attempts)
 * Allows max 10 attempts per IP every 15 minutes
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many authentication attempts. Please try again after 15 minutes.",
  },
});

/**
 * Email-level 60-second cooldown check
 * Ensures no single email address can receive an OTP more than once per minute
 */
export const checkEmailCooldown = async (req, res, next) => {
  try {
    const email = req.body.email ? String(req.body.email).trim().toLowerCase() : null;

    if (!email) {
      return res.status(400).json({ message: "Email address is required." });
    }

    const recentResult = await pool.query(
      `SELECT created_at, 
              EXTRACT(EPOCH FROM (NOW() - created_at)) as seconds_elapsed
       FROM email_otps
       WHERE LOWER(email) = $1
       ORDER BY created_at DESC
       LIMIT 1`,
      [email]
    );

    if (recentResult.rows.length > 0) {
      const secondsElapsed = Math.floor(Number(recentResult.rows[0].seconds_elapsed));
      if (secondsElapsed < 30) {
        const remainingSeconds = 30 - secondsElapsed;
        return res.status(429).json({
          message: `Please wait ${remainingSeconds} seconds before requesting a new code.`,
          retryAfter: remainingSeconds,
        });
      }
    }

    next();
  } catch (error) {
    console.error("Email cooldown check error:", error);
    next(); // Fall through if non-critical error so user is not blocked
  }
};
