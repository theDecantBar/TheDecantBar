import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import { isConfiguredAdminEmail } from "../config/adminConfig.js";

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

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("Critical Security Error: JWT_SECRET environment variable is missing.");
    return res.status(500).json({ message: "Server authentication configuration error." });
  }

  try {
    const decoded = jwt.verify(token, secret);

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
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized. Please log in to continue." });
  }

  const isAdmin = Boolean(req.user.is_admin) || isConfiguredAdminEmail(req.user.email);

  if (isAdmin) {
    return next();
  }

  return res.status(403).json({
    message: "Access forbidden. Administrator privileges required.",
  });
};

// Optional auth for endpoints where guest or logged-in users both can proceed
export const optionalAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.warn("JWT_SECRET missing during optionalAuth; proceeding as guest.");
      req.user = null;
      return next();
    }

    try {
      const raw = req.headers.authorization.split(" ")[1];
      if (raw && raw !== "null" && raw !== "undefined") {
        const decoded = jwt.verify(raw, secret);
        const result = await pool.query(
          "SELECT id, full_name, email, phone, address, city, state, pincode, is_admin FROM users WHERE id = $1",
          [decoded.id]
        );
        if (result.rows.length > 0) {
          req.user = result.rows[0];
        }
      }
    } catch {
      // Token expired or invalid, proceed as guest
      req.user = null;
    }
  }
  next();
};
