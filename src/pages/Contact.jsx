import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, ChevronDown, Check, MessageSquare, Package, Compass } from "lucide-react";
import Container from "../components/ui/Container";

const contactOptions = [
  {
    icon: MessageSquare,
    title: "General Enquiries",
    description:
      "For questions regarding our curated catalog, fragrance houses, decanting methods, or general information.",
    actionText: "Send an enquiry below",
  },
  {
    icon: Package,
    title: "Order Support",
    description:
      "Questions regarding an active order, packaging standards, dispatch status, or delivery timelines.",
    actionText: "Include your Order Number in the form",
  },
  {
    icon: Compass,
    title: "Fragrance Guidance",
    description:
      "Looking for notes suited to a specific season or occasion? Our team is glad to suggest scents to explore.",
    actionText: "Request recommendations below",
  },
];

const faqs = [
  {
    id: "faq-1",
    question: "What is a fragrance decant?",
    answer:
      "A decant is an authentic portion of perfume transferred directly from the original manufacturer's bottle into a smaller, high-grade spray atomizer. It allows you to experience the exact original fragrance without purchasing a full-sized bottle.",
  },
  {
    id: "faq-2",
    question: "What decant sizes are available?",
    answer:
      "Our fragrances are offered in 2 ml (approximately 30 sprays — ideal for first impressions), 5 ml (approximately 75 sprays — ideal for multiple wears), and 10 ml (approximately 150 sprays — perfect for everyday travel).",
  },
  {
    id: "faq-3",
    question: "Can I try a fragrance before purchasing a full bottle?",
    answer:
      "Yes, that is the primary purpose of The Decant Bar. Decants provide an accessible way to wear and test a scent on your skin in real-world settings before committing to a costly full-sized bottle.",
  },
  {
    id: "faq-4",
    question: "How should I choose a fragrance to explore?",
    answer:
      "You can filter by gender, olfactive family, season, or concentration on our Shop page. If you are unsure, we recommend starting with a 2 ml or 5 ml decant of both a classic designer and an artisanal niche scent to compare.",
  },
  {
    id: "faq-5",
    question: "How can I contact you about an existing order?",
    answer:
      "You can use the contact form below and include your Order Number in the optional field. Our team reviews all enquiries and responds promptly.",
  },
];

