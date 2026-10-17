import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import Container from "../components/ui/Container";

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
                  
              <div className="my-6 h-px w-16 bg-[#c6a15b]/60" />
                  
              <div className="space-y-5 text-sm leading-relaxed text-[#c5c1b9] sm:text-base">
                <p>
                  We source genuine perfumes from established fragrance houses and
                  carefully transfer the original fragrance into smaller 2 ml, 5 ml,
                  and 10 ml atomizers, making luxury scents easier to explore and carry.
                </p>
                  
                <p>
                  Every decant lets you experience the original fragrance without
                  committing to a full bottle—perfect for discovering new favourites
                  and finding your signature scent.
                </p>
              </div>
            </div>
                  

          </div>
        </Container>
      </section>


      {/* ─────────────────────────────────────────────
          SECTION 3 — FRAGRANCE IMAGE MOMENT (FULL BANNER)
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
          SECTION 4 — CARE & PRECISION (IMAGE + ROWS)
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
          SECTION 5 — FINAL CTA (FRAMED EDITORIAL)
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
