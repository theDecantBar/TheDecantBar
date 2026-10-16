import React from "react";
import localNotesMap from "./localNotesMap.json";

/**
 * Authentic Fragrantica ingredient photographs & fallback luxury vector graphics.
 * All 185 fragrance notes map directly to verified local high-resolution ingredient photographs.
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

const sortedMapKeys = Object.keys(localNotesMap).sort((a, b) => b.length - a.length);

/**
 * Resolve note visual data (local photograph URL + fallback icon) based on note name
 */
export function getNoteVisual(name = "") {
  const clean = name.toLowerCase().trim();

  // 1. Direct match in localNotesMap
  if (localNotesMap[clean]) {
    return {
      imageUrl: localNotesMap[clean],
      fallbackIcon: FALLBACK_ICON,
    };
  }

  // 2. Safe normalized slug in /images/notes/
  const safeSlug = clean.replace(/[^a-z0-9]/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "");
  if (localNotesMap[safeSlug]) {
    return {
      imageUrl: localNotesMap[safeSlug],
      fallbackIcon: FALLBACK_ICON,
    };
  }

  // 3. Substring match against verified local ingredient map
  for (const key of sortedMapKeys) {
    if (clean.includes(key)) {
      return {
        imageUrl: localNotesMap[key],
        fallbackIcon: FALLBACK_ICON,
      };
    }
  }

  // 4. Direct filesystem path fallback
  return {
    imageUrl: `/images/notes/${safeSlug}.jpg`,
    fallbackIcon: FALLBACK_ICON,
  };
}
