import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ArrowFillButton from "../ui/arrow-fill-button";
import FragranceOrbitCarousel from "../ui/fragrance-orbit-carousel";

export default function HeroOrbitShowcase() {
  const [isOpen, setIsOpen] = useState(false);

  // Close on Escape key and lock scroll while open
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* ========================================================
          TRIGGER BUTTON (SUBTLE LUXURY PALETTE - NO NEON / NO GRADIENTS)
         ======================================================== */}
      <div className="pt-2 sm:pt-3">
        <ArrowFillButton
          btnText="Discover Popular Scents"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setIsOpen(true);
          }}
          bgColor="#181613"
          textColor="#fffdf7"
          fillBgColor="#c6a15b"
          fillTextColor="#12110f"
          hoverFillBgColor="#c6a15b"
          hoverFillTextColor="#12110f"
          arrowColor="#12110f"
          hoverArrowColor="#12110f"
          className="!h-[52px] sm:!h-[54px] !px-7 sm:!px-8 !pr-16 sm:!pr-18 !text-xs sm:!text-sm !font-bold !tracking-[0.16em] !uppercase !border !border-[#3d382f] hover:!border-[#5e5546] [--icon-circle:36px] sm:[--icon-circle:38px] [--icon-right:7px] sm:[--icon-right:8px] shadow-sm"
        />
      </div>

      {/* ========================================================
          FULL-SCREEN IMMERSIVE ORBIT CAROUSEL (IN MOTION VIA PORTAL)
         ======================================================== */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="fixed inset-0 z-[99999] bg-[#0c0b0a]/95 backdrop-blur-xl flex flex-col justify-between"
              >
                {/* Header bar */}
                <div className="flex items-center justify-between px-6 sm:px-10 py-4 border-b border-[#24211b] bg-[#12110f]/90 z-20 shrink-0">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#c6a15b]" />
                    <div>
                      <div className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#c6a15b]">
                        The Decant Bar • Vault
                      </div>
                      <h3 className="text-sm sm:text-base font-serif text-[#fffdf7]">
                        The 5 Industry Sensations
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="hidden md:inline-block text-[11px] font-mono tracking-widest text-[#7a7469] uppercase">
                      Use Arrow Keys • Click to Orbit
                    </span>

                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="h-9 px-3.5 rounded-full bg-[#1c1a17] border border-[#2d2922] hover:border-[#c6a15b] text-[#ded3bf] hover:text-[#fffdf7] text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
                      title="Return to Hero"
                    >
                      <X size={15} />
                      <span className="hidden sm:inline">Close</span>
                    </button>
                  </div>
                </div>

                {/* Orbit Showcase Canvas Container */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.97, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97, y: 12 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-1 w-full h-full relative overflow-hidden"
                >
                  <FragranceOrbitCarousel className="w-full h-full" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}

