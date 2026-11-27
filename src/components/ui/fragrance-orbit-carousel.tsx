"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ChevronDown, Clock, Snowflake, Leaf, Sun, Moon, X } from "lucide-react";

export type DecantSize = "2ml" | "5ml" | "10ml";

export type WhenToWearProfile = {
  winter: number;
  spring: number;
  summer: number;
  fall: number;
  day: number;
  night: number;
};

export type NoteTierItem = {
  name: string;
  image: string;
};

export type DualFrameConfig = {
  frame1Image: string;
  bottle2Image: string;
  bg1: string;
  bg2: string;
  auraBg: string;
  floorBg: string;
  noteTiers: {
    id: "top" | "mid" | "base";
    label: string;
    notes: NoteTierItem[];
  }[];
};

export type Fragrance = {
  id: string;
  brand: string;
  name: string;
  image: string;
  backdrop: string;
  alt?: string;
  eyebrow?: string;
  label?: string;
  rating: number;
  house: string;
  category: string;
  description: string;
  likes: number;
  notes: string[];
  whenToWear: WhenToWearProfile;
  wearSummary: string;
  accent: string;
  searchQuery: string;
  dualFrame?: DualFrameConfig;
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
    image: "/images/showcase/oud_maracuja_cutout.png",
    backdrop: "/images/showcase/oud_maracuja_bg.jpg",
    eyebrow: "EXTRAIT DE PARFUM",
    label: "Oud Maracujá",
    rating: 4.9,
    house: "Maison Crivelli Paris • Jordi Fernández",
    category: "Tropical Oud • 14+ Hours Longevity",
    description: "The viral sensation that took over luxury perfumery. Luminous exotic passionfruit crashing into dark, smoky Cambodian agarwood, black leather, and rich bourbon vanilla.",
    notes: ["Passionfruit Accord", "Cambodian Oud", "Black Leather", "Bourbon Vanilla", "Incense", "Patchouli"],
    whenToWear: { winter: 88, spring: 42, summer: 18, fall: 95, day: 25, night: 96 },
    wearSummary: "Autumn & Winter • Evening Statements",
    accent: "#c6a15b",
    likes: 4820,
    searchQuery: "Oud Maracuja",
    dualFrame: {
      frame1Image: "/images/showcase/oud_maracuja_frame1.jpg",
      bottle2Image: "/images/showcase/oud_maracuja_cutout.png",
      bg1: "radial-gradient(ellipse 68% 72% at 50% 48%, #85786c 0%, #5c5249 48%, #2b2520 85%, #161310 100%)",
      bg2: "radial-gradient(circle at 78% 52%, rgba(28, 72, 165, 0.32) 0%, rgba(198, 161, 91, 0.1) 34%, transparent 62%), radial-gradient(ellipse 75% 80% at 68% 48%, #1d1915 0%, #0d1320 55%, #07080c 100%)",
      auraBg: "radial-gradient(circle, rgba(36, 98, 210, 0.38) 0%, rgba(198, 161, 91, 0.14) 48%, transparent 74%)",
      floorBg: "radial-gradient(ellipse at center, rgba(16, 60, 145, 0.5) 0%, rgba(0, 0, 0, 0.8) 55%, transparent 80%)",
      noteTiers: [
        {
          id: "top",
          label: "Top Notes",
          notes: [
            { name: "Passionfruit", image: "/images/showcase/passionfruit_note.jpg" },
            { name: "Fruity Notes", image: "/images/notes/mediterranean_fruit_basket.jpg" },
            { name: "Saffron", image: "/images/notes/saffron.png" },
            { name: "Turkish Rose", image: "/images/notes/turkish_rose.jpg" }
          ]
        },
        {
          id: "mid",
          label: "Middle / Heart Notes",
          notes: [
            { name: "Oud", image: "/images/notes/oud.png" },
            { name: "Benzoin", image: "/images/notes/benzoin.jpg" },
            { name: "Indonesian Patchouli", image: "/images/notes/indian_patchouli.jpg" }
          ]
        },
        {
          id: "base",
          label: "Base Notes",
          notes: [
            { name: "Leather", image: "/images/notes/leather.jpg" },
            { name: "Akigalawood", image: "/images/notes/akigalawood.jpg" },
            { name: "Amber", image: "/images/notes/amber.jpg" },
            { name: "Vanilla", image: "/images/notes/bourbon_vanilla.jpg" },
            { name: "Labdanum", image: "/images/notes/labdanum.jpg" }
          ]
        }
      ]
    },
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
    image: "/images/showcase/le_male_cutout.png",
    backdrop: "/images/showcase/le_male_bg.jpg",
    eyebrow: "EAU DE PARFUM INTENSE",
    label: "Le Male Le Parfum",
    rating: 4.8,
    house: "Quentin Bisch & Nathalie Gracia-Cetto",
    category: "Warm Oriental Vanilla • 10+ Hours",
    description: "The undisputed king of date-night seduction. Velvety cardamom and fresh lavender leading to powdery Florentine iris, enveloped in dark bourbon vanilla and oriental amber.",
    notes: ["Cardamom", "Lavender", "Iris", "Vanilla"],
    whenToWear: { winter: 94, spring: 48, summer: 16, fall: 92, day: 30, night: 98 },
    wearSummary: "Date Nights • Cool Evenings",
    accent: "#b89355",
    likes: 6140,
    searchQuery: "Le Male Le Parfum",
    dualFrame: {
      frame1Image: "/images/showcase/le_male_frame1.jpg",
      bottle2Image: "/images/showcase/le_male_cutout.png",
      bg1: "radial-gradient(ellipse 68% 72% at 62% 38%, #4d3e31 0%, #2b231d 52%, #171310 85%, #0d0b09 100%)",
      bg2: "radial-gradient(circle at 78% 48%, rgba(184, 147, 85, 0.34) 0%, rgba(140, 88, 175, 0.14) 38%, transparent 66%), radial-gradient(ellipse 75% 80% at 15% 50%, rgba(120, 62, 165, 0.22) 0%, #151210 52%, #080708 100%)",
      auraBg: "radial-gradient(circle, rgba(204, 154, 82, 0.38) 0%, rgba(184, 147, 85, 0.16) 48%, transparent 74%)",
      floorBg: "radial-gradient(ellipse at center, rgba(198, 152, 78, 0.44) 0%, rgba(0, 0, 0, 0.85) 55%, transparent 80%)",
      noteTiers: [
        {
          id: "top",
          label: "Top Notes",
          notes: [
            { name: "Cardamom", image: "/images/notes/cardamom.jpg" }
          ]
        },
        {
          id: "mid",
          label: "Middle Notes",
          notes: [
            { name: "Lavender", image: "/images/notes/lavender.jpg" },
            { name: "Iris", image: "/images/notes/florentine_iris.jpg" }
          ]
        },
        {
          id: "base",
          label: "Base Notes",
          notes: [
            { name: "Vanilla", image: "/images/notes/bourbon_vanilla.jpg" }
          ]
        }
      ]
    },
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
    image: "/images/showcase/musamam_cutout.png",
    backdrop: "/images/showcase/musamam_bg.jpg",
    eyebrow: "EAU DE PARFUM",
    label: "Musamam Black",
    rating: 4.7,
    house: "Lattafa Pride Master Vault",
    category: "Smoked Spices & Leather • 12+ Hours",
    description: "An enigmatic sculpted serpent wrapped around tactile black leather, vibrant Italian bergamot, dark smoky frankincense, and magnetic charcoal amberwood.",
    notes: ["Lavender", "Nutmeg", "Sage", "Bergamot", "Cedarwood", "Geranium", "Mahonial", "Rosyfolia", "Cocoapulse™", "Tonka Bean", "Maple", "Ambrofix™", "Patchouli"],
    whenToWear: { winter: 90, spring: 38, summer: 15, fall: 88, day: 28, night: 94 },
    wearSummary: "Winter Nights • Formal Occasions",
    accent: "#8c7b64",
    likes: 3290,
    searchQuery: "Musamam",
    dualFrame: {
      frame1Image: "/images/showcase/musamam_frame1.jpg",
      bottle2Image: "/images/showcase/musamam_cutout.png",
      bg1: "radial-gradient(ellipse 68% 72% at 50% 48%, #26292e 0%, #181a1e 50%, #0e1013 85%, #07080a 100%)",
      bg2: "radial-gradient(circle at 78% 52%, rgba(125, 138, 158, 0.24) 0%, rgba(198, 161, 91, 0.1) 36%, transparent 64%), radial-gradient(ellipse 75% 80% at 68% 48%, #16181c 0%, #0c0d10 55%, #060709 100%)",
      auraBg: "radial-gradient(circle, rgba(160, 174, 192, 0.28) 0%, rgba(198, 161, 91, 0.14) 48%, transparent 74%)",
      floorBg: "radial-gradient(ellipse at center, rgba(140, 150, 168, 0.35) 0%, rgba(0, 0, 0, 0.85) 55%, transparent 80%)",
      noteTiers: [
        {
          id: "top",
          label: "Top Notes",
          notes: [
            { name: "Lavender", image: "/images/notes/lavender.jpg" },
            { name: "Nutmeg", image: "/images/notes/nutmeg.png" },
            { name: "Sage", image: "/images/notes/sage.jpg" },
            { name: "Bergamot", image: "/images/notes/bergamot.jpg" }
          ]
        },
        {
          id: "mid",
          label: "Middle Notes",
          notes: [
            { name: "Cedarwood", image: "/images/notes/cedarwood.jpg" },
            { name: "Geranium", image: "/images/notes/geranium.jpg" },
            { name: "Mahonial", image: "/images/notes/mahonial.png" },
            { name: "Rosyfolia", image: "/images/notes/damascena_rose.jpg" }
          ]
        },
        {
          id: "base",
          label: "Base Notes",
          notes: [
            { name: "Cocoapulse™", image: "/images/notes/cocoa.png" },
            { name: "Tonka Bean", image: "/images/notes/tonka_bean.png" },
            { name: "Maple", image: "/images/showcase/maple_note.jpg" },
            { name: "Ambrofix™", image: "/images/notes/ambrofix.jpg" },
            { name: "Patchouli", image: "/images/notes/patchouli.jpg" }
          ]
        }
      ]
    },
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
    image: "/images/showcase/oud_stallion_cutout.png",
    backdrop: "/images/showcase/oud_stallion_bg.jpg",
    eyebrow: "EXTRAIT DE PARFUM",
    label: "Oud Stallion",
    rating: 4.9,
    house: "Maison Crivelli Paris • Jordi Fernández",
    category: "Smoked Leather & Saffron • 16+ Hours",
    description: "Raw equestrian power and untamed elegance. A fiery collision of noble saffron, smoked cardamom, aged saddle leather, and dark agarwood.",
    notes: ["Saffron", "Cardamom", "Indonesian Nutmeg", "Jasmine", "Osmanthus", "Turkish Rose", "Agarwood (Oud)", "Leather", "Cedar", "Tonka", "Patchouli"],
    whenToWear: { winter: 98, spring: 20, summer: 6, fall: 90, day: 28, night: 96 },
    wearSummary: "Cold Weather • Power Nights",
    accent: "#4d7c58",
    likes: 2850,
    searchQuery: "Oud Stallion",
    dualFrame: {
      frame1Image: "/images/showcase/oud_stallion_frame1.jpg",
      bottle2Image: "/images/showcase/oud_stallion_cutout.png",
      bg1: "radial-gradient(ellipse 68% 72% at 50% 48%, #574a3f 0%, #382f27 50%, #1c1713 85%, #0e0b09 100%)",
      bg2: "radial-gradient(circle at 78% 52%, rgba(56, 130, 68, 0.34) 0%, rgba(184, 140, 72, 0.14) 36%, transparent 64%), radial-gradient(ellipse 75% 80% at 62% 48%, #151e16 0%, #0d120e 55%, #070907 100%)",
      auraBg: "radial-gradient(circle, rgba(64, 152, 76, 0.4) 0%, rgba(198, 161, 91, 0.14) 48%, transparent 74%)",
      floorBg: "radial-gradient(ellipse at center, rgba(60, 145, 70, 0.48) 0%, rgba(0, 0, 0, 0.85) 55%, transparent 80%)",
      noteTiers: [
        {
          id: "top",
          label: "Top Notes",
          notes: [
            { name: "Saffron", image: "/images/notes/saffron.png" },
            { name: "Cardamom", image: "/images/notes/cardamom.jpg" },
            { name: "Indonesian Nutmeg", image: "/images/notes/nutmeg.png" }
          ]
        },
        {
          id: "mid",
          label: "Middle Notes",
          notes: [
            { name: "Jasmine", image: "/images/notes/jasmine.jpg" },
            { name: "Osmanthus", image: "/images/notes/osmanthus.jpg" },
            { name: "Turkish Rose", image: "/images/notes/turkish_rose.jpg" }
          ]
        },
        {
          id: "base",
          label: "Base Notes",
          notes: [
            { name: "Agarwood (Oud)", image: "/images/notes/oud.png" },
            { name: "Leather", image: "/images/notes/leather.jpg" },
            { name: "Cedar", image: "/images/notes/cedar.jpg" },
            { name: "Tonka", image: "/images/notes/tonka_bean.png" },
            { name: "Patchouli", image: "/images/notes/patchouli.jpg" }
          ]
        }
      ]
    },
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
    image: "/images/showcase/vintage_tobacco_cutout.png",
    backdrop: "/images/showcase/vintage_tobacco_bg.jpg",
    eyebrow: "EXTRAIT DE PARFUM",
    label: "Vintage Tobacco",
    rating: 5.0,
    house: "IBRAQ Parfums Since 1929",
    category: "Aged Tobacco & Amber • 14+ Hours",
    description: "Antique leather armchairs, cured golden Virginia tobacco leaf, honeycomb drip, roasted tonka bean, and fine aged cognac.",
    notes: ["Cognac", "Raspberry", "Tonka Bean", "Caramel", "Oak", "Praline", "Oud", "Oakmoss", "Vanilla"],
    whenToWear: { winter: 96, spring: 32, summer: 10, fall: 92, day: 24, night: 95 },
    wearSummary: "Cozy Winters • Special Nights",
    accent: "#b87333",
    likes: 3910,
    searchQuery: "Vintage Tobacco",
    dualFrame: {
      frame1Image: "/images/showcase/vintage_tobacco_frame1.jpg",
      bottle2Image: "/images/showcase/vintage_tobacco_cutout.png",
      bg1: "radial-gradient(ellipse 68% 72% at 50% 48%, #47392e 0%, #2d241d 48%, #18130f 85%, #0e0b09 100%)",
      bg2: "radial-gradient(circle at 78% 52%, rgba(184, 115, 51, 0.34) 0%, rgba(198, 161, 91, 0.14) 34%, transparent 62%), radial-gradient(ellipse 75% 80% at 68% 48%, #261a10 0%, #140f0b 55%, #080705 100%)",
      auraBg: "radial-gradient(circle, rgba(202, 128, 48, 0.42) 0%, rgba(198, 161, 91, 0.16) 48%, transparent 74%)",
      floorBg: "radial-gradient(ellipse at center, rgba(184, 115, 51, 0.46) 0%, rgba(0, 0, 0, 0.82) 55%, transparent 80%)",
      noteTiers: [
        {
          id: "top",
          label: "Top Notes",
          notes: [
            { name: "Cognac", image: "/images/notes/cognac.jpg" },
            { name: "Raspberry", image: "/images/notes/raspberry.jpg" }
          ]
        },
        {
          id: "mid",
          label: "Middle Notes",
          notes: [
            { name: "Tonka Bean", image: "/images/notes/tonka_bean.png" },
            { name: "Caramel", image: "/images/notes/toffee_caramel.jpg" }
          ]
        },
        {
          id: "base",
          label: "Base Notes",
          notes: [
            { name: "Oak", image: "/images/notes/oak_wood.jpg" },
            { name: "Praline", image: "/images/notes/praline.jpg" },
            { name: "Oud", image: "/images/notes/oud.png" },
            { name: "Oakmoss", image: "/images/notes/oakmoss.jpg" },
            { name: "Vanilla", image: "/images/notes/bourbon_vanilla.jpg" }
          ]
        }
      ]
    },
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

export const ARC_REST = [[52, 102], [48, 122], [62, 126], [44, 106], [50, 114]];
export function arcRest(index: number): number[] {
  return ARC_REST[((index % ARC_REST.length) + ARC_REST.length) % ARC_REST.length];
}

export const ARC_SWEEP = [38, 146];

const ORBIT_X = 299;
const ORBIT_Y = -390;
const ORBIT_R = 650;
const SWING = 48;

const HIDE_1 = "inset(0% 0% 0% 100%)";
const HIDE_2 = "inset(0% 100% 0% 0%)";
const SHOW = "inset(0% 0% 0% 0%)";

const CALLOUT_ARROWS = [
  {
    id: "top",
    d: "M 744 128 L 692 92 L 626 92",
    ax: 744,
    ay: 128,
    tip: "M 633 88 L 623 92 L 633 96"
  },
  {
    id: "mid",
    d: "M 720 278 L 684 260 L 626 260",
    ax: 720,
    ay: 278,
    tip: "M 633 256 L 623 260 L 633 264"
  },
  {
    id: "base",
    d: "M 724 432 L 686 416 L 626 416",
    ax: 724,
    ay: 432,
    tip: "M 633 412 L 623 416 L 633 420"
  }
];

type DualStageHandles = {
  stage: HTMLDivElement | null;
  bg1: HTMLDivElement | null;
  bg2: HTMLDivElement | null;
  titleWrap: HTMLDivElement | null;
  bottle1: HTMLDivElement | null;
  f2Bottle: HTMLDivElement | null;
  tierHeads: (HTMLDivElement | null)[];
  notes: Record<"top" | "mid" | "base", (HTMLElement | null)[]>;
  arrowPaths: (SVGPathElement | null)[];
  arrowEnds: (SVGGElement | null)[];
  wearPill: HTMLDivElement | null;
};

const CSS_STYLES = `
.frg-root {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  overscroll-behavior: contain;
  background: #11100e;
  color: #fffdf7;
  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
  container-type: inline-size;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  outline: none;
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
  z-index: 2;
}
.frg-bd-layer {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}
.frg-bd-item {
  position: absolute;
  inset: 0;
  visibility: hidden;
  will-change: opacity, transform;
}
.frg-bd-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  filter: blur(8px) brightness(0.42) saturate(1.2);
  transform: scale(1.06);
}
.frg-bd-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 30% 50%, rgba(0,0,0,0.12) 0%, rgba(12,11,10,0.8) 70%, rgba(12,11,10,0.96) 100%);
  pointer-events: none;
}
.frg-bd-wash {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(14,13,11,0.28) 0%, rgba(14,13,11,0.72) 48%, rgba(14,13,11,0.92) 82%, rgba(14,13,11,0.97) 100%);
  pointer-events: none;
}

/* ========================================================
   DUAL-FRAME SCROLL REVEAL STAGE
   ======================================================== */
.frg-oud-stage {
  position: absolute;
  inset: 0;
  z-index: 3;
  overflow: hidden;
  visibility: hidden;
  pointer-events: none;
}
.frg-oud-stage--active .frg-oud-note-item,
.frg-oud-stage--active .frg-oud-wear-pill,
.frg-oud-stage--active.frg-oud-stage--f1 .frg-oud-bottle-1,
.frg-oud-stage--active.frg-oud-stage--f2 .frg-oud-f2-bottle {
  pointer-events: auto;
}
.frg-tilt-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: perspective(950px) rotateX(var(--tilt-rx, 0deg)) rotateY(var(--tilt-ry, 0deg)) scale(var(--tilt-scale, 1));
  transition: transform 0.24s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}
@media (prefers-reduced-motion: reduce) {
  .frg-tilt-wrap {
    transform: none !important;
  }
}
.frg-oud-bg1,
.frg-oud-bg2 {
  position: absolute;
  inset: 0;
  will-change: opacity;
}
.frg-oud-bg2 {
  opacity: 0;
}
.frg-oud-frame {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 1024px;
  height: 576px;
  transform: translate(-50%, -50%) scale(var(--frg-oud-s, 1));
  transform-origin: 50% 50%;
}
.frg-oud-title-wrap {
  position: absolute;
  left: 32px;
  right: 32px;
  top: 26px;
  text-align: center;
  z-index: 2;
  will-change: transform, opacity, clip-path;
}
.frg-oud-eyebrow {
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.34em;
  text-transform: uppercase;
  color: #f3e4c6;
  margin: 0 0 8px;
  text-shadow: 0 2px 12px rgba(15, 12, 9, 0.55);
}
.frg-oud-title {
  margin: 0;
  font-family: Georgia, 'Times New Roman', serif;
  font-weight: 700;
  line-height: 0.96;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #fffdf8;
  text-shadow: 0 10px 32px rgba(14, 11, 8, 0.55), 0 2px 6px rgba(14, 11, 8, 0.35);
  white-space: nowrap;
}
.frg-oud-bottle-1 {
  position: absolute;
  left: 50%;
  top: 94px;
  width: 490px;
  height: 490px;
  margin-left: -245px;
  z-index: 3;
  will-change: transform, opacity;
  -webkit-mask-image: radial-gradient(ellipse 46% 48% at 50% 50%, #000 58%, transparent 96%);
  mask-image: radial-gradient(ellipse 46% 48% at 50% 50%, #000 58%, transparent 96%);
}
.frg-oud-bottle-1 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Frame 2: Crisp Cutout Bottle on Right + Animated Notes & Leader Arrows on Left */
.frg-oud-f2-bottle {
  position: absolute;
  right: 54px;
  top: 44px;
  width: 260px;
  height: 472px;
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: transform, opacity;
}
.frg-oud-f2-bottle-aura {
  position: absolute;
  inset: 28px 10px;
  border-radius: 50%;
  filter: blur(24px);
  pointer-events: none;
}
.frg-oud-f2-bottle-floor {
  position: absolute;
  left: 24px;
  right: 24px;
  bottom: 10px;
  height: 22px;
  border-radius: 50%;
  filter: blur(6px);
  pointer-events: none;
}
.frg-oud-f2-bottle img {
  position: relative;
  z-index: 1;
  max-height: 454px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 28px 34px rgba(0, 0, 0, 0.72));
}

.frg-oud-arrows {
  position: absolute;
  inset: 0;
  width: 1024px;
  height: 576px;
  z-index: 5;
  pointer-events: none;
}
.frg-oud-arrow-line {
  fill: none;
  stroke: #d7b777;
  stroke-width: 1.35;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.frg-oud-arrow-dot {
  fill: #f5dfb0;
}
.frg-oud-arrow-ring {
  fill: none;
  stroke: rgba(215, 183, 119, 0.45);
  stroke-width: 1;
}

.frg-oud-tiers {
  position: absolute;
  left: 58px;
  top: 32px;
  width: 558px;
  height: 492px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 6;
}
.frg-oud-tier {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.frg-oud-tier-head {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  margin-bottom: 11px;
  will-change: transform, opacity;
}
.frg-oud-tier-rule {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(215, 183, 119, 0.48));
}
.frg-oud-tier-rule--right {
  background: linear-gradient(90deg, rgba(215, 183, 119, 0.48), transparent);
}
.frg-oud-tier-title {
  margin: 0;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.34em;
  text-transform: uppercase;
  color: #f3e4c6;
  white-space: nowrap;
}
.frg-oud-note-row {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 20px;
}
.frg-oud-note-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 86px;
  text-align: center;
  will-change: transform, opacity;
  appearance: none;
  background: none;
  border: 0;
  padding: 0;
  margin: 0;
  color: inherit;
  cursor: pointer;
}
.frg-oud-note-item:focus-visible {
  outline: 2px solid #c6a15b;
  outline-offset: 4px;
  border-radius: 12px;
}
.frg-oud-note-ring {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  padding: 2px;
  background: linear-gradient(145deg, rgba(235, 206, 146, 0.78), rgba(130, 102, 56, 0.38));
  box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.78), 0 0 18px rgba(198, 161, 91, 0.14);
  overflow: hidden;
  transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
}
.frg-oud-note-item:hover .frg-oud-note-ring,
.frg-oud-note-item--active .frg-oud-note-ring {
  transform: scale(1.07);
  background: linear-gradient(145deg, #f5dfb0, #c6a15b);
  box-shadow: 0 14px 28px -6px rgba(0, 0, 0, 0.85), 0 0 24px rgba(198, 161, 91, 0.42);
}
.frg-oud-note-item--active .frg-oud-note-name {
  color: #f5dfb0;
}
.frg-oud-note-inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  background: #141210;
  position: relative;
}
.frg-oud-note-inner::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  box-shadow: inset 0 0 14px rgba(8, 7, 6, 0.52);
  pointer-events: none;
}
.frg-oud-note-inner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transform: scale(1.1);
  filter: brightness(0.95) contrast(1.06);
}
.frg-oud-note-name {
  margin-top: 7px;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 11.5px;
  line-height: 1.25;
  color: #f2eadb;
  letter-spacing: 0.02em;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.75);
}

@media (prefers-reduced-motion: no-preference) {
  .frg-oud-note-ring {
    animation: frg-note-float 4.2s ease-in-out infinite;
    animation-delay: var(--note-delay, 0s);
  }
}
@keyframes frg-note-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2.5px); }
}

.frg-oud-wear-pill {
  position: absolute;
  left: 58px;
  bottom: 14px;
  max-width: 620px;
  z-index: 6;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 99px;
  background: rgba(14, 13, 12, 0.86);
  border: 1px solid rgba(198, 161, 91, 0.34);
  backdrop-filter: blur(10px);
  font-size: 10.5px;
  letter-spacing: 0.05em;
  color: #e9dec8;
  will-change: transform, opacity;
}
.frg-oud-wear-pill strong {
  color: #c6a15b;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 9.5px;
  flex-shrink: 0;
  white-space: nowrap;
}
.frg-oud-wear-hint {
  color: rgba(233, 222, 200, 0.45);
  font-size: 9.5px;
  padding-left: 4px;
  border-left: 1px solid rgba(255, 255, 255, 0.12);
  white-space: nowrap;
}
.frg-oud-bottle-1--clickable {
  cursor: pointer;
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
  left: 28px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  z-index: 10;
  transition: left 0.35s ease;
}
.frg-pager--compact {
  left: 16px;
  gap: 8px;
}
.frg-dot {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 24px;
  cursor: pointer;
  color: rgba(222, 211, 191, 0.5);
  transition: color 0.25s ease;
}
.frg-dot:hover {
  color: #f4efe6;
}
.frg-dot i {
  display: block;
  width: 12px;
  height: 1.5px;
  border-radius: 2px;
  background: rgba(222, 211, 191, 0.35);
  transition: width 0.35s cubic-bezier(0.3, 0.7, 0.2, 1), background-color 0.25s ease;
}
.frg-pager--compact .frg-dot i {
  width: 4px;
  height: 4px;
  border-radius: 4px;
}
.frg-dot[aria-current="true"] {
  color: #fffdf7;
}
.frg-dot[aria-current="true"] i {
  width: 26px;
  background: #c6a15b;
}
.frg-pager--compact .frg-dot[aria-current="true"] i {
  width: 4px;
  height: 22px;
  background: #c6a15b;
}
.frg-pager-num {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 10px;
  letter-spacing: 0.14em;
  color: rgba(198, 161, 91, 0.65);
  transition: color 0.25s ease;
}
.frg-dot[aria-current="true"] .frg-pager-num {
  color: #c6a15b;
}
.frg-pager-name {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.04em;
  white-space: nowrap;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.75);
}
.frg-pager--compact .frg-pager-num,
.frg-pager--compact .frg-pager-name {
  display: none;
}
@container (max-width: 960px) {
  .frg-pager-num,
  .frg-pager-name {
    display: none;
  }
  .frg-pager {
    left: 14px;
  }
  .frg-dot i {
    width: 4px;
    height: 4px;
  }
  .frg-dot[aria-current="true"] i {
    width: 4px;
    height: 22px;
  }
}
.frg-bottles {
  position: absolute;
  left: 105px;
  top: 105px;
  width: 270px;
  height: 310px;
  touch-action: pan-y;
  cursor: grab;
}
.frg-bottles:active {
  cursor: grabbing;
}
.frg-orbit {
  position: absolute;
  inset: 0;
  transform-origin: 71.85% -159.68%;
  visibility: hidden;
  will-change: transform, opacity;
  display: flex;
  align-items: center;
  justify-content: center;
}
.frg-orbit > img {
  display: block;
  width: auto;
  max-width: 240px;
  height: 300px;
  object-fit: contain;
  user-select: none;
  -webkit-user-drag: none;
  filter: drop-shadow(0 24px 28px rgba(0,0,0,0.6)) drop-shadow(0 4px 8px rgba(0,0,0,0.35));
}
.frg-info {
  position: absolute;
  left: 425px;
  top: 50%;
  transform: translateY(-50%);
  width: 485px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.frg-head {
  position: relative;
  width: 100%;
  height: 112px;
}
.frg-hd {
  position: absolute;
  inset: 0;
  visibility: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.frg-eye {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #c6a15b;
  margin: 0 0 6px 2px;
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
  letter-spacing: 0.14em;
  color: #c4b9a3;
}
.frg-t2 {
  font-family: Georgia, 'Times New Roman', serif;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-top: 4px;
  color: #fffdf7;
}
.frg-details {
  position: relative;
  display: grid;
  width: 100%;
}
.frg-body {
  grid-area: 1 / 1;
  visibility: hidden;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.frg-section {
  padding: 16px 18px;
  border-radius: 16px;
  background: rgba(24, 22, 19, 0.82);
  -webkit-backdrop-filter: blur(14px);
  backdrop-filter: blur(14px);
  border: 1px solid #2b2720;
  box-shadow: 0 14px 32px -12px rgba(0,0,0,0.45);
}
.frg-section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 11px;
}
.frg-section-title {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #c6a15b;
  margin: 0;
}
.frg-section-sub {
  font-size: 10.5px;
  font-weight: 500;
  color: #9c9384;
  letter-spacing: 0.03em;
}
.frg-notes {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.frg-notes li {
  font-size: 11.5px;
  font-weight: 500;
  padding: 5px 12px;
  border-radius: 99px;
  background: #201d18;
  border: 1px solid #353027;
  color: #efe7d8;
  letter-spacing: 0.01em;
}
.frg-wear-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 8px;
  text-align: center;
}
.frg-wear-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4px 2px;
}
.frg-wear-item--time {
  border-left: 1px solid rgba(255, 255, 255, 0.08);
  padding-left: 10px;
}
.frg-wear-icon {
  padding: 7px;
  border-radius: 8px;
  margin-bottom: 6px;
  background: rgba(255, 255, 255, 0.04);
  color: rgba(197, 193, 185, 0.68);
  display: flex;
  align-items: center;
  justify-content: center;
}
.frg-wear-icon--active {
  color: #c6a15b;
  background: rgba(198, 161, 91, 0.12);
  box-shadow: inset 0 0 0 1px rgba(198, 161, 91, 0.35);
}
.frg-wear-label {
  font-size: 10.5px;
  letter-spacing: 0.03em;
  color: #8e8a82;
  margin-bottom: 7px;
}
.frg-wear-label--active {
  color: #f4efe6;
  font-weight: 600;
}
.frg-wear-bar-track {
  width: 100%;
  height: 5px;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.09);
  overflow: hidden;
}
.frg-wear-bar-fill {
  height: 100%;
  border-radius: 99px;
  background: rgba(142, 138, 130, 0.45);
}
.frg-wear-bar-fill--active {
  background: linear-gradient(90deg, #c6a15b, #e4cc92);
}

.frg-stage-dock {
  position: absolute;
  right: 26px;
  bottom: 18px;
  z-index: 10;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 4px;
  border-radius: 99px;
  background: rgba(18, 16, 13, 0.88);
  border: 1px solid rgba(198, 161, 91, 0.32);
  backdrop-filter: blur(10px);
}
.frg-stage-tab {
  padding: 5px 12px;
  border-radius: 99px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #9e9689;
  transition: color 0.2s, background-color 0.2s;
}
.frg-stage-tab:hover {
  color: #f4efe6;
}
.frg-stage-tab--active {
  background: rgba(198, 161, 91, 0.18);
  color: #e4cc92;
}
.frg-stage-next {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 99px;
  color: #c6a15b;
  transition: background-color 0.2s, transform 0.2s;
}
.frg-stage-next:hover {
  background: rgba(198, 161, 91, 0.15);
  transform: translateY(1px);
}

@container (max-width: 768px) {
  .frg-bd-wash {
    background: linear-gradient(180deg, rgba(14,13,11,0.2) 0%, rgba(14,13,11,0.72) 40%, rgba(14,13,11,0.95) 100%);
  }
  .frg-canvas {
    position: relative;
    left: auto;
    top: auto;
    width: 100%;
    height: auto;
    min-height: 100%;
    transform: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 16px 14px 24px;
    gap: 12px;
  }
  .frg-arc {
    width: 160%;
    height: auto;
    left: -30%;
    top: -10px;
  }
  .frg-pager {
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
  }
  .frg-bottles {
    position: relative;
    left: auto;
    top: auto;
    width: min(52vw, 220px);
    height: min(56vw, 240px);
  }
  .frg-orbit > img {
    max-width: 175px;
    height: 220px;
  }
  .frg-info {
    position: relative;
    left: auto;
    top: auto;
    transform: none;
    width: 100%;
    max-width: 440px;
    gap: 14px;
  }
  .frg-head {
    height: 82px;
    text-align: center;
  }
  .frg-hd {
    text-align: center;
    align-items: center;
  }
  .frg-section {
    padding: 13px 14px;
  }
  .frg-notes {
    justify-content: center;
  }
  .frg-wear-grid {
    gap: 4px;
  }
  .frg-wear-item--time {
    padding-left: 6px;
  }
  .frg-stage-dock {
    right: 14px;
    bottom: 12px;
    padding: 3px;
  }
  .frg-stage-tab {
    padding: 4px 9px;
    font-size: 9px;
  }
}
`;

const NOTE_STORIES: Record<string, string> = {
  "Passionfruit": "Sun-ripened tropical snap that cuts through dark wood.",
  "Fruity Notes": "Vibrant exotic fruit flash opening the first 20 minutes.",
  "Saffron": "Warm crimson spice with dry metallic leather edges.",
  "Turkish Rose": "Rich velvety petals adding depth and crimson opulence.",
  "Oud": "Resinous, smoky Cambodian agarwood lingering for 14+ hours.",
  "Agarwood (Oud)": "Dark, untamed smoked wood anchoring the long dry-down.",
  "Benzoin": "Balsamic, honeyed resin smoothing out sharp spice edges.",
  "Indonesian Patchouli": "Earthy cacao-leaf richness giving structure to the heart.",
  "Patchouli": "Dark, velvety leaf balancing sweetness with natural depth.",
  "Leather": "Supple smoked saddle leather with an unmistakable trail.",
  "Akigalawood": "Crisp, peppery modern wood that boosts projection.",
  "Amber": "Warm golden resin wrapping the base in glowing warmth.",
  "Vanilla": "Creamy bourbon vanilla bean smoothing the dry-down.",
  "Labdanum": "Wild Mediterranean resin adding dark, leathery depth.",
  "Cardamom": "Aromatic spiced green pod lifting the cool lavender heart.",
  "Lavender": "Crisp French aromatic herb lending clean tailored tension.",
  "Iris": "Powdery Florentine orris butter creating a suede-like veil.",
  "Nutmeg": "Dry, warm kitchen spice sparking crisp bergamot.",
  "Indonesian Nutmeg": "Smoky, spiced nutmeg weaving warmth into saffron.",
  "Sage": "Fresh herbal clarity balancing smoked wood and leather.",
  "Bergamot": "Sparkling Italian citrus peel brightening the dark opening.",
  "Cedarwood": "Dry pencil-shaving cedar spine keeping resins sharp.",
  "Cedar": "Crisp dry wood supporting smoky leather and saffron.",
  "Geranium": "Crisp green-floral lift slicing through warm spice.",
  "Mahonial": "Luminous white-petal radiance floating through the heart.",
  "Rosyfolia": "Airy dewy rose transparency lifting heavy spices.",
  "Cocoapulse™": "Roasted dark cocoa warmth with zero cloying sugar.",
  "Tonka Bean": "Almond-hay roasted bean melting into caramel & smoke.",
  "Tonka": "Creamy coumarin warmth softening dark agarwood.",
  "Maple": "Subtle caramelized sap echoing smoky woods.",
  "Ambrofix™": "Radiant mineral ambergris backbone for all-day sillage.",
  "Jasmine": "Creamy night-blooming petals tempering fierce leather.",
  "Osmanthus": "Apricot-tinged golden blossom nodding toward suede.",
  "Cognac": "Aged oak-barrel brandy warmth opening the composition.",
  "Raspberry": "Juicy ruby berry brightness cutting into rich tobacco.",
  "Caramel": "Toasted golden toffee melting slowly into tonka bean.",
  "Oak": "Charred barrel stave wood adding smoky vintage character.",
  "Praline": "Roasted caramelized nuttiness lingering close to skin.",
  "Oakmoss": "Classic emerald woodland moss anchoring the dry-down.",
};

function getNoteStory(name: string): string {
  return NOTE_STORIES[name] || `Signature aromatic note shaping this fragrance's trail.`;
}

export interface FragranceOrbitCarouselProps {
  fragrances?: Fragrance[];
  activeIndex?: number;
  activeStage?: 0 | 1;
  showStageControls?: boolean;
  onSlideChange?: (index: number, stage: 0 | 1) => void;
  onSelectSize?: (fragrance: Fragrance, size: DecantSize) => void;
  onAddToCart?: (fragrance: Fragrance, size: DecantSize) => void;
  onExplore?: (fragrance: Fragrance) => void;
  className?: string;
}

function getDualRefs(map: Record<number, DualStageHandles | undefined>, idx: number) {
  const h = map[idx];
  if (!h) return null;
  const topNotes = h.notes.top.filter(Boolean) as HTMLElement[];
  const midNotes = h.notes.mid.filter(Boolean) as HTMLElement[];
  const baseNotes = h.notes.base.filter(Boolean) as HTMLElement[];
  return {
    stage: h.stage,
    bg1: h.bg1,
    bg2: h.bg2,
    titleWrap: h.titleWrap,
    bottle1: h.bottle1,
    f2Bottle: h.f2Bottle,
    tierHeads: h.tierHeads.filter(Boolean) as HTMLDivElement[],
    topNotes,
    midNotes,
    baseNotes,
    allNotes: [...topNotes, ...midNotes, ...baseNotes],
    arrowPaths: h.arrowPaths.filter(Boolean) as SVGPathElement[],
    arrowEnds: h.arrowEnds.filter(Boolean) as SVGGElement[],
    wearPill: h.wearPill
  };
}

function primeArrowLengths(paths: SVGPathElement[]) {
  paths.forEach((path) => {
    const len = path.getTotalLength ? path.getTotalLength() : 160;
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
  });
}

function applyDualInstant(
  refs: NonNullable<ReturnType<typeof getDualRefs>>,
  stage: 0 | 1
) {
  if (!refs.stage) return;
  gsap.set(refs.stage, { autoAlpha: 1, scale: 1 });
  if (stage === 0) {
    gsap.set(refs.bg1, { autoAlpha: 1 });
    gsap.set(refs.bg2, { autoAlpha: 0 });
    gsap.set(refs.titleWrap, { autoAlpha: 1, y: 0, clipPath: SHOW });
    gsap.set(refs.bottle1, { autoAlpha: 1, x: 0, y: 0, scale: 1 });
    gsap.set(refs.f2Bottle, { autoAlpha: 0, x: -30, scale: 0.96 });
    gsap.set(refs.tierHeads, { autoAlpha: 0, x: 24 });
    gsap.set(refs.allNotes, { autoAlpha: 0, x: 36, scale: 0.72 });
    primeArrowLengths(refs.arrowPaths);
    gsap.set(refs.arrowEnds, { autoAlpha: 0 });
    gsap.set(refs.wearPill, { autoAlpha: 0, y: 10 });
  } else {
    gsap.set(refs.bg1, { autoAlpha: 0 });
    gsap.set(refs.bg2, { autoAlpha: 1 });
    gsap.set(refs.titleWrap, { autoAlpha: 0, y: -24 });
    gsap.set(refs.bottle1, { autoAlpha: 0, x: 320, y: -20, scale: 1.04 });
    gsap.set(refs.f2Bottle, { autoAlpha: 1, x: 0, scale: 1 });
    gsap.set(refs.tierHeads, { autoAlpha: 1, x: 0 });
    gsap.set(refs.allNotes, { autoAlpha: 1, x: 0, scale: 1 });
    refs.arrowPaths.forEach((path) => {
      const len = path.getTotalLength ? path.getTotalLength() : 160;
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: 0 });
    });
    gsap.set(refs.arrowEnds, { autoAlpha: 1 });
    gsap.set(refs.wearPill, { autoAlpha: 1, y: 0 });
  }
}

