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

  const handleIncreaseQuantity = (event) => {
    event?.preventDefault();
    if (!selectedVariant || isSoldOut) return;
    addToCart(product, selectedVariant, 1);
  };

  const handleDecreaseQuantity = (event) => {
    event?.preventDefault();
    if (!cartItemId || itemQuantity <= 0) return;
    updateQuantity(cartItemId, itemQuantity - 1);
  };

  const currentPrice = selectedVariant
    ? selectedVariant.price
    : product.variants?.[0]?.price ?? product.price ?? 0;

  const categoryLabel = (
    product.category ||
    product.brand ||
    "Fragrance"
  ).toUpperCase();

  const genderLabel =
    product.gender === "M/W"
      ? "Unisex"
      : product.gender === "M"
      ? "Men"
      : product.gender === "W"
      ? "Women"
      : product.gender || "Unisex";

  const weatherLabel = product.weather || "All Season";
  const typeLabel = product.type || "EDP";

  const sizeHeading = selectedVariant
    ? `${selectedVariant.size_ml}ML DECANT`
    : "DECANT";

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
        className="group flex h-full flex-col rounded-[26px] border border-white/[0.08] bg-[#121210] p-3.5 sm:p-4 transition-all duration-300 hover:border-[#c6a15b]/40 hover:shadow-xl hover:shadow-black/60"
      >
        {/* Product Image Container */}
        <Link
          to={`/product/${product.id}`}
          onClick={handleProductClick}
          className="block cursor-pointer overflow-hidden rounded-[18px]"
        >
          <ProductImage
            src={product.image_url}
            alt={product.name}
            aspectRatio="aspect-square"
            paddingClassName="p-2 sm:p-2.5"
            containerClassName="rounded-[18px] bg-[#181816] border border-white/[0.04]"
            imageClassName="rounded-[14px]"
            loading="lazy"
          >
            {(isSoldOut || allSoldOut) && (
              <div className="absolute right-2.5 top-2.5 z-10 rounded-full border border-red-800/60 bg-red-950/90 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-red-300 backdrop-blur-sm">
                Sold Out
              </div>
            )}
          </ProductImage>
        </Link>

        {/* Product Information */}
        <div className="flex flex-1 flex-col pt-3.5">
          {/* Brand / Category */}
          <p className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase text-[#c6a15b]">
            {categoryLabel}
          </p>

          {/* Product Name in Elegant Serif Typography */}
          <Link
            to={`/product/${product.id}`}
            onClick={handleProductClick}
            className="mt-1"
          >
            <h2 className="font-display text-[18px] sm:text-[20px] font-normal leading-[1.25] text-[#f4efe6] line-clamp-2 min-h-[46px] sm:min-h-[50px] transition-colors group-hover:text-[#c6a15b]">
              {product.name}
            </h2>
          </Link>

          {/* Metadata Row: Gender · Season/Weather · Type */}
          <div className="mt-1 flex items-center gap-1.5 text-xs text-neutral-400">
            <span>{genderLabel}</span>
            <span className="text-neutral-600">·</span>
            <span>{weatherLabel}</span>
            <span className="text-neutral-600">·</span>
            <span>{typeLabel}</span>
          </div>

          {/* Subtle Divider Matching Reference */}
          <div className="my-3 w-full border-t border-white/[0.07]" />

          {/* Selected Size Label & Price */}
          <div className="mb-3">
            <p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-400">
              {sizeHeading}
            </p>
            <p className="mt-0.5 text-xl sm:text-2xl font-bold tracking-tight text-[#f4efe6]">
              ₹{currentPrice}
            </p>
          </div>

          {/* Size Selectors & Add Button Row */}
          <div className="mt-auto flex items-center justify-between gap-2">
            {/* Size Selector Pills */}
            <div
              className="flex flex-wrap items-center gap-1.5"
              role="group"
              aria-label="Select decant size"
            >
              {product.variants?.map((variant) => {
                const isSelected = selectedVariant?.id === variant.id;
                const variantSoldOut = Number(variant.stock ?? 10) <= 0;

                return (
                  <button
                    key={variant.id}
                    type="button"
                    disabled={variantSoldOut}
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={`flex h-8 min-w-[38px] cursor-pointer items-center justify-center rounded-full px-2.5 text-xs transition ${
                      isSelected
                        ? "bg-[#d8b570] font-semibold text-[#14120c] shadow-sm"
                        : variantSoldOut
                        ? "cursor-not-allowed border border-white/5 bg-white/[0.02] text-neutral-600 line-through"
                        : "border border-white/10 bg-[#181816] font-normal text-neutral-300 hover:border-white/25 hover:text-white"
                    }`}
                  >
                    {variant.size_ml}ml
                  </button>
                );
              })}
            </div>

            {/* Circular Gold Add to Bag or Quantity Control */}
            <div className="shrink-0">
              {isSoldOut ? (
                <Link
                  to={`/product/${product.id}`}
                  onClick={handleProductClick}
                  aria-label="Sold out. View product"
                  title="Sold out — view product"
                  className="flex h-10 w-10 sm:h-11 sm:w-11 cursor-pointer items-center justify-center rounded-full border border-red-500/40 bg-red-950/30 text-red-300 transition hover:border-[#c6a15b] hover:bg-[#c6a15b] hover:text-[#11110f]"
                >
                  <Bell size={17} strokeWidth={1.5} />
                </Link>
              ) : itemQuantity > 0 ? (
                <div className="flex h-10 sm:h-11 items-center gap-1 rounded-full border border-[#d8b570] bg-[#1a1916] px-1">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={handleDecreaseQuantity}
                    className="flex h-7 w-7 sm:h-8 sm:w-8 cursor-pointer items-center justify-center rounded-full text-[#d8b570] transition hover:bg-[#d8b570] hover:text-[#14120c]"
                  >
                    <Minus size={13} strokeWidth={2.2} />
                  </button>
                  <span className="min-w-5 text-center text-xs font-semibold text-[#f4efe6]">
                    {itemQuantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={handleIncreaseQuantity}
                    className="flex h-7 w-7 sm:h-8 sm:w-8 cursor-pointer items-center justify-center rounded-full bg-[#d8b570] text-[#14120c] transition hover:bg-[#e4c480]"
                  >
                    <Plus size={13} strokeWidth={2.2} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  aria-label={`Add ${product.name} to bag`}
                  title="Add to bag"
                  onClick={handleAddToCart}
                  disabled={!selectedVariant}
                  className="flex h-10 w-10 sm:h-11 sm:w-11 cursor-pointer items-center justify-center rounded-full bg-[#d8b570] text-[#14120c] transition-all duration-200 hover:scale-105 hover:bg-[#e4c480] shadow-md shadow-[#d8b570]/15 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus size={19} strokeWidth={2.2} />
                </button>
              )}
            </div>
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
