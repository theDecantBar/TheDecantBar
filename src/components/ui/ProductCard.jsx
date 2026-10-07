import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

export default function ProductCard({ product, className = "" }) {
  if (!product) return null;

  const {
    id,
    name,
    category,
    gender,
    variants = [],
  } = product;

  // Calculate lowest price and available sizes from variants array
  const activeVariants = variants.filter((v) => v.active !== false);
  const prices = activeVariants.map((v) => Number(v.price)).filter((p) => !isNaN(p) && p > 0);
  const minPrice = prices.length > 0 ? Math.min(...prices) : null;
  const sizes = activeVariants.map((v) => v.size_ml).sort((a, b) => a - b);

  return (
    <div className={`group flex flex-col ${className}`}>
      {/* Product Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#181815] border border-white/5">
        <Link to={`/product/${id}`} className="block h-full w-full">
          <div className="flex h-full w-full items-center justify-center text-[#8e8a82] text-xs">
            {/* Image placeholder structural frame */}
            <span className="font-display italic text-base text-[#c5c1b9]/50">
              The Decant Bar
            </span>
          </div>
        </Link>

        {/* Quick Add / Select Button */}
        <button
          type="button"
          aria-label={`Select ${name}`}
          className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center bg-[#11110f]/90 text-[#f4efe6] border border-white/10 transition-colors hover:bg-[#c6a15b] hover:text-[#11110f]"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Product Meta */}
      <div className="mt-4 flex flex-col gap-1.5">
        {(category || gender) && (
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#8e8a82]">
            {[category, gender].filter(Boolean).join(" · ")}
          </p>
        )}

        <Link
          to={`/product/${id}`}
          className="font-display text-lg text-[#f4efe6] transition-colors hover:text-[#c6a15b]"
        >
          {name}
        </Link>

        <div className="mt-1 flex items-center justify-between text-xs text-[#c5c1b9]">
          <span>{minPrice !== null ? `From $${minPrice}` : "Available in decants"}</span>
          {sizes.length > 0 && (
            <span className="text-[11px] text-[#8e8a82]">
              {sizes.join(" / ")} ml
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