export function FragranceOrbitCarousel({
  fragrances = DEFAULT_FRAGRANCES,
  activeIndex,
  activeStage,
  showStageControls = true,
  onSlideChange,
  className = ""
}: FragranceOrbitCarouselProps) {
  const n = fragrances.length;
  const [index, setIndex] = useState(() =>
    typeof activeIndex === "number" ? wrapIndex(activeIndex, n) : 0
  );
  const [dualStage, setDualStage] = useState<0 | 1>(() => activeStage ?? 0);
  const [selectedNote, setSelectedNote] = useState<{
    fragranceIndex: number;
    name: string;
    tierLabel: string;
    story: string;
  } | null>(null);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const indexRef = useRef(0);
  const dualStageRef = useRef<0 | 1>(0);
  const dirRef = useRef<1 | -1>(1);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const shownRef = useRef<{ index: number; dualStage: 0 | 1 }>({ index: -1, dualStage: 0 });
  const arcRef = useRef<SVGPathElement | null>(null);
  const arc = useRef({ a0: 0, a1: 0 });
  const orbits = useRef<(HTMLDivElement | null)[]>([]);
  const backdrops = useRef<(HTMLDivElement | null)[]>([]);
  const heads = useRef<(HTMLDivElement | null)[]>([]);
  const bodies = useRef<(HTMLDivElement | null)[]>([]);
  const swipe = useRef<{ x: number; y: number } | null>(null);

  const dualMapRef = useRef<Record<number, DualStageHandles | undefined>>({});

  // Gesture-level scroll & lock refs so 1 scroll gesture = 1 frame (never skips Frame 2)
  const gestureActiveRef = useRef(false);
  const lockUntilRef = useRef(0);
  const wheelAccumRef = useRef(0);
  const peakDeltaRef = useRef(0);
  const decayedLowRef = useRef(false);
  const lastWheelDirRef = useRef<1 | -1>(1);
  const gestureIdleTimerRef = useRef<number | null>(null);

  const ensureDualHandle = (i: number): DualStageHandles => {
    if (!dualMapRef.current[i]) {
      dualMapRef.current[i] = {
        stage: null,
        bg1: null,
        bg2: null,
        titleWrap: null,
        bottle1: null,
        f2Bottle: null,
        tierHeads: [],
        notes: { top: [], mid: [], base: [] },
        arrowPaths: [],
        arrowEnds: [],
        wearPill: null
      };
    }
    return dualMapRef.current[i]!;
  };

  // ResizeObserver to scale both the 960x520 orbit canvas and the 1024x576 dual-frame stage
  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const fit = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      el.style.setProperty("--frg-s", String(Math.min(w / 960, h / 540, 1.38)));
      el.style.setProperty("--frg-oud-s", String(Math.min(w / 1024, h / 576, 1.45)));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // GSAP Smooth Orbit & Dual-Frame Transition
  useLayoutEffect(() => {
    const from = shownRef.current;
    const toIndex = index;
    const toStage = dualStage;

    const parts = (i: number) => {
      const head = heads.current[i];
      return {
        orbit: orbits.current[i] ?? null,
        backdrop: backdrops.current[i] ?? null,
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

    const rest = arcRest(toIndex);
    const tint = fragrances[toIndex]?.accent || "#c6a15b";
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (tlRef.current) {
      tlRef.current.kill();
      tlRef.current = null;
    }

    const fromIsDual = from.index >= 0 && Boolean(fragrances[from.index]?.dualFrame);
    const toIsDual = Boolean(fragrances[toIndex]?.dualFrame);

    // Hide any items not involved in the active transition
    for (let i = 0; i < n; i++) {
      const hasDual = Boolean(fragrances[i]?.dualFrame);
      if (hasDual) {
        const p = parts(i);
        const stdHide = [p.orbit, p.head, p.body, p.backdrop].filter(Boolean);
        if (stdHide.length) gsap.set(stdHide, { autoAlpha: 0 });
        if (i !== toIndex && (from.index === -1 || from.index === toIndex || i !== from.index)) {
          const dr = getDualRefs(dualMapRef.current, i);
          if (dr?.stage) gsap.set(dr.stage, { autoAlpha: 0 });
        }
        continue;
      }
      if (i !== toIndex && (from.index === -1 || from.index === toIndex || i !== from.index)) {
        const p = parts(i);
        const toHide = [p.orbit, p.head, p.body, p.backdrop].filter(Boolean);
        if (toHide.length) gsap.set(toHide, { autoAlpha: 0, rotation: 0, y: 0 });
      }
    }

    // Case 1: Initial mount
    if (from.index === -1) {
      if (toIsDual) {
        const dr = getDualRefs(dualMapRef.current, toIndex);
        if (arcRef.current) gsap.set(arcRef.current, { autoAlpha: 0 });
        if (dr) {
          if (reducedMotion) {
            applyDualInstant(dr, toStage);
          } else {
            const tl = gsap.timeline({ onComplete: () => { tlRef.current = null; } });
            tlRef.current = tl;
            applyDualInstant(dr, 0);
            if (dr.titleWrap) {
              tl.fromTo(
                dr.titleWrap,
                { autoAlpha: 0, y: 20, clipPath: "inset(0% 0% 100% 0%)" },
                { autoAlpha: 1, y: 0, clipPath: SHOW, duration: 0.78, ease: "power3.out" },
                0.08
              );
            }
            if (dr.bottle1) {
              tl.fromTo(
                dr.bottle1,
                { autoAlpha: 0, y: 32, scale: 0.94 },
                { autoAlpha: 1, y: 0, scale: 1, duration: 0.9, ease: "power3.out", force3D: true },
                0.12
              );
            }
          }
        }
      } else {
        const b = parts(toIndex);
        const toShow = [b.orbit, b.head, b.body, b.eye, b.backdrop].filter(Boolean);
        if (toShow.length) gsap.set(toShow, { autoAlpha: 1, rotation: 0, y: 0 });
        if (b.backdrop) gsap.set(b.backdrop, { autoAlpha: 1, scale: 1 });
        if (b.t1) gsap.set(b.t1, { clipPath: SHOW });
        if (b.t2) gsap.set(b.t2, { clipPath: SHOW });
        if (b.body) gsap.set(b.body.children, { autoAlpha: 1, y: 0 });
        arc.current.a0 = rest[0];
        arc.current.a1 = rest[1];
        drawArc();
        if (arcRef.current) gsap.set(arcRef.current, { fill: tint, autoAlpha: 0.22 });
      }
      shownRef.current = { index: toIndex, dualStage: toStage };
      return;
    }

    // Case 2: Within the same Dual-Frame fragrance (Frame 1 <-> Frame 2 bottle + arrow + notes motion)
    if (from.index === toIndex && toIsDual) {
      const dr = getDualRefs(dualMapRef.current, toIndex);
      if (!dr || from.dualStage === toStage) {
        shownRef.current = { index: toIndex, dualStage: toStage };
        return;
      }

      if (reducedMotion) {
        applyDualInstant(dr, toStage);
        shownRef.current = { index: toIndex, dualStage: toStage };
        return;
      }

      const tl = gsap.timeline({ onComplete: () => { tlRef.current = null; } });
      tlRef.current = tl;
      if (dr.stage) gsap.set(dr.stage, { autoAlpha: 1, scale: 1 });

      if (toStage === 1) {
        primeArrowLengths(dr.arrowPaths);
        tl.to(dr.titleWrap, { autoAlpha: 0, y: -26, duration: 0.42, ease: "power2.in" }, 0)
          .to(dr.bg1, { autoAlpha: 0, duration: 0.85, ease: "power2.inOut" }, 0)
          .to(dr.bg2, { autoAlpha: 1, duration: 0.85, ease: "power2.inOut" }, 0.04)
          .fromTo(
            dr.bottle1,
            { autoAlpha: 1, x: 0, y: 0, scale: 1 },
            { x: 320, y: -20, scale: 1.04, duration: 0.8, ease: "power3.inOut", force3D: true },
            0.04
          )
          .to(dr.bottle1, { autoAlpha: 0, duration: 0.34, ease: "power1.inOut" }, 0.44)
          .fromTo(
            dr.f2Bottle,
            { autoAlpha: 0, x: -72, scale: 0.94 },
            { autoAlpha: 1, x: 0, scale: 1, duration: 0.72, ease: "power3.out", force3D: true },
            0.3
          );

        const tierGroups = [
          { start: 0.34, head: dr.tierHeads[0], notes: dr.topNotes, path: dr.arrowPaths[0], end: dr.arrowEnds[0] },
          { start: 0.50, head: dr.tierHeads[1], notes: dr.midNotes, path: dr.arrowPaths[1], end: dr.arrowEnds[1] },
          { start: 0.66, head: dr.tierHeads[2], notes: dr.baseNotes, path: dr.arrowPaths[2], end: dr.arrowEnds[2] }
        ];

        tierGroups.forEach(({ start, head, notes, path, end }) => {
          if (end) {
            tl.fromTo(
              end,
              { autoAlpha: 0 },
              { autoAlpha: 1, duration: 0.32, ease: "power2.out" },
              start
            );
          }
          if (path) {
            tl.to(path, { strokeDashoffset: 0, duration: 0.48, ease: "power2.out" }, start + 0.04);
          }
          if (head) {
            tl.fromTo(
              head,
              { autoAlpha: 0, x: 24 },
              { autoAlpha: 1, x: 0, duration: 0.44, ease: "power3.out" },
              start + 0.16
            );
          }
          if (notes.length) {
            tl.fromTo(
              notes,
              { autoAlpha: 0, x: 42, scale: 0.72 },
              { autoAlpha: 1, x: 0, scale: 1, duration: 0.52, stagger: 0.055, ease: "back.out(1.3)", force3D: true },
              start + 0.2
            );
          }
        });

        if (dr.wearPill) {
          tl.fromTo(
            dr.wearPill,
            { autoAlpha: 0, y: 12 },
            { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out" },
            0.96
          );
        }
      } else {
        tl.to(dr.wearPill, { autoAlpha: 0, y: 10, duration: 0.24, ease: "power2.in" }, 0)
          .to(dr.allNotes, { autoAlpha: 0, x: 32, scale: 0.78, duration: 0.34, stagger: 0.015, ease: "power2.in", force3D: true }, 0)
          .to(dr.tierHeads, { autoAlpha: 0, x: 20, duration: 0.3, ease: "power2.in" }, 0.05)
          .to(dr.arrowEnds, { autoAlpha: 0, duration: 0.25 }, 0.08);

        dr.arrowPaths.forEach((path, idx) => {
          const len = path.getTotalLength ? path.getTotalLength() : 160;
          tl.to(path, { strokeDashoffset: len, duration: 0.32, ease: "power2.in" }, idx * 0.04);
        });

        tl.to(dr.f2Bottle, { autoAlpha: 0, x: -56, scale: 0.96, duration: 0.44, ease: "power2.inOut", force3D: true }, 0.14)
          .fromTo(
            dr.bottle1,
            { autoAlpha: 0, x: 320, y: -20, scale: 1.04 },
            { autoAlpha: 1, x: 320, y: -20, scale: 1.04, duration: 0.24, ease: "power1.out" },
            0.14
          )
          .to(
            dr.bottle1,
            { x: 0, y: 0, scale: 1, duration: 0.76, ease: "power3.out", force3D: true },
            0.22
          )
          .to(dr.bg2, { autoAlpha: 0, duration: 0.72, ease: "power2.inOut" }, 0.12)
          .to(dr.bg1, { autoAlpha: 1, duration: 0.72, ease: "power2.inOut" }, 0.12)
          .fromTo(
            dr.titleWrap,
            { autoAlpha: 0, y: -18, clipPath: "inset(0% 0% 100% 0%)" },
            { autoAlpha: 1, y: 0, clipPath: SHOW, duration: 0.65, ease: "power3.out" },
            0.42
          );
      }

      shownRef.current = { index: toIndex, dualStage: toStage };
      return;
    }

    // Case 3: Cross-fragrance transitions (Dual <-> Standard, Dual <-> Dual, Standard <-> Standard)
    const d = dirRef.current;
    const tl = gsap.timeline({
      onComplete: () => {
        tlRef.current = null;
      }
    });
    tlRef.current = tl;

    if (fromIsDual) {
      const fromDual = getDualRefs(dualMapRef.current, from.index);
      if (fromDual?.stage) {
        tl.to(fromDual.stage, { autoAlpha: 0, scale: 0.97, duration: 0.48, ease: "power2.inOut" }, 0);
      }
    } else {
      const a = parts(from.index);
      if (reducedMotion) {
        if (a.backdrop) tl.to(a.backdrop, { autoAlpha: 0, duration: 0.25 }, 0);
        if (a.orbit) tl.to(a.orbit, { autoAlpha: 0, duration: 0.2 }, 0);
        if (a.head) tl.to(a.head, { autoAlpha: 0, duration: 0.2 }, 0);
        if (a.body) tl.to(a.body, { autoAlpha: 0, duration: 0.2 }, 0);
      } else {
        if (a.backdrop) tl.to(a.backdrop, { autoAlpha: 0, scale: 1.03, duration: 0.6, ease: "power2.inOut" }, 0);
        if (a.orbit) {
          tl.to(a.orbit, { rotation: SWING * d, autoAlpha: 0, duration: 0.6, ease: "power2.inOut", force3D: true }, 0)
            .set(a.orbit, { rotation: 0 }, 0.61);
        }
        if (a.t1) tl.to(a.t1, { clipPath: HIDE_1, duration: 0.36, ease: "power2.in" }, 0);
        if (a.t2) tl.to(a.t2, { clipPath: HIDE_2, duration: 0.36, ease: "power2.in" }, 0.05);
        if (a.eye) tl.to(a.eye, { autoAlpha: 0, duration: 0.22 }, 0);
        if (a.head) tl.set(a.head, { autoAlpha: 0 }, 0.42);
        if (a.body) tl.to(a.body, { autoAlpha: 0, y: -8, duration: 0.28, ease: "power2.in" }, 0.04);
      }
    }

    if (toIsDual) {
      if (arcRef.current) tl.to(arcRef.current, { autoAlpha: 0, duration: 0.35 }, 0);
      const toDual = getDualRefs(dualMapRef.current, toIndex);
      if (toDual) {
        applyDualInstant(toDual, toStage);
        if (toDual.stage) {
          tl.fromTo(
            toDual.stage,
            { autoAlpha: 0, scale: 1.03 },
            { autoAlpha: 1, scale: 1, duration: 0.65, ease: "power3.out" },
            0.2
          );
        }
      }
    } else {
      const b = parts(toIndex);
      if (reducedMotion) {
        if (b.backdrop) tl.fromTo(b.backdrop, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 }, 0.05);
        if (b.orbit) tl.fromTo(b.orbit, { autoAlpha: 0, rotation: 0 }, { autoAlpha: 1, duration: 0.25 }, 0.05);
        if (b.head) {
          if (b.eye) gsap.set(b.eye, { autoAlpha: 1, y: 0 });
          if (b.t1) gsap.set(b.t1, { clipPath: SHOW });
          if (b.t2) gsap.set(b.t2, { clipPath: SHOW });
          tl.fromTo(b.head, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 }, 0.05);
        }
        if (b.body) {
          gsap.set(b.body.children, { autoAlpha: 1, y: 0 });
          tl.fromTo(b.body, { autoAlpha: 0, y: 0 }, { autoAlpha: 1, duration: 0.25 }, 0.05);
        }
        arc.current.a0 = rest[0];
        arc.current.a1 = rest[1];
        drawArc();
        if (arcRef.current) gsap.set(arcRef.current, { fill: tint, autoAlpha: 0.22 });
      } else {
        if (b.backdrop) {
          tl.fromTo(b.backdrop, { autoAlpha: 0, scale: 1.06 }, { autoAlpha: 1, scale: 1, duration: 0.85, ease: "power2.out" }, 0.05);
        }
        if (b.orbit) {
          tl.fromTo(
            b.orbit,
            { autoAlpha: 0, rotation: -SWING * d },
            { autoAlpha: 1, rotation: 0, duration: 0.9, ease: "power3.out", force3D: true },
            0.22
          );
        }
        if (b.head) tl.set(b.head, { autoAlpha: 1 }, 0.42);
        if (b.eye) tl.fromTo(b.eye, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.38, ease: "power2.out" }, 0.46);
        if (b.t1) tl.fromTo(b.t1, { clipPath: HIDE_1 }, { clipPath: SHOW, duration: 0.65, ease: "power3.out" }, 0.46);
        if (b.t2) tl.fromTo(b.t2, { clipPath: HIDE_2 }, { clipPath: SHOW, duration: 0.65, ease: "power3.out" }, 0.53);
        if (b.body) {
          tl.set(b.body, { autoAlpha: 1, y: 0 }, 0.36);
          tl.fromTo(
            b.body.children,
            { autoAlpha: 0, y: 12 },
            { autoAlpha: 1, y: 0, duration: 0.52, stagger: 0.08, ease: "power2.out" },
            0.36
          );
        }
        if (fromIsDual) {
          arc.current.a0 = rest[0];
          arc.current.a1 = rest[1];
          drawArc();
          if (arcRef.current) {
            gsap.set(arcRef.current, { fill: tint });
            tl.to(arcRef.current, { autoAlpha: 0.22, duration: 0.7, ease: "power2.out" }, 0.25);
          }
        } else {
          tl.to(arc.current, { a0: ARC_SWEEP[0], a1: ARC_SWEEP[1], duration: 0.56, ease: "power2.inOut", onUpdate: drawArc }, 0)
            .to(arc.current, { a0: rest[0], a1: rest[1], duration: 0.82, ease: "power3.out", onUpdate: drawArc }, 0.56);
          if (arcRef.current) {
            tl.to(arcRef.current, { fill: tint, autoAlpha: 0.22, duration: 0.9, ease: "power1.inOut" }, 0.1);
          }
        }
      }
    }

    shownRef.current = { index: toIndex, dualStage: toStage };
  }, [index, dualStage, n, fragrances]);

  useEffect(() => {
    return () => {
      tlRef.current?.progress(1).kill();
      if (gestureIdleTimerRef.current !== null) {
        window.clearTimeout(gestureIdleTimerRef.current);
      }
    };
  }, []);

  const select = (next: number, dir: 1 | -1, nextStage?: 0 | 1) => {
    const safeNext = wrapIndex(next, n);
    const hasDual = Boolean(fragrances[safeNext]?.dualFrame);
    const resolvedStage: 0 | 1 = hasDual ? (nextStage ?? 0) : 0;
    if (safeNext === indexRef.current && resolvedStage === dualStageRef.current) return;
    dirRef.current = dir;
    indexRef.current = safeNext;
    dualStageRef.current = resolvedStage;
    setSelectedNote(null);
    setIndex(safeNext);
    setDualStage(resolvedStage);
    onSlideChange?.(safeNext, resolvedStage);
  };

  useEffect(() => {
    if (typeof activeIndex !== "number") return;
    const safe = wrapIndex(activeIndex, n);
    if (safe !== indexRef.current) {
      const hasDual = Boolean(fragrances[safe]?.dualFrame);
      const nextSt: 0 | 1 = hasDual ? (activeStage ?? 0) : 0;
      select(safe, stepDirection(indexRef.current, safe, n), nextSt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, n]);

  useEffect(() => {
    if (activeStage === undefined) return;
    const hasDual = Boolean(fragrances[indexRef.current]?.dualFrame);
    const resolved: 0 | 1 = hasDual ? activeStage : 0;
    if (resolved !== dualStageRef.current) {
      select(indexRef.current, resolved === 1 ? 1 : -1, resolved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStage]);

  const handleBottleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.currentTarget.querySelector<HTMLElement>(".frg-tilt-wrap");
    if (!target) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const rx = (((e.clientY - rect.top) / rect.height) - 0.5) * -9;
    const ry = (((e.clientX - rect.left) / rect.width) - 0.5) * 11;
    target.style.setProperty("--tilt-rx", `${rx.toFixed(2)}deg`);
    target.style.setProperty("--tilt-ry", `${ry.toFixed(2)}deg`);
    target.style.setProperty("--tilt-scale", "1.02");
  };

  const handleBottleLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.currentTarget.querySelector<HTMLElement>(".frg-tilt-wrap");
    if (!target) return;
    target.style.setProperty("--tilt-rx", "0deg");
    target.style.setProperty("--tilt-ry", "0deg");
    target.style.setProperty("--tilt-scale", "1");
  };

  const go = (to: number, dir?: 1 | -1) => {
    if (n < 2) return;
    const next = wrapIndex(to, n);
    if (next === indexRef.current && fragrances[next]?.dualFrame) {
      const toggled: 0 | 1 = dualStageRef.current === 0 ? 1 : 0;
      select(next, toggled === 1 ? 1 : -1, toggled);
      return;
    }
    if (next === indexRef.current) return;
    select(next, dir ?? stepDirection(indexRef.current, next, n), 0);
  };

  const step = (d: 1 | -1) => {
    const currHasDual = Boolean(fragrances[indexRef.current]?.dualFrame);
    if (currHasDual) {
      if (d === 1 && dualStageRef.current === 0) {
        select(indexRef.current, 1, 1);
        return;
      }
      if (d === -1 && dualStageRef.current === 1) {
        select(indexRef.current, -1, 0);
        return;
      }
    }

    if (n < 2) return;
    const next = wrapIndex(indexRef.current + d, n);
    if (next === indexRef.current) return;
    const nextHasDual = Boolean(fragrances[next]?.dualFrame);
    const nextStage: 0 | 1 = nextHasDual && d === -1 ? 1 : 0;
    select(next, d, nextStage);
  };

  // Scroll & Touch Controller: Strictly 1 step per scroll gesture, immune to trackpad inertia tails
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const triggerLockedStep = (dir: 1 | -1, absDelta: number) => {
      lockUntilRef.current = performance.now() + 900;
      wheelAccumRef.current = 0;
      peakDeltaRef.current = absDelta;
      decayedLowRef.current = false;
      step(dir);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const absY = Math.abs(e.deltaY);
      const absX = Math.abs(e.deltaX);
      const delta = absY >= absX ? e.deltaY : e.deltaX;
      const absDelta = Math.abs(delta);
      const now = performance.now();

      if (absDelta >= 1.5) {
        if (gestureIdleTimerRef.current !== null) {
          window.clearTimeout(gestureIdleTimerRef.current);
        }
        gestureIdleTimerRef.current = window.setTimeout(() => {
          gestureActiveRef.current = false;
          wheelAccumRef.current = 0;
          peakDeltaRef.current = 0;
          decayedLowRef.current = false;
        }, 180);
      }

      if (absDelta > peakDeltaRef.current) {
        peakDeltaRef.current = absDelta;
      }
      if (absDelta < 8) {
        decayedLowRef.current = true;
      }

      if (now < lockUntilRef.current) {
        return;
      }

      const dir: 1 | -1 = delta > 0 ? 1 : -1;

      if (gestureActiveRef.current) {
        // Ongoing stream without a 180ms pause: ignore inertia tails completely unless
        // the inertia first decayed below 8 and a strong fresh flick (> 38) occurs or direction reversed.
        const isFreshPostDecayFlick = decayedLowRef.current && absDelta >= 38;
        const isDirectionReversal = dir !== lastWheelDirRef.current && absDelta >= 24;

        if (!isFreshPostDecayFlick && !isDirectionReversal) {
          return;
        }
      }

      // Accumulate small trackpad deltas so gentle single scrolls still trigger reliably
      if (Math.sign(wheelAccumRef.current) !== Math.sign(delta)) {
        wheelAccumRef.current = 0;
      }
      wheelAccumRef.current += delta;

      if (Math.abs(wheelAccumRef.current) < 16) {
        return;
      }

      gestureActiveRef.current = true;
      lastWheelDirRef.current = dir;
      triggerLockedStep(dir, absDelta);
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
      if (performance.now() < lockUntilRef.current) return;

      const dy = e.changedTouches[0].clientY - touchStartY;
      const dx = e.changedTouches[0].clientX - touchStartX;

      if (Math.abs(dy) > 30 && Math.abs(dy) >= Math.abs(dx)) {
        triggerLockedStep(dy < 0 ? 1 : -1, Math.abs(dy));
      } else if (Math.abs(dx) > 30) {
        triggerLockedStep(dx < 0 ? 1 : -1, Math.abs(dx));
      }
    };

    const onWindowKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        step(1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        step(-1);
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onWindowKeyDown);

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onWindowKeyDown);
    };
  }, [n]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    swipe.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    const s = swipe.current;
    swipe.current = null;
    if (!s || performance.now() < lockUntilRef.current) return;
    const dx = e.clientX - s.x;
    if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(e.clientY - s.y) * 1.3) {
      lockUntilRef.current = performance.now() + 760;
      step(dx < 0 ? 1 : -1);
    }
  };

  const activeHasDual = Boolean(fragrances[index]?.dualFrame);

  return (
    <div
      ref={rootRef}
      className={`frg-root ${className}`}
      role="region"
      aria-roledescription="carousel"
      aria-label="Popular Fragrances Orbit Carousel"
      tabIndex={0}
    >
      <style>{CSS_STYLES}</style>

      {/* Dynamic Per-Fragrance Atmospheric Backdrops (Standard Orbit Fragrances) */}
      <div className="frg-bd-layer" aria-hidden="true">
        {fragrances.map((f, i) => (
          <div
            key={f.id}
            ref={(el) => { backdrops.current[i] = el; }}
            className="frg-bd-item"
          >
            <img
              src={f.backdrop}
              alt=""
              className="frg-bd-img"
              draggable={false}
            />
            <div className="frg-bd-vignette" />
            <div className="frg-bd-wash" />
          </div>
        ))}
      </div>

      {/* Dual-Frame Scroll Reveal Stages (Oud Maracujá & Vintage Tobacco) */}
      {fragrances.map((f, i) => {
        if (!f.dualFrame) return null;
        const df = f.dualFrame;
        const titleSize = fitSize(f.name.length, 84, 880, 0.78);

        return (
          <div
            key={f.id}
            ref={(el) => { ensureDualHandle(i).stage = el; }}
            className={`frg-oud-stage ${index === i ? "frg-oud-stage--active" : ""} ${
              index === i && dualStage === 0 ? "frg-oud-stage--f1" : "frg-oud-stage--f2"
            }`}
            aria-hidden={index !== i}
          >
            <div
              ref={(el) => { ensureDualHandle(i).bg1 = el; }}
              className="frg-oud-bg1"
              style={{ background: df.bg1 }}
            />
            <div
              ref={(el) => { ensureDualHandle(i).bg2 = el; }}
              className="frg-oud-bg2"
              style={{ background: df.bg2 }}
            />

            <div className="frg-oud-frame">
              {/* Editorial Top Title (Frame 1) */}
              <div
                ref={(el) => { ensureDualHandle(i).titleWrap = el; }}
                className="frg-oud-title-wrap"
              >
                <p className="frg-oud-eyebrow">
                  {f.brand} • {f.eyebrow ?? "Extrait de Parfum"}
                </p>
                <h2 className="frg-oud-title" style={{ fontSize: `${titleSize}px` }}>
                  {f.name}
                </h2>
              </div>

              {/* Frame 1 Centered Studio Bottle (click to reveal notes + subtle 3D tilt) */}
              <div
                ref={(el) => { ensureDualHandle(i).bottle1 = el; }}
                className={`frg-oud-bottle-1 ${index === i && dualStage === 0 ? "frg-oud-bottle-1--clickable" : ""}`}
                onClick={() => {
                  if (index === i && dualStage === 0) select(i, 1, 1);
                }}
                onPointerMove={handleBottleMove}
                onPointerLeave={handleBottleLeave}
                title={index === i && dualStage === 0 ? "Click bottle to reveal scent notes" : undefined}
              >
                <div className="frg-tilt-wrap">
                  <img
                    src={df.frame1Image}
                    alt={`${f.brand} ${f.name} bottle`}
                    draggable={false}
                  />
                </div>
              </div>

              {/* Frame 2 Right-Side Cutout Bottle (subtle 3D tilt) */}
              <div
                ref={(el) => { ensureDualHandle(i).f2Bottle = el; }}
                className="frg-oud-f2-bottle"
                onPointerMove={handleBottleMove}
                onPointerLeave={handleBottleLeave}
              >
                <div className="frg-oud-f2-bottle-aura" style={{ background: df.auraBg }} />
                <div className="frg-oud-f2-bottle-floor" style={{ background: df.floorBg }} />
                <div className="frg-tilt-wrap">
                  <img
                    src={df.bottle2Image}
                    alt={`${f.brand} ${f.name} flacon`}
                    draggable={false}
                  />
                </div>
              </div>

              {/* Gold Architectural Callout Arrows Drawing From Bottle to Note Tiers */}
              <svg className="frg-oud-arrows" viewBox="0 0 1024 576" aria-hidden="true">
                {CALLOUT_ARROWS.map((arrow, idx) => (
                  <g key={arrow.id}>
                    <path
                      ref={(el) => { ensureDualHandle(i).arrowPaths[idx] = el; }}
                      className="frg-oud-arrow-line"
                      d={arrow.d}
                    />
                    <g ref={(el) => { ensureDualHandle(i).arrowEnds[idx] = el; }}>
                      <circle className="frg-oud-arrow-ring" cx={arrow.ax} cy={arrow.ay} r="6.5" />
                      <circle className="frg-oud-arrow-dot" cx={arrow.ax} cy={arrow.ay} r="2.6" />
                      <path className="frg-oud-arrow-line" d={arrow.tip} />
                    </g>
                  </g>
                ))}
              </svg>

              {/* Animated Interactive Note Medallions & Names */}
              <div className="frg-oud-tiers">
                {df.noteTiers.map((tier, tierIdx) => {
                  const shortTier = tier.id === "top" ? "Top Note" : tier.id === "mid" ? "Heart Note" : "Base Note";
                  return (
                    <div key={tier.id} className="frg-oud-tier">
                      <div
                        ref={(el) => { ensureDualHandle(i).tierHeads[tierIdx] = el; }}
                        className="frg-oud-tier-head"
                      >
                        <span className="frg-oud-tier-rule" />
                        <h3 className="frg-oud-tier-title">{tier.label}</h3>
                        <span className="frg-oud-tier-rule frg-oud-tier-rule--right" />
                      </div>

                      <div className="frg-oud-note-row">
                        {tier.notes.map((note, noteIdx) => {
                          const isNoteActive =
                            selectedNote?.fragranceIndex === i && selectedNote?.name === note.name;
                          return (
                            <button
                              key={note.name}
                              type="button"
                              ref={(el) => { ensureDualHandle(i).notes[tier.id][noteIdx] = el; }}
                              className={`frg-oud-note-item ${isNoteActive ? "frg-oud-note-item--active" : ""}`}
                              style={{ "--note-delay": `${(tierIdx * 4 + noteIdx) * 0.25}s` } as React.CSSProperties}
                              onClick={() =>
                                setSelectedNote((prev) =>
                                  prev?.fragranceIndex === i && prev?.name === note.name
                                    ? null
                                    : {
                                        fragranceIndex: i,
                                        name: note.name,
                                        tierLabel: shortTier,
                                        story: getNoteStory(note.name),
                                      }
                                )
                              }
                              aria-pressed={isNoteActive}
                              title={`Explore ${note.name}`}
                            >
                              <div className="frg-oud-note-ring">
                                <div className="frg-oud-note-inner">
                                  <img src={note.image} alt={note.name} draggable={false} />
                                </div>
                              </div>
                              <span className="frg-oud-note-name">{note.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div
                ref={(el) => { ensureDualHandle(i).wearPill = el; }}
                className="frg-oud-wear-pill"
              >
                {selectedNote && selectedNote.fragranceIndex === i ? (
                  <>
                    <strong>{selectedNote.tierLabel} · {selectedNote.name}</strong>
                    <span>{selectedNote.story}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedNote(null)}
                      aria-label="Close note details"
                      className="frg-btn ml-1 opacity-60 hover:opacity-100"
                    >
                      <X size={11} />
                    </button>
                  </>
                ) : (
                  <>
                    <Clock size={12} className="text-[#c6a15b] shrink-0" />
                    <strong>When to Wear</strong>
                    <span>{f.wearSummary}</span>
                    <span className="frg-oud-wear-hint">Tap any note</span>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Eye-Level Scent Index (Left Side, collapses to minimal vertical dots when Frame 2 Notes open) */}
      <div
        className={`frg-pager ${activeHasDual && dualStage === 1 ? "frg-pager--compact" : ""}`}
        role="tablist"
        aria-label="Select Fragrance"
      >
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
            <span className="frg-pager-num">0{i + 1}</span>
            <span className="frg-pager-name">{f.label ?? f.name}</span>
          </button>
        ))}
      </div>

      <div className="frg-canvas">
        {/* Curved Morphing Background Arc */}
        <svg className="frg-arc" viewBox="0 0 960 520" aria-hidden="true">
          <path ref={arcRef} style={{ opacity: 0.22 }} />
        </svg>

        {/* Orbiting Perfume Bottles (Standard Orbit Fragrances) */}
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
              aria-hidden={i !== index || Boolean(f.dualFrame)}
            >
              <img
                src={f.image}
                alt={f.alt ?? `${f.brand} ${f.name}`}
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* Perfume Name + Notes + When to Wear (Standard Orbit Fragrances) */}
        <div className="frg-info">
          <div className="frg-head" aria-live="polite">
            {fragrances.map((f, i) => (
              <div
                key={f.id}
                ref={(el) => { heads.current[i] = el; }}
                className="frg-hd"
                aria-hidden={i !== index || Boolean(f.dualFrame)}
              >
                <p className="frg-eye">{f.eyebrow ?? `#${i + 1} ICONIC FRAGRANCE`}</p>
                <h2 style={{ margin: 0, font: "inherit" }}>
                  <span
                    className="frg-t1"
                    style={{ fontSize: fitSize(f.brand.length, 28, 480, 0.62) + "px" }}
                  >
                    {f.brand}
                  </span>
                  <span
                    className="frg-t2"
                    style={{ fontSize: fitSize(f.name.length, 44, 480, 0.64) + "px" }}
                  >
                    {f.name}
                  </span>
                </h2>
              </div>
            ))}
          </div>

          <div className="frg-details">
            {fragrances.map((f, i) => {
              const seasons = [
                { key: "winter", label: "Winter", icon: Snowflake, value: f.whenToWear.winter },
                { key: "spring", label: "Spring", icon: Leaf, value: f.whenToWear.spring },
                { key: "summer", label: "Summer", icon: Sun, value: f.whenToWear.summer },
                { key: "fall", label: "Fall", icon: Leaf, value: f.whenToWear.fall }
              ];
              const times = [
                { key: "day", label: "Day", icon: Sun, value: f.whenToWear.day },
                { key: "night", label: "Night", icon: Moon, value: f.whenToWear.night }
              ];

              return (
                <div
                  key={f.id}
                  ref={(el) => { bodies.current[i] = el; }}
                  className="frg-body"
                  aria-hidden={i !== index || Boolean(f.dualFrame)}
                >
                  <div className="frg-section">
                    <div className="frg-section-head">
                      <h3 className="frg-section-title">Olfactory Notes</h3>
                    </div>
                    <ul className="frg-notes">
                      {f.notes.map((note) => (
                        <li key={note}>{note}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="frg-section">
                    <div className="frg-section-head">
                      <h3 className="frg-section-title">
                        <Clock size={12} />
                        <span>When to Wear</span>
                      </h3>
                      <span className="frg-section-sub">{f.wearSummary}</span>
                    </div>
                    <div className="frg-wear-grid">
                      {seasons.map((item) => {
                        const Icon = item.icon;
                        const isDominant = item.value >= 60;
                        return (
                          <div key={item.key} className="frg-wear-item">
                            <div className={`frg-wear-icon ${isDominant ? "frg-wear-icon--active" : ""}`}>
                              <Icon size={15} strokeWidth={1.6} />
                            </div>
                            <span className={`frg-wear-label ${isDominant ? "frg-wear-label--active" : ""}`}>
                              {item.label}
                            </span>
                            <div className="frg-wear-bar-track">
                              <div
                                className={`frg-wear-bar-fill ${isDominant ? "frg-wear-bar-fill--active" : ""}`}
                                style={{ width: `${Math.max(10, Math.min(100, item.value))}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                      {times.map((item) => {
                        const Icon = item.icon;
                        const isDominant = item.value >= 60;
                        return (
                          <div key={item.key} className="frg-wear-item frg-wear-item--time">
                            <div className={`frg-wear-icon ${isDominant ? "frg-wear-icon--active" : ""}`}>
                              <Icon size={15} strokeWidth={1.6} />
                            </div>
                            <span className={`frg-wear-label ${isDominant ? "frg-wear-label--active" : ""}`}>
                              {item.label}
                            </span>
                            <div className="frg-wear-bar-track">
                              <div
                                className={`frg-wear-bar-fill ${isDominant ? "frg-wear-bar-fill--active" : ""}`}
                                style={{ width: `${Math.max(10, Math.min(100, item.value))}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Minimalist Bottle / Notes Toggle + Next Step Pill (Standalone fallback) */}
      {showStageControls && (
        <div className="frg-stage-dock" role="group" aria-label="View stage controls">
          {activeHasDual && (
            <>
              <button
                type="button"
                className={`frg-btn frg-stage-tab ${dualStage === 0 ? "frg-stage-tab--active" : ""}`}
                onClick={() => select(index, -1, 0)}
                aria-pressed={dualStage === 0}
              >
                Bottle
              </button>
              <button
                type="button"
                className={`frg-btn frg-stage-tab ${dualStage === 1 ? "frg-stage-tab--active" : ""}`}
                onClick={() => select(index, 1, 1)}
                aria-pressed={dualStage === 1}
              >
                Notes
              </button>
            </>
          )}
          <button
            type="button"
            className="frg-btn frg-stage-next"
            onClick={() => step(1)}
            aria-label={activeHasDual && dualStage === 0 ? "Reveal fragrance notes" : "Next fragrance"}
            title="Next (Scroll or Arrow Down)"
          >
            <ChevronDown size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

export default FragranceOrbitCarousel;
