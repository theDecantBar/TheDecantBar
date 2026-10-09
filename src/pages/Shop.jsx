
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Container from "../components/ui/Container";

export default function Shop() {
  const [searchParams] = useSearchParams();
  const gender = searchParams.get("gender") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();

        if (gender) {
          params.set("gender", gender);
        }

        const query = params.toString();
        const url = `http://localhost:5000/api/products${query ? `?${query}` : ""}`;

        const response = await fetch(url, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Could not load products from the server.");
        }

        const data = await response.json();
        setProducts(Array.isArray(data) ? data : data.products || []);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Unable to load products. Please check that the backend is running.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => controller.abort();
  }, [gender]);

  return (
    <Container className="py-20">
      <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#c6a15b]">
        The Collection
      </p>

      <h1 className="mt-2 font-display text-4xl text-[#f4efe6] sm:text-5xl">
        {gender === "M" ? "Fragrances for Men" :
         gender === "W" ? "Fragrances for Women" :
         gender === "M/W" ? "Unisex Fragrances" :
         "All Fragrances"}
      </h1>

      {loading && (
        <p className="mt-8 text-sm text-[#8e8a82]">Loading fragrances...</p>
      )}

      {error && (
        <p className="mt-8 text-sm text-red-400">{error}</p>
      )}

      {!loading && !error && products.length === 0 && (
        <p className="mt-8 text-sm text-[#8e8a82]">
          No fragrances found in this collection.
        </p>
      )}

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => {
          const firstVariant = product.variants?.[0];

          return (
            <article
              key={product.id}
              className="overflow-hidden border border-white/10 bg-[#151512] transition hover:border-[#c6a15b]/60"
            >
              <div className="flex aspect-[4/5] items-center justify-center bg-[#1c1c18]">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xs uppercase tracking-[0.2em] text-[#c6a15b]/60">
                    {product.brand || "The Decant Bar"}
                  </span>
                )}
              </div>

              <div className="p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-[#c6a15b]">
                  {product.brand || product.category || "Fragrance"}
                </p>

                <h2 className="mt-2 font-display text-2xl text-[#f4efe6]">
                  {product.name}
                </h2>

                <p className="mt-2 text-xs text-[#8e8a82]">
                  {product.gender === "M/W" ? "Unisex" :
                   product.gender === "M" ? "Men" :
                   product.gender === "W" ? "Women" :
                   product.gender || ""}
                </p>

                {firstVariant && (
                  <p className="mt-4 text-lg text-[#f4efe6]">
                    From ₹{firstVariant.price}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  {(product.variants || []).map((variant) => (
                    <span
                      key={variant.id}
                      className="border border-white/15 px-3 py-2 text-xs text-[#f4efe6]/80"
                    >
                      {variant.size_ml} ml
                    </span>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </Container>
  );
}