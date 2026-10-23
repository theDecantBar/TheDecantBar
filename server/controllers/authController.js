import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import pool from "../config/db.js";
import { isConfiguredAdminEmail } from "../config/adminConfig.js";

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Server configuration error: JWT_SECRET environment variable is missing.");
  }
  return jwt.sign(
    { id },
    secret,
    { expiresIn: "30d" }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Please provide all required fields." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existing = await pool.query(
      "SELECT id FROM users WHERE LOWER(email) = $1",
      [normalizedEmail]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "An account already exists with this email address. Please log in." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Check if this registered email is configured as an Administrator in .env
    const isConfiguredAdmin = isConfiguredAdminEmail(normalizedEmail);

    // Insert user
    const result = await pool.query(
      `INSERT INTO users (full_name, email, phone, password_hash, is_admin)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, full_name, email, phone, address, city, state, pincode, is_admin, created_at`,
      [fullName.trim(), normalizedEmail, phone ? phone.trim() : null, passwordHash, isConfiguredAdmin]
    );

    const user = result.rows[0];
    const token = generateToken(user.id);

    res.status(201).json({
      message: "Account created successfully.",
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
        isAdmin: Boolean(user.is_admin),
      },
      token,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Registration failed. Please try again later." });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password." });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const result = await pool.query(
      "SELECT * FROM users WHERE LOWER(email) = $1",
      [normalizedEmail]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No account found with this email. Please create an account." });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password. Please try again." });
    }

    // Auto-promote if email is configured in .env ADMIN_EMAILS / ADMIN_EMAIL
    let isAdmin = Boolean(user.is_admin);
    if (!isAdmin && isConfiguredAdminEmail(normalizedEmail)) {
      await pool.query("UPDATE users SET is_admin = true WHERE id = $1", [user.id]);
      isAdmin = true;
    }

    const token = generateToken(user.id);

    res.json({
      message: "Login successful.",
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
        isAdmin,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed. Please try again later." });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const isAdmin = Boolean(req.user.is_admin) || isConfiguredAdminEmail(req.user.email);

    res.json({
      user: {
        id: req.user.id,
        fullName: req.user.full_name,
        email: req.user.email,
        phone: req.user.phone,
        address: req.user.address,
        city: req.user.city,
        state: req.user.state,
        pincode: req.user.pincode,
        isAdmin,
        createdAt: req.user.created_at,
      },
    });
  } catch (error) {
    console.error("GetProfile error:", error);
    res.status(500).json({ message: "Failed to retrieve profile." });
  }
};

// @desc    Update user profile & delivery defaults
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { fullName, phone, address, city, state, pincode } = req.body;

    const result = await pool.query(
      `UPDATE users
       SET full_name = COALESCE($1, full_name),
           phone = COALESCE($2, phone),
           address = COALESCE($3, address),
           city = COALESCE($4, city),
           state = COALESCE($5, state),
           pincode = COALESCE($6, pincode),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING id, full_name, email, phone, address, city, state, pincode`,
      [fullName, phone, address, city, state, pincode, req.user.id]
    );

    const user = result.rows[0];

    res.json({
      message: "Profile updated successfully.",
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Failed to update profile." });
  }
};

// @desc    Change user password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Please provide current and new passwords." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters long." });
    }

    // Fetch user password hash
    const userQuery = await pool.query(
      "SELECT password_hash FROM users WHERE id = $1",
      [req.user.id]
    );

    const isMatch = await bcrypt.compare(
      currentPassword,
      userQuery.rows[0].password_hash
    );

    if (!isMatch) {
      return res.status(400).json({ message: "Current password does not match." });
    }

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);

    await pool.query(
      "UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
      [newHash, req.user.id]
    );

    res.json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Failed to update password." });
  }
};

