import { Search, UserRound, ShoppingBag } from "lucide-react";

const navItems = [
  "Shop",
  "Men",
  "Women",
  "Unisex",
  "About",
  "Contact",
];

export default function Navbar() {
  return (
    <header className="absolute top-0 left-0 z-50 w-full border-b border-white/10 bg-[#11110f]/90 backdrop-blur-md">
      <nav className="mx-auto flex h-24 max-w-[1440px] items-center justify-between px-8 lg:px-16">

        {/* Logo */}
        <a
          href="/"
          className="font-display text-3xl tracking-wide text-[#f4efe6]"
        >
          The Decant Bar
        </a>

        {/* Navigation */}
        <div className="hidden items-center gap-10 lg:flex">
          {navItems.map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm text-[#d1cdc3] transition hover:text-[#c6a15b]"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Icons */}
        <div className="flex items-center gap-6">
          <button className="text-[#f4efe6] transition hover:text-[#c6a15b]">
            <Search size={21} strokeWidth={1.4} />
          </button>

          <button className="hidden text-[#f4efe6] transition hover:text-[#c6a15b] sm:block">
            <UserRound size={21} strokeWidth={1.4} />
          </button>

          <button className="relative text-[#f4efe6] transition hover:text-[#c6a15b]">
            <ShoppingBag size={21} strokeWidth={1.4} />

            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#c6a15b] text-[9px] text-black">
              0
            </span>
          </button>
        </div>

      </nav>
    </header>
  );
}