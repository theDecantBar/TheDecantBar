import { useState, useEffect, lazy, Suspense, useMemo } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  X,
  ShoppingBag,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import ArrowFillButton from "../ui/arrow-fill-button";
import { useCart } from "../../context/CartContext";
import { getProducts } from "../../services/api";

const FragranceOrbitCarousel = lazy(() => import("../ui/fragrance-orbit-carousel"));

const SHOWCASE_SCENTS = [
  {
    id: "oud-maracuja",
    brand: "Maison Crivelli",
    name: "Oud Maracujá",
    shortName: "Oud Maracujá",
    tagline: "Tropical Passionfruit · Smoky Oud",
    longevity: "12 – 16 Hours · Extrait",
    searchQuery: "Oud Maracuja",
    pricing: {
      "2ml": { price: 299, sprays: "~35 sprays" },
      "5ml": { price: 599, sprays: "~80 sprays" },
      "10ml": { price: 1099, sprays: "~160 sprays" },
    },
  },
  {
    id: "le-male-le-parfum",
    brand: "Jean Paul Gaultier",
    name: "Le Male Le Parfum",
    shortName: "Le Male",
    tagline: "Spiced Cardamom · Dark Vanilla",
    longevity: "10 – 12 Hours · EDP Intense",
    searchQuery: "Le Male Le Parfum",
    pricing: {
      "2ml": { price: 199, sprays: "~35 sprays" },
      "5ml": { price: 449, sprays: "~80 sprays" },
      "10ml": { price: 799, sprays: "~160 sprays" },
    },
  },
  {
    id: "musamam-black-intense",
    brand: "Lattafa Pride",
    name: "Musamam Black Intense",
    shortName: "Musamam Black",
    tagline: "Smoked Woods · Cocoa & Maple",
    longevity: "10 – 12 Hours · EDP",
    searchQuery: "Musamam Black Intense",
    pricing: {
      "2ml": { price: 149, sprays: "~35 sprays" },
      "5ml": { price: 349, sprays: "~80 sprays" },
      "10ml": { price: 599, sprays: "~160 sprays" },
    },
  },
  {
    id: "oud-stallion",
    brand: "Maison Crivelli",
    name: "Oud Stallion",
    shortName: "Oud Stallion",
    tagline: "Noble Saffron · Saddle Leather",
    longevity: "12 – 16 Hours · Extrait",
    searchQuery: "Oud Stallion",
    pricing: {
      "2ml": { price: 599, sprays: "~35 sprays" },
      "5ml": { price: 1799, sprays: "~80 sprays" },
      "10ml": { price: 2999, sprays: "~160 sprays" },
    },
  },
  {
    id: "vintage-tobacco",
    brand: "IBRAQ Parfums",
    name: "Vintage Tobacco",
    shortName: "Vintage Tobacco",
    tagline: "Aged Cognac · Caramel & Oud",
    longevity: "12 – 14 Hours · Extrait",
    searchQuery: "Vintage Tobacco",
    pricing: {
      "2ml": { price: 249, sprays: "~35 sprays" },
      "5ml": { price: 499, sprays: "~80 sprays" },
      "10ml": { price: 899, sprays: "~160 sprays" },
    },
  },
];

const DECANT_SIZES = ["2ml", "5ml", "10ml"];

