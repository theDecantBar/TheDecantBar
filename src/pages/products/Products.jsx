
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/products/ProductCard";
import FilterBar from "../../components/FilterBar";

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
  const [prevSearchParam, setPrevSearchParam] = useState(searchParam);

  if (prevSearchParam !== searchParam) {
    setPrevSearchParam(searchParam);
    setSearch(searchParam);
  }

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();

        if (search) params.set("search", search);
        if (category) params.set("category", category);
        if (gender) params.set("gender", gender);
        if (weather) params.set("weather", weather);

        const response = await fetch(
          `/api/products?${params.toString()}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Failed to load products");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Unexpected products response");
        }

        setProducts(data);
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
  }, [search, category, gender, weather]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const newParams = new URLSearchParams(searchParams);

    if (search.trim()) {
      newParams.set("search", search.trim());
    } else {
      newParams.delete("search");
    }

    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearch("");
    setSearchParams({});
  };

  // Dynamic header based on category, gender, or season
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
    const label =
      gender.toUpperCase() === "M" || gender.toLowerCase() === "men"
        ? "Men"
        : gender.toUpperCase() === "W" ||
          gender.toLowerCase() === "women"
        ? "Women"
        : "Unisex";

    pageTitle = `Fragrances for ${label}`;
    pageSubtitle = `Handpicked luxury decants curated especially for ${label.toLowerCase()}.`;
  }

  return (
    <div className="min-h-screen bg-[#11110f] text-[#f4efe6]">
      {/* Header Section */}
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
        {/* Search Bar & Quick Controls */}
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

        {/* Product Results */}
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
              onClick={() => setSearch((current) => current)}
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
            <p className="mx-auto mb-5 max-w-7xl text-sm text-[#f4efe6]/60">
              {products.length} fragrances found
              {category ? ` in ${category}` : ""}
              {gender ? ` for ${gender}` : ""}
              {weather ? ` (${weather})` : ""}
            </p>

            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Products;