// @desc    Send 6-digit OTP for Email Verification upon Signup
// @route   POST /api/auth/send-signup-otp
// @access  Public (Rate-limited: 5 requests / 15m, 60s cooldown)
export const sendSignupOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Check if an account already exists
    const existing = await pool.query(
      "SELECT id FROM users WHERE LOWER(email) = $1",
      [normalizedEmail]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        message: "An account already exists with this email address. Please log in.",
      });
    }

    // 2. Generate random 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Clear any existing pending signup OTPs for this email
    await pool.query(
      "DELETE FROM email_otps WHERE LOWER(email) = $1 AND purpose = 'signup'",
      [normalizedEmail]
    );

    // 4. Insert new OTP with 10-minute expiry
    await pool.query(
      `INSERT INTO email_otps (email, otp_code, purpose, expires_at)
       VALUES ($1, $2, 'signup', NOW() + INTERVAL '10 minutes')`,
      [normalizedEmail, otpCode]
    );

    console.log(`\n======================================================`);
    console.log(`🔑 [SIGNUP OTP FOR ${normalizedEmail}]: ${otpCode}`);
    console.log(`======================================================\n`);

    // 5. Send OTP Email via Resend
    let warning = null;
    let devOtp = null;
    try {
      if (process.env.RESEND_API_KEY && process.env.EMAIL_FROM) {
        const { sendEmail } = await import("../services/emailService.js");
        await sendEmail({
          to: normalizedEmail,
          subject: `${otpCode} is your The Decant Bar verification code`,
          html: `
            <div style="font-family: Arial, sans-serif; background: #11110f; color: #f4efe6; padding: 28px; border-radius: 8px; border: 1px solid rgba(198,161,91,0.3); max-width: 500px; margin: 0 auto;">
              <h2 style="color: #c6a15b; margin-top: 0; text-align: center; letter-spacing: 2px;">THE DECANT BAR</h2>
              <p style="text-align: center; color: #8e8a82; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Account Verification</p>
              <hr style="border: 0; border-top: 1px solid rgba(198,161,91,0.2); margin: 20px 0;" />
              <p>Welcome to The Decant Bar! Please use the 6-digit one-time code below to verify your email address and activate your account:</p>
              <div style="text-align: center; margin: 24px 0;">
                <span style="display: inline-block; background: #171715; border: 1px solid #c6a15b; padding: 14px 28px; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #f4efe6; border-radius: 4px;">
                  ${otpCode}
                </span>
              </div>
              <p style="font-size: 12px; color: #8e8a82; text-align: center;">
                This code is valid for <strong>10 minutes</strong>. Never share this code with anyone.
              </p>
            </div>
          `,
          text: `Your Decant Bar verification code is: ${otpCode}. Valid for 10 minutes.`,
        });
      }
    } catch (emailErr) {
      console.warn("Signup OTP email delivery warning:", emailErr.message);
      if (emailErr.message?.includes("only send testing emails") || emailErr.message?.includes("403")) {
        warning = "Resend Sandbox Restriction: Testing emails can only be delivered to your registered email (thedecantbarofficial@gmail.com). To send to all customers, connect your custom domain at resend.com/domains.";
        devOtp = otpCode;
      }
    }

    res.json({
      message: warning ? "Verification code generated." : "Verification code sent to your email address.",
      email: normalizedEmail,
      warning,
      devOtp,
    });
  } catch (error) {
    console.error("Send signup OTP error:", error);
    res.status(500).json({ message: "Failed to send verification code. Please try again." });
  }
};

