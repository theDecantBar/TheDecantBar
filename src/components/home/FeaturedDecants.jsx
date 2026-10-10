import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import Container from "../ui/Container";
import ProductCard from "../products/ProductCard";

export default function FeaturedDecants() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const response = await fetch("/api/products");
        if (response.ok) {
          const data = await response.json();
          // Prioritize top popular fragrances if available, or first 8
          const popularNames = [
            "Aventus",
            "Tobacco Vanille",
            "Baccarat Rouge 540",
            "Sauvage",
            "Angels' Share",
            "Naxos",
            "Hawas",
            "Bleu de Chanel",
            "Oud Wood",
            "Tuscan Leather",
          ];

          const sorted = [...data].sort((a, b) => {
            const aPop = popularNames.some((name) =>
              a.name?.toLowerCase().includes(name.toLowerCase())
            );
            const bPop = popularNames.some((name) =>
              b.name?.toLowerCase().includes(name.toLowerCase())
            );
            if (aPop && !bPop) return -1;
            if (!aPop && bPop) return 1;
            return 0;
          });

          setProducts(sorted.slice(0, 8));
        }
      } catch (err) {
        console.error("Failed to load featured products:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <section className="bg-[#11110f] py-20 border-b border-white/10">
        <Container>
          <div className="text-center py-12">
            <p className="text-xs uppercase tracking-[0.25em] text-[#c6a15b]">
              Curating Scents...
            </p>
          </div>
        </Container>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="bg-[#11110f] py-20 sm:py-28 border-b border-white/10">
      <Container>
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 sm:mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={14} className="text-[#c6a15b]" />
              <p className="text-xs uppercase tracking-[0.25em] text-[#c6a15b] font-medium">
                The Curated Selection
              </p>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl text-[#f4efe6]">
              Most Coveted Decants
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-[#8e8a82] max-w-xl">
              Experience the world's most sought-after niche and designer fragrances in authentic 2ml, 5ml, and 10ml travel decants.
            </p>
          </div>

          <Link
            to="/products"
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#c6a15b] hover:text-[#d8c08a] transition shrink-0"
          >
            <span>View All Fragrances</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-14 text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-3 border border-[#c6a15b] bg-[#c6a15b] px-9 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#11110f] hover:bg-[#d8c08a] transition shadow-lg"
          >
            Explore All 160+ Perfumes
            <ArrowRight size={15} />
          </Link>
        </div>
      </Container>
    </section>
  );
}
