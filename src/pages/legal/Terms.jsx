import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FileText, Shield, AlertCircle, Scale } from "lucide-react";
import Container from "../../components/ui/Container";

export default function Terms() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Terms & Conditions | The Decant Bar";
  }, []);

  return (
    <div className="min-h-screen bg-[#11110f] text-[#f4efe6] py-16 sm:py-24">
      <Container>
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#c6a15b]/30 bg-[#c6a15b]/10 text-[#c6a15b] text-[11px] uppercase tracking-[0.25em] font-semibold mb-4">
            <Scale size={14} />
            <span>Legal Agreement</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-[#f4efe6] tracking-tight">
            Terms & Conditions
          </h1>
          <p className="mt-4 text-xs sm:text-sm text-[#8e8a82] max-w-xl mx-auto leading-relaxed">
            Please read these terms carefully before placing an order on The Decant Bar. By using our website and purchasing our fragrance decants, you agree to be bound by the terms outlined below.
          </p>
          <p className="mt-2 text-[11px] text-[#c6a15b]/80">
            Last Updated: October 2026
          </p>
        </div>

        {/* Notice Card: Independent Decanter Disclaimer */}
        <div className="max-w-3xl mx-auto mb-12 p-6 rounded-2xl border border-[#c6a15b]/40 bg-[#171715] shadow-xl">
          <div className="flex items-start gap-4">
            <Shield size={24} className="text-[#c6a15b] shrink-0 mt-1" />
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#c6a15b]">
                Independent Decanter Notice & Trademark Disclaimer
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#c5c1b9]">
                The Decant Bar is a completely independent perfume decanter and fragrance discovery service. We are <strong className="text-[#f4efe6]">not affiliated, associated, authorized, endorsed by, or in any way officially connected</strong> with any of the luxury fragrance houses, designers, or manufacturers whose products are decanted on this platform.
              </p>
              <p className="mt-2 text-xs leading-relaxed text-[#c5c1b9]">
                All brand names, product trademarks, logos, and registered marks belong exclusively to their respective owners. Any reference to designer or niche brand names is strictly for the purpose of identifying the genuine fragrance being decanted into our custom travel-sized atomizers.
              </p>
            </div>
          </div>
        </div>

        {/* Terms Content Clauses */}
        <div className="max-w-3xl mx-auto space-y-10 text-xs sm:text-sm text-[#c5c1b9] leading-relaxed">
          {/* Section 1 */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">1.</span> The Decanting Process & Product Authenticity
            </h2>
            <p>
              All decants provided by The Decant Bar contain authentic, genuine luxury perfume transferred directly from original retail bottles purchased through authorized channels.
            </p>
            <ul className="mt-3 space-y-2 list-disc list-inside text-xs text-[#8e8a82]">
              <li>We decant genuine fragrances into sterile, laboratory-grade glass spray atomizers (2ml, 5ml, and 10ml formats).</li>
              <li>Decants do not arrive in original manufacturer bottles, but rather in our own custom-branded travel atomizers with secure caps and fine-mist spray nozzles.</li>
              <li>Because fragrances naturally react to skin chemistry and ambient temperatures, olfactory perception, longevity, and sillage may vary between individuals.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">2.</span> Orders, Pricing & Payment Terms
            </h2>
            <p>
              All orders are subject to acceptance and availability. We reserve the right to cancel or refuse any order for reasons including inventory inaccuracies, suspected fraudulent transactions, or billing discrepancies.
            </p>
            <ul className="mt-3 space-y-2 list-disc list-inside text-xs text-[#8e8a82]">
              <li><strong className="text-[#f4efe6]">Pricing:</strong> All prices are displayed in Indian Rupees (INR, ₹). Prices may change without prior notice, but confirmed orders will be honored at the price charged at checkout.</li>
              <li><strong className="text-[#f4efe6]">Payment Methods:</strong> We accept online payments via Razorpay (UPI, Credit/Debit Cards, Net Banking) and Cash on Delivery (COD) for eligible domestic PIN codes.</li>
              <li><strong className="text-[#f4efe6]">Authentication Requirement:</strong> To ensure order accountability and secure tracking, customers must create or log into a verified user account to finalize an order.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">3.</span> Customer Accounts & Information Accuracy
            </h2>
            <p>
              When registering an account, you agree to provide truthful, accurate, and complete information, including a valid 10-digit Indian mobile number and delivery address. You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
          </section>

          {/* Section 4 */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">4.</span> Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by law, The Decant Bar and its operators shall not be liable for any indirect, incidental, punitive, or consequential damages arising from the use of our services or products.
            </p>
            <p className="mt-2 text-xs text-[#8e8a82]">
              Because fragrances contain natural botanical compounds and aroma-chemicals, we strongly recommend conducting a small patch test before widespread application. The Decant Bar is not liable for individual allergic reactions or skin sensitivities.
            </p>
          </section>

          {/* Section 5 */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">5.</span> Governing Law & Jurisdiction
            </h2>
            <p>
              These Terms and Conditions shall be governed by and construed in accordance with the laws of the Republic of India. Any disputes arising in connection with these terms shall be subject to the exclusive jurisdiction of the competent courts in India.
            </p>
          </section>

          {/* Section 6: Business Owner Confirmation Placeholders */}
          <section className="p-6 rounded-2xl border border-amber-500/30 bg-amber-950/10">
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                  Business Entity Details (For Owner Review)
                </h3>
                <p className="mt-1 text-xs text-amber-200/80 leading-relaxed">
                  The following details represent operational information to be confirmed prior to public launch:
                </p>
                <div className="mt-3 space-y-1 text-xs text-[#f4efe6]/90 font-mono bg-black/40 p-3 rounded-lg border border-white/10">
                  <p>• Entity Name: [The Decant Bar / Registered Sole Proprietorship or LLP — Pending Owner Confirmation]</p>
                  <p>• Registered Operating Location: [City / State, India — Pending Owner Confirmation]</p>
                  <p>• Grievance & Legal Contact: thedecantbarofficial@gmail.com</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Bottom Navigation */}
        <div className="max-w-3xl mx-auto mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
          <Link
            to="/privacy"
            className="text-[#c6a15b] hover:text-[#d8c08a] transition underline"
          >
            &rarr; Read our Privacy Policy
          </Link>
          <Link
            to="/refund-policy"
            className="text-[#c6a15b] hover:text-[#d8c08a] transition underline"
          >
            &rarr; Read our Refund & Cancellation Policy
          </Link>
        </div>
      </Container>
    </div>
  );
}

