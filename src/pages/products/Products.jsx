
import { useEffect, useState } from "react";
import ProductCard from "../../components/products/ProductCard";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load products");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setError("We couldn't load the products. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-[#11110f] text-[#f4efe6]">
        <p className="text-lg">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-[#11110f] px-6 text-[#f4efe6]">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#11110f] px-6 pb-16 pt-12 text-[#f4efe6]">
      <div className="mx-auto mb-14 max-w-7xl">
        <p className="text-xs uppercase tracking-[0.35em] text-[#c6a15b]">
          The Decant Bar
        </p>

        <h1 className="mt-3 font-display text-5xl md:text-6xl">
          Our Collection
        </h1>

        <div className="mb-5 mt-6 h-px w-16 bg-[#c6a15b]" />

        <p className="max-w-xl text-sm text-[#f4efe6]/60 md:text-base">
          Explore our collection of {products.length} fragrances,
          carefully selected for every mood and occasion.
        </p>
      </div>

      {products.length === 0 ? (
        <p className="py-12 text-center text-[#f4efe6]/60">
          No fragrances found.
        </p>
      ) : (
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;
