import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, UserRound, ShoppingBag, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const navItems = [
  { name: "Shop", path: "/shop" },
  { name: "Men", path: "/shop?gender=Men" },
  { name: "Women", path: "/shop?gender=Women" },
  { name: "Unisex", path: "/shop?gender=Unisex" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#11110f]/90 backdrop-blur-md">
      <nav className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-6 sm:px-8 lg:px-16">
        
        {/* Left: Mobile Hamburger */}
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
          className="font-display text-2xl tracking-wide text-[#f4efe6] sm:text-3xl"
        >
          The Decant Bar
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
              0
            </span>
          </Link>
        </div>
      </nav>

      {/* Mobile Slide-Out Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMobileMenu}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden"
            />

            {/* Slide-out Menu Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 z-50 flex w-full max-w-xs flex-col justify-between border-r border-white/10 bg-[#171715] p-6 text-[#f4efe6] shadow-2xl lg:hidden"
            >
              <div>
                {/* Header inside drawer */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="font-display text-xl tracking-wide">
                    The Decant Bar
                  </span>
                  <button
                    type="button"
                    onClick={closeMobileMenu}
                    aria-label="Close menu"
                    className="p-1 text-[#c5c1b9] transition-colors hover:text-[#f4efe6]"
                  >
                    <X size={22} strokeWidth={1.5} />
                  </button>
                </div>

                {/* Nav Links */}
                <div className="mt-6 flex flex-col space-y-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={closeMobileMenu}
                      className="text-sm font-medium uppercase tracking-wider text-[#c5c1b9] transition-colors hover:text-[#c6a15b]"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="border-t border-white/10 pt-6">
                <div className="flex flex-col gap-3">
                  <Link
                    to="/account"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 text-xs uppercase tracking-wider text-[#c5c1b9] transition-colors hover:text-[#c6a15b]"
                  >
                    <UserRound size={16} />
                    <span>My Account</span>
                  </Link>
                  <Link
                    to="/cart"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 text-xs uppercase tracking-wider text-[#c5c1b9] transition-colors hover:text-[#c6a15b]"
                  >
                    <ShoppingBag size={16} />
                    <span>View Cart (0)</span>
                  </Link>
                </div>
                <p className="mt-6 text-[10px] tracking-wide text-[#8e8a82]">
                  Authentic luxury fragrances, decanted.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}