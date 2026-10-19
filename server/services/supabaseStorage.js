import { createClient } from "@supabase/supabase-js";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localUploadsDir = path.resolve(__dirname, "../../public/images/perfumes");

const BUCKET_NAME = "perfumes";

let supabaseClient = null;

export function getSupabase() {
  if (supabaseClient) return supabaseClient;

  const supabaseUrl = process.env.SUPABASE_URL || "https://vrljruxxafskcsyowvrh.supabase.co";
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseKey) {
    return null;
  }

  supabaseClient = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });

  return supabaseClient;
}

/**
 * Ensures the 'perfumes' storage bucket exists and is set to public.
 */
export async function ensurePerfumesBucket() {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const { data: buckets, error: listErr } = await supabase.storage.listBuckets();
    if (listErr) {
      console.warn("Could not list Supabase buckets:", listErr.message);
      return false;
    }

    const bucketExists = buckets?.some((b) => b.name === BUCKET_NAME);
    if (!bucketExists) {
      const { error: createErr } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: 10 * 1024 * 1024, // 10MB limit
        allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
      });
      if (createErr) {
        console.warn("Could not create Supabase storage bucket:", createErr.message);
        return false;
      }
      console.log(`Created public Supabase storage bucket: '${BUCKET_NAME}'`);
    }

    return true;
  } catch (err) {
    console.warn("Bucket check exception:", err.message);
    return false;
  }
}

/**
 * Uploads an image buffer or base64 to Supabase Storage (with fallback to local disk).
 * Returns the public image URL.
 */
export async function uploadPerfumeImage({ buffer, filename, mimeType }) {
  const supabase = getSupabase();

  let ext = "png";
  if (mimeType?.includes("jpeg") || mimeType?.includes("jpg")) ext = "jpg";
  else if (mimeType?.includes("webp")) ext = "webp";
  else if (mimeType?.includes("avif")) ext = "avif";

  const cleanBaseName = filename
    ? path.parse(filename).name.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 35)
    : "perfume";
  const uniqueFileName = `${cleanBaseName}_${Date.now()}.${ext}`;

  // 1. If Supabase credentials exist, upload to Supabase Storage
  if (supabase) {
    try {
      await ensurePerfumesBucket();

      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(uniqueFileName, buffer, {
          contentType: mimeType || `image/${ext}`,
          upsert: true,
        });

      if (error) {
        console.warn("Supabase Storage upload error, falling back to local:", error.message);
      } else {
        const { data: urlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(uniqueFileName);

        if (urlData?.publicUrl) {
          console.log(`Successfully uploaded to Supabase Storage: ${urlData.publicUrl}`);
          return {
            success: true,
            imageUrl: urlData.publicUrl,
            storage: "supabase",
          };
        }
      }
    } catch (sbErr) {
      console.warn("Supabase Storage exception, using local fallback:", sbErr.message);
    }
  }

  // 2. Local File System Fallback (NEVER stores base64 in DB)
  await fs.mkdir(localUploadsDir, { recursive: true });
  const localFilePath = path.join(localUploadsDir, uniqueFileName);
  await fs.writeFile(localFilePath, buffer);

  const localUrl = `/images/perfumes/${uniqueFileName}`;
  console.log(`Saved image to local storage: ${localUrl}`);

  return {
    success: true,
    imageUrl: localUrl,
    storage: "local",
  };
}

/**
 * Safely deletes a perfume image from storage (either Supabase Storage or local disk).
 * Prevents orphaned duplicate files when photos are replaced or products are deleted.
 */
export async function deletePerfumeImage(imageUrl) {
  if (!imageUrl || typeof imageUrl !== "string") return false;

  const trimmed = imageUrl.trim();
  if (trimmed.startsWith("data:image/")) return false; // Not a stored file

  const supabase = getSupabase();

  try {
    // 1. If it's a Supabase Storage CDN URL
    if (trimmed.includes(".supabase.co/storage/v1/object/public/")) {
      const parts = trimmed.split(`/${BUCKET_NAME}/`);
      if (parts.length > 1) {
        const objectPath = parts[1].split("?")[0];
        if (supabase) {
          const { error } = await supabase.storage.from(BUCKET_NAME).remove([objectPath]);
          if (error) {
            console.warn(`[Storage Cleanup] Could not delete from Supabase: ${objectPath}`, error.message);
            return false;
          }
          console.log(`[Storage Cleanup] Deleted replaced image from Supabase: ${objectPath}`);
          return true;
        }
      }
    }

    // 2. If it's a local file path: /images/perfumes/filename.ext
    if (trimmed.startsWith("/images/perfumes/")) {
      const filename = path.basename(trimmed);
      const filePath = path.join(localUploadsDir, filename);
      try {
        await fs.unlink(filePath);
        console.log(`[Storage Cleanup] Deleted replaced local image: ${filename}`);
        return true;
      } catch (fsErr) {
        if (fsErr.code !== "ENOENT") {
          console.warn(`[Storage Cleanup] Could not delete local file: ${filename}`, fsErr.message);
        }
        return false;
      }
    }
  } catch (err) {
    console.warn(`[Storage Cleanup] Error deleting image '${trimmed}':`, err.message);
  }

  return false;
}
