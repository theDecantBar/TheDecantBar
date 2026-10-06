import { FlaskConical, Package, Sparkles } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    text: "Original fragrance, carefully decanted",
  },
  {
    icon: FlaskConical,
    text: "Discover in 2 ml, 5 ml & 10 ml",
  },
  {
    icon: Package,
    text: "Considered packaging. Ready to explore.",
  },
];

export default function FeatureBar() {
  return (
    <section className="border-y border-white/10 bg-[#181815]">
      <div className="mx-auto grid max-w-[1440px] md:grid-cols-3">

        {features.map(({ icon: Icon, text }, index) => (
          <div
            key={text}
            className={`flex items-center gap-4 px-8 py-7 lg:px-16 ${
              index !== 0 ? "border-t border-white/10 md:border-l md:border-t-0" : ""
            }`}
          >
            <Icon
              size={21}
              strokeWidth={1.3}
              className="text-[#c6a15b]"
            />

            <span className="text-sm text-[#b8b3a9]">
              {text}
            </span>
          </div>
        ))}

      </div>
    </section>
  );
}