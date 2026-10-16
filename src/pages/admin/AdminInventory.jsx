import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Boxes,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Search,
  Minus,
  Plus,
  ArrowDownRight,
  RefreshCw,
  ExternalLink,
  DollarSign,
  Package,
  History,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { fetchAdminProducts, updateAdminVariantStock } from "../../services/adminApi";

export default function AdminInventory() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'low' | 'out' | 'healthy'

  // Offline Sale Quick Deduct Form State
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [deductQty, setDeductQty] = useState(1);
  const [channel, setChannel] = useState("WhatsApp");
  const [customerNote, setCustomerNote] = useState("");
  const [deducting, setDeducting] = useState(false);

  // Offline activity log (stored in localStorage for persistence)
  const [recentDeductions, setRecentDeductions] = useState(() => {
    try {
      const saved = localStorage.getItem("tdb_manual_deductions");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const refreshInventory = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminProducts(token);
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setFeedback({ type: "error", message: err.message || "Failed to load inventory" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function loadData() {
      try {
        const data = await fetchAdminProducts(token);
        if (!ignore) {
          setProducts(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!ignore) {
          setFeedback({ type: "error", message: err.message || "Failed to load inventory" });
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    if (token) {
      loadData();
    }

    return () => {
      ignore = true;
    };
  }, [token]);

  // Save deductions log
  const logDeduction = (entry) => {
    const updated = [entry, ...recentDeductions].slice(0, 15);
    setRecentDeductions(updated);
    try {
      localStorage.setItem("tdb_manual_deductions", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Flatten products into variant rows for the inventory matrix
  const inventoryRows = useMemo(() => {
    const rows = [];
    products.forEach((p) => {
      (p.variants || []).forEach((v) => {
        rows.push({
          productId: p.id,
          productName: p.name,
          category: p.category || "Fragrance",
          gender: p.gender || "Unisex",
          imageUrl: p.image_url,
          variantId: v.id,
          sizeMl: v.size_ml,
          price: Number(v.price) || 0,
          stock: Number(v.stock) || 0,
          active: v.active !== false,
        });
      });
    });
    return rows;
  }, [products]);

  // Aggregate stats
  const stats = useMemo(() => {
    let totalUnits = 0;
    let lowCount = 0;
    let outCount = 0;
    let healthyCount = 0;
    let totalVal = 0;

    inventoryRows.forEach((r) => {
      totalUnits += r.stock;
      totalVal += r.stock * r.price;
      if (r.stock <= 0) {
        outCount += 1;
      } else if (r.stock <= 5) {
        lowCount += 1;
      } else {
        healthyCount += 1;
      }
    });

    return { totalUnits, lowCount, outCount, healthyCount, totalVal };
  }, [inventoryRows]);

  // Filtered rows
  const filteredRows = useMemo(() => {
    return inventoryRows.filter((row) => {
      const matchesSearch =
        row.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${row.sizeMl}ml`.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeTab === "low") return row.stock > 0 && row.stock <= 5;
      if (activeTab === "out") return row.stock <= 0;
      if (activeTab === "healthy") return row.stock > 5;
      return true;
    });
  }, [inventoryRows, searchQuery, activeTab]);

  // Selected product & variant for quick deduction
  const activeProduct = useMemo(
    () => products.find((p) => String(p.id) === String(selectedProductId)),
    [products, selectedProductId]
  );

  const activeVariant = useMemo(
    () => activeProduct?.variants?.find((v) => String(v.id) === String(selectedVariantId)),
    [activeProduct, selectedVariantId]
  );

  // Quick Inline Stock Update Handler
  const handleStockUpdate = async (variantId, newStock) => {
    const cleanStock = Math.max(0, parseInt(newStock, 10) || 0);
    setUpdatingId(variantId);
    try {
      await updateAdminVariantStock(token, variantId, { stock: cleanStock });
      setProducts((prev) =>
        prev.map((p) => ({
          ...p,
          variants: (p.variants || []).map((v) =>
            v.id === variantId ? { ...v, stock: cleanStock } : v
          ),
        }))
      );
      setFeedback({ type: "success", message: `Stock updated to ${cleanStock} units` });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      setFeedback({ type: "error", message: err.message || "Failed to update stock" });
    } finally {
      setUpdatingId(null);
    }
  };

  // Quick Offline Sale Deduction Handler
  const handleRecordOfflineSale = async (e) => {
    e.preventDefault();
    if (!activeVariant) {
      setFeedback({ type: "error", message: "Please select both a perfume and a decant size." });
      return;
    }

    const currentStock = Number(activeVariant.stock) || 0;
    const qtyToDeduct = Math.max(1, parseInt(deductQty, 10) || 1);
    const newStock = Math.max(0, currentStock - qtyToDeduct);

    setDeducting(true);
    try {
      await updateAdminVariantStock(token, activeVariant.id, { stock: newStock });

      // Update state
      setProducts((prev) =>
        prev.map((p) => ({
          ...p,
          variants: (p.variants || []).map((v) =>
            v.id === activeVariant.id ? { ...v, stock: newStock } : v
          ),
        }))
      );

      // Log activity
      logDeduction({
        id: Date.now(),
        productName: activeProduct.name,
        sizeMl: activeVariant.size_ml,
        deducted: qtyToDeduct,
        remainingStock: newStock,
        channel,
        customerNote: customerNote.trim() || "Manual offline purchase",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });

      setFeedback({
        type: "success",
        message: `✓ Deducted ${qtyToDeduct} bottle(s) of ${activeProduct.name} (${activeVariant.size_ml}ml). Remaining stock: ${newStock}`,
      });
      setCustomerNote("");
      setTimeout(() => setFeedback(null), 5000);
    } catch (err) {
      setFeedback({ type: "error", message: err.message || "Failed to record offline sale" });
    } finally {
      setDeducting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2.5 text-xs uppercase tracking-[0.2em] text-[#c6a15b]">
            <Boxes size={16} />
            <span>Inventory Operations Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-[#f4efe6] mt-1">
            Stock Management & Alert Center
          </h1>
          <p className="text-xs sm:text-sm text-[#c5c1b9] mt-1">
            Monitor real-time bottle quantities, act on low-stock alerts, and deduct items for WhatsApp/offline sales.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={refreshInventory}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2 border border-white/15 bg-[#171715] hover:border-[#c6a15b] text-xs font-semibold uppercase tracking-wider text-[#f4efe6] transition cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <Link
            to="/admin/products"
            className="flex items-center gap-2 px-3.5 py-2 border border-[#c6a15b] bg-[#c6a15b]/10 hover:bg-[#c6a15b] hover:text-[#11110f] text-xs font-semibold uppercase tracking-wider text-[#c6a15b] transition cursor-pointer"
          >
            <Sparkles size={14} />
            Full Catalog
          </Link>
        </div>
      </div>

      {/* Global Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 text-xs flex items-center justify-between border rounded-sm transition-all ${
            feedback.type === "success"
              ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
              : "bg-red-950/40 border-red-500/40 text-red-300"
          }`}
        >
          <span>{feedback.message}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-white/60 hover:text-white cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Key Stock Performance Indicators (KPI Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Stock */}
        <div className="bg-[#171715] border border-white/10 p-5 rounded-sm">
          <div className="flex items-center justify-between text-xs text-[#c5c1b9]">
            <span className="uppercase tracking-wider">Total Units in Stock</span>
            <Package size={16} className="text-[#c6a15b]" />
          </div>
          <p className="text-2xl font-bold font-display text-[#f4efe6] mt-2">
            {stats.totalUnits.toLocaleString()}
          </p>
          <p className="text-[11px] text-[#8e8a82] mt-1">Across all bottle sizes</p>
        </div>

        {/* Low Stock Alerts */}
        <div
          onClick={() => setActiveTab("low")}
          className={`bg-[#171715] border p-5 rounded-sm transition cursor-pointer ${
            activeTab === "low" ? "border-amber-500 bg-amber-950/20" : "border-amber-500/30 hover:border-amber-500/60"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-amber-400">
            <span className="uppercase tracking-wider font-semibold">Low Stock Alerts</span>
            <AlertTriangle size={16} />
          </div>
          <p className="text-2xl font-bold font-display text-amber-400 mt-2">
            {stats.lowCount}
          </p>
          <p className="text-[11px] text-amber-400/70 mt-1">≤ 5 bottles remaining</p>
        </div>

        {/* Out of Stock */}
        <div
          onClick={() => setActiveTab("out")}
          className={`bg-[#171715] border p-5 rounded-sm transition cursor-pointer ${
            activeTab === "out" ? "border-red-500 bg-red-950/20" : "border-red-500/30 hover:border-red-500/60"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-red-400">
            <span className="uppercase tracking-wider font-semibold">Sold Out</span>
            <XCircle size={16} />
          </div>
          <p className="text-2xl font-bold font-display text-red-400 mt-2">
            {stats.outCount}
          </p>
          <p className="text-[11px] text-red-400/70 mt-1">Requires immediate restock</p>
        </div>

        {/* Inventory Value */}
        <div className="bg-[#171715] border border-white/10 p-5 rounded-sm">
          <div className="flex items-center justify-between text-xs text-[#c5c1b9]">
            <span className="uppercase tracking-wider">Inventory Value</span>
            <DollarSign size={16} className="text-[#c6a15b]" />
          </div>
          <p className="text-2xl font-bold font-display text-[#f4efe6] mt-2">
            ₹{stats.totalVal.toLocaleString()}
          </p>
          <p className="text-[11px] text-[#8e8a82] mt-1">Estimated retail stock value</p>
        </div>
      </div>

      {/* Main Section: Quick Deductor + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Offline Sale Deductor (2 Cols) */}
        <div className="lg:col-span-2 bg-[#171715] border border-[#c6a15b]/30 p-6 rounded-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 h-28 w-28 bg-[#c6a15b]/5 rounded-bl-full pointer-events-none" />

          <div className="flex items-center gap-2.5 text-xs uppercase tracking-[0.2em] text-[#c6a15b] font-medium">
            <ArrowDownRight size={18} />
            <span>Fast Offline / WhatsApp Sale Deductor</span>
          </div>
          <p className="text-xs text-[#c5c1b9] mt-1">
            Sold a decant in person, through WhatsApp, or Instagram DM? Deduct it here in 1-click so your website inventory updates immediately.
          </p>

          <form onSubmit={handleRecordOfflineSale} className="mt-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Perfume Picker */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8e8a82] mb-1.5 font-medium">
                  Select Perfume
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => {
                    setSelectedProductId(e.target.value);
                    const p = products.find((prod) => String(prod.id) === e.target.value);
                    setSelectedVariantId(p?.variants?.[0]?.id ? String(p.variants[0].id) : "");
                  }}
                  className="w-full h-11 px-3 bg-[#11110f] border border-white/15 text-xs text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none cursor-pointer"
                  required
                >
                  <option value="">-- Choose Fragrance --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.category || "Fragrance"})
                    </option>
                  ))}
                </select>
              </div>

              {/* Decant Size Picker */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8e8a82] mb-1.5 font-medium">
                  Select Decant Size
                </label>
                <select
                  value={selectedVariantId}
                  onChange={(e) => setSelectedVariantId(e.target.value)}
                  disabled={!activeProduct}
                  className="w-full h-11 px-3 bg-[#11110f] border border-white/15 text-xs text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none cursor-pointer disabled:opacity-40"
                  required
                >
                  <option value="">-- Choose Size --</option>
                  {activeProduct?.variants?.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.size_ml} ml · ₹{v.price} (Current Stock: {v.stock} left)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Current Stock Preview Info Box */}
            {activeVariant && (
              <div className="p-3 bg-[#11110f] border border-white/10 rounded flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#8e8a82]">Current Stock for {activeProduct?.name} ({activeVariant.size_ml}ml):</span>{" "}
                  <strong className="text-[#f4efe6] font-semibold">{activeVariant.stock} bottles</strong>
                </div>
                <div>
                  {activeVariant.stock <= 0 ? (
                    <span className="text-red-400 font-bold uppercase tracking-wider text-[10px]">Sold Out</span>
                  ) : activeVariant.stock <= 5 ? (
                    <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px]">Low Stock</span>
                  ) : (
                    <span className="text-emerald-400 font-semibold uppercase tracking-wider text-[10px]">In Stock</span>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Quantity to Deduct */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8e8a82] mb-1.5 font-medium">
                  Quantity Sold
                </label>
                <div className="flex h-11 items-center border border-white/15 bg-[#11110f]">
                  <button
                    type="button"
                    onClick={() => setDeductQty((q) => Math.max(1, q - 1))}
                    className="w-10 h-full flex items-center justify-center text-[#c5c1b9] hover:text-[#c6a15b] cursor-pointer"
                  >
                    <Minus size={14} />
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={activeVariant?.stock || 99}
                    value={deductQty}
                    onChange={(e) => setDeductQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-full text-center bg-transparent text-sm font-semibold text-[#f4efe6] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setDeductQty((q) => q + 1)}
                    className="w-10 h-full flex items-center justify-center text-[#c5c1b9] hover:text-[#c6a15b] cursor-pointer"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Channel */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8e8a82] mb-1.5 font-medium">
                  Sales Channel
                </label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  className="w-full h-11 px-3 bg-[#11110f] border border-white/15 text-xs text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none cursor-pointer"
                >
                  <option value="WhatsApp">WhatsApp Order</option>
                  <option value="Instagram">Instagram DM</option>
                  <option value="Walk-in">Walk-in / Cash</option>
                  <option value="Phone Call">Direct Phone Call</option>
                  <option value="Sample / Tester">Sample / Personal Use</option>
                </select>
              </div>

              {/* Note / Customer Name */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8e8a82] mb-1.5 font-medium">
                  Buyer Note (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Aman, Delhi"
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  className="w-full h-11 px-3 bg-[#11110f] border border-white/15 text-xs text-[#f4efe6] placeholder-[#8e8a82]/50 focus:border-[#c6a15b] focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={deducting || !activeVariant}
                className="w-full sm:w-auto px-6 h-11 bg-[#c6a15b] hover:bg-[#d8c08a] text-[#11110f] text-xs uppercase tracking-[0.2em] font-semibold transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {deducting ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    Recording Sale...
                  </>
                ) : (
                  <>
                    <ArrowDownRight size={15} />
                    Record Sale & Deduct {deductQty} Bottle(s)
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Activity Feed: Recent Manual Deductions (1 Col) */}
        <div className="bg-[#171715] border border-white/10 p-5 rounded-sm flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#c6a15b] font-medium">
              <History size={15} />
              <span>Manual Deductions Log</span>
            </div>
            {recentDeductions.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setRecentDeductions([]);
                  localStorage.removeItem("tdb_manual_deductions");
                }}
                className="text-[10px] text-[#8e8a82] hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto max-h-[300px] mt-3 space-y-2.5 pr-1 text-xs">
            {recentDeductions.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#8e8a82]">
                <MessageCircle size={28} className="stroke-[1.2] opacity-40 mb-2" />
                <p>No offline deductions recorded yet today.</p>
                <p className="text-[11px] mt-1 text-[#8e8a82]/70">
                  Deducting an item will log the time and channel here.
                </p>
              </div>
            ) : (
              recentDeductions.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 bg-[#11110f] border border-white/5 rounded text-left space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#f4efe6] truncate max-w-[170px]">
                      {item.productName} ({item.sizeMl}ml)
                    </span>
                    <span className="text-[10px] text-[#8e8a82]">{item.timestamp}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-amber-400 font-medium">
                      -{item.deducted} bottle ({item.channel})
                    </span>
                    <span className="text-[#8e8a82]">Left: {item.remainingStock}</span>
                  </div>
                  {item.customerNote && (
                    <p className="text-[10px] text-[#8e8a82]/80 italic truncate">
                      &quot;{item.customerNote}&quot;
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Interactive Inventory Master Table */}
      <div className="bg-[#171715] border border-white/10 rounded-sm">
        {/* Table Controls & Tabs */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded transition cursor-pointer ${
                activeTab === "all"
                  ? "bg-[#c6a15b] text-[#11110f]"
                  : "bg-white/5 text-[#c5c1b9] hover:bg-white/10"
              }`}
            >
              All Variants ({inventoryRows.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("low")}
              className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "low"
                  ? "bg-amber-500 text-black"
                  : "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
              }`}
            >
              <AlertTriangle size={13} />
              Low Stock (≤ 5) ({stats.lowCount})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("out")}
              className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "out"
                  ? "bg-red-500 text-white"
                  : "bg-red-500/10 text-red-400 hover:bg-red-500/20"
              }`}
            >
              <XCircle size={13} />
              Sold Out (0) ({stats.outCount})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("healthy")}
              className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "healthy"
                  ? "bg-emerald-500 text-black"
                  : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
              }`}
            >
              <CheckCircle2 size={13} />
              In Stock ({stats.healthyCount})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8e8a82]"
            />
            <input
              type="text"
              placeholder="Search perfume or size..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-3 bg-[#11110f] border border-white/15 text-xs text-[#f4efe6] placeholder-[#8e8a82] focus:border-[#c6a15b] focus:outline-none"
            />
          </div>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#141412] text-[#8e8a82] uppercase tracking-wider text-[11px] border-b border-white/10">
              <tr>
                <th className="py-3.5 px-4 font-medium">Fragrance</th>
                <th className="py-3.5 px-4 font-medium">Size</th>
                <th className="py-3.5 px-4 font-medium">Price</th>
                <th className="py-3.5 px-4 font-medium">Status & Health</th>
                <th className="py-3.5 px-4 font-medium text-center">Bottles Left (Direct Edit)</th>
                <th className="py-3.5 px-4 font-medium text-right">Quick Restock / Storefront</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-[#8e8a82]">
                    <RefreshCw size={20} className="animate-spin mx-auto mb-2 text-[#c6a15b]" />
                    Loading inventory data from cloud...
                  </td>
                </tr>
              ) : filteredRows.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-[#8e8a82]">
                    No inventory variants found matching your search or filter.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => {
                  const isSoldOut = row.stock <= 0;
                  const isLow = row.stock > 0 && row.stock <= 5;
                  const isUpdating = updatingId === row.variantId;

                  return (
                    <tr
                      key={row.variantId}
                      className={`hover:bg-white/[0.02] transition-colors ${
                        isSoldOut ? "bg-red-950/[0.08]" : isLow ? "bg-amber-950/[0.08]" : ""
                      }`}
                    >
                      {/* Fragrance Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 shrink-0 bg-[#11110f] border border-white/10 rounded flex items-center justify-center overflow-hidden">
                            {row.imageUrl ? (
                              <img
                                src={row.imageUrl}
                                alt={row.productName}
                                className="h-full w-full object-contain p-1"
                              />
                            ) : (
                              <Package size={16} className="text-[#8e8a82]" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-[#f4efe6] hover:text-[#c6a15b] transition">
                              {row.productName}
                            </p>
                            <p className="text-[11px] text-[#8e8a82]">
                              {row.category} · {row.gender}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Decant Size */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-medium text-[#f4efe6] bg-white/5 px-2 py-1 rounded">
                          {row.sizeMl} ml
                        </span>
                      </td>

                      {/* Retail Price */}
                      <td className="py-3.5 px-4 font-medium text-[#c6a15b]">
                        ₹{row.price}
                      </td>

                      {/* Stock Health Badge */}
                      <td className="py-3.5 px-4">
                        {isSoldOut ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-red-950/80 text-red-300 border border-red-500/40 rounded-full">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                            Sold Out
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-amber-950/80 text-amber-300 border border-amber-500/40 rounded-full animate-pulse">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                            Only {row.stock} left
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-emerald-950/50 text-emerald-300 border border-emerald-500/30 rounded-full">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            In Stock
                          </span>
                        )}
                      </td>

                      {/* Direct Editable Stepper */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-1">
                          <div className="flex h-9 items-center border border-white/20 bg-[#11110f] rounded">
                            <button
                              type="button"
                              title="Deduct 1 bottle"
                              disabled={isUpdating || row.stock <= 0}
                              onClick={() => handleStockUpdate(row.variantId, row.stock - 1)}
                              className="w-8 h-full flex items-center justify-center text-[#c5c1b9] hover:text-amber-400 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <Minus size={13} />
                            </button>
                            <input
                              type="number"
                              min="0"
                              value={row.stock}
                              disabled={isUpdating}
                              onChange={(e) =>
                                handleStockUpdate(row.variantId, parseInt(e.target.value, 10))
                              }
                              className="w-14 text-center bg-transparent text-xs font-semibold text-[#f4efe6] focus:outline-none"
                            />
                            <button
                              type="button"
                              title="Add 1 bottle"
                              disabled={isUpdating}
                              onClick={() => handleStockUpdate(row.variantId, row.stock + 1)}
                              className="w-8 h-full flex items-center justify-center text-[#c5c1b9] hover:text-emerald-400 transition cursor-pointer disabled:opacity-30"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Quick Restock (+5 / +10) & Storefront Link */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            title="Add 5 to stock"
                            disabled={isUpdating}
                            onClick={() => handleStockUpdate(row.variantId, row.stock + 5)}
                            className="px-2 py-1 bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-300 border border-white/10 rounded text-[10px] font-mono font-semibold transition cursor-pointer"
                          >
                            +5
                          </button>
                          <button
                            type="button"
                            title="Add 10 to stock"
                            disabled={isUpdating}
                            onClick={() => handleStockUpdate(row.variantId, row.stock + 10)}
                            className="px-2 py-1 bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-300 border border-white/10 rounded text-[10px] font-mono font-semibold transition cursor-pointer"
                          >
                            +10
                          </button>
                          <Link
                            to={`/product/${row.productId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="View on Storefront"
                            className="p-1.5 text-[#8e8a82] hover:text-[#c6a15b] transition cursor-pointer"
                          >
                            <ExternalLink size={14} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
