import { Link } from "react-router-dom";
import Container from "./ui/Container";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#171715] text-[#c5c1b9]">
      <Container className="py-12 lg:py-16">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          {/* Brand Column (spans 2 on large screens) */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="inline-block transition-opacity hover:opacity-90"
              aria-label="The Decant Bar home"
            >
              <img
                src="/images/brand/decant-bar-logo.png"
                alt="The Decant Bar"
                className="h-10 w-auto object-contain"
              />
            </Link>

            <p className="mt-4 max-w-sm text-xs leading-6 text-[#8e8a82]">
              Exceptional perfumes, thoughtfully decanted into travel-friendly
              atomizers. Experience authentic luxury and niche fragrances, a
              little at a time.
            </p>

            <p className="mt-4 text-[11px] text-[#c6a15b] tracking-wider uppercase font-medium">
              ✦ Authentic Luxury · By the Drop ✦
            </p>
          </div>

          {/* Shop Column */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f4efe6]">
              Shop
            </h3>

            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link to="/shop" className="transition-colors hover:text-[#c6a15b]">
                  All Fragrances
                </Link>
              </li>
              
              <li>
                <Link to="/shop?gender=Men" className="transition-colors hover:text-[#c6a15b]">
                  Men
                </Link>
              </li>
              <li>
                <Link to="/shop?gender=Women" className="transition-colors hover:text-[#c6a15b]">
                  Women
                </Link>
              </li>
              <li>
                <Link to="/shop?gender=Unisex" className="transition-colors hover:text-[#c6a15b]">
                  Unisex
                </Link>
              </li>
            </ul>
          </div>

          {/* About & Support Column */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f4efe6]">
              About
            </h3>

            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link to="/about" className="transition-colors hover:text-[#c6a15b]">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/about" className="transition-colors hover:text-[#c6a15b]">
                  The Art of the Decant
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="transition-colors hover:text-[#c6a15b]">
                  Verified Reviews
                </Link>
              </li>
              <li>
                <Link to="/contact" className="transition-colors hover:text-[#c6a15b]">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care & Policies Column */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f4efe6]">
              Customer Care
            </h3>

            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link to="/faq" className="transition-colors hover:text-[#c6a15b]">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="transition-colors hover:text-[#c6a15b]">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="transition-colors hover:text-[#c6a15b]">
                  Refunds & Returns
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="transition-colors hover:text-[#c6a15b]">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="transition-colors hover:text-[#c6a15b]">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Compliance Links */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 text-[11px] text-[#8e8a82] md:flex-row">
          <p>© {currentYear} The Decant Bar. All rights reserved.</p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px]">
            <Link to="/faq" className="transition-colors hover:text-[#c6a15b]">
              FAQ
            </Link>
            <span className="text-white/20">·</span>
            <Link to="/privacy" className="transition-colors hover:text-[#c6a15b]">
              Privacy Policy
            </Link>
            <span className="text-white/20">·</span>
            <Link to="/terms" className="transition-colors hover:text-[#c6a15b]">
              Terms of Service
            </Link>
            <span className="text-white/20">·</span>
            <Link to="/shipping" className="transition-colors hover:text-[#c6a15b]">
              Shipping Policy
            </Link>
            <span className="text-white/20">·</span>
            <Link to="/refund-policy" className="transition-colors hover:text-[#c6a15b]">
              Refund Policy
            </Link>
          </div>

          <p className="tracking-wide">Less Commitment. More Discovery.</p>
        </div>
      </Container>
    </footer>
  );
}