function normalizeText(value = "") {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function findMatchingCatalogProduct(catalog, scent) {
  if (!catalog.length || !scent) return null;
  const targetName = normalizeText(scent.name);
  const targetQuery = normalizeText(scent.searchQuery);
  return (
    catalog.find((p) => normalizeText(p.name) === targetName) ||
    catalog.find((p) => normalizeText(p.name).includes(targetQuery)) ||
    null
  );
}

export default function HeroOrbitShowcase() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const shouldReduceMotion = useReducedMotion();

  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeStage, setActiveStage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("5ml");
  const [catalog, setCatalog] = useState([]);
  const [addedFeedback, setAddedFeedback] = useState(false);

  // Close on Escape key and lock scroll while open
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Fetch catalog when showcase opens so prices, stock & direct links stay live
  useEffect(() => {
    if (!isOpen || catalog.length > 0) return;
    let active = true;
    getProducts({ maxAgeMs: 15_000 })
      .then((data) => {
        if (active && Array.isArray(data)) {
          setCatalog(data);
        }
      })
      .catch(() => {
        // Fallback smoothly to default pricing if temporarily unreachable
      });
    return () => {
      active = false;
    };
  }, [isOpen, catalog.length]);

  const activeScent = SHOWCASE_SCENTS[activeIndex] || SHOWCASE_SCENTS[0];

  const matchedProduct = useMemo(
    () => findMatchingCatalogProduct(catalog, activeScent),
    [catalog, activeScent]
  );

  const activeVariant = useMemo(() => {
    if (!matchedProduct?.variants?.length) return null;
    const targetMl = parseInt(selectedSize, 10);
    return (
      matchedProduct.variants.find(
        (v) => Number(v.size_ml) === targetMl && v.active !== false
      ) || null
    );
  }, [matchedProduct, selectedSize]);

  const displayPrice = activeVariant
    ? Number(activeVariant.price)
    : activeScent.pricing[selectedSize]?.price;
  const displaySprays = activeScent.pricing[selectedSize]?.sprays || "";
  const isVariantSoldOut = Boolean(activeVariant && Number(activeVariant.stock ?? 0) <= 0);

  const cycleScent = (delta) => {
    const next = (activeIndex + delta + SHOWCASE_SCENTS.length) % SHOWCASE_SCENTS.length;
    setActiveIndex(next);
    setActiveStage(0);
  };

  const handleAdd = async () => {
    let product = matchedProduct;
    let variant = activeVariant;

    // Ensure freshly inserted catalog items are resolved even if cache hadn't warmed yet
    if (!product) {
      try {
        const fresh = await getProducts({ force: true });
        if (Array.isArray(fresh)) {
          setCatalog(fresh);
          product = findMatchingCatalogProduct(fresh, activeScent);
          const targetMl = parseInt(selectedSize, 10);
          variant =
            product?.variants?.find(
              (v) => Number(v.size_ml) === targetMl && v.active !== false
            ) || null;
        }
      } catch {
        // Fall through to search route below
      }
    }

    if (product && variant) {
      const added = addToCart(product, variant, 1);
      if (added) {
        setAddedFeedback(true);
        setTimeout(() => setAddedFeedback(false), 1500);
      }
      return;
    }

    setIsOpen(false);
    navigate(`/products?search=${encodeURIComponent(activeScent.searchQuery)}`);
  };

  const handleViewDetails = () => {
    setIsOpen(false);
    if (matchedProduct?.id) {
      navigate(`/product/${matchedProduct.id}`);
    } else {
      navigate(`/products?search=${encodeURIComponent(activeScent.searchQuery)}`);
    }
  };

  return (
    <>
      <div className="pt-2 sm:pt-3">
        <ArrowFillButton
          btnText="Discover Popular Scents"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setIsOpen(true);
          }}
          bgColor="#181613"
          textColor="#fffdf7"
          fillBgColor="#c6a15b"
          fillTextColor="#12110f"
          hoverFillBgColor="#c6a15b"
          hoverFillTextColor="#12110f"
          arrowColor="#12110f"
          hoverArrowColor="#12110f"
          className="!h-[52px] sm:!h-[54px] !px-7 sm:!px-8 !pr-16 sm:!pr-18 !text-xs sm:!text-sm !font-bold !tracking-[0.16em] !uppercase !border !border-[#3d382f] hover:!border-[#5e5546] [--icon-circle:36px] sm:[--icon-circle:38px] [--icon-right:7px] sm:[--icon-right:8px] shadow-sm"
        />
      </div>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: "easeInOut" }}
                className="fixed inset-0 z-[99999] bg-[#0c0b0a]/95 backdrop-blur-xl flex flex-col"
              >
                {/* ─── Clean Minimal Header (No Top Filter Clutter) ─── */}
                <div className="flex items-center justify-between gap-4 px-5 sm:px-8 py-3.5 border-b border-[#24211b] bg-[#12110f]/90 z-20 shrink-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c6a15b] shrink-0" />
                    <div className="truncate">
                      <div className="text-[9px] uppercase font-bold tracking-[0.25em] text-[#c6a15b]">
                        The Decant Bar • Vault
                      </div>
                      <h3 className="text-sm sm:text-base font-serif text-[#fffdf7] truncate">
                        The 5 Industry Sensations
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className="hidden sm:inline font-mono text-[11px] tracking-[0.2em] text-[#8e8a82]">
                      0{activeIndex + 1} / 0{SHOWCASE_SCENTS.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="h-9 px-3.5 rounded-full bg-[#1c1a17] border border-[#2d2922] hover:border-[#c6a15b] text-[#ded3bf] hover:text-[#fffdf7] text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
                      title="Return to Hero"
                    >
                      <X size={15} />
                      <span className="hidden sm:inline">Close</span>
                    </button>
                  </div>
                </div>

                {/* ─── Open Full-Bleed Stage + Eye-Level Interactive Controls ─── */}
                <motion.div
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: 10 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-1 min-h-0 w-full relative overflow-hidden"
                >
                  <Suspense
                    fallback={
                      <div className="flex h-full w-full items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#c6a15b] border-t-transparent" />
                      </div>
                    }
                  >
                    <FragranceOrbitCarousel
                      className="w-full h-full"
                      activeIndex={activeIndex}
                      activeStage={activeStage}
                      showStageControls={false}
                      onSlideChange={(idx, stage) => {
                        setActiveIndex(idx);
                        setActiveStage(stage);
                      }}
                    />
                  </Suspense>

                  {/* ─── Desktop Frame 1: Eye-Level Floating Controls Right Beside the Bottle ─── */}
                  {activeStage === 0 && (
                    <div className="hidden md:flex flex-col gap-4 absolute right-7 lg:right-12 top-1/2 -translate-y-1/2 w-[236px] z-20 pointer-events-auto">
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-[#c6a15b] font-semibold">
                          {activeScent.longevity}
                        </p>
                        <p className="text-xs text-[#e5dccb]/85 leading-relaxed">
                          {activeScent.tagline}
                        </p>
                      </div>

                      {/* 1-Click Bottle ↔ Notes Flip right at eye level */}
                      <div className="inline-flex self-start items-center rounded-full bg-[#12110f]/75 border border-[#c6a15b]/35 p-0.5 backdrop-blur-md">
                        <button
                          type="button"
                          onClick={() => setActiveStage(0)}
                          className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-[0.14em] bg-[#c6a15b]/20 text-[#f5dfb0] cursor-pointer"
                        >
                          Bottle
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveStage(1)}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-[0.14em] text-[#c5c1b9] hover:text-[#fffdf7] transition cursor-pointer"
                        >
                          <Sparkles size={10} className="text-[#c6a15b]" />
                          Notes
                        </button>
                      </div>

                      <div className="h-px w-full bg-white/15" />

                      {/* Minimal Size Picker + Price */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-[#c5c1b9]">
                          <span>Decant Size</span>
                          <span className="text-[#e5dccb]">{displaySprays}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5">
                          {DECANT_SIZES.map((sz) => {
                            const isSelected = selectedSize === sz;
                            return (
                              <button
                                key={sz}
                                type="button"
                                onClick={() => setSelectedSize(sz)}
                                className={`py-1.5 rounded-lg text-[11px] font-medium border transition cursor-pointer ${
                                  isSelected
                                    ? "border-[#c6a15b] bg-[#c6a15b]/15 text-[#fffdf7]"
                                    : "border-white/15 bg-[#12110f]/55 text-[#c5c1b9] hover:border-white/35 hover:text-[#fffdf7]"
                                }`}
                              >
                                {sz}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Primary Add to Bag + Navigate to Perfume Page */}
                      <div className="flex flex-col gap-2 pt-1">
                        <button
                          type="button"
                          onClick={handleAdd}
                          disabled={isVariantSoldOut}
                          className={`w-full inline-flex items-center justify-center gap-2 rounded-full py-2.5 px-4 text-[11px] font-semibold uppercase tracking-[0.16em] transition cursor-pointer shadow-lg ${
                            isVariantSoldOut
                              ? "border border-white/15 bg-[#171715] text-[#8e8a82] cursor-not-allowed"
                              : addedFeedback
                              ? "bg-[#d8c08a] text-[#11110f]"
                              : "bg-[#c6a15b] text-[#11110f] hover:bg-[#d8c08a]"
                          }`}
                        >
                          {addedFeedback ? <Check size={14} /> : <ShoppingBag size={14} />}
                          <span>
                            {isVariantSoldOut
                              ? "Sold Out"
                              : addedFeedback
                              ? "Added to Bag"
                              : `Add to Bag • ₹${displayPrice}`}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={handleViewDetails}
                          className="w-full inline-flex items-center justify-center gap-1.5 rounded-full py-2 px-4 border border-white/20 bg-[#12110f]/55 backdrop-blur-sm text-[10px] font-semibold uppercase tracking-[0.16em] text-[#e5dccb] hover:border-[#c6a15b] hover:text-[#fffdf7] transition cursor-pointer"
                        >
                          <span>View Perfume Page</span>
                          <ArrowUpRight size={13} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ─── Mobile 2-Row Clean Card (<md) & Desktop Frame 2 Floating Capsule (md+) ─── */}
                  {activeStage === 1 && (
                    <div className="hidden md:flex items-center gap-2.5 fixed bottom-4 right-6 z-20 rounded-full border border-[#c6a15b]/35 bg-[#12110f]/90 backdrop-blur-md px-3 py-1.5 shadow-2xl">
                      <button
                        type="button"
                        onClick={() => setActiveStage(0)}
                        className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-[#c6a15b]/20 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#d8c08a] transition cursor-pointer whitespace-nowrap"
                      >
                        ← Bottle
                      </button>

                      <div className="inline-flex items-center rounded-full bg-[#181613] border border-white/10 p-0.5">
                        {DECANT_SIZES.map((sz) => (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => setSelectedSize(sz)}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition cursor-pointer ${
                              selectedSize === sz
                                ? "bg-[#c6a15b] text-[#11110f] font-semibold"
                                : "text-[#9e9689] hover:text-[#f4efe6]"
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={handleAdd}
                        disabled={isVariantSoldOut}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#c6a15b] hover:bg-[#d8c08a] text-[#11110f] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] transition cursor-pointer whitespace-nowrap disabled:opacity-50"
                      >
                        {addedFeedback ? <Check size={12} /> : <ShoppingBag size={12} />}
                        <span>{addedFeedback ? "Added" : `Add • ₹${displayPrice}`}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleViewDetails}
                        className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-white/15 text-[#c5c1b9] hover:border-[#c6a15b] hover:text-[#fffdf7] transition cursor-pointer shrink-0"
                        title={`View ${activeScent.name} page`}
                        aria-label={`View ${activeScent.name} page`}
                      >
                        <ArrowUpRight size={13} />
                      </button>
                    </div>
                  )}

                  {/* Mobile Responsive Control Card (Always fits cleanly within 390px without clipping) */}
                  <div className="flex md:hidden flex-col gap-2 fixed bottom-3 left-1/2 -translate-x-1/2 w-[calc(100vw-24px)] max-w-[400px] z-20 rounded-2xl border border-[#c6a15b]/35 bg-[#12110f]/92 backdrop-blur-md p-2.5 shadow-2xl">
                    {/* Row 1: Scent Switcher + Bottle/Notes Flip */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => cycleScent(-1)}
                          className="p-1.5 rounded-lg bg-white/5 text-[#c5c1b9] hover:text-[#fffdf7] cursor-pointer"
                          aria-label="Previous fragrance"
                        >
                          <ChevronLeft size={14} />
                        </button>
                        <span className="px-1.5 font-mono text-[10px] tracking-[0.16em] text-[#c6a15b]">
                          0{activeIndex + 1}/0{SHOWCASE_SCENTS.length}
                        </span>
                        <button
                          type="button"
                          onClick={() => cycleScent(1)}
                          className="p-1.5 rounded-lg bg-white/5 text-[#c5c1b9] hover:text-[#fffdf7] cursor-pointer"
                          aria-label="Next fragrance"
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveStage((s) => (s === 0 ? 1 : 0))}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#c6a15b]/40 bg-[#c6a15b]/10 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#e4cc92] cursor-pointer"
                      >
                        <Sparkles size={11} className="text-[#c6a15b]" />
                        <span>{activeStage === 1 ? "← Studio Bottle" : "Reveal Notes →"}</span>
                      </button>
                    </div>

                    {/* Row 2: Size Picker + Add to Bag + View Page */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
                      <div className="inline-flex items-center rounded-full bg-[#181613] border border-white/10 p-0.5 shrink-0">
                        {DECANT_SIZES.map((sz) => (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => setSelectedSize(sz)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition cursor-pointer ${
                              selectedSize === sz
                                ? "bg-[#c6a15b] text-[#11110f] font-semibold"
                                : "text-[#9e9689] hover:text-[#f4efe6]"
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-1.5 min-w-0">
                        <button
                          type="button"
                          onClick={handleAdd}
                          disabled={isVariantSoldOut}
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#c6a15b] hover:bg-[#d8c08a] text-[#11110f] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] transition cursor-pointer whitespace-nowrap disabled:opacity-50"
                        >
                          {addedFeedback ? <Check size={12} /> : <ShoppingBag size={12} />}
                          <span>
                            {isVariantSoldOut
                              ? "Sold Out"
                              : addedFeedback
                              ? "Added"
                              : `Add • ₹${displayPrice}`}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={handleViewDetails}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-white/20 text-[#e5dccb] hover:border-[#c6a15b] hover:text-[#fffdf7] transition cursor-pointer shrink-0"
                          title={`View ${activeScent.name} page`}
                          aria-label={`View ${activeScent.name} page`}
                        >
                          <ArrowUpRight size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
