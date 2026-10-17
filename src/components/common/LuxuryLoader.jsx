import { motion, AnimatePresence, useReducedMotion } from "motion/react";

/**
 * LuxuryLoader - "The Golden Signature"
 * 
 * Cinematic, minimal loading experience for The Decant Bar.
 * - Deep black obsidian background (#11110f)
 * - Refined serif typography with delicate letter spacing
 * - Self-drawing golden fragrance line with luminous glow
 * - Ultra-thin gold circular indicator
 * - Soft ambient lighting & gentle aura
 * - Fluid AnimatePresence exit transition
 * - Fully accessible with prefers-reduced-motion support
 */
export default function LuxuryLoader({
  show = true,
  message = "Curating your fragrance experience",
  fullScreen = true,
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="luxury-loader"
          initial={{ opacity: 1 }}
          exit={
            shouldReduceMotion
              ? { opacity: 0 }
              : {
                  opacity: 0,
                  transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
                }
          }
          className={`${
            fullScreen
              ? "fixed inset-0 z-[9999]"
              : "relative min-h-[500px] w-full"
          } flex flex-col items-center justify-center overflow-hidden bg-[#11110f] select-none`}
          role="status"
          aria-live="polite"
          aria-label={message}
        >
          {/* ─── Ambient Golden Radial Halo ─── */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-[90px]"
            style={{
              background:
                "radial-gradient(circle, rgba(198,161,91,0.2) 0%, rgba(216,192,138,0.06) 45%, transparent 70%)",
            }}
          />

          {/* ─── Subtle Vignette ─── */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.6)_100%)]" />

          {/* ─── Center Branding Stage ─── */}
          <div className="relative z-10 flex flex-col items-center px-6 text-center">
            
            {/* Top Monogram / Haute Parfumerie Eyebrow */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="mb-3 flex items-center gap-2.5 text-[#c6a15b]"
            >
              <span className="text-[9px] tracking-[0.3em] uppercase text-[#c6a15b]/75">
                ✦ Haute Parfumerie ✦
              </span>
            </motion.div>

            {/* Brand Title: THE DECANT BAR */}
            <motion.h1
              initial={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 0, letterSpacing: "0.25em" }
              }
              animate={{
                opacity: 1,
                letterSpacing: "0.38em",
              }}
              transition={{
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="font-display text-2xl font-normal uppercase text-[#f4efe6] sm:text-3xl md:text-4xl [font-variant-numeric:lining-nums]"
            >
              The Decant Bar
            </motion.h1>

            {/* Self-Drawing Golden Line with Subtle Fragrance Curve */}
            <div className="relative mt-4 h-[12px] w-56 overflow-visible sm:w-72">
              <svg
                viewBox="0 0 280 12"
                className="h-full w-full overflow-visible"
                fill="none"
              >
                <defs>
                  <linearGradient
                    id="goldSignatureGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#9e7834" stopOpacity="0" />
                    <stop offset="20%" stopColor="#c6a15b" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#f4efe6" stopOpacity="1" />
                    <stop offset="80%" stopColor="#d8c08a" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#9e7834" stopOpacity="0" />
                  </linearGradient>

                  <filter id="goldLineGlow" x="-20%" y="-100%" width="140%" height="300%">
                    <feGaussianBlur stdDeviation="2.5" result="glow" />
                    <feMerge>
                      <feMergeNode in="glow" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Subtle Fragrance S-curve resolving into horizontal hairline */}
                <motion.path
                  d="M 10 6 C 80 4, 200 8, 270 6"
                  stroke="url(#goldSignatureGrad)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  filter="url(#goldLineGlow)"
                  initial={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 1.1,
                    delay: shouldReduceMotion ? 0 : 0.25,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              </svg>
            </div>

            {/* Circular Gold Loading Indicator & Supporting Subtext */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: shouldReduceMotion ? 0 : 0.45,
                ease: "easeOut",
              }}
              className="mt-8 flex flex-col items-center gap-3.5"
            >
              {/* Circular Gold Indicator with Smooth Rotation */}
              <div className="relative flex h-7 w-7 items-center justify-center">
                <svg
                  className={`h-7 w-7 ${shouldReduceMotion ? "" : "animate-spin"}`}
                  viewBox="0 0 32 32"
                  style={{ animationDuration: "1.4s" }}
                >
                  {/* Subtle track circle */}
                  <circle
                    cx="16"
                    cy="16"
                    r="13"
                    fill="none"
                    stroke="rgba(198, 161, 91, 0.15)"
                    strokeWidth="1.2"
                  />
                  {/* Active champagne gold arc */}
                  <circle
                    cx="16"
                    cy="16"
                    r="13"
                    fill="none"
                    stroke="#c6a15b"
                    strokeWidth="1.4"
                    strokeDasharray="42 50"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Micro Golden Core Accent */}
                <div className="h-1 w-1 rounded-full bg-[#f4efe6] opacity-75 shadow-[0_0_6px_#c6a15b]" />
              </div>

              {/* Supporting Curating Message */}
              {message && (
                <p className="text-[10px] font-medium tracking-[0.24em] uppercase text-[#8e8a82] sm:text-[11px]">
                  {message}
                </p>
              )}
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

