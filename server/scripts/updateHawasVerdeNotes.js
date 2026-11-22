import pool from "../config/db.js";

const topNotes = ["Lime", "Green Apple"];
const middleNotes = ["Rosemary"];
const baseNotes = ["Patchouli", "Amber"];
const accords = [
  "citrus",
  "aromatic",
  "fresh spicy",
  "woody",
  "fruity",
  "green",
  "patchouli",
  "conifer",
  "fresh",
  "amber",
];

const client = await pool.connect();

try {
  await client.query("BEGIN");

  const products = await client.query(
    `SELECT id, name
       FROM products
      WHERE LOWER(name) IN ('hawas verde', 'rasasi hawas verde')
        AND LOWER(COALESCE(brand, '')) = 'rasasi'
      FOR UPDATE`
  );

  if (products.rowCount !== 1) {
    throw new Error(`Expected one Rasasi Hawas Verde row; found ${products.rowCount}.`);
  }

  const result = await client.query(
    `UPDATE products
        SET top_notes = $1,
            middle_notes = $2,
            base_notes = $3,
            accords = $4::jsonb,
            vibe = $5
      WHERE id = $6
      RETURNING id, name, top_notes, middle_notes, base_notes, accords, vibe`,
    [
      topNotes,
      middleNotes,
      baseNotes,
      JSON.stringify(accords),
      "Lime, Green Apple, Rosemary & Patchouli",
      products.rows[0].id,
    ]
  );

  await client.query("COMMIT");
  console.log(JSON.stringify(result.rows[0], null, 2));
} catch (error) {
  await client.query("ROLLBACK");
  console.error(error.message);
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}
