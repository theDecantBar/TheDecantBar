import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  Check,
  MessageSquare,
  Package,
  Compass,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  Clock,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import Container from "../components/ui/Container";
import { sendContactEnquiryApi } from "../services/authApi";

const contactChannels = [
  {
    icon: MapPin,
    badge: "Our Location",
    title: "Chandigarh, India",
    subtitle: "Headquarters & Fragrance Studio",
    actionText: "Chandigarh, India",
    href: null,
  },
  {
    icon: Phone,
    badge: "Call Us",
    title: "[CONFIRM PHONE NUMBER BEFORE PUBLISHING]",
    subtitle: "Mon – Sat, 10:00 AM – 7:00 PM IST",
    actionText: "Phone Support",
    href: null,
  },
  {
    icon: Mail,
    badge: "Drop Us a Line",
    title: "contact@thedecantbar.com",
    subtitle: "Average response within 24–48 hours",
    actionText: "Email Concierge",
    href: "mailto:contact@thedecantbar.com",
  },
];

const assistanceCategories = [
  {
    icon: Package,
    title: "Order & Delivery Support",
    description:
      "Tracking enquiries, shipping timelines, packaging standards, or updates on active decant orders.",
    badge: "Please include Order ID",
  },
  {
    icon: Compass,
    title: "Fragrance Guidance",
    description:
      "Need guidance on scent notes, decant sizing (2ml, 5ml, 10ml), season profiles, or occasion pairings?",
    badge: "Personal Recommendations",
  },
  {
    icon: MessageSquare,
    title: "Questions & Propositions",
    description:
      "Have feedback, business proposals, wholesale requests, or general questions about our decanting methods?",
    badge: "Partnership & Feedback",
  },
];

