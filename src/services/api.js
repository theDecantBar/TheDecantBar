const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
const DEFAULT_PRODUCTS_CACHE_TTL_MS = 60_000;

const productsCache = new Map();
const inFlightRequests = new Map();

function buildProductsQuery({ search, category, gender, weather } = {}) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (category) params.set("category", category);
  if (gender) params.set("gender", gender);
  if (weather) params.set("weather", weather);
  return params.toString();
}

/**
 * Clear cached catalog responses (e.g. after admin inventory/product mutations).
 */
export function invalidateProductsCache() {
  productsCache.clear();
}

/**
 * Fetch products from the backend with in-flight request deduplication
 * and short-lived in-memory caching across storefront views.
 * @returns {Promise<Array>} Array of product objects with variants
 */
export async function getProducts(options = {}) {
  const {
    search = "",
    category = "",
    gender = "",
    weather = "",
    force = false,
    maxAgeMs = DEFAULT_PRODUCTS_CACHE_TTL_MS,
  } = options;

  const query = buildProductsQuery({ search, category, gender, weather });
  const now = Date.now();

  if (!force) {
    const cached = productsCache.get(query);
    if (cached && now - cached.timestamp < maxAgeMs) {
      return cached.data;
    }

    if (inFlightRequests.has(query)) {
      return inFlightRequests.get(query);
    }
  }

  const url = query ? `${API_BASE_URL}/products?${query}` : `${API_BASE_URL}/products`;

  const requestPromise = (async () => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error("Unexpected products response");
      }
      productsCache.set(query, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.error("Failed to fetch products from API:", error.message);
      throw error;
    } finally {
      inFlightRequests.delete(query);
    }
  })();

  inFlightRequests.set(query, requestPromise);
  return requestPromise;
}
