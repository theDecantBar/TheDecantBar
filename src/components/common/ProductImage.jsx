import { useState } from "react";
import { Droplets } from "lucide-react";

/**
 * Standardized ProductImage Component for The Decant Bar
 * 
 * Guarantees visual consistency across the entire website:
 * 1. Consistent luxury 4:5 aspect ratio (customizable for square thumbnails).
 * 2. Visual center alignment (both horizontally and vertically).
 * 3. Strict object-contain so bottles/boxes are never cropped or stretched.
 * 4. Preserves dark luxury theme and gold accents.
 * 5. Elegant fallback placeholder if image fails to load or is missing.
 */
export default function ProductImage({
  src,
  alt = "Perfume Decant",
  aspectRatio = "aspect-[4/5]",
  containerClassName = "",
  imageClassName = "",
  paddingClassName = "p-3 sm:p-4",
  hoverZoom = true,
  loading = "lazy",
  onError,
  children,
}) {
  const [hasError, setHasError] = useState(false);

  const handleError = (e) => {
    setHasError(true);
    if (onError) onError(e);
  };

  const showImage = Boolean(src) && !hasError;

  return (
    <div
      className={`relative w-full ${aspectRatio} ${paddingClassName} bg-[#171715] flex items-center justify-center overflow-hidden select-none ${containerClassName}`}
    >
      {/* Optional Badge / Children slot (e.g. Sold Out badge) */}
      {children}

      {showImage ? (
        <img
          src={src}
          alt={alt}
          loading={loading}
          onError={handleError}
          className={`w-full h-full object-contain object-center ${
            hoverZoom ? "transition-transform duration-700 ease-out group-hover:scale-105" : ""
          } ${imageClassName}`}
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-center text-[#c6a15b]/40 p-4">
          <Droplets size={36} strokeWidth={1.2} className="mb-2" />
          <span className="text-[10px] tracking-[0.2em] uppercase font-medium">
            The Decant Bar
          </span>
        </div>
      )}
    </div>
  );
}

