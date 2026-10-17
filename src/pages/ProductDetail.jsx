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

const SPRAY_ESTIMATES = {
  2: "~30 sprays · ~7–10 days of wear",
  5: "~75 sprays · ~20–25 days of wear",
  10: "~150 sprays · 1+ month of daily wear",
  20: "~300 sprays · 2–3 months of wear",
  50: "~750 sprays · 6+ months signature supply",
};

/**
 * Condenses fragrance descriptions to 1–2 brief sentences (~20–30 words)
 * while preserving key notes, scent character, concentration, and season.
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

  // If description follows the template: "Opens with vibrant top notes of ..., transitioning into ..., rested on ..."
  if (/Opens with vibrant top notes of/i.test(trimmed)) {
    const parts = trimmed.split(/(?<=[.!?])\s+/);
    let firstSentence = parts[0] || "";
    // Clean up all-caps acronyms
    firstSentence = firstSentence
      .replace(/EXTRAIT DE PARFUM/gi, "Extrait de Parfum")
      .replace(/\bEDP\b/g, "Eau de Parfum")
      .replace(/\bEDT\b/g, "Eau de Toilette");

    const topNote = profile?.topNotes?.[0] || "";
    const heartNote = profile?.middleNotes?.[0] || profile?.heartNotes?.[0] || "";
    const baseNote = profile?.baseNotes?.[0] || "";

    if (topNote && baseNote) {
      const secondSentence = `Opens with ${topNote}${heartNote ? ` and ${heartNote}` : ""}, resting on an authentic ${baseNote} base.`;
      const combined = `${firstSentence} ${secondSentence}`;
      if (combined.split(/\s+/).length <= 32) return combined;
    }
    return firstSentence;
  }

  // If description has standard multiple sentences, keep the first 1-2 within 32 words
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
  const [imageError, setImageError] = useState(false);
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

        // Default to first variant
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

  if (loading) {
    return (
      <Container className="py-24">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#c6a15b] border-t-transparent mb-4" />
          <p className="text-sm tracking-wider uppercase text-[#c5c1b9]">
            Loading Fragrance Profile...
          </p>
        </div>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container className="py-24">
        <div className="mx-auto max-w-md text-center py-12">
          <p className="text-sm text-red-400 mb-6">{error || "Fragrance not found"}</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 border border-[#c6a15b] bg-[#c6a15b] px-6 py-3 text-xs uppercase tracking-wider text-[#11110f] font-semibold hover:bg-[#d8c08a] transition"
          >
            <ArrowLeft size={14} /> Back to Collection
          </Link>
        </div>
      </Container>
    );
  }

  const isSoldOut = selectedVariant ? Number(selectedVariant.stock ?? 10) <= 0 : false;
  const currentPrice = selectedVariant ? Number(selectedVariant.price) : 0;
  const genderLabel =
    product.gender === "M/W" ? "Unisex" :
      product.gender === "M" ? "Men" :
        product.gender === "W" ? "Women" :
          product.gender || "Fragrance";

  const profile = getPerfumeProfile(
    product.name,
    product.category,
    product.weather,
    product.type,
    product.gender
  );

  const shortDescription = getShortDescription(profile.description, profile, product);

  // Custom season icon helper
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
        <Link to="/" className="hover:text-[#c6a15b] transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link to="/products" className="hover:text-[#c6a15b] transition-colors">
          Collection
        </Link>
        <span>/</span>
        <span className="text-[#f4efe6] truncate max-w-[200px] sm:max-w-none">
          {product.name}
        </span>
      </nav>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
        {/* Left Column: Fragrance Visual */}
        <div className="lg:col-span-6">
          <div className="sticky top-28">
            <div className="aspect-[4/5] w-full overflow-hidden border border-white/10 bg-[#171715] flex items-center justify-center p-6 sm:p-8 group relative">
              {isSoldOut && (
                <div className="absolute top-4 right-4 px-3 py-1 text-[11px] tracking-[0.25em] font-semibold uppercase bg-red-950/90 text-red-300 border border-red-800/70 backdrop-blur-md z-10 shadow-lg">
                  Sold Out
                </div>
              )}
              {product.image_url && !imageError ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  onError={() => setImageError(true)}
                  className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="text-center text-[#c6a15b]/50">
                  <Droplets size={48} strokeWidth={1} className="mx-auto mb-3" />
                  <p className="text-xs uppercase tracking-[0.25em]">
                    Authentic Handcrafted Decant
                  </p>
                </div>
              )}
            </div>

            {/* Trust highlights below image */}
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-[#8e8a82]">
              <div className="flex items-center gap-2 border border-white/10 bg-[#151512] p-3">
                <ShieldCheck size={16} className="text-[#c6a15b] shrink-0" />
                <span>100% Genuine Formula</span>
              </div>
              <div className="flex items-center gap-2 border border-white/10 bg-[#151512] p-3">
                <Sparkles size={16} className="text-[#c6a15b] shrink-0" />
                <span>Precision Glass Spray</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Scent Info, Accords & Immediate Purchase */}
        <div className="lg:col-span-6 flex flex-col">
          {/* 1. Category & Gender Badge */}
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#c6a15b]">
              {product.category || "Designer"}
            </span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span className="text-[11px] text-[#8e8a82] uppercase tracking-wider">
              {genderLabel}
            </span>
          </div>

          {/* 2. Fragrance Name - Balanced responsive title size */}
          <h1 className="mt-2 font-display text-2xl sm:text-3xl lg:text-4xl text-[#f4efe6] leading-tight tracking-tight">
            {product.name}
          </h1>

          {/* 3. Shortened Fragrance Description (1-2 sentences, ~20-30 words) */}
          {shortDescription && (
            <p className="mt-3 text-xs sm:text-[13px] text-[#c5c1b9] leading-relaxed border-l-2 border-[#c6a15b] pl-3 py-0.5">
              {shortDescription}
            </p>
          )}
          {/* 5. Purchase & Decant Sizing Card (Compact & Prominent) */}
          <div className="mt-4 border border-[#c6a15b]/30 bg-[#151512] p-4 sm:p-4.5 rounded-lg shadow-lg">
            {/* Price & Current Size */}
            <div className="flex items-baseline justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#8e8a82] block mb-0.5">
                  Price
                </span>
                <span className="font-display text-2xl sm:text-3xl text-[#f4efe6]">
                  ₹{currentPrice * quantity}
                </span>
              </div>
              {selectedVariant && (
                <span className="text-[11px] sm:text-xs text-[#c6a15b] font-medium bg-[#c6a15b]/10 border border-[#c6a15b]/30 px-2 py-0.5 rounded">
                  {quantity > 1 ? `${quantity} × ` : ""}{selectedVariant.size_ml}ml Decant Atomizer
                </span>
              )}
            </div>

            {/* Decant Size Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] sm:text-xs uppercase tracking-wider text-[#f4efe6] font-medium">
                    Select Decant Size
                  </span>
                  {selectedVariant && SPRAY_ESTIMATES[selectedVariant.size_ml] && (
                    <span className="text-[11px] text-[#c6a15b]">
                      {SPRAY_ESTIMATES[selectedVariant.size_ml]}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {product.variants.map((variant) => {
                    const isSelected = selectedVariant?.id === variant.id;
                    const variantSoldOut = Number(variant.stock) <= 0;
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedVariant(variant)}
                        className={`flex flex-col items-center justify-center py-1.5 px-2 sm:py-2 sm:px-2.5 border transition cursor-pointer relative ${
                          isSelected
                            ? "border-[#c6a15b] bg-[#c6a15b]/15 text-[#f4efe6] shadow-[0_0_8px_rgba(198,161,91,0.2)]"
                            : "border-white/15 bg-[#171715] text-[#c5c1b9] hover:border-[#c6a15b]/60"
                        }`}
                      >
                        <span className="text-xs sm:text-[13px] font-semibold tracking-wider">
                          {variant.size_ml} ml
                        </span>
                        <span className="mt-0.5 text-[11px] sm:text-xs">
                          {variantSoldOut ? (
                            <span className="text-red-400 font-semibold tracking-tight">Sold Out</span>
                          ) : (
                            <span className="text-[#c6a15b]">₹{variant.price}</span>
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

            {/* Quantity Selector & Action Buttons (Or Sold Out State) */}
            {isSoldOut ? (
              <div className="mt-3 space-y-2">
                <div className="p-2.5 bg-red-950/30 border border-red-500/30 rounded flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-red-300">
                    <XCircle size={14} className="text-red-400 shrink-0" />
                    <span>This {selectedVariant?.size_ml}ml decant size is currently <strong>Sold Out</strong>.</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setNotifySubmitted(false);
                    setNotifyModalOpen(true);
                  }}
                  className="w-full h-9.5 sm:h-10 flex items-center justify-center gap-2 border border-[#c6a15b] bg-[#c6a15b] hover:bg-[#d8c08a] text-[#11110f] text-[11px] sm:text-xs uppercase tracking-[0.18em] font-semibold transition cursor-pointer shadow-md rounded-sm"
                >
                  <Bell size={14} />
                  Notify Me When Available
                </button>
              </div>
            ) : (
              <div className="mt-3.5 space-y-2.5">
                <div className="flex items-center gap-2.5">
                  {/* Quantity Stepper */}
                  <div className="flex h-9.5 sm:h-10 items-center border border-white/15 bg-[#171715]">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="flex h-full w-8 sm:w-9 items-center justify-center text-[#c5c1b9] hover:text-[#c6a15b] transition-colors cursor-pointer"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-7 text-center text-xs sm:text-[13px] font-semibold text-[#f4efe6]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="flex h-full w-8 sm:w-9 items-center justify-center text-[#c5c1b9] hover:text-[#c6a15b] transition-colors cursor-pointer"
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  {/* Add to Bag Button */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`flex-1 h-9.5 sm:h-10 flex items-center justify-center gap-2 border text-[11px] sm:text-xs uppercase tracking-[0.18em] font-semibold transition-all duration-300 cursor-pointer ${
                      added
                        ? "border-[#c6a15b] bg-[#c6a15b] text-[#11110f]"
                        : "border-[#c6a15b] text-[#c6a15b] hover:bg-[#c6a15b] hover:text-[#11110f]"
                    }`}
                  >
                    {added ? (
                      <>
                        <Check size={14} strokeWidth={2.5} />
                        Added to Bag
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={14} strokeWidth={1.5} />
                        Add to Bag
                      </>
                    )}
                  </button>
                </div>

                {/* Buy Now Direct Button */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full h-10 sm:h-10.5 flex items-center justify-center gap-2 border border-[#c6a15b] bg-[#c6a15b] text-[#11110f] text-[11px] sm:text-xs uppercase tracking-[0.18em] font-semibold hover:bg-[#d8c08a] transition-colors cursor-pointer shadow-md"
                >
                  Buy It Now
                  <ArrowRight size={13} />
                </button>
              </div>
            )}
          </div>

          {/* 4. Main Accords & Themes (Positioned directly above Purchase section) */}
          {profile.accords && profile.accords.length > 0 && (
            <MainAccords accords={profile.accords} />
          )}


          {/* 6. Perfume Pyramid (Stepped Tiered Pyramid: Top, Middle, Base) */}
          <PerfumePyramid
            topNotes={profile.topNotes}
            middleNotes={profile.middleNotes}
            baseNotes={profile.baseNotes}
            vibe={profile.vibe}
          />

          {/* 7. Luxury When to Wear Section */}
          <WhenToWear whenToWear={profile.whenToWear} weather={product.weather} />

          {/* 8. Fragrance Specifications & Performance (Unified compact grid) */}
          <div className="mt-6 border-t border-white/10 pt-5">
            <h3 className="text-xs uppercase tracking-[0.2em] text-[#c6a15b] font-medium mb-3">
              Fragrance Specifications & Performance
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              {/* Category */}
              <div className="border border-white/10 bg-[#171715] p-3">
                <div className="flex items-center gap-1.5 text-[#8e8a82] mb-1">
                  <Crown size={13} className="text-[#c6a15b]" />
                  <span className="text-[11px]">Category</span>
                </div>
                <p className="font-medium text-[#f4efe6] truncate">{product.category || "Designer"}</p>
              </div>

              {/* Concentration */}
              <div className="border border-white/10 bg-[#171715] p-3">
                <div className="flex items-center gap-1.5 text-[#8e8a82] mb-1">
                  <Flame size={13} className="text-[#c6a15b]" />
                  <span className="text-[11px]">Concentration</span>
                </div>
                <p className="font-medium text-[#f4efe6] truncate">{product.type || "Eau de Parfum"}</p>
              </div>

              {/* Season */}
              <div className="border border-white/10 bg-[#171715] p-3">
                <div className="flex items-center gap-1.5 text-[#8e8a82] mb-1">
                  <SeasonIcon size={13} className="text-[#c6a15b]" />
                  <span className="text-[11px]">Season</span>
                </div>
                <p className="font-medium text-[#f4efe6] truncate">{product.weather || "All-Season"}</p>
              </div>

              {/* Gender */}
              <div className="border border-white/10 bg-[#171715] p-3">
                <div className="flex items-center gap-1.5 text-[#8e8a82] mb-1">
                  <svg className="w-3.5 h-3.5 text-[#c6a15b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="9" r="6" />
                    <line x1="13.5" y1="4.5" x2="20" y2="4.5" />
                    <line x1="20" y1="4.5" x2="20" y2="11" />
                    <circle cx="15" cy="15" r="5" strokeDasharray="3 3" opacity="0.6" />
                  </svg>
                  <span className="text-[11px]">Gender</span>
                </div>
                <p className="font-medium text-[#f4efe6] truncate">{genderLabel}</p>
              </div>

              {/* Longevity */}
              <div className="border border-white/10 bg-[#171715] p-3">
                <div className="flex items-center gap-1.5 text-[#8e8a82] mb-1">
                  <Droplets size={13} className="text-[#c6a15b]" />
                  <span className="text-[11px]">Longevity</span>
                </div>
                <p className="font-medium text-[#f4efe6] truncate">{profile.longevity || "8 – 10 Hours"}</p>
              </div>

              {/* Projection */}
              <div className="border border-white/10 bg-[#171715] p-3">
                <div className="flex items-center gap-1.5 text-[#8e8a82] mb-1">
                  <Sparkles size={13} className="text-[#c6a15b]" />
                  <span className="text-[11px]">Projection</span>
                </div>
                <p className="font-medium text-[#c6a15b] truncate">{profile.projection || "Moderate"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Restock Notification Modal */}
      {notifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md border border-[#c6a15b]/40 bg-[#151512] shadow-2xl rounded-lg p-6 relative">
            <button
              type="button"
              onClick={() => setNotifyModalOpen(false)}
              className="absolute top-4 right-4 text-[#8e8a82] hover:text-[#f4efe6] cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-[#c6a15b]/10 text-[#c6a15b] border border-[#c6a15b]/30 shrink-0">
                <Bell size={24} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#f4efe6]">
                  Notify Me When Back in Stock
                </h3>
                <p className="text-xs text-[#c5c1b9] mt-1">
                  We'll send you an instant alert the moment <strong>{product.name} ({selectedVariant?.size_ml}ml)</strong> is restocked.
                </p>
              </div>
            </div>

            {notifySubmitted ? (
              <div className="mt-5 p-4 border border-emerald-500/30 bg-emerald-950/30 rounded text-center text-xs text-emerald-300 space-y-2">
                <Check size={28} className="mx-auto text-emerald-400" />
                <p className="font-semibold text-sm text-[#f4efe6]">You're on the priority list!</p>
                <p>We've registered your notification request and will contact you as soon as bottles are back in stock.</p>
                <button
                  type="button"
                  onClick={() => setNotifyModalOpen(false)}
                  className="mt-3 px-5 py-2 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 text-xs font-semibold rounded cursor-pointer transition"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleNotifySubmit} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8e8a82] mb-1.5">
                    Email Address or WhatsApp Number
                  </label>
                  <input
                    type="text"
                    required
                    value={notifyContact}
                    onChange={(e) => setNotifyContact(e.target.value)}
                    placeholder="e.g. yourname@gmail.com or +91 98765 43210"
                    className="w-full px-3.5 py-2.5 bg-[#11110f] border border-white/20 rounded text-xs text-[#f4efe6] focus:outline-none focus:ring-1 focus:ring-[#c6a15b]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setNotifyModalOpen(false)}
                    className="px-4 py-2 border border-white/15 hover:bg-white/5 text-xs text-[#c5c1b9] rounded font-medium transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={notifyLoading}
                    className="flex items-center gap-2 px-5 py-2 bg-[#c6a15b] hover:bg-[#d8c08a] text-[#11110f] text-xs font-semibold rounded transition cursor-pointer disabled:opacity-50"
                  >
                    {notifyLoading ? "Registering..." : "Submit Alert Request"}
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