export default function Contact() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Contact Us | The Decant Bar";
  }, []);

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
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await sendContactEnquiryApi(formData);
      setSubmitted(true);
    } catch (err) {
      setError(
        err.message ||
          "Unable to deliver your message at this time. Please try again or email us directly at contact@thedecantbar.com."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFormData({
      name: "",
      email: "",
      subject: "General Enquiry",
      orderNumber: "",
      message: "",
    });
    setError("");
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-[#11110f] text-[#f4efe6] overflow-x-hidden">
      {/* ─────────────────────────────────────────────
          SECTION 1 — CONTACT HERO (SPLIT LAYOUT)
      ────────────────────────────────────────────── */}
      <section className="relative border-b border-white/10 py-16 sm:py-24 lg:py-28">
        <Container>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left: Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:col-span-7"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#c6a15b]/30 bg-[#c6a15b]/10 text-[#c6a15b] text-[11px] uppercase tracking-[0.25em] font-semibold">
                <Sparkles size={13} />
                <span>Contact</span>
              </div>

              <h1 className="mt-4 font-display text-4xl leading-[1.05] tracking-tight text-[#f4efe6] sm:text-6xl lg:text-7xl">
                We would love to hear from you!
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-[#c5c1b9] sm:text-lg">
                Whether you have questions about our fragrances, product sizes, orders, deliveries or anything else, our team is here to help.
              </p>

              {/* Order Support Notice Pill */}
              <div className="mt-8 p-4 rounded-2xl border border-[#c6a15b]/30 bg-[#171715] flex items-start gap-3 text-xs leading-relaxed max-w-xl">
                <Package size={18} className="text-[#c6a15b] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#f4efe6] uppercase tracking-wider block text-[11px]">
                    Customer Support Notice
                  </span>
                  <span className="text-[#c5c1b9]">
                    For order-related enquiries, please include your order ID in your message to help us assist you faster.
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Right: Framed Official Contact Plaque */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none"
            >
              <div className="pointer-events-none absolute -bottom-3 -right-3 h-full w-full border border-white/10 sm:-bottom-4 sm:-right-4 rounded-2xl" />

              <div className="rounded-2xl relative w-full overflow-hidden border border-[#c6a15b]/40 bg-[#171715] p-8 sm:p-10 flex flex-col justify-between shadow-2xl">
                <div className="pointer-events-none absolute inset-3 border border-white/5 rounded-xl" />

                <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#c6a15b]">
                    Contact Information
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-medium flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Official Desk
                  </span>
                </div>

                <div className="relative z-10 my-6 space-y-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#8e8a82] block">
                      Business Name
                    </span>
                    <span className="text-base font-semibold text-[#f4efe6]">
                      The Decant Bar
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#8e8a82] block">
                      Location
                    </span>
                    <span className="text-sm text-[#f4efe6] flex items-center gap-1.5 mt-0.5">
                      <MapPin size={14} className="text-[#c6a15b]" />
                      Chandigarh, India
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#8e8a82] block">
                      Email
                    </span>
                    <a
                      href="mailto:contact@thedecantbar.com"
                      className="text-sm text-[#c6a15b] hover:text-[#d8c08a] transition underline decoration-white/20 underline-offset-4 flex items-center gap-1.5 mt-0.5"
                    >
                      <Mail size={14} />
                      contact@thedecantbar.com
                    </a>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#8e8a82] block">
                      Phone
                    </span>
                    <span className="text-sm text-[#c5c1b9] flex items-center gap-1.5 mt-0.5">
                      <Phone size={14} className="text-[#c6a15b]" />
                      +91 95197 19993
                    </span>
                  </div>
                </div>

                <div className="relative z-10 border-t border-white/10 pt-4 flex items-center justify-between text-[10px] text-[#8e8a82]">
                  <span>Deliveries Across India</span>
                  <span className="text-[#c6a15b]">✦ 100% Authentic Decants</span>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ─────────────────────────────────────────────
          SECTION 2 — THREE DIRECT CHANNELS
      ────────────────────────────────────────────── */}
      <section className="border-b border-white/10 bg-[#171715] py-16 sm:py-20">
        <Container>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
            {contactChannels.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.badge}
                  className="rounded-2xl relative flex flex-col justify-between border border-white/10 bg-[#11110f] p-8 transition-all duration-300 hover:border-[#c6a15b]/40 hover:-translate-y-1 shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#171715] text-[#c6a15b]">
                        <Icon size={20} strokeWidth={1.5} />
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c6a15b]">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="mt-6 font-display text-xl sm:text-2xl text-[#f4efe6] break-words">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-[#8e8a82]">
                      {item.subtitle}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-white/10 pt-4">
                    {item.href ? (
                      <a
                        href={item.href}
                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#c6a15b] hover:text-[#d8c08a] transition"
                      >
                        <span>{item.actionText}</span>
                        <ArrowUpRight size={13} />
                      </a>
                    ) : (
                      <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#8e8a82]">
                        {item.actionText}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ─────────────────────────────────────────────
          SECTION 3 — ENQUIRY FOCUS TOPICS
      ────────────────────────────────────────────── */}
      <section className="border-b border-white/10 py-16 sm:py-20">
        <Container>
          <div className="max-w-2xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#c6a15b]">
              Assistance Topics
            </p>
            <h2 className="mt-3 font-display text-3xl tracking-tight text-[#f4efe6] sm:text-4xl">
              How Our Team Can Assist You
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {assistanceCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.title}
                  className="rounded-2xl border border-white/10 bg-[#141412] p-7 transition hover:border-[#c6a15b]/30"
                >
                  <div className="flex items-center justify-between">
                    <Icon size={20} className="text-[#c6a15b]" />
                    <span className="text-[10px] uppercase tracking-wider text-[#8e8a82]">
                      {cat.badge}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-xl text-[#f4efe6]">
                    {cat.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#c5c1b9]">
                    {cat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ─────────────────────────────────────────────
          SECTION 4 — CONTACT FORM & PROPOSITIONS
      ────────────────────────────────────────────── */}
      <section id="contact-form" className="border-b border-white/10 bg-[#171715] py-20 sm:py-28">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20">
            {/* Form Left Description */}
            <div className="lg:col-span-5">
              <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#c6a15b]">
                Have Any Questions or Propositions?
              </p>
              <h2 className="mt-3 font-display text-3xl tracking-tight text-[#f4efe6] sm:text-4xl lg:text-5xl">
                Feel Free to Reach Out to Us
              </h2>
              <p className="mt-5 text-xs sm:text-sm leading-relaxed text-[#c5c1b9]">
                Feel free to reach out to us with any questions, feedback or proposals. Our team will do its best to assist you.
              </p>

              <div className="mt-8 rounded-2xl border border-[#c6a15b]/30 bg-[#11110f] p-5 text-xs text-[#c5c1b9] space-y-2">
                <p className="font-semibold text-[#f4efe6] flex items-center gap-2 text-xs uppercase tracking-wider">
                  <Package size={14} className="text-[#c6a15b]" />
                  Customer Support Guideline
                </p>
                <p className="text-[#8e8a82]">
                  For order-related enquiries, please include your order ID in your message to help us assist you faster.
                </p>
              </div>

              <div className="mt-8 border-t border-white/10 pt-6 space-y-3 text-xs text-[#8e8a82]">
                <p>
                  <span className="font-semibold uppercase tracking-wider text-[#f4efe6]">
                    Response Time:
                  </span>{" "}
                  Typically within 24 to 48 business hours.
                </p>
                <p>
                  <span className="font-semibold uppercase tracking-wider text-[#f4efe6]">
                    Direct Email:
                  </span>{" "}
                  <a
                    href="mailto:contact@thedecantbar.com"
                    className="text-[#c6a15b] underline hover:text-[#d8c08a]"
                  >
                    contact@thedecantbar.com
                  </a>
                </p>
                <p>
                  <span className="font-semibold uppercase tracking-wider text-[#f4efe6]">
                    Location:
                  </span>{" "}
                  Chandigarh, India
                </p>
              </div>

              <div className="mt-8 border-t border-white/10 pt-6">
                <p className="text-xs text-[#8e8a82]">
                  Looking for quick answers about decants, authenticity, or policies?{" "}
                  <Link
                    to="/faq"
                    className="inline-flex items-center gap-1 font-medium text-[#c6a15b] underline underline-offset-4 transition-colors hover:text-[#f4efe6]"
                  >
                    <span>View our FAQ</span>
                    <ArrowUpRight size={13} />
                  </Link>
                </p>
              </div>
            </div>

            {/* Form Right Area */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-white/10 bg-[#11110f] p-8 sm:p-12 shadow-xl">
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
                      it and follow up with you at{" "}
                      <span className="text-[#f4efe6]">{formData.email}</span>.
                    </p>

                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="rounded-2xl mt-8 inline-flex items-center gap-2 border border-white/20 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#f4efe6] transition-colors hover:border-[#c6a15b] hover:text-[#c6a15b]"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  /* Active Form */
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="rounded-2xl flex items-start gap-3 border border-red-500/40 bg-red-950/25 p-4 text-xs text-red-200 animate-in fade-in duration-200">
                        <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-400" />
                        <div className="leading-relaxed">{error}</div>
                      </div>
                    )}

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
                          className="rounded-2xl mt-2 w-full border border-white/10 bg-[#171715] px-4 py-3 text-xs text-[#f4efe6] placeholder-[#8e8a82] transition-colors focus:border-[#c6a15b] focus:outline-none"
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
                          className="rounded-2xl mt-2 w-full border border-white/10 bg-[#171715] px-4 py-3 text-xs text-[#f4efe6] placeholder-[#8e8a82] transition-colors focus:border-[#c6a15b] focus:outline-none"
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
                          className="rounded-2xl mt-2 w-full border border-white/10 bg-[#171715] px-4 py-3 text-xs text-[#f4efe6] transition-colors focus:border-[#c6a15b] focus:outline-none"
                        >
                          <option value="General Enquiry">General Enquiry</option>
                          <option value="Fragrance Guidance">Fragrance Guidance</option>
                          <option value="Order & Delivery Support">Order & Delivery Support</option>
                          <option value="Product Availability">Product Availability</option>
                          <option value="Propositions & Feedback">Propositions & Feedback</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      {/* Order Number (Optional) */}
                      <div>
                        <label
                          htmlFor="orderNumber"
                          className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#c5c1b9]"
                        >
                          Order ID <span className="text-[10px] text-[#8e8a82]">(For order support)</span>
                        </label>
                        <input
                          id="orderNumber"
                          name="orderNumber"
                          type="text"
                          value={formData.orderNumber}
                          onChange={handleChange}
                          placeholder="e.g. #DECANT-1048"
                          className="rounded-2xl mt-2 w-full border border-white/10 bg-[#171715] px-4 py-3 text-xs text-[#f4efe6] placeholder-[#8e8a82] transition-colors focus:border-[#c6a15b] focus:outline-none"
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
                        placeholder="How can our team assist you today? Please include your order ID if this relates to an existing order."
                        className="rounded-2xl mt-2 w-full resize-none border border-white/10 bg-[#171715] px-4 py-3 text-xs leading-relaxed text-[#f4efe6] placeholder-[#8e8a82] transition-colors focus:border-[#c6a15b] focus:outline-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="rounded-2xl inline-flex w-full items-center justify-center gap-2 bg-[#d8c08a] px-8 py-4 text-xs font-semibold uppercase tracking-wider text-[#11110f] transition-all duration-200 hover:bg-[#c6a15b] disabled:opacity-50 sm:w-auto"
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
          SECTION 5 — POLICY QUICK LINKS
      ────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 border-b border-white/10">
        <Container>
          <div className="rounded-2xl border border-white/10 bg-[#171715] p-8 sm:p-10">
            <h3 className="font-display text-xl text-[#f4efe6]">
              Looking for Store Policies?
            </h3>
            <p className="mt-2 text-xs text-[#8e8a82]">
              Review our complete store guidelines, delivery timelines, terms of service, and refund conditions:
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-xs">
              <Link
                to="/shipping"
                className="px-4 py-2.5 rounded-xl border border-white/10 bg-[#11110f] text-[#c6a15b] hover:border-[#c6a15b] transition"
              >
                Shipping Policy &rarr;
              </Link>
              <Link
                to="/refund-policy"
                className="px-4 py-2.5 rounded-xl border border-white/10 bg-[#11110f] text-[#c6a15b] hover:border-[#c6a15b] transition"
              >
                Refund & Cancellation Policy &rarr;
              </Link>
              <Link
                to="/privacy"
                className="px-4 py-2.5 rounded-xl border border-white/10 bg-[#11110f] text-[#c6a15b] hover:border-[#c6a15b] transition"
              >
                Privacy Policy &rarr;
              </Link>
              <Link
                to="/terms"
                className="px-4 py-2.5 rounded-xl border border-white/10 bg-[#11110f] text-[#c6a15b] hover:border-[#c6a15b] transition"
              >
                Terms & Conditions &rarr;
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
