
import { useState } from "react";
import { Droplets } from "lucide-react";

/**
 * Standardized ProductImage Component for The Decant Bar
 *
 * Features:
 * 1. Consistent luxury 4:5 aspect ratio.
 * 2. Horizontal and vertical center alignment.
 * 3. Object-contain to prevent bottles from being cropped.
 * 4. Rounded corners for a refined appearance.
 * 5. Dark luxury theme with gold accents.
 * 6. Fallback placeholder if an image fails to load.
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

    if (onError) {
      onError(e);
    }
  };

  const showImage = Boolean(src) && !hasError;

  return (
    <div
     className={`relative w-full ${aspectRatio} ${paddingClassName} bg-[#171715] flex items-center justify-center overflow-hidden rounded-lg select-none ${containerClassName}`}
    >
      {/* Optional Badge / Children slot */}
      {children}

      {showImage ? (
        <img
          src={src}
          alt={alt}
          loading={loading}
          onError={handleError}
          className={`w-full h-full object-contain object-center rounded-xl ${
            hoverZoom
              ? "transition-transform duration-700 ease-out group-hover:scale-105"
              : ""
          } ${imageClassName}`}
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-center text-[#c6a15b]/40 p-4">
          <Droplets
            size={36}
            strokeWidth={1.2}
            className="mb-2"
          />

          <span className="text-[10px] tracking-[0.2em] uppercase font-medium">
            The Decant Bar
          </span>
        </div>
      )}
    </div>
  );
}