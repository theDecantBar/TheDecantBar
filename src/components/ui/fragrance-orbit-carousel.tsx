"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShoppingBag, Check, Heart, ExternalLink, ArrowRight, ShieldCheck, ChevronDown } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

export type DecantSize = "2ml" | "5ml" | "10ml";

export type Fragrance = {
  id: string;
  brand: string;
  name: string;
  image: string;
  alt?: string;
  eyebrow?: string;
  label?: string;
  rating: number;
  house: string;
  category: string;
  description: string;
  likes: number;
  notes: string[];
  accent: string;
  searchQuery: string;
  pricing: {
    "2ml": { price: number; sprays: string };
    "5ml": { price: number; sprays: string };
    "10ml": { price: number; sprays: string };
  };
};

export const DEFAULT_FRAGRANCES: Fragrance[] = [
  {
    id: "oud-maracuja",
    brand: "Maison Crivelli",
    name: "Oud Maracujá",
    image: "/images/showcase/oud_maracuja.png",
    eyebrow: "EXTRAIT DE PARFUM • #1 GLOBAL SENSATION",
    label: "Oud Maracujá",
    rating: 4.9,
    house: "Maison Crivelli Paris • Jordi Fernández",
    category: "Tropical Oud • 14+ Hours Longevity",
    description: "The viral sensation that took over luxury perfumery. Luminous exotic passionfruit crashing into dark, smoky Cambodian agarwood, black leather, and rich bourbon vanilla.",
    notes: ["Passionfruit Accord", "Cambodian Oud", "Black Leather", "Bourbon Vanilla", "Incense", "Patchouli"],
    accent: "#c6a15b",
    likes: 4820,
    searchQuery: "Oud Maracuja",
    pricing: {
      "2ml": { price: 299, sprays: "~35 Sprays" },
      "5ml": { price: 599, sprays: "~80 Sprays" },
      "10ml": { price: 1099, sprays: "~160 Sprays" }
    }
  },
  {
    id: "le-male-le-parfum",
    brand: "Jean Paul Gaultier",
    name: "Le Male Le Parfum",
    image: "/images/showcase/le_male_le_parfum.png",
    eyebrow: "EAU DE PARFUM INTENSE • BLACK OFFICER",
    label: "Le Male Le Parfum",
    rating: 4.8,
    house: "Quentin Bisch & Nathalie Gracia-Cetto",
    category: "Warm Oriental Vanilla • 10+ Hours",
    description: "The undisputed king of date-night seduction. Velvety cardamom and fresh lavender leading to powdery Florentine iris, enveloped in dark bourbon vanilla and oriental amber.",
    notes: ["Green Cardamom", "French Lavender", "Florentine Iris", "Bourbon Vanilla", "Oriental Amber", "Noble Woods"],
    accent: "#b89355",
    likes: 6140,
    searchQuery: "Le Male Le Parfum",
    pricing: {
      "2ml": { price: 199, sprays: "~35 Sprays" },
      "5ml": { price: 449, sprays: "~80 Sprays" },
      "10ml": { price: 799, sprays: "~160 Sprays" }
    }
  },
  {
    id: "musamam-black-intense",
    brand: "Lattafa Pride",
    name: "Musamam Black Intense",
    image: "/images/showcase/musamam_black_intense.png",
    eyebrow: "EAU DE PARFUM • ROYAL ARABIAN",
    label: "Musamam Black",
    rating: 4.7,
    house: "Lattafa Pride Master Vault",
    category: "Smoked Spices & Leather • 12+ Hours",
    description: "An enigmatic sculpted serpent wrapped around tactile black leather, vibrant Italian bergamot, dark smoky frankincense, and magnetic charcoal amberwood.",
    notes: ["Italian Bergamot", "Smoked Spices", "Dark Amberwood", "Charcoal & Incense", "Tactile Leather", "Lavender"],
    accent: "#8c7b64",
    likes: 3290,
    searchQuery: "Musamam",
    pricing: {
      "2ml": { price: 149, sprays: "~35 Sprays" },
      "5ml": { price: 349, sprays: "~80 Sprays" },
      "10ml": { price: 599, sprays: "~160 Sprays" }
    }
  },
  {
    id: "oud-stallion",
    brand: "Maison Crivelli",
    name: "Oud Stallion",
    image: "/images/showcase/oud_stallion.png",
    eyebrow: "EXTRAIT DE PARFUM • PURE BLOODLINE",
    label: "Oud Stallion",
    rating: 4.9,
    house: "Maison Crivelli Paris • Jordi Fernández",
    category: "Smoked Leather & Saffron • 16+ Hours",
    description: "Raw equestrian power and untamed elegance. A fiery collision of noble saffron, smoked cardamom, aged saddle leather, and dark agarwood.",
    notes: ["Noble Saffron", "Cardamom & Nutmeg", "Saddle Leather", "Smoked Agarwood", "Cedarwood", "Bourbon Vanilla"],
    accent: "#4d7c58",
    likes: 2850,
    searchQuery: "Oud Stallion",
    pricing: {
      "2ml": { price: 299, sprays: "~35 Sprays" },
      "5ml": { price: 599, sprays: "~80 Sprays" },
      "10ml": { price: 1099, sprays: "~160 Sprays" }
    }
  },
  {
    id: "vintage-tobacco",
    brand: "IBRAQ Parfums",
    name: "Vintage Tobacco",
    image: "/images/showcase/vintage_tobacco.png",
    eyebrow: "EXTRAIT DE PARFUM • ARTISANAL VAULT",
    label: "Vintage Tobacco",
    rating: 5.0,
    house: "IBRAQ Parfums Since 1929",
    category: "Aged Tobacco & Amber • 14+ Hours",
    description: "Antique leather armchairs, cured golden Virginia tobacco leaf, honeycomb drip, roasted tonka bean, and fine aged cognac.",
    notes: ["Golden Honey", "Cured Tobacco Leaf", "Roasted Tonka", "Bourbon Vanilla", "Aged Cognac", "Warm Spices"],
    accent: "#b87333",
    likes: 3910,
    searchQuery: "Vintage Tobacco",
    pricing: {
      "2ml": { price: 249, sprays: "~35 Sprays" },
      "5ml": { price: 499, sprays: "~80 Sprays" },
      "10ml": { price: 899, sprays: "~160 Sprays" }
    }
  }
];

