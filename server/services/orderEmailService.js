import pool from "../config/db.js";
import { getPrimaryAdminEmail } from "../config/adminConfig.js";
import { sendEmail } from "./emailService.js";

/**
 * Escapes HTML characters in user-provided inputs to prevent injection in emails.
 */
export function escapeHtml(unsafe) {
  if (unsafe === null || unsafe === undefined) return "";
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Formats a currency amount into standard Indian Rupee notation (₹X,XXX).
 */
export function formatPrice(amount) {
  const num = Number(amount) || 0;
  return (
    "₹" +
    num.toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })
  );
}

/**
 * Formats a timestamp into an Indian Standard Time (IST) readable string.
 */
export function formatOrderDate(dateVal) {
  try {
    const d = dateVal ? new Date(dateVal) : new Date();
    return (
      new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(d) + " IST"
    );
  } catch {
    return new Date().toLocaleDateString("en-IN");
  }
}

/**
 * Validates basic email formatting.
 */
export function isValidEmail(email) {
  if (!email || typeof email !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Generates high-end luxury HTML template for customer order confirmation.
 */
export function generateCustomerOrderEmailHtml({ order, items }) {
  const frontendUrl =
    process.env.FRONTEND_URL ||
    process.env.CLIENT_URL ||
    "https://thedecantbar.com";

  const customerName = escapeHtml(order.customer_name || "Valued Customer");
  const orderNumber = escapeHtml(order.order_number || "");
  const orderDate = formatOrderDate(order.created_at);
  const formattedAddress = [
    order.shipping_address,
    order.city,
    order.state ? `${order.state} - ${order.pincode}` : order.pincode,
  ]
    .filter(Boolean)
    .map(escapeHtml)
    .join("<br />");

  const isCod =
    (order.payment_method || "").toLowerCase().includes("cod") ||
    (order.payment_method || "").toLowerCase().includes("cash");

  const paymentMethodLabel = isCod ? "Cash on Delivery (COD)" : "Online Payment (Razorpay)";
  const paymentStatusLabel = isCod ? "Due upon Delivery" : (order.payment_status || "Paid");
  const paymentStatusColor = isCod ? "#e5c07b" : "#4ade80";

  const subtotalFormatted = formatPrice(order.subtotal);
  const shippingFeeNum = Number(order.shipping_fee) || 0;
  const shippingFormatted = shippingFeeNum === 0 ? "FREE" : formatPrice(shippingFeeNum);
  const totalFormatted = formatPrice(order.total_amount);

  const itemsRowsHtml = (items || [])
    .map((item) => {
      const name = escapeHtml(item.product_name || item.name || "Luxury Fragrance");
      const size = escapeHtml(String(item.size_ml || 5));
      const qty = parseInt(item.quantity, 10) || 1;
      const unitPrice = formatPrice(item.price);
      const lineTotal = formatPrice((Number(item.price) || 0) * qty);

      return `
        <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.08);">
          <td style="padding: 16px 12px; vertical-align: top;">
            <div style="font-weight: 600; color: #f4efe6; font-size: 14px; margin-bottom: 4px;">${name}</div>
            <div style="font-size: 12px; color: #c6a15b; letter-spacing: 0.05em; text-transform: uppercase;">Decant Size: ${size}ml</div>
          </td>
          <td style="padding: 16px 8px; vertical-align: top; text-align: center; color: #f4efe6; font-size: 14px;">
            ${qty}
          </td>
          <td style="padding: 16px 8px; vertical-align: top; text-align: right; color: #a39e93; font-size: 13px;">
            ${unitPrice}
          </td>
          <td style="padding: 16px 12px; vertical-align: top; text-align: right; font-weight: 600; color: #f4efe6; font-size: 14px;">
            ${lineTotal}
          </td>
        </tr>
      `;
    })
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - The Decant Bar</title>
</head>
<body style="margin: 0; padding: 0; background-color: #080807; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f4efe6; line-height: 1.6;">
  <div style="background-color: #080807; padding: 32px 16px;">
    <table role="presentation" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; margin: 0 auto; background-color: #121210; border-radius: 12px; border: 1px solid rgba(198, 161, 91, 0.28); overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);">
      
      <!-- Luxury Gold Header Bar -->
      <tr>
        <td style="background: linear-gradient(90deg, #997531 0%, #d4af37 50%, #997531 100%); height: 4px; line-height: 4px; font-size: 0;">&nbsp;</td>
      </tr>

      <!-- Brand Logo / Wordmark -->
      <tr>
        <td style="padding: 36px 32px 24px; text-align: center;">
          <h1 style="margin: 0; font-family: 'Cinzel', Georgia, 'Times New Roman', serif; font-size: 24px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #d4af37;">
            THE DECANT BAR
          </h1>
          <p style="margin: 6px 0 0; font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; color: #8e8a82;">
            Authentic Handcrafted Fragrance Decants
          </p>
        </td>
      </tr>

      <!-- Order Confirmed Status Card -->
      <tr>
        <td style="padding: 0 32px 28px;">
          <div style="background: linear-gradient(180deg, rgba(198, 161, 91, 0.12) 0%, rgba(198, 161, 91, 0.04) 100%); border: 1px solid rgba(198, 161, 91, 0.35); border-radius: 8px; padding: 22px; text-align: center;">
            <div style="display: inline-block; background-color: rgba(198, 161, 91, 0.2); color: #d4af37; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 10px;">
              ✓ ORDER CONFIRMED
            </div>
            <div style="font-size: 13px; color: #a39e93; margin-bottom: 4px;">Order Reference</div>
            <div style="font-family: 'Courier New', Courier, monospace; font-size: 22px; font-weight: bold; color: #d4af37; letter-spacing: 0.08em; margin-bottom: 6px;">
              ${orderNumber}
            </div>
            <div style="font-size: 12px; color: #8e8a82;">
              Placed on ${orderDate}
            </div>
          </div>
        </td>
      </tr>

      <!-- Salutation -->
      <tr>
        <td style="padding: 0 32px 24px; color: #dcd7cc; font-size: 14px; line-height: 1.7;">
          <p style="margin: 0 0 12px; font-size: 16px; color: #f4efe6;">Dear <strong>${customerName}</strong>,</p>
          <p style="margin: 0;">
            Thank you for ordering with <strong>The Decant Bar</strong>. Your authentic fragrance decants are now being hand-poured into sterile, high-grade glass atomizers and prepared for express dispatch.
          </p>
        </td>
      </tr>

      <!-- Ordered Items Table -->
      <tr>
        <td style="padding: 0 32px;">
          <div style="font-family: 'Cinzel', Georgia, serif; font-size: 14px; font-weight: 600; color: #c6a15b; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 12px; border-bottom: 1px solid rgba(198, 161, 91, 0.25); padding-bottom: 6px;">
            Order Summary
          </div>
          <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="border-bottom: 1px solid rgba(198, 161, 91, 0.3); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #8e8a82;">
                <th style="padding: 8px 12px; text-align: left;">Item</th>
                <th style="padding: 8px 8px; text-align: center;">Qty</th>
                <th style="padding: 8px 8px; text-align: right;">Price</th>
                <th style="padding: 8px 12px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRowsHtml}
            </tbody>
          </table>
        </td>
      </tr>

      <!-- Financial Breakdown -->
      <tr>
        <td style="padding: 0 32px 28px;">
          <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse; background-color: #171715; border-radius: 8px; padding: 16px;">
            <tr>
              <td style="padding: 12px 16px 6px; color: #a39e93; font-size: 13px;">Subtotal</td>
              <td style="padding: 12px 16px 6px; text-align: right; color: #f4efe6; font-size: 14px;">${subtotalFormatted}</td>
            </tr>
            <tr>
              <td style="padding: 6px 16px; color: #a39e93; font-size: 13px;">Shipping &amp; Handling</td>
              <td style="padding: 6px 16px; text-align: right; color: #c6a15b; font-size: 13px; font-weight: 600;">${shippingFormatted}</td>
            </tr>
            <tr style="border-top: 1px solid rgba(255, 255, 255, 0.1);">
              <td style="padding: 12px 16px; font-weight: 700; color: #f4efe6; font-size: 15px;">Final Total</td>
              <td style="padding: 12px 16px; text-align: right; font-weight: 700; color: #d4af37; font-size: 18px;">${totalFormatted}</td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Two-Column Payment & Shipping Info -->
      <tr>
        <td style="padding: 0 32px 28px;">
          <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse;">
            <tr>
              <!-- Payment Details -->
              <td style="width: 48%; vertical-align: top; background-color: #171715; border-radius: 8px; padding: 16px; border: 1px solid rgba(255, 255, 255, 0.05);">
                <div style="font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #c6a15b; font-weight: 600; margin-bottom: 8px;">
                  Payment Information
                </div>
                <div style="font-size: 13px; color: #f4efe6; margin-bottom: 4px;">
                  <strong>Method:</strong> ${paymentMethodLabel}
                </div>
                <div style="font-size: 13px; color: #a39e93;">
                  <strong>Status:</strong> <span style="color: ${paymentStatusColor}; font-weight: 600;">${paymentStatusLabel}</span>
                </div>
                ${
                  isCod
                    ? '<div style="font-size: 11px; color: #e5c07b; margin-top: 6px;">Please keep exact cash or UPI ready for delivery.</div>'
                    : '<div style="font-size: 11px; color: #4ade80; margin-top: 6px;">Payment verified securely via Razorpay.</div>'
                }
              </td>
              
              <td style="width: 4%;"></td>

              <!-- Shipping Details -->
              <td style="width: 48%; vertical-align: top; background-color: #171715; border-radius: 8px; padding: 16px; border: 1px solid rgba(255, 255, 255, 0.05);">
                <div style="font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #c6a15b; font-weight: 600; margin-bottom: 8px;">
                  Delivery Address
                </div>
                <div style="font-size: 13px; font-weight: 600; color: #f4efe6; margin-bottom: 4px;">
                  ${customerName}
                </div>
                <div style="font-size: 12px; color: #a39e93; line-height: 1.5;">
                  ${formattedAddress}
                </div>
                <div style="font-size: 11px; color: #8e8a82; margin-top: 6px;">
                  Phone: ${escapeHtml(order.customer_phone || "")}
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Estimated Dispatch & Delivery Note -->
      <tr>
        <td style="padding: 0 32px 28px;">
          <div style="background-color: rgba(198, 161, 91, 0.08); border-left: 3px solid #c6a15b; border-radius: 4px; padding: 14px 18px; font-size: 12px; color: #dcd7cc; line-height: 1.6;">
            <strong>Estimated Delivery:</strong> 3 to 5 business days.<br />
            Once your package is dispatched, we will send tracking details so you can monitor your parcel every step of the way.
          </div>
        </td>
      </tr>

      <!-- Account & Order Tracking CTA Button -->
      <tr>
        <td style="padding: 0 32px 36px; text-align: center;">
          <a href="${frontendUrl}/account" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #d4af37 0%, #aa8022 100%); color: #000000; font-weight: 700; font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase; text-decoration: none; padding: 14px 32px; border-radius: 6px; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.25);">
            View Order In Account
          </a>
        </td>
      </tr>

      <!-- Authenticity Guarantee -->
      <tr>
        <td style="padding: 24px 32px; background-color: #0d0d0b; border-top: 1px solid rgba(198, 161, 91, 0.2); text-align: center;">
          <div style="font-size: 12px; font-weight: 600; color: #c6a15b; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 6px;">
            100% Authentic Guaranteed
          </div>
          <p style="margin: 0; font-size: 11px; color: #8e8a82; line-height: 1.6;">
            Every fragrance decant is hand-decanted directly from authentic retail bottles. We never compromise on authenticity, batch preservation, or sterile packaging.
          </p>
        </td>
      </tr>

      <!-- Footer Contact -->
      <tr>
        <td style="padding: 24px 32px; background-color: #080807; text-align: center; font-size: 11px; color: #6d6961; line-height: 1.7;">
          <p style="margin: 0 0 8px;">
            Need help with your order? Reach our concierge team directly at 
            <a href="mailto:thedecantbarofficial@gmail.com" style="color: #c6a15b; text-decoration: none;">thedecantbarofficial@gmail.com</a>
            or DM us on Instagram <a href="https://instagram.com/thedecantbar" style="color: #c6a15b; text-decoration: none;">@thedecantbar</a>.
          </p>
          <p style="margin: 0;">
            &copy; ${new Date().getFullYear()} The Decant Bar. All rights reserved.
          </p>
        </td>
      </tr>

    </table>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Generates plain-text fallback for customer order confirmation.
 */
export function generateCustomerOrderEmailText({ order, items }) {
  const customerName = order.customer_name || "Valued Customer";
  const orderNumber = order.order_number || "";
  const orderDate = formatOrderDate(order.created_at);
  const isCod =
    (order.payment_method || "").toLowerCase().includes("cod") ||
    (order.payment_method || "").toLowerCase().includes("cash");
  const paymentMethodLabel = isCod ? "Cash on Delivery (COD)" : "Online Payment (Razorpay)";

  const itemsList = (items || [])
    .map(
      (item) =>
        `- ${item.product_name || item.name} (${item.size_ml}ml) x ${item.quantity} = ₹${
          (Number(item.price) || 0) * (parseInt(item.quantity, 10) || 1)
        }`
    )
    .join("\n");

  const shippingText = Number(order.shipping_fee) === 0 ? "FREE" : `₹${order.shipping_fee}`;

  return `
THE DECANT BAR
AUTHENTIC HANDCRAFTED FRAGRANCE DECANTS
==================================================

ORDER CONFIRMED: ${orderNumber}
Placed on: ${orderDate}

Dear ${customerName},

Thank you for your order with The Decant Bar! Your authentic fragrance decants are being hand-poured into glass atomizers and prepared for dispatch.

ORDER SUMMARY:
${itemsList}

Subtotal: ₹${order.subtotal}
Shipping: ${shippingText}
Total: ₹${order.total_amount}

PAYMENT DETAILS:
Method: ${paymentMethodLabel}
Status: ${isCod ? "Due on delivery" : (order.payment_status || "Paid")}

SHIPPING ADDRESS:
${customerName}
${order.shipping_address}
${order.city}, ${order.state} - ${order.pincode}
Phone: ${order.customer_phone}

ESTIMATED DELIVERY:
3 to 5 business days.

Questions regarding your order? Reply directly to this email or reach us at thedecantbarofficial@gmail.com.

Thank you,
The Decant Bar Concierge Team
https://thedecantbar.com
`.trim();
}

/**
 * Generates HTML notification for store owner when an order is placed.
 */
export function generateOwnerOrderAlertHtml({ order, items }) {
  const customerName = escapeHtml(order.customer_name || "");
  const orderNumber = escapeHtml(order.order_number || "");
  const orderDate = formatOrderDate(order.created_at);
  const formattedAddress = [
    order.shipping_address,
    order.city,
    order.state ? `${order.state} - ${order.pincode}` : order.pincode,
  ]
    .filter(Boolean)
    .map(escapeHtml)
    .join(", ");

  const isCod =
    (order.payment_method || "").toLowerCase().includes("cod") ||
    (order.payment_method || "").toLowerCase().includes("cash");

  const itemsRows = (items || [])
    .map((item) => {
      const name = escapeHtml(item.product_name || item.name || "");
      const size = escapeHtml(String(item.size_ml || 5));
      const qty = parseInt(item.quantity, 10) || 1;
      const total = formatPrice((Number(item.price) || 0) * qty);

      return `
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
          <td style="padding: 10px 8px; color: #f4efe6;">${name}</td>
          <td style="padding: 10px 8px; color: #c6a15b; text-align: center;">${size}ml</td>
          <td style="padding: 10px 8px; color: #f4efe6; text-align: center;">${qty}</td>
          <td style="padding: 10px 8px; color: #f4efe6; text-align: right;">${total}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; background: #0e0e0c; color: #f4efe6; padding: 24px; border-radius: 8px; border: 1px solid rgba(198,161,91,0.35); max-width: 600px; margin: 0 auto;">
      <h2 style="color: #c6a15b; margin-top: 0; font-size: 20px;">The Decant Bar · New ${isCod ? "COD" : "Paid"} Order Received</h2>
      <p style="color: #a39e93; font-size: 13px; margin-bottom: 18px;">A new order has been confirmed on the store:</p>
      
      <div style="background: #171715; border-left: 4px solid #c6a15b; padding: 14px 18px; margin: 16px 0; border-radius: 0 6px 6px 0;">
        <p style="margin: 4px 0;"><strong>Order Number:</strong> <span style="color: #c6a15b; font-family: monospace; font-size: 15px;">${orderNumber}</span></p>
        <p style="margin: 4px 0;"><strong>Date:</strong> ${orderDate}</p>
        <p style="margin: 4px 0;"><strong>Customer Name:</strong> ${customerName}</p>
        <p style="margin: 4px 0;"><strong>Customer Email:</strong> <a href="mailto:${escapeHtml(order.customer_email)}" style="color: #c6a15b;">${escapeHtml(order.customer_email)}</a></p>
        <p style="margin: 4px 0;"><strong>Customer Phone:</strong> <a href="tel:${escapeHtml(order.customer_phone)}" style="color: #c6a15b;">${escapeHtml(order.customer_phone)}</a></p>
        <p style="margin: 4px 0;"><strong>Shipping Address:</strong> ${formattedAddress}</p>
        <p style="margin: 4px 0;"><strong>Payment Method:</strong> ${escapeHtml(order.payment_method)} (${escapeHtml(order.payment_status || "Confirmed")})</p>
        <p style="margin: 4px 0;"><strong>Total Amount:</strong> <span style="color: #d4af37; font-weight: bold; font-size: 16px;">${formatPrice(order.total_amount)}</span></p>
        ${order.order_notes ? `<p style="margin: 4px 0;"><strong>Order Notes:</strong> ${escapeHtml(order.order_notes)}</p>` : ""}
      </div>

      <h4 style="color: #c6a15b; margin-bottom: 8px; text-transform: uppercase; font-size: 12px; letter-spacing: 0.1em;">Ordered Items:</h4>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; background: #131311; border-radius: 6px;">
        <thead>
          <tr style="border-bottom: 2px solid #c6a15b; color: #8e8a82; text-align: left;">
            <th style="padding: 8px;">Fragrance</th>
            <th style="padding: 8px; text-align: center;">Size</th>
            <th style="padding: 8px; text-align: center;">Qty</th>
            <th style="padding: 8px; text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>
    </div>
  `.trim();
}

/**
 * Sends order confirmation email to the customer and alert email to store owner.
 * Ensures:
 * - Direct lookup of authoritative database figures
 * - Duplicate prevention flag check (unless forceResend is true)
 * - Error isolation so database records are never rolled back
 * 
 * @param {number|string} orderId - ID of the order in `orders` table
 * @param {object} [options]
 * @param {boolean} [options.forceResend=false] - If true, bypasses already-sent check (e.g. admin resend)
 * @param {object} [options.client] - Optional active database client if within transaction
 */
export async function sendOrderConfirmationEmail(orderId, options = {}) {
  const { forceResend = false, client = null } = options;
  const db = client || pool;

  try {
    // 1. Fetch order record
    const orderRes = await db.query(
      `SELECT * FROM orders WHERE id = $1`,
      [orderId]
    );

    if (orderRes.rows.length === 0) {
      console.warn(`[OrderEmail] Order ID ${orderId} not found in database.`);
      return { success: false, error: "Order not found." };
    }

    const order = orderRes.rows[0];

    // 2. Duplicate prevention check
    if (order.confirmation_email_sent && !forceResend) {
      console.log(
        `[OrderEmail] Order ${order.order_number} confirmation email already dispatched at ${order.confirmation_email_sent_at}. Skipping duplicate send.`
      );
      return {
        success: true,
        alreadySent: true,
        orderNumber: order.order_number,
      };
    }

    // 3. Validate customer recipient email
    if (!isValidEmail(order.customer_email)) {
      console.warn(
        `[OrderEmail] Order ${order.order_number} has invalid customer email: "${order.customer_email}". Skipping customer email.`
      );
      return {
        success: false,
        error: `Invalid customer email address: "${order.customer_email}".`,
      };
    }

    // 4. Fetch authoritative order items from database
    const itemsRes = await db.query(
      `SELECT * FROM order_items WHERE order_id = $1 ORDER BY id ASC`,
      [orderId]
    );
    const items = itemsRes.rows;

    if (items.length === 0) {
      console.warn(
        `[OrderEmail] Warning: Order ${order.order_number} has 0 items associated in order_items.`
      );
    }

    // 5. Generate luxury email contents
    const customerHtml = generateCustomerOrderEmailHtml({ order, items });
    const customerText = generateCustomerOrderEmailText({ order, items });
    const ownerEmail = getPrimaryAdminEmail();

    // 6. Send customer confirmation email
    let customerEmailResult = null;
    try {
      customerEmailResult = await sendEmail({
        to: order.customer_email,
        replyTo: "thedecantbarofficial@gmail.com",
        subject: `✨ Order Confirmed: ${order.order_number} - The Decant Bar`,
        html: customerHtml,
        text: customerText,
      });

      console.log(
        `[OrderEmail] Successfully sent customer confirmation email for ${order.order_number} to ${order.customer_email}. Message ID: ${customerEmailResult?.id}`
      );

      // Update database flag
      await pool.query(
        `UPDATE orders 
         SET confirmation_email_sent = true, 
             confirmation_email_sent_at = CURRENT_TIMESTAMP 
         WHERE id = $1`,
        [order.id]
      );
    } catch (custErr) {
      console.error(
        `[OrderEmail] Failed to dispatch customer confirmation email for ${order.order_number}:`,
        custErr.message
      );
      // We do not throw here to allow owner email to still attempt
    }

    // 7. Send owner notification email
    if (ownerEmail) {
      try {
        const ownerHtml = generateOwnerOrderAlertHtml({ order, items });
        const ownerSubject = `🛒 New ${order.payment_method?.includes("COD") ? "COD" : "Paid"} Order: ${order.order_number} - ${formatPrice(order.total_amount)} (${order.customer_name})`;
        await sendEmail({
          to: ownerEmail,
          replyTo: order.customer_email,
          subject: ownerSubject,
          html: ownerHtml,
          text: `New order ${order.order_number} received from ${order.customer_name} for ${formatPrice(order.total_amount)}. Shipping to: ${order.shipping_address}, ${order.city}, ${order.pincode}.`,
        });
        console.log(
          `[OrderEmail] Successfully dispatched owner alert to ${ownerEmail} for ${order.order_number}`
        );
      } catch (ownerErr) {
        console.warn(
          `[OrderEmail] Warning: Failed to dispatch owner alert email for ${order.order_number}:`,
          ownerErr.message
        );
      }
    }

    return {
      success: !!customerEmailResult,
      alreadySent: false,
      orderNumber: order.order_number,
      messageId: customerEmailResult?.id,
    };
  } catch (err) {
    console.error(`[OrderEmail] Unexpected error processing order ${orderId}:`, err.message);
    return { success: false, error: err.message };
  }
}

