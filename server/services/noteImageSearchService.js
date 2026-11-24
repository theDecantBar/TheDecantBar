/**
 * Fragrance Note Image Search Service
 *
 * Supports Unsplash API, Pexels API, and an encyclopedic Wikimedia Commons
 * Botanical fallback that works 100% out-of-the-box with zero required API keys.
 * API keys are kept strictly on the backend in environment variables.
 */

const USER_AGENT = "TheDecantBar/1.0 (https://thedecantbar.com; contact@thedecantbar.com)";

/**
 * Refines a fragrance note name into effective botanical / ingredient search terms.
 */
function getRefinedQueries(noteName) {
  const clean = noteName.trim();
  const lower = clean.toLowerCase();

  const queries = [];

  // 1. Direct query
  queries.push(clean);

  // 2. Context-specific refinements
  if (lower.includes("flower") || lower.includes("blossom") || lower.includes("leaf") || lower.includes("wood")) {
    queries.push(`${clean} botanical`);
  } else {
    // Check common fragrance categories
    const isFlower = /orchid|rose|jasmine|lilac|narcissus|iris|neroli|tuberose|magnolia|violet|lily|lotus|gardenia|carnation|peony|freesia|lavender|osmanthus/i.test(lower);
    const isFruit = /apricot|apple|peach|pear|plum|fig|cherry|orange|lemon|bergamot|grapefruit|mandarin|mango|pineapple|berry|coconut/i.test(lower);
    const isHerb = /lemongrass|mint|basil|rosemary|thyme|sage|tea|eucalyptus|patchouli/i.test(lower);
    const isWood = /cedar|sandalwood|oud|agarwood|oak|cypress|pine|birch|guaiac|vetiver/i.test(lower);
    const isSpice = /cinnamon|cardamom|pepper|clove|nutmeg|vanilla|saffron|ginger|cumin/i.test(lower);

    if (isFlower) queries.push(`${clean} flower`);
    else if (isFruit) queries.push(`${clean} fruit`);
    else if (isHerb) queries.push(`${clean} plant`);
    else if (isWood) queries.push(`${clean} wood`);
    else if (isSpice) queries.push(`${clean} spice`);

    queries.push(`${clean} plant botanical`);
  }

  return [...new Set(queries)];
}

/**
 * Search Unsplash API if UNSPLASH_ACCESS_KEY is configured
 */
async function searchUnsplash(query) {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) return null;

  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=8&orientation=squarish`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
        "User-Agent": USER_AGENT,
      },
    });

    if (!res.ok) {
      console.warn(`Unsplash API HTTP error ${res.status}:`, await res.text().catch(() => ""));
      return null;
    }

    const data = await res.json();
    const photos = data.results || [];

    return photos.map((p) => ({
      id: `unsplash_${p.id}`,
      title: p.alt_description || p.description || query,
      previewUrl: p.urls.small || p.urls.thumb,
      fullUrl: p.urls.regular || p.urls.full,
      width: p.width,
      height: p.height,
      source: "Unsplash",
      photographer: p.user?.name,
      photographerUrl: p.user?.links?.html,
    }));
  } catch (err) {
    console.warn("Unsplash search exception:", err.message);
    return null;
  }
}

/**
 * Search Pexels API if PEXELS_API_KEY is configured
 */
async function searchPexels(query) {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) return null;

  try {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=8&orientation=square`;
    const res = await fetch(url, {
      headers: {
        Authorization: apiKey,
        "User-Agent": USER_AGENT,
      },
    });

    if (!res.ok) {
      console.warn(`Pexels API HTTP error ${res.status}:`, await res.text().catch(() => ""));
      return null;
    }

    const data = await res.json();
    const photos = data.photos || [];

    return photos.map((p) => ({
      id: `pexels_${p.id}`,
      title: p.alt || query,
      previewUrl: p.src.medium || p.src.small,
      fullUrl: p.src.large2x || p.src.original,
      width: p.width,
      height: p.height,
      source: "Pexels",
      photographer: p.photographer,
      photographerUrl: p.photographer_url,
    }));
  } catch (err) {
    console.warn("Pexels search exception:", err.message);
    return null;
  }
}

