import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";

/**
 * CategoryCard Component
 * Full-image luxury perfume category card with subtle 3D tilt, smooth hover interactions,
 * accessible markup, and tailored tinted gradient overlays.
 */
export default function CategoryCard({ category, index = 0 }) {
  const cardRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  // 3D Tilt interactive values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const onMouseMove = (e) => {
    if (shouldReduceMotion || !cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    // Normalize coordinates relative to card center
    mouseX.set(e.clientX - left - width / 2);
    mouseY.set(e.clientY - top - height / 2);
  };

  const onMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Convert mouse offset to subtle rotational degrees (max ~6deg for luxury restraint)
  const rotateX = useTransform(mouseY, [-250, 250], [6, -6]);
  const rotateY = useTransform(mouseX, [-250, 250], [-6, 6]);

  const springConfig = { stiffness: 280, damping: 24, mass: 0.5 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.65,
        delay: shouldReduceMotion ? 0 : index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="w-full"
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{
          rotateX: shouldReduceMotion ? 0 : springRotateX,
          rotateY: shouldReduceMotion ? 0 : springRotateY,
          transformStyle: "preserve-3d",
        }}
        className="group relative w-full aspect-[4/5] sm:aspect-[3/4] min-h-[480px] sm:min-h-[520px] rounded-2xl overflow-hidden border border-white/10 bg-[#141412] shadow-xl transition-all duration-500 hover:border-[#c6a15b]/50 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.95)]"
      >
        <Link
          to={category.link}
          className="relative block h-full w-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c6a15b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#11110f]"
          aria-label={`Explore ${category.title} collection: ${category.description}`}
        >
          {/* 1. Full Card Background Image with slow luxury zoom */}
          <picture className="absolute inset-0 h-full w-full pointer-events-none">
            <source srcSet={category.image} type="image/webp" />
            <img
              src={category.imageFallback || category.image}
              alt={category.alt}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </picture>

          {/* 2. Neutral Dark Bottom Vignette (Restricted to bottom half, leaves bottles clean and vivid) */}
          <div
            className="absolute inset-x-0 bottom-0 h-[52%] bg-gradient-to-t from-black/95 via-black/55 to-transparent pointer-events-none"
            aria-hidden="true"
          />

          {/* 3. Category-Specific Tinted Gradient Overlay (Restricted to bottom) */}
          <div
            className={`absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t ${category.gradient} pointer-events-none opacity-70 transition-opacity duration-500 group-hover:opacity-85`}
            aria-hidden="true"
          />

          {/* 4. Subtle Border Glow Accent on Hover */}
          <div
            className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none ring-1 ring-inset ring-[#c6a15b]/30"
            aria-hidden="true"
          />

          {/* 5. Short Text Block at Bottom with 3D Depth Lift */}
          <div
            style={{
              transform: shouldReduceMotion ? "none" : "translateZ(26px)",
              transformStyle: "preserve-3d",
            }}
            className="absolute inset-x-0 bottom-0 p-6 sm:p-7 flex flex-col justify-end transition-transform duration-500 ease-out group-hover:-translate-y-1"
          >
            {/* Tag Chip */}
            <div className="mb-3">
              <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.25em] px-3 py-1 rounded-full border border-white/15 bg-black/50 backdrop-blur-md text-[#c6a15b] shadow-sm">
                {category.tag}
              </span>
            </div>

            {/* Title in Serif Font */}
            <h3 className="font-display text-2xl sm:text-3xl lg:text-[2rem] leading-tight text-[#f4efe6] group-hover:text-[#c6a15b] transition-colors duration-300">
              {category.title}
            </h3>

            {/* Short 1-2 line description */}
            <p className="mt-2 text-xs sm:text-sm text-[#c5c1b9] leading-relaxed line-clamp-2 max-w-[95%]">
              {category.description}
            </p>

            {/* Explore Collection + Circular Arrow Button on one row */}
            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f4efe6] group-hover:text-[#c6a15b] transition-colors duration-300">
                Explore Collection
              </span>
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 backdrop-blur-md text-[#f4efe6] group-hover:border-[#c6a15b] group-hover:bg-[#c6a15b] group-hover:text-[#11110f] group-hover:scale-105 transition-all duration-300"
                aria-hidden="true"
              >
                <ArrowRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
