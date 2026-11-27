import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Tag,
  Truck,
  Sparkles,
  ShieldCheck,
  Gift,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Save,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  X,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useOffers } from "../../context/OffersContext";
import { DEFAULT_OFFERS } from "../../utils/shipping";
import { fetchAdminOffers, updateAdminOffers } from "../../services/adminApi";

const ICON_OPTIONS = [
  { id: "truck", label: "Delivery Truck", icon: Truck },
  { id: "sparkles", label: "Sparkles / Sale", icon: Sparkles },
  { id: "tag", label: "Price Tag", icon: Tag },
  { id: "gift", label: "Gift Box", icon: Gift },
  { id: "shield", label: "Verified Shield", icon: ShieldCheck },
];

const BANNER_ICON_MAP = Object.fromEntries(
  ICON_OPTIONS.map((opt) => [opt.id, opt.icon])
);

function BannerPillPreview({ banner }) {
  const Icon = BANNER_ICON_MAP[banner?.icon] || Sparkles;
  return (
    <div className="inline-flex flex-wrap items-center justify-center gap-2.5 text-center">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#c6a15b] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#11110f] shadow-[0_0_12px_rgba(198,161,91,0.3)]">
        <Icon size={12} strokeWidth={2.2} className="shrink-0" />
        <span>{banner?.badge?.trim() || "Badge Text"}</span>
      </span>
      <span className="text-xs font-medium uppercase tracking-[0.16em] text-[#fffdf7]">
        {banner?.text?.trim() || "Your offer message will appear here"}
      </span>
    </div>
  );
}

const LINK_PRESETS = [
  { label: "All Perfumes (/products)", value: "/products" },
  { label: "Niche Collection (/products?category=Niche)", value: "/products?category=Niche" },
  { label: "Designer Collection (/products?category=Designer)", value: "/products?category=Designer" },
  { label: "Middle Eastern (/products?category=Middle%20eastern)", value: "/products?category=Middle%20eastern" },
  { label: "Shopping Bag (/cart)", value: "/cart" },
];

function normalizeNumericInput(rawValue, maxVal) {
  const digitsOnly = String(rawValue ?? "").replace(/[^\d]/g, "");
  if (!digitsOnly) return "";
  const stripped = digitsOnly.replace(/^0+(?=\d)/, "");
  const num = Math.min(maxVal, Number(stripped));
  return Number.isNaN(num) ? "" : num;
}

function toSafeNumber(value, fallback = 0, maxVal = 100000) {
  if (value === "" || value === null || value === undefined) return fallback;
  const num = Number(value);
  if (Number.isNaN(num) || num < 0) return fallback;
  return Math.min(maxVal, Math.round(num));
}

function syncStandardBanners(prev, nextFields) {
  const nextThreshold = toSafeNumber(
    nextFields.freeShippingThreshold ?? prev.freeShippingThreshold,
    0,
    100000
  );
  const nextPct = toSafeNumber(
    nextFields.discountPercent ?? prev.discountPercent,
    0,
    80
  );
  const nextMin = toSafeNumber(
    nextFields.discountMinSubtotal ?? prev.discountMinSubtotal,
    0,
    100000
  );
  const nextDiscountActive =
    nextFields.discountActive !== undefined
      ? Boolean(nextFields.discountActive)
      : Boolean(prev.discountActive);

  const banners = (prev.banners || []).map((b) => {
    if (b.id === "free-delivery" && "freeShippingThreshold" in nextFields) {
      return {
        ...b,
        text: `on orders of ₹${nextThreshold} or more`,
      };
    }
    if (
      b.id === "ten-percent-off" &&
      ("discountPercent" in nextFields ||
        "discountMinSubtotal" in nextFields ||
        "discountActive" in nextFields)
    ) {
      return {
        ...b,
        badge: `Flat ${nextPct}% Off`,
        text: `auto-applied on ₹${nextMin} or more`,
        active: nextDiscountActive,
      };
    }
    return b;
  });

  return {
    ...prev,
    ...nextFields,
    banners,
  };
}