// @desc    Verify OTP and complete user registration
// @route   POST /api/auth/verify-signup-otp
// @access  Public
export const verifySignupOtpAndRegister = async (req, res) => {
  try {
    const { fullName, email, password, phone, otpCode } = req.body;

    if (!fullName || !email || !password || !otpCode) {
      return res.status(400).json({ message: "Please provide all required fields." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const cleanOtp = String(otpCode).trim();

    // 1. Fetch latest pending OTP for this email
    const otpRes = await pool.query(
      `SELECT * FROM email_otps 
       WHERE LOWER(email) = $1 AND purpose = 'signup'
       ORDER BY created_at DESC 
       LIMIT 1`,
      [normalizedEmail]
    );

    if (otpRes.rows.length === 0) {
      return res.status(400).json({ message: "No verification code requested. Please request a new code." });
    }

    const otpRecord = otpRes.rows[0];

    // Check expiry
    if (new Date() > new Date(otpRecord.expires_at)) {
      await pool.query("DELETE FROM email_otps WHERE id = $1", [otpRecord.id]);
      return res.status(400).json({ message: "Verification code has expired. Please request a new code." });
    }

    // Check attempts limit (max 3)
    if (otpRecord.attempts >= 3) {
      await pool.query("DELETE FROM email_otps WHERE id = $1", [otpRecord.id]);
      return res.status(400).json({ message: "Too many incorrect attempts. Please request a new code." });
    }

    // Check code match
    if (otpRecord.otp_code !== cleanOtp) {
      await pool.query("UPDATE email_otps SET attempts = attempts + 1 WHERE id = $1", [otpRecord.id]);
      const remaining = 3 - (otpRecord.attempts + 1);
      return res.status(400).json({
        message: `Incorrect verification code. ${remaining > 0 ? `${remaining} attempt(s) remaining.` : "Please request a new code."}`,
      });
    }

    // OTP Verified! Clean up OTPs
    await pool.query("DELETE FROM email_otps WHERE LOWER(email) = $1", [normalizedEmail]);

    // Check if user exists already
    const existing = await pool.query(
      "SELECT id FROM users WHERE LOWER(email) = $1",
      [normalizedEmail]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "An account already exists with this email address. Please log in." });
    }

    // Hash password & Insert user
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const isConfiguredAdmin = isConfiguredAdminEmail(normalizedEmail);

    const result = await pool.query(
      `INSERT INTO users (full_name, email, phone, password_hash, is_admin)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, full_name, email, phone, address, city, state, pincode, is_admin, created_at`,
      [fullName.trim(), normalizedEmail, phone ? phone.trim() : null, passwordHash, isConfiguredAdmin]
    );

    const user = result.rows[0];
    const token = generateToken(user.id);

    res.status(201).json({
      message: "Account verified and registered successfully!",
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        phone: user.phone,
        isAdmin: Boolean(user.is_admin),
      },
      token,
    });
  } catch (error) {
    console.error("Verify signup OTP error:", error);
    res.status(500).json({ message: "Verification failed. Please try again later." });
  }
};

// @desc    Send 6-digit OTP for Forgot Password
// @route   POST /api/auth/forgot-password-otp
// @access  Public (Rate-limited: 5 requests / 15m, 60s cooldown)
export const sendForgotPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(normalizedEmail)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }

    // 1. Check if user exists (to prevent enumeration, return generic message if user doesn't exist)
    const userRes = await pool.query(
      "SELECT id, full_name FROM users WHERE LOWER(email) = $1",
      [normalizedEmail]
    );

    if (userRes.rows.length === 0) {
      // Return safe message without revealing account existence
      return res.json({
        message: "If an account is associated with this email, a verification code has been sent.",
        email: normalizedEmail,
      });
    }

    const userName = userRes.rows[0].full_name || "Valued Client";

    // 2. Generate cryptographically secure random 6-digit OTP
    const otpCode = crypto.randomInt(100000, 1000000).toString();

    // 3. Clear existing pending password OTPs for this email to prevent conflicting active codes
    await pool.query(
      "DELETE FROM email_otps WHERE LOWER(email) = $1 AND purpose = 'forgot_password'",
      [normalizedEmail]
    );

    // 4. Insert new OTP with 10-minute expiry
    await pool.query(
      `INSERT INTO email_otps (email, otp_code, purpose, expires_at)
       VALUES ($1, $2, 'forgot_password', NOW() + INTERVAL '10 minutes')`,
      [normalizedEmail, otpCode]
    );

    // 5. Send Password Reset Email via Resend - confirm delivery acceptance
    const { sendEmail } = await import("../services/emailService.js");
    try {
      await sendEmail({
        to: normalizedEmail,
        subject: `${otpCode} is your The Decant Bar password reset code`,
        html: `
          <div style="font-family: Arial, sans-serif; background: #11110f; color: #f4efe6; padding: 28px; border-radius: 8px; border: 1px solid rgba(198,161,91,0.3); max-width: 500px; margin: 0 auto;">
            <h2 style="color: #c6a15b; margin-top: 0; text-align: center; letter-spacing: 2px;">THE DECANT BAR</h2>
            <p style="text-align: center; color: #8e8a82; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Password Reset Request</p>
            <hr style="border: 0; border-top: 1px solid rgba(198,161,91,0.2); margin: 20px 0;" />
            <p>Hello ${userName},</p>
            <p>We received a request to reset your password. Use the 6-digit code below to set a new password:</p>
            <div style="text-align: center; margin: 24px 0;">
              <span style="display: inline-block; background: #171715; border: 1px solid #c6a15b; padding: 14px 28px; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #f4efe6; border-radius: 4px;">
                ${otpCode}
              </span>
            </div>
            <p style="font-size: 12px; color: #8e8a82; text-align: center;">
              This code is valid for <strong>10 minutes</strong>. If you did not request this, you can safely ignore this email.
            </p>
          </div>
        `,
        text: `Your Decant Bar password reset code is: ${otpCode}. Valid for 10 minutes.`,
      });
    } catch (emailErr) {
      // Invalidate the un-delivered OTP immediately
      await pool.query(
        "DELETE FROM email_otps WHERE LOWER(email) = $1 AND purpose = 'forgot_password'",
        [normalizedEmail]
      );

      // Log failure reason without exposing API keys, OTPs, or passwords
      console.error(
        `[Email Delivery Error] Failed to send password reset code to ${normalizedEmail}: ${emailErr.message}`
      );

      if (
        emailErr.message?.includes("only send testing emails") ||
        emailErr.message?.includes("not verified") ||
        emailErr.statusCode === 403
      ) {
        return res.status(502).json({
          message:
            "Unable to send the verification code. The email service is in testing mode and can only deliver to the verified domain owner (thedecantbarofficial@gmail.com). Please verify a custom domain in Resend to send to all customers.",
          error: "RESEND_DOMAIN_RESTRICTION",
        });
      }

      return res.status(502).json({
        message: "Unable to send the verification code. Please try again.",
      });
    }

    return res.status(200).json({
      message: "Verification code sent to your email address.",
      email: normalizedEmail,
    });
  } catch (error) {
    console.error("Send forgot password OTP error:", error);
    res.status(500).json({ message: "Unable to process password reset request. Please try again." });
  }
};

