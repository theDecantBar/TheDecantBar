import { useEffect } from "react";
import { Link } from "react-router-dom";
import { RotateCcw, AlertTriangle, ShieldCheck, Mail, Phone, Package, CheckCircle2 } from "lucide-react";
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
            <span>Customer Satisfaction</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-[#f4efe6] tracking-tight">
            Refund & Cancellation Policy
          </h1>
          <p className="mt-4 text-xs sm:text-sm text-[#8e8a82] max-w-xl mx-auto leading-relaxed">
            At The Decant Bar, we aim to provide customers with a satisfactory shopping experience. This policy explains the conditions for order cancellations, returns, exchanges and refunds for purchases made through our website.
          </p>
          <p className="mt-3 text-[11px] font-medium uppercase tracking-wider text-[#c6a15b]">
            Last Updated: 15 November 2026
          </p>
        </div>

        {/* Highlight Card */}
        <div className="max-w-3xl mx-auto mb-12 p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#171715] shadow-xl">
          <div className="flex items-start gap-4">
            <ShieldCheck size={24} className="text-[#c6a15b] shrink-0 mt-1" />
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#c6a15b]">
                Transparent & Fair Customer Resolutions
              </h2>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#c5c1b9]">
                We stand behind the quality and authenticity of every fragrance decanted by our team. If you encounter any transit issues or defective items, our team will review the request promptly and determine an appropriate resolution in accordance with applicable consumer law.
              </p>
            </div>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="max-w-3xl mx-auto space-y-8 text-xs sm:text-sm text-[#c5c1b9] leading-relaxed">
          {/* Section 1: Order Cancellation */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">1.</span> Order Cancellation
            </h2>
            <p>Customers who wish to cancel an order should contact us as soon as possible.</p>
            <ul className="mt-3 space-y-2 list-disc list-inside text-xs text-[#8e8a82]">
              <li>Cancellation requests may be accepted before the order has been processed or dispatched.</li>
              <li>Once an order has been dispatched, cancellation may no longer be possible.</li>
              <li>Please contact our customer support team for assistance with cancellation requests.</li>
            </ul>
          </section>

          {/* Section 2: Return Eligibility */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">2.</span> Return Eligibility
            </h2>
            <p>To be eligible for a return, products should generally:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside text-xs text-[#8e8a82]">
              <li>Be unused and unopened.</li>
              <li>Remain in their original packaging.</li>
              <li>Be accompanied by valid proof of purchase.</li>
              <li>Meet the applicable return conditions.</li>
            </ul>
            <p className="mt-3 text-xs text-[#8e8a82]">
              Requests will be reviewed according to the nature of the product and applicable consumer protection requirements.
            </p>
          </section>

          {/* Section 3: Damaged, Defective or Incorrect Products */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">3.</span> Damaged, Defective or Incorrect Products
            </h2>
            <p>
              If you receive a damaged, leaking, defective or incorrect product, please contact us with:
            </p>
            <ul className="mt-3 space-y-2 list-disc list-inside text-xs text-[#8e8a82]">
              <li>Your order ID.</li>
              <li>A description of the issue.</li>
              <li>Clear photographs or videos showing the condition of the product and packaging.</li>
            </ul>
            <p className="mt-3 text-xs text-[#c5c1b9]">
              Our team will review the request and determine an appropriate resolution in accordance with applicable law.
            </p>
            <div className="mt-4 p-3.5 rounded-xl border border-[#c6a15b]/20 bg-[#171715] text-xs text-[#f4efe6]">
              Please report such issues within <span className="text-[#c6a15b] font-semibold">1-2 Days</span> of receiving the order.
            </div>
          </section>

          {/* Section 4: Non-Returnable Products */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">4.</span> Non-Returnable Products
            </h2>
            <p>
              Due to the personal-care nature of fragrance products, opened, used or unsealed products may not be eligible for return for hygiene and safety reasons, subject to applicable consumer rights.
            </p>
            <p className="mt-2 text-xs text-[#8e8a82]">
              Products damaged due to customer misuse or improper handling may also be ineligible for return.
            </p>
            <p className="mt-2 text-xs text-[#8e8a82]">
              This does not affect customers' legal rights in cases involving defective, damaged, incorrect or misrepresented products.
            </p>
          </section>

          {/* Section 5: Refunds */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">5.</span> Refunds
            </h2>
            <p>
              Once a return or refund request has been reviewed and approved, the refund will be initiated through the original payment method wherever possible.
            </p>
            <p className="mt-2 text-xs text-[#8e8a82]">
              The time required for the refund to reflect in your account depends on the payment provider and your bank.
            </p>
            <p className="mt-2 text-xs text-[#8e8a82]">
              Customers will be informed once the refund has been initiated.
            </p>
          </section>

          {/* Section 6: Late or Missing Refunds */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">6.</span> Late or Missing Refunds
            </h2>
            <p>If you have not received your refund:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside text-xs text-[#8e8a82]">
              <li>Check your original payment account.</li>
              <li>Contact your bank or payment provider to check the transaction status.</li>
              <li>Contact our support team with your order ID and payment details.</li>
            </ul>
            <p className="mt-3 text-xs text-[#8e8a82]">
              Our team will help investigate the issue.
            </p>
          </section>

          {/* Section 7: Exchanges */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">7.</span> Exchanges
            </h2>
            <p>
              Exchange requests involving damaged, defective or incorrect products will be reviewed individually.
            </p>
            <p className="mt-2 text-xs text-[#8e8a82]">
              Please contact our support team before sending any product back.
            </p>
          </section>

          {/* Section 8: Shipping Charges for Returns */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">8.</span> Shipping Charges for Returns
            </h2>
            <p>
              Return shipping arrangements and applicable costs will be communicated during the return process.
            </p>
            <p className="mt-2 text-xs text-[#8e8a82]">
              Where a product is defective, damaged, incorrect or otherwise subject to a consumer remedy, the resolution will follow applicable law.
            </p>
          </section>

          {/* Section 9: Contact Us */}
          <section className="p-6 sm:p-8 rounded-2xl border border-[#c6a15b]/30 bg-[#171715] shadow-xl">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">9.</span> Contact Us
            </h2>
            <p className="text-xs text-[#8e8a82]">
              For refund, return or cancellation enquiries:
            </p>

            <div className="mt-4 space-y-2 text-xs">
              <p className="text-sm font-semibold text-[#f4efe6]">The Decant Bar</p>
              <p className="flex items-center gap-2 text-[#c5c1b9]">
                <Mail size={14} className="text-[#c6a15b]" />
                Email:{" "}
                <a
                  href="mailto:contact@thedecantbar.com"
                  className="text-[#c6a15b] underline"
                >
                  contact@thedecantbar.com
                </a>
              </p>
              <p className="flex items-center gap-2 text-[#c5c1b9]">
                <Phone size={14} className="text-[#c6a15b]" />
                Phone: +91 95197 19993
              </p>
              <p className="text-[#c6a15b] font-medium pt-1">
                Please include your order ID when contacting us.
              </p>
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
