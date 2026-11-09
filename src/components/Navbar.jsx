import { BottomNavBar } from "@/components/ui/bottom-nav-bar";
import SearchModal from "./common/SearchModal";
import LiveSearch from "./common/LiveSearch";

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
  const activeNavIndex = location.pathname === "/" ? 0
    : location.pathname === "/products" || location.pathname === "/shop" || location.pathname.startsWith("/product/") ? 1
    : location.pathname === "/about" ? 2
    : location.pathname === "/contact" ? 3
    : location.pathname === "/faq" || location.pathname === "/faqs" ? 4 : -1;
  const handlePillNavigation = (item, event) => {
    if (item.href === "/products" && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey && event.button === 0) handleShopClick(event);
  };


  const { cartCount } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Global Ctrl+K / Cmd+K listener to open search modal
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  // Navigate to Shop directly without delay
  const handleShopClick = useCallback((event) => {
    event?.preventDefault();
    setMobileMenuOpen(false);
    navigate("/products");
  }, [navigate]);

  // Prevent background scrolling while the mobile drawer is open
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

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
              className="rounded-2xl text-[#f4efe6] transition-colors hover:text-[#c6a15b]"
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
              className="h-9 w-auto object-contain sm:h-10 lg:h-11"
            />
          </Link>

          {/* Rounded icon navigation with an expanding active label. */}
          <div className="hidden shrink-0 lg:block"><BottomNavBar activeIndex={activeNavIndex} onNavigate={handlePillNavigation} /></div>

          {/* Desktop Live Autocomplete Search Bar */}
          <div className="hidden min-w-0 flex-1 md:flex md:max-w-56 lg:max-w-64 xl:max-w-80">
            <LiveSearch />
          </div>

          {/* Action icons */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {isAuthenticated && user?.isAdmin && (
              <Link
                to="/admin"
                aria-label="Admin Portal"
                title="Open Admin Control Hub"
                className="hidden h-11 items-center gap-1.5 rounded-full border border-[#c6a15b]/40 bg-[#c6a15b]/10 px-3.5 text-[11px] font-semibold uppercase tracking-wider text-[#c6a15b] transition hover:bg-[#c6a15b] hover:text-[#11110f] sm:inline-flex"
              >
                <ShieldCheck size={14} />
                <span>Admin</span>
              </Link>
            )}

            {/* Mobile Search Button (Universal across all pages) */}
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              aria-label="Search fragrances"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-card text-[#c6a15b] transition-colors hover:bg-muted md:hidden cursor-pointer"
            >
              <Search size={18} strokeWidth={1.5} />
            </button>

            {/* Account */}
            <Link
              to={isAuthenticated ? "/account" : "/login"}
              aria-label={isAuthenticated ? "My Account" : "Sign In"}
              className={`flex h-11 shrink-0 items-center justify-center rounded-full border border-border bg-card text-[#c6a15b] transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c6a15b] ${
                !isHome && isAuthenticated && user?.fullName
                  ? "min-w-11 w-auto px-3.5"
                  : "w-11"
              }`}
            >
              <UserRound
                size={18}
                strokeWidth={1.5}
                className={
                  isHome || isAuthenticated
                    ? "text-[#c6a15b]"
                    : "text-[#f4efe6]"
                }
              />

              {!isHome && isAuthenticated && user?.fullName && (
                <span className="hidden text-xs font-medium uppercase tracking-wider text-[#c5c1b9] xl:inline pl-1.5">
                  {user.fullName.split(" ")[0]}
                </span>
              )}
            </Link>

            {/* Shopping cart */}
            <Link
              to="/cart"
              aria-label={`Shopping Cart, ${cartCount} items`}
              className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-card text-[#c6a15b] transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c6a15b]"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#c6a15b] px-1 text-[9px] font-bold text-[#11110f]">
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
                    className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 text-[#c5c1b9] transition-colors hover:border-[#c6a15b]/50 hover:bg-white/5 hover:text-[#f4efe6] focus:outline-none focus:ring-1 focus:ring-[#c6a15b]"
                  >
                    <X size={20} strokeWidth={1.5} />
                  </button>
                </div>

                {/* Scrollable drawer content */}
                <div className="flex flex-1 flex-col justify-between overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {/* Mobile Drawer Search Trigger */}
                  <button
                    type="button"
                    onClick={() => {
                      closeMobileMenu();
                      setSearchModalOpen(true);
                    }}
                    className="mx-6 mt-5 flex h-12 shrink-0 items-center gap-3 rounded-2xl border border-white/15 bg-[#11110f] px-4 text-xs text-[#8e8a82] hover:border-[#c6a15b]/80 hover:text-[#f4efe6] transition cursor-pointer"
                  >
                    <Search
                      size={16}
                      strokeWidth={1.5}
                      className="shrink-0 text-[#c6a15b]"
                    />
                    <span className="flex-1 text-left">Search 99+ fragrances...</span>
                  </button>

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
                              className="flex items-center justify-between rounded-2xl border border-[#c6a15b]/40 bg-[#c6a15b]/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#c6a15b] transition-colors hover:bg-[#c6a15b] hover:text-[#11110f]"
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
                            className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#171715] px-4 py-3 text-xs font-medium uppercase tracking-[0.18em] text-[#c5c1b9] transition-colors hover:border-[#c6a15b]/60 hover:text-[#f4efe6]"
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
                          className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#171715] px-4 py-3 text-xs font-medium uppercase tracking-[0.18em] text-[#c5c1b9] transition-colors hover:border-[#c6a15b]/60 hover:text-[#f4efe6]"
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
                        className="flex items-center justify-between rounded-2xl border border-[#c6a15b]/40 bg-[#c6a15b]/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#f4efe6] transition-colors hover:border-[#c6a15b] hover:bg-[#c6a15b]/20"
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

      {/* Universal Luxury Live Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </>
  );
}
