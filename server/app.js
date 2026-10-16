
import express from "express";
import cors from "cors";

import { sendEmail } from "./services/emailService.js";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "TheDecantBar API is running",
  });
});

app.post("/api/test-email", async (req, res) => {
  try {
    const result = await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: "The Decant Bar - Email Test",
      html: `
        <div style="background:#11110f;color:#f4efe6;padding:30px;font-family:Arial">
          <h1 style="color:#c6a15b">The Decant Bar</h1>
          <p>Your email integration is working!</p>
          <p>This is a test email from your Express backend.</p>
        </div>
      `,
      text: "The Decant Bar: Your email integration is working!",
    });

    res.json({
      success: true,
      message: "Email accepted by Resend",
      id: result?.id,
    });
  } catch (error) {
    console.error("Test email failed:", error.message);
    res.status(500).json({
      success: false,
      message: "Email test failed. Check your server logs and Resend configuration.",
    });
  }
});
export default app;
