import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "thedecantbar_fallback_secret_key"
      );

      const result = await pool.query(
        "SELECT id, full_name, email, phone, address, city, state, pincode, is_admin, created_at FROM users WHERE id = $1",
        [decoded.id]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ message: "User not found or token invalid." });
      }

      const userData = result.rows[0];
      const adminEmails = (process.env.ADMIN_EMAILS || "")
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);

      const isConfiguredAdmin =
        Boolean(userData.is_admin) ||
        (userData.email && adminEmails.includes(userData.email.toLowerCase()));

      req.user = {
        ...userData,
        isAdmin: isConfiguredAdmin,
      };
      return next();
    } catch (error) {
      console.error("Auth middleware error:", error.message);
      return res.status(401).json({ message: "Not authorized, token invalid or expired." });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided." });
  }
};

// Require Administrator role
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next();
  }
  return res.status(403).json({
    message: "Access forbidden. Administrator privileges are required.",
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
        "SELECT id, full_name, email, phone, address, city, state, pincode FROM users WHERE id = $1",
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
