import Hero from "../components/Hero";
import FilterBar from "../components/FilterBar";
import FeaturedDecants from "../components/home/FeaturedDecants";
import CategoryBanners from "../components/home/CategoryBanners";
import DecantGuide from "../components/home/DecantGuide";
import Testimonials from "../components/home/Testimonials";
import Guarantees from "../components/home/Guarantees";

export default function Home() {
  return (
    <div className="bg-[#11110f] text-[#f4efe6]">
      {/* 1. Hero Welcome Banner */}
      <Hero />

      {/* 2. Compact Premium Apply Filters Bar */}
      <FilterBar />

      {/* 3. Most Coveted Decants (Live Bestsellers with size select & Add to Bag) */}
      <FeaturedDecants />

      {/* 4. Shop by Collection (Niche, Designer, Middle Eastern) */}
      <CategoryBanners />

      {/* 5. The Decant Philosophy (2ml, 5ml, 10ml visual size & spray guide) */}
      <DecantGuide />

      {/* 6. Customer Reviews & Community */}
      <Testimonials />

      {/* 7. The Decant Bar Guarantees (Sterile syringes, authentic juice, fine mist) */}
      <Guarantees />
    </div>
  );
}