/**
 * Search Wikimedia Commons Botanical / Encyclopedia repository.
 * Zero-config, open-access, reliable images for virtually any ingredient.
 */
async function searchWikimedia(queries) {
  const queryList = Array.isArray(queries) ? queries : [queries];
  const allCandidates = [];
  const seenIds = new Set();

  for (const q of queryList) {
    if (allCandidates.length >= 6) break;

    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q)}&gsrlimit=12&gsrnamespace=6&prop=imageinfo&iiprop=url|size|mime&iiurlwidth=500&format=json&origin=*`;

    try {
      const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
      if (!res.ok) continue;

      const data = await res.json();
      const pages = data.query?.pages || {};

      for (const page of Object.values(pages)) {
        if (seenIds.has(page.pageid)) continue;

        const info = page.imageinfo?.[0];
        if (!info?.url) continue;

        const mime = (info.mime || "").toLowerCase();
        if (!mime.startsWith("image/jpeg") && !mime.startsWith("image/png") && !mime.startsWith("image/webp")) {
          continue;
        }

        const rawTitle = (page.title || "").toLowerCase();
        // Filter out non-photo assets
        if (
          rawTitle.includes("flag") ||
          rawTitle.includes("logo") ||
          rawTitle.includes("map") ||
          rawTitle.includes("coat_of_arms") ||
          rawTitle.includes("diagram") ||
          rawTitle.includes("seal_of") ||
          rawTitle.includes("icon")
        ) {
          continue;
        }

        seenIds.add(page.pageid);
        const cleanTitle = page.title.replace(/^File:/i, "").replace(/\.[^.]+$/, "").replace(/_/g, " ");

        allCandidates.push({
          id: `wiki_${page.pageid}`,
          title: cleanTitle,
          previewUrl: info.thumburl || info.url,
          fullUrl: info.thumburl || info.url,
          width: info.width || 500,
          height: info.height || 500,
          source: "Wikimedia Commons",
        });

        if (allCandidates.length >= 8) break;
      }
    } catch (e) {
      console.warn("Wikimedia search error for query", q, e.message);
    }
  }

  return allCandidates;
}

/**
 * Main search function: Orchestrates Unsplash, Pexels, and Wikimedia Commons.
 */
export async function searchNoteImages(noteName, customQuery = null) {
  if (!noteName || typeof noteName !== "string") {
    return { query: "", provider: "none", candidates: [] };
  }

  const queryToUse = customQuery && typeof customQuery === "string" && customQuery.trim()
    ? customQuery.trim()
    : noteName.trim();

  // 1. Try Unsplash if configured
  if (process.env.UNSPLASH_ACCESS_KEY) {
    const unsplashResults = await searchUnsplash(queryToUse);
    if (unsplashResults && unsplashResults.length > 0) {
      return {
        query: queryToUse,
        provider: "Unsplash",
        candidates: unsplashResults.slice(0, 8),
      };
    }
  }

  // 2. Try Pexels if configured
  if (process.env.PEXELS_API_KEY) {
    const pexelsResults = await searchPexels(queryToUse);
    if (pexelsResults && pexelsResults.length > 0) {
      return {
        query: queryToUse,
        provider: "Pexels",
        candidates: pexelsResults.slice(0, 8),
      };
    }
  }

  // 3. Fallback / Zero-Config: Wikimedia Commons Botanical Search
  const searchQueries = customQuery ? [customQuery] : getRefinedQueries(queryToUse);
  const wikiResults = await searchWikimedia(searchQueries);

  return {
    query: queryToUse,
    provider: "Wikimedia Commons (Open Botanical)",
    candidates: wikiResults.slice(0, 8),
  };
}
