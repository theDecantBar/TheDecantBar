import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { DEFAULT_OFFERS } from "../utils/shipping";

const OffersContext = createContext({
  offers: DEFAULT_OFFERS,
  refreshOffers: async () => {},
  applyOffersSnapshot: () => {},
});

function parseOffersData(data) {
  return {
    freeShippingThreshold: Number(data.freeShippingThreshold ?? 499),
    standardShippingFee: Number(data.standardShippingFee ?? 80),
    discountActive: Boolean(data.discountActive ?? true),
    discountPercent: Number(data.discountPercent ?? 10),
    discountMinSubtotal: Number(data.discountMinSubtotal ?? 999),
    banners: Array.isArray(data.banners) ? data.banners : DEFAULT_OFFERS.banners,
  };
}

export function OffersProvider({ children }) {
  const [offers, setOffers] = useState(DEFAULT_OFFERS);

  const refreshOffers = useCallback(async () => {
    try {
      const res = await fetch("/api/offers", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (data && typeof data === "object") {
        setOffers(parseOffersData(data));
      }
    } catch {
      // Keep default fallback silently if backend unavailable
    }
  }, []);

  const applyOffersSnapshot = useCallback((nextConfig) => {
    if (!nextConfig || typeof nextConfig !== "object") return;
    setOffers({
      ...parseOffersData(nextConfig),
      banners: Array.isArray(nextConfig.banners)
        ? nextConfig.banners.filter((b) => b.active !== false)
        : DEFAULT_OFFERS.banners,
    });
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/offers", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data && typeof data === "object") {
          setOffers(parseOffersData(data));
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return (
    <OffersContext.Provider value={{ offers, refreshOffers, applyOffersSnapshot }}>
      {children}
    </OffersContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useOffers() {
  return useContext(OffersContext);
}
