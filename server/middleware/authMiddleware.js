import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    const raw = req.headers.authorization.split(" ")[1];
    if (raw && raw !== "null" && raw !== "undefined") {
      token = raw;
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized. Please log in to continue." });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "thedecantbar_fallback_secret_key"
    );

    const result = await pool.query(
      "SELECT id, full_name, email, phone, address, city, state, pincode, is_admin, created_at FROM users WHERE id = $1",
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Not authorized. User account not found." });
    }

    req.user = result.rows[0];
    return next();
  } catch (error) {
    console.warn("Token verification failed:", error.message);
    return res.status(401).json({ message: "Not authorized. Session expired or invalid token." });
  }
};

// Admin-only authorization guard
export const adminOnly = (req, res, next) => {
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const isConfiguredAdmin =
    req.user &&
    req.user.email &&
    adminEmails.includes(req.user.email.toLowerCase());

  if ((req.user && Boolean(req.user.is_admin)) || isConfiguredAdmin) {
    return next();
  }
  return res.status(403).json({
    message: "Access forbidden. Administrator privileges required.",
  });
};

// Optional auth for endpoints like checkout where guest or logged-in users both can place orders
export const optionalAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "thedecantbar_fallback_secret_key"
      );
      const result = await pool.query(
        "SELECT id, full_name, email, phone, address, city, state, pincode, is_admin FROM users WHERE id = $1",
        [decoded.id]
      );
      if (result.rows.length > 0) {
        req.user = result.rows[0];
      }
    } catch {
      // Token expired or invalid, proceed as guest
      req.user = null;
    }
  }
  next();
};