export function wrapIndex(i: number, n: number): number {
  if (n <= 0) return 0;
  return ((Math.round(i) % n) + n) % n;
}

export function stepDirection(from: number, to: number, n: number): 1 | -1 {
  if (n <= 0) return 1;
  const fwd = (((to - from) % n) + n) % n;
  return fwd <= n - fwd ? 1 : -1;
}

export function stripStart(index: number, n: number, visible: number): number {
  if (n <= visible) return 0;
  return Math.max(0, Math.min(index - 1, n - visible));
}

export function fitSize(chars: number, max: number, width: number, em: number): number {
  return Math.min(max, width / (Math.max(1, chars) * em));
}

export function arcPath(a0: number, a1: number, cx: number, cy: number, r: number, w: number, steps = 48): string {
  const outer: string[] = [];
  const inner: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = ((a0 + (a1 - a0) * t) * Math.PI) / 180;
    const h = (w / 2) * Math.pow(Math.sin(Math.PI * t), 0.45);
    const c = Math.cos(a);
    const s = Math.sin(a);
    outer.push((cx + c * (r + h)).toFixed(1) + " " + (cy + s * (r + h)).toFixed(1));
    inner.push((cx + c * (r - h)).toFixed(1) + " " + (cy + s * (r - h)).toFixed(1));
  }
  return "M" + outer.join("L") + "L" + inner.reverse().join("L") + "Z";
}

export const ARC_REST = [[50, 98], [46, 124], [60, 126], [40, 100], [48, 110]];
export function arcRest(index: number): number[] {
  return ARC_REST[((index % ARC_REST.length) + ARC_REST.length) % ARC_REST.length];
}

export const ARC_SWEEP = [38, 146];

const ORBIT_X = 299;
const ORBIT_Y = -450;
const ORBIT_R = 650;
const SWING = 50;
const ITEM = 120;
const VISIBLE = 4;

const HIDE_1 = "inset(0% 0% 0% 100%)";
const HIDE_2 = "inset(0% 100% 0% 0%)";
const SHOW = "inset(0% 0% 0% 0%)";

