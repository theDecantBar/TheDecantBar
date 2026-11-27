import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Sparkles, Truck, ShieldCheck, Tag, Gift } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useOffers } from "../context/OffersContext";

const ICON_MAP = {
  truck: Truck,
  sparkles: Sparkles,
  shield: ShieldCheck,
  tag: Tag,
  gift: Gift,
};

const SLIDE_INTERVAL_MS = 2400;

export default function AnnouncementBar() {
  const shouldReduceMotion = useReducedMotion();
  const { offers } = useOffers();

  const activeBanners = (offers?.banners || []).filter((b) => b.active !== false);

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  const total = activeBanners.length;
  const safeIndex = total > 0 ? index % total : 0;

  const stepOffer = useCallback(
    (delta) => {
      if (total <= 1) return;
      setDirection(delta >= 0 ? 1 : -1);
      setIndex((prev) => (prev + delta + total) % total);
    },
    [total]
  );

  useEffect(() => {
    if (isHovered || total <= 1) return;
    const timer = window.setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % total);
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [isHovered, total]);

  if (total === 0) return null;

  const current = activeBanners[safeIndex];
  const Icon = ICON_MAP[current.icon] || Sparkles;

  return (
    <div
      className="relative w-full border-b border-[#c6a15b]/45 bg-gradient-to-r from-[#17130d] via-[#241d12] to-[#17130d] text-[#f4efe6] shadow-[0_4px_24px_rgba(198,161,91,0.12)] select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="region"
      aria-label="Store offers"
    >
      <div className="mx-auto flex min-h-[56px] sm:min-h-[64px] max-w-[1440px] items-center justify-between gap-3 px-4 py-3 sm:px-8 lg:px-10 xl:px-16 sm:py-3.5">
        <button
          type="button"
          onClick={() => stepOffer(-1)}
          aria-label="Previous offer"
          disabled={total <= 1}
          className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full border border-[#c6a15b]/35 bg-[#14120e]/80 text-[#d8c08a] transition hover:border-[#c6a15b] hover:bg-[#c6a15b]/20 hover:text-[#fffdf7] cursor-pointer disabled:opacity-30 disabled:cursor-default"
        >
          <ChevronLeft size={16} strokeWidth={2} />
        </button>

        <div className="relative flex-1 overflow-hidden flex items-center justify-center">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={`${current.id}-${safeIndex}`}
              custom={direction}
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: direction > 0 ? 44 : -44 }
              }
              animate={{ opacity: 1, x: 0 }}
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: direction > 0 ? -44 : 44 }
              }
              transition={{ duration: shouldReduceMotion ? 0.12 : 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="w-full flex justify-center px-1"
            >
              <Link
                to={current.link || "/products"}
                className="group inline-flex flex-wrap items-center justify-center gap-2.5 text-center"
              >
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#c6a15b] px-3 py-1 text-[10.5px] sm:text-xs font-bold uppercase tracking-[0.14em] text-[#11110f] shadow-[0_0_12px_rgba(198,161,91,0.35)] transition-colors group-hover:bg-[#d8c08a]">
                  <Icon size={13} strokeWidth={2.2} className="shrink-0" />
                  <span>{current.badge}</span>
                </span>
                <span className="text-xs sm:text-sm font-medium uppercase tracking-[0.14em] sm:tracking-[0.2em] text-[#fffdf7] group-hover:text-[#f5dfb0] transition-colors">
                  {current.text}
                </span>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          type="button"
          onClick={() => stepOffer(1)}
          aria-label="Next offer"
          disabled={total <= 1}
          className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full border border-[#c6a15b]/35 bg-[#14120e]/80 text-[#d8c08a] transition hover:border-[#c6a15b] hover:bg-[#c6a15b]/20 hover:text-[#fffdf7] cursor-pointer disabled:opacity-30 disabled:cursor-default"
        >
          <ChevronRight size={16} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
