import { useState, useEffect, useRef } from "react";
import {
  Plus, Search, Edit2, Trash2, Sparkles, X, Upload, Loader2,
  ChevronDown, ChevronUp,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  fetchAdminProducts, createAdminProduct, updateAdminProduct,
  deleteAdminProduct, uploadAdminProductImage,
} from "../../services/adminApi";
import { getPerfumeProfile } from "../../data/perfumeNotes";

const CATEGORIES = ["Designer", "Niche", "Middle Eastern", "Fresh", "Woody", "Oriental", "Gourmand"];
const GENDERS = ["Men", "Women", "Unisex"];
const CONCENTRATIONS = ["EDP", "EDT", "Extrait de Parfum", "Parfum", "Elixir", "EDC", "Eau Fraiche"];
const SEASON_CHIPS = ["Winter", "Summer", "All-Season"];
const LONGEVITY_OPTIONS = ["2 – 4 Hours","4 – 6 Hours","6 – 8 Hours","8 – 10 Hours","10 – 13 Hours","13+ Hours"];
const PROJECTION_OPTIONS = ["Soft & Intimate","Moderate","Good Sillage","Strong & Enveloping","Beast Mode"];
const ACCORD_COLORS = ["#8B4513","#9c2759","#b85428","#d9822b","#c49e49","#6e4f32","#4a4a4e","#2d6a4f","#1d3557","#5c4a7f","#a8332a","#3d6b8f","#7a5c3d","#4f7942","#8e6b3a"];
const WHEN_TO_WEAR_DEFAULTS = { winter: 50, spring: 50, summer: 50, fall: 50, day: 50, night: 50 };

const PRESET_ACCORDS = [
  { name: "Woody", color: "#8B5A2B", pct: 85 },
  { name: "Warm Spicy", color: "#C0392B", pct: 80 },
  { name: "Citrus", color: "#D4AF37", pct: 75 },
  { name: "Vanilla", color: "#E0A96D", pct: 70 },
  { name: "Amber", color: "#C68B59", pct: 70 },
  { name: "Aromatic", color: "#4A7C59", pct: 65 },
  { name: "Fresh", color: "#2E86AB", pct: 65 },
  { name: "Smoky", color: "#5D6D7E", pct: 60 },
  { name: "Leather", color: "#6E2C00", pct: 60 },
  { name: "Sweet", color: "#AF7AC5", pct: 55 },
  { name: "Floral", color: "#C25975", pct: 65 },
  { name: "Fruity", color: "#D97736", pct: 70 },
  { name: "Oud", color: "#3F292B", pct: 90 },
  { name: "Musky", color: "#7B6D8D", pct: 60 },
  { name: "Powdery", color: "#9B8B7B", pct: 55 },
];

function normalizeAccord(item, index = 0) {
  if (!item) return null;
  const defaultColor = ACCORD_COLORS[index % ACCORD_COLORS.length];
  if (typeof item === "string") {
    const trimmed = item.trim();
    if (!trimmed) return null;
    return {
      name: trimmed,
      percentage: Math.max(30, 95 - index * 8),
      color: defaultColor,
    };
  }
  if (typeof item === "object") {
    const name = String(item.name || item.title || "").trim();
    if (!name) return null;
    const percentage = typeof item.percentage === "number" ? item.percentage : 60;
    const color = item.color || defaultColor;
    return { name, percentage, color };
  }
  return null;
}

function normalizeAccords(list) {
  if (!list) return [];
  if (typeof list === "string") {
    try {
      const parsed = JSON.parse(list);
      if (Array.isArray(parsed)) return normalizeAccords(parsed);
    } catch {
      const parts = list.split(/[,/]/).map((s) => s.trim()).filter(Boolean);
      return normalizeAccords(parts);
    }
  }
  if (Array.isArray(list)) {
    return list.map((item, idx) => normalizeAccord(item, idx)).filter(Boolean);
  }
  return [];
}

function isSeasonActive(weatherString, chip) {
  if (!weatherString) return false;
  const lower = weatherString.toLowerCase();
  if (chip === "All-Season") {
    return lower.includes("all");
  }
  return lower.includes(chip.toLowerCase());
}

function toggleSeasonInString(currentWeather = "", chip) {
  if (chip === "All-Season") {
    return currentWeather.toLowerCase().includes("all") ? "" : "All-Season";
  }

  let parts = currentWeather
    .split(/[/,]/)
    .map((s) => s.trim())
    .filter(Boolean);

  parts = parts.filter((p) => !p.toLowerCase().includes("all"));

  const idx = parts.findIndex((p) => p.toLowerCase() === chip.toLowerCase());

  if (idx >= 0) {
    parts.splice(idx, 1);
  } else {
    parts.push(chip);
  }

  return parts.join(" / ");
}

// ─── Tag Input ──────────────────────────────────────────────────────────────────
function TagInput({ label, tags, onChange, placeholder }) {
  const [inputVal, setInputVal] = useState("");
  const addTag = () => { const val = inputVal.trim(); if (val && !tags.includes(val)) onChange([...tags, val]); setInputVal(""); };
  const removeTag = (tag) => onChange(tags.filter((t) => t !== tag));
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); }
    else if (e.key === "Backspace" && !inputVal && tags.length > 0) removeTag(tags[tags.length - 1]);
  };
  return (
    <div>
      <label className="block uppercase tracking-wider text-[11px] text-[#8e8a82] mb-1.5 font-medium">{label}</label>
      <div className="min-h-[40px] flex flex-wrap items-center gap-1.5 bg-[#11110f] border border-white/15 px-2.5 py-2 focus-within:border-[#c6a15b] transition-colors">
        {tags.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 bg-[#c6a15b]/15 border border-[#c6a15b]/30 text-[#f4efe6] text-[11px] px-2 py-0.5 rounded">
            {tag}
            <button type="button" onClick={() => removeTag(tag)} className="text-[#c6a15b] hover:text-red-400 cursor-pointer"><X size={10} /></button>
          </span>
        ))}
        <input type="text" value={inputVal} onChange={(e) => setInputVal(e.target.value)} onKeyDown={handleKeyDown} onBlur={addTag} placeholder={tags.length === 0 ? placeholder : "Add more..."} className="flex-1 min-w-[120px] bg-transparent text-xs text-[#f4efe6] outline-none placeholder-[#8e8a82]" />
      </div>
      <p className="text-[10px] text-[#8e8a82] mt-1">Press Enter or comma to add. Click × to remove.</p>
    </div>
  );
}

