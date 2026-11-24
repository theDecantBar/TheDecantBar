import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import ArrowFillButton from "../ui/arrow-fill-button";
import { 
  ArrowUpRight, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  ShoppingBag, 
  Check, 
  ShieldCheck 
} from "lucide-react";
import { useCart } from "../../context/CartContext";

export const VIRAL_SPOTLIGHT_FRAGRANCES = [
  {
    id: "oud-maracuja",
    name: "Oud Maracujá",
    brand: "Maison Crivelli",
    category: "Extrait de Parfum",
    tagline: "The #1 Hyped Tropical Oud in the World",
    searchQuery: "Oud Maracuja",
    image: "/images/showcase/oud_maracuja.jpg",
    fullRetail: "₹28,500",
    topNotes: ["Exotic Passionfruit", "Fruity Accord"],
    heartNotes: ["Cambodian Oud", "Black Leather"],
    baseNotes: ["Bourbon Vanilla", "Somalian Incense"],
    longevity: "14+ Hours (Extrait)",
    sillage: "Room-Filling Projection",
    vibe: "Luminous passionfruit contrasting against shadowy, smoky oud wood.",
    pricing: {
      "2ml": { price: 299, sprays: "~35 Sprays" },
      "5ml": { price: 599, sprays: "~80 Sprays" },
      "10ml": { price: 1099, sprays: "~160 Sprays" }
    }
  },
  {
    id: "le-male-le-parfum",
    name: "Le Male Le Parfum",
    brand: "Jean Paul Gaultier",
    category: "Eau de Parfum Intense",
    tagline: "The Undisputed King of Date-Night Seduction",
    searchQuery: "Le Male Le Parfum",
    image: "/images/showcase/le_male_le_parfum.jpg",
    fullRetail: "₹11,500",
    topNotes: ["Green Cardamom", "Aromatic Spices"],
    heartNotes: ["Florentine Iris", "French Lavender"],
    baseNotes: ["Bourbon Vanilla", "Oriental Amber"],
    longevity: "10+ Hours",
    sillage: "Enchanting Seductive Aura",
    vibe: "Commanding officer in black and gold with irresistible vanilla warmth.",
    pricing: {
      "2ml": { price: 199, sprays: "~35 Sprays" },
      "5ml": { price: 449, sprays: "~80 Sprays" },
      "10ml": { price: 799, sprays: "~160 Sprays" }
    }
  },
  {
    id: "musamam-black-intense",
    name: "Musamam Black Intense",
    brand: "Lattafa Pride",
    category: "Eau de Parfum",
    tagline: "The Serpent of Mystery & Woody Incense",
    searchQuery: "Musamam",
    image: "/images/showcase/musamam_black_intense.jpg",
    fullRetail: "₹6,800",
    topNotes: ["Italian Bergamot", "Black Pepper"],
    heartNotes: ["Smoked Spices", "Dark Amberwood"],
    baseNotes: ["Frankincense Smoke", "Tactile Leather"],
    longevity: "12+ Hours",
    sillage: "Intense Spicy Sillage",
    vibe: "A textured serpent wrapping around charcoal, rich amber, and royal lavender.",
    pricing: {
      "2ml": { price: 149, sprays: "~35 Sprays" },
      "5ml": { price: 349, sprays: "~80 Sprays" },
      "10ml": { price: 599, sprays: "~160 Sprays" }
    }
  },
  {
    id: "oud-stallion",
    name: "Oud Stallion",
    brand: "Maison Crivelli",
    category: "Extrait de Parfum",
    tagline: "Equestrian Power, Smoked Cardamom & Saffron",
    searchQuery: "Oud Stallion",
    image: "/images/showcase/oud_stallion.jpg",
    fullRetail: "₹28,500",
    topNotes: ["Cardamom", "Nutmeg"],
    heartNotes: ["Noble Saffron", "Burning Woods"],
    baseNotes: ["Smoked Agarwood", "Bourbon Vanilla"],
    longevity: "16+ Hours (Extrait)",
    sillage: "Monstrous Executive Presence",
    vibe: "Galloping through cedar woods after an autumn storm with saddle leather.",
    pricing: {
      "2ml": { price: 299, sprays: "~35 Sprays" },
      "5ml": { price: 599, sprays: "~80 Sprays" },
      "10ml": { price: 1099, sprays: "~160 Sprays" }
    }
  },
  {
    id: "vintage-tobacco",
    name: "Vintage Tobacco",
    brand: "IBRAQ",
    category: "Extrait de Parfum",
    tagline: "Artisanal Aged Tobacco Leaf & Golden Honeyed Amber",
    searchQuery: "Vintage Tobacco",
    image: "/images/showcase/vintage_tobacco.jpg",
    fullRetail: "₹22,000",
    topNotes: ["Golden Honey", "Smoked Cinnamon"],
    heartNotes: ["Aged Tobacco Leaf", "Roasted Tonka"],
    baseNotes: ["Bourbon Vanilla", "Dark Woods"],
    longevity: "12+ Hours (Extrait)",
    sillage: "Intoxicating Warm Trail",
    vibe: "Antique leather armchairs, cured pipe tobacco, and fine golden cognac.",
    pricing: {
      "2ml": { price: 249, sprays: "~35 Sprays" },
      "5ml": { price: 499, sprays: "~80 Sprays" },
      "10ml": { price: 899, sprays: "~160 Sprays" }
    }
  }
];

