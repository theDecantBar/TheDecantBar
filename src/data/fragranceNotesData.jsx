import localNotesMap from "./localNotesMap.json";

// Catalog spelling variants resolve explicitly without exposing duplicate picker options.
const NOTE_IMAGE_ALIASES = {
  citron: "/images/notes/citron.png",
  coconut: "/images/notes/coconut.png",
  chocolate: "/images/notes/dark_chocolate.png",
  "dark chocolate": "/images/notes/dark_chocolate.png",
  "ebony tree": "/images/notes/ebony_tree.png",
  lilac: "/images/notes/lilac.png",
  orris: "/images/notes/orris_root.png",
  "palo santo": "/images/notes/palo_santo.png",
  tonka: "/images/notes/tonka_bean.png",
  vervain: "/images/notes/vervain.png",
  "woodsy notes": "/images/notes/woody_notes.png",
  "white floral": "/images/notes/white_flowers.jpg",
  "coriander seed": "/images/notes/coriander.jpg",
  "indonesian nutmeg": "/images/notes/nutmeg.png",
  "italian lemon": "/images/notes/lemon.jpg",
  "italian mandarin orange": "/images/notes/mandarin_orange.png",
  "madagascar black pepper": "/images/notes/black_pepper.png",
  "oak moss": "/images/notes/oakmoss.jpg",
  "pink grapefruit": "/images/notes/grapefruit.png",
  "rose de mai": "/images/notes/rose.jpg",
  "white cedar": "/images/notes/cedar.jpg",
};

/**
 * Shared local note-image lookup and visual fallback.
 * Null entries mean the current file was reviewed and should not be shown as that note.
 */

// Fallback luxury icons
const FALLBACK_ICON = (
  <svg viewBox="0 0 48 48" className="w-full h-full">
    <defs>
      <radialGradient id="lux-gold-drop" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="60%" stopColor="#c6a15b" />
        <stop offset="100%" stopColor="#785922" />
      </radialGradient>
    </defs>
    <path d="M24 10 C24 10, 14 24, 14 31 C14 36.5, 18.5 41, 24 41 C29.5 41, 34 36.5, 34 31 C34 24, 24 10, 24 10 Z" fill="url(#lux-gold-drop)" />
    <circle cx="21" cy="27" r="3" fill="#fff" opacity="0.4" />
  </svg>
);

const formatNoteName = (name) => name.replace(/\b\w/g, (letter) => letter.toUpperCase());

// This local map is shared by the storefront and the admin note picker.
export const NOTE_IMAGE_OPTIONS = Object.keys(localNotesMap)
  .filter((name) => !name.includes("("))
  .filter((name) => name !== "blackcurrant")
  .map((name) => ({ name: name === "black currant" ? "Black Currant" : formatNoteName(name), key: name, imageUrl: localNotesMap[name] }))
  .sort((a, b) => a.name.localeCompare(b.name));

/**
 * Resolve note visual data (local photograph URL + fallback icon) based on note name
 */
export function getNoteVisual(name = "") {
  if (!name || typeof name !== "string") {
    return { imageUrl: null, fallbackIcon: FALLBACK_ICON };
  }
  const clean = name.toLowerCase().trim();

  // An explicit null means the current asset was reviewed and should not be shown.
  if (Object.prototype.hasOwnProperty.call(localNotesMap, clean) && !localNotesMap[clean]) {
    return { imageUrl: null, fallbackIcon: FALLBACK_ICON };
  }

  // 1. Direct match in localNotesMap
  if (localNotesMap[clean]) {
    return {
      imageUrl: localNotesMap[clean],
      fallbackIcon: FALLBACK_ICON,
    };
  }

  if (NOTE_IMAGE_ALIASES[clean]) {
    return { imageUrl: NOTE_IMAGE_ALIASES[clean], fallbackIcon: FALLBACK_ICON };
  }

  // 2. Safe normalized slug in /images/notes/
  const safeSlug = clean.replace(/[^a-z0-9]/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "");
  if (localNotesMap[safeSlug]) {
    return {
      imageUrl: localNotesMap[safeSlug],
      fallbackIcon: FALLBACK_ICON,
    };
  }

  if (Object.prototype.hasOwnProperty.call(localNotesMap, safeSlug) && !localNotesMap[safeSlug]) {
    return { imageUrl: null, fallbackIcon: FALLBACK_ICON };
  }

  // Require an explicit verified mapping; partial matches can show a different ingredient.
  return {
    imageUrl: null,
    fallbackIcon: FALLBACK_ICON,
  };
}
