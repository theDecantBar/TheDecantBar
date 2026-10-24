import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/products/ProductCard";
import FilterBar from "../../components/FilterBar";

const PRODUCTS_PER_PAGE = 4;

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchParam = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const gender = searchParams.get("gender") || "";
  const weather =
    searchParams.get("weather") || searchParams.get("season") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState(searchParam);
  const [currentPage, setCurrentPage] = useState(1);

  // Keep the search field synchronized with the URL.
  useEffect(() => {
    setSearch(searchParam);
  }, [searchParam]);

  // Fetch products using the current search and filters.
  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();

        if (searchParam) {
          params.set("search", searchParam);
        }

        if (category) {
          params.set("category", category);
        }

        if (gender) {
          params.set("gender", gender);
        }

        if (weather) {
          params.set("weather", weather);
        }

        const url = "/api/products?" + params.toString();

        const response = await fetch(url, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to load products");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Unexpected products response");
        }

        setProducts(data);
        setCurrentPage(1);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error fetching products:", err);
          setError("We couldn't load the products. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => controller.abort();
  }, [searchParam, category, gender, weather]);

  // Submit the search.
  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const newParams = new URLSearchParams(searchParams);
    const trimmedSearch = search.trim();

    if (trimmedSearch) {
      newParams.set("search", trimmedSearch);
    } else {
      newParams.delete("search");
    }

    setCurrentPage(1);
    setSearchParams(newParams);
  };

  // Clear all filters and search parameters.
  const handleClearFilters = () => {
    setSearch("");
    setCurrentPage(1);
    setSearchParams({});
  };

  // Calculate pagination.
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const firstVisiblePage = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  const visiblePages = Array.from(
    { length: Math.min(5, totalPages) },
    (_, index) => firstVisiblePage + index
  );
  const paginationButtonClass = "flex h-10 min-w-8 items-center justify-center rounded-sm border border-white/15 px-1.5 text-xs font-medium transition-colors hover:border-[#c6a15b]/70 hover:bg-[#c6a15b]/10 hover:text-[#c6a15b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c6a15b] disabled:pointer-events-none disabled:opacity-30 sm:h-11 sm:min-w-11 sm:px-3 sm:text-sm";
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;

  const visibleProducts = products.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE
  );

  // Navigate between pages.
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Dynamic page heading.
  let pageTitle = "Our Collection";

  let pageSubtitle =
    "Explore our collection of authentic luxury fragrances, carefully decanted for every mood and occasion.";

  if (category && category.toLowerCase() === "niche") {
    pageTitle = "Niche Masterpieces";
    pageSubtitle =
      "Rare, artisanal formulations crafted with opulent raw ingredients and uncompromising artistic freedom.";
  } else if (category && category.toLowerCase() === "designer") {
    pageTitle = "Designer Icons";
    pageSubtitle =
      "The pinnacle of high-fashion luxury scent craft from Tom Ford, Dior, YSL, Chanel, and more.";
  } else if (category && category.toLowerCase().includes("middle")) {
    pageTitle = "Middle Eastern Powerhouses";
    pageSubtitle =
      "Rich ambers, hypnotic ouds, and long-lasting oriental elixirs that command the room.";
  } else if (gender) {
    const normalizedGender = gender.toLowerCase();

    const label =
      normalizedGender === "m" || normalizedGender === "men"
        ? "Men"
        : normalizedGender === "w" || normalizedGender === "women"
        ? "Women"
        : "Unisex";

    pageTitle = "Fragrances for " + label;
    pageSubtitle =
      "Handpicked luxury decants curated especially for " +
      label.toLowerCase() +
      ".";
  }

  return (
    <div className="min-h-screen bg-[#11110f] text-[#f4efe6]">
      {/* Header */}
      <div className="mx-auto max-w-7xl px-6 pt-12">
        <p className="text-xs uppercase tracking-[0.35em] text-[#c6a15b]">
          The Decant Bar
        </p>

        <h1 className="mt-3 font-display text-5xl md:text-6xl">
          {pageTitle}
        </h1>

        <div className="mb-5 mt-6 h-px w-16 bg-[#c6a15b]" />

        <p className="max-w-xl text-sm text-[#f4efe6]/60 md:text-base">
          {pageSubtitle}
        </p>
      </div>

      {/* Filters */}
      <div className="mt-8">
        <FilterBar />
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-16 pt-8">
        {/* Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="mb-10 flex flex-col gap-3 sm:flex-row"
        >
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search fragrances by name..."
            aria-label="Search fragrances"
            className="w-full border border-white/15 bg-[#151512] px-5 py-3.5 text-sm text-[#f4efe6] placeholder:text-[#f4efe6]/40 transition focus:border-[#c6a15b] focus:outline-none sm:flex-1"
          />

          <button
            type="submit"
            className="border border-[#c6a15b]/40 bg-[#c6a15b]/10 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#c6a15b] transition hover:bg-[#c6a15b] hover:text-[#11110f]"
          >
            Search
          </button>

          {(search || category || gender || weather) && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="border border-white/15 px-5 py-3.5 text-xs uppercase tracking-wider text-[#8e8a82] transition hover:border-[#c6a15b]/50 hover:text-[#f4efe6]"
            >
              Clear All
            </button>
          )}
        </form>

        {/* Products */}
        <div id="product-results">
          {loading ? (
            <div
              className="min-h-12 py-6"
              aria-label="Loading products"
            />
          ) : error ? (
            <div className="py-12 text-center">
              <p className="text-red-300">{error}</p>

              <button
                type="button"
                onClick={() => {
                  setSearchParams(new URLSearchParams(searchParams));
                }}
                className="mt-4 text-sm text-[#c6a15b] underline"
              >
                Retry
              </button>
            </div>
          ) : products.length === 0 ? (
            <p className="py-12 text-center text-[#f4efe6]/60">
              No fragrances found. Try changing your filters.
            </p>
          ) : (
            <>
              {/* Product Count */}
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-[#f4efe6]/60">
                  Showing {startIndex + 1}–
                  {Math.min(
                    startIndex + PRODUCTS_PER_PAGE,
                    products.length
                  )}{" "}
                  of {products.length} fragrances
                  {category ? " in " + category : ""}
                  {gender ? " for " + gender : ""}
                  {weather ? " (" + weather + ")" : ""}
                </p>

                <p className="text-xs uppercase tracking-wider text-[#c6a15b]">
                  Page {currentPage} of {totalPages}
                </p>
              </div>

              {/* Four Product Cards Per Page */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visibleProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
            <nav aria-label="Collection pagination" className="mt-12 flex flex-col items-center gap-4 border-t border-white/10 pt-8">
              <div className="flex items-center gap-1 sm:gap-2">
                <button type="button" aria-label="Previous page" disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)} className={paginationButtonClass}>
                  ← Prev
                </button>
                {firstVisiblePage > 1 && <span aria-hidden="true" className="px-0.5 text-[#8e8a82]">…</span>}
                {visiblePages.map((page) => (
                  <button key={page} type="button" aria-label={`Go to page ${page}`} aria-current={page === currentPage ? "page" : undefined} onClick={() => goToPage(page)} className={`${paginationButtonClass} ${page === currentPage ? "border-[#c6a15b] bg-[#c6a15b] text-[#11110f] hover:bg-[#c6a15b] hover:text-[#11110f]" : "text-[#f4efe6]"}`}>
                    {page}
                  </button>
                ))}
                {firstVisiblePage + visiblePages.length - 1 < totalPages && <span aria-hidden="true" className="px-0.5 text-[#8e8a82]">…</span>}
                <button type="button" aria-label="Next page" disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)} className={paginationButtonClass}>
                  Next →
                </button>
              </div>
              <p aria-live="polite" className="text-xs tracking-wide text-[#8e8a82]">Page {currentPage} of {totalPages}</p>
            </nav>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;