import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Minus, Bell } from "lucide-react";
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

  const handleAddToCart = (event) => {
    event.preventDefault();

    if (!selectedVariant || isSoldOut) return;

    addToCart(product, selectedVariant, 1);
  };

  const handleIncreaseQuantity = () => {
    if (!selectedVariant || isSoldOut) return;

    addToCart(product, selectedVariant, 1);
  };

  const handleDecreaseQuantity = () => {
    if (!cartItemId || itemQuantity <= 0) return;

    updateQuantity(cartItemId, itemQuantity - 1);
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
        className="group flex h-full flex-col overflow-hidden rounded-[40px] border border-white/10 bg-[#151512] transition-colors duration-500 hover:border-[#c6a15b]/60"
      >
        {/* Product Image */}
        <Link
          to={`/product/${product.id}`}
          onClick={handleProductClick}
          className="block cursor-pointer overflow-hidden rounded-t-[40px]"
        >
          <ProductImage
            src={product.image_url}
            alt={product.name}
            aspectRatio="aspect-[5/4]"
            paddingClassName="p-3"
            containerClassName="rounded-t-[40px] bg-[#1c1c18]"
            imageClassName="rounded-[32px]"
            loading="lazy"
          >
            {(isSoldOut || allSoldOut) && (
              <div className="absolute right-4 top-4 z-10 rounded-full border border-red-800/60 bg-red-950/90 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-red-300 backdrop-blur-sm">
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

          {/* Product Name */}
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

          {/* Available Sizes */}
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
                      disabled={variantSoldOut}
                      onClick={() =>
                        setSelectedVariantId(variant.id)
                      }
                      className={`inline-flex min-w-[46px] cursor-pointer items-center justify-center rounded-full border px-3 py-1.5 text-xs transition ${
                        isSelected
                          ? variantSoldOut
                            ? "border-red-500/70 bg-red-950/40 font-semibold text-red-300"
                            : "border-[#c6a15b] bg-[#c6a15b] font-semibold text-[#11110f]"
                          : variantSoldOut
                          ? "cursor-not-allowed border-white/10 text-[#f4efe6]/40 line-through"
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

          {/* Compact Add / Quantity Control */}
          <div className="mt-auto flex min-h-12 items-center justify-end">
            {isSoldOut ? (
              <Link
                to={`/product/${product.id}`}
                onClick={handleProductClick}
                aria-label="Sold out. View product"
                title="Sold out — view product"
                className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-red-500/40 bg-red-950/20 text-red-300 transition-all duration-300 hover:border-[#c6a15b] hover:bg-[#c6a15b] hover:text-[#11110f]"
              >
                <Bell size={18} strokeWidth={1.5} />
              </Link>
            ) : itemQuantity > 0 ? (
              <div className="flex items-center gap-1 rounded-full border border-[#c6a15b] bg-[#1c1c18] p-1">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={handleDecreaseQuantity}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[#c6a15b] transition-colors hover:bg-[#c6a15b] hover:text-[#11110f]"
                >
                  <Minus size={16} strokeWidth={1.8} />
                </button>

                <span className="min-w-6 text-center text-sm font-semibold text-[#f4efe6]">
                  {itemQuantity}
                </span>

                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={handleIncreaseQuantity}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#c6a15b] text-[#11110f] transition-colors hover:bg-[#dfbd78]"
                >
                  <Plus size={16} strokeWidth={1.8} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                aria-label={`Add ${product.name} to bag`}
                title="Add to bag"
                onClick={handleAddToCart}
                disabled={!selectedVariant}
                className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-[#c6a15b] bg-[#c6a15b] text-[#11110f] transition-all duration-300 hover:scale-105 hover:bg-[#dfbd78] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus size={22} strokeWidth={1.8} />
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Black-and-Gold Product Transition */}
      <AnimatePresence>
        {showProductTransition && (
          <ShopTransition onFinish={finishProductTransition} />
        )}
      </AnimatePresence>
    </>
  );
}

export default ProductCard;
