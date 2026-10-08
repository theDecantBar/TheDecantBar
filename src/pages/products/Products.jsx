import { useEffect, useState } from "react";
import ProductCard from "../../components/products/ProductCard";
import Navbar from "../../components/Navbar";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading products...</p>
      </div>
    );
  }

  return (
  <>
    <Navbar />

    <div className="min-h-screen bg-[#11110f] px-6 pt-20 pb-16">

      {/* Page Heading */}
      <div className="max-w-7xl mx-auto mb-14">
  <p className="text-[#c6a15b] text-xs uppercase tracking-[0.35em]">
    TheDecantBar
  </p>

  <h1 className="font-display text-5xl md:text-6xl text-[#f4efe6] mt-3">
    Our Collection
  </h1>

  <div className="w-16 h-px bg-[#c6a15b] mt-6 mb-5" />

  <p className="text-[#f4efe6]/60 text-sm md:text-base max-w-xl">
    Explore our collection of {products.length} fragrances,
    carefully selected for every mood and occasion.
  </p>
</div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>

       </div>
  </>
  );
}

export default Products;