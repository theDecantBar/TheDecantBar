import { Compass } from "lucide-react";
import Container from "../ui/Container";
import CategoryCard from "./CategoryCard";

import nicheWebp from "../../assets/images/niche.webp";
import nicheJpg from "../../assets/images/niche.jpg";
import designerWebp from "../../assets/images/designer.webp";
import designerJpg from "../../assets/images/designer.jpg";
import orientalWebp from "../../assets/images/oriental.webp";
import orientalJpg from "../../assets/images/oriental.jpg";

/**
 * Curated category collections data
 * Easily editable copy, tags, images, and links
 */
const categoryCardsData = [
  {
    title: "Niche Royalty",
    tag: "HAUTE PARFUMERIE",
    description: "Rare, artisanal masterpieces. Feat. MFK, Xerjoff, Kilian & Creed.",
    link: "/products?category=Niche",
    image: nicheWebp,
    imageFallback: nicheJpg,
    alt: "Niche Royalty luxury fragrances featuring Xerjoff Naxos, Creed Aventus, and Baccarat Rouge 540",
    gradient: "from-[#221408]/90 via-[#170e06]/60 to-transparent",
    accent: "#c6a15b",
  },
  {
    title: "Designer Icons",
    tag: "HIGH FASHION",
    description: "Timeless signatures from Tom Ford, Dior, YSL, Chanel & Givenchy.",
    link: "/products?category=Designer",
    image: designerWebp,
    imageFallback: designerJpg,
    alt: "Designer Icons luxury fragrances featuring Tom Ford Oud Wood, Sauvage Dior, YSL Y, and Bleu de Chanel",
    gradient: "from-[#0d1624]/90 via-[#09101b]/60 to-transparent",
    accent: "#a3b8cc",
  },
  {
    title: "Middle Eastern Powerhouses",
    tag: "ORIENTAL & OUD",
    description: "Rich ambers and smoky ouds. Feat. Hawas, Afnan & Lattafa.",
    link: "/products?category=Middle eastern",
    image: orientalWebp,
    imageFallback: orientalJpg,
    alt: "Middle Eastern Powerhouses fragrances featuring Khamrah Qahwa, Hawas Ice, and 9pm Elixir",
    gradient: "from-[#240b18]/90 via-[#190710]/60 to-transparent",
    accent: "#d4a373",
  },
];

export default function CategoryBanners() {
  return (
    <section className="bg-[#151512] pt-8 sm:pt-10 pb-20 sm:pb-28 border-b border-white/10">
      <Container>
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <Compass size={14} className="text-[#c6a15b]" />
            <p className="text-xs uppercase tracking-[0.25em] text-[#c6a15b] font-medium">
              Curated Fragrance Worlds
            </p>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl text-[#f4efe6]">
            Shop by Collection
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-[#8e8a82]">
            Whether you desire avant-garde niche artistry, magnetic designer charm, or potent oriental sillage.
          </p>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {categoryCardsData.map((category, index) => (
            <CategoryCard
              key={category.title}
              category={category}
              index={index}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
