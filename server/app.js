import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import express from "express";
import cors from "cors";

import { sendEmail } from "./services/emailService.js";
import { protect, adminOnly } from "./middleware/authMiddleware.js";
import { getPrimaryAdminEmail } from "./config/adminConfig.js";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import { ensureAdminSchema } from "./scripts/initAdminDb.js";

const app = express();

// Verify and initialize necessary admin schema columns
ensureAdminSchema();

// Production-ready CORS policy
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL,
  "https://thedecantbar.com",
  "https://www.thedecantbar.com",
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests or same-origin requests where origin is undefined
    if (!origin) return callback(null, true);

    const isExplicitMatch = allowedOrigins.includes(origin);
    const isVercelPreview = /^https:\/\/[\w-]+\.vercel\.app$/.test(origin);
    const isLocalDev =
      process.env.NODE_ENV !== "production" &&
      /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

    if (isExplicitMatch || isVercelPreview || isLocalDev) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy blocked access from origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.static(path.resolve(__dirname, "../public")));

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "TheDecantBar API is running",
  });
});

// Protected diagnostic test-email endpoint (Requires authenticated Administrator)
app.post("/api/test-email", protect, adminOnly, async (req, res) => {
  try {
    const recipient = req.body?.to || getPrimaryAdminEmail();
    const result = await sendEmail({
      to: recipient,
      subject: "The Decant Bar - Admin Email Test",
      html: `
        <div style="background:#11110f;color:#f4efe6;padding:30px;font-family:Arial">
          <h1 style="color:#c6a15b">The Decant Bar</h1>
          <p>Your email integration is working!</p>
          <p>This is an authenticated diagnostic test email dispatched by an authorized administrator.</p>
        </div>
      `,
      text: "The Decant Bar: Your email integration is working!",
    });

    res.json({
      success: true,
      message: `Email accepted by Resend for ${recipient}`,
      id: result?.id,
    });
  } catch (error) {
    console.error("Test email failed:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Email test failed. Check your server logs and Resend configuration.",
    });
  }
});

// 404 handler for unknown API routes - ensures JSON response instead of HTML
app.use("/api", (req, res) => {
  res.status(404).json({
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler for API (Express requires 4 arguments to recognize error middleware)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("Express unhandled error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

export default app;
