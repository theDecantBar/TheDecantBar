import { getOffersConfig, saveOffersConfig } from "../services/offersService.js";

// @desc    Get active store offers and shipping/discount rules
// @route   GET /api/offers
// @access  Public
export async function getPublicOffers(_req, res) {
  try {
    const config = await getOffersConfig();
    res.json({
      ...config,
      banners: config.banners.filter((b) => b.active !== false),
    });
  } catch (err) {
    console.error("Failed to fetch public offers:", err.message);
    res.status(500).json({ message: "Unable to load store offers." });
  }
}

// @desc    Get full store offers config for Admin management
// @route   GET /api/admin/offers
// @access  Private/Admin
export async function getAdminOffers(_req, res) {
  try {
    const config = await getOffersConfig({ bypassCache: true });
    res.json(config);
  } catch (err) {
    console.error("Failed to fetch admin offers:", err.message);
    res.status(500).json({ message: "Unable to load offers configuration." });
  }
}

// @desc    Update store offers config and sliding banners
// @route   PUT /api/admin/offers
// @access  Private/Admin
export async function updateAdminOffers(req, res) {
  try {
    const saved = await saveOffersConfig(req.body || {});
    res.json({
      message: "Store offers updated and published successfully.",
      config: saved,
    });
  } catch (err) {
    console.error("Failed to update admin offers:", err.message);
    res.status(500).json({ message: "Failed to save store offers." });
  }
}

