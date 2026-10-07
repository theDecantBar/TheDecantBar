import { Link } from "react-router-dom";
import Container from "./ui/Container";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#171715] text-[#c5c1b9]">
      <Container className="py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="font-display text-2xl tracking-wide text-[#f4efe6]"
            >
              The Decant Bar
            </Link>
            <p className="mt-4 max-w-sm text-xs leading-6 text-[#8e8a82]">
              Exceptional perfumes, thoughtfully decanted into travel-friendly
              atomizers. Experience authentic luxury fragrances, a little at a time.
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

          {/* About Column */}
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
                <Link to="/contact" className="transition-colors hover:text-[#c6a15b]">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support / Policies */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f4efe6]">
              Customer Care
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <span className="text-[#8e8a82]">Authenticity Guaranteed</span>
              </li>
              <li>
                <span className="text-[#8e8a82]">Track Order</span>
              </li>
              <li>
                <span className="text-[#8e8a82]">Shipping & Returns</span>
              </li>
              <li>
                <span className="text-[#8e8a82]">Privacy Policy</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-[11px] text-[#8e8a82] sm:flex-row">
          <p>© {currentYear} The Decant Bar. All rights reserved.</p>
          <p className="tracking-wide">Less Commitment. More Discovery.</p>
        </div>
      </Container>
    </footer>
  );
}
