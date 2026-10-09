
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/products/ProductCard";

function Products() {
  const [searchParams] = useSearchParams();
  const gender = searchParams.get("gender") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({
          search,
          category,
          gender,
        });

        const response = await fetch(`/api/products?${params}`, {
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
  }, [search, category, gender]);

  return (
    <div className="min-h-screen bg-[#11110f] px-6 pb-16 pt-12 text-[#f4efe6]">
      <div className="mx-auto mb-10 max-w-7xl">
        <p className="text-xs uppercase tracking-[0.35em] text-[#c6a15b]">
          The Decant Bar
        </p>

        <h1 className="mt-3 font-display text-5xl md:text-6xl">
          Our Collection
        </h1>

        <div className="mb-5 mt-6 h-px w-16 bg-[#c6a15b]" />

        <p className="max-w-xl text-sm text-[#f4efe6]/60 md:text-base">
          Explore our collection of fragrances, carefully selected for every
          mood and occasion.
        </p>
      </div>

      <div className="mx-auto mb-10 flex max-w-7xl flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search fragrances..."
          aria-label="Search fragrances"
          className="w-full border border-white/15 bg-[#151512] px-5 py-4 text-[#f4efe6] placeholder:text-[#f4efe6]/40 transition focus:border-[#c6a15b] focus:outline-none sm:flex-1"
        />

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          aria-label="Filter by category"
          className="w-full border border-white/15 bg-[#151512] px-5 py-4 text-[#f4efe6] transition focus:border-[#c6a15b] focus:outline-none sm:w-1/3"
        >
          <option value="">All Categories</option>
          <option value="Designer">Designer</option>
          <option value="Niche">Niche</option>
          <option value="Middle eastern">Middle Eastern</option>
        </select>

        {(search || category) && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setCategory("");
            }}
            className="border border-[#c6a15b] px-5 py-3 text-sm uppercase tracking-wider text-[#c6a15b] transition hover:bg-[#c6a15b] hover:text-[#11110f]"
          >
            Clear Filters
          </button>
        )}
      </div>

      {loading ? (
        <p className="py-12 text-center">Loading products...</p>
      ) : error ? (
        <div className="py-12 text-center">
          <p className="text-red-300">{error}</p>
          <button
            type="button"
            onClick={() => {
              setSearch((current) => current);
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
          <p className="mx-auto mb-5 max-w-7xl text-sm text-[#f4efe6]/60">
            {products.length} fragrances found
            {gender ? ` for ${gender}` : ""}
          </p>

          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Products;
