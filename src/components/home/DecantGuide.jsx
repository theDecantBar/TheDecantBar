import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import Container from "../ui/Container";

const sizes = [
  {
    size: "2 ml",
    name: "Discovery Vial",
    badge: "Sample & Test",
    sprays: "~30 Fine-Mist Spritzes",
    duration: "10–14 Days of Wear",
    purpose: "Skin Chemistry Testing",
    idealFor:
      "Ideal for testing skin chemistry and fragrance progression without committing to a full bottle.",
    features: [
      "Heavy-duty clear glass vial",
      "Leak-proof screw closure",
      "Micro fine-mist spray atomizer",
      "Pocket & travel TSA compliant",
    ],
  },
  {
    size: "5 ml",
    name: "Travel Atomizer",
    badge: "Most Popular",
    sprays: "~75 Fine-Mist Spritzes",
    duration: "3–4 Weeks of Daily Wear",
    purpose: "Special Occasions & Dates",
    idealFor:
      "Ample fragrance for vacations, evenings out, and compliment-pulling daily signature rotation.",
    features: [
      "Precision fine-mist spray pump",
      "Sturdy glass with protective casing",
      "Perfect fit for jacket pockets or bags",
      "Great value per milliliter",
    ],
  },
  {
    size: "10 ml",
    name: "Statement Companion",
    badge: "Maximum Value",
    sprays: "~150 Fine-Mist Spritzes",
    duration: "2–3 Months of Wear",
    purpose: "Signature Scent Rotation",
    idealFor:
      "A generous volume lasting through an entire season at up to 85% savings over retail bottles.",
    features: [
      "Luxury refillable glass atomizer",
      "Maximum volume & savings",
      "High-output vaporizing sprayer",
      "Complete seasonal scent wardrobe",
    ],
  },
];

export default function DecantGuide() {
  return (
    <section className="bg-[#11110f] py-20 sm:py-28 border-b border-white/10">
      <Container>
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-[#c6a15b]" />
            <p className="text-xs uppercase tracking-[0.25em] text-[#c6a15b] font-medium">
              The Decant Philosophy
            </p>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl text-[#f4efe6]">
            Why Buy Decants?
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-[#8e8a82]">
            Full retail bottles cost anywhere between ₹15,000 to ₹35,000. Decants give you authentic, unadulterated luxury fragrance with zero commitment and zero buyer's remorse.
          </p>
        </div>

        {/* Sizes Cards - Uniform & Equal Dimensions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {sizes.map((item) => (
            <div
              key={item.size}
              className="flex flex-col justify-between border border-white/10 bg-[#161613] p-8 sm:p-9 transition-colors duration-300 hover:border-[#c6a15b]/40"
            >
              <div>
                {/* 1. Equal Header Badge & Spray Count */}
                <div className="flex items-center justify-between pb-6 border-b border-white/10">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] px-3 py-1 border border-[#c6a15b]/30 bg-[#c6a15b]/10 text-[#c6a15b]">
                    {item.badge}
                  </span>
                  <span className="text-xs text-[#8e8a82] font-mono">
                    {item.sprays}
                  </span>
                </div>

                {/* 2. Equal Size Title & Subtitle */}
                <div className="pt-6">
                  <h3 className="font-display text-4xl sm:text-5xl text-[#f4efe6] [font-variant-numeric:lining-nums]">
                    {item.size}
                  </h3>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#c6a15b] font-medium">
                    {item.name}
                  </p>
                </div>

                {/* 3. Description with consistent minimum height */}
                <p className="mt-4 text-xs text-[#b8b3a9] leading-relaxed min-h-[36px]">
                  {item.idealFor}
                </p>

                {/* 4. Specs Grid */}
                <div className="my-6 border-y border-white/10 py-4 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between text-[#8e8a82]">
                    <span>Longevity:</span>
                    <strong className="text-[#f4efe6] font-medium">{item.duration}</strong>
                  </div>
                  <div className="flex items-center justify-between text-[#8e8a82]">
                    <span>Best For:</span>
                    <strong className="text-[#f4efe6] font-medium">{item.purpose}</strong>
                  </div>
                </div>

                {/* 5. Features List */}
                <div className="space-y-2.5">
                  {item.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2.5 text-xs text-[#c5c1b9]">
                      <CheckCircle2 size={13} className="text-[#c6a15b] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Unified Action Button */}
        <div className="mt-14 text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-3 border border-[#c6a15b] bg-[#c6a15b] px-9 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#11110f] hover:bg-[#d8c08a] transition shadow-lg"
          >
            <span>Explore All Fragrances (Choose Any Size)</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </Container>
    </section>
  );
}
