import { Link } from "react-router-dom";
import { ArrowRight, Compass } from "lucide-react";
import Container from "../ui/Container";

const categories = [
  {
    title: "Niche Royalty",
    subtitle: "Artisanal & Rare Formulations",
    description:
      "Masterpieces crafted with opulent raw ingredients and uncompromising artistic freedom. Feat. MFK, Xerjoff, Kilian & Creed.",
    link: "/products?category=Niche",
    tag: "Haute Parfumerie",
    gradient: "from-[#241a10] to-[#12110e]",
    accent: "#c6a15b",
  },
  {
    title: "Designer Icons",
    subtitle: "Timeless Prestige & Seduction",
    description:
      "The pinnacle of high-fashion luxury scent craft. Iconic signature scents from Tom Ford, Dior, YSL, Chanel, and Givenchy.",
    link: "/products?category=Designer",
    tag: "High Fashion",
    gradient: "from-[#171b26] to-[#11110f]",
    accent: "#a3b8cc",
  },
  {
    title: "Middle Eastern Powerhouses",
    subtitle: "Beast-Mode Projection & Opulence",
    description:
      "Rich ambers, smoky ouds, and long-lasting oriental elixirs that command the room all day and night. Feat. Hawas, Afnan & Lattafa.",
    link: "/products?category=Middle eastern",
    tag: "Oriental & Oud",
    gradient: "from-[#23151b] to-[#11110f]",
    accent: "#d4a373",
  },
];

export default function CategoryBanners() {
  return (
    <section className="bg-[#151512] py-20 sm:py-28 border-b border-white/10">
      <Container>
        {/* Header */}
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

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.title}
              to={cat.link}
              className={`group relative flex flex-col justify-between overflow-hidden border border-white/10 bg-gradient-to-b ${cat.gradient} p-8 sm:p-10 transition-all duration-500 hover:border-[#c6a15b]/60 hover:-translate-y-1`}
            >
              <div>
                <span
                  className="inline-block text-[10px] font-semibold uppercase tracking-[0.25em] px-2.5 py-1 border border-white/15 bg-black/40 text-[#c6a15b] mb-6"
                >
                  {cat.tag}
                </span>

                <h3 className="font-display text-3xl text-[#f4efe6] group-hover:text-[#c6a15b] transition-colors">
                  {cat.title}
                </h3>

                <p className="text-xs uppercase tracking-wider text-[#8e8a82] mt-1.5 font-medium">
                  {cat.subtitle}
                </p>

                <p className="mt-5 text-xs text-[#b8b3a9] leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f4efe6] group-hover:text-[#c6a15b] transition">
                  Explore Collection
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/30 text-[#f4efe6] group-hover:border-[#c6a15b] group-hover:bg-[#c6a15b] group-hover:text-[#11110f] transition">
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
