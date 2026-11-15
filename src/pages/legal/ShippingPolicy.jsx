import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Truck, ShieldCheck, Mail, Phone, MapPin, Clock, AlertTriangle } from "lucide-react";
import Container from "../../components/ui/Container";

export default function ShippingPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Shipping & Delivery Policy | The Decant Bar";
  }, []);

  return (
    <div className="min-h-screen bg-[#11110f] text-[#f4efe6] py-16 sm:py-24">
      <Container>
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#c6a15b]/30 bg-[#c6a15b]/10 text-[#c6a15b] text-[11px] uppercase tracking-[0.25em] font-semibold mb-4">
            <Truck size={14} />
            <span>Fulfillment & Logistics</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-[#f4efe6] tracking-tight">
            Shipping & Delivery Policy
          </h1>
          <p className="mt-4 text-xs sm:text-sm text-[#8e8a82] max-w-xl mx-auto leading-relaxed">
            At The Decant Bar, we aim to provide a convenient and reliable delivery experience for customers purchasing perfumes and fragrance decants. We deliver across India, subject to courier availability and serviceability.
          </p>
          <p className="mt-3 text-[11px] font-medium uppercase tracking-wider text-[#c6a15b]">
            Last Updated: 15 November 2026
          </p>
        </div>

        {/* Commitment Highlight Card */}
        <div className="max-w-3xl mx-auto mb-12 p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#171715] shadow-xl">
          <div className="flex items-start gap-4">
            <ShieldCheck size={24} className="text-[#c6a15b] shrink-0 mt-1" />
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#c6a15b]">
                Reliable Pan-India Delivery
              </h2>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#c5c1b9]">
                Every fragrance is carefully packaged in specialized protective materials to ensure that your decants arrive in pristine condition, leak-free, and ready for your olfactory enjoyment.
              </p>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="max-w-3xl mx-auto space-y-8 text-xs sm:text-sm text-[#c5c1b9] leading-relaxed">
          {/* Section 1: Delivery Coverage */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">1.</span> Delivery Coverage
            </h2>
            <p>
              We accept orders from customers across India.
            </p>
            <p className="mt-2 text-xs text-[#8e8a82]">
              Delivery availability depends on the serviceability of the customer's PIN code and the availability of our delivery partners.
            </p>
          </section>

          {/* Section 2: Order Processing */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">2.</span> Order Processing
            </h2>
            <p>
              Orders are processed after successful order confirmation and payment verification, where applicable.
            </p>
            <p className="mt-2 text-xs text-[#8e8a82]">
              Order processing generally takes <strong className="text-[#f4efe6]">[CONFIRM PROCESSING TIME]</strong> business days.
            </p>
            <p className="mt-2 text-xs text-[#8e8a82]">
              Processing may take longer during holidays, sales or periods of high order volume.
            </p>
          </section>

          {/* Section 3: Estimated Delivery Time */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">3.</span> Estimated Delivery Time
            </h2>
            <div className="p-4 rounded-xl border border-white/5 bg-[#171715] text-xs space-y-2">
              <p className="font-semibold text-[#f4efe6]">
                Estimated delivery time: <span className="text-[#c6a15b]">[CONFIRM DELIVERY ESTIMATE]</span> business days after dispatch.
              </p>
            </div>
            <p className="mt-4 text-xs text-[#c5c1b9]">
              Actual delivery times may vary depending on:
            </p>
            <ul className="mt-2 space-y-1.5 list-disc list-inside text-xs text-[#8e8a82]">
              <li>Delivery location.</li>
              <li>Courier availability.</li>
              <li>Weather conditions.</li>
              <li>Public holidays.</li>
              <li>Unforeseen logistical circumstances.</li>
            </ul>
          </section>

          {/* Section 4: Shipping Charges */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">4.</span> Shipping Charges
            </h2>
            <p>
              Applicable shipping charges, if any, will be displayed during checkout before the customer completes payment.
            </p>
          </section>

          {/* Section 5: Order Tracking */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">5.</span> Order Tracking
            </h2>
            <p>
              Where tracking facilities are available, customers may receive shipment tracking details through their registered contact information.
            </p>
            <p className="mt-2 text-xs text-[#8e8a82]">
              You can also view your order status and tracking details anytime in your{" "}
              <Link to="/account" className="text-[#c6a15b] underline">
                Account Dashboard
              </Link>
              .
            </p>
          </section>

          {/* Section 6: Incorrect Shipping Information */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">6.</span> Incorrect Shipping Information
            </h2>
            <p>Customers are responsible for providing accurate shipping details, including:</p>
            <ul className="mt-3 space-y-1.5 list-disc list-inside text-xs text-[#8e8a82]">
              <li>Full name.</li>
              <li>Complete delivery address.</li>
              <li>PIN code.</li>
              <li>Contact number.</li>
            </ul>
            <p className="mt-3 text-xs text-[#8e8a82]">
              Incorrect or incomplete information may result in delivery delays or failed delivery attempts.
            </p>
          </section>

          {/* Section 7: Delayed Deliveries */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">7.</span> Delayed Deliveries
            </h2>
            <p>
              Although we make reasonable efforts to deliver orders within the estimated timeframe, delays may occur due to courier operations or circumstances beyond our control.
            </p>
            <p className="mt-2 text-xs text-[#8e8a82]">
              Customers can contact our support team for assistance with delayed orders.
            </p>
          </section>

          {/* Section 8: Damaged or Leaking Packages */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">8.</span> Damaged or Leaking Packages
            </h2>
            <p>
              If a package arrives visibly damaged, leaking or tampered with, customers should document the condition and contact us promptly.
            </p>
            <p className="mt-3 text-xs text-[#c5c1b9]">Please share:</p>
            <ul className="mt-2 space-y-1.5 list-disc list-inside text-xs text-[#8e8a82]">
              <li>Order ID.</li>
              <li>Photographs or videos of the package.</li>
              <li>Details of the issue.</li>
            </ul>
            <p className="mt-3 text-xs text-[#8e8a82]">
              Our team will review the complaint and assist with an appropriate resolution.
            </p>
          </section>

          {/* Section 9: Delivery Issues */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">9.</span> Delivery Issues
            </h2>
            <p>
              If an order is marked as delivered but has not been received, customers should contact us as soon as possible.
            </p>
            <p className="mt-2 text-xs text-[#8e8a82]">
              We will coordinate with the relevant delivery partner to investigate the issue.
            </p>
          </section>

          {/* Section 10: Contact Us */}
          <section className="p-6 sm:p-8 rounded-2xl border border-[#c6a15b]/30 bg-[#171715] shadow-xl">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">10.</span> Contact Us
            </h2>
            <p className="text-xs text-[#8e8a82]">
              For shipping and delivery assistance:
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
            to="/refund-policy"
            className="text-[#c6a15b] hover:text-[#d8c08a] transition underline"
          >
            &rarr; Read our Refund & Cancellation Policy
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
