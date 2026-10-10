import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Plus, Minus } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useCart } from "../../context/CartContext";

function ProductCard({ product }) {
  const shouldReduceMotion = useReducedMotion();
  const { cartItems, addToCart, updateQuantity } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState(
    () => product.variants?.[0]?.id ?? null
  );
  const [imageError, setImageError] = useState(false);

  const selectedVariant =
    product.variants?.find((v) => v.id === selectedVariantId) ??
    product.variants?.[0] ??
    null;

  const cartItemId = selectedVariant ? `${product.id}-${selectedVariant.id}` : null;
  const cartItem = cartItems.find((item) => item.cartItemId === cartItemId);
  const itemQuantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!selectedVariant) return;
    addToCart(product, selectedVariant, 1);
  };

  const currentPrice = selectedVariant ? selectedVariant.price : product.variants?.[0]?.price;

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="group flex h-full flex-col bg-[#151512] border border-white/10 hover:border-[#c6a15b]/60 transition-colors duration-500"
    >
      {/* Product Image Link */}
      <Link
        to={`/product/${product.id}`}
        className="aspect-[4/5] bg-[#1c1c18] flex items-center justify-center overflow-hidden relative cursor-pointer"
      >
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
      </Link>

      {/* Product Information */}
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[#c6a15b] text-xs uppercase tracking-[0.2em]">
          {product.category || "Fragrance"}
        </p>

        <Link to={`/product/${product.id}`}>
          <h2 className="font-display text-2xl text-[#f4efe6] mt-2 leading-tight hover:text-[#c6a15b] transition-colors">
            {product.name}
          </h2>
        </Link>

        {/* Product Details */}
        <div className="flex flex-wrap items-center gap-2 mt-4 text-xs text-[#f4efe6]/60">
          {product.gender && <span>{product.gender === "M/W" ? "Unisex" : product.gender === "M" ? "Men" : product.gender === "W" ? "Women" : product.gender}</span>}
          {product.weather && <span>· {product.weather}</span>}
          {product.type && <span>· {product.type}</span>}
        </div>

        {/* Selected Size & Price */}
        {currentPrice !== undefined && (
          <div className="mt-5">
            <p className="text-xs text-[#f4efe6]/50 uppercase tracking-wider">
              {selectedVariant ? `${selectedVariant.size_ml}ml Decant` : "Starting from"}
            </p>
            <p className="text-xl font-medium text-[#f4efe6] mt-1">
              ₹{currentPrice}
            </p>
          </div>
        )}

        {/* Available Sizes Picker */}
        {product.variants?.length > 0 && (
          <div className="mt-5 mb-4">
            <p className="text-xs text-[#f4efe6]/50 uppercase tracking-wider mb-2">
              Select Size
            </p>

            <div className="flex flex-wrap gap-2">
              {product.variants.map((variant) => {
                const isSelected = selectedVariant?.id === variant.id;
                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={`inline-flex items-center justify-center min-w-[46px] px-3 py-1.5 text-xs transition cursor-pointer border ${
                      isSelected
                        ? "border-[#c6a15b] bg-[#c6a15b] text-[#11110f] font-semibold"
                        : "border-white/15 text-[#f4efe6]/80 hover:border-[#c6a15b] hover:text-[#c6a15b]"
                    }`}
                  >
                    {variant.size_ml}ml
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Button: In-Card Quantity Stepper OR Add to Bag */}
        {itemQuantity > 0 ? (
          <div className="w-full mt-auto flex items-center justify-between border border-[#c6a15b] bg-[#1c1c18] text-[#f4efe6]">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => updateQuantity(cartItemId, itemQuantity - 1)}
              className="flex h-11 w-11 items-center justify-center text-[#c5c1b9] hover:bg-[#c6a15b] hover:text-[#11110f] transition-colors cursor-pointer"
            >
              <Minus size={14} />
            </button>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#c6a15b]">
              {itemQuantity} in Bag
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => updateQuantity(cartItemId, itemQuantity + 1)}
              className="flex h-11 w-11 items-center justify-center text-[#c5c1b9] hover:bg-[#c6a15b] hover:text-[#11110f] transition-colors cursor-pointer"
            >
              <Plus size={14} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full mt-auto py-3 px-4 flex items-center justify-center gap-2 border border-[#c6a15b] text-[#c6a15b] hover:bg-[#c6a15b] hover:text-[#11110f] text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 cursor-pointer"
          >
            <ShoppingBag size={14} strokeWidth={1.5} />
            Add to Bag
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default ProductCard;