import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  HelpCircle,
  ChevronDown,
  Search,
  MessageSquare,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  Droplets,
  Package,
} from "lucide-react";
import Container from "../components/ui/Container";
import { faqs, FAQ_CATEGORIES } from "../data/faqs";

export default function FAQ() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState("faq-1");

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Frequently Asked Questions | The Decant Bar";
  }, []);

  const toggleFaq = (id) => {
    setOpenFaq((prev) => (prev === id ? null : id));
  };

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory =
        selectedCategory === "All" || faq.category === selectedCategory;
      const matchesSearch =
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#11110f] text-[#f4efe6] overflow-x-hidden">
      {/* ─────────────────────────────────────────────
          HERO SECTION
      ────────────────────────────────────────────── */}
      <section className="relative border-b border-white/10 py-16 sm:py-24 lg:py-28">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-[#c6a15b]/30 bg-[#c6a15b]/10 px-4 py-1 text-[11px] font-medium uppercase tracking-[0.25em] text-[#c6a15b]">
                <HelpCircle size={14} />
                <span>Frequently Asked Questions</span>
              </div>

              <h1 className="mt-5 font-display text-4xl leading-[1.1] tracking-tight text-[#f4efe6] sm:text-5xl lg:text-6xl">
                A Few Things You May Be Wondering.
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-xs leading-relaxed text-[#c5c1b9] sm:text-sm sm:leading-relaxed">
                Everything you need to know about authentic perfume decants, atomizer formats,
                our sterile decanting process, and order fulfillment.
              </p>
            </motion.div>

            {/* Search Input */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
              className="relative mx-auto mt-8 max-w-lg"
            >
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8e8a82]"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions or keywords (e.g., sizes, sprays, shipping)..."
                className="w-full rounded-2xl border border-white/15 bg-[#171715] py-3.5 pl-11 pr-4 text-xs text-[#f4efe6] placeholder-[#8e8a82] transition-colors focus:border-[#c6a15b] focus:outline-none focus:ring-1 focus:ring-[#c6a15b]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="rounded-2xl absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#8e8a82] hover:text-[#f4efe6]"
                >
                  Clear
                </button>
              )}
            </motion.div>

            {/* Category Filter Pills */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
              className="mt-6 flex flex-wrap items-center justify-center gap-2"
            >
              {FAQ_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`cursor-pointer rounded-2xl px-3 py-1.5 text-[11px] font-medium tracking-wider transition-all duration-200 ${
                      isSelected
                        ? "border border-[#c6a15b] bg-[#c6a15b] text-[#11110f] shadow-md"
                        : "border border-white/10 bg-[#171715] text-[#c5c1b9] hover:border-[#c6a15b]/40 hover:text-[#f4efe6]"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </motion.div>
          </div>
        </Container>
      </section>

       

      {/* ─────────────────────────────────────────────
          ACCORDION FAQ LIST
      ────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            {filteredFaqs.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-[#171715] p-12 text-center">
                <HelpCircle size={32} className="mx-auto text-[#8e8a82]" />
                <h3 className="mt-4 font-display text-xl text-[#f4efe6]">
                  No Matching Questions Found
                </h3>
                <p className="mt-2 text-xs text-[#c5c1b9]">
                  We couldn't find an answer matching "{searchQuery}". Try a different search term or explore all categories.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                  className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-[#c6a15b] bg-[#c6a15b]/10 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-[#c6a15b] transition hover:bg-[#c6a15b] hover:text-[#11110f]"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFaqs.map((faq, index) => {
                  const isOpen = openFaq === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                        isOpen
                          ? "border-[#c6a15b]/60 bg-[#171715] shadow-lg shadow-black/40"
                          : "border-white/10 bg-[#171715]/90 hover:border-white/20"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(faq.id)}
                        aria-expanded={isOpen}
                        className="rounded-2xl flex w-full items-center justify-between gap-4 p-5 sm:p-6 text-left transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold transition-colors ${
                              isOpen
                                ? "bg-[#c6a15b] text-[#11110f]"
                                : "bg-white/10 text-[#8e8a82]"
                            }`}
                          >
                            {index + 1}
                          </span>
                          <span className="font-display text-base text-[#f4efe6] sm:text-lg">
                            {faq.question}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {faq.category && (
                            <span className="hidden rounded border border-white/10 px-2 py-0.5 text-[9px] uppercase tracking-wider text-[#8e8a82] md:inline">
                              {faq.category}
                            </span>
                          )}
                          <ChevronDown
                            size={18}
                            className={`text-[#c6a15b] transition-transform duration-300 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            key="content"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-white/10 px-5 pb-6 pt-3 text-xs leading-relaxed text-[#c5c1b9] sm:px-6 sm:text-sm sm:leading-relaxed">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* ─────────────────────────────────────────────
          STILL HAVE QUESTIONS? CONCIERGE CARD
      ────────────────────────────────────────────── */}
      <section className="border-t border-white/10 bg-[#171715] py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl rounded-2xl border border-[#c6a15b]/30 bg-[#11110f] p-8 sm:p-12 shadow-2xl">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                  <MessageSquare size={14} />
                  <span>Personal Concierge</span>
                </div>
                <h2 className="mt-2 font-display text-2xl text-[#f4efe6] sm:text-3xl">
                  Still Have a Question?
                </h2>
                <p className="mt-2 max-w-md text-xs leading-relaxed text-[#c5c1b9]">
                  Our fragrance specialists are here to assist with olfactory recommendations, specific note breakdowns, or order assistance.
                </p>
              </div>

              <Link
                to="/contact"
                className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-[#c6a15b] px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#11110f] shadow-md transition hover:bg-[#d8c08a]"
              >
                <span>Contact Concierge</span>
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ─────────────────────────────────────────────
          CLOSING CTA
      ────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28">
        <Container>
          <div className="rounded-2xl relative overflow-hidden border border-white/15 bg-[#171715] p-10 text-center sm:p-16 lg:p-20 shadow-2xl">
            <div className="pointer-events-none absolute inset-3 sm:inset-4 border border-white/5" />

            <div className="relative z-10 mx-auto max-w-xl">
              <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#c6a15b]">
                Ready to Experience Luxury?
              </p>

              <h2 className="mt-4 font-display text-3xl text-[#f4efe6] sm:text-5xl leading-tight">
                Explore the Collection and Discover Something New.
              </h2>

              <p className="mt-5 text-xs sm:text-sm leading-relaxed text-[#c5c1b9]">
                Browse our curated catalogue of authentic designer and artisanal niche decants.
              </p>

              <div className="mt-8">
                <Link
                  to="/shop"
                  className="rounded-2xl inline-flex items-center gap-2 bg-[#d8c08a] px-8 py-4 text-xs font-semibold uppercase tracking-wider text-[#11110f] transition-all hover:bg-[#c6a15b]"
                >
                  <span>Explore the Collection</span>
                  <ArrowUpRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