// @desc    Verify OTP and reset password
// @route   POST /api/auth/reset-password-otp
// @access  Public
export const resetPasswordWithOtp = async (req, res) => {
  try {
    const { email, otpCode, newPassword } = req.body;

    if (!email || !otpCode || !newPassword) {
      return res.status(400).json({ message: "Please provide email, verification code, and new password." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters long." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const cleanOtp = String(otpCode).trim();

    // 1. Fetch latest pending forgot_password OTP
    const otpRes = await pool.query(
      `SELECT * FROM email_otps 
       WHERE LOWER(email) = $1 AND purpose = 'forgot_password'
       ORDER BY created_at DESC 
       LIMIT 1`,
      [normalizedEmail]
    );

    if (otpRes.rows.length === 0) {
      return res.status(400).json({ message: "No active password reset request found. Please request a new code." });
    }

    const otpRecord = otpRes.rows[0];

    // Check expiry
    if (new Date() > new Date(otpRecord.expires_at)) {
      await pool.query("DELETE FROM email_otps WHERE id = $1", [otpRecord.id]);
      return res.status(400).json({ message: "Reset code has expired. Please request a new code." });
    }

    // Check attempts limit (max 3)
    if (otpRecord.attempts >= 3) {
      await pool.query("DELETE FROM email_otps WHERE id = $1", [otpRecord.id]);
      return res.status(400).json({ message: "Too many incorrect attempts. Please request a new reset code." });
    }

    // Check code match
    if (otpRecord.otp_code !== cleanOtp) {
      await pool.query("UPDATE email_otps SET attempts = attempts + 1 WHERE id = $1", [otpRecord.id]);
      const remaining = 3 - (otpRecord.attempts + 1);
      return res.status(400).json({
        message: `Incorrect verification code. ${remaining > 0 ? `${remaining} attempt(s) remaining.` : "Please request a new code."}`,
      });
    }

    // OTP Verified! Clean up OTPs
    await pool.query("DELETE FROM email_otps WHERE LOWER(email) = $1", [normalizedEmail]);

    // Hash new password and update user
    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);

    const updateRes = await pool.query(
      "UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE LOWER(email) = $2 RETURNING id",
      [newHash, normalizedEmail]
    );

    if (updateRes.rows.length === 0) {
      return res.status(404).json({ message: "User account not found." });
    }

    res.json({ message: "Password reset successfully. You can now log in with your new password." });
  } catch (error) {
    console.error("Reset password with OTP error:", error);
    res.status(500).json({ message: "Failed to reset password. Please try again." });
  }
};
