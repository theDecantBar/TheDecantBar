import pool from "../config/db.js";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.resolve(__dirname, "../../public/images/perfumes");

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 30);
}

async function migrate() {
  console.log("=== THE DECANT BAR: PARALLEL BASE64 IMAGE MIGRATION ===");
  await fs.mkdir(uploadsDir, { recursive: true });

  try {
    // 1. Fetch products that still have base64 data
    const res = await pool.query(`
      SELECT id, name, length(image_url) as len
      FROM products
      WHERE length(image_url) > 1000
      ORDER BY id ASC
    `);

    const items = res.rows;
    console.log(`Remaining products to migrate: ${items.length}\n`);

    if (items.length === 0) {
      console.log("All products already migrated!");
      return;
    }

    let currentIndex = 0;
    let completed = 0;
    const CONCURRENCY = 4;

    async function worker(workerId) {
      while (currentIndex < items.length) {
        const item = items[currentIndex++];
        if (!item) break;

        const start = Date.now();
        console.log(`[Worker ${workerId}] Fetching ID ${item.id} (${item.name})...`);

        try {
          const itemRes = await pool.query(
            "SELECT image_url FROM products WHERE id = $1",
            [item.id]
          );

          if (!itemRes.rows.length || !itemRes.rows[0].image_url) continue;

          const raw = itemRes.rows[0].image_url.trim();
          const match = raw.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);

          let ext = "png";
          let base64Data = raw;

          if (match) {
            let matchedExt = match[1].toLowerCase();
            if (matchedExt === "jpeg") ext = "jpg";
            else if (matchedExt.includes("webp")) ext = "webp";
            else if (matchedExt.includes("png")) ext = "png";
            else ext = "jpg";
            base64Data = match[2];
          }

          const buffer = Buffer.from(base64Data, "base64");
          const filename = `perfume_${item.id}_${slugify(item.name)}.${ext}`;
          const filePath = path.join(uploadsDir, filename);

          await fs.writeFile(filePath, buffer);

          const cleanUrl = `/images/perfumes/${filename}`;
          await pool.query(
            "UPDATE products SET image_url = $1 WHERE id = $2",
            [cleanUrl, item.id]
          );

          completed++;
          const duration = ((Date.now() - start) / 1000).toFixed(1);
          console.log(`[✓ ${completed}/${items.length}] ID ${item.id} (${item.name}) -> ${cleanUrl} (${(buffer.length / 1024).toFixed(1)} KB) in ${duration}s`);
        } catch (itemErr) {
          console.error(`[Worker ${workerId}] Error migrating ID ${item.id}:`, itemErr.message);
        }
      }
    }

    await Promise.all(
      Array.from({ length: Math.min(CONCURRENCY, items.length) }, (_, i) => worker(i + 1))
    );

    console.log("\n ALL PRODUCTS MIGRATED SUCCESSFULLY TO STATIC FILES!");
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    await pool.end();
  }
}

migrate();
