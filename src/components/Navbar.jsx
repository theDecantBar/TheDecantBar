
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, UserRound, ShoppingBag, Menu, X } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useCart } from "../context/CartContext";

const navItems = [
  { name: "Shop", path: "/products" },
  { name: "Men", path: "/products?gender=Men" },
  { name: "Women", path: "/products?gender=Women" },
  { name: "Unisex", path: "/products?gender=Unisex" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar() {
  const shouldReduceMotion = useReducedMotion();
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  // Prevent background scroll and close on Escape key when drawer is open
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
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
    <motion.header
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
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
          className="flex items-center transition-opacity hover:opacity-90 shrink-0"
          aria-label="The Decant Bar"
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
              className="text-xs font-medium uppercase tracking-wider text-[#c5c1b9] transition-colors hover:text-[#c6a15b]"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-5 sm:gap-6">
          <Link
            to="/shop"
            aria-label="Search"
            className="text-[#f4efe6] transition-colors hover:text-[#c6a15b]"
          >
            <Search size={20} strokeWidth={1.5} />
          </Link>

          <Link
            to="/account"
            aria-label="Account"
            className="hidden text-[#f4efe6] transition-colors hover:text-[#c6a15b] sm:block"
          >
            <UserRound size={20} strokeWidth={1.5} />
          </Link>

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

            {/* Slide-out Menu Panel */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 bottom-0 left-0 z-50 flex h-screen h-[100dvh] w-[85vw] max-w-[320px] flex-col border-r border-white/10 bg-[#151512] text-[#f4efe6] shadow-2xl"
            >
              {/* Drawer Header (Fixed at top) */}
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

              {/* Single Scrollable Content Container */}
              <div className="flex flex-1 flex-col justify-between overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {/* Primary Navigation Links */}
                <nav className="flex flex-col space-y-1 px-6 pt-5 pb-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={closeMobileMenu}
                      className="group flex items-center justify-between rounded py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#c5c1b9] transition-all hover:text-[#c6a15b] hover:translate-x-1"
                    >
                      <span>{item.name}</span>
                      <span className="text-[10px] text-[#c6a15b] opacity-0 transition-opacity group-hover:opacity-100">
                        ›
                      </span>
                    </Link>
                  ))}
                </nav>

                {/* Drawer Footer Actions (Distinct Bottom Section) */}
                <div className="mt-auto border-t border-white/10 bg-[#11110f]/70 px-6 py-5">
                  <div className="space-y-2.5">
                    <Link
                      to="/account"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 rounded border border-white/10 bg-[#171715] px-4 py-3 text-xs font-medium uppercase tracking-[0.18em] text-[#c5c1b9] transition-colors hover:border-[#c6a15b]/60 hover:text-[#f4efe6]"
                    >
                      <UserRound size={16} strokeWidth={1.5} className="text-[#c6a15b]" />
                      <span>My Account</span>
                    </Link>

                    <Link
                      to="/cart"
                      onClick={closeMobileMenu}
                      className="flex items-center justify-between rounded border border-[#c6a15b]/40 bg-[#c6a15b]/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#f4efe6] transition-colors hover:border-[#c6a15b] hover:bg-[#c6a15b]/20"
                    >
                      <div className="flex items-center gap-3">
                        <ShoppingBag size={16} strokeWidth={1.5} className="text-[#c6a15b]" />
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
  );
}