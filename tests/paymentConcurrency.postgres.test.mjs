import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import pg from "pg";
import { createRequire } from "node:module";
import pool from "../server/config/db.js";
import { ensureAdminSchema } from "../server/scripts/initAdminDb.js";
import { createRazorpayOrder, createCodOrder, receiveRazorpayWebhook } from "../server/controllers/orderController.js";
import { recoverPayments, paymentRecoveryJob } from "../server/services/paymentRecovery.js";

test("real PostgreSQL concurrent checkout and missed-payment recovery", {
  skip: process.env.PAYMENT_POSTGRES_TEST !== "true", timeout: 60000,
}, async t => {
  // This suite can only access an isolated local PostgreSQL server.
  const schema = "payment_test_" + crypto.randomBytes(8).toString("hex");
  const db = new pg.Pool({ host: "127.0.0.1", port: 55439, user: "payment_test",
    database: "postgres", ssl: false, max: 12, options: `-c search_path=${schema} -c statement_timeout=10000` });
  const query = db.query.bind(db);
  t.mock.method(pool, "query", query);
  t.mock.method(pool, "connect", db.connect.bind(db));
  process.env.ADMIN_EMAIL = "";
  process.env.ADMIN_EMAILS = "";
  process.env.RAZORPAY_KEY_ID = "rzp_test_concurrency";
  process.env.RAZORPAY_KEY_SECRET = "isolated";
  process.env.RAZORPAY_WEBHOOK_SECRET = "isolated-webhook";
  process.env.RESEND_API_KEY = "";
  const require = createRequire(import.meta.url);
  const axios = createRequire(require.resolve("razorpay"))("axios").default;
  const payments = new Map();
  let gatewayCalls = 0;
  let gatewayFailure = false;
  t.mock.method(axios, "create", () => ({
    defaults: {},
    post: async (_url, body) => {
      await new Promise(resolve => setTimeout(resolve, 30));
      const id = "order_" + ++gatewayCalls;
      payments.set(id, []);
      return { data: { id, ...body } };
    },
    get: async url => {
      if (gatewayFailure) throw new Error("Simulated gateway outage");
      const id = url.split("/")[3];
      return { data: { items: payments.get(id) || [] } };
    },
  }));
  const invoke = async (handler, request) => {
    const result = { code: 200 };
    const response = { status(code) { result.code = code; return this; },
      json(data) { result.data = data; return this; }, sendStatus(code) { result.code = code; return this; } };
    await handler(request, response);
    return result;
  };
  const buyer = (id, variants = [1]) => ({ user: { id }, body: {
    fullName: "Test Buyer", email: "buyer@example.invalid", phone: "9876543210",
    address: "12 Test Road", city: "Mumbai", state: "Maharashtra", pincode: "400001",
    items: variants.map(variantId => ({ variantId, quantity: 1 }))
  } });
  const reset = async stock => {
    await query("TRUNCATE order_items, orders RESTART IDENTITY");
    await query("UPDATE product_variants SET stock = $1", [stock]);
    payments.clear();
    gatewayCalls = 0;
  };
  const captured = orderId => ({ id: "pay_" + orderId, order_id: orderId, currency: "INR",
    amount: 60000, status: "captured", method: "netbanking" });
  const notify = async payment => {
    const body = Buffer.from(JSON.stringify({ event: "payment.captured", payload: { payment: { entity: payment } } }));
    const signature = crypto.createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET).update(body).digest("hex");
    return invoke(receiveRazorpayWebhook, { body, get: () => signature });
  };
  try {
    await query(`CREATE SCHEMA ${schema}`);
    await query(`
      CREATE TABLE users (id SERIAL PRIMARY KEY, full_name TEXT, email TEXT, password_hash TEXT, phone TEXT,
        address TEXT, city TEXT, state TEXT, pincode TEXT);
      CREATE TABLE products (id SERIAL PRIMARY KEY, name TEXT, image_url TEXT);
      CREATE TABLE product_variants (id SERIAL PRIMARY KEY, product_id INT, size_ml INT, price NUMERIC(10,2), stock INT, active BOOLEAN DEFAULT true);
      CREATE TABLE orders (id SERIAL PRIMARY KEY, order_number VARCHAR(50) UNIQUE, user_id INT, customer_name TEXT,
        customer_email TEXT, customer_phone TEXT, shipping_address TEXT, city TEXT, state TEXT, pincode TEXT,
        order_notes TEXT, subtotal NUMERIC(10,2), shipping_fee NUMERIC(10,2), total_amount NUMERIC(10,2),
        payment_method TEXT, order_status TEXT, created_at TIMESTAMPTZ DEFAULT NOW());
      CREATE TABLE order_items (id SERIAL PRIMARY KEY, order_id INT REFERENCES orders, product_id INT,
        product_name TEXT, size_ml INT, price NUMERIC(10,2), quantity INT, image_url TEXT);
      INSERT INTO users (id,email) VALUES (1,'one@example.invalid'), (2,'two@example.invalid'), (3,'three@example.invalid');
      INSERT INTO products VALUES (1,'Fixture fragrance',NULL), (2,'Second fragrance',NULL);
      INSERT INTO product_variants VALUES (1,1,5,600,1,true), (2,2,5,600,1,true);
    `);
    await ensureAdminSchema();

    await t.test("two buyers competing for the last vial get exactly one reservation", async () => {
      const results = await Promise.all([invoke(createRazorpayOrder,buyer(1)), invoke(createRazorpayOrder,buyer(2))]);
      assert.deepEqual(results.map(r=>r.code).sort(), [200,400]);
      assert.equal((await query("SELECT count(*) FROM orders")).rows[0].count, "1");
      assert.equal(gatewayCalls, 1);
    });
    await t.test("simultaneous Pay clicks reuse one store and gateway order", async () => {
      await reset(1);
      const results = await Promise.all([invoke(createRazorpayOrder,buyer(1)), invoke(createRazorpayOrder,buyer(1))]);
      assert.deepEqual(results.map(r=>r.code), [200,200]);
      assert.equal(results[0].data.orderId,results[1].data.orderId);
      assert.equal(gatewayCalls,1);
    });
    await t.test("online and COD compete fairly for the last unit", async () => {
      await reset(1);
      const results = await Promise.all([invoke(createRazorpayOrder,buyer(1)), invoke(createCodOrder,buyer(2))]);
      assert.equal(results.filter(r=>r.code < 300).length,1);
      assert.equal(results.filter(r=>r.code === 400).length,1);
    });
    await t.test("opposite basket order does not deadlock", async () => {
      await reset(2);
      const results = await Promise.all([invoke(createRazorpayOrder,buyer(1,[1,2])), invoke(createRazorpayOrder,buyer(2,[2,1]))]);
      assert.deepEqual(results.map(r=>r.code), [200,200]);
    });
    await t.test("missed notification is recovered once even while a webhook arrives", async () => {
      await reset(1);
      const checkout = await invoke(createRazorpayOrder,buyer(1));
      const payment = captured(checkout.data.orderId);
      payments.set(payment.order_id,[payment]);
      await query("UPDATE orders SET confirmation_email_sent = true");
      await Promise.all([recoverPayments(), recoverPayments(), notify(payment)]);
      const order = (await query("SELECT * FROM orders")).rows[0];
      assert.equal(order.payment_status,"Paid");
      assert.equal(order.razorpay_payment_id,payment.id);
      assert.equal((await query("SELECT stock FROM product_variants WHERE id=1")).rows[0].stock,0);
      assert.equal((await query("SELECT count(*) FROM orders")).rows[0].count,"1");
    });
    await t.test("gateway outage remains retryable and later recovers", async () => {
      await reset(1);
      const checkout = await invoke(createRazorpayOrder,buyer(1));
      payments.set(checkout.data.orderId,[captured(checkout.data.orderId)]);
      gatewayFailure = true;
      assert.equal((await recoverPayments()).errors,1);
      assert.equal((await query("SELECT payment_status FROM orders")).rows[0].payment_status,"Pending");
      gatewayFailure = false;
      await query("UPDATE orders SET payment_check_after = NOW(), confirmation_email_sent = true");
      assert.equal((await recoverPayments()).errors,0);
      assert.equal((await query("SELECT payment_status FROM orders")).rows[0].payment_status,"Paid");
    });
    await t.test("late payment after another buyer takes stock requires review", async () => {
      await reset(1);
      const first = await invoke(createRazorpayOrder,buyer(1));
      await query("UPDATE orders SET payment_hold_until = NOW() - interval '1 minute'");
      const second = await invoke(createRazorpayOrder,buyer(2));
      assert.equal(second.code,200);
      await query("UPDATE orders SET confirmation_email_sent = true");
      await notify(captured(first.data.orderId));
      assert.equal((await query("SELECT order_status FROM orders WHERE razorpay_order_id=$1",[first.data.orderId])).rows[0].order_status,"Stock review");
      assert.equal((await query("SELECT stock FROM product_variants WHERE id=1")).rows[0].stock,1);
    });
    await t.test("scheduler rejects missing credentials", async () => {
      process.env.CRON_SECRET = "isolated-job-secret";
      assert.equal((await invoke(paymentRecoveryJob,{get:()=>undefined})).code,401);
    });
    await t.test("recovery leaves live orders untouched when using test keys", async () => {
      await reset(1);
      const checkout = await invoke(createRazorpayOrder,buyer(1));
      payments.set(checkout.data.orderId,[captured(checkout.data.orderId)]);
      await query("UPDATE orders SET payment_mode = 'live'");
      assert.equal((await recoverPayments()).checked,0);
      assert.equal((await query("SELECT payment_status FROM orders")).rows[0].payment_status,"Pending");
    });
    await t.test("an interrupted recovery is picked up after its lease expires", async () => {
      await query("UPDATE orders SET payment_mode = 'test', payment_check_after = NOW() + interval '5 minutes', confirmation_email_sent = true");
      assert.equal((await recoverPayments()).checked,0);
      await query("UPDATE orders SET payment_check_after = NOW() - interval '1 second'");
      assert.equal((await recoverPayments()).checked,1);
      assert.equal((await query("SELECT payment_status FROM orders")).rows[0].payment_status,"Paid");
    });
  } finally {
    await query(`DROP SCHEMA ${schema} CASCADE`);
    await db.end();
  }
});
