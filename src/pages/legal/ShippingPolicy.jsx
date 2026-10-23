import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Truck, Package, ShieldCheck, AlertCircle, Clock } from "lucide-react";
import Container from "../../components/ui/Container";

export default function ShippingPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Shipping Policy | The Decant Bar";
  }, []);

  return (
    <div className="min-h-screen bg-[#11110f] text-[#f4efe6] py-16 sm:py-24">
      <Container>
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#c6a15b]/30 bg-[#c6a15b]/10 text-[#c6a15b] text-[11px] uppercase tracking-[0.25em] font-semibold mb-4">
            <Truck size={14} />
            <span>Fulfillment & Dispatch</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-[#f4efe6] tracking-tight">
            Shipping & Delivery Policy
          </h1>
          <p className="mt-4 text-xs sm:text-sm text-[#8e8a82] max-w-xl mx-auto leading-relaxed">
            Every fragrance decant is prepared fresh upon order placement and packaged with rigorous protective standards to ensure authentic luxury arrives intact at your doorstep.
          </p>
          <p className="mt-2 text-[11px] text-[#c6a15b]/80">
            Last Updated: October 2026
          </p>
        </div>

        {/* Highlight Banner: Live Store Shipping Rates */}
        <div className="max-w-3xl mx-auto mb-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl border border-[#c6a15b]/40 bg-[#171715] shadow-xl">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#c6a15b] font-semibold">Standard Shipping</span>
            <div className="mt-2 text-2xl font-bold text-[#f4efe6]">₹80 Flat Rate</div>
            <p className="mt-1 text-xs text-[#8e8a82]">Applicable on all orders under ₹500 across India.</p>
          </div>
          <div className="p-6 rounded-2xl border border-[#c6a15b] bg-[#1a1915] shadow-xl">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#c6a15b] font-semibold">Complimentary Shipping</span>
            <div className="mt-2 text-2xl font-bold text-[#c6a15b]">FREE Shipping</div>
            <p className="mt-1 text-xs text-[#8e8a82]">Automatically applied at checkout for orders ₹500 and above.</p>
          </div>
        </div>

        {/* Content Sections */}
        <div className="max-w-3xl mx-auto space-y-10 text-xs sm:text-sm text-[#c5c1b9] leading-relaxed">
          {/* Section 1 */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">1.</span> Order Processing & Dispatch Timelines
            </h2>
            <p>
              To preserve top-note vibrancy and prevent premature oxidation, our fragrances are not pre-poured in bulk; each bottle is freshly decanted and sealed following order confirmation.
            </p>
            <div className="mt-4 p-4 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[#f4efe6]">
                <Clock size={16} className="text-[#c6a15b]" />
                <span className="font-semibold">Processing Window:</span>
              </div>
              <p className="text-[#8e8a82]">
                Orders placed Monday through Saturday are typically dispatched within <strong className="text-[#f4efe6]">24 to 48 hours</strong> [Subject to Owner Confirmation]. Orders placed on Sundays or national holidays are processed on the subsequent working day.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">2.</span> Estimated Delivery Times
            </h2>
            <p>
              We ship across all serviceable postal PIN codes in India. Once your parcel is handed over to our courier partner, estimated transit times are as follows:
            </p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-lg bg-black/30 border border-white/5">
                <p className="font-semibold text-[#f4efe6]">Metro Cities (Delhi, Mumbai, Bengaluru, etc.):</p>
                <p className="text-[#8e8a82] mt-1">2 – 4 Business Days [Courier Partner Dependent]</p>
              </div>
              <div className="p-3.5 rounded-lg bg-black/30 border border-white/5">
                <p className="font-semibold text-[#f4efe6]">Tier 2 & Tier 3 Cities / Rest of India:</p>
                <p className="text-[#8e8a82] mt-1">4 – 7 Business Days [Courier Partner Dependent]</p>
              </div>
            </div>
            <p className="mt-3 text-[11px] text-[#8e8a82]">
              *Note: Remote postal zones, North-Eastern states, and locations experiencing seasonal weather disruptions may require up to 8–10 business days.
            </p>
          </section>

          {/* Section 3 */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">3.</span> Packaging & Leak-Proof Standards
            </h2>
            <p>
              Fragrance liquids require specialized handling during transit. Every decant from The Decant Bar is protected using multi-tier safety standards:
            </p>
            <ul className="mt-3 space-y-2 list-disc list-inside text-xs text-[#8e8a82]">
              <li><strong className="text-[#f4efe6]">Atomizer Seals:</strong> Spray nozzles are firmly screwed onto glass vials with Teflon-grade sealing tape and checked for tight closure.</li>
              <li><strong className="text-[#f4efe6]">Protective Cushioning:</strong> Bottles are wrapped in dual-layer bubble insulation to prevent glass friction and impact damage.</li>
              <li><strong className="text-[#f4efe6]">Discreet Exterior Packaging:</strong> Parcels are shipped in unmarked rigid boxes to deter theft and tampering during transit.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">4.</span> Tracking Your Order
            </h2>
            <p>
              Once your parcel is manifested with our courier partner, you will receive an email confirmation containing your <strong className="text-[#f4efe6]">Courier Name</strong> and <strong className="text-[#f4efe6]">Tracking Number (AWB)</strong>. You can also monitor your live delivery status at any time in your <Link to="/account" className="text-[#c6a15b] underline">Account Dashboard</Link>.
            </p>
          </section>

          {/* Owner Confirmation Section */}
          <section className="p-6 rounded-2xl border border-amber-500/30 bg-amber-950/10">
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                  Courier Partners & Shipping Disclaimers (For Owner Review)
                </h3>
                <p className="mt-1 text-xs text-amber-200/80 leading-relaxed">
                  The following details represent operational information to be confirmed prior to public launch:
                </p>
                <div className="mt-3 space-y-1 text-xs text-[#f4efe6]/90 font-mono bg-black/40 p-3 rounded-lg border border-white/10">
                  <p>• Partner Couriers: [e.g. Delhivery, Blue Dart, DTDC, XpressBees — Pending Owner Confirmation]</p>
                  <p>• Dispatch Hub: [City, State — Pending Owner Confirmation]</p>
                  <p>• Incomplete Addresses: Orders returned due to incorrect 10-digit phone or PIN code may incur re-shipping fees.</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Bottom Navigation */}
        <div className="max-w-3xl mx-auto mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
          <Link
            to="/refund-policy"
            className="text-[#c6a15b] hover:text-[#d8c08a] transition underline"
          >
            &rarr; Read our Refund & Cancellation Policy
          </Link>
          <Link
            to="/contact"
            className="text-[#c6a15b] hover:text-[#d8c08a] transition underline"
          >
            &rarr; Have a shipping question? Contact us
          </Link>
        </div>
      </Container>
    </div>
  );
}

