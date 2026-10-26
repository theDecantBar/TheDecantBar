import express from "express";
import jwt from "jsonwebtoken";
import pool from "../../server/config/db.js";
import reviewRoutes from "../../server/routes/reviewRoutes.js";
import { updateReview, deleteReview } from "../../server/controllers/reviewController.js";
import { protect, adminOnly } from "../../server/middleware/authMiddleware.js";
import { makeDatabase, users } from "./reviewDatabase.mjs";
process.env.JWT_SECRET = "isolated-testimonial-preview-only-do-not-deploy";
process.env.ADMIN_EMAIL = ""; process.env.ADMIN_EMAILS = "";
export function makeApp(filename = null) {
 const db = makeDatabase(filename); pool.query = db.query;
 const app = express(); app.use(express.json({ limit: "2mb" }));
 app.post("/api/auth/login", (req,res) => {
  const user = users.find(user => user.email === req.body.email); if (!user) return res.status(401).json({ message: "Choose a preview account." });
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "2h" });
  res.json({ token, user: { id:user.id, fullName:user.full_name, email:user.email, isAdmin:user.is_admin } });
 });
 app.get("/api/auth/me", protect, (req,res) => res.json({ user: { id:req.user.id, fullName:req.user.full_name, email:req.user.email, isAdmin:req.user.is_admin } }));
 app.use("/api/reviews", reviewRoutes);
 app.put("/api/admin/reviews/:id", protect, adminOnly, updateReview);
 app.delete("/api/admin/reviews/:id", protect, adminOnly, deleteReview);
 app.get("/api/products", (req,res) => res.json([]));
 app.get("/api/orders/my-orders", protect, (req,res) => res.json([]));
 return { app, db };
}
