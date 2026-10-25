import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import pool from "../config/db.js";
import {
  escapeHtml,
  formatPrice,
  formatOrderDate,
  generateCustomerOrderEmailHtml,
  generateCustomerOrderEmailText,
  generateOwnerOrderAlertHtml,
  sendOrderConfirmationEmail,
} from "../services/orderEmailService.js";
import { verifyPaymentAndCreateOrder } from "../controllers/orderController.js";

async function runTests() {
  console.log("==================================================");
  console.log("THE DECANT BAR · ORDER CONFIRMATION EMAIL TEST SUITE");
  console.log("==================================================\n");

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
    }
  }

  // --- UNIT TESTS: HTML & Text Generation ---
  console.log("--- 1. Testing Template Generation & Security Escaping ---");

  const mockOrder = {
    id: 99999,
    order_number: "TDB-889900",
    customer_name: 'Test Customer <script>alert("xss")</script>',
    customer_email: "customer@example.com",
    customer_phone: "+91 9876543210",
    shipping_address: '123 Amber & Oud St, Apt 4B <img src=x onerror=alert(1)>',
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    payment_method: "Online (Razorpay)",
    payment_status: "Paid",
    order_notes: "Handle with extra care & luxury box",
    subtotal: "1499.00",
    shipping_fee: "0.00",
    total_amount: "1499.00",
    created_at: new Date("2026-10-25T14:30:00Z"),
  };

  const mockItems = [
    {
      product_name: "Tom Ford Oud Wood",
      size_ml: 10,
      quantity: 1,
      price: "899.00",
    },
    {
      product_name: "Maison Francis Kurkdjian Baccarat Rouge 540",
      size_ml: 5,
      quantity: 1,
      price: "600.00",
    },
  ];

  const html = generateCustomerOrderEmailHtml({ order: mockOrder, items: mockItems });
  const text = generateCustomerOrderEmailText({ order: mockOrder, items: mockItems });

  assert(html.includes("THE DECANT BAR"), "HTML includes luxury brand title");
  assert(html.includes("TDB-889900"), "HTML includes order number");
  assert(html.includes("Tom Ford Oud Wood"), "HTML includes item 1 name");
  assert(html.includes("Baccarat Rouge 540"), "HTML includes item 2 name");
  assert(html.includes("10ml"), "HTML includes decant size");
  assert(html.includes("₹1,499"), "HTML includes formatted total price");
  assert(html.includes("FREE"), "HTML displays FREE shipping when fee is 0");
  assert(html.includes("thedecantbarofficial@gmail.com"), "HTML includes official support email");
  assert(html.includes("/account"), "HTML includes link to customer account");
  assert(
    !html.includes("<script>") && html.includes("&lt;script&gt;"),
    "HTML correctly escapes customer script tags (XSS protection)"
  );
  assert(
    !html.includes("<img src=x onerror=alert(1)>") && html.includes("&lt;img src=x onerror=alert(1)&gt;"),
    "HTML correctly escapes customer image tags in address (XSS protection)"
  );
  assert(text.includes("ORDER CONFIRMED: TDB-889900"), "Plain-text fallback includes order confirmation header");
  assert(text.includes("Tom Ford Oud Wood (10ml) x 1 = ₹899"), "Plain-text includes item line breakdown");

  // --- UNIT TESTS: Cash on Delivery Template ---
  console.log("\n--- 2. Testing COD Order Template ---");
  const mockCodOrder = {
    ...mockOrder,
    payment_method: "Cash on Delivery",
    payment_status: "Pending",
    subtotal: "400.00",
    shipping_fee: "80.00",
    total_amount: "480.00",
  };
  const codHtml = generateCustomerOrderEmailHtml({ order: mockCodOrder, items: mockItems.slice(0, 1) });
  assert(codHtml.includes("Cash on Delivery (COD)"), "COD HTML identifies Cash on Delivery");
  assert(codHtml.includes("Due upon Delivery"), "COD HTML displays Due upon Delivery status");
  assert(codHtml.includes("₹80"), "COD HTML displays ₹80 shipping fee when subtotal is below ₹500");
  assert(codHtml.includes("Please keep exact cash or UPI ready"), "COD HTML includes payment instructions");

  // --- SECURITY TEST: Razorpay Signature Mismatch Never Triggers Email ---
  console.log("\n--- 3. Testing Razorpay Tampered Signature Protection ---");
  let responseStatusCode = null;
  let responseJson = null;
  const mockReq = {
    user: { id: 1, email: "test@example.com" },
    body: {
      razorpay_order_id: "order_fake123",
      razorpay_payment_id: "pay_fake456",
      razorpay_signature: "tampered_invalid_signature_hex",
      fullName: "Hacker Test",
      email: "hacker@example.com",
      phone: "9876543210",
      address: "123 Fraud Lane",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      items: [{ productId: 1, size_ml: 5, quantity: 1 }],
    },
  };
  const mockRes = {
    status(code) {
      responseStatusCode = code;
      return this;
    },
    json(data) {
      responseJson = data;
      return this;
    },
  };

  await verifyPaymentAndCreateOrder(mockReq, mockRes);
  assert(
    responseStatusCode === 400,
    `Razorpay signature mismatch rejected with HTTP 400 (Got: ${responseStatusCode})`
  );
  assert(
    responseJson?.message?.includes("Invalid transaction signature"),
    "Razorpay verification returned invalid transaction signature error message"
  );

  // --- DATABASE & DUPLICATE PREVENTION TESTS ---
  console.log("\n--- 4. Testing Duplicate Prevention & Database Dispatch ---");

  // Insert a test order into PostgreSQL
  const client = await pool.connect();
  let testOrderId = null;
  try {
    const testOrderNum = `TEST-${Date.now()}`;
    const insertRes = await client.query(
      `INSERT INTO orders 
        (order_number, user_id, customer_name, customer_email, customer_phone,
         shipping_address, city, state, pincode, payment_method, payment_status,
         order_notes, subtotal, shipping_fee, total_amount, order_status,
         confirmation_email_sent)
       VALUES ($1, NULL, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
       RETURNING id`,
      [
        testOrderNum,
        "Test User",
        "thedecantbarofficial@gmail.com",
        "9876543210",
        "Suite 100, Luxury Towers",
        "New Delhi",
        "Delhi",
        "110001",
        "Online (Razorpay)",
        "Paid",
        "Automated Test Order",
        1299.00,
        0.00,
        1299.00,
        "Confirmed",
        false, // Initially unsent
      ]
    );
    testOrderId = insertRes.rows[0].id;

    // Insert an item for this order
    await client.query(
      `INSERT INTO order_items (order_id, product_name, size_ml, price, quantity)
       VALUES ($1, $2, $3, $4, $5)`,
      [testOrderId, "Creed Aventus Decant", 10, 1299.00, 1]
    );

    console.log(`  Created temporary test order ID: ${testOrderId} (${testOrderNum})`);

    // Test 1: First dispatch (should attempt live Resend send)
    const firstDispatch = await sendOrderConfirmationEmail(testOrderId);
    assert(firstDispatch.success === true, "First email dispatch succeeded via Resend");
    assert(firstDispatch.alreadySent === false, "First dispatch recognized order as unsent");
    if (firstDispatch.messageId) {
      console.log(`  Resend Delivered Message ID: ${firstDispatch.messageId}`);
    }

    // Verify confirmation_email_sent flag was set to true in database
    const checkDb = await client.query(
      `SELECT confirmation_email_sent, confirmation_email_sent_at FROM orders WHERE id = $1`,
      [testOrderId]
    );
    assert(
      checkDb.rows[0].confirmation_email_sent === true,
      "Database flag confirmation_email_sent updated to true after dispatch"
    );
    assert(
      checkDb.rows[0].confirmation_email_sent_at !== null,
      "Database timestamp confirmation_email_sent_at recorded"
    );

    // Test 2: Second dispatch without forceResend (duplicate prevention test)
    const secondDispatch = await sendOrderConfirmationEmail(testOrderId);
    assert(
      secondDispatch.alreadySent === true,
      "Duplicate dispatch blocked: returns alreadySent: true without re-sending"
    );

    // Test 3: Force resend (admin resend capability)
    const forceDispatch = await sendOrderConfirmationEmail(testOrderId, { forceResend: true });
    assert(
      forceDispatch.success === true && forceDispatch.alreadySent === false,
      "Force resend successfully bypasses duplicate check for admin remediation"
    );

  } finally {
    // Clean up temporary test order
    if (testOrderId) {
      await client.query(`DELETE FROM order_items WHERE order_id = $1`, [testOrderId]);
      await client.query(`DELETE FROM orders WHERE id = $1`, [testOrderId]);
      console.log(`  Cleaned up temporary test order ID: ${testOrderId}`);
    }
    client.release();
    await pool.end();
  }

  console.log("\n==================================================");
  console.log(`TEST RESULTS: ${passed}/${total} assertions passed (${Math.round((passed / total) * 100)}%)`);
  console.log("==================================================");

  if (passed === total) {
    console.log("🎉 ALL ORDER CONFIRMATION EMAIL TESTS PASSED SUCCESSFULLY!");
    process.exit(0);
  } else {
    console.error("❌ Some tests failed.");
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test runner encountered error:", err);
  process.exit(1);
});

