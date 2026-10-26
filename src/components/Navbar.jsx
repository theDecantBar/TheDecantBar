
import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  UserRound,
  ShoppingBag,
  Menu,
  X,
  LogIn,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "motion/react";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import ShopTransition from "./ShopTransition";
import "./Navbar.css";

const navItems = [
  { name: "Shop", path: "/products" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
  { name: "FAQ", path: "/faq" },
];

export default function Navbar() {
  const shouldReduceMotion = useReducedMotion();
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === "/";

  const { cartCount } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopTransitionOpen, setShopTransitionOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [catalogProducts, setCatalogProducts] = useState([]);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);

  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);

  // Load the product catalogue once for autocomplete.
  useEffect(() => {
    const controller = new AbortController();

    async function loadCatalog() {
      try {
        const response = await fetch("/api/products", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to load perfume catalogue");
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setCatalogProducts(data);
        } else {
          console.error("Unexpected product catalogue response:", data);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Could not load search suggestions:", error);
        }
      }
    }

    loadCatalog();

    return () => controller.abort();
  }, []);

  // Match product name, brand, or category.
  useEffect(() => {
    const query = search.trim().toLowerCase();
    setActiveSuggestion(-1);

    if (!query) {
      setSearchSuggestions([]);
      setShowSearchSuggestions(false);
      return;
    }

    const matches = catalogProducts
      .filter((product) => {
        const name = String(product.name || "").toLowerCase();
        const brand = String(product.brand || "").toLowerCase();
        const category = String(product.category || "").toLowerCase();

        return (
          name.includes(query) ||
          brand.includes(query) ||
          category.includes(query)
        );
      })
      .slice(0, 8);

    setSearchSuggestions(matches);
    setShowSearchSuggestions(true);
  }, [search, catalogProducts]);

  // Close suggestions when clicking outside both search forms.
  useEffect(() => {
    function handleOutsideClick(event) {
      const insideDesktop =
        desktopSearchRef.current?.contains(event.target);
      const insideMobile =
        mobileSearchRef.current?.contains(event.target);

      if (!insideDesktop && !insideMobile) {
        setShowSearchSuggestions(false);
        setActiveSuggestion(-1);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, []);

  // Submit search or open the highlighted product.
  const handleSearchSubmit = useCallback(
    (event) => {
      event.preventDefault();

      const selectedProduct =
        activeSuggestion >= 0
          ? searchSuggestions[activeSuggestion]
          : null;

      if (selectedProduct?.id) {
        setShowSearchSuggestions(false);
        setMobileMenuOpen(false);
        navigate(`/product/${selectedProduct.id}`);
        return;
      }

      setMobileMenuOpen(false);
      setShowSearchSuggestions(false);
      setActiveSuggestion(-1);

      const query = search.trim();

      navigate(
        query
          ? `/products?search=${encodeURIComponent(query)}`
          : "/products"
      );
    },
    [activeSuggestion, navigate, search, searchSuggestions]
  );

  const handleSuggestionSelect = useCallback(
    (product) => {
      if (!product?.id) return;

      setSearch(product.name || "");
      setShowSearchSuggestions(false);
      setActiveSuggestion(-1);
      setMobileMenuOpen(false);
      navigate(`/product/${product.id}`);
    },
    [navigate]
  );

  const handleSearchKeyDown = useCallback(
    (event) => {
      if (event.key === "Escape") {
        setShowSearchSuggestions(false);
        setActiveSuggestion(-1);
        return;
      }

      if (!showSearchSuggestions || searchSuggestions.length === 0) {
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveSuggestion((current) =>
          current >= searchSuggestions.length - 1 ? 0 : current + 1
        );
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveSuggestion((current) =>
          current <= 0 ? searchSuggestions.length - 1 : current - 1
        );
      }
    },
    [searchSuggestions, showSearchSuggestions]
  );

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
    setShowSearchSuggestions(false);
    setActiveSuggestion(-1);
  }, []);

  // Show the Shop transition.
  const handleShopClick = useCallback((event) => {
    event.preventDefault();
    setMobileMenuOpen(false);
    setShowSearchSuggestions(false);
    setShopTransitionOpen(true);
  }, []);

  const finishShopTransition = useCallback(() => {
    setShopTransitionOpen(false);
    navigate("/products");
  }, [navigate]);

  // Prevent background scrolling while the mobile drawer is open.
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        setShowSearchSuggestions(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  // Read common image fields without assuming every product has an image.
  const getProductImage = (product) =>
    product.image_url ||
    product.imageUrl ||
    product.image ||
    product.thumbnail_url ||
    product.thumbnail ||
    "";

  // Luxury autocomplete shared by desktop and mobile.
  const renderSearchSuggestions = () => {
    if (!showSearchSuggestions || !search.trim()) return null;

    const query = search.trim();

    return (
      <AnimatePresence>
        <motion.div
          key="search-suggestions"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 7 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0, y: 5 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.18 }}
          className="absolute left-0 right-0 top-full z-[100] mt-2 overflow-hidden rounded-md border border-[#c6a15b]/35 bg-[#11110f] shadow-[0_18px_55px_rgba(0,0,0,0.65)] ring-1 ring-white/[0.04]"
          role="listbox"
          aria-label="Perfume suggestions"
        >
          {/* Dropdown heading */}
          <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3">
            <div className="flex items-center gap-2">
              <Sparkles
                size={13}
                strokeWidth={1.5}
                className="text-[#c6a15b]"
              />
              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                Discover fragrances
              </span>
            </div>

            {searchSuggestions.length > 0 && (
              <span className="text-[10px] tabular-nums text-[#817b70]">
                {searchSuggestions.length}{" "}
                {searchSuggestions.length === 1 ? "match" : "matches"}
              </span>
            )}
          </div>

          {/* Matching products */}
          {searchSuggestions.length > 0 ? (
            <div className="max-h-[min(390px,55vh)] overflow-y-auto overscroll-contain">
              {searchSuggestions.map((product, index) => {
                const image = getProductImage(product);
                const selected = activeSuggestion === index;

                return (
                  <button
                    key={product.id}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseEnter={() => setActiveSuggestion(index)}
                    onClick={() => handleSuggestionSelect(product)}
                    className={`group flex w-full items-center gap-3 border-b border-white/[0.055] px-3 py-3 text-left transition-colors duration-200 last:border-b-0 sm:px-4 ${
                      selected
                        ? "bg-[#c6a15b]/[0.10]"
                        : "hover:bg-white/[0.035]"
                    }`}
                  >
                    {/* Thumbnail with a fallback icon */}
                    <span className="relative flex h-[62px] w-[52px] shrink-0 items-center justify-center overflow-hidden rounded-sm border border-[#c6a15b]/15 bg-[#1b1a16] sm:h-[70px] sm:w-[58px]">
                      <span className="absolute inset-0 flex items-center justify-center">
                        <ShoppingBag
                          size={18}
                          strokeWidth={1}
                          className="text-[#c6a15b]/50"
                        />
                      </span>

                      {image && (
                        <img
                          src={image}
                          alt=""
                          loading="lazy"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                          className="relative z-[1] h-full w-full object-contain p-1.5 transition-transform duration-300 group-hover:scale-105"
                        />
                      )}
                    </span>

                    {/* Perfume details */}
                    <span className="min-w-0 flex-1 self-center">
                      <span className="block truncate text-[13px] font-medium tracking-wide text-[#f4efe6] transition-colors group-hover:text-[#e1c58d]">
                        {product.name || "Untitled fragrance"}
                      </span>

                      <span className="mt-1 block truncate text-[9px] font-medium uppercase tracking-[0.17em] text-[#a6a096]">
                        {product.brand || product.category || "Fragrance"}
                      </span>

                      {(product.price != null ||
                        product.variants?.length > 0) && (
                        <span className="mt-1.5 block truncate text-[10px] text-[#c6a15b]">
                          {product.price != null
                            ? `₹${product.price}`
                            : "Explore available sizes"}
                        </span>
                      )}
                    </span>

                    <ArrowUpRight
                      size={15}
                      strokeWidth={1.4}
                      className={`mr-1 shrink-0 transition-all duration-200 ${
                        selected
                          ? "translate-x-0 opacity-100 text-[#c6a15b]"
                          : "-translate-x-1 opacity-0 text-[#c6a15b] group-hover:translate-x-0 group-hover:opacity-100"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="px-5 py-7 text-center">
              <Search
                size={23}
                strokeWidth={1.2}
                className="mx-auto mb-3 text-[#c6a15b]/70"
              />

              <p className="text-sm text-[#f4efe6]">
                No fragrances found
              </p>

              <p className="mx-auto mt-1.5 max-w-[230px] text-xs leading-5 text-[#938d82]">
                Try a different perfume name or brand, or browse the full
                collection.
              </p>
            </div>
          )}

          {/* Search all results */}
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              setShowSearchSuggestions(false);
              setActiveSuggestion(-1);
              setMobileMenuOpen(false);
              navigate(
                `/products?search=${encodeURIComponent(query)}`
              );
            }}
            className="flex w-full items-center justify-between gap-3 border-t border-[#c6a15b]/20 bg-[#c6a15b]/[0.045] px-4 py-3.5 text-left transition-colors hover:bg-[#c6a15b]/[0.11]"
          >
            <span className="min-w-0">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#d6b779]">
                Search the collection
              </span>
              <span className="mt-1 block truncate text-xs text-[#a6a096]">
                View results for “{query}”
              </span>
            </span>

            <ArrowUpRight
              size={16}
              strokeWidth={1.5}
              className="shrink-0 text-[#c6a15b]"
            />
          </button>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <>
      <motion.header
        initial={
          shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }
        }
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: "easeOut" }}
        className={`storefront-navbar sticky top-0 z-50 w-full ${
          isHome
            ? "storefront-navbar--home"
            : "storefront-navbar--page"
        }`}
      >
        <nav className="mx-auto flex h-20 max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-8 lg:px-10 xl:px-16">
          {/* Mobile hamburger */}
          <div className="flex shrink-0 items-center lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
              className="text-[#f4efe6] transition-colors hover:text-[#c6a15b]"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>
          </div>

          {/* Brand logo */}
          <Link
            to="/"
            className="flex shrink-0 items-center transition-opacity hover:opacity-90"
            aria-label="The Decant Bar home"
          >
            <img
              src="/images/brand/decant-bar-logo.png"
              alt="The Decant Bar"
              className="h-9 w-auto object-contain sm:h-11 lg:h-12"
            />
          </Link>

          {/* Desktop navigation */}
          <div className="hidden shrink-0 items-center gap-5 xl:gap-8 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={
                  item.name === "Shop" ? handleShopClick : undefined
                }
                className="text-xs font-medium uppercase tracking-wider text-[#c5c1b9] transition-colors hover:text-[#c6a15b]"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop search */}
          <form
            ref={desktopSearchRef}
            onSubmit={handleSearchSubmit}
            role="search"
            className="relative hidden h-11 min-w-0 flex-1 items-center overflow-visible rounded-sm border border-white/15 bg-[#11110f] transition-all duration-300 focus-within:border-[#c6a15b]/80 focus-within:shadow-[0_0_0_1px_rgba(198,161,91,0.08)] md:flex md:max-w-56 lg:max-w-56 xl:max-w-72"
          >
            <Search
              size={16}
              strokeWidth={1.5}
              className="ml-3 shrink-0 text-[#c6a15b]"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onFocus={() => {
                if (search.trim()) setShowSearchSuggestions(true);
              }}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search fragrances..."
              aria-label="Search perfumes"
              aria-autocomplete="list"
              aria-expanded={
                showSearchSuggestions && Boolean(search.trim())
              }
              className="min-w-0 flex-1 bg-transparent px-2.5 text-sm text-[#f4efe6] outline-none placeholder:text-[#8e8a82]"
            />

            <button
              type="submit"
              aria-label="Submit search"
              className="flex h-full w-10 shrink-0 items-center justify-center border-l border-white/[0.08] text-[#c6a15b] transition-colors hover:bg-[#c6a15b] hover:text-[#11110f]"
            >
              <ArrowUpRight size={17} strokeWidth={1.5} />
            </button>

            {renderSearchSuggestions()}
          </form>

          {/* Action icons */}
          <div className="flex shrink-0 items-center gap-3 sm:gap-5">
            {isAuthenticated && user?.isAdmin && (
              <Link
                to="/admin"
                aria-label="Admin Portal"
                title="Open Admin Control Hub"
                className="hidden items-center gap-1.5 rounded border border-[#c6a15b]/40 bg-[#c6a15b]/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#c6a15b] transition hover:bg-[#c6a15b] hover:text-[#11110f] sm:inline-flex"
              >
                <ShieldCheck size={14} />
                <span>Admin</span>
              </Link>
            )}

            {/* Search shortcut on small screens */}
            <button
              type="button"
              onClick={() => {
                if (window.matchMedia("(max-width: 767px)").matches) {
                  setMobileMenuOpen(true);
                } else {
                  navigate("/products");
                }
              }}
              aria-label="Open search"
              className="text-[#f4efe6] transition-colors hover:text-[#c6a15b] md:hidden"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>

            {/* Account */}
            <Link
              to={isAuthenticated ? "/account" : "/login"}
              aria-label={isAuthenticated ? "My Account" : "Sign In"}
              className="hidden items-center gap-2 text-[#f4efe6] transition-colors hover:text-[#c6a15b] sm:flex"
            >
              <UserRound
                size={20}
                strokeWidth={1.5}
                className={
                  isAuthenticated
                    ? "text-[#c6a15b]"
                    : "text-[#f4efe6]"
                }
              />

              {isAuthenticated && user?.fullName && (
                <span className="hidden text-xs font-medium uppercase tracking-wider text-[#c5c1b9] xl:inline">
                  {user.fullName.split(" ")[0]}
                </span>
              )}
            </Link>

            {/* Shopping cart */}
            <Link
              to="/cart"
              aria-label={`Shopping Cart, ${cartCount} items`}
              className="relative text-[#f4efe6] transition-colors hover:text-[#c6a15b]"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#c6a15b] px-1 text-[9px] font-bold text-[#11110f]">
                {cartCount}
              </span>
            </Link>
          </div>
        </nav>

        {/* Mobile slide-out drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}
                onClick={closeMobileMenu}
                aria-hidden="true"
                className="fixed inset-0 bg-black/75 backdrop-blur-sm"
              />

              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.3,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="fixed bottom-0 left-0 top-0 z-50 flex h-screen h-[100dvh] w-[85vw] max-w-[320px] flex-col border-r border-white/10 bg-[#151512] text-[#f4efe6] shadow-2xl"
              >
                {/* Drawer header */}
                <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-6">
                  <Link
                    to="/"
                    onClick={closeMobileMenu}
                    className="flex items-center transition-opacity hover:opacity-90"
                    aria-label="The Decant Bar home"
                  >
                    <img
                      src="/images/brand/decant-bar-logo.png"
                      alt="The Decant Bar"
                      className="h-8 w-auto object-contain sm:h-9"
                    />
                  </Link>

                  <button
                    type="button"
                    onClick={closeMobileMenu}
                    aria-label="Close menu"
                    className="flex h-9 w-9 items-center justify-center rounded border border-white/10 text-[#c5c1b9] transition-colors hover:border-[#c6a15b]/50 hover:bg-white/5 hover:text-[#f4efe6] focus:outline-none focus:ring-1 focus:ring-[#c6a15b]"
                  >
                    <X size={20} strokeWidth={1.5} />
                  </button>
                </div>

                {/* Scrollable drawer content */}
                <div className="flex flex-1 flex-col justify-between overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {/* Mobile search */}
                  <form
                    ref={mobileSearchRef}
                    onSubmit={handleSearchSubmit}
                    role="search"
                    className="relative mx-6 mt-5 flex h-12 shrink-0 overflow-visible rounded-sm border border-white/15 bg-[#11110f] transition-colors focus-within:border-[#c6a15b]/80 focus-within:shadow-[0_0_0_1px_rgba(198,161,91,0.08)]"
                  >
                    <Search
                      size={16}
                      strokeWidth={1.5}
                      className="ml-3 shrink-0 self-center text-[#c6a15b]"
                    />

                    <input
                      type="search"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      onFocus={() => {
                        if (search.trim()) setShowSearchSuggestions(true);
                      }}
                      onKeyDown={handleSearchKeyDown}
                      placeholder="Search fragrances..."
                      aria-label="Search perfumes"
                      aria-autocomplete="list"
                      aria-expanded={
                        showSearchSuggestions && Boolean(search.trim())
                      }
                      className="min-w-0 flex-1 bg-transparent px-2.5 text-sm text-[#f4efe6] outline-none placeholder:text-[#8e8a82]"
                    />

                    <button
                      type="submit"
                      aria-label="Submit search"
                      className="flex w-11 shrink-0 items-center justify-center border-l border-white/[0.08] text-[#c6a15b] transition-colors hover:bg-[#c6a15b] hover:text-[#11110f]"
                    >
                      <ArrowUpRight size={17} strokeWidth={1.5} />
                    </button>

                    {renderSearchSuggestions()}
                  </form>

                  {/* Mobile navigation links */}
                  <nav className="flex flex-col space-y-1 px-6 pb-2 pt-5">
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={
                          item.name === "Shop"
                            ? handleShopClick
                            : closeMobileMenu
                        }
                        className="group flex items-center justify-between rounded py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#c5c1b9] transition-all hover:translate-x-1 hover:text-[#c6a15b]"
                      >
                        <span>{item.name}</span>
                        <span className="text-[10px] text-[#c6a15b] opacity-0 transition-opacity group-hover:opacity-100">
                          ›
                        </span>
                      </Link>
                    ))}
                  </nav>

                  {/* Drawer footer actions */}
                  <div className="mt-auto border-t border-white/10 bg-[#11110f]/70 px-6 py-5">
                    <div className="space-y-2.5">
                      {isAuthenticated ? (
                        <>
                          {user?.isAdmin && (
                            <Link
                              to="/admin"
                              onClick={closeMobileMenu}
                              className="flex items-center justify-between rounded border border-[#c6a15b]/40 bg-[#c6a15b]/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#c6a15b] transition-colors hover:bg-[#c6a15b] hover:text-[#11110f]"
                            >
                              <div className="flex items-center gap-3">
                                <ShieldCheck size={16} strokeWidth={1.5} />
                                <span>Admin Control Hub</span>
                              </div>
                              <span className="text-[10px] font-bold uppercase">
                                Portal
                              </span>
                            </Link>
                          )}

                          <Link
                            to="/account"
                            onClick={closeMobileMenu}
                            className="flex items-center justify-between rounded border border-white/10 bg-[#171715] px-4 py-3 text-xs font-medium uppercase tracking-[0.18em] text-[#c5c1b9] transition-colors hover:border-[#c6a15b]/60 hover:text-[#f4efe6]"
                          >
                            <div className="flex items-center gap-3">
                              <UserRound
                                size={16}
                                strokeWidth={1.5}
                                className="text-[#c6a15b]"
                              />
                              <span>My Account</span>
                            </div>
                            <span className="text-[10px] font-semibold text-[#c6a15b]">
                              {user?.fullName?.split(" ")[0]}
                            </span>
                          </Link>
                        </>
                      ) : (
                        <Link
                          to="/login"
                          onClick={closeMobileMenu}
                          className="flex items-center gap-3 rounded border border-white/10 bg-[#171715] px-4 py-3 text-xs font-medium uppercase tracking-[0.18em] text-[#c5c1b9] transition-colors hover:border-[#c6a15b]/60 hover:text-[#f4efe6]"
                        >
                          <LogIn
                            size={16}
                            strokeWidth={1.5}
                            className="text-[#c6a15b]"
                          />
                          <span>Sign In / Register</span>
                        </Link>
                      )}

                      <Link
                        to="/cart"
                        onClick={closeMobileMenu}
                        className="flex items-center justify-between rounded border border-[#c6a15b]/40 bg-[#c6a15b]/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#f4efe6] transition-colors hover:border-[#c6a15b] hover:bg-[#c6a15b]/20"
                      >
                        <div className="flex items-center gap-3">
                          <ShoppingBag
                            size={16}
                            strokeWidth={1.5}
                            className="text-[#c6a15b]"
                          />
                          <span>View Cart</span>
                        </div>
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#c6a15b] px-1.5 text-[10px] font-bold text-[#11110f]">
                          {cartCount}
                        </span>
                      </Link>
                    </div>

                    <p className="mt-4 text-center text-[10px] uppercase tracking-[0.2em] text-[#8e8a82]">
                      Authentic Luxury Decants
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Shop transition */}
      <AnimatePresence>
        {shopTransitionOpen && (
          <ShopTransition onFinish={finishShopTransition} />
        )}
      </AnimatePresence>
    </>
  );
}
