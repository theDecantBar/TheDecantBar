import pool from "../config/db.js";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getSupabase, ensurePerfumesBucket } from "../services/supabaseStorage.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.resolve(__dirname, "../../public/images/perfumes");
const BUCKET_NAME = "perfumes";

async function sync() {
  console.log("=== SYNC LOCAL PERFUME IMAGES TO SUPABASE STORAGE ===");

  const supabase = getSupabase();
  if (!supabase) {
    console.error("❌ SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY is missing in .env!");
    console.log("Please add your Supabase key to .env as:");
    console.log("SUPABASE_URL=https://vrljruxxafskcsyowvrh.supabase.co");
    console.log("SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here\n");
    process.exit(1);
  }

  await ensurePerfumesBucket();

  const files = await fs.readdir(imagesDir);
  console.log(`Found ${files.length} image files in local storage.\n`);

  let uploaded = 0;
  for (const filename of files) {
    const filePath = path.join(imagesDir, filename);
    const stat = await fs.stat(filePath);
    if (!stat.isFile()) continue;

    const ext = path.extname(filename).toLowerCase().replace(".", "");
    let mimeType = `image/${ext}`;
    if (ext === "jpg" || ext === "jpeg") mimeType = "image/jpeg";
    if (ext === "webp") mimeType = "image/webp";
    if (ext === "png") mimeType = "image/png";

    const buffer = await fs.readFile(filePath);

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filename, buffer, {
        contentType: mimeType,
        upsert: true,
      });

    if (error) {
      console.error(`Failed to upload ${filename}:`, error.message);
      continue;
    }

    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filename);

    const cdnUrl = urlData.publicUrl;

    // Update database row if product is using this image
    const localUrl = `/images/perfumes/${filename}`;
    const updateRes = await pool.query(
      `UPDATE products SET image_url = $1 WHERE image_url = $2 RETURNING id, name`,
      [cdnUrl, localUrl]
    );

    uploaded++;
    if (updateRes.rows.length > 0) {
      console.log(`[${uploaded}/${files.length}] Uploaded & Updated DB: ${updateRes.rows[0].name} -> ${cdnUrl}`);
    } else {
      console.log(`[${uploaded}/${files.length}] Uploaded: ${filename} -> ${cdnUrl}`);
    }
  }

  console.log(`\n🎉 Successfully synced ${uploaded} images to Supabase Storage!`);
  await pool.end();
}

sync();
