import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import Container from "../components/ui/Container";

const whyDecants = [
  {
    number: "01",
    title: "Explore Before You Commit",
    description:
      "Test a fragrance thoroughly on your skin across different settings and temperatures before investing in a full bottle.",
  },
  {
    number: "02",
    title: "Discover More",
    description:
      "Experience a wide variety of houses, olfactive families, and rare scent profiles from world-renowned perfumers.",
  },
  {
    number: "03",
    title: "Travel Friendly",
    description:
      "Compact, leak-resistant 2 ml, 5 ml, and 10 ml atomizers that fit effortlessly into your pocket, travel pouch, or daily carry.",
  },
  {
    number: "04",
    title: "Build Your Collection",
    description:
      "Curate a versatile fragrance wardrobe suited for every season, occasion, and mood without unnecessary excess.",
  },
];

const journeySteps = [
  {
    number: "01",
    tag: "CURATE",
    title: "Choose Your Fragrance",
    description:
      "Explore our catalog of designer, niche, and Middle Eastern perfumes from established fragrance houses.",
  },
  {
    number: "02",
    tag: "SELECT",
    title: "Choose Your Decant Size",
    description:
      "Select your trial size: 2 ml for initial impressions, 5 ml for week-long wear, or 10 ml for your everyday companion.",
  },
  {
    number: "03",
    tag: "LIVE WITH IT",
    title: "Experience It",
    description:
      "Receive your carefully prepared decant in protective packaging, ready to be worn, lived with, and truly understood.",
  },
];

const standards = [
  {
    number: "01",
    title: "Curated Selection",
    description:
      "Thoughtfully chosen fragrances from established perfume houses, offering a balanced spectrum from modern icons to niche discoveries.",
  },
  {
    number: "02",
    title: "Authentic Fragrance Experience",
    description:
      "Each portion is transferred directly from genuine retail bottles into specialized atomizers to preserve the integrity of the original scent.",
  },
  {
    number: "03",
    title: "Carefully Prepared Decants",
    description:
      "Prepared with precision using dedicated tools, paired with fine-mist spray atomizers designed for an optimal wear experience.",
  },
];