// ─── Accord Row ─────────────────────────────────────────────────────────────────
function AccordRow({ accord, index, onChange, onRemove }) {
  const safeAccord = typeof accord === "object" && accord !== null
    ? accord
    : { name: String(accord || ""), percentage: 60, color: "#c6a15b" };

  return (
    <div className="flex items-center gap-2.5 bg-[#171715] border border-white/5 p-2.5 rounded">
      <input
        type="color"
        value={safeAccord.color || "#c6a15b"}
        onChange={(e) => onChange(index, "color", e.target.value)}
        className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent p-0 shrink-0"
        title="Accord bar colour"
      />
      <input
        type="text"
        value={safeAccord.name || ""}
        onChange={(e) => onChange(index, "name", e.target.value)}
        placeholder="e.g. Tobacco / Amber"
        className="flex-1 bg-[#11110f] border border-white/15 px-2.5 py-1.5 text-xs text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none rounded min-w-[100px]"
      />
      <div className="flex items-center gap-1.5 w-28 shrink-0">
        <input
          type="range"
          min={5}
          max={100}
          step={5}
          value={safeAccord.percentage ?? 50}
          onChange={(e) => onChange(index, "percentage", Number(e.target.value))}
          className="flex-1 accent-[#c6a15b] cursor-pointer"
        />
        <span className="text-[11px] text-[#c6a15b] font-semibold w-8 text-right">
          {safeAccord.percentage ?? 50}%
        </span>
      </div>
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="text-red-400 hover:text-red-300 p-1 cursor-pointer shrink-0"
        title="Remove accord"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}

// ─── When To Wear Sliders ───────────────────────────────────────────────────────
function WhenToWearSliders({ values, onChange }) {
  const slots = [
    { key: "winter", label: "❄️ Winter" },
    { key: "spring", label: "🌸 Spring" },
    { key: "summer", label: "☀️ Summer" },
    { key: "fall", label: "🍂 Fall / Autumn" },
    { key: "day", label: "🌤 Day" },
    { key: "night", label: "🌙 Night" },
  ];

  const presets = [
    {
      label: "✨ All-Season Daily",
      desc: "Balanced for any day & weather",
      data: { winter: 75, spring: 80, summer: 70, fall: 75, day: 85, night: 70 },
    },
    {
      label: "❄️ Winter / Night Beast",
      desc: "Warm, spicy, evening wear",
      data: { winter: 95, spring: 40, summer: 15, fall: 85, day: 35, night: 95 },
    },
    {
      label: "☀️ Summer / Fresh Day",
      desc: "Bright, aquatic, office / gym",
      data: { winter: 20, spring: 85, summer: 95, fall: 35, day: 95, night: 40 },
    },
    {
      label: "🌙 Date Night / Clubbing",
      desc: "Sensual, loud, projection wear",
      data: { winter: 85, spring: 55, summer: 30, fall: 90, day: 25, night: 95 },
    },
  ];

  const applyPreset = (presetData) => {
    onChange({ ...values, ...presetData });
  };

  const toggleSlot = (key) => {
    const current = values[key] ?? 50;
    const nextVal = current >= 60 ? 20 : 85;
    onChange({ ...values, [key]: nextVal });
  };

  return (
    <div className="space-y-4">
      {/* 1-Click Quick Presets */}
      <div>
        <span className="block text-[10px] uppercase tracking-wider text-[#8e8a82] mb-1.5 font-medium">
          Quick 1-Click Presets:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => applyPreset(p.data)}
              className="px-2.5 py-2 text-left bg-white/5 hover:bg-[#c6a15b]/15 border border-white/10 hover:border-[#c6a15b]/40 rounded transition cursor-pointer group"
            >
              <div className="text-[11px] font-medium text-[#f4efe6] group-hover:text-[#c6a15b]">
                {p.label}
              </div>
              <div className="text-[9px] text-[#8e8a82] truncate">{p.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Clickable Season / Time Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {slots.map(({ key, label }) => {
          const val = values[key] ?? 50;
          const isHigh = val >= 60;
          return (
            <div
              key={key}
              className={`p-2.5 rounded border transition-colors ${
                isHigh
                  ? "bg-[#c6a15b]/10 border-[#c6a15b]/40"
                  : "bg-[#11110f] border-white/10"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <button
                  type="button"
                  onClick={() => toggleSlot(key)}
                  className="text-[11px] font-medium hover:text-[#c6a15b] cursor-pointer flex items-center gap-1.5"
                  title="Click to toggle active / subtle"
                >
                  <span>{label}</span>
                  <span
                    className={`text-[9px] px-1 py-0.2 rounded font-semibold ${
                      isHigh
                        ? "bg-[#c6a15b] text-[#11110f]"
                        : "bg-white/10 text-[#8e8a82]"
                    }`}
                  >
                    {isHigh ? "Active" : "Subtle"}
                  </span>
                </button>
                <span className="text-[11px] text-[#c6a15b] font-semibold">
                  {val}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={val}
                onChange={(e) =>
                  onChange({ ...values, [key]: Number(e.target.value) })
                }
                className="w-full accent-[#c6a15b] cursor-pointer"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Collapsible Section ────────────────────────────────────────────────────────
function CollapsibleSection({ title, subtitle, children, defaultOpen = false, badge, isOpen, onToggle }) {
  const [localOpen, setLocalOpen] = useState(defaultOpen);
  const open = isOpen !== undefined ? isOpen : localOpen;
  const toggle = () => {
    if (onToggle) onToggle(!open);
    else setLocalOpen(!open);
  };

  return (
    <div className="border border-white/10 rounded overflow-hidden">
      <button
        type="button"
        onClick={toggle}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#141412] hover:bg-[#1a1a17] transition cursor-pointer text-left"
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#c6a15b]">{title}</span>
          {badge && <span className="text-[10px] px-1.5 py-0.5 bg-[#c6a15b]/20 text-[#c6a15b] rounded font-medium">{badge}</span>}
          {subtitle && <span className="text-[10px] text-[#8e8a82] hidden sm:inline">{subtitle}</span>}
        </div>
        {open ? <ChevronUp size={14} className="text-[#8e8a82] shrink-0" /> : <ChevronDown size={14} className="text-[#8e8a82] shrink-0" />}
      </button>
      {open && <div className="px-4 py-4 bg-[#141412] space-y-4">{children}</div>}
    </div>
  );
}

export default function AdminProducts() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function loadData() {
      try {
        const data = await fetchAdminProducts(token);
        if (!ignore) {
          setProducts(data);
          setError("");
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || "Failed to load products");
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


  const handleOpenAdd = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete '${name}' and all its decant variants?`)) {
      return;
    }
    try {
      await deleteAdminProduct(token, id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete product");
    }
  };

  const handleModalSave = async (productData) => {
    try {
      if (editingProduct) {
        const res = await updateAdminProduct(token, editingProduct.id, productData);
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? res.product : p))
        );
      } else {
        const res = await createAdminProduct(token, productData);
        setProducts((prev) => [res.product, ...prev]);
      }
      setModalOpen(false);
    } catch (err) {
      alert(err.message || "Failed to save product");
    }
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      search === "" ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.brand?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" ||
      p.category?.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#c6a15b]">
            Fragrance Inventory
          </p>
          <h1 className="font-display text-3xl sm:text-4xl text-[#f4efe6] mt-1">
            Perfumes & Decant Stock
          </h1>
          <p className="text-xs text-[#8e8a82] mt-1">
            Manage your master bottle catalog, atomizer sizes (2ml, 5ml, 10ml), prices, and stock counts.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 border border-[#c6a15b] bg-[#c6a15b] px-5 py-3 text-xs uppercase tracking-wider font-semibold text-[#11110f] hover:bg-[#d8c08a] transition cursor-pointer shadow-md"
        >
          <Plus size={16} /> Add Fragrance
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8e8a82]"
          />
          <input
            type="search"
            placeholder="Search by perfume name or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#171715] border border-white/10 pl-11 pr-4 py-3 text-xs text-[#f4efe6] placeholder-[#8e8a82] focus:border-[#c6a15b] focus:outline-none"
          />
        </div>

        <div className="flex gap-2">
          {["All", ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 text-xs uppercase tracking-wider font-medium transition cursor-pointer border ${selectedCategory === cat
                  ? "border-[#c6a15b] bg-[#c6a15b] text-[#11110f] font-semibold"
                  : "border-white/10 bg-[#171715] text-[#c5c1b9] hover:border-white/20"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#c6a15b] border-t-transparent mb-3" />
          <p className="text-xs uppercase tracking-wider text-[#8e8a82]">
            Loading fragrances...
          </p>
        </div>
      ) : error ? (
        <div className="border border-red-500/20 bg-red-500/10 p-6 text-center text-sm text-red-300">
          <p>{error}</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="border border-white/10 bg-[#171715] p-12 text-center text-[#8e8a82]">
          <Sparkles size={36} strokeWidth={1.2} className="mx-auto text-[#c6a15b] mb-3" />
          <p className="text-sm text-[#f4efe6]">No perfumes found.</p>
        </div>
      ) : (
        <div className="border border-white/10 bg-[#171715] overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider text-[#8e8a82]">
                <th className="py-4 px-4">Fragrance</th>
                <th className="py-4 px-4">Category / Brand</th>
                <th className="py-4 px-4">Gender & Type</th>
                <th className="py-4 px-4">Top Notes Preview</th>
                <th className="py-4 px-4">Decant Variants</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.map((p) => {
                const topNotes = Array.isArray(p.top_notes) ? p.top_notes : [];
                const variantCount = Array.isArray(p.variants) ? p.variants.length : 0;
                return (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {p.image_url && <img src={p.image_url} alt={p.name} className="w-9 h-9 object-contain rounded border border-white/10 bg-black/30" />}
                        <div>
                          <p className="font-semibold text-[#f4efe6]">{p.name}</p>
                          {p.vibe && <p className="text-[10px] text-[#8e8a82] italic mt-0.5 max-w-[180px] truncate">{p.vibe}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="text-[#c6a15b] font-medium">{p.category || "—"}</p>
                      <p className="text-[#8e8a82] text-[11px]">{p.brand || "—"}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="text-[#f4efe6]">{p.gender || "—"}</p>
                      <p className="text-[#8e8a82] text-[11px]">{p.type || "—"}</p>
                    </td>
                    <td className="py-3.5 px-4 max-w-[180px]">
                      {topNotes.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {topNotes.slice(0, 3).map((n) => (
                            <span key={n} className="text-[10px] px-1.5 py-0.5 bg-[#c6a15b]/10 border border-[#c6a15b]/20 text-[#c6a15b] rounded">{n}</span>
                          ))}
                          {topNotes.length > 3 && <span className="text-[10px] text-[#8e8a82]">+{topNotes.length - 3}</span>}
                        </div>
                      ) : (
                        <span className="text-[10px] text-red-400/70 italic">No notes set</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-[#c5c1b9]">{variantCount > 0 ? `${variantCount} size${variantCount > 1 ? "s" : ""}` : "—"}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <button type="button" onClick={() => handleOpenEdit(p)} className="p-1.5 text-[#8e8a82] hover:text-[#c6a15b] transition cursor-pointer"><Edit2 size={14} /></button>
                        <button type="button" onClick={() => handleDelete(p.id, p.name)} className="p-1.5 text-[#8e8a82] hover:text-red-400 transition cursor-pointer"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Product Add/Edit Modal */}
      {modalOpen && (
        <ProductModal
          product={editingProduct}
          onClose={() => setModalOpen(false)}
          onSave={handleModalSave}
          token={token}
        />
      )}
    </div>
  );
}

// ─── Product Modal ──────────────────────────────────────────────────────────────
function ProductModal({ product, onClose, onSave, token }) {
  const fileInputRef = useRef(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [saving, setSaving] = useState(false);

  // Section visibility state
  const [allExpanded, setAllExpanded] = useState(false);
  const [sectionsOpen, setSectionsOpen] = useState({
    info: true,
    notes: true,
    accords: true, // Section C is open by default
    performance: false,
    whenToWear: false,
    variants: true,
  });

  const toggleSection = (key) => {
    setSectionsOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleToggleAll = () => {
    const next = !allExpanded;
    setAllExpanded(next);
    setSectionsOpen({
      info: next,
      notes: next,
      accords: next,
      performance: next,
      whenToWear: next,
      variants: next,
    });
  };

  // Basic fields
  const [formData, setFormData] = useState({
    name: product?.name || "",
    brand: product?.brand || "",
    description: product?.description || "",
    imageUrl: product?.image_url || "",
    category: product?.category || "Designer",
    gender: product?.gender || "Unisex",
    weather: product?.weather || "All-Season",
    type: product?.type || "EDP",
    fullBottlePrice: product?.full_bottle_price || "",
  });

  const fallback = (product?.name || formData.name) ? getPerfumeProfile(product?.name || formData.name) : null;

  // Fragrance Profile fields - pre-populated from DB or catalog fallback draft
  const [topNotes, setTopNotes] = useState(() => {
    if (Array.isArray(product?.top_notes) && product.top_notes.length > 0) return product.top_notes;
    if (fallback?.topNotes?.length > 0) return fallback.topNotes;
    return [];
  });
  const [middleNotes, setMiddleNotes] = useState(() => {
    if (Array.isArray(product?.middle_notes) && product.middle_notes.length > 0) return product.middle_notes;
    if (fallback?.middleNotes?.length > 0) return fallback.middleNotes;
    return [];
  });
  const [baseNotes, setBaseNotes] = useState(() => {
    if (Array.isArray(product?.base_notes) && product.base_notes.length > 0) return product.base_notes;
    if (fallback?.baseNotes?.length > 0) return fallback.baseNotes;
    return [];
  });

  const [accords, setAccords] = useState(() => {
    let raw = [];
    if (Array.isArray(product?.accords) && product.accords.length > 0) {
      raw = product.accords;
    } else if (typeof product?.accords === "string") {
      try {
        const parsed = JSON.parse(product.accords);
        if (Array.isArray(parsed) && parsed.length > 0) raw = parsed;
      } catch {}
    } else if (fallback?.accords?.length > 0) {
      raw = fallback.accords;
    }
    return normalizeAccords(raw);
  });

  const [vibe, setVibe] = useState(product?.vibe || fallback?.vibe || "");
  const [longevity, setLongevity] = useState(product?.longevity || fallback?.longevity || "8 – 10 Hours");
  const [projection, setProjection] = useState(product?.projection || fallback?.projection || "Moderate");
  const [whenToWear, setWhenToWear] = useState(() => {
    if (product?.when_to_wear && typeof product.when_to_wear === "object" && Object.keys(product.when_to_wear).length > 0) {
      return { ...WHEN_TO_WEAR_DEFAULTS, ...product.when_to_wear };
    }
    if (typeof product?.when_to_wear === "string") {
      try {
        const parsed = JSON.parse(product.when_to_wear);
        if (parsed && typeof parsed === "object" && Object.keys(parsed).length > 0) {
          return { ...WHEN_TO_WEAR_DEFAULTS, ...parsed };
        }
      } catch {}
    }
    if (fallback?.whenToWear) {
      const maxVal = Math.max(...Object.values(fallback.whenToWear).filter((v) => typeof v === "number"), 1);
      const converted = {};
      for (const [k, v] of Object.entries(fallback.whenToWear)) {
        converted[k] = typeof v === "number" ? (v > 100 ? Math.round((v / maxVal) * 100) : v) : 50;
      }
      return { ...WHEN_TO_WEAR_DEFAULTS, ...converted };
    }
    return { ...WHEN_TO_WEAR_DEFAULTS };
  });

  const handleAutoFillFromCatalog = () => {
    const targetName = formData.name || product?.name;
    if (!targetName || !targetName.trim()) {
      alert("Please enter a Fragrance Name first to auto-fill its profile.");
      return;
    }
    const template = getPerfumeProfile(targetName);
    if (!template) {
      alert(`No standard template found for "${targetName}".`);
      return;
    }
    if (template.topNotes?.length) setTopNotes(template.topNotes);
    if (template.middleNotes?.length) setMiddleNotes(template.middleNotes);
    if (template.baseNotes?.length) setBaseNotes(template.baseNotes);
    if (template.accords?.length) setAccords(normalizeAccords(template.accords));
    if (template.vibe) setVibe(template.vibe);
    if (template.longevity) setLongevity(template.longevity);
    if (template.projection) setProjection(template.projection);
    if (template.whenToWear) {
      const maxVal = Math.max(...Object.values(template.whenToWear).filter((v) => typeof v === "number"), 1);
      const converted = {};
      for (const [k, v] of Object.entries(template.whenToWear)) {
        converted[k] = typeof v === "number" ? (v > 100 ? Math.round((v / maxVal) * 100) : v) : 50;
      }
      setWhenToWear({ ...WHEN_TO_WEAR_DEFAULTS, ...converted });
    }
    if (!formData.description && template.description) {
      setFormData((prev) => ({ ...prev, description: template.description }));
    }
  };

  // Decant Variants
  const [variants, setVariants] = useState(() => {
    if (product?.variants && product.variants.length > 0) return product.variants.map((v) => ({ ...v }));
    return [
      { size_ml: 2, price: 349, stock: 50, active: true },
      { size_ml: 5, price: 799, stock: 35, active: true },
      { size_ml: 10, price: 1499, stock: 20, active: true },
    ];
  });

  const [isCustomType, setIsCustomType] = useState(() =>
    product?.type ? !CONCENTRATIONS.some((c) => c.toLowerCase() === product.type.trim().toLowerCase()) : false
  );
  const [isCustomCategory, setIsCustomCategory] = useState(() =>
    product?.category ? !CATEGORIES.some((c) => c.toLowerCase() === product.category.trim().toLowerCase()) : false
  );

  // Image Upload
  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setUploadError("Please select an image file (PNG, JPG, WEBP, AVIF)"); return; }
    setUploadingImage(true); setUploadError("");
    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Failed to read image"));
        reader.readAsDataURL(file);
      });
      const optimizedDataUrl = await new Promise((resolve) => {
        const img = new window.Image();
        img.onload = () => {
          const maxDim = 1200; let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            if (width > height) { height = Math.round((height * maxDim) / width); width = maxDim; }
            else { width = Math.round((width * maxDim) / height); height = maxDim; }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width; canvas.height = height;
          canvas.getContext("2d").drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL(file.type === "image/png" ? "image/png" : "image/jpeg", 0.88));
        };
        img.onerror = () => resolve(dataUrl); img.src = dataUrl;
      });
      try {
        const res = await uploadAdminProductImage(token, optimizedDataUrl, file.name);
        setFormData((prev) => ({ ...prev, imageUrl: res?.imageUrl || optimizedDataUrl }));
      } catch { setFormData((prev) => ({ ...prev, imageUrl: optimizedDataUrl })); }
    } catch (err) { setUploadError(err.message || "Failed to process image"); }
    finally { setUploadingImage(false); if (fileInputRef.current) fileInputRef.current.value = ""; }
  };

  const handleAccordChange = (index, field, value) => {
    setAccords((prev) => {
      const copy = [...prev];
      const cur = typeof copy[index] === "object" && copy[index] !== null
        ? { ...copy[index] }
        : { name: String(copy[index] || ""), percentage: 60, color: "#c6a15b" };
      cur[field] = value;
      copy[index] = cur;
      return copy;
    });
  };

  const handleAddAccord = () => {
    const nextColor = ACCORD_COLORS[accords.length % ACCORD_COLORS.length];
    setAccords((prev) => [...prev, { name: "", percentage: 60, color: nextColor }]);
  };

  const handleRemoveAccord = (index) => {
    setAccords((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index, field, value) => setVariants((prev) => { const u = [...prev]; u[index] = { ...u[index], [field]: value }; return u; });
  const handleAddVariant = () => setVariants((prev) => [...prev, { size_ml: 20, price: 2499, stock: 15, active: true }]);
  const handleRemoveVariant = (index) => setVariants((prev) => prev.filter((_, idx) => idx !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) { alert("Perfume name is required."); return; }
    setSaving(true);
    const cleanAccords = normalizeAccords(accords).filter((a) => a.name && a.name.trim());
    await onSave({
      ...formData,
      variants,
      topNotes: Array.isArray(topNotes) ? topNotes.filter(Boolean) : [],
      middleNotes: Array.isArray(middleNotes) ? middleNotes.filter(Boolean) : [],
      baseNotes: Array.isArray(baseNotes) ? baseNotes.filter(Boolean) : [],
      accords: cleanAccords,
      vibe,
      longevity,
      projection,
      whenToWear,
    });
    setSaving(false);
  };

  const totalNotes = topNotes.length + middleNotes.length + baseNotes.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#171715] border border-white/15 p-6 lg:p-8 text-xs my-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 mb-6 gap-3">
          <div>
            <h2 className="font-display text-2xl text-[#f4efe6]">{product ? `Edit: ${product.name}` : "Add New Fragrance"}</h2>
            <p className="text-[11px] text-[#8e8a82] mt-0.5">Fill in basic details, then expand sections below to edit or add olfactory data.</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleToggleAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-[#c5c1b9] hover:text-[#f4efe6] bg-white/5 hover:bg-white/10 border border-white/15 rounded transition cursor-pointer"
            >
              <span>{allExpanded ? "Collapse Sections" : "Expand All Sections"}</span>
            </button>
            <button
              type="button"
              onClick={handleAutoFillFromCatalog}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-[#c6a15b] hover:text-[#11110f] bg-[#c6a15b]/10 hover:bg-[#c6a15b] border border-[#c6a15b]/30 rounded transition cursor-pointer"
              title="Auto-fill fragrance notes, accords, and performance from standard database"
            >
              <Sparkles size={13} />
              <span>Auto-Fill Standard Notes</span>
            </button>
            <button type="button" onClick={onClose} className="text-[#8e8a82] hover:text-[#f4efe6] cursor-pointer p-1"><X size={20} /></button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ── SECTION A: Basic Info ── */}
          <CollapsibleSection
            title="A. Basic Information"
            subtitle="Name, Brand, Category, Gender, Type"
            isOpen={sectionsOpen.info}
            onToggle={() => toggleSection("info")}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block uppercase tracking-wider text-[11px] text-[#8e8a82] mb-1 font-medium">Fragrance Name *</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Aventus / Tobacco Vanille" className="w-full bg-[#11110f] border border-white/15 px-3 py-2.5 text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none" />
              </div>
              <div>
                <label className="block uppercase tracking-wider text-[11px] text-[#8e8a82] mb-1 font-medium">Fragrance Brand</label>
                <input type="text" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} placeholder="e.g. Creed / Tom Ford / Roja" className="w-full bg-[#11110f] border border-white/15 px-3 py-2.5 text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block uppercase tracking-wider text-[11px] text-[#8e8a82] font-medium">Category</label>
                  {isCustomCategory && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomCategory(false);
                        setFormData((prev) => ({ ...prev, category: "Designer" }));
                      }}
                      className="text-[10px] text-[#c6a15b] hover:underline cursor-pointer"
                    >
                      ← Back to presets
                    </button>
                  )}
                </div>
                {!isCustomCategory ? (
                  <select
                    value={
                      CATEGORIES.some((c) => c.toLowerCase() === (formData.category || "").toLowerCase())
                        ? CATEGORIES.find((c) => c.toLowerCase() === (formData.category || "").toLowerCase())
                        : "__custom__"
                    }
                    onChange={(e) => {
                      if (e.target.value === "__custom__") {
                        setIsCustomCategory(true);
                      } else {
                        setFormData((prev) => ({ ...prev, category: e.target.value }));
                      }
                    }}
                    className="w-full bg-[#11110f] border border-white/15 px-3 py-2.5 text-xs text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} className="bg-[#171715]">{c}</option>
                    ))}
                    <option value="__custom__" className="bg-[#171715] text-[#c6a15b]">+ Custom Category...</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    placeholder="e.g. Gourmand / Aquatic"
                    className="w-full bg-[#11110f] border border-white/15 px-3 py-2.5 text-xs text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none"
                    autoFocus
                  />
                )}
              </div>
              <div>
                <label className="block uppercase tracking-wider text-[11px] text-[#8e8a82] mb-1.5 font-medium">Target Gender</label>
                <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="w-full bg-[#11110f] border border-white/15 px-3 py-2.5 text-xs text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none">
                  {GENDERS.map((g) => <option key={g} value={g} className="bg-[#171715]">{g}</option>)}
                </select>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block uppercase tracking-wider text-[11px] text-[#8e8a82] font-medium">Concentration</label>
                  {isCustomType && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomType(false);
                        setFormData((prev) => ({ ...prev, type: "EDP" }));
                      }}
                      className="text-[10px] text-[#c6a15b] hover:underline cursor-pointer"
                    >
                      ← Back to presets
                    </button>
                  )}
                </div>
                {!isCustomType ? (
                  <select
                    value={
                      CONCENTRATIONS.some((c) => c.toLowerCase() === (formData.type || "").trim().toLowerCase())
                        ? CONCENTRATIONS.find((c) => c.toLowerCase() === (formData.type || "").trim().toLowerCase())
                        : "__custom__"
                    }
                    onChange={(e) => {
                      if (e.target.value === "__custom__") {
                        setIsCustomType(true);
                      } else {
                        setFormData((prev) => ({ ...prev, type: e.target.value }));
                      }
                    }}
                    className="w-full bg-[#11110f] border border-white/15 px-3 py-2.5 text-xs text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none"
                  >
                    {CONCENTRATIONS.map((c) => (
                      <option key={c} value={c} className="bg-[#171715]">{c}</option>
                    ))}
                    <option value="__custom__" className="bg-[#171715] text-[#c6a15b]">+ Custom Concentration...</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={formData.type}
                    onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
                    placeholder="e.g. Absolu / Cologne Intense"
                    className="w-full bg-[#11110f] border border-white/15 px-3 py-2.5 text-xs text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none"
                    autoFocus
                  />
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block uppercase tracking-wider text-[11px] text-[#8e8a82] mb-1.5 font-medium">Weather / Season</label>
                <input type="text" value={formData.weather} onChange={(e) => setFormData({ ...formData, weather: e.target.value })} placeholder="e.g. Winter / Summer" className="w-full bg-[#11110f] border border-white/15 px-3 py-2.5 text-xs text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none" />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {SEASON_CHIPS.map((chip) => {
                    const active = isSeasonActive(formData.weather, chip);
                    return <button key={chip} type="button" onClick={() => setFormData((prev) => ({ ...prev, weather: toggleSeasonInString(prev.weather, chip) }))} className={`text-[10px] px-2 py-1 rounded border transition-colors cursor-pointer ${active ? "bg-[#c6a15b]/20 border-[#c6a15b] text-[#f4efe6] font-medium" : "bg-white/5 border-white/10 text-[#8e8a82] hover:border-white/20"}`}>{active ? `✓ ${chip}` : `+ ${chip}`}</button>;
                  })}
                </div>
              </div>
              <div>
                <label className="block uppercase tracking-wider text-[11px] text-[#8e8a82] mb-1.5 font-medium">Full Bottle Reference Price (₹)</label>
                <input type="number" value={formData.fullBottlePrice} onChange={(e) => setFormData({ ...formData, fullBottlePrice: e.target.value })} placeholder="e.g. 28000" className="w-full bg-[#11110f] border border-white/15 px-3 py-2.5 text-xs text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none" />
                <p className="text-[10px] text-[#8e8a82] mt-1.5">Original retail price for savings comparison.</p>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block uppercase tracking-wider text-[11px] text-[#8e8a82] font-medium">Bottle Image</label>
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploadingImage} className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-medium text-[#c6a15b] hover:text-[#11110f] bg-[#c6a15b]/10 hover:bg-[#c6a15b] border border-[#c6a15b]/30 rounded transition cursor-pointer disabled:opacity-50">
                  {uploadingImage ? <><Loader2 size={12} className="animate-spin" /><span>Uploading...</span></> : <><Upload size={12} /><span>Browse File</span></>}
                </button>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
              <div className="flex items-center gap-3">
                {formData.imageUrl && <div className="w-11 h-11 shrink-0 border border-white/15 bg-black/40 overflow-hidden flex items-center justify-center rounded"><img src={formData.imageUrl} alt="Preview" className="w-full h-full object-contain" onError={(e) => { e.currentTarget.style.display = "none"; }} /></div>}
                <div className="relative flex-1">
                  <input type="text" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} placeholder="/images/perfumes/aventus.png or paste URL" className="w-full bg-[#11110f] border border-white/15 px-3 py-2.5 text-xs text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none pr-8" />
                  {formData.imageUrl && <button type="button" onClick={() => setFormData({ ...formData, imageUrl: "" })} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8e8a82] hover:text-[#f4efe6] cursor-pointer"><X size={14} /></button>}
                </div>
              </div>
              {uploadError && <p className="text-[11px] text-rose-400 mt-1">{uploadError}</p>}
            </div>
            <div>
              <label className="block uppercase tracking-wider text-[11px] text-[#8e8a82] mb-1 font-medium">Description / Scent Profile</label>
              <textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe the fragrance character, opening, heart, and dry-down..." className="w-full bg-[#11110f] border border-white/15 p-3 text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none" />
            </div>
          </CollapsibleSection>

          {/* ── SECTION B: Perfume Pyramid (Notes) ── */}
          <CollapsibleSection
            title="B. Perfume Pyramid — Notes"
            subtitle="Top, Heart & Base notes shown on product page"
            badge={totalNotes > 0 ? `${totalNotes} notes` : "not set"}
            isOpen={sectionsOpen.notes}
            onToggle={() => toggleSection("notes")}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-white/5">
              <p className="text-[11px] text-[#8e8a82]">Type each note and press Enter or comma to add it. Click × to remove.</p>
              <button
                type="button"
                onClick={handleAutoFillFromCatalog}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-[#c6a15b] hover:text-[#11110f] bg-[#c6a15b]/15 hover:bg-[#c6a15b] border border-[#c6a15b]/30 rounded transition cursor-pointer self-start sm:self-auto shrink-0"
                title="Fill notes and accords automatically from standard perfume database"
              >
                <Sparkles size={12} />
                <span>Auto-Fill Notes for "{formData.name || product?.name || 'Perfume'}"</span>
              </button>
            </div>
            <TagInput label="🔝 Top Notes — Opening (First 15–30 mins)" tags={topNotes} onChange={setTopNotes} placeholder="e.g. Bergamot, Lemon, Pink Pepper..." />
            <TagInput label="💛 Middle / Heart Notes — Core Body (Hours 2–5)" tags={middleNotes} onChange={setMiddleNotes} placeholder="e.g. Rose, Iris, Jasmine..." />
            <TagInput label="🌑 Base Notes — Dry Down (Hours 5+)" tags={baseNotes} onChange={setBaseNotes} placeholder="e.g. Vanilla, Cedarwood, Amber, Musk..." />
          </CollapsibleSection>

          {/* ── SECTION C: Main Accords ── */}
          <CollapsibleSection
            title="C. Main Accords & Themes"
            subtitle="Coloured bars shown under the fragrance name"
            badge={accords.length > 0 ? `${accords.length} active` : "0 set"}
            isOpen={sectionsOpen.accords}
            onToggle={() => toggleSection("accords")}
          >
            <p className="text-[11px] text-[#8e8a82] -mt-1">
              Click any quick-add tag below to toggle it on/off, or click "Add Custom Accord". Drag slider to adjust bar width.
            </p>

            {/* Quick Add Preset Accords */}
            <div className="p-3 bg-white/5 rounded border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#8e8a82] font-semibold uppercase tracking-wider">
                  Quick Add / Toggle Accords:
                </span>
                <span className="text-[10px] text-[#c6a15b]">
                  {accords.length} selected
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {PRESET_ACCORDS.map((acc) => {
                  const isSelected = accords.some(
                    (a) => (typeof a === "string" ? a : a?.name || "").trim().toLowerCase() === acc.name.toLowerCase()
                  );
                  return (
                    <button
                      key={acc.name}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          // Toggle OFF (remove from list)
                          setAccords((prev) =>
                            prev.filter(
                              (a) => (typeof a === "string" ? a : a?.name || "").trim().toLowerCase() !== acc.name.toLowerCase()
                            )
                          );
                        } else {
                          // Toggle ON (add to list)
                          setAccords((prev) => [
                            ...prev,
                            { name: acc.name, percentage: acc.pct, color: acc.color },
                          ]);
                        }
                      }}
                      className={`text-[11px] px-2.5 py-1 rounded transition cursor-pointer flex items-center gap-1.5 border font-medium ${
                        isSelected
                          ? "bg-[#c6a15b] text-[#11110f] border-[#c6a15b] shadow-sm font-semibold"
                          : "bg-[#171715] hover:bg-[#c6a15b]/20 text-[#c5c1b9] hover:text-[#c6a15b] border-white/10 hover:border-[#c6a15b]/40"
                      }`}
                      title={isSelected ? `Click to remove ${acc.name}` : `Click to add ${acc.name}`}
                    >
                      <span className="font-bold">{isSelected ? "✓" : "+"}</span>
                      <span>{acc.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Accord Rows */}
            <div className="space-y-2">
              {accords.map((accord, i) => (
                <AccordRow
                  key={i}
                  accord={accord}
                  index={i}
                  onChange={handleAccordChange}
                  onRemove={handleRemoveAccord}
                />
              ))}
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleAddAccord}
                className="inline-flex items-center gap-1.5 text-[11px] text-[#c6a15b] hover:text-[#e4cf9b] hover:underline font-semibold cursor-pointer"
              >
                <Plus size={13} /> Add Custom Accord
              </button>
              {accords.length > 0 && (
                <button
                  type="button"
                  onClick={() => setAccords([])}
                  className="text-[10px] text-red-400 hover:text-red-300 underline cursor-pointer"
                >
                  Clear all accords
                </button>
              )}
            </div>

            {accords.length === 0 && (
              <p className="text-[11px] text-[#8e8a82] italic">
                No accords added yet — click any tag above or "Add Custom Accord".
              </p>
            )}
          </CollapsibleSection>

          {/* ── SECTION D: Performance & Character ── */}
          <CollapsibleSection
            title="D. Performance & Character"
            subtitle="Longevity, Projection & Vibe shown in product specs"
            badge={(longevity || projection || vibe) ? "set" : "not set"}
            isOpen={sectionsOpen.performance}
            onToggle={() => toggleSection("performance")}
          >
            <div>
              <label className="block uppercase tracking-wider text-[11px] text-[#8e8a82] mb-1.5 font-medium">Scent Vibe / Character</label>
              <input type="text" value={vibe} onChange={(e) => setVibe(e.target.value)} placeholder="e.g. Aged Pipe Tobacco, Warm Spices & Rich Resins" className="w-full bg-[#11110f] border border-white/15 px-3 py-2.5 text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none" />
              <p className="text-[10px] text-[#8e8a82] mt-1">Short evocative phrase shown next to the Perfume Pyramid header.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block uppercase tracking-wider text-[11px] text-[#8e8a82] mb-1.5 font-medium">Longevity</label>
                <select value={longevity} onChange={(e) => setLongevity(e.target.value)} className="w-full bg-[#11110f] border border-white/15 px-3 py-2.5 text-xs text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none">
                  <option value="" className="bg-[#171715] text-[#8e8a82]">— Select longevity —</option>
                  {LONGEVITY_OPTIONS.map((l) => <option key={l} value={l} className="bg-[#171715]">{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block uppercase tracking-wider text-[11px] text-[#8e8a82] mb-1.5 font-medium">Projection / Sillage</label>
                <select value={projection} onChange={(e) => setProjection(e.target.value)} className="w-full bg-[#11110f] border border-white/15 px-3 py-2.5 text-xs text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none">
                  <option value="" className="bg-[#171715] text-[#8e8a82]">— Select projection —</option>
                  {PROJECTION_OPTIONS.map((p) => <option key={p} value={p} className="bg-[#171715]">{p}</option>)}
                </select>
              </div>
            </div>
          </CollapsibleSection>

          {/* ── SECTION E: When to Wear ── */}
          <CollapsibleSection
            title="E. When to Wear — Season & Time Ratings"
            subtitle="Displayed as the season suitability chart"
            isOpen={sectionsOpen.whenToWear}
            onToggle={() => toggleSection("whenToWear")}
          >
            <p className="text-[11px] text-[#8e8a82] -mt-1">Drag each slider to set suitability. Higher % = more recommended.</p>
            <WhenToWearSliders values={whenToWear} onChange={setWhenToWear} />
          </CollapsibleSection>

          {/* ── SECTION F: Decant Sizes ── */}
          <CollapsibleSection
            title="F. Decant Sizes & Pricing (₹)"
            subtitle="Atomizer sizes, prices, and stock levels"
            badge={`${variants.length} size${variants.length !== 1 ? "s" : ""}`}
            isOpen={sectionsOpen.variants}
            onToggle={() => toggleSection("variants")}
          >
            <div className="space-y-2">
              {variants.map((v, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-[#171715] p-2.5 border border-white/5 rounded">
                  <div className="w-20">
                    <label className="block text-[10px] text-[#8e8a82]">Size (ml)</label>
                    <input type="number" required value={v.size_ml} onChange={(e) => handleVariantChange(idx, "size_ml", e.target.value)} className="w-full bg-[#11110f] border border-white/15 px-2.5 py-1.5 text-xs text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none" />
                  </div>
                  <div className="w-24">
                    <label className="block text-[10px] text-[#8e8a82]">Price (₹)</label>
                    <input type="number" required value={v.price} onChange={(e) => handleVariantChange(idx, "price", e.target.value)} className="w-full bg-[#11110f] border border-white/15 px-2.5 py-1.5 text-xs text-[#c6a15b] font-semibold focus:border-[#c6a15b] focus:outline-none" />
                  </div>
                  <div className="w-24">
                    <label className="block text-[10px] text-[#8e8a82]">Stock</label>
                    <input type="number" value={v.stock ?? 0} onChange={(e) => handleVariantChange(idx, "stock", e.target.value)} className="w-full bg-[#11110f] border border-white/15 px-2.5 py-1.5 text-xs text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none" />
                  </div>
                  <div className="flex items-center gap-1.5 mt-3">
                    <input type="checkbox" id={`active-${idx}`} checked={v.active} onChange={(e) => handleVariantChange(idx, "active", e.target.checked)} className="accent-[#c6a15b] cursor-pointer" />
                    <label htmlFor={`active-${idx}`} className="text-[11px] text-[#8e8a82] cursor-pointer">Active</label>
                  </div>
                  <button type="button" onClick={() => handleRemoveVariant(idx)} className="ml-auto text-red-400 hover:text-red-300 p-1 cursor-pointer"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
            <button type="button" onClick={handleAddVariant} className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-[#c6a15b] hover:underline font-semibold cursor-pointer mt-1"><Plus size={12} /> Add Size Variant</button>
          </CollapsibleSection>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
            <button type="button" onClick={onClose} className="border border-white/15 px-5 py-2.5 uppercase tracking-wider text-xs text-[#c5c1b9] hover:bg-white/5 transition cursor-pointer">Cancel</button>
            <button type="submit" disabled={saving} className="border border-[#c6a15b] bg-[#c6a15b] px-6 py-2.5 uppercase tracking-wider text-xs font-semibold text-[#11110f] hover:bg-[#d8c08a] transition disabled:opacity-50 cursor-pointer">{saving ? "Saving..." : product ? "Update Fragrance" : "Publish Fragrance"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
