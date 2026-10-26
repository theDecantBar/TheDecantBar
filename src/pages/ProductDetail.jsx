
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Check,
  Plus,
  Minus,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  Droplets,
  Crown,
  Snowflake,
  Sun,
  Leaf,
  Flame,
  ArrowRight,
  Bell,
  XCircle,
  Send,
} from "lucide-react";
import Container from "../components/ui/Container";
import { useCart } from "../context/CartContext";
import { getPerfumeProfile } from "../data/perfumeNotes";
import MainAccords from "../components/product/MainAccords";
import WhenToWear from "../components/product/WhenToWear";
import PerfumePyramid from "../components/product/PerfumePyramid";
import ProductImage from "../components/common/ProductImage";

const SPRAY_ESTIMATES = {
  2: "~30 sprays · ~7–10 days of wear",
  5: "~75 sprays · ~20–25 days of wear",
  10: "~150 sprays · 1+ month of daily wear",
  20: "~300 sprays · 2–3 months of wear",
  50: "~750 sprays · 6+ months signature supply",
};

/**
 * Condenses fragrance descriptions to 1–2 brief sentences
 * while preserving key notes, scent character, and season.
 */
function getShortDescription(rawDesc, profile, product) {
  if (!rawDesc) {
    if (profile?.vibe) {
      return `${product?.name || "This fragrance"} features ${profile.vibe.toLowerCase()}, crafted for ${product?.weather || "all-season"} wear.`;
    }
    return "";
  }

  const trimmed = rawDesc.trim();
  const words = trimmed.split(/\s+/);

  if (words.length <= 32) {
    return trimmed;
  }

  if (/Opens with vibrant top notes of/i.test(trimmed)) {
    const parts = trimmed.split(/(?<=[.!?])\s+/);
    let firstSentence = parts[0] || "";

    firstSentence = firstSentence
      .replace(/EXTRAIT DE PARFUM/gi, "Extrait de Parfum")
      .replace(/\bEDP\b/g, "Eau de Parfum")
      .replace(/\bEDT\b/g, "Eau de Toilette");

    const topNote = profile?.topNotes?.[0] || "";
    const heartNote =
      profile?.middleNotes?.[0] || profile?.heartNotes?.[0] || "";
    const baseNote = profile?.baseNotes?.[0] || "";

    if (topNote && baseNote) {
      const secondSentence = `Opens with ${topNote}${heartNote ? ` and ${heartNote}` : ""}, resting on an authentic ${baseNote} base.`;
      const combined = `${firstSentence} ${secondSentence}`;

      if (combined.split(/\s+/).length <= 32) {
        return combined;
      }
    }

    return firstSentence;
  }

  const sentences = trimmed.split(/(?<=[.!?])\s+/);

  if (sentences.length >= 2) {
    const two = `${sentences[0]} ${sentences[1]}`.trim();

    if (two.split(/\s+/).length <= 32) {
      return two;
    }

    if (sentences[0].split(/\s+/).length <= 32) {
      return sentences[0];
    }
  }

  return words.slice(0, 28).join(" ") + "...";
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Notify Me When In Stock State
  const [notifyModalOpen, setNotifyModalOpen] = useState(false);
  const [notifyContact, setNotifyContact] = useState("");
  const [notifyLoading, setNotifyLoading] = useState(false);
  const [notifySubmitted, setNotifySubmitted] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProduct() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`/api/products/${id}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Fragrance not found");
        }

        const data = await response.json();
        setProduct(data);

        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error fetching product detail:", err);
          setError("Could not load fragrance details. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProduct();

    return () => controller.abort();
  }, [id]);

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    addToCart(product, selectedVariant, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleBuyNow = () => {
    if (!product || !selectedVariant) return;

    addToCart(product, selectedVariant, quantity);
    navigate("/checkout");
  };

  const handleNotifySubmit = async (e) => {
    e.preventDefault();

    if (!notifyContact.trim() || !product) return;

    setNotifyLoading(true);

    try {
      const response = await fetch("/api/products/notify-restock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          variantId: selectedVariant?.id,
          contactInfo: notifyContact.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to register notification request");
      }

      setNotifySubmitted(true);
      setNotifyContact("");
    } catch (err) {
      console.error("Notify error:", err);
      alert("Could not register notification request. Please try again.");
    } finally {
      setNotifyLoading(false);
    }
  };

  // Keep the screen blank while the product loads.
  // The loading message and spinner have been removed.
  if (loading) {
    return (
      <div
        className="min-h-screen bg-[#11110f]"
        aria-label="Loading product"
      />
    );
  }

  if (error || !product) {
    return (
      <Container className="py-24">
        <div className="mx-auto max-w-md py-12 text-center">
          <p className="mb-6 text-sm text-red-400">
            {error || "Fragrance not found"}
          </p>

          <Link
            to="/products"
            className="rounded-2xl inline-flex items-center gap-2 border border-[#c6a15b] bg-[#c6a15b] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#11110f] transition hover:bg-[#d8c08a]"
          >
            <ArrowLeft size={14} />
            Back to Collection
          </Link>
        </div>
      </Container>
    );
  }

  const isSoldOut = selectedVariant
    ? Number(selectedVariant.stock ?? 10) <= 0
    : false;

  const currentPrice = selectedVariant
    ? Number(selectedVariant.price)
    : 0;

  const genderLabel =
    product.gender === "M/W"
      ? "Unisex"
      : product.gender === "M"
      ? "Men"
      : product.gender === "W"
      ? "Women"
      : product.gender || "Fragrance";

  const defaultProfile = getPerfumeProfile(
    product.name,
    product.category,
    product.weather,
    product.type,
    product.gender
  );

  const parseJsonField = (val, fallback) => {
    if (!val) return fallback;
    if (typeof val === "object") return val;

    try {
      return JSON.parse(val);
    } catch {
      return fallback;
    }
  };

  const dbAccords = parseJsonField(product.accords, null);
  const dbWhenToWear = parseJsonField(product.when_to_wear, null);

  const profile = {
    ...defaultProfile,

    topNotes:
      Array.isArray(product.top_notes) && product.top_notes.length > 0
        ? product.top_notes
        : defaultProfile.topNotes,

    middleNotes:
      Array.isArray(product.middle_notes) && product.middle_notes.length > 0
        ? product.middle_notes
        : defaultProfile.middleNotes,

    baseNotes:
      Array.isArray(product.base_notes) && product.base_notes.length > 0
        ? product.base_notes
        : defaultProfile.baseNotes,

    accords:
      Array.isArray(dbAccords) && dbAccords.length > 0
        ? dbAccords
        : defaultProfile.accords,

    vibe:
      product.vibe && product.vibe.trim()
        ? product.vibe.trim()
        : defaultProfile.vibe,

    longevity:
      product.longevity && product.longevity.trim()
        ? product.longevity.trim()
        : defaultProfile.longevity,

    projection:
      product.projection && product.projection.trim()
        ? product.projection.trim()
        : defaultProfile.projection,

    whenToWear:
      dbWhenToWear && Object.keys(dbWhenToWear).length > 0
        ? dbWhenToWear
        : defaultProfile.whenToWear,

    description:
      product.description && product.description.trim()
        ? product.description
        : defaultProfile.description,
  };

  const shortDescription = getShortDescription(
    profile.description,
    profile,
    product
  );

  // Season icon helper
  const weatherLower = (product.weather || "").toLowerCase();

  const SeasonIcon = weatherLower.includes("all")
    ? Sparkles
    : weatherLower.includes("winter")
    ? Snowflake
    : weatherLower.includes("summer")
    ? Sun
    : Leaf;

  return (
    <Container className="py-6 sm:py-10">
      {/* Breadcrumb Navigation */}
      <nav className="mb-5 flex items-center gap-2 text-xs text-[#8e8a82]">
        <Link to="/" className="transition-colors hover:text-[#c6a15b]">
          Home
        </Link>

        <span>/</span>

        <Link
          to="/products"
          className="transition-colors hover:text-[#c6a15b]"
        >
          Collection
        </Link>

        <span>/</span>

        <span className="max-w-[200px] truncate text-[#f4efe6] sm:max-w-none">
          {product.name}
        </span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[420px_1fr] lg:gap-10">
        {/* Left Column: Fragrance Image */}
        <div className="w-full">
          <div className="sticky top-28">
            <div className="group w-full max-w-[400px] sm:max-w-[420px]">
              <ProductImage
                src={product.image_url}
                alt={product.name}
                aspectRatio="aspect-[4/5]"
                paddingClassName="p-[15px]"
                containerClassName="rounded-lg shadow-xl"
              >
                {isSoldOut && (
                  <div className="rounded-2xl absolute right-4 top-4 z-10 border border-red-800/70 bg-red-950/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-red-300 shadow-lg backdrop-blur-md">
                    Sold Out
                  </div>
                )}
              </ProductImage>
            </div>

            {/* Trust Highlights */}
            <div className="mt-4 grid max-w-[400px] grid-cols-2 gap-3 text-xs text-[#8e8a82] sm:max-w-[420px]">
              <div className="rounded-2xl flex items-center gap-2 border border-white/10 bg-[#151512] p-3">
                <ShieldCheck
                  size={16}
                  className="shrink-0 text-[#c6a15b]"
                />
                <span>100% Genuine Formula</span>
              </div>

              <div className="rounded-2xl flex items-center gap-2 border border-white/10 bg-[#151512] p-3">
                <Sparkles
                  size={16}
                  className="shrink-0 text-[#c6a15b]"
                />
                <span>Precision Glass Spray</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Product Information */}
        <div className="flex min-w-0 flex-col">
          {/* Category & Gender */}
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#c6a15b]">
              {product.category || "Designer"}
            </span>

            <span className="h-1 w-1 rounded-full bg-white/20" />

            <span className="text-[11px] uppercase tracking-wider text-[#8e8a82]">
              {genderLabel}
            </span>
          </div>

          {/* Fragrance Name */}
          <h1 className="mt-2 font-display text-2xl leading-tight tracking-tight text-[#f4efe6] sm:text-3xl lg:text-4xl">
            {product.name}
          </h1>

          {/* Short Description */}
          {shortDescription && (
            <p className="mt-3 border-l-2 border-[#c6a15b] py-0.5 pl-3 text-xs leading-relaxed text-[#c5c1b9] sm:text-[13px]">
              {shortDescription}
            </p>
          )}

          {/* Two-Column Purchase Area: Purchase Card (Left) & Specifications (Right) */}
          <div className="mt-4 grid grid-cols-1 items-start gap-4 lg:grid-cols-2 lg:gap-5">
            {/* Left Column: Purchase & Decant Sizing Card */}
            <div className="w-full rounded-2xl border border-[#c6a15b]/30 bg-[#151512] p-4 shadow-lg sm:p-4.5">
              {/* Price & Size */}
              <div className="flex items-baseline justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <span className="mb-0.5 block text-[10px] uppercase tracking-wider text-[#8e8a82]">
                    Price
                  </span>

                  <span className="font-display text-2xl text-[#f4efe6] sm:text-3xl">
                    ₹{currentPrice * quantity}
                  </span>
                </div>

                {selectedVariant && (
                  <span className="rounded border border-[#c6a15b]/30 bg-[#c6a15b]/10 px-2 py-0.5 text-right text-[11px] font-medium text-[#c6a15b] sm:text-xs">
                    {quantity > 1 ? `${quantity} × ` : ""}
                    {selectedVariant.size_ml}ml Decant Atomizer
                  </span>
                )}
              </div>

              {/* Decant Size Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="mt-3">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-[#f4efe6] sm:text-xs">
                      Select Decant Size
                    </span>

                    {selectedVariant &&
                      SPRAY_ESTIMATES[selectedVariant.size_ml] && (
                        <span className="text-[11px] text-[#c6a15b]">
                          {SPRAY_ESTIMATES[selectedVariant.size_ml]}
                        </span>
                      )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {product.variants.map((variant) => {
                      const isSelected =
                        selectedVariant?.id === variant.id;

                      const variantSoldOut =
                        Number(variant.stock ?? 0) <= 0;

                      return (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => setSelectedVariant(variant)}
                          className={`rounded-2xl relative flex cursor-pointer flex-col items-center justify-center border px-2 py-1.5 transition sm:px-2.5 sm:py-2 ${
                            isSelected
                              ? "border-[#c6a15b] bg-[#c6a15b]/15 text-[#f4efe6] shadow-[0_0_8px_rgba(198,161,91,0.2)]"
                              : "border-white/15 bg-[#171715] text-[#c5c1b9] hover:border-[#c6a15b]/60"
                          }`}
                        >
                          <span className="text-xs font-semibold tracking-wider sm:text-[13px]">
                            {variant.size_ml} ml
                          </span>

                          <span className="mt-0.5 text-[11px] sm:text-xs">
                            {variantSoldOut ? (
                              <span className="font-semibold tracking-tight text-red-400">
                                Sold Out
                              </span>
                            ) : (
                              <span className="text-[#c6a15b]">
                                ₹{variant.price}
                              </span>
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <p className="mt-1.5 text-[10px] text-[#8e8a82]">
                    *High-grade fine-mist atomizers deliver approx. 15 sprays per 1ml.
                  </p>
                </div>
              )}

              {/* Quantity Selector & Action Buttons */}
              {isSoldOut ? (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between rounded-2xl border border-red-500/30 bg-red-950/30 p-2.5 text-xs">
                    <div className="flex items-center gap-2 text-red-300">
                      <XCircle size={14} className="shrink-0 text-red-400" />
                      <span>
                        This {selectedVariant?.size_ml}ml decant size is
                        currently <strong>Sold Out</strong>.
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setNotifySubmitted(false);
                      setNotifyModalOpen(true);
                    }}
                    className="flex h-9.5 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-[#c6a15b] bg-[#c6a15b] text-[11px] font-semibold uppercase tracking-[0.18em] text-[#11110f] shadow-md transition hover:bg-[#d8c08a] sm:h-10 sm:text-xs"
                  >
                    <Bell size={14} />
                    Notify Me When Available
                  </button>
                </div>
              ) : (
                <div className="mt-3.5 space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    {/* Quantity Stepper */}
                    <div className="rounded-2xl flex h-9.5 shrink-0 items-center border border-white/15 bg-[#171715] sm:h-10">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() =>
                          setQuantity((q) => Math.max(1, q - 1))
                        }
                        className="rounded-2xl flex h-full w-8 cursor-pointer items-center justify-center text-[#c5c1b9] transition-colors hover:text-[#c6a15b] sm:w-9"
                      >
                        <Minus size={13} />
                      </button>

                      <span className="w-7 text-center text-xs font-semibold text-[#f4efe6] sm:text-[13px]">
                        {quantity}
                      </span>

                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => setQuantity((q) => q + 1)}
                        className="rounded-2xl flex h-full w-8 cursor-pointer items-center justify-center text-[#c5c1b9] transition-colors hover:text-[#c6a15b] sm:w-9"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    {/* Add to Bag */}
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className={`rounded-2xl flex h-9.5 min-w-0 flex-1 cursor-pointer items-center justify-center gap-1.5 border text-[10px] font-semibold uppercase tracking-[0.16em] transition-all duration-300 sm:h-10 sm:gap-2 sm:text-xs sm:tracking-[0.18em] ${
                        added
                          ? "border-[#c6a15b] bg-[#c6a15b] text-[#11110f]"
                          : "border-[#c6a15b] text-[#c6a15b] hover:bg-[#c6a15b] hover:text-[#11110f]"
                      }`}
                    >
                      {added ? (
                        <>
                          <Check
                            size={14}
                            strokeWidth={2.5}
                            className="shrink-0"
                          />
                          <span className="truncate">Added to Bag</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag
                            size={14}
                            strokeWidth={1.5}
                            className="shrink-0"
                          />
                          <span className="truncate">Add to Bag</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Buy Now */}
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="rounded-2xl flex h-10 w-full cursor-pointer items-center justify-center gap-2 border border-[#c6a15b] bg-[#c6a15b] text-[11px] font-semibold uppercase tracking-[0.18em] text-[#11110f] shadow-md transition-colors hover:bg-[#d8c08a] sm:h-10.5 sm:text-xs"
                  >
                    Buy It Now
                    <ArrowRight size={13} />
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Fragrance Specifications & Performance Card */}
            <div className="flex w-full flex-col justify-between rounded-2xl border border-[#c6a15b]/30 bg-[#151512] p-4 shadow-lg sm:p-4.5">
              <div>
                {/* Header */}
                <div className="border-b border-white/10 pb-3">
                  <span className="mb-0.5 block text-[10px] uppercase tracking-wider text-[#8e8a82]">
                    Olfactory Profile
                  </span>
                  <h3 className="font-display text-base text-[#f4efe6] sm:text-lg">
                    Specifications & Performance
                  </h3>
                </div>

                {/* Spec Tiles Grid */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                  {/* Category */}
                  <div className="rounded-2xl border border-white/10 bg-[#171715] p-2.5">
                    <div className="mb-1 flex items-center gap-1.5 text-[#8e8a82]">
                      <Crown size={13} className="shrink-0 text-[#c6a15b]" />
                      <span className="text-[10px] uppercase tracking-wider sm:text-[11px]">Category</span>
                    </div>
                    <p className="truncate font-medium text-[#f4efe6]">
                      {product.category || "Designer"}
                    </p>
                  </div>

                  {/* Concentration */}
                  <div className="rounded-2xl border border-white/10 bg-[#171715] p-2.5">
                    <div className="mb-1 flex items-center gap-1.5 text-[#8e8a82]">
                      <Flame size={13} className="shrink-0 text-[#c6a15b]" />
                      <span className="text-[10px] uppercase tracking-wider sm:text-[11px]">Concentration</span>
                    </div>
                    <p className="truncate font-medium text-[#f4efe6]">
                      {product.type || "Eau de Parfum"}
                    </p>
                  </div>

                  {/* Season */}
                  <div className="rounded-2xl border border-white/10 bg-[#171715] p-2.5">
                    <div className="mb-1 flex items-center gap-1.5 text-[#8e8a82]">
                      <SeasonIcon size={13} className="shrink-0 text-[#c6a15b]" />
                      <span className="text-[10px] uppercase tracking-wider sm:text-[11px]">Season</span>
                    </div>
                    <p className="truncate font-medium text-[#f4efe6]">
                      {product.weather || "All-Season"}
                    </p>
                  </div>

                  {/* Gender */}
                  <div className="rounded-2xl border border-white/10 bg-[#171715] p-2.5">
                    <div className="mb-1 flex items-center gap-1.5 text-[#8e8a82]">
                      <svg
                        className="h-3 w-3 shrink-0 text-[#c6a15b] sm:h-3.5 sm:w-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="9" cy="9" r="6" />
                        <line x1="13.5" y1="4.5" x2="20" y2="4.5" />
                        <line x1="20" y1="4.5" x2="20" y2="11" />
                        <circle
                          cx="15"
                          cy="15"
                          r="5"
                          strokeDasharray="3 3"
                          opacity="0.6"
                        />
                      </svg>
                      <span className="text-[10px] uppercase tracking-wider sm:text-[11px]">Gender</span>
                    </div>
                    <p className="truncate font-medium text-[#f4efe6]">
                      {genderLabel}
                    </p>
                  </div>

                  {/* Longevity */}
                  <div className="rounded-2xl border border-white/10 bg-[#171715] p-2.5">
                    <div className="mb-1 flex items-center gap-1.5 text-[#8e8a82]">
                      <Droplets size={13} className="shrink-0 text-[#c6a15b]" />
                      <span className="text-[10px] uppercase tracking-wider sm:text-[11px]">Longevity</span>
                    </div>
                    <p className="truncate font-medium text-[#f4efe6]">
                      {profile.longevity || "8 – 10 Hours"}
                    </p>
                  </div>

                  {/* Projection */}
                  <div className="rounded-2xl border border-white/10 bg-[#171715] p-2.5">
                    <div className="mb-1 flex items-center gap-1.5 text-[#8e8a82]">
                      <Sparkles size={13} className="shrink-0 text-[#c6a15b]" />
                      <span className="text-[10px] uppercase tracking-wider sm:text-[11px]">Projection</span>
                    </div>
                    <p className="truncate font-medium text-[#c6a15b]">
                      {profile.projection || "Moderate"}
                    </p>
                  </div>
                </div>

                {/* Scent Character if available */}
                {profile.vibe && (
                  <div className="mt-2.5 rounded-2xl border border-[#c6a15b]/20 bg-[#c6a15b]/5 px-2.5 py-1.5 text-[11px] text-[#c5c1b9]">
                    <span className="mr-1 text-[10px] font-semibold uppercase tracking-wider text-[#c6a15b]">
                      Character:
                    </span>
                    <span className="italic">"{profile.vibe}"</span>
                  </div>
                )}
              </div>

              {/* Authenticity Guarantee Note */}
              <div className="mt-3 flex items-center gap-1.5 border-t border-white/10 pt-2.5 text-[10px] text-[#8e8a82]">
                <ShieldCheck size={13} className="shrink-0 text-[#c6a15b]" />
                <span>100% genuine juice, decanted fresh into sterile atomizers.</span>
              </div>
            </div>
          </div>

          {/* Main Accords */}
          {profile.accords && profile.accords.length > 0 && (
            <MainAccords accords={profile.accords} />
          )}

          {/* Perfume Pyramid */}
          <PerfumePyramid
            topNotes={profile.topNotes}
            middleNotes={profile.middleNotes}
            baseNotes={profile.baseNotes}
            vibe={profile.vibe}
          />

          {/* When to Wear */}
          <WhenToWear
            whenToWear={profile.whenToWear}
            weather={product.weather}
          />
        </div>
      </div>

      {/* Customer Restock Notification Modal */}
      {notifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-[#c6a15b]/40 bg-[#151512] p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setNotifyModalOpen(false)}
              aria-label="Close notification dialog"
              className="rounded-2xl absolute right-4 top-4 cursor-pointer text-[#8e8a82] hover:text-[#f4efe6]"
            >
              ✕
            </button>

            <div className="flex items-start gap-4">
              <div className="shrink-0 rounded-full border border-[#c6a15b]/30 bg-[#c6a15b]/10 p-3 text-[#c6a15b]">
                <Bell size={24} />
              </div>

              <div>
                <h3 className="text-base font-semibold text-[#f4efe6]">
                  Notify Me When Back in Stock
                </h3>

                <p className="mt-1 text-xs text-[#c5c1b9]">
                  We'll send you an instant alert the moment{" "}
                  <strong>
                    {product.name} ({selectedVariant?.size_ml}ml)
                  </strong>{" "}
                  is restocked.
                </p>
              </div>
            </div>

            {notifySubmitted ? (
              <div className="mt-5 space-y-2 rounded-2xl border border-emerald-500/30 bg-emerald-950/30 p-4 text-center text-xs text-emerald-300">
                <Check
                  size={28}
                  className="mx-auto text-emerald-400"
                />

                <p className="text-sm font-semibold text-[#f4efe6]">
                  You're on the priority list!
                </p>

                <p>
                  We've registered your notification request and will
                  contact you as soon as bottles are back in stock.
                </p>

                <button
                  type="button"
                  onClick={() => setNotifyModalOpen(false)}
                  className="mt-3 cursor-pointer rounded-2xl border border-emerald-500/40 px-5 py-2 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/10"
                >
                  Close
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleNotifySubmit}
                className="mt-5 space-y-4"
              >
                <div>
                  <label className="mb-1.5 block text-xs uppercase tracking-wider text-[#8e8a82]">
                    Email Address or WhatsApp Number
                  </label>

                  <input
                    type="text"
                    required
                    value={notifyContact}
                    onChange={(e) => setNotifyContact(e.target.value)}
                    placeholder="e.g. yourname@gmail.com or +91 98765 43210"
                    className="w-full rounded-2xl border border-white/20 bg-[#11110f] px-3.5 py-2.5 text-xs text-[#f4efe6] focus:outline-none focus:ring-1 focus:ring-[#c6a15b]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setNotifyModalOpen(false)}
                    className="cursor-pointer rounded-2xl border border-white/15 px-4 py-2 text-xs font-medium text-[#c5c1b9] transition hover:bg-white/5"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={notifyLoading}
                    className="flex cursor-pointer items-center gap-2 rounded-2xl bg-[#c6a15b] px-5 py-2 text-xs font-semibold text-[#11110f] transition hover:bg-[#d8c08a] disabled:opacity-50"
                  >
                    {notifyLoading
                      ? "Registering..."
                      : "Submit Alert Request"}
                    <Send size={13} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </Container>
  );
}
