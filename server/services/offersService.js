import pool from "../config/db.js";

export const DEFAULT_OFFERS_CONFIG = {
  freeShippingThreshold: 499,
  standardShippingFee: 80,
  discountActive: true,
  discountPercent: 10,
  discountMinSubtotal: 999,
  banners: [
    {
      id: "free-delivery",
      badge: "Free Delivery",
      text: "on orders of ₹499 or more",
      icon: "truck",
      link: "/products",
      active: true,
    },
    {
      id: "ten-percent-off",
      badge: "Flat 10% Off",
      text: "auto-applied on ₹999 or more",
      icon: "sparkles",
      link: "/products",
      active: true,
    },
    {
      id: "authentic-decants",
      badge: "100% Authentic",
      text: "Luxury decants in 2ml, 5ml & 10ml",
      icon: "shield",
      link: "/products",
      active: true,
    },
  ],
};

const ALLOWED_ICONS = new Set(["truck", "sparkles", "shield", "tag", "gift"]);
const CACHE_TTL_MS = 15_000;

let cachedConfig = null;
let cachedAt = 0;

export function invalidateOffersCache() {
  cachedConfig = null;
  cachedAt = 0;
}

function sanitizeBanner(raw, idx) {
  const badge = String(raw?.badge ?? "").trim().slice(0, 40);
  const text = String(raw?.text ?? "").trim().slice(0, 140);
  const rawIcon = String(raw?.icon ?? "sparkles").trim().toLowerCase();
  const icon = ALLOWED_ICONS.has(rawIcon) ? rawIcon : "sparkles";
  let link = String(raw?.link ?? "/products").trim().slice(0, 200);
  if (!link.startsWith("/")) {
    link = "/products";
  }
  const id =
    String(raw?.id ?? "")
      .trim()
      .replace(/[^a-zA-Z0-9_-]/g, "")
      .slice(0, 48) || `offer-${Date.now()}-${idx}`;

  return {
    id,
    badge: badge || "Special Offer",
    text: text || "Explore authentic fragrance decants",
    icon,
    link,
    active: raw?.active !== false,
  };
}

export function normalizeOffersConfig(input = {}) {
  const freeShippingThreshold = Math.max(
    0,
    Math.min(100000, Math.round(Number(input.freeShippingThreshold ?? DEFAULT_OFFERS_CONFIG.freeShippingThreshold) || 0))
  );
  const standardShippingFee = Math.max(
    0,
    Math.min(2000, Math.round(Number(input.standardShippingFee ?? DEFAULT_OFFERS_CONFIG.standardShippingFee) || 0))
  );
  const discountActive = Boolean(input.discountActive ?? DEFAULT_OFFERS_CONFIG.discountActive);
  const discountPercent = Math.max(
    0,
    Math.min(80, Math.round(Number(input.discountPercent ?? DEFAULT_OFFERS_CONFIG.discountPercent) || 0))
  );
  const discountMinSubtotal = Math.max(
    0,
    Math.min(100000, Math.round(Number(input.discountMinSubtotal ?? DEFAULT_OFFERS_CONFIG.discountMinSubtotal) || 0))
  );

  const rawBanners = Array.isArray(input.banners)
    ? input.banners
    : DEFAULT_OFFERS_CONFIG.banners;

  const banners = rawBanners
    .slice(0, 12)
    .filter((b) => b && (String(b.badge || "").trim() || String(b.text || "").trim()))
    .map((b, i) => sanitizeBanner(b, i));

  return {
    freeShippingThreshold,
    standardShippingFee,
    discountActive,
    discountPercent,
    discountMinSubtotal,
    banners,
  };
}

function rowToConfig(row) {
  if (!row) return { ...DEFAULT_OFFERS_CONFIG };
  return normalizeOffersConfig({
    freeShippingThreshold: row.free_shipping_threshold,
    standardShippingFee: row.standard_shipping_fee,
    discountActive: row.discount_active,
    discountPercent: row.discount_percent,
    discountMinSubtotal: row.discount_min_subtotal,
    banners: Array.isArray(row.banners) ? row.banners : DEFAULT_OFFERS_CONFIG.banners,
  });
}

export async function getOffersConfig({ client = null, bypassCache = false } = {}) {
  if (!client && !bypassCache && cachedConfig && Date.now() - cachedAt < CACHE_TTL_MS) {
    return cachedConfig;
  }

  const db = client || pool;
  try {
    const res = await db.query("SELECT * FROM store_offers_config WHERE id = 1 LIMIT 1");
    const config = res.rows[0] ? rowToConfig(res.rows[0]) : { ...DEFAULT_OFFERS_CONFIG };
    if (!client) {
      cachedConfig = config;
      cachedAt = Date.now();
    }
    return config;
  } catch (err) {
    console.warn("Falling back to default offers config:", err.message);
    return { ...DEFAULT_OFFERS_CONFIG };
  }
}

export async function saveOffersConfig(payload) {
  const clean = normalizeOffersConfig(payload);
  const res = await pool.query(
    `INSERT INTO store_offers_config
      (id, free_shipping_threshold, standard_shipping_fee, discount_active, discount_percent, discount_min_subtotal, banners, updated_at)
     VALUES
      (1, $1, $2, $3, $4, $5, $6::jsonb, CURRENT_TIMESTAMP)
     ON CONFLICT (id) DO UPDATE SET
      free_shipping_threshold = EXCLUDED.free_shipping_threshold,
      standard_shipping_fee = EXCLUDED.standard_shipping_fee,
      discount_active = EXCLUDED.discount_active,
      discount_percent = EXCLUDED.discount_percent,
      discount_min_subtotal = EXCLUDED.discount_min_subtotal,
      banners = EXCLUDED.banners,
      updated_at = CURRENT_TIMESTAMP
     RETURNING *`,
    [
      clean.freeShippingThreshold,
      clean.standardShippingFee,
      clean.discountActive,
      clean.discountPercent,
      clean.discountMinSubtotal,
      JSON.stringify(clean.banners),
    ]
  );

  const saved = rowToConfig(res.rows[0]);
  cachedConfig = saved;
  cachedAt = Date.now();
  return saved;
}

