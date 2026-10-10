import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#11110f]">

      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-perfume.png"
          alt="Luxury perfume"
          className="h-full w-full object-cover"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/55" />

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1440px] items-center px-8 pt-24 lg:px-16">

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-3xl"
        >

          <p className="mb-7 text-xs font-medium uppercase tracking-[0.25em] text-[#c6a15b]">
            A small bottle. A lasting impression.
          </p>

          <h1 className="font-display text-6xl leading-[0.9] tracking-tight text-[#f4efe6] sm:text-7xl lg:text-[100px]">
            Scents that
            <br />
            stay with you.
          </h1>

          <p className="mt-9 max-w-xl text-base leading-7 text-[#c5c1b9] lg:text-lg">
            Exceptional perfumes, thoughtfully decanted.
            Discover the world's most compelling fragrances,
            a little at a time.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">

            <Link
              to="/products"
              className="group flex items-center gap-4 bg-[#c6a15b] px-7 py-4 text-xs font-semibold uppercase tracking-wider text-[#11110f] transition hover:bg-[#d8c08a]"
            >
              Shop Fragrances

              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>

            <Link
              to="/products"
              className="flex items-center gap-4 border border-white/25 px-7 py-4 text-xs font-semibold uppercase tracking-wider text-white transition hover:border-[#c6a15b] hover:text-[#c6a15b]"
            >
              Explore Collection
            </Link>

          </div>

        </motion.div>
      </div>
    </section>
  );
}