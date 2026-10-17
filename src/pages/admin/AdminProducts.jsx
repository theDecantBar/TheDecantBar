import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Sparkles,
  X,
  Upload,
  Loader2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  fetchAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  uploadAdminProductImage,
} from "../../services/adminApi";

const CATEGORIES = ["Designer", "Niche", "Middle Eastern", "Fresh", "Woody"];
const GENDERS = ["Men", "Women", "Unisex"];
const CONCENTRATIONS = [
  "EDP",
  "EDT",
  "Extrait de Parfum",
  "Parfum",
  "Elixir",
  "EDC",
  "Eau Fraiche",
];
const SEASON_PRESETS = [
  "All-Season",
  "Summer",
  "Winter",
];
const SEASON_CHIPS = ["Winter", "Summer",  "All-Season"];

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
                <th className="py-4 px-4">Decant Variants (Size · Price · Stock)</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-white/[0.02] transition">
                  {/* Fragrance Name & Image */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="h-12 w-12 object-contain bg-[#11110f] p-1 border border-white/10 shrink-0"
                        />
                      ) : (
                        <div className="h-12 w-12 bg-[#11110f] border border-white/10 flex items-center justify-center text-[10px] text-[#8e8a82] shrink-0">
                          No Pic
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-sm text-[#f4efe6]">{product.name}</p>
                        {product.full_bottle_price && (
                          <p className="text-[11px] text-[#8e8a82]">
                            Full Bottle: ₹{product.full_bottle_price}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Brand & Category */}
                  <td className="py-4 px-4 text-[#c5c1b9]">
                    <span className="inline-block px-2 py-0.5 text-[10px] uppercase font-semibold border border-white/10 bg-white/5 text-[#c6a15b] mb-1">
                      {product.category || "Designer"}
                    </span>
                    <p className="font-medium text-[#f4efe6]">{product.brand || "—"}</p>
                  </td>

                  {/* Gender & Type */}
                  <td className="py-4 px-4 text-[#8e8a82]">
                    <p className="text-[#f4efe6]">
                      {product.gender === "M"
                        ? "Men"
                        : product.gender === "W"
                          ? "Women"
                          : "Unisex"}
                    </p>
                    <p className="text-[11px]">{product.type || "EDP"}</p>
                  </td>

                  {/* Variants */}
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1.5 max-w-sm">
                      {product.variants?.map((v) => (
                        <span
                          key={v.id}
                          className={`inline-flex items-center gap-1.5 px-2 py-1 text-[11px] border ${v.stock <= 5
                              ? "border-rose-400/40 bg-rose-400/10 text-rose-300"
                              : "border-white/10 bg-[#11110f] text-[#f4efe6]"
                            }`}
                        >
                          <span className="font-semibold text-[#c6a15b]">{v.size_ml}ml:</span>
                          <span>₹{v.price}</span>
                          <span className="text-[10px] text-[#8e8a82]">({v.stock} left)</span>
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(product)}
                        className="p-2 border border-white/15 bg-white/5 text-[#f4efe6] hover:border-[#c6a15b] hover:text-[#c6a15b] transition cursor-pointer"
                        title="Edit Fragrance"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(product.id, product.name)}
                        className="p-2 border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition cursor-pointer"
                        title="Delete Fragrance"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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

// Sub-component: Add / Edit Product Modal
function ProductModal({ product, onClose, onSave, token }) {
  const fileInputRef = useRef(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState("");

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

  const [isCustomType, setIsCustomType] = useState(() => {
    if (!product?.type) return false;
    return !CONCENTRATIONS.some(
      (c) => c.toLowerCase() === product.type.trim().toLowerCase()
    );
  });

  const [isCustomCategory, setIsCustomCategory] = useState(() => {
    if (!product?.category) return false;
    return !CATEGORIES.some(
      (c) => c.toLowerCase() === product.category.trim().toLowerCase()
    );
  });

  const [isCustomWeather, setIsCustomWeather] = useState(() => {
    if (!product?.weather) return false;
    return !SEASON_PRESETS.some(
      (sp) => sp.toLowerCase() === product.weather.trim().toLowerCase()
    );
  });

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file (PNG, JPG, WEBP, AVIF)");
      return;
    }

    setUploadingImage(true);
    setUploadError("");

    try {
      // 1. Read file as Data URL
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Failed to read image file"));
        reader.readAsDataURL(file);
      });

      // 2. Client-side resize/compress large photos (e.g. 5-15MB phone camera shots)
      const optimizedDataUrl = await new Promise((resolve) => {
        const img = new window.Image();
        img.onload = () => {
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          const mime = file.type === "image/png" ? "image/png" : "image/jpeg";
          resolve(canvas.toDataURL(mime, 0.88));
        };
        img.onerror = () => resolve(dataUrl);
        img.src = dataUrl;
      });

      // 3. Upload to backend server
      try {
        const res = await uploadAdminProductImage(token, optimizedDataUrl, file.name);
        if (res?.imageUrl) {
          setFormData((prev) => ({ ...prev, imageUrl: res.imageUrl }));
        } else {
          setFormData((prev) => ({ ...prev, imageUrl: optimizedDataUrl }));
        }
      } catch (uploadErr) {
        console.warn("Upload endpoint failed, using base64 fallback:", uploadErr);
        setFormData((prev) => ({ ...prev, imageUrl: optimizedDataUrl }));
      }
    } catch (err) {
      console.error("Error processing image file:", err);
      setUploadError(err.message || "Failed to process image file");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Variants list
  const [variants, setVariants] = useState(() => {
    if (product?.variants && product.variants.length > 0) {
      return product.variants.map((v) => ({ ...v }));
    }
    // Default starting set for decants
    return [
      { size_ml: 2, price: 349, stock: 50, active: true },
      { size_ml: 5, price: 799, stock: 35, active: true },
      { size_ml: 10, price: 1499, stock: 20, active: true },
    ];
  });

  const [saving, setSaving] = useState(false);

  const handleVariantChange = (index, field, value) => {
    setVariants((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddVariant = () => {
    setVariants((prev) => [
      ...prev,
      { size_ml: 20, price: 2499, stock: 15, active: true },
    ]);
  };

  const handleRemoveVariant = (index) => {
    setVariants((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Perfume name is required.");
      return;
    }
    setSaving(true);
    await onSave({
      ...formData,
      variants,
    });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#171715] border border-white/15 p-6 lg:p-8 text-xs max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h2 className="font-display text-2xl text-[#f4efe6]">
              {product ? `Edit Fragrance: ${product.name}` : "Add New Fragrance"}
            </h2>
            <p className="text-[11px] text-[#8e8a82]">
              Configure master details and decant size atomizer options.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#8e8a82] hover:text-[#f4efe6]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block uppercase tracking-wider text-[11px] text-[#8e8a82] mb-1 font-medium">
                Fragrance Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Aventus / Tobacco Vanille"
                className="w-full bg-[#11110f] border border-white/15 px-3 py-2.5 text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider text-[11px] text-[#8e8a82] mb-1 font-medium">
                Fragrance Brand
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="e.g. Creed / Tom Ford / Roja"
                className="w-full bg-[#11110f] border border-white/15 px-3 py-2.5 text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none"
              />
            </div>
          </div>

          {/* Row 2: Category, Target Gender, Concentration Type (3 clean balanced dropdown columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Category with Dropdown + Custom option */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block uppercase tracking-wider text-[11px] text-[#8e8a82] font-medium">
                  Category
                </label>
                {isCustomCategory && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomCategory(false);
                      setFormData({ ...formData, category: "Designer" });
                    }}
                    className="text-[10px] text-[#c6a15b] hover:underline cursor-pointer"
                  >
                    Preset list
                  </button>
                )}
              </div>
              {!isCustomCategory ? (
                <select
                  value={
                    CATEGORIES.some(
                      (c) => c.toLowerCase() === (formData.category || "").toLowerCase()
                    )
                      ? CATEGORIES.find(
                          (c) => c.toLowerCase() === (formData.category || "").toLowerCase()
                        )
                      : "__custom__"
                  }
                  onChange={(e) => {
                    if (e.target.value === "__custom__") {
                      setIsCustomCategory(true);
                    } else {
                      setFormData({ ...formData, category: e.target.value });
                    }
                  }}
                  className="w-full bg-[#11110f] border border-white/15 px-3 py-2.5 text-xs text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} className="bg-[#171715] text-[#f4efe6]">
                      {c}
                    </option>
                  ))}
                  <option value="__custom__" className="bg-[#171715] text-[#c6a15b]">
                    + Custom Category...
                  </option>
                </select>
              ) : (
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g. Gourmand / Aquatic"
                  className="w-full bg-[#11110f] border border-white/15 px-3 py-2.5 text-xs text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none"
                  autoFocus
                />
              )}
            </div>

            {/* Target Gender */}
            <div>
              <label className="block uppercase tracking-wider text-[11px] text-[#8e8a82] mb-1.5 font-medium">
                Target Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full bg-[#11110f] border border-white/15 px-3 py-2.5 text-xs text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none"
              >
                {GENDERS.map((g) => (
                  <option key={g} value={g} className="bg-[#171715] text-[#f4efe6]">
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* Concentration Type with Dropdown + Custom option */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block uppercase tracking-wider text-[11px] text-[#8e8a82] font-medium">
                  Concentration Type
                </label>
                {isCustomType && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomType(false);
                      setFormData({ ...formData, type: "EDP" });
                    }}
                    className="text-[10px] text-[#c6a15b] hover:underline cursor-pointer"
                  >
                    Preset list
                  </button>
                )}
              </div>

              {!isCustomType ? (
                <select
                  value={
                    CONCENTRATIONS.some(
                      (c) => c.toLowerCase() === (formData.type || "").trim().toLowerCase()
                    )
                      ? CONCENTRATIONS.find(
                          (c) => c.toLowerCase() === (formData.type || "").trim().toLowerCase()
                        )
                      : "__custom__"
                  }
                  onChange={(e) => {
                    if (e.target.value === "__custom__") {
                      setIsCustomType(true);
                    } else {
                      setFormData({ ...formData, type: e.target.value });
                    }
                  }}
                  className="w-full bg-[#11110f] border border-white/15 px-3 py-2.5 text-xs text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none"
                >
                  {CONCENTRATIONS.map((c) => (
                    <option key={c} value={c} className="bg-[#171715] text-[#f4efe6]">
                      {c}
                    </option>
                  ))}
                  <option value="__custom__" className="bg-[#171715] text-[#c6a15b]">
                    + Custom Concentration...
                  </option>
                </select>
              ) : (
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  placeholder="e.g. Absolu / Cologne Intense"
                  className="w-full bg-[#11110f] border border-white/15 px-3 py-2.5 text-xs text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none"
                  autoFocus
                />
              )}
            </div>
          </div>

          {/* Row 3: Weather / Season & Reference Price (2 spacious balanced columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Weather / Season with select option inside the bar itself */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block uppercase tracking-wider text-[11px] text-[#8e8a82] font-medium">
                  Weather / Season
                </label>
                {isCustomWeather && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomWeather(false);
                      setFormData({ ...formData, weather: "All-Season" });
                    }}
                    className="text-[10px] text-[#c6a15b] hover:underline cursor-pointer"
                  >
                    Preset list
                  </button>
                )}
              </div>

              <input
                type="text"
                value={formData.weather}
                onChange={(e) => setFormData({ ...formData, weather: e.target.value })}
                placeholder="e.g. Winter / Summer"
                className="w-full bg-[#11110f] border border-white/15 px-3 py-2.5 text-xs text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none"
              />

              {/* Clickable Quick Season Chips for multiple combinations */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {SEASON_CHIPS.map((chip) => {
                  const active = isSeasonActive(formData.weather, chip);
                  return (
                    <button
                      key={chip}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          weather: toggleSeasonInString(prev.weather, chip),
                        }))
                      }
                      className={`text-[10px] px-2 py-1 rounded border transition-colors cursor-pointer ${
                        active
                          ? "bg-[#c6a15b]/20 border-[#c6a15b] text-[#f4efe6] font-medium shadow-sm"
                          : "bg-white/5 border-white/10 text-[#8e8a82] hover:text-[#f4efe6] hover:border-white/20"
                      }`}
                      title={`Toggle ${chip} in season`}
                    >
                      {active ? `✓ ${chip}` : `+ ${chip}`}
                    </button>
                  );
                })}
              </div>
              {!isCustomWeather ? (
                <select
                  value={
                    SEASON_PRESETS.some(
                      (sp) => sp.toLowerCase() === (formData.weather || "").trim().toLowerCase()
                    )
                      ? SEASON_PRESETS.find(
                          (sp) => sp.toLowerCase() === (formData.weather || "").trim().toLowerCase()
                        )
                      : "__custom__"
                  }
                  onChange={(e) => {
                    if (e.target.value === "__custom__") {
                      setIsCustomWeather(true);
                    } else {
                      setFormData({ ...formData, weather: e.target.value });
                    }
                  }}
                  className="w-full bg-[#11110f] border border-white/15 px-3 py-2.5 text-xs text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none"
                >
                  {SEASON_PRESETS.map((sp) => (
                    <option key={sp} value={sp} className="bg-[#171715] text-[#f4efe6]">
                      {sp}
                    </option>
                  ))}
                  <option value="__custom__" className="bg-[#171715] text-[#c6a15b]">
                    + Custom / Combined Seasons...
                  </option>
                </select>
              ) : (
                <>
                  <input
                    type="text"
                    value={formData.weather}
                    onChange={(e) => setFormData({ ...formData, weather: e.target.value })}
                    placeholder="e.g. Winter / Autumn"
                    className="w-full bg-[#11110f] border border-white/15 px-3 py-2.5 text-xs text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none"
                    autoFocus
                  />
                  {/* Clickable Quick Season Chips for multiple combinations */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {SEASON_CHIPS.map((chip) => {
                      const active = isSeasonActive(formData.weather, chip);
                      return (
                        <button
                          key={chip}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              weather: toggleSeasonInString(prev.weather, chip),
                            }))
                          }
                          className={`text-[10px] px-2 py-1 rounded border transition-colors cursor-pointer ${
                            active
                              ? "bg-[#c6a15b]/20 border-[#c6a15b] text-[#f4efe6] font-medium shadow-sm"
                              : "bg-white/5 border-white/10 text-[#8e8a82] hover:text-[#f4efe6] hover:border-white/20"
                          }`}
                          title={`Toggle ${chip} in season`}
                        >
                          {active ? `✓ ${chip}` : `+ ${chip}`}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Full Bottle Reference Price */}
            <div>
              <label className="block uppercase tracking-wider text-[11px] text-[#8e8a82] mb-1.5 font-medium">
                Full Bottle Reference Price (₹)
              </label>
              <input
                type="number"
                value={formData.fullBottlePrice}
                onChange={(e) => setFormData({ ...formData, fullBottlePrice: e.target.value })}
                placeholder="e.g. 28000"
                className="w-full bg-[#11110f] border border-white/15 px-3 py-2.5 text-xs text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none"
              />
              <p className="text-[10px] text-[#8e8a82] mt-2">
                Original retail price of the full presentation bottle for savings comparison.
              </p>
            </div>
          </div>

          {/* Row 4: Bottle Image URL & Upload */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block uppercase tracking-wider text-[11px] text-[#8e8a82] font-medium">
                Bottle Image URL
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-medium text-[#c6a15b] hover:text-[#11110f] bg-[#c6a15b]/10 hover:bg-[#c6a15b] border border-[#c6a15b]/30 rounded transition cursor-pointer disabled:opacity-50"
                title="Browse photo from your phone or laptop"
              >
                {uploadingImage ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload size={12} />
                    <span>Browse File</span>
                  </>
                )}
              </button>
            </div>

            {/* Hidden file input for file picker */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
            />

            <div className="flex items-center gap-3">
              {formData.imageUrl && (
                <div className="relative w-11 h-11 shrink-0 border border-white/15 bg-black/40 overflow-hidden flex items-center justify-center rounded">
                  <img
                    src={formData.imageUrl}
                    alt="Bottle preview"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
              <div className="relative flex-1">
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="/images/perfumes/aventus.png or browse photo"
                  className="w-full bg-[#11110f] border border-white/15 px-3 py-2.5 text-xs text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none pr-8"
                />
                {formData.imageUrl && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, imageUrl: "" })}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8e8a82] hover:text-[#f4efe6] transition cursor-pointer"
                    title="Clear image"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {uploadError && (
              <p className="text-[11px] text-rose-400 mt-1">{uploadError}</p>
            )}
            <p className="text-[10px] text-[#8e8a82] mt-1.5">
              Upload a bottle photo from laptop/phone or paste an image URL. Supports JPG, PNG, WEBP, AVIF.
            </p>
          </div>

          <div>
            <label className="block uppercase tracking-wider text-[11px] text-[#8e8a82] mb-1 font-medium">
              Description / Scent Profile
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Notes, opening, heart, dry-down details..."
              className="w-full bg-[#11110f] border border-white/15 p-3 text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none"
            />
          </div>

          {/* Decant Sizes & Pricing Section */}
          <div className="border border-white/10 bg-[#141412] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="uppercase tracking-wider font-semibold text-[#c6a15b] text-[11px]">
                Decant Sizes & Pricing (₹)
              </p>
              <button
                type="button"
                onClick={handleAddVariant}
                className="text-[11px] uppercase tracking-wider text-[#c6a15b] hover:underline font-semibold cursor-pointer"
              >
                + Add Size Variant
              </button>
            </div>

            <div className="space-y-2">
              {variants.map((v, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-[#171715] p-2.5 border border-white/5 rounded">
                  <div className="w-24">
                    <label className="block text-[10px] text-[#8e8a82]">Size (ml)</label>
                    <input
                      type="number"
                      required
                      value={v.size_ml}
                      onChange={(e) => handleVariantChange(idx, "size_ml", e.target.value)}
                      className="w-full bg-[#11110f] border border-white/15 px-2.5 py-1.5 text-xs text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none"
                    />
                  </div>

                  <div className="w-36">
                    <label className="block text-[10px] text-[#8e8a82]">Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={v.price}
                      onChange={(e) => handleVariantChange(idx, "price", e.target.value)}
                      className="w-full bg-[#11110f] border border-white/15 px-2.5 py-1.5 text-xs text-[#c6a15b] font-semibold focus:border-[#c6a15b] focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 mt-3">
                    <input
                      type="checkbox"
                      id={`active-${idx}`}
                      checked={v.active}
                      onChange={(e) => handleVariantChange(idx, "active", e.target.checked)}
                      className="accent-[#c6a15b] cursor-pointer"
                    />
                    <label htmlFor={`active-${idx}`} className="text-[11px] text-[#8e8a82] cursor-pointer">
                      Active
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(idx)}
                    className="ml-auto text-red-400 hover:text-red-300 p-1"
                    title="Remove Variant"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="border border-white/15 px-5 py-2.5 uppercase tracking-wider text-xs text-[#c5c1b9] hover:bg-white/5 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="border border-[#c6a15b] bg-[#c6a15b] px-6 py-2.5 uppercase tracking-wider text-xs font-semibold text-[#11110f] hover:bg-[#d8c08a] transition disabled:opacity-50"
            >
              {saving ? "Saving..." : product ? "Update Fragrance" : "Publish Fragrance"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