export default function Contact() {
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Enquiry",
    orderNumber: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // FAQ Accordion State (open single item ID)
  const [openFaq, setOpenFaq] = useState("faq-1");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate clean frontend submission feedback
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 400);
  };

  const handleResetForm = () => {
    setFormData({
      name: "",
      email: "",
      subject: "General Enquiry",
      orderNumber: "",
      message: "",
    });
    setSubmitted(false);
  };

  const toggleFaq = (id) => {
    setOpenFaq((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-[#11110f] text-[#f4efe6] overflow-x-hidden">
      
      {/* ─────────────────────────────────────────────
          SECTION 1 — CONTACT HERO (SPLIT LAYOUT)
      ────────────────────────────────────────────── */}
      <section className="relative border-b border-white/10 py-20 sm:py-28 lg:py-32">
        <Container>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            
            {/* Left: Editorial Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:col-span-7"
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#c6a15b]">
                Get in Touch
              </p>
              <h1 className="mt-4 font-display text-4xl leading-[1.05] tracking-tight text-[#f4efe6] sm:text-6xl lg:text-7xl">
                Let's Talk Fragrance.
              </h1>
              <p className="mt-7 max-w-xl text-base leading-relaxed text-[#c5c1b9] sm:text-lg">
                Have a question about a specific fragrance, decant sizes, order status, or need assistance
                curating your next discovery? Our team is here to assist you.
              </p>
            </motion.div>

            {/* Right: Framed Visual Plaque */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none"
            >
              {/* Secondary Offset Frame */}
              <div className="pointer-events-none absolute -bottom-3 -right-3 h-full w-full border border-white/10 sm:-bottom-4 sm:-right-4" />

              {/* Main Visual Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden border border-[#c6a15b]/40 bg-[#171715] p-8 sm:p-10 flex flex-col justify-between shadow-2xl">
                <div className="pointer-events-none absolute inset-3 border border-white/5" />
                
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#c6a15b]">
                    Concierge Desk
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-[#8e8a82]">
                    Online
                  </span>
                </div>

                <div className="relative z-10">
                  <h2 className="font-display text-2xl sm:text-3xl text-[#f4efe6] leading-snug">
                    Thoughtful guidance for every scent exploration.
                  </h2>
                </div>

                <div className="relative z-10 border-t border-white/10 pt-4">
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#8e8a82]">
                    The Decant Bar · Fragrance Concierge
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </Container>
      </section>

      {/* ─────────────────────────────────────────────
          SECTION 2 — CONTACT OPTIONS
      ────────────────────────────────────────────── */}
      <section className="border-b border-white/10 bg-[#171715] py-20 sm:py-24 lg:py-28">
        <Container>
          <div className="max-w-2xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#c6a15b]">
              Assistance
            </p>
            <h2 className="mt-3 font-display text-3xl tracking-tight text-[#f4efe6] sm:text-4xl lg:text-5xl">
              How Can We Help You?
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
            {contactOptions.map((option) => {
              const Icon = option.icon;
              return (
                <div
                  key={option.title}
                  className="group relative flex flex-col justify-between border border-white/10 bg-[#11110f] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[#c6a15b]/40"
                >
                  <div>
                    <div className="flex h-10 w-10 items-center justify-center border border-white/10 bg-[#171715] text-[#c6a15b] transition-colors group-hover:border-[#c6a15b]">
                      <Icon size={18} strokeWidth={1.5} />
                    </div>

                    <h3 className="mt-6 font-display text-2xl text-[#f4efe6]">
                      {option.title}
                    </h3>
                    <p className="mt-3 text-xs leading-relaxed text-[#c5c1b9]">
                      {option.description}
                    </p>
                  </div>

                  <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8e8a82] transition-colors group-hover:text-[#c6a15b]">
                    {option.actionText}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ─────────────────────────────────────────────
          SECTION 3 — MINIMALIST CONTACT FORM
      ────────────────────────────────────────────── */}
      <section id="contact-form" className="border-b border-white/10 py-20 sm:py-28 lg:py-36">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20">
            
            {/* Form Left Description */}
            <div className="lg:col-span-5">
              <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#c6a15b]">
                Direct Message
              </p>
              <h2 className="mt-3 font-display text-3xl tracking-tight text-[#f4efe6] sm:text-4xl lg:text-5xl">
                Send Us an Enquiry
              </h2>
              <p className="mt-5 text-xs sm:text-sm leading-relaxed text-[#c5c1b9]">
                Fill out the form below with your details and message. Whether it’s a sizing question,
                a note recommendation, or order tracking, we respond to every enquiry with care.
              </p>

              <div className="mt-10 border-t border-white/10 pt-8 space-y-4 text-xs text-[#8e8a82]">
                <p>
                  <span className="font-semibold uppercase tracking-wider text-[#f4efe6]">Response Time:</span>{" "}
                  Typically within 24 to 48 business hours.
                </p>
                <p>
                  <span className="font-semibold uppercase tracking-wider text-[#f4efe6]">Confidentiality:</span>{" "}
                  Your information is used strictly to answer your direct enquiry.
                </p>
              </div>
            </div>

            {/* Form Right Area */}
            <div className="lg:col-span-7">
              <div className="border border-white/10 bg-[#171715] p-8 sm:p-12 shadow-xl">
                {submitted ? (
                  /* Polished Success Feedback State */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="py-12 text-center"
                  >
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#c6a15b]/20 text-[#c6a15b]">
                      <Check size={24} />
                    </div>
                    <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.25em] text-[#c6a15b]">
                      Message Received
                    </p>
                    <h3 className="mt-2 font-display text-3xl text-[#f4efe6]">
                      Thank You for Reaching Out.
                    </h3>
                    <p className="mx-auto mt-4 max-w-md text-xs leading-relaxed text-[#c5c1b9]">
                      We have received your message regarding{" "}
                      <span className="text-[#f4efe6]">"{formData.subject}"</span>. Our team will review
                      it and follow up with you at <span className="text-[#f4efe6]">{formData.email}</span>.
                    </p>

                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="mt-8 inline-flex items-center gap-2 border border-white/20 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#f4efe6] transition-colors hover:border-[#c6a15b] hover:text-[#c6a15b]"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  /* Active Form */
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      {/* Name Field */}
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#c5c1b9]"
                        >
                          Your Name <span className="text-[#c6a15b]">*</span>
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g. Eleanor Vance"
                          className="mt-2 w-full border border-white/10 bg-[#11110f] px-4 py-3 text-xs text-[#f4efe6] placeholder-[#8e8a82] transition-colors focus:border-[#c6a15b] focus:outline-none"
                        />
                      </div>

                      {/* Email Field */}
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#c5c1b9]"
                        >
                          Email Address <span className="text-[#c6a15b]">*</span>
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="e.g. eleanor@example.com"
                          className="mt-2 w-full border border-white/10 bg-[#11110f] px-4 py-3 text-xs text-[#f4efe6] placeholder-[#8e8a82] transition-colors focus:border-[#c6a15b] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      {/* Subject Selection */}
                      <div>
                        <label
                          htmlFor="subject"
                          className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#c5c1b9]"
                        >
                          Subject
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="mt-2 w-full border border-white/10 bg-[#11110f] px-4 py-3 text-xs text-[#f4efe6] transition-colors focus:border-[#c6a15b] focus:outline-none"
                        >
                          <option value="General Enquiry">General Enquiry</option>
                          <option value="Fragrance Guidance">Fragrance Guidance</option>
                          <option value="Order & Delivery Support">Order & Delivery Support</option>
                          <option value="Product Availability">Product Availability</option>
                          <option value="Feedback / Other">Feedback / Other</option>
                        </select>
                      </div>

                      {/* Order Number (Optional) */}
                      <div>
                        <label
                          htmlFor="orderNumber"
                          className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#c5c1b9]"
                        >
                          Order Number <span className="text-[10px] text-[#8e8a82]">(Optional)</span>
                        </label>
                        <input
                          id="orderNumber"
                          name="orderNumber"
                          type="text"
                          value={formData.orderNumber}
                          onChange={handleChange}
                          placeholder="e.g. #TDB-1048"
                          className="mt-2 w-full border border-white/10 bg-[#11110f] px-4 py-3 text-xs text-[#f4efe6] placeholder-[#8e8a82] transition-colors focus:border-[#c6a15b] focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Message Area */}
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#c5c1b9]"
                      >
                        Message <span className="text-[#c6a15b]">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="How can we assist you with your fragrance exploration?"
                        className="mt-2 w-full resize-none border border-white/10 bg-[#11110f] px-4 py-3 text-xs leading-relaxed text-[#f4efe6] placeholder-[#8e8a82] transition-colors focus:border-[#c6a15b] focus:outline-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex w-full items-center justify-center gap-2 bg-[#d8c08a] px-8 py-4 text-xs font-semibold uppercase tracking-wider text-[#11110f] transition-all duration-200 hover:bg-[#c6a15b] disabled:opacity-50 sm:w-auto"
                    >
                      <span>{submitting ? "Sending..." : "Send Message"}</span>
                      <ArrowUpRight size={15} />
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* ─────────────────────────────────────────────
          SECTION 4 — ACCORDION FAQ
      ────────────────────────────────────────────── */}
      <section className="border-b border-white/10 py-20 sm:py-28 lg:py-36">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#c6a15b]">
                FAQ
              </p>
              <h2 className="mt-3 font-display text-3xl tracking-tight text-[#f4efe6] sm:text-4xl lg:text-5xl">
                A Few Things You May Be Wondering
              </h2>
              <p className="mt-4 text-xs sm:text-sm text-[#8e8a82]">
                Common answers about our decanting process, sizes, and orders.
              </p>
            </div>

            {/* Accordion List */}
            <div className="mt-14 space-y-4">
              {faqs.map((faq) => {
                const isOpen = openFaq === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="border border-white/10 bg-[#171715] transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(faq.id)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between p-6 text-left transition-colors hover:text-[#c6a15b]"
                    >
                      <span className="font-display text-lg sm:text-xl text-[#f4efe6]">
                        {faq.question}
                      </span>
                      <ChevronDown
                        size={18}
                        className={`text-[#c6a15b] transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
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
                          <div className="border-t border-white/5 px-6 pb-6 pt-3 text-xs sm:text-sm leading-relaxed text-[#c5c1b9]">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* ─────────────────────────────────────────────
          SECTION 5 — CLOSING CTA
      ────────────────────────────────────────────── */}
      <section className="py-24 sm:py-32">
        <Container>
          <div className="relative overflow-hidden border border-white/15 bg-[#171715] p-10 text-center sm:p-16 lg:p-20 shadow-2xl">
            <div className="pointer-events-none absolute inset-3 sm:inset-4 border border-white/5" />

            <div className="relative z-10 mx-auto max-w-xl">
              <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#c6a15b]">
                Not Sure Where to Start?
              </p>

              <h2 className="mt-4 font-display text-3xl text-[#f4efe6] sm:text-5xl leading-tight">
                Explore the Collection and Discover Something New.
              </h2>

              <p className="mt-5 text-xs sm:text-sm leading-relaxed text-[#c5c1b9]">
                Browse our curated catalogue of authentic designer and niche decants.
              </p>

              <div className="mt-8">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 bg-[#d8c08a] px-8 py-4 text-xs font-semibold uppercase tracking-wider text-[#11110f] transition-all hover:bg-[#c6a15b]"
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
