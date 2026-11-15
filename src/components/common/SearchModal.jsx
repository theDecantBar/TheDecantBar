import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  X,
  Droplets,
  ShoppingBag,
  ArrowUpRight,
  TrendingUp,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import HighlightMatch from "./HighlightMatch";

// Curated luxury perfume houses stocked in the catalog
const LUXURY_HOUSES_POOL = [
  "Dior",
  "Tom Ford",
  "Creed",
  "Chanel",
  "Kilian",
  "Yves Saint Laurent",
  "Maison Francis Kurkdjian",
  "Parfums de Marly",
  "Xerjoff",
  "Lattafa",
  "Giorgio Armani",
  "Valentino",
  "Maison Margiela",
  "Roja Parfums",
  "Afnan",
  "Versace",
  "Givenchy",
  "Montblanc",
];

// High-demand catalog fragrances with authentic accords & reviews
const POPULAR_FRAGRANCES_POOL = [
  "Creed Aventus",
  "Angels' Share",
  "Sauvage Elixir",
  "Ombré Leather",
  "Baccarat Rouge 540",
  "Bleu de Chanel",
  "Khamrah Qahwa",
  "Grand Soir",
  "Layton",
  "Naxos",
  "Spicebomb Extreme",
  "Black Orchid",
];

// Seasonal & olfactory accord discover tags
const ACCORDS_POOL = ["Winter", "Summer", "Vanilla", "Oud", "Woody", "Amber"];

const RECENT_SEARCHES_KEY = "thedecantbar_recent_searches";

