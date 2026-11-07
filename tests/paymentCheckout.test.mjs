import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";
import pool from "../server/config/db.js";
import { createRazorpayOrder, createCodOrder } from "../server/controllers/orderController.js";

test("checkout saves the server-priced basket before returning payment details, reuses it and protects the last unit", async t => {
  process.env.RAZORPAY_KEY_ID = "test-only";
  process.env.RAZORPAY_KEY_SECRET = "test-only";
  const require = createRequire(import.meta.url);
  const gatewayRequire = createRequire(require.resolve("razorpay"));
  const axios = gatewayRequire("axios").default;
  let order;
  let savedItem;
  let committed = false;
  let gatewayCalls = 0;
  t.mock.method(axios, "create", () => ({
    post: async () => {
      assert.ok(savedItem);
      gatewayCalls++;
      return { data: { id: "order_test" } };
    }
  }));
  const client = {
    release() {},
    async query(sql, values) {
      const rows = result => ({ rows: result });
      if (sql === "COMMIT") committed = true;
      if (sql.startsWith("SELECT * FROM orders")) return rows(order ? [order] : []);
      if (sql.includes("SELECT pv.id")) return rows([{ id: 3, product_id: 9, size_ml: 5, price: "600", product_name: "Test scent" }]);
      if (sql.startsWith("SELECT stock")) return rows([{ stock: 1 }]);
      if (sql.includes("SUM(i.quantity)")) return rows([{ units: savedItem ? 1 : 0 }]);
      if (sql.includes("INSERT INTO orders")) {
        assert.equal(values[5], "12 Test Road");
        assert.equal(values[12], 600);
        assert.match(sql, /Awaiting payment/);
        order = { id: 1, order_number: values[0], subtotal: 600, shipping_fee: 0, total_amount: 600 };
        return rows([order]);
      }
      if (sql.includes("INSERT INTO order_items")) savedItem = values;
      return rows([]);
    }
  };
  t.mock.method(pool, "connect", async () => client);
  const req = { user: { id: 4 }, body: { fullName: "Test Buyer", email: "test@example.com",
    phone: "9876543210", address: "12 Test Road", city: "Mumbai", state: "Maharashtra",
    pincode: "400001", total: 1, items: [{ variantId: 3, quantity: 1, price: 1 }] } };
  const res = { code: 200, status(code) { this.code = code; return this; }, json(data) { this.data = data; } };
  await createRazorpayOrder(req, res);
  assert.equal(res.code, 200);
  assert.equal(committed, true);
  assert.equal(res.data.amount, 60000);
  assert.deepEqual(savedItem.slice(1, 7), [3, 9, "Test scent", 5, 600, 1]);
  await createRazorpayOrder(req, res);
  assert.equal(gatewayCalls, 1);
  assert.equal(res.data.orderNumber, order.order_number);
  await createCodOrder({ ...req, user: { id: 5 } }, res);
  assert.equal(res.code, 400);
  assert.match(res.data.message, /stock/);
});
import { createHmac } from "node:crypto";
import { receiveRazorpayWebhook, retrySavedPayment, verifyPaymentAndCreateOrder } from "../server/controllers/orderController.js";

for (const confirmationPath of ["customer returns", "customer closes checkout"]) {
test(`retry on the same order and confirm once when ${confirmationPath}`, async t => {
  process.env.RAZORPAY_WEBHOOK_SECRET = "isolated-test-secret";
  process.env.RAZORPAY_KEY_ID = "isolated-key";
  process.env.RAZORPAY_KEY_SECRET = "isolated-secret";
  const order = { id: 11, user_id: 2, order_number: "TDB-test", order_status: "Awaiting payment",
    payment_status: "Pending", razorpay_order_id: "order_test", total_amount: "600" };
  const payment = { id: "pay_test", order_id: "order_test", currency: "INR", amount: 60000, method: "upi" };
  let deductions = 0;
  const rows = rows => ({ rows });
  const client = { release() {}, async query(sql, args) {
    if (sql.startsWith("SELECT * FROM orders")) return rows([{ ...order }]);
    if (sql.includes("FROM order_items WHERE order_id")) return rows([{ variantId: 3, variant_id: 3, quantity: 1 }]);
    if (sql.includes("SELECT stock")) return rows([{ stock: 1 }]);
    if (sql.includes("SUM(i.quantity)")) return rows([{ units: 0 }]);
    if (sql.includes("SELECT active")) return rows([{ active: true }]);
    if (sql.includes("UPDATE product_variants")) deductions++;
    if (sql.includes("SET order_status = $1")) Object.assign(order, {
      order_status: args[0], payment_status: "Paid", razorpay_payment_id: args[1], payment_method: args[3] });
    return rows([]);
  }};
  t.mock.method(pool, "connect", async () => client);
  t.mock.method(pool, "query", async sql => {
    if (sql.includes("SET payment_status = 'Failed'") && order.payment_status !== "Paid") order.payment_status = "Failed";
    return rows([]);
  });
  const require = createRequire(import.meta.url);
  const axios = createRequire(require.resolve("razorpay"))("axios").default;
  t.mock.method(axios, "create", () => ({
    get: async url => ({ data: url.endsWith("/payments/pay_test")
      ? { ...payment, status: "captured" }
      : { items: [{ id: "pay_failed", status: "failed" }] } })
  }));
  function response() {
    return { status(code) { this.code = code; return this; }, json(data) { this.data = data; },
      sendStatus(code) { this.code = code; } };
  }
  async function notify(status, secret = process.env.RAZORPAY_WEBHOOK_SECRET, amount = 60000) {
    const body = Buffer.from(JSON.stringify({ event: "payment." + status,
      payload: { payment: { entity: { ...payment, id: status === "failed" ? "pay_failed" : payment.id, status, amount } } } }));
    const signature = createHmac("sha256", secret).update(body).digest("hex");
    const res = response();
    await receiveRazorpayWebhook({ body, get: () => signature }, res);
    return res.code;
  }
  assert.equal(await notify("captured", "wrong-secret"), 401);
  assert.equal(await notify("captured", undefined, 10), 409);
  assert.equal(deductions, 0);
  assert.equal(await notify("failed"), 204);
  assert.equal(order.payment_status, "Failed");
  const retry = response();
  await retrySavedPayment({ params: { id: 11 }, user: { id: 2 } }, retry);
  assert.equal(retry.data.orderId, payment.order_id);
  assert.equal(retry.data.orderNumber, order.order_number);
  if (confirmationPath === "customer returns") {
    const signature = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${payment.order_id}|${payment.id}`).digest("hex");
    const confirmation = response();
    await verifyPaymentAndCreateOrder({ user: { id: 2 }, body: {
      razorpay_order_id: payment.order_id, razorpay_payment_id: payment.id, razorpay_signature: signature
    } }, confirmation);
    assert.equal(confirmation.code, 201);
    assert.equal(confirmation.data.order.paymentStatus, "Paid");
    assert.equal(confirmation.data.order.orderNumber, retry.data.orderNumber);
    assert.equal(confirmation.data.order.total, "600");
  }
  assert.equal(await notify("captured"), 204);
  assert.equal(await notify("captured"), 204);
  assert.equal(await notify("failed"), 204);
  assert.equal(order.payment_status, "Paid");
  assert.equal(order.payment_method, "Online (Razorpay) - UPI");
  assert.equal(order.order_status, "Confirmed");
  assert.equal(deductions, 1);
});
}