function describeOfferChanges(before, after) {
  if (!before || !after) return [];
  const changes = [];

  if (Number(before.freeShippingThreshold) !== Number(after.freeShippingThreshold)) {
    changes.push({
      label: "Free Delivery Threshold",
      detail: `₹${before.freeShippingThreshold} → ₹${after.freeShippingThreshold}`,
    });
  }

  if (Number(before.standardShippingFee) !== Number(after.standardShippingFee)) {
    changes.push({
      label: "Standard Shipping Fee",
      detail: `₹${before.standardShippingFee} → ₹${after.standardShippingFee}`,
    });
  }

  if (Boolean(before.discountActive) !== Boolean(after.discountActive)) {
    changes.push({
      label: "Automatic Discount Status",
      detail: `${before.discountActive ? "Active" : "Paused"} → ${after.discountActive ? "Active" : "Paused"}`,
    });
  }

  if (
    Number(before.discountPercent) !== Number(after.discountPercent) ||
    Number(before.discountMinSubtotal) !== Number(after.discountMinSubtotal)
  ) {
    changes.push({
      label: "Automatic Discount Offer",
      detail: `${before.discountPercent}% off on ₹${before.discountMinSubtotal}+ → ${after.discountPercent}% off on ₹${after.discountMinSubtotal}+`,
    });
  }

  const prevBanners = Array.isArray(before.banners) ? before.banners : [];
  const nextBanners = Array.isArray(after.banners) ? after.banners : [];
  const prevById = new Map(prevBanners.map((b) => [b.id, b]));
  const nextById = new Map(nextBanners.map((b) => [b.id, b]));

  nextBanners.forEach((b, idx) => {
    const prev = prevById.get(b.id);
    if (!prev) {
      changes.push({
        label: `Added Banner Slide #${idx + 1}`,
        detail: `${b.badge} — ${b.text}`,
      });
      return;
    }

    const parts = [];
    if (prev.badge !== b.badge) parts.push(`badge "${prev.badge}" → "${b.badge}"`);
    if (prev.text !== b.text) parts.push(`text "${prev.text}" → "${b.text}"`);
    if ((prev.active !== false) !== (b.active !== false)) {
      parts.push(b.active !== false ? "shown on banner" : "hidden from banner");
    }
    if ((prev.link || "/products") !== (b.link || "/products")) {
      parts.push(`link → ${b.link || "/products"}`);
    }
    if (parts.length > 0) {
      changes.push({
        label: `Updated Slide #${idx + 1}`,
        detail: parts.join(", "),
      });
    }
  });

  prevBanners.forEach((b) => {
    if (!nextById.has(b.id)) {
      changes.push({
        label: "Removed Banner Slide",
        detail: `${b.badge} — ${b.text}`,
      });
    }
  });

  if (
    changes.length === 0 &&
    JSON.stringify(prevBanners.map((b) => b.id)) !==
      JSON.stringify(nextBanners.map((b) => b.id))
  ) {
    changes.push({
      label: "Banner Slide Order",
      detail: "Updated top banner rotation order",
    });
  }

  return changes;
}

function formatOfferApiError(err, fallback) {
  const msg = err?.message || fallback;
  if (/API endpoint not found/i.test(msg)) {
    return `${msg} — Please restart your backend server (npm run server) or deploy the latest server update so /api/admin/offers is loaded.`;
  }
  return msg;
}

