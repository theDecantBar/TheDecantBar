
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  UserRound,
  ShoppingBag,
  Menu,
  X,
  LogIn,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import ShopTransition from "./ShopTransition";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, UserRound, ShoppingBag, Menu, X, LogIn, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const navItems = [
  { name: "Shop", path: "/products" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar() {
  const shouldReduceMotion = useReducedMotion();
  const isHome = useLocation().pathname === "/";
  const { cartCount } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopTransitionOpen, setShopTransitionOpen] = useState(false);

  // Show the transition when Shop is clicked
  const handleShopClick = useCallback((event) => {
    event.preventDefault();
    setMobileMenuOpen(false);
    setShopTransitionOpen(true);
  }, []);

  // Navigate to the products page after the transition
  const finishShopTransition = useCallback(() => {
    setShopTransitionOpen(false);
    window.location.assign("/products");
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  // Prevent background scrolling and close the drawer with Escape
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
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#11110f]/90 backdrop-blur-md"
      >
        <nav className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-6 sm:px-8 lg:px-16">
          {/* Mobile Hamburger */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              className="text-[#f4efe6] transition-colors hover:text-[#c6a15b]"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>
          </div>

          {/* Brand Logo */}
          <Link
            to="/"
            className="flex shrink-0 items-center transition-opacity hover:opacity-90"
            aria-label="The Decant Bar"
    <motion.header
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={`storefront-navbar sticky top-0 z-50 w-full ${isHome ? "storefront-navbar--home" : "storefront-navbar--page"}`}
    >
      <nav className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-6 sm:px-8 lg:px-16">
        {/* Mobile Hamburger */}
        <div className="flex items-center lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
            className="text-[#f4efe6] transition-colors hover:text-[#c6a15b]"
          >
            <img
              src="/images/tdb-logo.png"
              alt="The Decant Bar"
              className="h-10 w-auto object-contain sm:h-12 lg:h-[50px]"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 lg:flex">
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

          {/* Action Icons */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Admin Link */}
            {isAuthenticated && user?.isAdmin && (
              <Link
                to="/admin"
                aria-label="Admin Portal"
                title="Open Admin Control Hub"
                className="inline-flex items-center gap-1.5 rounded border border-[#c6a15b]/40 bg-[#c6a15b]/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#c6a15b] transition hover:bg-[#c6a15b] hover:text-[#11110f]"
              >
                <ShieldCheck size={14} />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            )}

            {/* Search */}
            <Link
              to="/shop"
              aria-label="Search"
              className="text-[#f4efe6] transition-colors hover:text-[#c6a15b]"
            >
              <Search size={20} strokeWidth={1.5} />
            </Link>

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
                  isAuthenticated ? "text-[#c6a15b]" : "text-[#f4efe6]"
                }
              />

              {isAuthenticated && user?.fullName && (
                <span className="hidden text-xs font-medium uppercase tracking-wider text-[#c5c1b9] xl:inline">
                  {user.fullName.split(" ")[0]}
                </span>
              )}
            </Link>

            {/* Shopping Cart */}
            <Link
              to="/cart"
              aria-label="Shopping Cart"
              className="relative text-[#f4efe6] transition-colors hover:text-[#c6a15b]"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#c6a15b] text-[9px] font-bold text-[#11110f]">
                {cartCount}
              </span>
            </Link>
          </div>
        </nav>

        {/* Mobile Slide-Out Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={closeMobileMenu}
                aria-hidden="true"
                className="fixed inset-0 bg-black/75 backdrop-blur-sm"
              />

              {/* Slide-Out Menu Panel */}
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{
                  duration: 0.3,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="fixed bottom-0 left-0 top-0 z-50 flex h-screen h-[100dvh] w-[85vw] max-w-[320px] flex-col border-r border-white/10 bg-[#151512] text-[#f4efe6] shadow-2xl"
              >
                {/* Drawer Header */}
                <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-6">
                  <Link
                    to="/"
                    onClick={closeMobileMenu}
                    className="flex items-center transition-opacity hover:opacity-90"
                    aria-label="The Decant Bar"
                  >
                    <img
                      src="/images/tdb-logo.png"
                      alt="The Decant Bar"
                      className="h-10 w-auto object-contain sm:h-11"
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

                {/* Scrollable Drawer Content */}
                <div className="flex flex-1 flex-col justify-between overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {/* Mobile Navigation Links */}
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

                  {/* Drawer Footer Actions */}
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
                                <ShieldCheck
                                  size={16}
                                  strokeWidth={1.5}
                                />
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
                        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#c6a15b] px-1.5 text-[10px] font-bold text-[#11110f]">
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

      {/* Shop Transition — outside the header so it covers the page */}
      <AnimatePresence>
        {shopTransitionOpen && (
          <ShopTransition onFinish={finishShopTransition} />
        )}
      </AnimatePresence>
    </>
  );
}
