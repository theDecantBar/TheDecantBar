import { sendEmail } from "../services/emailService.js";
import { getPrimaryAdminEmail, getAdminEmails } from "../config/adminConfig.js";
import pool from "../config/db.js";

/**
 * Escapes characters for safe HTML rendering to prevent HTML injection in emails.
 */
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Ensures the contact_enquiries table exists in Postgres
 */
let tableChecked = false;
async function ensureEnquiriesTable() {
  if (tableChecked) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact_enquiries (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255),
        order_number VARCHAR(100),
        message TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    tableChecked = true;
  } catch (err) {
    // Non-fatal, fallback to direct email dispatch
    console.warn("Could not verify contact_enquiries table:", err.message);
  }
}

/**
 * @desc    Handle customer contact enquiry submission
 * @route   POST /api/contact
 * @access  Public
 */
export const submitContactEnquiry = async (req, res) => {
  try {
    const { name, email, subject, orderNumber, message } = req.body;

    // 1. Validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({
        message: "Please provide a valid name (at least 2 characters).",
      });
    }

    if (!email || typeof email !== "string") {
      return res.status(400).json({
        message: "Please provide a valid email address.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanEmail = email.trim().toLowerCase();
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        message: "Please provide a valid email format (e.g. name@example.com).",
      });
    }

    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return res.status(400).json({
        message: "Please provide a descriptive message (at least 10 characters).",
      });
    }

    const cleanName = name.trim().slice(0, 100);
    const cleanSubject = (subject && typeof subject === "string" ? subject.trim() : "General Enquiry").slice(0, 150);
    const cleanOrderNumber = orderNumber && typeof orderNumber === "string" ? orderNumber.trim().slice(0, 50) : "";
    const cleanMessage = message.trim().slice(0, 3000);

    // 2. Persist in database for durability (optional fail-safe)
    await ensureEnquiriesTable();
    try {
      await pool.query(
        `INSERT INTO contact_enquiries (name, email, subject, order_number, message)
         VALUES ($1, $2, $3, $4, $5)`,
        [cleanName, cleanEmail, cleanSubject, cleanOrderNumber || null, cleanMessage]
      );
    } catch (dbErr) {
      console.warn("Warning: Failed to save enquiry to database, proceeding with email dispatch:", dbErr.message);
    }

    // 3. Resolve Admin recipient(s)
    const adminRecipient = getPrimaryAdminEmail();
    const allAdminEmails = getAdminEmails();
    const recipientToUse = allAdminEmails.length > 0 ? allAdminEmails : adminRecipient;

    // 4. Construct luxury formatted HTML and plain text emails
    const submittedAt = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });

    const emailSubject = `New Contact Enquiry — The Decant Bar: ${cleanSubject} [from ${cleanName}]`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(emailSubject)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #11110f; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #f4efe6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #11110f; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 620px; background-color: #171715; border: 1px solid rgba(198, 161, 91, 0.4); border-radius: 8px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);">
          
          <!-- Gold Accent Bar -->
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, #c6a15b, #d8c08a, #c6a15b);"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding: 32px 36px 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
              <div style="font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.25em; color: #c6a15b; margin-bottom: 6px;">
                ✦ The Decant Bar · Concierge Desk ✦
              </div>
              <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #f4efe6; letter-spacing: -0.02em;">
                New Customer Contact Enquiry
              </h1>
              <div style="font-size: 12px; color: #8e8a82; margin-top: 6px;">
                Submitted on ${submittedAt} (IST)
              </div>
            </td>
          </tr>

          <!-- Sender Details Grid -->
          <tr>
            <td style="padding: 24px 36px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                <tr>
                  <td width="30%" style="padding: 8px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #8e8a82; vertical-align: top;">
                    Customer Name:
                  </td>
                  <td style="padding: 8px 0; font-size: 14px; font-weight: 600; color: #f4efe6;">
                    ${escapeHtml(cleanName)}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #8e8a82; vertical-align: top;">
                    Customer Email:
                  </td>
                  <td style="padding: 8px 0; font-size: 14px; color: #c6a15b;">
                    <a href="mailto:${escapeHtml(cleanEmail)}" style="color: #c6a15b; text-decoration: underline;">
                      ${escapeHtml(cleanEmail)}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #8e8a82; vertical-align: top;">
                    Enquiry Subject:
                  </td>
                  <td style="padding: 8px 0; font-size: 13px; font-weight: 500; color: #f4efe6;">
                    ${escapeHtml(cleanSubject)}
                  </td>
                </tr>
                ${
                  cleanOrderNumber
                    ? `<tr>
                  <td style="padding: 8px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #8e8a82; vertical-align: top;">
                    Order Reference:
                  </td>
                  <td style="padding: 8px 0; font-size: 13px; font-weight: 600; color: #f4efe6;">
                    ${escapeHtml(cleanOrderNumber)}
                  </td>
                </tr>`
                    : ""
                }
              </table>
            </td>
          </tr>

          <!-- Message Body Block -->
          <tr>
            <td style="padding: 0 36px 30px;">
              <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; color: #8e8a82; margin-bottom: 8px;">
                Message Content:
              </div>
              <div style="background-color: #11110f; border: 1px solid rgba(255, 255, 255, 0.1); border-left: 3px solid #c6a15b; padding: 18px 20px; font-size: 13px; line-height: 1.65; color: #e5e1d8; white-space: pre-wrap; word-break: break-word;">
${escapeHtml(cleanMessage)}
              </div>

              <!-- Quick Reply Action Button -->
              <div style="margin-top: 24px; text-align: left;">
                <a href="mailto:${escapeHtml(cleanEmail)}?subject=${encodeURIComponent(`Re: [The Decant Bar] ${cleanSubject}`)}" 
                   style="display: inline-block; background-color: #c6a15b; color: #11110f; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.18em; text-decoration: none; padding: 12px 24px; border-radius: 2px;">
                  Reply Directly to ${escapeHtml(cleanName)}
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #11110f; padding: 20px 36px; border-top: 1px solid rgba(255, 255, 255, 0.08); text-align: center; font-size: 11px; color: #8e8a82;">
              The Decant Bar Notification System · Direct reply is routed to the customer's verified email.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const textContent = `
========================================
THE DECANT BAR — NEW CONTACT ENQUIRY
========================================

Submitted: ${submittedAt} (IST)
Customer Name: ${cleanName}
Customer Email: ${cleanEmail}
Subject: ${cleanSubject}
${cleanOrderNumber ? `Order Reference: ${cleanOrderNumber}\n` : ""}
Message:
----------------------------------------
${cleanMessage}
----------------------------------------

To reply, email: ${cleanEmail}
    `.trim();

    // 5. Dispatch email via Resend
    const resendResult = await sendEmail({
      to: recipientToUse,
      subject: emailSubject,
      html: htmlContent,
      text: textContent,
      replyTo: cleanEmail,
    });

    console.log(`[Contact] Enquiry from ${cleanEmail} successfully dispatched via Resend. ID: ${resendResult?.id}`);

    res.status(200).json({
      success: true,
      message: "Your message has been received. Our team will review it and follow up promptly.",
      enquiryId: resendResult?.id,
    });
  } catch (error) {
    // Safe logging without exposing secrets
    console.error("[Contact] Error delivering enquiry email:", error.message || error);

    res.status(500).json({
      message: "We were unable to deliver your message due to a temporary service issue. Please try again or email us directly at thedecantbarofficial@gmail.com.",
    });
  }
};