export default function HeroViralDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState("5ml");
  const [addedNotice, setAddedNotice] = useState(false);

  const navigate = useNavigate();
  const { addToCart } = useCart();
  const currentFragrance = VIRAL_SPOTLIGHT_FRAGRANCES[activeIdx];

  // Close on Escape key
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

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % VIRAL_SPOTLIGHT_FRAGRANCES.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + VIRAL_SPOTLIGHT_FRAGRANCES.length) % VIRAL_SPOTLIGHT_FRAGRANCES.length);
  };

  const handleBottleClick = () => {
    setIsOpen(false);
    navigate(`/products?search=${encodeURIComponent(currentFragrance.searchQuery)}`);
  };

  const handleAddToCart = () => {
    const sizeNumber = parseInt(selectedSize.replace("ml", ""), 10);
    const sizeData = currentFragrance.pricing[selectedSize];

    const productPayload = {
      id: 8600 + activeIdx,
      name: `${currentFragrance.brand} - ${currentFragrance.name}`,
      category: currentFragrance.category,
      image_url: currentFragrance.image
    };

    const variantPayload = {
      id: 86000 + activeIdx * 10 + sizeNumber,
      size_ml: sizeNumber,
      price: sizeData.price,
      stock: 25
    };

    if (addToCart) {
      addToCart(productPayload, variantPayload, 1);
    }

    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  return (
    <>
      {/* ========================================================
          CONCEPT 1: ARROW-FILL BUTTON TRIGGER (MUTED LUXURY PALETTE)
         ======================================================== */}
      <div className="pt-3">
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
          className="!h-[52px] sm:!h-[54px] !px-7 sm:!px-8 !pr-16 sm:!pr-18 !text-xs sm:!text-sm !font-bold !tracking-[0.16em] !uppercase !border !border-[#443e34] hover:!border-[#665e4e] [--icon-circle:36px] sm:[--icon-circle:38px] [--icon-right:7px] sm:[--icon-right:8px] shadow-sm"
        />
      </div>

      {/* ========================================================
          SLIDE-OVER LUXURY DRAWER (PORTALED TO DOCUMENT BODY)
         ======================================================== */}
      {isOpen && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[99999] flex justify-end">
          {/* Full-Screen Dimmed Backdrop */}
          <div 
            className="fixed inset-0 bg-[#0a0a09]/85 backdrop-blur-md transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Full-Height Luxury Drawer Container */}
          <div className="relative w-full max-w-lg lg:max-w-xl h-screen bg-[#12110f] border-l border-[#2a2721] p-6 sm:p-8 flex flex-col justify-between overflow-y-auto shadow-2xl z-10 text-[#fffdf7] [scrollbar-width:thin] [scrollbar-color:#332f26_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[#332f26] [&::-webkit-scrollbar-thumb]:rounded">
            
            {/* Header */}
            <div>
              <div className="flex items-center justify-between border-b border-[#24211b] pb-4 mb-6">
                <div>
                  <div className="text-[10px] uppercase font-semibold tracking-[0.3em] text-[#d7b84c]">
                    The Decant Bar • Vault
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif font-normal text-[#fffdf7] mt-0.5">
                    The 5 Industry Sensations
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-9 h-9 rounded-full bg-[#1c1a17] border border-[#2d2922] hover:border-[#d7b84c] text-[#ded3bf] hover:text-[#fffdf7] flex items-center justify-center transition-all cursor-pointer"
                  title="Close"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Fragrance Selectors Pill Strip */}
              <div className="grid grid-cols-5 gap-1.5 mb-6">
                {VIRAL_SPOTLIGHT_FRAGRANCES.map((f, i) => {
                  const isActive = i === activeIdx;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setActiveIdx(i)}
                      className={`py-2 px-1 text-center rounded-lg border text-xs transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#221f19] border-[#d7b84c] text-[#fffdf7] font-semibold"
                          : "bg-[#161412] border-[#26231e] text-[#8e897e] hover:text-[#fffdf7]"
                      }`}
                    >
                      <div className="text-[9px] font-mono text-[#d7b84c]">0{i + 1}</div>
                      <div className="text-[11px] truncate font-serif mt-0.5">{f.name.split(" ")[0]}</div>
                    </button>
                  );
                })}
              </div>

              {/* Active Fragrance Card */}
              <div className="p-5 rounded-2xl bg-[#171512] border border-[#26231d] space-y-4">
                
                {/* Bottle Presentation with Click to Navigate */}
                <div className="flex items-center gap-5">
                  <div 
                    onClick={handleBottleClick}
                    className="relative w-28 h-36 rounded-xl overflow-hidden bg-[#100f0d] border border-[#2b2720] hover:border-[#d7b84c] p-2 flex items-center justify-center shrink-0 cursor-pointer transition-colors group"
                    title="Click to visit full product page"
                  >
                    <img
                      src={currentFragrance.image}
                      alt={currentFragrance.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-[#0a0a09]/20 group-hover:bg-transparent transition-colors" />
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] uppercase font-semibold tracking-[0.25em] text-[#d7b84c]">
                      {currentFragrance.brand} • {currentFragrance.category}
                    </div>
                    <h4 
                      onClick={handleBottleClick}
                      className="text-xl sm:text-2xl font-serif text-[#fffdf7] hover:text-[#d7b84c] transition-colors cursor-pointer"
                    >
                      {currentFragrance.name}
                    </h4>
                    <p className="text-xs text-[#ded3bf] font-light leading-relaxed">
                      {currentFragrance.tagline}
                    </p>
                    <div className="text-xs text-[#8e897e] pt-1">
                      Full 100ml Flacon: <span className="line-through">{currentFragrance.fullRetail}</span>
                    </div>
                  </div>
                </div>

                {/* Olfactory Notes List */}
                <div className="border-t border-[#26231e] pt-3.5 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#d7b84c] w-24 shrink-0">
                      Top Notes:
                    </span>
                    <span className="text-[#fffdf7]">{currentFragrance.topNotes.join(" • ")}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#d7b84c] w-24 shrink-0">
                      Heart Notes:
                    </span>
                    <span className="text-[#fffdf7]">{currentFragrance.heartNotes.join(" • ")}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#d7b84c] w-24 shrink-0">
                      Base Notes:
                    </span>
                    <span className="text-[#fffdf7]">{currentFragrance.baseNotes.join(" • ")}</span>
                  </div>
                </div>

                {/* Longevity & Sillage */}
                <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#11100e] border border-[#22201a]">
                    <div className="text-[9px] uppercase tracking-wider text-[#d7b84c] font-mono">Longevity</div>
                    <div className="text-[#fffdf7] font-serif mt-0.5">{currentFragrance.longevity}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#11100e] border border-[#22201a]">
                    <div className="text-[9px] uppercase tracking-wider text-[#d7b84c] font-mono">Sillage</div>
                    <div className="text-[#fffdf7] font-serif mt-0.5">{currentFragrance.sillage}</div>
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Actions: Decant Selection & Add to Cart */}
            <div className="border-t border-[#24211b] pt-5 mt-6 space-y-4">
              <div>
                <div className="text-[10px] uppercase font-mono tracking-wider text-[#d7b84c] mb-2">
                  Choose Decant Size:
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(currentFragrance.pricing).map(([sizeKey, sizeData]) => {
                    const isSelected = selectedSize === sizeKey;
                    return (
                      <button
                        key={sizeKey}
                        type="button"
                        onClick={() => setSelectedSize(sizeKey)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#252119] border-[#d7b84c] text-[#fffdf7]"
                            : "bg-[#161412] border-[#26231e] text-[#8e897e] hover:border-[#3d372c]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-[#d7b84c]">{sizeKey}</span>
                          <span className="text-xs font-serif text-[#fffdf7]">₹{sizeData.price}</span>
                        </div>
                        <div className="text-[9px] text-[#8e897e] mt-0.5">{sizeData.sprays}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Add to Bag and View Product Page Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#d7b84c] text-[#12110f] font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-[#e4c965] transition-all cursor-pointer"
                >
                  <ShoppingBag size={14} />
                  <span>
                    {addedNotice ? "Added to Bag ✓" : `Add ${selectedSize} Decant (₹${currentFragrance.pricing[selectedSize].price})`}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleBottleClick}
                  className="w-full sm:w-auto py-3 px-4 rounded-xl border border-[#3b362b] hover:border-[#d7b84c] text-[#ded3bf] hover:text-[#fffdf7] text-xs font-medium tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>View Product</span>
                  <ArrowUpRight size={14} />
                </button>
              </div>

              {/* Prev / Next Controls */}
              <div className="flex items-center justify-between text-xs font-mono text-[#8e897e] pt-1">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex items-center gap-1 text-[#ded3bf] hover:text-[#d7b84c] transition-colors cursor-pointer"
                >
                  <ChevronLeft size={14} />
                  <span>Previous</span>
                </button>

                <span>0{activeIdx + 1} of 0{VIRAL_SPOTLIGHT_FRAGRANCES.length}</span>

                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-1 text-[#ded3bf] hover:text-[#d7b84c] transition-colors cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}
    </>
  );
}

