import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Scale, Shield, Mail, Phone, MapPin } from "lucide-react";
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
            Welcome to The Decant Bar. By accessing or using{" "}
            <a
              href="https://www.thedecantbar.com"
              className="text-[#c6a15b] hover:underline"
            >
              https://www.thedecantbar.com
            </a>
            , you agree to comply with these Terms and Conditions. Please read them carefully before using our website or placing an order.
          </p>
          <p className="mt-3 text-[11px] font-medium uppercase tracking-wider text-[#c6a15b]">
            Last Updated: 15 November 2026
          </p>
        </div>

        {/* Highlight Card */}
        <div className="max-w-3xl mx-auto mb-12 p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#171715] shadow-xl">
          <div className="flex items-start gap-4">
            <Shield size={24} className="text-[#c6a15b] shrink-0 mt-1" />
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#c6a15b]">
                About Our Agreement
              </h2>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#c5c1b9]">
                These terms govern your access to and use of The Decant Bar's website and services. By placing an order for our perfumes and fragrance decants, you acknowledge that you have read, understood and agree to be bound by these Terms and Conditions.
              </p>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="max-w-3xl mx-auto space-y-8 text-xs sm:text-sm text-[#c5c1b9] leading-relaxed">
          {/* Section 1: About Our Business */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">1.</span> About Our Business
            </h2>
            <p>
              The Decant Bar is a fragrance-focused business based in Chandigarh, India.
            </p>
            <p className="mt-2 text-xs text-[#8e8a82]">
              We offer perfumes and fragrance decants to customers across India.
            </p>
          </section>

          {/* Section 2: Use of Website */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">2.</span> Use of Website
            </h2>
            <p>By using our website, you agree:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside text-xs text-[#8e8a82]">
              <li>To provide accurate information when placing orders.</li>
              <li>Not to misuse the website.</li>
              <li>Not to attempt unauthorised access to our systems.</li>
              <li>To use our services only for lawful purposes.</li>
            </ul>
          </section>

          {/* Section 3: Products and Descriptions */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">3.</span> Products and Descriptions
            </h2>
            <p>
              We make reasonable efforts to ensure that product descriptions, fragrance information, images and prices are accurate.
            </p>
            <p className="mt-2 text-xs text-[#8e8a82]">
              Our products may be available in different decant sizes, including 2 ml, 5 ml and 10 ml, depending on availability and the relevant product listing.
            </p>
            <p className="mt-2 text-xs text-[#8e8a82]">
              Actual packaging and appearance may vary slightly from website photographs.
            </p>
            <p className="mt-2 text-xs text-[#8e8a82]">
              Fragrance preferences are subjective, and individual experiences may differ.
            </p>
          </section>

          {/* Section 4: Product Pricing */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">4.</span> Product Pricing
            </h2>
            <p>
              All product prices are displayed in Indian Rupees (INR).
            </p>
            <ul className="mt-3 space-y-2 list-disc list-inside text-xs text-[#8e8a82]">
              <li>Prices and available sizes are displayed on the respective product pages.</li>
              <li>Applicable shipping charges and taxes, if any, will be communicated before checkout.</li>
              <li>We reserve the right to update product prices and availability.</li>
              <li>Such changes will not ordinarily affect orders already confirmed.</li>
            </ul>
          </section>

          {/* Section 5: Orders and Confirmation */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">5.</span> Orders and Confirmation
            </h2>
            <p>
              Customers must provide accurate billing, contact and delivery information when placing an order.
            </p>
            <p className="mt-2 text-xs text-[#8e8a82]">
              An order is subject to product availability and successful payment verification.
            </p>
            <p className="mt-2 text-xs text-[#8e8a82]">
              We reserve the right to cancel orders in cases involving payment issues, suspected fraudulent activity, incorrect pricing or product unavailability, subject to applicable law.
            </p>
            <p className="mt-2 text-xs text-[#8e8a82]">
              Any eligible refund will be processed according to our{" "}
              <Link to="/refund-policy" className="text-[#c6a15b] underline">
                Refund & Cancellation Policy
              </Link>
              .
            </p>
          </section>

          {/* Section 6: Payments */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">6.</span> Payments
            </h2>
            <p>
              Payments may be made through the payment options displayed during checkout.
            </p>
            <p className="mt-2 text-xs text-[#8e8a82]">
              Transactions may be processed by third-party payment service providers, including Razorpay.
            </p>
            <p className="mt-2 text-xs text-[#8e8a82]">
              Customers must provide accurate payment information and complete the payment process to place an order successfully.
            </p>
          </section>

          {/* Section 7: Shipping and Delivery */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">7.</span> Shipping and Delivery
            </h2>
            <p>
              We aim to deliver products across India, subject to courier serviceability and applicable shipping restrictions.
            </p>
            <p className="mt-2 text-xs text-[#8e8a82]">
              Delivery timelines may vary depending on location, courier availability and other circumstances.
            </p>
            <p className="mt-2 text-xs text-[#8e8a82]">
              Please refer to our{" "}
              <Link to="/shipping" className="text-[#c6a15b] underline">
                Shipping Policy
              </Link>{" "}
              for additional details.
            </p>
          </section>

          {/* Section 8: Cancellation and Refunds */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">8.</span> Cancellation and Refunds
            </h2>
            <p>
              Order cancellations, returns and refunds are governed by our{" "}
              <Link to="/refund-policy" className="text-[#c6a15b] underline">
                Refund & Cancellation Policy
              </Link>
              .
            </p>
            <p className="mt-2 text-xs text-[#8e8a82]">
              Customers are encouraged to review the policy before purchasing.
            </p>
          </section>

          {/* Section 9: Intellectual Property */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">9.</span> Intellectual Property
            </h2>
            <p>
              Website content, including text, graphics, logos, images, design elements and other materials, belongs to The Decant Bar or its respective owners and may not be reproduced without appropriate permission.
            </p>
            <p className="mt-2 text-xs text-[#8e8a82]">
              Third-party brand names and trademarks remain the property of their respective owners.
            </p>
          </section>

          {/* Section 10: Third-Party Services */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">10.</span> Third-Party Services
            </h2>
            <p>
              Our website may use third-party services for payment processing, delivery, hosting and other operational purposes.
            </p>
            <p className="mt-2 text-xs text-[#8e8a82]">
              We are not responsible for interruptions or issues caused by external services beyond our reasonable control.
            </p>
          </section>

          {/* Section 11: Limitation of Liability */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">11.</span> Limitation of Liability
            </h2>
            <p>
              To the extent permitted by applicable law, The Decant Bar shall not be liable for indirect or consequential losses arising from the use of our website.
            </p>
            <p className="mt-2 text-xs text-[#8e8a82]">
              Nothing in these Terms excludes any consumer rights or legal remedies that cannot be excluded under applicable law.
            </p>
          </section>

          {/* Section 12: Changes to Terms */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">12.</span> Changes to Terms
            </h2>
            <p>
              We reserve the right to update these Terms and Conditions when necessary.
            </p>
            <p className="mt-2 text-xs text-[#8e8a82]">
              Updated terms will be published on this page.
            </p>
          </section>

          {/* Section 13: Governing Law */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">13.</span> Governing Law
            </h2>
            <p>
              These Terms and Conditions are governed by the laws of India, subject to applicable consumer protection laws and the jurisdiction of competent courts.
            </p>
          </section>

          {/* Section 14: Contact Information */}
          <section className="p-6 sm:p-8 rounded-2xl border border-[#c6a15b]/30 bg-[#171715] shadow-xl">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">14.</span> Contact Information
            </h2>
            <p className="text-xs text-[#8e8a82]">
              For questions regarding these Terms and Conditions:
            </p>

            <div className="mt-4 space-y-2 text-xs">
              <p className="text-sm font-semibold text-[#f4efe6]">The Decant Bar</p>
              <p className="flex items-center gap-2 text-[#c5c1b9]">
                <MapPin size={14} className="text-[#c6a15b]" />
                Chandigarh, India
              </p>
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