export default function About() {
  return (
    <div className="bg-[#11110f] text-[#f4efe6] overflow-x-hidden">
      
      {/* ─────────────────────────────────────────────
          SECTION 1 — CINEMATIC ABOUT HERO
      ────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] border-b border-white/10 py-16 sm:py-24 lg:py-28 flex items-center">
        <Container>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            
            {/* Left: Editorial Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:col-span-7 flex flex-col justify-between"
            >
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#c6a15b]">
                  Our Story
                </p>
                <h1 className="mt-4 font-display text-4xl leading-[1.05] tracking-tight text-[#f4efe6] sm:text-6xl lg:text-7xl">
                  A Better Way to Discover Fragrance.
                </h1>
                <p className="mt-8 max-w-xl text-base leading-relaxed text-[#c5c1b9] sm:text-lg">
                  The Decant Bar was created to make fine perfumery personal, deliberate, and accessible.
                  We believe discovering your signature scent should be an exploratory journey—experienced
                  a little at a time before committing to a full bottle.
                </p>
              </div>

              {/* Scroll Indicator */}
              <div className="mt-14 hidden items-center gap-3 text-[10px] font-medium uppercase tracking-[0.25em] text-[#8e8a82] lg:flex">
                <span>Scroll to discover</span>
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                >
                  <ArrowDown size={14} className="text-[#c6a15b]" />
                </motion.div>
              </div>
            </motion.div>

            {/* Right: Framed Vertical Editorial Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
              className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none"
            >
              {/* Secondary Offset Frame */}
              <div className="absolute -bottom-3 -right-3 h-full w-full border border-white/15 pointer-events-none sm:-bottom-4 sm:-right-4" />
              
              {/* Main Image Container */}
              <div className="relative aspect-[3/4] w-full overflow-hidden border border-[#c6a15b]/40 bg-[#171715] shadow-2xl">
                <img
                  src="/images/about/about-hero.jpg"
                  alt="Luxury perfume decants on natural stone"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="eager"
                />

                {/* Floating Subtle Label */}
                <div className="absolute bottom-4 left-4 border border-white/10 bg-[#11110f]/80 px-3 py-1.5 backdrop-blur-md">
                  <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#d8c08a]">
                    The Art of Discovery
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </Container>
      </section>

      {/* ─────────────────────────────────────────────
          SECTION 2 — EDITORIAL BRAND STORY
      ────────────────────────────────────────────── */}
      <section className="border-b border-white/10 py-20 sm:py-28 lg:py-36">
        <Container>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-20">
            
            {/* Image Side */}
            <div className="relative order-2 lg:order-1 lg:col-span-6">
              <div className="relative aspect-[4/3] w-full overflow-hidden border border-white/10 bg-[#171715]">
                <div className="pointer-events-none absolute inset-3 border border-white/5 z-10" />
                <img
                  src="/images/about/about-story.jpg"
                  alt="Fragrance decanting studio"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Text Side */}
            <div className="order-1 lg:order-2 lg:col-span-6">
              <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#c6a15b]">
                The Platform
              </p>
              <h2 className="mt-3 font-display text-3xl tracking-tight text-[#f4efe6] sm:text-4xl lg:text-5xl">
                The Decant Bar
              </h2>
              
              {/* Thin Gold Separator */}
              <div className="my-6 h-px w-16 bg-[#c6a15b]/60" />

              <div className="space-y-5 text-sm leading-relaxed text-[#c5c1b9] sm:text-base">
                <p>
                  A full bottle of luxury perfume is a substantial commitment. Often, a quick spritz
                  at a busy boutique counter cannot tell you how a complex fragrance evolves on your
                  skin throughout the day and evening.
                </p>
                <p>
                  The Decant Bar was founded as a dedicated fragrance decanting platform. We source
                  genuine bottles from established perfume houses and carefully decant them into smaller,
                  travel-ready atomizers.
                </p>
                <p>
                  We do not formulate or manufacture our own perfumes; rather, we provide a transparent,
                  refined bridge between fragrance lovers and the world's most compelling scent creations.
                </p>
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* ─────────────────────────────────────────────
          SECTION 3 — LARGE EDITORIAL STATEMENT
      ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-white/10 bg-[#141412] py-28 sm:py-36 lg:py-44 text-center">
        {/* Low-opacity Oversized Watermark Word */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center select-none overflow-hidden">
          <span className="font-display text-[22vw] uppercase tracking-widest text-white/[0.02] leading-none">
            DISCOVER
          </span>
        </div>

        <Container className="relative z-10">
          <div className="mx-auto max-w-3xl">
            <div className="mx-auto mb-8 h-10 w-px bg-[#c6a15b]/50" />
            
            <h2 className="font-display text-3xl italic tracking-tight text-[#f4efe6] sm:text-5xl lg:text-6xl">
              “Discover before you commit.”
            </h2>

            <p className="mx-auto mt-7 max-w-lg text-xs sm:text-sm leading-relaxed text-[#c5c1b9]">
              Wear it on your skin. Experience the opening, the heart, and the dry-down across your real routine.
              Let your signature scent find you naturally.
            </p>
          </div>
        </Container>
      </section>

      {/* ─────────────────────────────────────────────
          SECTION 4 — WHY DECANTS (INTERACTIVE GRID)
      ────────────────────────────────────────────── */}
      <section className="border-b border-white/10 py-20 sm:py-28 lg:py-36">
        <Container>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#c6a15b]">
                Why Decants
              </p>
              <h2 className="mt-3 font-display text-3xl tracking-tight text-[#f4efe6] sm:text-4xl lg:text-5xl">
                Freedom in Every Spray.
              </h2>
            </div>
            <p className="max-w-xs text-xs text-[#8e8a82]">
              The considered way to explore luxury perfumery without compromise.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyDecants.map((item) => (
              <div
                key={item.number}
                className="group relative flex flex-col justify-between border border-white/10 bg-[#171715] p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#c6a15b]/60 hover:bg-[#1a1916]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-2xl text-[#8e8a82] transition-colors duration-300 group-hover:text-[#c6a15b]">
                      {item.number}
                    </span>
                    <ArrowUpRight
                      size={16}
                      className="text-[#8e8a82] opacity-0 -translate-x-1 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-[#c6a15b]"
                    />
                  </div>

                  <h3 className="mt-6 font-display text-xl text-[#f4efe6]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-[#c5c1b9]">
                    {item.description}
                  </p>
                </div>

                {/* Subtle bottom line indicator */}
                <div className="mt-6 h-px w-0 bg-[#c6a15b] transition-all duration-300 group-hover:w-full" />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─────────────────────────────────────────────
          SECTION 5 — THE DISCOVERY JOURNEY (TIMELINE)
      ────────────────────────────────────────────── */}
      <section className="border-b border-white/10 bg-[#171715] py-20 sm:py-28 lg:py-36">
        <Container>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#c6a15b]">
              The Experience
            </p>
            <h2 className="mt-3 font-display text-3xl tracking-tight text-[#f4efe6] sm:text-4xl lg:text-5xl">
              From Curiosity to Signature.
            </h2>
          </div>

          {/* Desktop & Mobile Responsive Timeline */}
          <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-8 relative">
            
            {journeySteps.map((step, index) => (
              <div
                key={step.number}
                className="group relative flex flex-col border border-white/5 bg-[#11110f] p-8 transition-all duration-300 hover:border-[#c6a15b]/40"
              >
                {/* Step Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="font-display text-3xl text-[#c6a15b] transition-colors group-hover:text-[#d8c08a]">
                    {step.number}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8e8a82]">
                    {step.tag}
                  </span>
                </div>

                <h3 className="mt-6 font-display text-2xl text-[#f4efe6]">
                  {step.title}
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-[#c5c1b9]">
                  {step.description}
                </p>

                {/* Desktop Connecting Hairline (for steps 1 and 2) */}
                {index < 2 && (
                  <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
                    <span className="text-xs text-[#c6a15b]/40">→</span>
                  </div>
                )}
              </div>
            ))}

          </div>
        </Container>
      </section>

      {/* ─────────────────────────────────────────────
          SECTION 6 — FRAGRANCE IMAGE MOMENT (FULL BANNER)
      ────────────────────────────────────────────── */}
      <section className="relative min-h-[60vh] sm:min-h-[70vh] border-b border-white/10 flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/images/about/about-moment.jpg"
            alt="Cinematic fragrance mist with golden light"
            className="h-full w-full object-cover"
            loading="lazy"
          />
          {/* Dark Overlay Gradient */}
          <div className="absolute inset-0 bg-black/60 backdrop-brightness-75" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#11110f] via-transparent to-[#11110f]/80" />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-2xl px-6 py-20 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#d8c08a]">
            Fragrance is Personal
          </p>
          <h2 className="mt-4 font-display text-3xl sm:text-5xl lg:text-6xl text-[#f4efe6] leading-tight">
            “It changes with your skin, your surroundings, and your moments.”
          </h2>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          SECTION 7 — OUR PHILOSOPHY (ASYMMETRICAL)
      ────────────────────────────────────────────── */}
      <section className="border-b border-white/10 py-24 sm:py-32 lg:py-40">
        <Container>
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
            
            {/* Left: Oversized Decorative Mark */}
            <div className="lg:col-span-4 flex items-center justify-start lg:justify-center">
              <span className="font-display text-8xl lg:text-[140px] text-[#c6a15b]/20 select-none leading-none">
                “
              </span>
            </div>

            {/* Middle: Gold Vertical Hairline (Desktop) */}
            <div className="hidden lg:block h-32 w-px bg-[#c6a15b]/30" />

            {/* Right: Text Block */}
            <div className="lg:col-span-7">
              <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#c6a15b]">
                Our Philosophy
              </p>
              <h2 className="mt-3 font-display text-3xl tracking-tight text-[#f4efe6] sm:text-4xl lg:text-5xl">
                Fragrance Should Be Discovered, Not Rushed.
              </h2>
              <p className="mt-6 text-sm sm:text-base leading-relaxed text-[#c5c1b9]">
                A true signature perfume is an intimate extension of your individuality. It transforms
                from dawn to dusk, reacting uniquely to your body chemistry and environment.
                By experiencing scents through measured decants across multiple wears, you discover
                what genuinely belongs with you.
              </p>
            </div>

          </div>
        </Container>
      </section>

      {/* ─────────────────────────────────────────────
          SECTION 8 — CARE & PRECISION (IMAGE + ROWS)
      ────────────────────────────────────────────── */}
      <section className="border-b border-white/10 bg-[#171715] py-20 sm:py-28 lg:py-36">
        <Container>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            
            {/* Left Image Frame */}
            <div className="relative lg:col-span-5">
              <div className="relative aspect-[3/4] w-full overflow-hidden border border-white/10 bg-[#11110f]">
                <div className="pointer-events-none absolute inset-3 border border-white/5 z-10" />
                <img
                  src="/images/about/about-hero.jpg"
                  alt="Precision decanting bottles"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Right Rows */}
            <div className="lg:col-span-7">
              <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#c6a15b]">
                Standards
              </p>
              <h2 className="mt-3 font-display text-3xl tracking-tight text-[#f4efe6] sm:text-4xl lg:text-5xl">
                Care & Precision
              </h2>

              <div className="mt-10 space-y-6">
                {standards.map((item) => (
                  <div
                    key={item.number}
                    className="group border-t border-white/10 pt-6 transition-all duration-300 hover:translate-x-2"
                  >
                    <div className="flex items-start gap-4">
                      <span className="font-display text-lg text-[#8e8a82] transition-colors group-hover:text-[#c6a15b]">
                        {item.number}
                      </span>
                      <div>
                        <h3 className="font-display text-xl text-[#f4efe6] transition-colors group-hover:text-[#d8c08a]">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-xs leading-relaxed text-[#c5c1b9]">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* ─────────────────────────────────────────────
          SECTION 9 — FINAL CTA (FRAMED EDITORIAL)
      ────────────────────────────────────────────── */}
      <section className="py-24 sm:py-32 lg:py-40">
        <Container>
          <div className="relative overflow-hidden border border-white/15 bg-[#171715] p-10 text-center sm:p-16 lg:p-24 shadow-2xl">
            {/* Concentric Frame */}
            <div className="pointer-events-none absolute inset-3 sm:inset-4 border border-white/5" />

            <div className="relative z-10 mx-auto max-w-2xl">
              <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#c6a15b]">
                Start Your Discovery
              </p>
              
              <h2 className="mt-4 font-display text-3xl text-[#f4efe6] sm:text-5xl lg:text-6xl leading-tight">
                Find the Fragrance That Feels Like You.
              </h2>
              
              <p className="mx-auto mt-6 max-w-md text-xs sm:text-sm leading-relaxed text-[#c5c1b9]">
                Explore our collection of authentic designer, niche, and Middle Eastern decants.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2.5 bg-[#d8c08a] px-8 py-4 text-xs font-semibold uppercase tracking-wider text-[#11110f] transition-all hover:bg-[#c6a15b] hover:shadow-lg"
                >
                  <span>Explore the Collection</span>
                  <ArrowUpRight size={15} />
                </Link>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 border border-white/25 bg-transparent px-8 py-4 text-xs font-semibold uppercase tracking-wider text-[#f4efe6] transition-colors hover:border-[#c6a15b] hover:text-[#c6a15b]"
                >
                  <span>Get in Touch</span>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

    </div>
  );
}
