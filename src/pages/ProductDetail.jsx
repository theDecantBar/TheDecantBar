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
  Calendar,
  Layers,
  Flame,
  ArrowRight
} from "lucide-react";
import Container from "../components/ui/Container";
import { useCart } from "../context/CartContext";
import { getPerfumeProfile } from "../data/perfumeNotes";

const SPRAY_ESTIMATES = {
  2: "~30 sprays · ~7–10 days of wear",
  5: "~75 sprays · ~20–25 days of wear",
  10: "~150 sprays · 1+ month of daily wear",
  20: "~300 sprays · 2–3 months of wear",
  50: "~750 sprays · 6+ months signature supply",
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

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

  return (
    <Container className="py-8 sm:py-16">
      {/* Breadcrumb Navigation */}
      <nav className="mb-8 flex items-center gap-2 text-xs text-[#8e8a82]">
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
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Left Column: Fragrance Visual */}
        <div className="lg:col-span-6">
          <div className="sticky top-28">
            <div className="aspect-[4/5] w-full overflow-hidden border border-white/10 bg-[#171715] flex items-center justify-center p-8 group">
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
            <div className="mt-6 grid grid-cols-2 gap-4 text-xs text-[#8e8a82]">
              <div className="flex items-center gap-2.5 border border-white/10 bg-[#151512] p-3.5">
                <ShieldCheck size={18} className="text-[#c6a15b] shrink-0" />
                <span>100% Genuine Formula</span>
              </div>
              <div className="flex items-center gap-2.5 border border-white/10 bg-[#151512] p-3.5">
                <Sparkles size={18} className="text-[#c6a15b] shrink-0" />
                <span>Precision Glass Spray</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Scent Info & Purchase Actions */}
        <div className="lg:col-span-6 flex flex-col">
          {/* Category & Badge */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c6a15b]">
              {product.category || "Designer"}
            </span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span className="text-xs text-[#8e8a82] uppercase tracking-wider">
              {genderLabel}
            </span>
          </div>

          {/* Fragrance Name */}
          <h1 className="mt-3 font-display text-4xl text-[#f4efe6] sm:text-5xl lg:text-6xl leading-[1.05]">
            {product.name}
          </h1>

          {/* Price & Current Size */}
          <div className="mt-6 flex items-baseline gap-4 border-b border-white/10 pb-6">
            <span className="font-display text-4xl text-[#f4efe6] sm:text-5xl">
              ₹{currentPrice * quantity}
            </span>
            {selectedVariant && (
              <span className="text-xs text-[#8e8a82]">
                for {quantity > 1 ? `${quantity} × ` : ""}{selectedVariant.size_ml}ml Decant Atomizer
              </span>
            )}
          </div>

          {/* Decant Size Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider text-[#f4efe6] font-medium">
                  Select Decant Size
                </span>
                {selectedVariant && SPRAY_ESTIMATES[selectedVariant.size_ml] && (
                  <span className="text-[11px] text-[#c6a15b]">
                    {SPRAY_ESTIMATES[selectedVariant.size_ml]}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {product.variants.map((variant) => {
                  const isSelected = selectedVariant?.id === variant.id;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setSelectedVariant(variant)}
                      className={`flex flex-col items-center justify-center p-3.5 border transition cursor-pointer ${
                        isSelected
                          ? "border-[#c6a15b] bg-[#c6a15b]/10 text-[#f4efe6]"
                          : "border-white/15 bg-[#171715] text-[#c5c1b9] hover:border-[#c6a15b]/60"
                      }`}
                    >
                      <span className="text-sm font-semibold tracking-wider">
                        {variant.size_ml} ml
                      </span>
                      <span className="mt-1 text-xs text-[#c6a15b]">
                        ₹{variant.price}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-2.5 text-[11px] text-[#8e8a82]">
                *High-grade fine-mist atomizers deliver approx. 15 sprays per 1ml.
              </p>
            </div>
          )}

          {/* Quantity Selector & Action Buttons */}
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-4">
              {/* Quantity Stepper */}
              <div className="flex h-13 items-center border border-white/15 bg-[#171715]">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-full w-12 items-center justify-center text-[#c5c1b9] hover:text-[#c6a15b] transition-colors cursor-pointer"
                >
                  <Minus size={15} />
                </button>
                <span className="w-10 text-center text-sm font-semibold text-[#f4efe6]">
                  {quantity}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-full w-12 items-center justify-center text-[#c5c1b9] hover:text-[#c6a15b] transition-colors cursor-pointer"
                >
                  <Plus size={15} />
                </button>
              </div>

              {/* Add to Bag Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex-1 h-13 flex items-center justify-center gap-2 border text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 cursor-pointer ${
                  added
                    ? "border-[#c6a15b] bg-[#c6a15b] text-[#11110f]"
                    : "border-[#c6a15b] text-[#c6a15b] hover:bg-[#c6a15b] hover:text-[#11110f]"
                }`}
              >
                {added ? (
                  <>
                    <Check size={16} strokeWidth={2.5} />
                    Added to Bag
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} strokeWidth={1.5} />
                    Add to Bag
                  </>
                )}
              </button>
            </div>

            {/* Buy Now Direct Button */}
            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full h-13 flex items-center justify-center gap-2 border border-[#c6a15b] bg-[#c6a15b] text-[#11110f] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#d8c08a] transition-colors cursor-pointer"
            >
              Buy It Now
              <ArrowRight size={15} />
            </button>
          </div>

          {/* Scent Description in Bullet Points */}
          <div className="mt-8 border-t border-white/10 pt-6">
            <h3 className="text-xs uppercase tracking-[0.2em] text-[#c6a15b] font-medium mb-3">
              Fragrance Experience & Highlights
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#c5c1b9] leading-relaxed">
              {profile.highlights.map((point, index) => (
                <li key={index} className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#c6a15b] shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Olfactory Notes in Cards */}
          <div className="mt-8 border-t border-white/10 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4">
              <h3 className="text-xs uppercase tracking-[0.2em] text-[#c6a15b] font-medium">
                Olfactory Notes Pyramid
              </h3>
              <span className="text-[11px] text-[#8e8a82]">
                Vibe: <strong className="text-[#f4efe6] font-normal">{profile.vibe}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Top Notes Card */}
              <div className="border border-white/10 bg-[#171715] p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="uppercase tracking-wider font-semibold text-[#f4efe6]">Top Notes</span>
                    <span className="text-[10px] text-[#c6a15b]">Opening</span>
                  </div>
                  <p className="text-[10px] text-[#8e8a82] mb-3">First 15–30 mins</p>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {profile.topNotes.map((note) => (
                    <span
                      key={note}
                      className="border border-white/15 bg-[#1c1c18] px-2.5 py-1 text-xs text-[#f4efe6]"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>

              {/* Heart Notes Card */}
              <div className="border border-white/10 bg-[#171715] p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="uppercase tracking-wider font-semibold text-[#f4efe6]">Heart Notes</span>
                    <span className="text-[10px] text-[#c6a15b]">Core Body</span>
                  </div>
                  <p className="text-[10px] text-[#8e8a82] mb-3">Hours 2–5</p>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {profile.heartNotes.map((note) => (
                    <span
                      key={note}
                      className="border border-white/15 bg-[#1c1c18] px-2.5 py-1 text-xs text-[#f4efe6]"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>

              {/* Base Notes Card */}
              <div className="border border-white/10 bg-[#171715] p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="uppercase tracking-wider font-semibold text-[#f4efe6]">Base Notes</span>
                    <span className="text-[10px] text-[#c6a15b]">Dry Down</span>
                  </div>
                  <p className="text-[10px] text-[#8e8a82] mb-3">Hours 6–12+</p>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {profile.baseNotes.map((note) => (
                    <span
                      key={note}
                      className="border border-white/15 bg-[#1c1c18] px-2.5 py-1 text-xs text-[#f4efe6]"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Performance Badges */}
            <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
              <div className="border border-white/10 bg-[#171715] p-3 flex items-center justify-between">
                <span className="text-[#8e8a82]">Longevity</span>
                <span className="font-medium text-[#f4efe6]">{profile.longevity}</span>
              </div>
              <div className="border border-white/10 bg-[#171715] p-3 flex items-center justify-between">
                <span className="text-[#8e8a82]">Projection</span>
                <span className="font-medium text-[#c6a15b]">{profile.projection}</span>
              </div>
            </div>
          </div>

          {/* Scent Profile Specification Cards */}
          <div className="mt-8 border-t border-white/10 pt-6">
            <h3 className="text-xs uppercase tracking-[0.2em] text-[#c6a15b] font-medium mb-3">
              Fragrance Specifications
            </h3>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
              <div className="border border-white/10 bg-[#171715] p-3.5">
                <div className="flex items-center gap-2 text-[#8e8a82] mb-1">
                  <Layers size={14} className="text-[#c6a15b]" />
                  <span>Category</span>
                </div>
                <p className="font-medium text-[#f4efe6]">{product.category || "Designer"}</p>
              </div>

              <div className="border border-white/10 bg-[#171715] p-3.5">
                <div className="flex items-center gap-2 text-[#8e8a82] mb-1">
                  <Flame size={14} className="text-[#c6a15b]" />
                  <span>Concentration</span>
                </div>
                <p className="font-medium text-[#f4efe6]">{product.type || "Eau de Parfum"}</p>
              </div>

              <div className="border border-white/10 bg-[#171715] p-3.5">
                <div className="flex items-center gap-2 text-[#8e8a82] mb-1">
                  <Calendar size={14} className="text-[#c6a15b]" />
                  <span>Season</span>
                </div>
                <p className="font-medium text-[#f4efe6]">{product.weather || "All-Season"}</p>
              </div>

              <div className="border border-white/10 bg-[#171715] p-3.5">
                <div className="flex items-center gap-2 text-[#8e8a82] mb-1">
                  <Droplets size={14} className="text-[#c6a15b]" />
                  <span>Gender</span>
                </div>
                <p className="font-medium text-[#f4efe6]">{genderLabel}</p>
              </div>
            </div>
          </div>

          {/* Decanting Authenticity Notice */}
          <div className="mt-8 border border-white/10 bg-[#151512] p-5 text-xs text-[#8e8a82] leading-relaxed">
            <p className="font-semibold text-[#f4efe6] mb-1">
              About The Decant Bar Decants:
            </p>
            <p>
              All fragrances are 100% genuine and transferred directly from the authentic manufacturer's bottle using sterile laboratory-grade instruments. Packaged in custom leak-proof glass spray bottles.
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}