export default function AdminOffers() {
  const { token } = useAuth();
  const { applyOffersSnapshot, refreshOffers } = useOffers();

  const [form, setForm] = useState(DEFAULT_OFFERS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [previewPaused, setPreviewPaused] = useState(false);
  const publishedSnapshotRef = useRef(DEFAULT_OFFERS);

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      try {
        const data = await fetchAdminOffers(token);
        if (!ignore && data) {
          const normalized = {
            freeShippingThreshold: Number(data.freeShippingThreshold ?? 499),
            standardShippingFee: Number(data.standardShippingFee ?? 80),
            discountActive: Boolean(data.discountActive ?? true),
            discountPercent: Number(data.discountPercent ?? 10),
            discountMinSubtotal: Number(data.discountMinSubtotal ?? 999),
            banners: Array.isArray(data.banners) ? data.banners : [],
          };
          publishedSnapshotRef.current = normalized;
          setForm(normalized);
        }
      } catch (err) {
        if (!ignore) {
          setFeedback({
            type: "error",
            message: formatOfferApiError(err, "Failed to load offers."),
          });
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [token]);

  useEffect(() => {
    if (!confirmModal) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setConfirmModal(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [confirmModal]);

  const handleRuleNumberChange = (field, rawValue, maxVal) => {
    const nextVal = normalizeNumericInput(rawValue, maxVal);
    setForm((prev) => syncStandardBanners(prev, { [field]: nextVal }));
  };

  const handleRuleNumberBlur = (field, fallback, maxVal) => {
    setForm((prev) => {
      const coerced = toSafeNumber(prev[field], fallback, maxVal);
      if (prev[field] === coerced) return prev;
      return syncStandardBanners(prev, { [field]: coerced });
    });
  };

  const handleBannerChange = (idx, field, value) => {
    setForm((prev) => {
      const next = [...prev.banners];
      next[idx] = { ...next[idx], [field]: value };
      return { ...prev, banners: next };
    });
  };

  const handleAddBanner = () => {
    setForm((prev) => ({
      ...prev,
      banners: [
        ...prev.banners,
        {
          id: `offer-${Date.now()}`,
          badge: "Limited Offer",
          text: "Explore luxury decants starting ₹149",
          icon: "sparkles",
          link: "/products",
          active: true,
        },
      ],
    }));
  };

  const handleDeleteBanner = (idx) => {
    setForm((prev) => ({
      ...prev,
      banners: prev.banners.filter((_, i) => i !== idx),
    }));
  };

  const handleMoveBanner = (idx, delta) => {
    const target = idx + delta;
    if (target < 0 || target >= form.banners.length) return;
    setForm((prev) => {
      const next = [...prev.banners];
      [next[idx], next[target]] = [next[target], next[idx]];
      return { ...prev, banners: next };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    const payload = {
      ...form,
      freeShippingThreshold: toSafeNumber(form.freeShippingThreshold, 0, 100000),
      standardShippingFee: toSafeNumber(form.standardShippingFee, 0, 2000),
      discountPercent: toSafeNumber(form.discountPercent, 0, 80),
      discountMinSubtotal: toSafeNumber(form.discountMinSubtotal, 0, 100000),
    };

    try {
      const previous = publishedSnapshotRef.current;
      const res = await updateAdminOffers(token, payload);
      const saved = res?.config || payload;
      const changes = describeOfferChanges(previous, saved);
      publishedSnapshotRef.current = saved;
      setForm(saved);
      applyOffersSnapshot(saved);
      refreshOffers();
      setFeedback({
        type: "success",
        message: "Offers saved & published live across your homepage banner, Cart, and Checkout.",
      });
      setConfirmModal({
        changes,
        savedConfig: saved,
      });
    } catch (err) {
      setFeedback({
        type: "error",
        message: formatOfferApiError(err, "Could not save offer changes."),
      });
    } finally {
      setSaving(false);
    }
  };

  const activeBanners = form.banners.filter((b) => b.active !== false);
  const safePreviewIdx = activeBanners.length > 0 ? previewIndex % activeBanners.length : 0;
  const currentPreviewBanner = activeBanners[safePreviewIdx] || null;

  useEffect(() => {
    if (previewPaused || activeBanners.length <= 1) return;
    const timer = window.setInterval(() => {
      setPreviewIndex((prev) => (prev + 1) % activeBanners.length);
    }, 2400);
    return () => window.clearInterval(timer);
  }, [previewPaused, activeBanners.length]);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#c6a15b] border-t-transparent mb-3" />
        <p className="text-xs uppercase tracking-wider text-[#8e8a82]">
          Loading store offers...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#c6a15b]">
            Promotions &amp; Banner Control
          </p>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl text-[#f4efe6]">
            Offers &amp; Delivery Rules
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#8e8a82]">
            Add, edit, or toggle sliding offers on your top banner and control automatic Cart &amp; Checkout discounts.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#c6a15b] hover:bg-[#d8c08a] text-[#11110f] px-6 py-3 text-xs font-semibold uppercase tracking-widest transition cursor-pointer disabled:opacity-50 shrink-0"
        >
          <Save size={15} />
          <span>{saving ? "Publishing..." : "Save & Publish"}</span>
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`flex items-center gap-3 rounded-2xl border p-4 text-xs ${
            feedback.type === "success"
              ? "border-[#c6a15b]/40 bg-[#c6a15b]/10 text-[#d8c08a]"
              : "border-[#b8845a]/40 bg-[#1a1612] text-[#eadbc8]"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 size={16} className="text-[#c6a15b] shrink-0" />
          ) : (
            <AlertTriangle size={16} className="text-[#d49a6a] shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* ─── Section 1: Cart & Checkout Rules ─── */}
      <section className="rounded-2xl border border-white/10 bg-[#171715] p-6 space-y-6">
        <div>
          <h2 className="font-display text-xl text-[#f4efe6]">
            Automatic Cart &amp; Checkout Rules
          </h2>
          <p className="text-xs text-[#8e8a82] mt-1">
            These thresholds apply automatically to Cart totals, Checkout summaries, and Razorpay payments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free Delivery Rule Card */}
          <div className="rounded-2xl border border-white/10 bg-[#11110f] p-5 space-y-4">
            <div className="flex items-center gap-2.5 text-sm font-semibold text-[#f4efe6]">
              <Truck size={16} className="text-[#c6a15b]" />
              <span>Free Delivery Threshold</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#8e8a82] mb-1.5">
                  Free Delivery At (₹)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.freeShippingThreshold}
                  onChange={(e) =>
                    handleRuleNumberChange("freeShippingThreshold", e.target.value, 100000)
                  }
                  onBlur={() => handleRuleNumberBlur("freeShippingThreshold", 0, 100000)}
                  placeholder="499"
                  className="w-full rounded-xl border border-white/15 bg-[#171715] px-3 py-2.5 text-sm text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#8e8a82] mb-1.5">
                  Shipping Below Threshold (₹)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.standardShippingFee}
                  onChange={(e) =>
                    handleRuleNumberChange("standardShippingFee", e.target.value, 2000)
                  }
                  onBlur={() => handleRuleNumberBlur("standardShippingFee", 0, 2000)}
                  placeholder="80"
                  className="w-full rounded-xl border border-white/15 bg-[#171715] px-3 py-2.5 text-sm text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none"
                />
              </div>
            </div>

            <p className="text-[11px] text-[#8e8a82]">
              Orders of <strong className="text-[#d8c08a]">₹{toSafeNumber(form.freeShippingThreshold, 0, 100000)}+</strong> ship free; orders below pay <strong className="text-[#f4efe6]">₹{toSafeNumber(form.standardShippingFee, 0, 2000)}</strong>.
            </p>
          </div>

          {/* Automatic Percentage Discount Card */}
          <div className="rounded-2xl border border-white/10 bg-[#11110f] p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm font-semibold text-[#f4efe6]">
                <span>Automatic Percentage Discount</span>
              </div>

              <button
                type="button"
                onClick={() =>
                  setForm((p) =>
                    syncStandardBanners(p, { discountActive: !p.discountActive })
                  )
                }
                className={`shrink-0 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border transition cursor-pointer ${
                  form.discountActive
                    ? "border-[#c6a15b] bg-[#c6a15b]/20 text-[#d8c08a]"
                    : "border-white/15 bg-white/5 text-[#8e8a82]"
                }`}
              >
                {form.discountActive ? "Active" : "Paused"}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#8e8a82] mb-1.5">
                  Discount (%)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  disabled={!form.discountActive}
                  value={form.discountPercent}
                  onChange={(e) =>
                    handleRuleNumberChange("discountPercent", e.target.value, 80)
                  }
                  onBlur={() => handleRuleNumberBlur("discountPercent", 0, 80)}
                  placeholder="10"
                  className="w-full rounded-xl border border-white/15 bg-[#171715] px-3 py-2.5 text-sm text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none disabled:opacity-40"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#8e8a82] mb-1.5">
                  Minimum Order (₹)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  disabled={!form.discountActive}
                  value={form.discountMinSubtotal}
                  onChange={(e) =>
                    handleRuleNumberChange("discountMinSubtotal", e.target.value, 100000)
                  }
                  onBlur={() => handleRuleNumberBlur("discountMinSubtotal", 0, 100000)}
                  placeholder="999"
                  className="w-full rounded-xl border border-white/15 bg-[#171715] px-3 py-2.5 text-sm text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none disabled:opacity-40"
                />
              </div>
            </div>

            <p className="text-[11px] text-[#8e8a82]">
              {form.discountActive && toSafeNumber(form.discountPercent, 0, 80) > 0 ? (
                <>
                  Applies <strong className="text-[#d8c08a]">{toSafeNumber(form.discountPercent, 0, 80)}% OFF</strong> automatically on orders{" "}
                  <strong className="text-[#f4efe6]">₹{toSafeNumber(form.discountMinSubtotal, 0, 100000)}+</strong>.
                </>
              ) : (
                "Order discount is currently paused."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ─── Section 2: Top Sliding Offer Banners ─── */}
      <section className="rounded-2xl border border-white/10 bg-[#171715] p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl text-[#f4efe6]">
              Top Sliding Offer Banner ({activeBanners.length} Active)
            </h2>
            <p className="text-xs text-[#8e8a82] mt-1">
              Add slides or temporarily pause seasonal offers — active slides rotate automatically every 2.4 seconds at the top of your website.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddBanner}
            className="inline-flex items-center gap-2 rounded-2xl border border-[#c6a15b]/50 bg-[#c6a15b]/10 hover:bg-[#c6a15b] text-[#d8c08a] hover:text-[#11110f] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition cursor-pointer shrink-0"
          >
            <Plus size={14} />
            <span>Add Offer Slide</span>
          </button>
        </div>

        {/* Live Top Storefront Banner Preview (cycles all active slides in real time) */}
        {currentPreviewBanner && (
          <div
            onMouseEnter={() => setPreviewPaused(true)}
            onMouseLeave={() => setPreviewPaused(false)}
            className="rounded-xl border border-[#c6a15b]/40 bg-gradient-to-r from-[#17130d] via-[#241d12] to-[#17130d] px-4 py-3.5 shadow-[0_4px_20px_rgba(198,161,91,0.1)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
              <p className="text-[9px] uppercase tracking-[0.22em] text-[#c6a15b]">
                Live Storefront Bar Preview • Slide {safePreviewIdx + 1} of {activeBanners.length}
              </p>

              {activeBanners.length > 1 && (
                <div className="flex items-center gap-1.5">
                  {activeBanners.map((b, i) => (
                    <button
                      key={b.id || i}
                      type="button"
                      onClick={() => setPreviewIndex(i)}
                      className={`px-2 py-0.5 rounded-full text-[9px] font-mono uppercase transition cursor-pointer ${
                        i === safePreviewIdx
                          ? "bg-[#c6a15b] text-[#11110f] font-bold"
                          : "border border-white/15 bg-black/30 text-[#8e8a82] hover:text-[#f4efe6]"
                      }`}
                    >
                      #{i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                disabled={activeBanners.length <= 1}
                onClick={() =>
                  setPreviewIndex(
                    (prev) => (prev - 1 + activeBanners.length) % activeBanners.length
                  )
                }
                aria-label="Preview previous slide"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#c6a15b]/35 bg-[#14120e]/80 text-[#d8c08a] hover:border-[#c6a15b] hover:bg-[#c6a15b]/20 transition cursor-pointer disabled:opacity-30 disabled:cursor-default"
              >
                <ChevronLeft size={14} />
              </button>

              <div className="flex-1 flex justify-center">
                <BannerPillPreview banner={currentPreviewBanner} />
              </div>

              <button
                type="button"
                disabled={activeBanners.length <= 1}
                onClick={() =>
                  setPreviewIndex((prev) => (prev + 1) % activeBanners.length)
                }
                aria-label="Preview next slide"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#c6a15b]/35 bg-[#14120e]/80 text-[#d8c08a] hover:border-[#c6a15b] hover:bg-[#c6a15b]/20 transition cursor-pointer disabled:opacity-30 disabled:cursor-default"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Banner Rows */}
        {form.banners.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-xs text-[#8e8a82]">
            No banner slides added yet. Click &ldquo;Add Offer Slide&rdquo; to create your first announcement offer.
          </div>
        ) : (
          <div className="space-y-4">
            {form.banners.map((banner, idx) => (
              <div
                key={banner.id || idx}
                className={`rounded-2xl border p-4 sm:p-5 transition ${
                  banner.active !== false
                    ? "border-white/15 bg-[#11110f]"
                    : "border-white/5 bg-[#11110f]/50 opacity-65"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-[#c6a15b]">
                      Slide #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleBannerChange(idx, "active", banner.active === false)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border transition cursor-pointer ${
                        banner.active !== false
                          ? "border-[#c6a15b]/40 bg-[#c6a15b]/10 text-[#d8c08a]"
                          : "border-white/15 bg-white/5 text-[#8e8a82]"
                      }`}
                    >
                      {banner.active !== false ? <Eye size={11} /> : <EyeOff size={11} />}
                      <span>{banner.active !== false ? "Visible" : "Hidden"}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveBanner(idx, -1)}
                      className="p-1.5 rounded-lg border border-white/10 text-[#c5c1b9] hover:border-[#c6a15b] hover:text-[#f4efe6] disabled:opacity-30 cursor-pointer"
                      title="Move up"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      type="button"
                      disabled={idx === form.banners.length - 1}
                      onClick={() => handleMoveBanner(idx, 1)}
                      className="p-1.5 rounded-lg border border-white/10 text-[#c5c1b9] hover:border-[#c6a15b] hover:text-[#f4efe6] disabled:opacity-30 cursor-pointer"
                      title="Move down"
                    >
                      <ArrowDown size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteBanner(idx)}
                      className="p-1.5 rounded-lg border border-white/10 text-[#8e8a82] hover:border-[#b8845a] hover:text-[#d8c08a] cursor-pointer"
                      title="Delete slide"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Per-Slide Real-Time Live Preview */}
                <div className="mb-4 rounded-xl border border-[#c6a15b]/25 bg-gradient-to-r from-[#17130d] via-[#211a10] to-[#171715] px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#8e8a82] shrink-0">
                    Slide #{idx + 1} Live Preview
                    {banner.active === false ? " (Hidden)" : ""}
                  </span>
                  <div className="flex-1 flex justify-start sm:justify-end">
                    <BannerPillPreview banner={banner} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#8e8a82] mb-1.5">
                      Gold Pill Badge
                    </label>
                    <input
                      type="text"
                      maxLength={40}
                      required
                      value={banner.badge}
                      onChange={(e) => handleBannerChange(idx, "badge", e.target.value)}
                      placeholder="e.g. Free Delivery"
                      className="w-full rounded-xl border border-white/15 bg-[#171715] px-3 py-2 text-xs text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase tracking-wider text-[#8e8a82] mb-1.5">
                      Offer Text
                    </label>
                    <input
                      type="text"
                      maxLength={140}
                      required
                      value={banner.text}
                      onChange={(e) => handleBannerChange(idx, "text", e.target.value)}
                      placeholder="e.g. on orders of ₹499 or more"
                      className="w-full rounded-xl border border-white/15 bg-[#171715] px-3 py-2 text-xs text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#8e8a82] mb-1.5">
                      Badge Icon
                    </label>
                    <select
                      value={banner.icon || "sparkles"}
                      onChange={(e) => handleBannerChange(idx, "icon", e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-[#171715] px-3 py-2 text-xs text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none"
                    >
                      {ICON_OPTIONS.map((opt) => (
                        <option key={opt.id} value={opt.id} className="bg-[#171715]">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-[10px] uppercase tracking-wider text-[#8e8a82] mb-1.5">
                    Destination Page When Clicked
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <select
                      value={LINK_PRESETS.some((p) => p.value === banner.link) ? banner.link : "custom"}
                      onChange={(e) => {
                        if (e.target.value !== "custom") {
                          handleBannerChange(idx, "link", e.target.value);
                        }
                      }}
                      className="rounded-xl border border-white/15 bg-[#171715] px-3 py-2 text-xs text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none"
                    >
                      {LINK_PRESETS.map((p) => (
                        <option key={p.value} value={p.value} className="bg-[#171715]">
                          {p.label}
                        </option>
                      ))}
                      <option value="custom" className="bg-[#171715]">
                        Custom route...
                      </option>
                    </select>

                    <input
                      type="text"
                      value={banner.link || "/products"}
                      onChange={(e) => handleBannerChange(idx, "link", e.target.value)}
                      placeholder="/products"
                      className="flex-1 rounded-xl border border-white/15 bg-[#171715] px-3 py-2 text-xs font-mono text-[#c5c1b9] focus:border-[#c6a15b] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Confirmation Pop-up Modal */}
      {confirmModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
          onClick={() => setConfirmModal(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="offers-saved-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl border border-[#c6a15b]/45 bg-[#171715] p-6 sm:p-7 shadow-[0_24px_80px_rgba(0,0,0,0.8)] space-y-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#c6a15b]/40 bg-[#c6a15b]/15 text-[#c6a15b]">
                  <CheckCircle2 size={22} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#c6a15b]">
                    Storefront Updated
                  </p>
                  <h3
                    id="offers-saved-title"
                    className="font-display text-2xl text-[#f4efe6]"
                  >
                    Offers Saved &amp; Published Live
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                aria-label="Close confirmation"
                className="rounded-xl border border-white/10 p-1.5 text-[#8e8a82] hover:border-[#c6a15b]/50 hover:text-[#f4efe6] transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#11110f] p-4 space-y-2.5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#8e8a82]">
                Summary of Changes
              </p>

              {confirmModal.changes.length > 0 ? (
                <ul className="space-y-2 text-xs">
                  {confirmModal.changes.map((item, i) => (
                    <li
                      key={`${item.label}-${i}`}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 rounded-xl border border-white/5 bg-[#171715]/80 px-3 py-2"
                    >
                      <span className="font-medium text-[#d8c08a]">{item.label}</span>
                      <span className="text-[#f4efe6]">{item.detail}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-[#c5c1b9]">
                  All current offer rules and banner slides were confirmed and published live.
                </p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-center text-[11px]">
              <div className="rounded-xl border border-white/10 bg-[#11110f] p-2.5">
                <p className="text-[9px] uppercase tracking-wider text-[#8e8a82]">Free Delivery</p>
                <p className="mt-0.5 font-semibold text-[#d8c08a]">
                  ₹{confirmModal.savedConfig.freeShippingThreshold}+
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#11110f] p-2.5">
                <p className="text-[9px] uppercase tracking-wider text-[#8e8a82]">Order Discount</p>
                <p className="mt-0.5 font-semibold text-[#d8c08a]">
                  {confirmModal.savedConfig.discountActive
                    ? `${confirmModal.savedConfig.discountPercent}% on ₹${confirmModal.savedConfig.discountMinSubtotal}+`
                    : "Paused"}
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#11110f] p-2.5">
                <p className="text-[9px] uppercase tracking-wider text-[#8e8a82]">Live Banners</p>
                <p className="mt-0.5 font-semibold text-[#f4efe6]">
                  {(confirmModal.savedConfig.banners || []).filter((b) => b.active !== false).length} Active
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-1">
              <Link
                to="/"
                onClick={() => setConfirmModal(null)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#c6a15b]/50 bg-[#c6a15b]/10 hover:bg-[#c6a15b]/20 text-[#d8c08a] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition"
              >
                <ExternalLink size={14} />
                <span>View Homepage</span>
              </Link>
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="inline-flex items-center justify-center rounded-2xl bg-[#c6a15b] hover:bg-[#d8c08a] text-[#11110f] px-6 py-2.5 text-xs font-semibold uppercase tracking-widest transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
