import { ShieldCheck, Pipette, Sparkles, Truck } from "lucide-react";
import Container from "../ui/Container";

const guarantees = [
  {
    icon: ShieldCheck,
    title: "100% Authentic Originals",
    description:
      "Every single drop comes directly from authentic, sealed retail bottles sourced from brand boutiques and verified distributors. Zero clones, zero watered-down juice.",
  },
  {
    icon: Pipette,
    title: "Sterile Medical Transfer",
    description:
      "Decanted by hand on the day of order using sterile, single-use laboratory syringes. Never mixed, never exposed to contaminants.",
  },
  {
    icon: Sparkles,
    title: "High-Atomization Sprayers",
    description:
      "We use heavy-gauge glass atomizers with fine-mist spray pumps that produce wide, luxurious scent plumes equal to the original full bottles.",
  },
  {
    icon: Truck,
    title: "Leak-Proof Safe Transit",
    description:
      "Tightly sealed with plumber's Teflon-safe thread and packaged in high-density shock-absorbing bubble wrap. Guaranteed to arrive intact.",
  },
];

export default function Guarantees() {
  return (
    <section className="bg-[#151512] py-20 sm:py-24 border-b border-white/10">
      <Container>
        <div className="text-center max-w-xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-[0.25em] text-[#c6a15b] font-medium mb-3">
            Our Uncompromising Standard
          </p>
          <h2 className="font-display text-3xl sm:text-4xl text-[#f4efe6]">
            The Decant Bar Guarantee
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {guarantees.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="border border-white/10 bg-[#11110f] p-8 text-center flex flex-col items-center hover:border-[#c6a15b]/40 transition"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-[#c6a15b]/30 bg-[#c6a15b]/10 text-[#c6a15b]">
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-xl text-[#f4efe6] mb-3">
                  {item.title}
                </h3>
                <p className="text-xs text-[#8e8a82] leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
