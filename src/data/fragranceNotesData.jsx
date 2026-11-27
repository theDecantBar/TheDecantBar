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
  "granny smith apple": "/images/notes/green_apple.jpg",
  "granny smith": "/images/notes/green_apple.jpg",
  "dry wood": "/images/notes/woody_notes.png",
  "dry woods": "/images/notes/woody_notes.png",
  "caramel": "/images/notes/toffee_caramel.jpg",
  "indonesian patchouli": "/images/notes/indian_patchouli.jpg",
  "rosyfolia": "/images/notes/damascena_rose.jpg",
  "cocoapulse™": "/images/notes/cocoa.png",
  "maple": "/images/showcase/maple_note.jpg",
  "ambrofix™": "/images/notes/ambrofix.jpg",
  "oak": "/images/notes/oak_wood.jpg",
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

// In-memory registry for dynamically added custom notes during admin sessions
const customNotesRegistry = new Map();

export const formatNoteName = (name) => {
  if (!name || typeof name !== "string") return "";
  const minorWords = new Set(["of", "the", "de", "and", "or", "in"]);
  return name
    .trim()
    .split(/\s+/)
    .map((word, wIdx) => {
      return word
        .split("-")
        .map((part, pIdx) => {
          const lower = part.toLowerCase();
          if (wIdx > 0 && pIdx > 0 && minorWords.has(lower)) return lower;
          return lower.charAt(0).toUpperCase() + lower.slice(1);
        })
        .join("-");
    })
    .join(" ");
};

export function registerCustomNote(rawName, imageUrl = null) {
  if (!rawName || typeof rawName !== "string") return;
  const clean = rawName.toLowerCase().trim();
  if (!clean) return;

  if (customNotesRegistry.has(clean)) {
    if (imageUrl) {
      const existing = customNotesRegistry.get(clean);
      existing.imageUrl = imageUrl;
      customNotesRegistry.set(clean, existing);
    }
  } else {
    const visual = getNoteVisual(clean);
    customNotesRegistry.set(clean, {
      name: formatNoteName(clean),
      key: clean,
      imageUrl: imageUrl || visual.imageUrl || null,
    });
  }
}

export function updateNoteImageInRegistry(rawName, newImageUrl) {
  if (!rawName) return;
  const clean = rawName.toLowerCase().trim();
  const current = customNotesRegistry.get(clean) || {
    name: formatNoteName(clean),
    key: clean,
  };
  current.imageUrl = newImageUrl;
  customNotesRegistry.set(clean, current);
}

export function registerAllCustomNotes(notesList = []) {
  if (!Array.isArray(notesList)) return;
  for (const n of notesList) {
    if (n && n.name) {
      registerCustomNote(n.name, n.imageUrl || n.image_url);
    }
  }
}

export function getAvailableNoteOptions() {
  const baseMap = new Map();

  // Add all static options from localNotesMap
  for (const [key, url] of Object.entries(localNotesMap)) {
    if (key.includes("(") || key === "blackcurrant") continue;
    const displayName = key === "black currant" ? "Black Currant" : formatNoteName(key);
    baseMap.set(key.toLowerCase(), {
      name: displayName,
      key: key.toLowerCase(),
      imageUrl: url || null,
    });
  }

  // Merge any dynamically registered or replaced custom notes
  for (const [key, noteObj] of customNotesRegistry.entries()) {
    if (baseMap.has(key)) {
      if (noteObj.imageUrl) {
        baseMap.set(key, { ...baseMap.get(key), imageUrl: noteObj.imageUrl });
      }
    } else {
      baseMap.set(key, noteObj);
    }
  }

  return Array.from(baseMap.values()).sort((a, b) => a.name.localeCompare(b.name));
}

// This local map is shared by the storefront and the admin note picker.
export const NOTE_IMAGE_OPTIONS = getAvailableNoteOptions();

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

  // 1. Dynamically registered or replaced custom notes (checked first so admin overrides take effect)
  if (customNotesRegistry.has(clean)) {
    const custom = customNotesRegistry.get(clean);
    if (custom?.imageUrl) {
      return { imageUrl: custom.imageUrl, fallbackIcon: FALLBACK_ICON };
    }
  }

  // 2. Direct match in localNotesMap
  if (localNotesMap[clean]) {
    return {
      imageUrl: localNotesMap[clean],
      fallbackIcon: FALLBACK_ICON,
    };
  }

  if (NOTE_IMAGE_ALIASES[clean]) {
    return { imageUrl: NOTE_IMAGE_ALIASES[clean], fallbackIcon: FALLBACK_ICON };
  }

  // 3. Safe normalized slug in /images/notes/
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
