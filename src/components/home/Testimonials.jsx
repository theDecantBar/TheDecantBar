import { Star, CheckCircle } from "lucide-react";
import Container from "../ui/Container";

const reviews = [
  {
    name: "Aman Malhotra",
    city: "Mumbai",
    fragrance: "Baccarat Rouge 540 Extrait (5ml)",
    text: "Saved me ₹30,000! I was skeptical about whether decants smell identical to the retail bottle, but the performance and projection on this BR540 are 100% genuine. The atomizer gives a super fine mist.",
    rating: 5,
  },
  {
    name: "Rhea Sen",
    city: "Bengaluru",
    fragrance: "Kilian Angels' Share (10ml)",
    text: "Packaging was pristine—each bottle was individually taped, sealed, and bubble-wrapped. The 10ml size is heavy glass and looks stunning on my vanity. Already placed my second order.",
    rating: 5,
  },
  {
    name: "Vikramaditya Roy",
    city: "New Delhi",
    fragrance: "Tom Ford Tobacco Vanille (5ml)",
    text: "The best place to buy decants in India. Fast delivery to Delhi in 3 days. Tobacco Vanille lasted 12+ hours on my linen shirt. Transparent spray count and authentic juice.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="bg-[#11110f] py-20 sm:py-28 border-b border-white/10">
      <Container>
        <div className="text-center max-w-xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-[0.25em] text-[#c6a15b] font-medium mb-3">
            Verified Collectors & Buyers
          </p>
          <h2 className="font-display text-4xl sm:text-5xl text-[#f4efe6]">
            Community Praises
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-[#8e8a82]">
            Over 2,500+ luxury decants delivered safely across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev) => (
            <div
              key={rev.name}
              className="relative border border-white/10 bg-[#161613] p-8 flex flex-col justify-between hover:border-[#c6a15b]/40 transition"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 mb-4 text-[#c6a15b]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-[#c5c1b9] leading-relaxed italic">
                  "{rev.text}"
                </p>
              </div>

              <div className="mt-8 border-t border-white/10 pt-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <strong className="text-xs text-[#f4efe6] font-medium">
                      {rev.name}
                    </strong>
                    <CheckCircle size={12} className="text-[#c6a15b]" />
                  </div>
                  <span className="text-[11px] text-[#8e8a82]">
                    {rev.city} · Verified Purchase
                  </span>
                </div>

                <span className="text-[10px] text-[#c6a15b] font-mono border border-[#c6a15b]/30 px-2 py-0.5 bg-[#c6a15b]/5">
                  {rev.fragrance}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
