import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { SlidersHorizontal, ChevronDown, Check, X, RotateCcw } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

const CLASSIFICATION_OPTIONS = [
  { label: "Designer", value: "Designer" },
  { label: "Niche", value: "Niche" },
  { label: "Middle Eastern", value: "Middle eastern" },
  { label: "Fresh", value: "Fresh" },
  { label: "Woody", value: "Woody" },
];

const SEASON_OPTIONS = [
  { label: "Summer", value: "Summer" },
  { label: "Winter", value: "Winter" },
  { label: "Spring", value: "Spring" },
  { label: "Autumn / Fall", value: "Autumn" },
  { label: "All-Season", value: "All Season" },
];

const GENDER_OPTIONS = [
  { label: "Men", value: "Men" },
  { label: "Women", value: "Women" },
  { label: "Unisex", value: "Unisex" },
];

export default function FilterBar({ onApply }) {
  const shouldReduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const getInitialList = (paramName) => {
    const val = searchParams.get(paramName);
    return val ? val.split(",").map((s) => s.trim()).filter(Boolean) : [];
  };

  // State for selected filters
  const [selectedClassifications, setSelectedClassifications] = useState(() =>
    getInitialList("category")
  );
  const [selectedSeasons, setSelectedSeasons] = useState(() =>
    getInitialList("weather")
  );
  const [selectedGenders, setSelectedGenders] = useState(() =>
    getInitialList("gender")
  );
  const [prevParamsString, setPrevParamsString] = useState(searchParams.toString());

  const currentParamsString = searchParams.toString();
  if (prevParamsString !== currentParamsString) {
    setPrevParamsString(currentParamsString);
    setSelectedClassifications(getInitialList("category"));
    setSelectedSeasons(getInitialList("weather"));
    setSelectedGenders(getInitialList("gender"));
  }

  // Active open dropdown: null | 'classification' | 'season' | 'gender'
  const [openDropdown, setOpenDropdown] = useState(null);
  const containerRef = useRef(null);

  // Close dropdown on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const toggleOption = (list, setList, val) => {
    if (list.includes(val)) {
      setList(list.filter((item) => item !== val));
    } else {
      setList([...list, val]);
    }
  };

  const hasAnyFilter =
    selectedClassifications.length > 0 ||
    selectedSeasons.length > 0 ||
    selectedGenders.length > 0;

  const handleApply = () => {
    setOpenDropdown(null);

    const newParams = new URLSearchParams();

    // Preserve search text if currently on /products
    const currentSearch = searchParams.get("search");
    if (currentSearch) {
      newParams.set("search", currentSearch);
    }

    if (selectedClassifications.length > 0) {
      newParams.set("category", selectedClassifications.join(","));
    }

    if (selectedSeasons.length > 0) {
      newParams.set("weather", selectedSeasons.join(","));
    }

    if (selectedGenders.length > 0) {
      newParams.set("gender", selectedGenders.join(","));
    }

    if (onApply) {
      onApply(newParams);
    }

    const targetUrl = `/products?${newParams.toString()}`;

    // If already on /products, update searchParams without full navigation
    if (location.pathname === "/products" || location.pathname === "/shop") {
      setSearchParams(newParams);
    } else {
      navigate(targetUrl);
    }
  };

  const handleClearAll = () => {
    setSelectedClassifications([]);
    setSelectedSeasons([]);
    setSelectedGenders([]);
    setOpenDropdown(null);

    if (location.pathname === "/products" || location.pathname === "/shop") {
      const currentSearch = searchParams.get("search");
      if (currentSearch) {
        setSearchParams({ search: currentSearch });
      } else {
        setSearchParams({});
      }
    }
  };

  // Helper to format button label
  const getDropdownLabel = (title, selectedList, options) => {
    if (selectedList.length === 0) return title;
    if (selectedList.length === 1) {
      const match = options.find((o) => o.value.toLowerCase() === selectedList[0].toLowerCase());
      return match ? match.label : selectedList[0];
    }
    return `${title} (${selectedList.length})`;
  };

  // Luxury menu animation variants
  const dropdownVariants = {
    initial: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 },
    animate: { opacity: 1, y: 0 },
    exit: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 },
  };

  const dropdownTransition = {
    duration: 0.2,
    ease: [0.16, 1, 0.3, 1],
  };

  return (
    <section
      ref={containerRef}
      aria-label="Filter fragrances"
      className="border-y border-white/10 bg-[#11110f] py-4 text-[#f4efe6] transition-colors"
    >
      <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-16">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Left: Filter label / icon */}
          <div className="flex items-center gap-2.5 text-[#c6a15b]">
            <SlidersHorizontal size={17} strokeWidth={1.8} />
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#f4efe6]">
              Apply Filters
            </span>
          </div>

          {/* Center: The Three Filter Dropdowns */}
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:flex lg:items-center lg:gap-4">
            {/* 1. Fragrance Classification */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setOpenDropdown(openDropdown === "classification" ? null : "classification")
                }
                aria-expanded={openDropdown === "classification"}
                className={`group flex w-full items-center justify-between gap-3 border px-4 py-2.5 text-xs font-medium uppercase tracking-wider select-none transition-all duration-200 ease-out active:scale-[0.99] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c6a15b] ${
                  selectedClassifications.length > 0
                    ? "border-[#c6a15b] bg-[#c6a15b]/10 text-[#f4efe6] hover:border-[#d8b368] hover:bg-[#c6a15b]/15 hover:text-white"
                    : "border-white/15 bg-[#171714] text-[#c5c1b9] hover:border-[#c6a15b]/60 hover:bg-[#c6a15b]/5 hover:text-[#f4efe6]"
                }`}
              >
                <span className="truncate">
                  {getDropdownLabel("Classification", selectedClassifications, CLASSIFICATION_OPTIONS)}
                </span>
                <ChevronDown
                  size={14}
                  className={`shrink-0 transition-transform duration-200 ease-out ${
                    openDropdown === "classification"
                      ? "rotate-180 text-[#c6a15b]"
                      : "text-[#8e8a82] group-hover:text-[#c5c1b9]"
                  }`}
                />
              </button>

              <AnimatePresence>
                {openDropdown === "classification" && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={dropdownTransition}
                    className="absolute left-0 top-full z-40 mt-1.5 w-56 rounded border border-[#c6a15b]/30 bg-[#161613] p-2 shadow-2xl backdrop-blur-md"
                  >
                    <p className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8e8a82]">
                      Fragrance Classification
                    </p>
                    <div className="space-y-1">
                      {CLASSIFICATION_OPTIONS.map((opt) => {
                        const isSelected = selectedClassifications.some(
                          (v) => v.toLowerCase() === opt.value.toLowerCase()
                        );
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() =>
                              toggleOption(
                                selectedClassifications,
                                setSelectedClassifications,
                                opt.value
                              )
                            }
                            className="group flex w-full items-center justify-between rounded px-2.5 py-2 text-xs text-[#f4efe6] transition-colors duration-150 ease-out hover:bg-white/[0.06] active:bg-white/[0.09]"
                          >
                            <span
                              className={`transition-colors duration-150 ease-out ${
                                isSelected
                                  ? "font-semibold text-[#c6a15b]"
                                  : "text-[#c5c1b9] group-hover:text-[#f4efe6]"
                              }`}
                            >
                              {opt.label}
                            </span>
                            <span
                              className={`flex h-4 w-4 items-center justify-center rounded border transition-all duration-150 ease-out ${
                                isSelected
                                  ? "border-[#c6a15b] bg-[#c6a15b] text-[#11110f] scale-100"
                                  : "border-white/20 bg-transparent group-hover:border-white/40 scale-95"
                              }`}
                            >
                              {isSelected && <Check size={11} strokeWidth={2.5} />}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 2. Season */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === "season" ? null : "season")}
                aria-expanded={openDropdown === "season"}
                className={`group flex w-full items-center justify-between gap-3 border px-4 py-2.5 text-xs font-medium uppercase tracking-wider select-none transition-all duration-200 ease-out active:scale-[0.99] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c6a15b] ${
                  selectedSeasons.length > 0
                    ? "border-[#c6a15b] bg-[#c6a15b]/10 text-[#f4efe6] hover:border-[#d8b368] hover:bg-[#c6a15b]/15 hover:text-white"
                    : "border-white/15 bg-[#171714] text-[#c5c1b9] hover:border-[#c6a15b]/60 hover:bg-[#c6a15b]/5 hover:text-[#f4efe6]"
                }`}
              >
                <span className="truncate">
                  {getDropdownLabel("Season", selectedSeasons, SEASON_OPTIONS)}
                </span>
                <ChevronDown
                  size={14}
                  className={`shrink-0 transition-transform duration-200 ease-out ${
                    openDropdown === "season"
                      ? "rotate-180 text-[#c6a15b]"
                      : "text-[#8e8a82] group-hover:text-[#c5c1b9]"
                  }`}
                />
              </button>

              <AnimatePresence>
                {openDropdown === "season" && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={dropdownTransition}
                    className="absolute left-0 top-full z-40 mt-1.5 w-48 rounded border border-[#c6a15b]/30 bg-[#161613] p-2 shadow-2xl backdrop-blur-md"
                  >
                    <p className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8e8a82]">
                      Season
                    </p>
                    <div className="space-y-1">
                      {SEASON_OPTIONS.map((opt) => {
                        const isSelected = selectedSeasons.some(
                          (v) => v.toLowerCase() === opt.value.toLowerCase()
                        );
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() =>
                              toggleOption(selectedSeasons, setSelectedSeasons, opt.value)
                            }
                            className="group flex w-full items-center justify-between rounded px-2.5 py-2 text-xs text-[#f4efe6] transition-colors duration-150 ease-out hover:bg-white/[0.06] active:bg-white/[0.09]"
                          >
                            <span
                              className={`transition-colors duration-150 ease-out ${
                                isSelected
                                  ? "font-semibold text-[#c6a15b]"
                                  : "text-[#c5c1b9] group-hover:text-[#f4efe6]"
                              }`}
                            >
                              {opt.label}
                            </span>
                            <span
                              className={`flex h-4 w-4 items-center justify-center rounded border transition-all duration-150 ease-out ${
                                isSelected
                                  ? "border-[#c6a15b] bg-[#c6a15b] text-[#11110f] scale-100"
                                  : "border-white/20 bg-transparent group-hover:border-white/40 scale-95"
                              }`}
                            >
                              {isSelected && <Check size={11} strokeWidth={2.5} />}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 3. Gender */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === "gender" ? null : "gender")}
                aria-expanded={openDropdown === "gender"}
                className={`group flex w-full items-center justify-between gap-3 border px-4 py-2.5 text-xs font-medium uppercase tracking-wider select-none transition-all duration-200 ease-out active:scale-[0.99] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c6a15b] ${
                  selectedGenders.length > 0
                    ? "border-[#c6a15b] bg-[#c6a15b]/10 text-[#f4efe6] hover:border-[#d8b368] hover:bg-[#c6a15b]/15 hover:text-white"
                    : "border-white/15 bg-[#171714] text-[#c5c1b9] hover:border-[#c6a15b]/60 hover:bg-[#c6a15b]/5 hover:text-[#f4efe6]"
                }`}
              >
                <span className="truncate">
                  {getDropdownLabel("Gender", selectedGenders, GENDER_OPTIONS)}
                </span>
                <ChevronDown
                  size={14}
                  className={`shrink-0 transition-transform duration-200 ease-out ${
                    openDropdown === "gender"
                      ? "rotate-180 text-[#c6a15b]"
                      : "text-[#8e8a82] group-hover:text-[#c5c1b9]"
                  }`}
                />
              </button>

              <AnimatePresence>
                {openDropdown === "gender" && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={dropdownTransition}
                    className="absolute left-0 top-full z-40 mt-1.5 w-48 rounded border border-[#c6a15b]/30 bg-[#161613] p-2 shadow-2xl backdrop-blur-md"
                  >
                    <p className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8e8a82]">
                      Gender
                    </p>
                    <div className="space-y-1">
                      {GENDER_OPTIONS.map((opt) => {
                        const isSelected = selectedGenders.some(
                          (v) => v.toLowerCase() === opt.value.toLowerCase()
                        );
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() =>
                              toggleOption(selectedGenders, setSelectedGenders, opt.value)
                            }
                            className="group flex w-full items-center justify-between rounded px-2.5 py-2 text-xs text-[#f4efe6] transition-colors duration-150 ease-out hover:bg-white/[0.06] active:bg-white/[0.09]"
                          >
                            <span
                              className={`transition-colors duration-150 ease-out ${
                                isSelected
                                  ? "font-semibold text-[#c6a15b]"
                                  : "text-[#c5c1b9] group-hover:text-[#f4efe6]"
                              }`}
                            >
                              {opt.label}
                            </span>
                            <span
                              className={`flex h-4 w-4 items-center justify-center rounded border transition-all duration-150 ease-out ${
                                isSelected
                                  ? "border-[#c6a15b] bg-[#c6a15b] text-[#11110f] scale-100"
                                  : "border-white/20 bg-transparent group-hover:border-white/40 scale-95"
                              }`}
                            >
                              {isSelected && <Check size={11} strokeWidth={2.5} />}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right: Action Buttons (Apply Filters & Clear All) */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={handleApply}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-[#c6a15b] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#11110f] shadow-sm transition-all duration-150 ease-out hover:bg-[#d8b368] hover:shadow-[0_0_15px_rgba(198,161,91,0.25)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c6a15b]"
            >
              Apply Filters
            </button>

            {hasAnyFilter && (
              <button
                type="button"
                onClick={handleClearAll}
                title="Clear all filters"
                className="inline-flex items-center gap-1.5 border border-white/10 px-3.5 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-[#8e8a82] transition-all duration-150 ease-out hover:border-[#c6a15b]/50 hover:text-[#f4efe6] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c6a15b]"
              >
                <RotateCcw size={13} className="transition-transform duration-200 hover:-rotate-45" />
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>

        {/* Selected Filter Indicators / Removable Chips */}
        {hasAnyFilter && (
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-white/5 pt-3 text-xs">
            <span className="text-[11px] uppercase tracking-wider text-[#8e8a82]">
              Active:
            </span>

            {selectedClassifications.map((val) => {
              const opt = CLASSIFICATION_OPTIONS.find((o) => o.value.toLowerCase() === val.toLowerCase());
              return (
                <button
                  key={`cat-${val}`}
                  type="button"
                  onClick={() =>
                    toggleOption(
                      selectedClassifications,
                      setSelectedClassifications,
                      val
                    )
                  }
                  className="group inline-flex items-center gap-1.5 rounded-full border border-[#c6a15b]/40 bg-[#c6a15b]/10 px-2.5 py-0.5 text-[11px] text-[#f4efe6] transition-all duration-150 hover:border-[#c6a15b] hover:bg-[#c6a15b]/20 active:scale-95"
                >
                  <span>{opt ? opt.label : val}</span>
                  <X size={11} className="text-[#c6a15b] transition-transform duration-150 group-hover:scale-125" />
                </button>
              );
            })}

            {selectedSeasons.map((val) => {
              const opt = SEASON_OPTIONS.find((o) => o.value.toLowerCase() === val.toLowerCase());
              return (
                <button
                  key={`sea-${val}`}
                  type="button"
                  onClick={() =>
                    toggleOption(selectedSeasons, setSelectedSeasons, val)
                  }
                  className="group inline-flex items-center gap-1.5 rounded-full border border-[#c6a15b]/40 bg-[#c6a15b]/10 px-2.5 py-0.5 text-[11px] text-[#f4efe6] transition-all duration-150 hover:border-[#c6a15b] hover:bg-[#c6a15b]/20 active:scale-95"
                >
                  <span>{opt ? opt.label : val}</span>
                  <X size={11} className="text-[#c6a15b] transition-transform duration-150 group-hover:scale-125" />
                </button>
              );
            })}

            {selectedGenders.map((val) => {
              const opt = GENDER_OPTIONS.find((o) => o.value.toLowerCase() === val.toLowerCase());
              return (
                <button
                  key={`gen-${val}`}
                  type="button"
                  onClick={() =>
                    toggleOption(selectedGenders, setSelectedGenders, val)
                  }
                  className="group inline-flex items-center gap-1.5 rounded-full border border-[#c6a15b]/40 bg-[#c6a15b]/10 px-2.5 py-0.5 text-[11px] text-[#f4efe6] transition-all duration-150 hover:border-[#c6a15b] hover:bg-[#c6a15b]/20 active:scale-95"
                >
                  <span>{opt ? opt.label : val}</span>
                  <X size={11} className="text-[#c6a15b] transition-transform duration-150 group-hover:scale-125" />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
