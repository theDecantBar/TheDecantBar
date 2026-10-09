import { useState } from "react";

function ProductCard({ product }) {
  const firstVariant = product.variants?.[0];
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group flex h-full flex-col bg-[#151512] border border-white/10 hover:border-[#c6a15b]/60 transition-all duration-500">
      {/* Product Image */}
      <div className="aspect-[4/5] bg-[#1c1c18] flex items-center justify-center overflow-hidden">
        {product.image_url && !imageError ? (
          <img
            src={product.image_url}
            alt={product.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
        ) : (
          <div className="text-[#c6a15b]/50 text-sm tracking-[0.2em] uppercase">
            No Image
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[#c6a15b] text-xs uppercase tracking-[0.2em]">
          {product.category || "Fragrance"}
        </p>

        <h2 className="font-display text-2xl text-[#f4efe6] mt-2 leading-tight">
          {product.name}
        </h2>

        {/* Product Details */}
        <div className="flex flex-wrap items-center gap-2 mt-4 text-xs text-[#f4efe6]/60">
          {product.gender && <span>{product.gender}</span>}
          {product.weather && <span>· {product.weather}</span>}
          {product.type && <span>· {product.type}</span>}
        </div>

        {/* Starting Price */}
        {firstVariant && (
          <div className="mt-5">
            <p className="text-xs text-[#f4efe6]/50 uppercase tracking-wider">
              Starting from
            </p>
            <p className="text-xl text-[#f4efe6] mt-1">
              ₹{firstVariant.price}
            </p>
          </div>
        )}

        {/* Available Sizes */}
        {product.variants?.length > 0 && (
          <div className="mt-5 mb-4">
            <p className="text-xs text-[#f4efe6]/50 uppercase tracking-wider mb-3">
              Available sizes
            </p>

            <div className="flex flex-wrap gap-2">
              {product.variants.map((variant) => (
                <span
                  key={variant.id}
                  className="inline-flex items-center justify-center min-w-[48px] border border-white/15 px-3 py-2 text-xs text-[#f4efe6]/80 hover:border-[#c6a15b] hover:text-[#c6a15b] transition"
                >
                  {variant.size_ml}ml
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Button */}
        
        <button className="w-full mt-auto pt-3 pb-3 border border-[#c6a15b] text-[#c6a15b] text-xs uppercase tracking-[0.2em] hover:bg-[#c6a15b] hover:text-[#11110f] transition-all duration-300">
          View Product
        </button>
      </div>
    </div>
  );
}

export default ProductCard;