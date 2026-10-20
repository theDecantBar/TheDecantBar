
import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Plus, Minus, Bell } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useCart } from "../../context/CartContext";
import ProductImage from "../common/ProductImage";
import ShopTransition from "../ShopTransition";

function ProductCard({ product }) {
  const shouldReduceMotion = useReducedMotion();
  const navigate = useNavigate();

  const { cartItems, addToCart, updateQuantity } = useCart();

  const [selectedVariantId, setSelectedVariantId] = useState(
    () => product.variants?.[0]?.id ?? null
  );

  const [showProductTransition, setShowProductTransition] = useState(false);

  const selectedVariant =
    product.variants?.find((v) => v.id === selectedVariantId) ??
    product.variants?.[0] ??
    null;

  const isSoldOut = selectedVariant
    ? Number(selectedVariant.stock ?? 10) <= 0
    : false;

  const allSoldOut =
    product.variants?.length > 0 &&
    product.variants.every((v) => Number(v.stock ?? 10) <= 0);

  const cartItemId = selectedVariant
    ? `${product.id}-${selectedVariant.id}`
    : null;

  const cartItem = cartItems.find(
    (item) => item.cartItemId === cartItemId
  );

  const itemQuantity = cartItem ? cartItem.quantity : 0;

  const handleProductClick = useCallback((event) => {
    event.preventDefault();
    setShowProductTransition(true);
  }, []);

  const finishProductTransition = useCallback(() => {
    setShowProductTransition(false);
    navigate(`/product/${product.id}`);
  }, [navigate, product.id]);

  const handleAddToCart = (e) => {
    e.preventDefault();

    if (!selectedVariant || isSoldOut) return;

    addToCart(product, selectedVariant, 1);
  };

  const currentPrice = selectedVariant
    ? selectedVariant.price
    : product.variants?.[0]?.price;

  return (
    <>
      <motion.div
        initial={
          shouldReduceMotion
            ? { opacity: 1 }
            : { opacity: 0, y: 16 }
        }
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-30px" }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="group flex h-full flex-col border border-white/10 bg-[#151512] transition-colors duration-500 hover:border-[#c6a15b]/60"
      >
        {/* Product Image Link */}
        <Link
          to={`/product/${product.id}`}
          onClick={handleProductClick}
          className="block cursor-pointer overflow-hidden"
        >
          <ProductImage
            src={product.image_url}
            alt={product.name}
            aspectRatio="aspect-[4/5]"
            paddingClassName="p-4"
            containerClassName="bg-[#1c1c18]"
            loading="lazy"
          >
            {(isSoldOut || allSoldOut) && (
              <div className="absolute right-3 top-3 z-10 border border-red-800/60 bg-red-950/90 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-red-300 backdrop-blur-sm">
                Sold Out
              </div>
            )}
          </ProductImage>
        </Link>

        {/* Product Information */}
        <div className="flex flex-1 flex-col p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[#c6a15b]">
            {product.category || "Fragrance"}
          </p>

          {/* Product Name Link */}
          <Link
            to={`/product/${product.id}`}
            onClick={handleProductClick}
          >
            <h2 className="mt-2 font-display text-2xl leading-tight text-[#f4efe6] transition-colors hover:text-[#c6a15b]">
              {product.name}
            </h2>
          </Link>

          {/* Product Details */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[#f4efe6]/60">
            {product.gender && (
              <span>
                {product.gender === "M/W"
                  ? "Unisex"
                  : product.gender === "M"
                  ? "Men"
                  : product.gender === "W"
                  ? "Women"
                  : product.gender}
              </span>
            )}

            {product.weather && <span>· {product.weather}</span>}
            {product.type && <span>· {product.type}</span>}
          </div>

          {/* Selected Size & Price */}
          {currentPrice !== undefined && (
            <div className="mt-5">
              <p className="text-xs uppercase tracking-wider text-[#f4efe6]/50">
                {selectedVariant
                  ? `${selectedVariant.size_ml}ml Decant`
                  : "Starting from"}
              </p>

              <p className="mt-1 text-xl font-medium text-[#f4efe6]">
                ₹{currentPrice}
              </p>
            </div>
          )}

          {/* Available Sizes Picker */}
          {product.variants?.length > 0 && (
            <div className="mb-4 mt-5">
              <p className="mb-2 text-xs uppercase tracking-wider text-[#f4efe6]/50">
                Select Size
              </p>

              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => {
                  const isSelected =
                    selectedVariant?.id === variant.id;

                  const variantSoldOut =
                    Number(variant.stock ?? 10) <= 0;

                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() =>
                        setSelectedVariantId(variant.id)
                      }
                      className={`inline-flex min-w-[46px] cursor-pointer items-center justify-center border px-3 py-1.5 text-xs transition ${
                        isSelected
                          ? variantSoldOut
                            ? "border-red-500/70 bg-red-950/40 font-semibold text-red-300"
                            : "border-[#c6a15b] bg-[#c6a15b] font-semibold text-[#11110f]"
                          : variantSoldOut
                          ? "border-white/10 text-[#f4efe6]/40 line-through hover:border-red-500/40"
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

          {/* Action Button */}
          {isSoldOut ? (
            <Link
              to={`/product/${product.id}`}
              onClick={handleProductClick}
              className="mt-auto flex w-full cursor-pointer items-center justify-center gap-2 border border-red-500/40 bg-red-950/20 px-4 py-3 text-xs font-medium uppercase tracking-[0.2em] text-red-300 transition-all duration-300 hover:border-[#c6a15b] hover:bg-[#c6a15b] hover:text-[#11110f]"
            >
              <Bell size={14} strokeWidth={1.5} />
              Sold Out · Notify Me
            </Link>
          ) : itemQuantity > 0 ? (
            <div className="mt-auto flex w-full items-center justify-between border border-[#c6a15b] bg-[#1c1c18] text-[#f4efe6]">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() =>
                  updateQuantity(cartItemId, itemQuantity - 1)
                }
                className="flex h-11 w-11 cursor-pointer items-center justify-center text-[#c5c1b9] transition-colors hover:bg-[#c6a15b] hover:text-[#11110f]"
              >
                <Minus size={14} />
              </button>

              <span className="text-xs font-semibold uppercase tracking-wider text-[#c6a15b]">
                {itemQuantity} in Bag
              </span>

              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() =>
                  updateQuantity(cartItemId, itemQuantity + 1)
                }
                className="flex h-11 w-11 cursor-pointer items-center justify-center text-[#c5c1b9] transition-colors hover:bg-[#c6a15b] hover:text-[#11110f]"
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              className="mt-auto flex w-full cursor-pointer items-center justify-center gap-2 border border-[#c6a15b] px-4 py-3 text-xs font-medium uppercase tracking-[0.2em] text-[#c6a15b] transition-all duration-300 hover:bg-[#c6a15b] hover:text-[#11110f]"
            >
              <ShoppingBag size={14} strokeWidth={1.5} />
              Add to Bag
            </button>
          )}
        </div>
      </motion.div>

      {/* Black-and-Gold Product Transition */}
      <AnimatePresence>
        {showProductTransition && (
          <ShopTransition
            onFinish={finishProductTransition}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default ProductCard;
