import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
        delayChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#11110f]">
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.img
          src="/images/hero-perfume.png"
          alt="Luxury perfume"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
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
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="max-w-3xl"
        >
          <motion.p
            variants={itemVariants}
            className="mb-7 text-xs font-medium uppercase tracking-[0.25em] text-[#c6a15b]"
          >
            A small bottle. A lasting impression.
          </motion.p>

          <motion.h1
            variants={itemVariants}
            className="font-display text-6xl leading-[0.9] tracking-tight text-[#f4efe6] sm:text-7xl lg:text-[100px]"
          >
            Scents that
            <br />
            stay with you.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-9 max-w-xl text-base leading-7 text-[#c5c1b9] lg:text-lg"
          >
            Exceptional perfumes, thoughtfully decanted.
            Discover the world's most compelling fragrances,
            a little at a time.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-wrap gap-4"
          >
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
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}