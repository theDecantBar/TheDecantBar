import { cn } from "@/lib/utils";
import { TestimonialCard } from "@/components/ui/testimonial-card";

export function TestimonialsSection({
  title = "Community Praise",
  description = "Authentic feedback and experiences from verified fragrance enthusiasts.",
  testimonials = [],
  className,
  renderCard,
}) {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  // Multiply items to ensure continuous infinite loop
  const displayItems =
    testimonials.length >= 6
      ? [...testimonials, ...testimonials]
      : [...testimonials, ...testimonials, ...testimonials, ...testimonials];

  return (
    <section
      className={cn(
        "bg-[#11110f] text-[#f4efe6] py-12 sm:py-20 px-0 overflow-hidden",
        className
      )}
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 text-center sm:gap-12">
        {(title || description) && (
          <div className="flex flex-col items-center gap-3 px-4 text-center max-w-2xl">
            {title && (
              <h2 className="font-display text-3xl sm:text-5xl font-semibold tracking-tight text-[#f4efe6]">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-xs sm:text-sm text-[#8e8a82] leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Sliding Marquee Track with Side Fades */}
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-4">
          <div className="group flex overflow-hidden w-full select-none">
            <div className="flex shrink-0 gap-4 sm:gap-6 animate-marquee flex-row group-hover:[animation-play-state:paused] py-2">
              {displayItems.map((testimonial, idx) =>
                renderCard ? (
                  renderCard(testimonial, idx)
                ) : (
                  <TestimonialCard key={`${testimonial.id || idx}-${idx}`} {...testimonial} />
                )
              )}
            </div>
          </div>

          {/* Luxury Edge Gradient Vignettes */}
          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-24 sm:w-48 bg-gradient-to-r from-[#11110f] via-[#11110f]/80 to-transparent sm:block z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-24 sm:w-48 bg-gradient-to-l from-[#11110f] via-[#11110f]/80 to-transparent sm:block z-10" />
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
