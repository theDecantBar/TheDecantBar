import { useEffect } from "react";
import { Link } from "react-router-dom";
import { RotateCcw, AlertTriangle, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";
import Container from "../../components/ui/Container";

export default function RefundPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Refund & Cancellation Policy | The Decant Bar";
  }, []);

  return (
    <div className="min-h-screen bg-[#11110f] text-[#f4efe6] py-16 sm:py-24">
      <Container>
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#c6a15b]/30 bg-[#c6a15b]/10 text-[#c6a15b] text-[11px] uppercase tracking-[0.25em] font-semibold mb-4">
            <RotateCcw size={14} />
            <span>Returns & Cancellations</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-[#f4efe6] tracking-tight">
            Refund & Cancellation Policy
          </h1>
          <p className="mt-4 text-xs sm:text-sm text-[#8e8a82] max-w-xl mx-auto leading-relaxed">
            We are committed to delivering authentic, pristine fragrance decants. Please read our guidelines regarding transit damage, cancellations, and replacement procedures below.
          </p>
          <p className="mt-2 text-[11px] text-[#c6a15b]/80">
            Last Updated: October 2026
          </p>
        </div>

        {/* Essential Principle Card */}
        <div className="max-w-3xl mx-auto mb-12 p-6 rounded-2xl border border-amber-500/40 bg-[#171715] shadow-xl">
          <div className="flex items-start gap-4">
            <AlertTriangle size={24} className="text-[#c6a15b] shrink-0 mt-1" />
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#c6a15b]">
                Personal Hygiene & Olfactory Exploration Policy
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#c5c1b9]">
                Fragrance decants are classified as personal cosmetic products. For health, hygiene, and product integrity reasons, <strong className="text-[#f4efe6]">opened, tested, or sprayed decants cannot be returned or refunded due to personal scent preference or dislike of a fragrance</strong>.
              </p>
              <p className="mt-2 text-xs leading-relaxed text-[#8e8a82]">
                The very purpose of purchasing travel decants (2ml, 5ml, 10ml) is to explore and sample high-end scents economically before committing to an expensive full-sized retail flacon.
              </p>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="max-w-3xl mx-auto space-y-10 text-xs sm:text-sm text-[#c5c1b9] leading-relaxed">
          {/* Section 1 */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">1.</span> Damaged, Leaking, or Incorrect Items
            </h2>
            <p>
              If your package arrives with broken glass, noticeable liquid leakage, a defective non-spraying atomizer nozzle, or if an incorrect fragrance was delivered, you are eligible for an immediate <strong className="text-[#f4efe6]">free replacement</strong> or a <strong className="text-[#f4efe6]">full refund</strong>.
            </p>
            <div className="mt-4 p-4 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs">
              <p className="font-semibold text-[#f4efe6]">To file a damage or leakage claim:</p>
              <ol className="list-decimal list-inside space-y-1.5 text-[#8e8a82]">
                <li>Contact our support team within <strong className="text-[#f4efe6]">48 hours of delivery</strong> [Subject to Owner Confirmation].</li>
                <li>Provide clear photographs or a short video showing the outer shipping box with the visible courier shipping label.</li>
                <li>Include a clear photograph showing the damaged vial, leakage mark, or defective atomizer.</li>
              </ol>
            </div>
          </section>

          {/* Section 2 */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">2.</span> Order Cancellation Rules
            </h2>
            <ul className="space-y-3 list-disc list-inside text-xs text-[#8e8a82]">
              <li><strong className="text-[#f4efe6]">Before Dispatch:</strong> You may cancel an order free of charge at any time before it has been manifested and handed over to the courier partner. To cancel, please message our support team or use the <Link to="/contact" className="text-[#c6a15b] underline">Contact Form</Link> with your order number.</li>
              <li><strong className="text-[#f4efe6]">After Dispatch:</strong> Once an order is in transit with an active tracking number, it cannot be cancelled or intercepted mid-journey.</li>
              <li><strong className="text-[#f4efe6]">Cash on Delivery (COD) Cancellations:</strong> Repeated arbitrary refusal of COD deliveries at the doorstep disrupts logistics and may result in the suspension of COD privileges for your account.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">3.</span> Refund Timelines & Settlement Method
            </h2>
            <p>
              Upon verification and approval of a claim:
            </p>
            <ul className="mt-3 space-y-2 list-disc list-inside text-xs text-[#8e8a82]">
              <li><strong className="text-[#f4efe6]">Online Payments (Razorpay):</strong> Refunds are initiated directly through Razorpay back to your original payment method (Credit/Debit Card, Net Banking, or UPI account). Funds typically credit within <strong className="text-[#f4efe6]">5 to 7 business days</strong> depending on your bank's processing cycle.</li>
              <li><strong className="text-[#f4efe6]">Cash on Delivery (COD) Refunds:</strong> For approved COD damage claims where replacement is not desired, refunds are issued via direct UPI or bank transfer upon receipt of customer bank account details.</li>
              <li><strong className="text-[#f4efe6]">Replacement Option:</strong> Customers may choose to have a fresh replacement bottle dispatched immediately at zero additional shipping cost.</li>
            </ul>
          </section>

          {/* Owner Confirmation Section */}
          <section className="p-6 rounded-2xl border border-amber-500/30 bg-amber-950/10">
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                  Claim Window & Support Contact (For Owner Review)
                </h3>
                <p className="mt-1 text-xs text-amber-200/80 leading-relaxed">
                  The following details represent operational parameters to be confirmed prior to public launch:
                </p>
                <div className="mt-3 space-y-1 text-xs text-[#f4efe6]/90 font-mono bg-black/40 p-3 rounded-lg border border-white/10">
                  <p>• Damage Reporting Window: [48 Hours from Courier Delivery Stamp — Pending Owner Confirmation]</p>
                  <p>• Unboxing Video: [Recommended / Mandatory for High-Value Claims — Pending Owner Confirmation]</p>
                  <p>• Refund Support Email: thedecantbarofficial@gmail.com</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Bottom Navigation */}
        <div className="max-w-3xl mx-auto mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
          <Link
            to="/shipping"
            className="text-[#c6a15b] hover:text-[#d8c08a] transition underline"
          >
            &rarr; Read our Shipping Policy
          </Link>
          <Link
            to="/terms"
            className="text-[#c6a15b] hover:text-[#d8c08a] transition underline"
          >
            &rarr; Read our Terms & Conditions
          </Link>
        </div>
      </Container>
    </div>
  );
}

