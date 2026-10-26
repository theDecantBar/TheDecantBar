import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import pool from "../server/config/db.js";
import { createReview, updateReview, deleteReview, getReviews, getManageableReviews } from "../server/controllers/reviewController.js";

// Opt-in only: synthetic fixtures are contained in one transaction and rolled back.
test("PostgreSQL review ownership, edits and soft deletion", { skip: process.env.REVIEW_POSTGRES_TEST !== "true" }, async () => {
  const client = await pool.connect();
  const originalQuery = pool.query;
  try {
    await client.query("BEGIN");
    await client.query("SET LOCAL statement_timeout = '10000'");
    pool.query = client.query.bind(client);
    const users = [];
    for (let i = 0; i < 3; i++) {
      const result = await client.query(`INSERT INTO users (full_name,email,password_hash,is_admin)
        VALUES ($1,$2,$3,$4) RETURNING id,full_name,email,is_admin`,
        [`Review integration ${i}`, `review-test-${crypto.randomUUID()}@example.invalid`, "unused-test-password-hash", i === 2]);
      users.push(result.rows[0]);
    }
    const invoke = async (handler, user, body = {}, id) => {
      const result = { status: 200, data: null };
      const response = { set() { return this; }, status(code) { result.status = code; return this; }, json(data) { result.data = data; return this; } };
      await handler({ user, body, params: { id: String(id) } }, response);
      return result;
    };
    const payload = { rating: 4, text: "Synthetic offline customer review", city: "Test city", fragrance: "Test fragrance", photo: null };
    const created = await invoke(createReview, users[0], payload);
    assert.equal(created.status, 201);
    const id = created.data.review.id;
    assert.equal(Object.hasOwn(created.data.review, "verifiedBuyer"), false);
    assert.equal(Object.hasOwn(created.data.review, "authorEmail"), false);
    assert.equal((await invoke(updateReview, users[1], payload, id)).status, 403);
    assert.equal((await invoke(deleteReview, users[1], {}, id)).status, 404);
    assert.equal((await invoke(updateReview, users[0], { ...payload, text: "Author saved an edit" }, id)).status, 200);
    assert.equal((await client.query("SELECT review_text FROM reviews WHERE id=$1", [id])).rows[0].review_text, "Author saved an edit");
    const adminEdit = await invoke(updateReview, users[2], { ...payload, text: "Admin saved an edit" }, id);
    assert.equal(adminEdit.status, 200);
    assert.equal(adminEdit.data.review.name, users[0].full_name);
    assert.equal(adminEdit.data.review.editedByAdmin, true);
    const permissions = await invoke(getManageableReviews, users[0]);
    assert.ok(permissions.data.ids.some(value => String(value) === String(id)));
    assert.equal((await invoke(deleteReview, users[0], {}, id)).status, 200);
    const retained = (await client.query("SELECT deleted_at,deleted_by FROM reviews WHERE id=$1", [id])).rows[0];
    assert.ok(retained.deleted_at);
    assert.equal(retained.deleted_by, users[0].id);
    assert.equal((await invoke(updateReview, users[0], payload, id)).status, 404);
    for (let i = 0; i < 2; i++) {
      const list = await invoke(getReviews, null);
      assert.equal(list.status, 200);
      assert.equal(list.data.reviews.some(review => String(review.id) === String(id)), false);
    }
  } finally {
    pool.query = originalQuery;
    await client.query("ROLLBACK");
    client.release();
    await pool.end();
  }
});
