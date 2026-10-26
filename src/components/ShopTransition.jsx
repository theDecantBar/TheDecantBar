
import { useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";

export default function ShopTransition({ onFinish }) {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(onFinish, 1000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-[#0b0b09] px-6 text-center text-[#f4efe6]"
    >
      <div className="pointer-events-none absolute h-64 w-64 rounded-full bg-[#c6a15b]/10 blur-[90px]" />

      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.45 }}
        className="relative z-10 flex flex-col items-center"
      >
        <p className="mb-7 text-[9px] uppercase tracking-[0.38em] text-[#c6a15b]">
          ✦ Haute Parfumerie ✦
        </p>

        {/* Miniature perfume bottle */}
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [0, -5, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          className="mb-8 flex flex-col items-center"
        >
          <div className="h-7 w-5 rounded-t-sm border border-[#c6a15b]/80 bg-gradient-to-r from-[#765729] via-[#e0c58b] to-[#765729]" />

          <div className="rounded-2xl h-3 w-9 border border-[#c6a15b]/70 bg-[#c6a15b]/20" />

          <div className="relative flex h-24 w-[68px] items-center justify-center overflow-hidden rounded-b-lg rounded-t-sm border border-[#c6a15b]/80 bg-gradient-to-r from-[#3b2c19] via-[#b79551]/30 to-[#3b2c19] shadow-[0_0_35px_rgba(198,161,91,0.15)]">
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-[#c6a15b]/15" />
            <div className="absolute bottom-2 left-2 top-2 w-1 rounded-full bg-white/20 blur-[1px]" />

            <div className="relative border-y border-[#c6a15b]/60 bg-[#0b0b09]/85 px-1 py-2">
              <span className="block text-[6px] tracking-[0.2em] text-[#c6a15b]">
                THE
              </span>
              <span className="mt-1 block text-[7px] tracking-wider">
                DECANT BAR
              </span>
            </div>
          </div>
        </motion.div>

        <motion.h2
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, letterSpacing: "0.18em" }}
          animate={{ opacity: 1, letterSpacing: "0.28em" }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.55 }}
          className="font-display text-xl uppercase sm:text-2xl"
        >
          The Decant Bar
        </motion.h2>

        <p className="mt-4 text-[9px] uppercase tracking-[0.25em] text-[#c6a15b]/80">
          Discover your next signature scent
        </p>

        <div className="mt-8 h-px w-40 overflow-hidden bg-white/10">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: shouldReduceMotion ? 0 : 1.05, ease: "linear" }}
            className="h-full origin-left bg-gradient-to-r from-[#9e7834] via-[#f4efe6] to-[#c6a15b]"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
