import { useEffect, useState } from "react";

import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/products/ProductCard";
import Navbar from "../../components/Navbar";

function Products() {
    const [searchParams] = useSearchParams();
const gender = searchParams.get("gender") || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  

  useEffect(() => {
   
fetch(
  `http://localhost:5000/api/products?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}&gender=${encodeURIComponent(gender)}`
)
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, [search, category, gender]);

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


<div className="max-w-7xl mx-auto mb-10 flex flex-col sm:flex-row gap-3">
  <input
    type="text"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Search fragrances..."
    className="w-full sm:flex-1 bg-[#151512] border border-white/15 px-5 py-4 text-[#f4efe6] placeholder:text-[#f4efe6]/40 focus:outline-none focus:border-[#c6a15b] transition"
  />

  <select
    value={category}
    onChange={(e) => setCategory(e.target.value)}
    className="w-full sm:w-1/3 bg-[#151512] border border-white/15 px-5 py-4 text-[#f4efe6] focus:outline-none focus:border-[#c6a15b] transition"
  >
    <option value="">All Categories</option>
    <option value="Designer">Designer</option>
    <option value="Niche">Niche</option>
    <option value="Middle eastern">Middle Eastern</option>
  </select>

  {(search || category) && (
    <button
      onClick={() => {
        setSearch("");
        setCategory("");
      }}
      className="border border-[#c6a15b] px-5 py-3 text-[#c6a15b] text-sm uppercase tracking-wider hover:bg-[#c6a15b] hover:text-[#11110f] transition"
    >
      Clear Filters
    </button>
  )}
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