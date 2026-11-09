import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  X,
  Loader2,
  Sparkles,
  ShoppingBag,
  ArrowUpRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import HighlightMatch from "./HighlightMatch";

export default function LiveSearch() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const resultsListRef = useRef(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  // Debounced live search with AbortController to prevent race conditions
  useEffect(() => {
    const trimmed = query.trim();

    if (!trimmed) {
      setResults([]);
      setLoading(false);
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }

    setLoading(true);
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/products?search=${encodeURIComponent(trimmed)}&limit=8`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Failed to search products");
        }

        const data = await response.json();
        setResults(Array.isArray(data) ? data : []);
        setIsOpen(true);
        setActiveIndex(-1);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Live autocomplete search error:", err);
        }
      } finally {
        setLoading(false);
      }
    }, 280);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Global Ctrl+K / Cmd+K listener to focus search input
  useEffect(() => {
    const handleGlobalKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        if (query.trim()) {
          setIsOpen(true);
        }
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [query]);

  // Navigate to product detail
  const handleSelectProduct = useCallback(
    (product) => {
      if (!product?.id) return;
      setIsOpen(false);
      setActiveIndex(-1);
      navigate(`/product/${product.id}`);
    },
    [navigate]
  );

  // Submit full search to /products page
  const handleSubmit = useCallback(
    (e) => {
      e?.preventDefault();
      const trimmed = query.trim();

      // If an item in the dropdown is highlighted via arrow keys, select it
      if (activeIndex >= 0 && results[activeIndex]) {
        handleSelectProduct(results[activeIndex]);
        return;
      }

      if (!trimmed) return;
      setIsOpen(false);
      setActiveIndex(-1);
      inputRef.current?.blur();
      navigate(`/products?search=${encodeURIComponent(trimmed)}`);
    },
    [activeIndex, handleSelectProduct, navigate, query, results]
  );

  // Keyboard navigation (ArrowDown, ArrowUp, Enter, Escape)
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
      inputRef.current?.blur();
      return;
    }

    if (!isOpen || results.length === 0) {
      if (e.key === "ArrowDown" && query.trim()) {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev >= results.length - 1 ? 0 : prev + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? results.length - 1 : prev - 1));
    }
  };

  // Scroll active item into view during keyboard navigation
  useEffect(() => {
    if (activeIndex >= 0 && resultsListRef.current) {
      const activeEl = resultsListRef.current.children[activeIndex];
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [activeIndex]);

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Search Bar Input */}
      <form onSubmit={handleSubmit} className="relative flex h-11 w-full items-center">
        <Search
          size={15}
          strokeWidth={1.5}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#c6a15b] transition-transform duration-300 group-hover:scale-110"
        />

        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.trim()) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search 99+ fragrances..."
          aria-label="Search fragrances"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          className="h-11 w-full rounded-full border border-white/15 bg-[#141412] pl-10 pr-9 text-xs text-[#f4efe6] placeholder-[#8e8a82] shadow-sm transition-all duration-300 hover:border-[#c6a15b]/60 hover:bg-[#181815] focus:border-[#c6a15b] focus:bg-[#181815] focus:outline-none"
        />

        {/* Right Status / Action */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
          {loading ? (
            <Loader2
              size={14}
              className="animate-spin text-[#c6a15b]"
              aria-label="Searching..."
            />
          ) : query ? (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search query"
              className="p-0.5 text-[#8e8a82] hover:text-[#f4efe6] transition cursor-pointer"
            >
              <X size={14} />
            </button>
          ) : (
            <kbd className="hidden rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-mono text-[#8e8a82] xl:inline-block pointer-events-none select-none">
              ⌘K
            </kbd>
          )}
        </div>
      </form>

      {/* Autocomplete Dropdown */}
      <AnimatePresence>
        {isOpen && query.trim().length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute left-0 top-[calc(100%+8px)] z-50 w-[min(calc(100vw-32px),380px)] sm:w-[400px] lg:w-[420px] rounded-2xl border border-[#c6a15b]/35 bg-[#131311] p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.88),0_0_0_1px_rgba(255,255,255,0.06)] backdrop-blur-xl"
          >
            {/* Loading state during initial query fetch */}
            {loading && results.length === 0 && (
              <div className="py-8 text-center text-xs text-[#8e8a82]">
                <Sparkles
                  size={18}
                  className="mx-auto mb-2 text-[#c6a15b] animate-spin"
                />
                <span>Searching catalogue...</span>
              </div>
            )}

            {/* Results list */}
            {!loading && results.length > 0 && (
              <div>
                <div className="flex items-center justify-between px-3 py-1.5 text-[10px] uppercase tracking-wider text-[#8e8a82]">
                  <span>Matching Fragrances ({results.length})</span>
                  <span className="hidden sm:inline">↑↓ to navigate · ↵ to select</span>
                </div>

                <div
                  ref={resultsListRef}
                  className="max-h-[360px] overflow-y-auto overscroll-contain divide-y divide-white/5 [scrollbar-width:thin] rounded-xl"
                >
                  {results.map((product, idx) => {
                    const isSelected = activeIndex === idx;
                    const startingPrice =
                      Array.isArray(product.variants) && product.variants.length > 0
                        ? Math.min(
                            ...product.variants
                              .filter((v) => v.price != null && !isNaN(Number(v.price)))
                              .map((v) => Number(v.price))
                          )
                        : product.price || null;

                    const sizesText =
                      Array.isArray(product.variants) && product.variants.length > 0
                        ? product.variants.map((v) => `${v.size_ml}ml`).join(" · ")
                        : null;

                    return (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => handleSelectProduct(product)}
                        onMouseEnter={() => setActiveIndex(idx)}
                        className={`group flex w-full items-center justify-between rounded-xl p-2.5 sm:p-3 text-left transition duration-150 cursor-pointer ${
                          isSelected
                            ? "bg-[#c6a15b]/15 border border-[#c6a15b]/40 shadow-[inset_0_0_12px_rgba(198,161,91,0.12)]"
                            : "hover:bg-white/5 border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Perfume Image Thumbnail */}
                          <div className="h-11 w-11 sm:h-12 sm:w-12 shrink-0 rounded-lg border border-white/10 bg-[#181815] p-1 flex items-center justify-center overflow-hidden">
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="h-full w-full object-contain"
                                loading="lazy"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <ShoppingBag
                                size={16}
                                className="text-[#c6a15b]/50"
                              />
                            )}
                          </div>

                          {/* Product Details */}
                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#c6a15b]">
                              {product.brand || product.category || "FRAGRANCE"}
                            </p>
                            <p className="text-xs sm:text-sm font-medium text-[#f4efe6] group-hover:text-[#c6a15b] transition truncate">
                              <HighlightMatch text={product.name} query={query} />
                            </p>
                            {sizesText && (
                              <p className="text-[10px] text-[#8e8a82] mt-0.5">
                                {sizesText}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Starting Price & Arrow */}
                        <div className="text-right shrink-0 pl-3">
                          {startingPrice != null && (
                            <p className="text-xs font-semibold text-[#f4efe6]">
                              From ₹{Number(startingPrice).toLocaleString("en-IN")}
                            </p>
                          )}
                          <div className="flex items-center justify-end gap-0.5 text-[10px] text-[#c6a15b] opacity-0 group-hover:opacity-100 transition mt-0.5">
                            <span>View</span>
                            <ArrowUpRight size={11} />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Footer with "View all in Shop" */}
                <div className="mt-1 border-t border-white/10 bg-[#161613] px-3.5 py-2.5 rounded-b-xl flex items-center justify-between">
                  <span className="text-[11px] text-[#8e8a82]">
                    Showing top {results.length} matches
                  </span>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex items-center gap-1 text-[11px] font-semibold text-[#c6a15b] hover:text-[#d8c08a] transition cursor-pointer"
                  >
                    <span>View all in Shop</span>
                    <ArrowUpRight size={13} />
                  </button>
                </div>
              </div>
            )}

            {/* Empty state: No perfumes found */}
            {!loading && results.length === 0 && (
              <div className="py-7 px-4 text-center">
                <Search
                  size={24}
                  strokeWidth={1.3}
                  className="mx-auto mb-2 text-[#c6a15b]/60"
                />
                <p className="font-display text-sm text-[#f4efe6]">
                  No perfumes found for "{query}"
                </p>
                <p className="mt-1 text-[11px] text-[#8e8a82] max-w-xs mx-auto">
                  Try searching by brand (e.g. Dior, Tom Ford, Creed) or browse our complete collection.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setQuery("");
                    navigate("/products");
                  }}
                  className="mt-3.5 inline-flex items-center gap-1.5 rounded-full border border-[#c6a15b]/40 bg-[#c6a15b]/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#c6a15b] transition hover:bg-[#c6a15b] hover:text-[#11110f] cursor-pointer"
                >
                  <span>Browse Full Collection</span>
                  <ArrowUpRight size={12} />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