const CSS_STYLES = `
.frg-root {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #11100e;
  color: #fffdf7;
  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
  container-type: inline-size;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}
.frg-root * {
  box-sizing: border-box;
}
.frg-canvas {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 960px;
  height: 520px;
  transform: translate(-50%, -50%) scale(var(--frg-s, 1));
  transform-origin: 50% 50%;
}
.frg-arc {
  position: absolute;
  left: 0;
  top: 0;
  width: 960px;
  height: 520px;
  overflow: visible;
  pointer-events: none;
}
.frg-btn {
  appearance: none;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  padding: 0;
  margin: 0;
  cursor: pointer;
}
.frg-btn:focus-visible {
  outline: 2px solid #c6a15b;
  outline-offset: 3px;
  border-radius: 8px;
}
.frg-pager {
  position: absolute;
  left: 50px;
  top: 172px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.frg-dot {
  width: 16px;
  height: 12px;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: height 0.45s cubic-bezier(0.3, 0.7, 0.2, 1);
}
.frg-dot i {
  display: block;
  width: 4px;
  height: 4px;
  border-radius: 4px;
  background: #ded3bf;
  opacity: 0.35;
  transition: height 0.45s cubic-bezier(0.3, 0.7, 0.2, 1), opacity 0.3s;
}
.frg-dot[aria-current="true"] i {
  height: 24px;
  opacity: 1;
  background: #c6a15b;
}
.frg-dot[aria-current="true"] {
  height: 28px;
}
.frg-bottles {
  position: absolute;
  left: 110px;
  top: 60px;
  width: 260px;
  height: 280px;
  touch-action: pan-y;
  cursor: grab;
}
.frg-bottles:active {
  cursor: grabbing;
}
.frg-orbit {
  position: absolute;
  inset: 0;
  transform-origin: 72% -210%;
  visibility: hidden;
  will-change: transform;
  display: flex;
  align-items: center;
  justify-content: center;
}
.frg-orbit > img {
  display: block;
  width: auto;
  max-width: 220px;
  height: 260px;
  object-fit: contain;
  user-select: none;
  -webkit-user-drag: none;
  filter: drop-shadow(0 20px 24px rgba(0,0,0,0.55)) drop-shadow(0 4px 6px rgba(0,0,0,0.3));
  transition: transform 0.3s ease;
}
.frg-head {
  position: absolute;
  left: 395px;
  top: 75px;
  width: 325px;
  height: 140px;
}
.frg-hd {
  position: absolute;
  inset: 0;
  visibility: hidden;
}
.frg-eye {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #c6a15b;
  margin: 0 0 4px 2px;
}
.frg-t1, .frg-t2 {
  display: block;
  white-space: nowrap;
  line-height: 1.05;
  text-transform: uppercase;
  margin: 0;
}
.frg-t1 {
  font-family: 'Inter', sans-serif;
  font-weight: 300;
  letter-spacing: 0.12em;
  color: #c4b9a3;
  margin-top: 4px;
}
.frg-t2 {
  font-family: Georgia, 'Times New Roman', serif;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-top: 4px;
  color: #fffdf7;
}
.frg-acts {
  position: absolute;
  left: 395px;
  top: 245px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 310px;
}
.frg-card {
  position: absolute;
  left: 720px;
  top: 70px;
  width: 230px;
  padding: 16px 18px 18px;
  border-radius: 16px;
  background: rgba(24, 22, 19, 0.85);
  -webkit-backdrop-filter: blur(14px);
  backdrop-filter: blur(14px);
  border: 1px solid #2b2720;
  box-shadow: 0 16px 36px -12px rgba(0,0,0,0.5);
}
.frg-tabs {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #28241e;
  padding-bottom: 8px;
  font-size: 11px;
  margin-bottom: 14px;
}
.frg-tab {
  color: #8e8779;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 2px 0;
  transition: color 0.2s;
}
.frg-tab[aria-selected="true"] {
  color: #c6a15b;
}
.frg-bodies {
  display: grid;
}
.frg-body {
  grid-area: 1/1;
  visibility: hidden;
}
.frg-rate {
  position: relative;
  height: 52px;
  margin: 0 0 10px 4px;
}
.frg-badge {
  position: absolute;
  left: 0;
  top: 0;
  width: 40px;
  height: 52px;
  border-radius: 8px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 6px;
}
.frg-badge svg {
  width: 12px;
  height: 12px;
  fill: #12110f;
}
.frg-num {
  position: absolute;
  left: 10px;
  top: 4px;
  font-size: 30px;
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1;
  color: #12110f;
}
.frg-house {
  font-family: Georgia, serif;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: #fffdf7;
  margin: 0;
}
.frg-kit {
  font-size: 10px;
  font-weight: 500;
  color: #9c9384;
  margin: 3px 0 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.frg-desc {
  font-size: 11.5px;
  line-height: 1.45;
  color: #ded3bf;
  margin: 0;
  min-height: 60px;
  font-weight: 300;
}
.frg-notes {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
  min-height: 60px;
}
.frg-notes li {
  font-size: 10px;
  padding: 3px 7px;
  border-radius: 99px;
  background: #221f1a;
  border: 1px solid #332f28;
  color: #e5ded0;
}
.frg-react {
  display: flex;
  gap: 10px;
  margin-top: 14px;
}
.frg-like {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 12px;
  border-radius: 99px;
  font-size: 10.5px;
  font-weight: 500;
  background: #201d19;
  border: 1px solid #312c24;
  color: #ded3bf;
  transition: all 0.2s;
}
.frg-like[aria-pressed="true"] {
  background: #332b1f;
  border-color: #c6a15b;
  color: #c6a15b;
}
.frg-strip {
  position: absolute;
  left: 110px;
  top: 362px;
  width: 570px;
  height: 122px;
  display: flex;
  align-items: center;
}
.frg-arrow {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  flex: none;
  border-radius: 50%;
  background: #1c1a17;
  border: 1px solid #2d2922;
  color: #ded3bf;
  transition: all 0.2s;
}
.frg-arrow:hover {
  border-color: #c6a15b;
  color: #fffdf7;
}
.frg-win {
  position: relative;
  width: ${ITEM * VISIBLE}px;
  height: 122px;
  overflow: hidden;
  flex: none;
  margin: 0 8px;
  -webkit-mask-image: linear-gradient(90deg, #000 88%, transparent);
  mask-image: linear-gradient(90deg, #000 88%, transparent);
}
.frg-track {
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  transition: transform 0.6s cubic-bezier(0.65, 0, 0.35, 1);
}
.frg-th {
  width: ${ITEM}px;
  height: 122px;
  display: flex;
  justify-content: center;
  padding-top: 3px;
}
.frg-th .frg-btn {
  width: 90px;
  height: 116px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding-top: 8px;
  background: #171512;
  border: 1px solid #28241e;
  transition: all 0.3s;
}
.frg-th .frg-btn[aria-current="true"] {
  background: #24201a;
  border-color: #c6a15b;
  box-shadow: 0 8px 20px -8px rgba(0,0,0,0.5);
}
.frg-th img {
  width: 44px;
  height: 58px;
  max-width: none;
  object-fit: contain;
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));
  transition: transform 0.45s;
}
.frg-th .frg-btn[aria-current="true"] img {
  transform: scale(1.08);
}
.frg-th span {
  font-size: 9.5px;
  line-height: 1.2;
  text-align: center;
  font-weight: 600;
  color: #ded3bf;
  max-width: 82px;
  white-space: normal;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.frg-th .frg-btn[aria-current="true"] span {
  color: #fffdf7;
}

@container (max-width: 768px) {
  .frg-canvas {
    position: relative;
    left: auto;
    top: auto;
    width: 100%;
    height: auto;
    transform: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px 14px 24px;
  }
  .frg-arc {
    width: 160%;
    height: auto;
    left: -30%;
    top: -20px;
  }
  .frg-pager {
    left: 8px;
    top: 80px;
  }
  .frg-bottles {
    position: relative;
    left: auto;
    top: auto;
    width: min(55vw, 240px);
    height: min(55vw, 240px);
    margin-top: 0;
  }
  .frg-orbit > img {
    max-width: 180px;
    height: 220px;
  }
  .frg-head {
    position: relative;
    left: auto;
    top: auto;
    width: 100%;
    height: 90px;
    margin-top: 6px;
    text-align: center;
  }
  .frg-hd {
    text-align: center;
  }
  .frg-acts {
    position: relative;
    left: auto;
    top: auto;
    width: 100%;
    max-width: 340px;
    margin-top: 8px;
  }
  .frg-card {
    position: relative;
    left: auto;
    top: auto;
    width: 100%;
    max-width: 380px;
    margin-top: 12px;
  }
  .frg-strip {
    position: relative;
    left: auto;
    top: auto;
    width: 100%;
    justify-content: center;
    margin-top: 14px;
  }
  .frg-win {
    width: calc(100% - 80px);
  }
  .frg-scroll-badge {
    display: none;
  }
}

.frg-scroll-badge {
  position: absolute;
  right: 28px;
  bottom: 24px;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 6px 14px;
  border-radius: 99px;
  background: rgba(20, 18, 15, 0.85);
  border: 1px solid #332e26;
  font-size: 10px;
  font-weight: 700;
  color: #c4b9a3;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  pointer-events: none;
  backdrop-filter: blur(8px);
}
.frg-scroll-badge svg {
  color: #c6a15b;
  animation: frg-bounce 1.9s infinite ease-in-out;
}
@keyframes frg-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(3px); }
}
`;

