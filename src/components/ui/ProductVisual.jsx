import { useState } from "react";

export default function ProductVisual({
  product = {},
  src,
  alt,
  aspectRatio = "aspect-square",
  className = "",
}) {
  const [imageError, setImageError] = useState(false);

  // Image source detection priority:
  // 1. Explicit `src` prop
  // 2. `product.image_url`
  // 3. `product.image`
  const imageSource = src || product.image_url || product.image;
  const hasValidImage = Boolean(imageSource && typeof imageSource === "string" && imageSource.trim() !== "");
  const showImage = hasValidImage && !imageError;

  const productName = product.name || "";
  const productType = product.type ? String(product.type).toUpperCase() : "";
  const productCategory = product.category ? String(product.category).toUpperCase() : "";
  const productGender = product.gender
    ? product.gender === "M/W"
      ? "UNISEX"
      : product.gender === "M"
      ? "MEN"
      : product.gender === "W"
      ? "WOMEN"
      : String(product.gender).toUpperCase()
    : "";
  const productWeather = product.weather ? String(product.weather).toUpperCase() : "";

  // Top label: Type or Category
  const topLabel = productType || productCategory;

  // Bottom label: Gender / Weather or Brand identity
  const bottomDetails = [productGender, productWeather].filter(Boolean).join(" · ");
  const bottomLabel = bottomDetails || "THE DECANT BAR";

  return (
    <div
      className={`relative ${aspectRatio} w-full overflow-hidden bg-[#171715] select-none ${className}`}
    >
      {showImage ? (
        <img
          src={imageSource}
          alt={alt || productName || "Fragrance"}
          onError={() => setImageError(true)}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        /* Luxury Typographic Fallback */
        <div className="relative flex h-full w-full flex-col justify-between p-5 sm:p-6 text-center transition-colors duration-300">
          {/* Subtle concentric hairline frame */}
          <div className="pointer-events-none absolute inset-2.5 sm:inset-3 border border-white/5 transition-colors group-hover:border-white/10" />

          {/* Top Label */}
          <div className="relative z-10 min-h-[14px]">
            {topLabel && (
              <span className="text-[9px] sm:text-[10px] font-medium uppercase tracking-[0.25em] text-[#c6a15b]">
                {topLabel}
              </span>
            )}
          </div>

          {/* Product Name Centerpiece */}
          <div className="relative z-10 my-auto px-2">
            <h3 className="font-display text-lg sm:text-xl md:text-2xl leading-snug tracking-normal text-[#f4efe6] transition-colors group-hover:text-[#d8c08a]">
              {productName || "Fragrance"}
            </h3>
          </div>

          {/* Bottom Label */}
          <div className="relative z-10 min-h-[14px]">
            <span className="text-[9px] sm:text-[10px] font-medium uppercase tracking-[0.2em] text-[#8e8a82]">
              {bottomLabel}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
