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
  "fruity notes": "/images/notes/mediterranean_fruit_basket.jpg",
  "fruit notes": "/images/notes/mediterranean_fruit_basket.jpg",
  "indonesian nutmeg": "/images/notes/nutmeg.png",
  "italian lemon": "/images/notes/lemon.jpg",
  "italian mandarin orange": "/images/notes/mandarin_orange.png",
  "madagascar black pepper": "/images/notes/black_pepper.png",
  "oak moss": "/images/notes/oakmoss.jpg",
  "pink grapefruit": "/images/notes/grapefruit.png",
  "rose de mai": "/images/notes/rose.jpg",
  "red cedar": "/images/notes/cedar.jpg",
  "white cedar": "/images/notes/cedar.jpg",
};

/**
 * Shared local note-image lookup and visual fallback.
 * Null entries mean the current file was reviewed and should not be shown as that note.
 */

// Fallback luxury icons
const FALLBACK_ICON = (
  <svg viewBox="0 0 48 48" className="w-full h-full" aria-hidden="true">
    <circle cx="24" cy="24" r="21" fill="#211c14" stroke="#8f7544" strokeWidth="1.5" />
    <path d="M12 31c9-1 18-8 23-17 2 12-4 23-15 24-4 0-7-3-8-7Z" fill="#60744b" stroke="#d1b16c" strokeWidth="1.7" strokeLinejoin="round" />
    <path d="M14 35c5-7 11-12 19-18" fill="none" stroke="#e0c78b" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="16" cy="15" r="1.6" fill="#d8bd82" opacity=".75" />
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