export interface FragranceOrbitCarouselProps {
  fragrances?: Fragrance[];
  onSelectSize?: (fragrance: Fragrance, size: DecantSize) => void;
  onAddToCart?: (fragrance: Fragrance, size: DecantSize) => void;
  onExplore?: (fragrance: Fragrance) => void;
  className?: string;
}

export function FragranceOrbitCarousel({
  fragrances = DEFAULT_FRAGRANCES,
  onAddToCart,
  onExplore,
  className = ""
}: FragranceOrbitCarouselProps) {
  const n = fragrances.length;
  const [index, setIndex] = useState(0);
  const [tab, setTab] = useState<"notes" | "story">("notes");
  const [selectedSize, setSelectedSize] = useState<DecantSize>("5ml");
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const [addedToast, setAddedToast] = useState(false);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const indexRef = useRef(0);
  const dirRef = useRef<1 | -1>(1);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const shown = useRef(-1);
  const arcRef = useRef<SVGPathElement | null>(null);
  const arc = useRef({ a0: 0, a1: 0 });
  const orbits = useRef<(HTMLDivElement | null)[]>([]);
  const heads = useRef<(HTMLDivElement | null)[]>([]);
  const bodies = useRef<(HTMLDivElement | null)[]>([]);
  const swipe = useRef<{ x: number; y: number } | null>(null);

  const { addToCart } = useCart();
  const navigate = useNavigate();

  // ResizeObserver to scale the 960x520 canvas dynamically to fit the container
  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const fit = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      el.style.setProperty("--frg-s", String(Math.min(w / 960, h / 540, 1.4)));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // GSAP Orbit Transition
  useLayoutEffect(() => {
    const from = shown.current;
    const to = index;
    const parts = (i: number) => {
      const head = heads.current[i];
      return {
        orbit: orbits.current[i] ?? null,
        head: head ?? null,
        eye: head?.querySelector(".frg-eye") ?? null,
        t1: head?.querySelector(".frg-t1") ?? null,
        t2: head?.querySelector(".frg-t2") ?? null,
        body: bodies.current[i] ?? null
      };
    };

    const drawArc = () => {
      arcRef.current?.setAttribute(
        "d",
        arcPath(arc.current.a0, arc.current.a1, ORBIT_X, ORBIT_Y, ORBIT_R, 118)
      );
    };

    const rest = arcRest(to);
    const tint = fragrances[to]?.accent || "#c6a15b";

    if (tlRef.current) tlRef.current.progress(1).kill();
    const b = parts(to);

    if (from === -1 || from === to) {
      for (let i = 0; i < n; i++) {
        if (i !== to) {
          const p = parts(i);
          const toHide = [p.orbit, p.head, p.body].filter(Boolean);
          if (toHide.length) gsap.set(toHide, { autoAlpha: 0 });
        }
      }
      const toShow = [b.orbit, b.head, b.body, b.eye].filter(Boolean);
      if (toShow.length) gsap.set(toShow, { autoAlpha: 1, rotation: 0, y: 0 });
      if (b.t1) gsap.set(b.t1, { clipPath: SHOW });
      if (b.t2) gsap.set(b.t2, { clipPath: SHOW });
      arc.current.a0 = rest[0];
      arc.current.a1 = rest[1];
      drawArc();
      if (arcRef.current) gsap.set(arcRef.current, { fill: tint });
      shown.current = to;
      return;
    }

    const a = parts(from);
    const d = dirRef.current;
    const tl = gsap.timeline({
      onComplete: () => {
        tlRef.current = null;
      }
    });
    tlRef.current = tl;

    // Bottle rotation along orbit
    if (a.orbit && b.orbit) {
      tl.to(a.orbit, { rotation: SWING * d, duration: 0.62, ease: "power2.in" }, 0)
        .set(a.orbit, { autoAlpha: 0, rotation: 0 }, 0.62)
        .fromTo(b.orbit, { autoAlpha: 1, rotation: -SWING * d }, { rotation: 0, duration: 0.95, ease: "power3.out" }, 0.3);
    }

    // Title wipe animation
    if (a.t1) tl.to(a.t1, { clipPath: HIDE_1, duration: 0.42, ease: "power2.in" }, 0);
    if (a.t2) tl.to(a.t2, { clipPath: HIDE_2, duration: 0.42, ease: "power2.in" }, 0.06);
    if (a.eye) tl.to(a.eye, { autoAlpha: 0, duration: 0.25 }, 0);
    if (a.head) tl.set(a.head, { autoAlpha: 0 }, 0.5);
    if (b.head) tl.set(b.head, { autoAlpha: 1 }, 0.5);
    if (b.eye) tl.fromTo(b.eye, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }, 0.55);
    if (b.t1) tl.fromTo(b.t1, { clipPath: HIDE_1 }, { clipPath: SHOW, duration: 0.7, ease: "power3.out" }, 0.55);
    if (b.t2) tl.fromTo(b.t2, { clipPath: HIDE_2 }, { clipPath: SHOW, duration: 0.7, ease: "power3.out" }, 0.62);

    // Card fade & stagger
    if (a.body) tl.to(a.body, { autoAlpha: 0, y: -6, duration: 0.3, ease: "power1.in" }, 0.05);
    if (b.body) {
      tl.set(b.body, { autoAlpha: 1, y: 0 }, 0.4);
      tl.fromTo(b.body.children, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "power2.out" }, 0.4);
    }

    // Arc stretch and tint morph
    tl.to(arc.current, { a0: ARC_SWEEP[0], a1: ARC_SWEEP[1], duration: 0.6, ease: "power2.inOut", onUpdate: drawArc }, 0)
      .to(arc.current, { a0: rest[0], a1: rest[1], duration: 0.85, ease: "power3.out", onUpdate: drawArc }, 0.6);
    if (arcRef.current) {
      tl.to(arcRef.current, { fill: tint, duration: 1.1, ease: "power1.inOut" }, 0.1);
    }

    shown.current = to;
  }, [index, n, fragrances]);

  useEffect(() => () => { tlRef.current?.kill(); }, []);

  const wheelLockRef = useRef(false);

  const select = (next: number, dir: 1 | -1) => {
    if (next === indexRef.current) return;
    dirRef.current = dir;
    indexRef.current = next;
    setIndex(next);
  };

  const go = (to: number, dir?: 1 | -1) => {
    if (n < 2) return;
    const next = wrapIndex(to, n);
    if (next === indexRef.current) return;
    select(next, dir ?? stepDirection(indexRef.current, next, n));
  };

  const step = (d: 1 | -1) => go(indexRef.current + d, d);

  // Scroll Controller: Exactly 1 single scroll gesture = 1 perfume bottle change in motion
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // Filter out micro-scrolls
      if (Math.abs(e.deltaY) < 14 && Math.abs(e.deltaX) < 14) return;

      // In cooldown: ignore continuous trackpad inertia
      if (wheelLockRef.current) return;

      wheelLockRef.current = true;
      const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      const dir: 1 | -1 = delta > 0 ? 1 : -1;

      step(dir);

      // 450ms cooldown allows the orbit swing & title wipe animation to complete smoothly
      window.setTimeout(() => {
        wheelLockRef.current = false;
      }, 450);
    };

    let touchStartY = 0;
    let touchStartX = 0;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches.length === 0) return;
      const dy = e.changedTouches[0].clientY - touchStartY;
      const dx = e.changedTouches[0].clientX - touchStartX;

      if (wheelLockRef.current) return;

      if (Math.abs(dy) > 30 && Math.abs(dy) >= Math.abs(dx)) {
        wheelLockRef.current = true;
        step(dy < 0 ? 1 : -1);
        window.setTimeout(() => { wheelLockRef.current = false; }, 450);
      } else if (Math.abs(dx) > 30) {
        wheelLockRef.current = true;
        step(dx < 0 ? 1 : -1);
        window.setTimeout(() => { wheelLockRef.current = false; }, 450);
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [n]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      step(-1);
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    swipe.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const s = swipe.current;
    swipe.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(e.clientY - s.y) * 1.3) {
      step(dx < 0 ? 1 : -1);
    }
  };

  // Add Decant to Bag handler
  const handleAddToCart = () => {
    const current = fragrances[index];
    if (!current) return;

    const sizeNum = parseInt(selectedSize.replace("ml", ""), 10);
    const sizeData = current.pricing[selectedSize];

    const productPayload = {
      id: 8700 + index,
      name: `${current.brand} - ${current.name}`,
      category: current.category,
      image_url: current.image
    };

    const variantPayload = {
      id: 87000 + index * 10 + sizeNum,
      size_ml: sizeNum,
      price: sizeData.price,
      stock: 25
    };

    if (addToCart) {
      addToCart(productPayload, variantPayload, 1);
    }

    onAddToCart?.(current, selectedSize);

    setAddedToast(true);
    window.setTimeout(() => setAddedToast(false), 2200);
  };

  const handleExplore = () => {
    const current = fragrances[index];
    if (!current) return;
    onExplore?.(current);
    navigate(`/products?search=${encodeURIComponent(current.searchQuery)}`);
  };

  const currentFragrance = fragrances[index];
  const start = stripStart(index, n, VISIBLE);
  const activePricing = currentFragrance?.pricing[selectedSize];

  return (
    <div
      ref={rootRef}
      className={`frg-root ${className}`}
      role="region"
      aria-label="Popular Fragrances Orbit Carousel"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <style>{CSS_STYLES}</style>

      <div className="frg-canvas">
        {/* Curved Morphing Background Arc */}
        <svg className="frg-arc" viewBox="0 0 960 520" aria-hidden="true">
          <path ref={arcRef} style={{ opacity: 0.22 }} />
        </svg>

        {/* Vertical Pager Dots */}
        <div className="frg-pager" role="tablist" aria-label="Select Fragrance">
          {fragrances.map((f, i) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              className="frg-btn frg-dot"
              aria-selected={i === index}
              aria-current={i === index ? "true" : undefined}
              aria-label={`${f.brand} ${f.name}`}
              onClick={() => go(i)}
            >
              <i />
            </button>
          ))}
        </div>

        {/* Orbiting Perfume Bottles */}
        <div
          className="frg-bottles"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (swipe.current = null)}
        >
          {fragrances.map((f, i) => (
            <div
              key={f.id}
              ref={(el) => { orbits.current[i] = el; }}
              className="frg-orbit"
              aria-hidden={i !== index}
            >
              <img
                src={f.image}
                alt={f.alt ?? `${f.brand} ${f.name}`}
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* Wipe-in Typography Header */}
        <div className="frg-head" aria-live="polite">
          {fragrances.map((f, i) => (
            <div
              key={f.id}
              ref={(el) => { heads.current[i] = el; }}
              className="frg-hd"
              aria-hidden={i !== index}
            >
              <p className="frg-eye">{f.eyebrow ?? `#${i + 1} ICONIC FRAGRANCE`}</p>
              <h2 style={{ margin: 0, font: "inherit" }}>
                <span
                  className="frg-t1"
                  style={{ fontSize: fitSize(f.brand.length, 36, 325, 0.58) + "px" }}
                >
                  {f.brand}
                </span>
                <span
                  className="frg-t2"
                  style={{ fontSize: fitSize(f.name.length, 48, 325, 0.62) + "px" }}
                >
                  {f.name}
                </span>
              </h2>
            </div>
          ))}
        </div>

        {/* Direct Decant Ordering & Actions */}
        <div className="frg-acts">
          {/* Decant Size Selector */}
          <div>
            <div className="text-[10px] uppercase font-bold tracking-[0.14em] text-[#9c9384] mb-1.5 flex items-center justify-between">
              <span>Select Decant Volume</span>
              <span className="text-[#c6a15b] lowercase font-normal">{activePricing?.sprays}</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {(["2ml", "5ml", "10ml"] as DecantSize[]).map((size) => {
                const isSelected = selectedSize === size;
                const info = currentFragrance?.pricing[size];
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 px-1 rounded-lg border text-center transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#25211a] border-[#c6a15b] text-[#fffdf7] font-bold shadow-sm"
                        : "bg-[#161412] border-[#29251f] text-[#8e8779] hover:text-[#ded3bf] hover:border-[#3d372e]"
                    }`}
                  >
                    <div className="text-xs font-bold uppercase">{size}</div>
                    <div className="text-[11px] font-semibold text-[#c6a15b] mt-0.5">₹{info?.price}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary & Secondary Action CTAs */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className={`flex-1 h-11 rounded-xl font-bold text-xs uppercase tracking-[0.12em] flex items-center justify-center gap-2 transition-all cursor-pointer ${
                addedToast
                  ? "bg-[#2a442a] text-[#86efac] border border-[#3b663b]"
                  : "bg-[#c6a15b] hover:bg-[#d4b067] text-[#12110f] border border-[#a88643]"
              }`}
            >
              {addedToast ? (
                <>
                  <Check size={15} strokeWidth={2.5} />
                  <span>Added To Bag!</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={15} strokeWidth={2} />
                  <span>Add {selectedSize} • ₹{activePricing?.price}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleExplore}
              className="h-11 px-3.5 rounded-xl bg-[#1b1916] border border-[#2d2922] hover:border-[#4d4436] text-[#ded3bf] hover:text-[#fffdf7] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Explore full product details"
            >
              <ExternalLink size={14} />
            </button>
          </div>
        </div>

        {/* Fragrance Overview & Olfactory Pyramid Card */}
        <div className="frg-card">
          <div className="frg-tabs" role="tablist" aria-label="Fragrance details">
            <button
              type="button"
              role="tab"
              className="frg-btn frg-tab"
              aria-selected={tab === "notes"}
              onClick={() => setTab("notes")}
            >
              Olfactory Pyramid
            </button>
            <button
              type="button"
              role="tab"
              className="frg-btn frg-tab"
              aria-selected={tab === "story"}
              onClick={() => setTab("story")}
            >
              Vibe & Scent
            </button>
          </div>

          <div className="frg-bodies">
            {fragrances.map((f, i) => (
              <div
                key={f.id}
                ref={(el) => { bodies.current[i] = el; }}
                className="frg-body"
                aria-hidden={i !== index}
              >
                <div className="frg-rate">
                  <div className="frg-badge" style={{ background: f.accent }}>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="m12 2.5 2.9 6 6.6.8-4.9 4.6 1.3 6.6L12 17.2l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
                    </svg>
                  </div>
                  <span className="frg-num" aria-label={`Rated ${f.rating.toFixed(1)} out of 5`}>
                    {f.rating.toFixed(1)}
                  </span>
                </div>

                <p className="frg-house">{f.house}</p>
                <p className="frg-kit">{f.category}</p>

                {tab === "notes" ? (
                  <ul className="frg-notes">
                    {f.notes.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="frg-desc">{f.description}</p>
                )}

                <div className="frg-react">
                  <button
                    type="button"
                    className="frg-btn frg-like"
                    aria-pressed={!!liked[i]}
                    tabIndex={i === index ? 0 : -1}
                    onClick={() => {
                      setLiked((s) => ({ ...s, [i]: !s[i] }));
                    }}
                  >
                    <Heart
                      size={13}
                      className={liked[i] ? "fill-[#c6a15b] text-[#c6a15b]" : "text-[#9c9384]"}
                    />
                    <span>{f.likes + (liked[i] ? 1 : 0)} loves</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Thumbnail Selector Strip */}
        <div className="frg-strip">
          <button
            type="button"
            className="frg-btn frg-arrow"
            aria-label="Previous fragrance"
            onClick={() => step(-1)}
          >
            <svg viewBox="0 0 12 16" width="12" height="14" fill="currentColor">
              <path d="M11 0v16L0 8z" />
            </svg>
          </button>

          <div className="frg-win">
            <div
              className="frg-track"
              style={{ transform: `translateX(${-start * ITEM}px)` }}
            >
              {fragrances.map((f, i) => (
                <div key={f.id} className="frg-th">
                  <button
                    type="button"
                    className="frg-btn"
                    aria-current={i === index ? "true" : undefined}
                    onClick={() => go(i)}
                  >
                    <img src={f.image} alt="" draggable={false} />
                    <span>{f.label ?? f.name}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="frg-btn frg-arrow"
            aria-label="Next fragrance"
            onClick={() => step(1)}
          >
            <svg viewBox="0 0 12 16" width="12" height="14" fill="currentColor">
              <path d="M1 0v16l11-8z" />
            </svg>
          </button>
        </div>

        {/* Scroll hint indicator */}
        <div className="frg-scroll-badge">
          <span>Scroll to orbit</span>
          <ChevronDown size={13} />
        </div>
      </div>
    </div>
  );
}

export default FragranceOrbitCarousel;
