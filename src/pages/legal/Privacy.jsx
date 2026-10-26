import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Lock, AlertCircle, Eye } from "lucide-react";
import Container from "../../components/ui/Container";

export default function Privacy() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Privacy Policy | The Decant Bar";
  }, []);

  return (
    <div className="min-h-screen bg-[#11110f] text-[#f4efe6] py-16 sm:py-24">
      <Container>
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#c6a15b]/30 bg-[#c6a15b]/10 text-[#c6a15b] text-[11px] uppercase tracking-[0.25em] font-semibold mb-4">
            <Lock size={14} />
            <span>Data Protection</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-[#f4efe6] tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-4 text-xs sm:text-sm text-[#8e8a82] max-w-xl mx-auto leading-relaxed">
            Your privacy is of the utmost importance to The Decant Bar. This policy describes what information we collect, how we protect it, and how it is used to deliver your luxury fragrance discovery orders.
          </p>
          <p className="mt-2 text-[11px] text-[#c6a15b]/80">
            Last Updated: October 2026
          </p>
        </div>

        {/* Highlight Card */}
        <div className="max-w-3xl mx-auto mb-12 p-6 rounded-2xl border border-white/10 bg-[#171715] shadow-xl">
          <div className="flex items-start gap-4">
            <ShieldCheck size={24} className="text-[#c6a15b] shrink-0 mt-1" />
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#c6a15b]">
                Our Privacy Commitment
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#c5c1b9]">
                We do not sell, rent, or trade your personal information to third-party advertising brokers. Your contact and delivery details are used solely to fulfill your fragrance orders, send transaction receipts, and provide customer support.
              </p>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="max-w-3xl mx-auto space-y-10 text-xs sm:text-sm text-[#c5c1b9] leading-relaxed">
          {/* Section 1 */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">1.</span> Information We Collect
            </h2>
            <p>
              When you browse our catalogue, register an account, or place an order, we collect specific details necessary to provide our services:
            </p>
            <ul className="mt-3 space-y-2 list-disc list-inside text-xs text-[#8e8a82]">
              <li><strong className="text-[#f4efe6]">Contact & Account Details:</strong> Full name, email address, password hash, and 10-digit Indian mobile number.</li>
              <li><strong className="text-[#f4efe6]">Shipping & Delivery Details:</strong> Physical delivery address, city, state, postal PIN code, and optional delivery notes.</li>
              <li><strong className="text-[#f4efe6]">Payment Records:</strong> Order amounts, payment method selected (Razorpay online or Cash on Delivery), and transaction reference IDs. (Note: We never store card numbers or UPI PINs).</li>
              <li><strong className="text-[#f4efe6]">Order History & Preferences:</strong> Past fragrance purchases, selected decant volumes (2ml, 5ml, 10ml), and product review submissions.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">2.</span> How We Use Your Information
            </h2>
            <ul className="space-y-2 list-disc list-inside text-xs text-[#8e8a82]">
              <li><strong className="text-[#f4efe6]">Fulfillment & Logistics:</strong> Generating shipping manifests and dispatching packages through verified domestic courier partners.</li>
              <li><strong className="text-[#f4efe6]">Transactional Communications:</strong> Sending order confirmations, dispatch tracking updates, and one-time authentication codes (OTPs).</li>
              <li><strong className="text-[#f4efe6]">Fraud Prevention:</strong> Verifying order authenticity and protecting against duplicate submissions or unauthorized card usage.</li>
              <li><strong className="text-[#f4efe6]">Customer Support:</strong> Addressing customer enquiries regarding packaging, tracking, or fragrance recommendations.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">3.</span> Payment Security & Third-Party Processors
            </h2>
            <p>
              All online payments are processed through <strong className="text-[#f4efe6]">Razorpay</strong>, a RBI-regulated, PCI-DSS Level 1 compliant payment aggregator.
            </p>
            <p className="mt-2 text-xs text-[#8e8a82]">
              Your financial credentials (credit/debit card numbers, CVVs, and UPI PINs) are encrypted directly between your browser and the payment gateway. The Decant Bar servers only receive cryptographic verification signatures confirming payment status.
            </p>
          </section>

          {/* Section 4 */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">4.</span> Cookies & Local Storage
            </h2>
            <p>
              We utilize browser <code className="text-[#c6a15b] font-mono text-xs">localStorage</code> to persist your shopping cart items between sessions and to remember authenticated sessions securely. We do not use third-party tracking cookies or sell your browsing history to advertising data networks.
            </p>
          </section>

          {/* Section 5 */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">5.</span> Data Retention & Your Rights
            </h2>
            <p>
              You have the right to inspect, update, or request the deletion of your account information at any time through your <Link to="/account" className="text-[#c6a15b] underline">Account Dashboard</Link> or by contacting our support team.
            </p>
            <p className="mt-2 text-xs text-[#8e8a82]">
              Transaction records are retained for the duration legally required by Indian accounting and taxation authorities.
            </p>
          </section>

          {/* Owner Confirmation Section */}
          <section className="p-6 rounded-2xl border border-amber-500/30 bg-amber-950/10">
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                  Privacy Contact & Data Controller (For Owner Review)
                </h3>
                <p className="mt-1 text-xs text-amber-200/80 leading-relaxed">
                  The following details represent operational information to be confirmed prior to public launch:
                </p>
                <div className="mt-3 space-y-1 text-xs text-[#f4efe6]/90 font-mono bg-black/40 p-3 rounded-2xl border border-white/10">
                  <p>• Data Protection Officer / Grievance Officer: [Designated Representative — Pending Owner Confirmation]</p>
                  <p>• Registered Business Address: [City / State, India — Pending Owner Confirmation]</p>
                  <p>• Official Contact Email: thedecantbarofficial@gmail.com</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Bottom Navigation */}
        <div className="max-w-3xl mx-auto mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
          <Link
            to="/terms"
            className="text-[#c6a15b] hover:text-[#d8c08a] transition underline"
          >
            &rarr; Read our Terms & Conditions
          </Link>
          <Link
            to="/shipping"
            className="text-[#c6a15b] hover:text-[#d8c08a] transition underline"
          >
            &rarr; Read our Shipping Policy
          </Link>
        </div>
      </Container>
    </div>
  );
}