function pickRandom(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateDynamicDiscoveries(products = [], recentList = []) {
  const recentLower = new Set(
    recentList.map((s) => String(s).toLowerCase().trim())
  );

  // 1. Prioritize authentic brands from catalog products when loaded
  const catalogBrands =
    products.length > 0
      ? [...new Set(products.map((p) => p.brand).filter(Boolean))]
      : LUXURY_HOUSES_POOL;

  // Filter out any brands or perfumes the user already has in recent searches
  const eligibleBrands = catalogBrands.filter(
    (b) => !recentLower.has(b.toLowerCase())
  );
  const selectedBrands = pickRandom(
    eligibleBrands.length >= 3 ? eligibleBrands : catalogBrands,
    3
  );

  // 2. Select 3 popular fragrances not in recent searches
  const eligiblePerfumes = POPULAR_FRAGRANCES_POOL.filter(
    (p) => !recentLower.has(p.toLowerCase())
  );
  const selectedPerfumes = pickRandom(
    eligiblePerfumes.length >= 3 ? eligiblePerfumes : POPULAR_FRAGRANCES_POOL,
    3
  );

  // 3. Select 1 seasonal or olfactory accord
  const selectedAccord = pickRandom(ACCORDS_POOL, 1);

  // 4. Combine, deduplicate, and shuffle final chips
  const combined = [
    ...new Set([...selectedBrands, ...selectedPerfumes, ...selectedAccord]),
  ];
  return combined.sort(() => 0.5 - Math.random()).slice(0, 7);
}

export default function SearchModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const inputRef = useRef(null);

  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [discoveryChips, setDiscoveryChips] = useState(() =>
    generateDynamicDiscoveries([], recentSearches)
  );

  // Update dynamic chips whenever modal opens or catalog products load
  useEffect(() => {
    if (isOpen) {
      setDiscoveryChips(generateDynamicDiscoveries(products, recentSearches));
    }
  }, [isOpen, products, recentSearches]);

  const saveRecentSearch = useCallback((term) => {
    if (!term || typeof term !== "string") return;
    const clean = term.trim();
    if (!clean) return;

    setRecentSearches((prev) => {
      const filtered = prev.filter(
        (item) => item.toLowerCase() !== clean.toLowerCase()
      );
      const updated = [clean, ...filtered].slice(0, 5);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const removeRecentSearch = useCallback((termToRemove, e) => {
    e?.stopPropagation();
    setRecentSearches((prev) => {
      const updated = prev.filter((item) => item !== termToRemove);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const clearAllRecentSearches = useCallback(() => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {}
  }, []);

  // Fetch catalog products once when modal first opens
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    async function fetchCatalog() {
      // If we already have products loaded, no need to refetch
      if (products.length > 0) return;

      setLoading(true);
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to load catalog");
        const data = await res.json();
        if (isMounted && Array.isArray(data)) {
          setProducts(data);
        }
      } catch (err) {
        console.error("Search catalog fetch error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchCatalog();

    return () => {
      isMounted = false;
    };
  }, [isOpen, products.length]);

  // Auto-focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveIndex(-1);
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Filter products based on query (supports multi-word tokens and prefix ranking)
  const trimmed = query.trim().toLowerCase();
  const searchWords = trimmed.split(/\s+/).filter(Boolean);
  const filteredProducts = searchWords.length > 0
    ? products
        .filter((p) => {
          const haystack = `${p.brand || ""} ${p.name || ""} ${p.category || ""} ${p.weather || ""}`.toLowerCase();
          return searchWords.every((word) => haystack.includes(word));
        })
        .sort((a, b) => {
          const aName = String(a.name || "").toLowerCase();
          const bName = String(b.name || "").toLowerCase();
          const aStarts = aName.startsWith(trimmed);
          const bStarts = bName.startsWith(trimmed);
          if (aStarts && !bStarts) return -1;
          if (!aStarts && bStarts) return 1;
          return 0;
        })
        .slice(0, 8)
    : [];

  const handleSelectProduct = useCallback(
    (product) => {
      if (!product?.id) return;
      saveRecentSearch(product.name);
      onClose();
      navigate(`/product/${product.id}`);
    },
    [navigate, onClose, saveRecentSearch]
  );

  const handleSubmitSearch = useCallback(
    (e) => {
      e?.preventDefault();
      if (activeIndex >= 0 && filteredProducts[activeIndex]) {
        handleSelectProduct(filteredProducts[activeIndex]);
        return;
      }
      if (!query.trim()) return;

      saveRecentSearch(query.trim());
      onClose();
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    },
    [activeIndex, filteredProducts, handleSelectProduct, navigate, onClose, query, saveRecentSearch]
  );

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
      return;
    }

    if (filteredProducts.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev >= filteredProducts.length - 1 ? 0 : prev + 1
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev <= 0 ? filteredProducts.length - 1 : prev - 1
      );
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex flex-col justify-start overflow-y-auto px-3 py-4 sm:px-6 sm:py-12 md:py-16">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
          aria-hidden="true"
        />

        {/* Search Modal Card */}
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Search Fragrances"
          initial={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 0, scale: 0.96, y: -16 }
          }
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.96, y: -16 }
          }
          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-[#c6a15b]/35 bg-[#121210] shadow-[0_24px_60px_rgba(0,0,0,0.85)] ring-1 ring-white/10"
        >
          {/* Top Search Input Bar */}
          <form
            onSubmit={handleSubmitSearch}
            className="flex items-center border-b border-white/10 px-4 py-3 sm:px-5 sm:py-4"
          >
            <Search
              size={20}
              strokeWidth={1.5}
              className="mr-3 shrink-0 text-[#c6a15b]"
            />

            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(-1);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search 99+ fragrances, brands, or accords..."
              className="w-full bg-transparent text-sm sm:text-base text-[#f4efe6] placeholder-[#817b70] outline-none"
            />

            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                className="mr-2 text-[#8e8a82] hover:text-[#f4efe6] transition p-1"
                aria-label="Clear search input"
              >
                <X size={16} />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-[#8e8a82] hover:bg-white/10 hover:text-[#f4efe6] transition"
            >
              ESC
            </button>
          </form>

          {/* Modal Content */}
          <div className="max-h-[65vh] overflow-y-auto p-4 sm:p-5 overscroll-contain">
            {/* 1. Empty Query: Recent Searches, Trending Discovery Chips & Top 7 Popular Fragrances */}
            {!query.trim() && (
              <div className="space-y-5">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                      <div className="flex items-center gap-2">
                        <Clock size={13} />
                        <span>Recent Searches</span>
                      </div>
                      <button
                        type="button"
                        onClick={clearAllRecentSearches}
                        className="text-[10px] text-[#8e8a82] hover:text-red-400 uppercase tracking-wider transition cursor-pointer"
                      >
                        Clear All
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term) => (
                        <span
                          key={term}
                          onClick={() => {
                            setQuery(term);
                            inputRef.current?.focus();
                          }}
                          className="group/chip inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#171714] pl-3.5 pr-2 py-1.5 text-xs text-[#f4efe6] hover:border-[#c6a15b]/50 hover:bg-[#c6a15b]/10 hover:text-[#c6a15b] transition duration-150 cursor-pointer"
                        >
                          <span>{term}</span>
                          <button
                            type="button"
                            aria-label={`Remove ${term} from history`}
                            onClick={(e) => removeRecentSearch(term, e)}
                            className="text-[#8e8a82] hover:text-[#f4efe6] p-0.5 rounded transition"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dynamic Popular Discovery Chips */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                    <TrendingUp size={14} />
                    <span>Popular Discoveries</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {discoveryChips.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          setQuery(tag);
                          saveRecentSearch(tag);
                          inputRef.current?.focus();
                        }}
                        className="rounded-xl border border-white/10 bg-[#171714] px-3.5 py-1.5 text-xs text-[#f4efe6] hover:border-[#c6a15b]/50 hover:bg-[#c6a15b]/10 hover:text-[#c6a15b] transition duration-200 cursor-pointer"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-[#8e8a82]">
                  <span>Search authentic decants across 2ml, 5ml, and 10ml</span>
                  <span className="hidden sm:inline">Use ↑ ↓ arrows to navigate</span>
                </div>
              </div>
            )}

            {/* 2. Loading State */}
            {query.trim() && loading && (
              <div className="py-12 text-center text-xs text-[#8e8a82]">
                <Droplets size={20} className="mx-auto mb-2 text-[#c6a15b] animate-spin" />
                <span>Searching catalog...</span>
              </div>
            )}

            {/* 3. Matching Products List */}
            {query.trim() && !loading && filteredProducts.length > 0 && (
              <div className="space-y-1">
                <div className="flex items-center justify-between px-2 pb-2 text-[11px] uppercase tracking-wider text-[#8e8a82]">
                  <span>Matching Fragrances ({filteredProducts.length})</span>
                  <span>Press Enter to select</span>
                </div>

                <div className="divide-y divide-white/5">
                  {filteredProducts.map((product, idx) => {
                    const isSelected = activeIndex === idx;
                    const startingPrice =
                      product.variants?.length > 0
                        ? Math.min(...product.variants.map((v) => Number(v.price)))
                        : product.price;

                    return (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => handleSelectProduct(product)}
                        onMouseEnter={() => setActiveIndex(idx)}
                        className={`group flex w-full items-center justify-between rounded-xl p-2.5 sm:p-3 text-left transition duration-150 cursor-pointer ${
                          isSelected
                            ? "bg-[#c6a15b]/15 border border-[#c6a15b]/40"
                            : "hover:bg-white/5 border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          {/* Thumbnail */}
                          <div className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-lg border border-white/10 bg-[#171714] p-1 flex items-center justify-center overflow-hidden">
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="h-full w-full object-contain"
                                loading="lazy"
                              />
                            ) : (
                              <ShoppingBag
                                size={18}
                                className="text-[#c6a15b]/50"
                              />
                            )}
                          </div>

                          {/* Info */}
                          <div className="min-w-0">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#c6a15b]">
                              {product.brand || product.category || "FRAGRANCE"}
                            </p>
                            <p className="text-sm font-display text-[#f4efe6] group-hover:text-[#c6a15b] transition truncate">
                              <HighlightMatch text={product.name} query={query} />
                            </p>
                            <p className="text-[11px] text-[#8e8a82] mt-0.5">
                              {product.variants?.map((v) => `${v.size_ml}ml`).join(" · ") || "Decant"}
                            </p>
                          </div>
                        </div>

                        {/* Price & Action */}
                        <div className="text-right shrink-0 pl-3">
                          {startingPrice && (
                            <p className="text-xs font-semibold text-[#f4efe6]">
                              From ₹{startingPrice}
                            </p>
                          )}
                          <div className="flex items-center justify-end gap-1 text-[10px] text-[#c6a15b] opacity-0 group-hover:opacity-100 transition mt-1">
                            <span>View</span>
                            <ArrowUpRight size={12} />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. No Results Found */}
            {query.trim() && !loading && filteredProducts.length === 0 && (
              <div className="py-10 text-center">
                <Search
                  size={28}
                  strokeWidth={1.2}
                  className="mx-auto mb-3 text-[#c6a15b]/60"
                />
                <p className="font-display text-lg text-[#f4efe6]">
                  No fragrances found for "{query}"
                </p>
                <p className="mt-1 text-xs text-[#8e8a82] max-w-sm mx-auto">
                  Try searching by perfume house (e.g. Dior, Creed, Tom Ford) or browse our complete collection.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate("/products");
                  }}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[#c6a15b] bg-[#c6a15b] px-5 py-2 text-xs font-semibold uppercase tracking-wider text-[#11110f] hover:bg-[#d8c08a] transition"
                >
                  Browse Full Collection
                </button>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          {query.trim() && filteredProducts.length > 0 && (
            <div className="border-t border-white/10 bg-[#161613] px-4 py-3 flex items-center justify-between">
              <span className="text-xs text-[#8e8a82]">
                Showing top matches for "{query}"
              </span>
              <button
                type="button"
                onClick={handleSubmitSearch}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#c6a15b] hover:text-[#d8c08a] transition cursor-pointer"
              >
                <span>View all in Shop</span>
                <ArrowUpRight size={14} />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

