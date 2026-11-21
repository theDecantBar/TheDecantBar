import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Lock, Mail, Phone, MapPin, Globe } from "lucide-react";
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
            <span>Data Protection & Privacy</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-[#f4efe6] tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-4 text-xs sm:text-sm text-[#8e8a82] max-w-xl mx-auto leading-relaxed">
            At The Decant Bar, accessible through{" "}
            <a
              href="https://www.thedecantbar.com"
              className="text-[#c6a15b] hover:underline"
            >
              https://www.thedecantbar.com
            </a>
            , we value the privacy of our customers and visitors.
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
                Our Privacy Commitment
              </h2>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#c5c1b9]">
                This Privacy Policy explains what information we collect, how we use it and the measures we take to protect your personal information when you visit our website or purchase our products. We do not sell customers' personal information to third parties.
              </p>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="max-w-3xl mx-auto space-y-8 text-xs sm:text-sm text-[#c5c1b9] leading-relaxed">
          {/* Section 1: Who We Are */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">1.</span> Who We Are
            </h2>
            <p>
              The Decant Bar is a fragrance-focused business based in Chandigarh, India, offering perfumes and fragrance decants to customers across India.
            </p>
            <div className="mt-4 p-4 rounded-xl border border-white/5 bg-[#171715] text-xs space-y-1">
              <p className="font-semibold text-[#f4efe6]">For privacy-related enquiries, you can contact us at:</p>
              <p className="text-[#8e8a82]">
                Email:{" "}
                <a
                  href="mailto:contact@thedecantbar.com"
                  className="text-[#c6a15b] underline"
                >
                  contact@thedecantbar.com
                </a>
              </p>
            </div>
          </section>

          {/* Section 2: Information We Collect */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">2.</span> Information We Collect
            </h2>
            <p>
              When you visit our website, place an order or contact us, we may collect:
            </p>
            <ul className="mt-3 space-y-2 list-disc list-inside text-xs text-[#8e8a82]">
              <li>Name and contact information.</li>
              <li>Email address and phone number.</li>
              <li>Billing and shipping addresses.</li>
              <li>Order and purchase history.</li>
              <li>Payment transaction references and status.</li>
              <li>Information shared through customer support enquiries.</li>
              <li>Technical information such as IP address, browser type and website usage data, where applicable.</li>
            </ul>
          </section>

          {/* Section 3: How We Use Your Information */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">3.</span> How We Use Your Information
            </h2>
            <p>We use your information for the following purposes:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside text-xs text-[#8e8a82]">
              <li>To process and confirm customer orders.</li>
              <li>To arrange shipping and delivery.</li>
              <li>To communicate order updates.</li>
              <li>To respond to customer enquiries.</li>
              <li>To manage cancellations, returns and refunds.</li>
              <li>To improve our products and website experience.</li>
              <li>To prevent fraudulent transactions.</li>
              <li>To comply with applicable legal requirements.</li>
            </ul>
          </section>

          {/* Section 4: Payment Information */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">4.</span> Payment Information
            </h2>
            <p>
              Payments on our website may be processed through third-party payment service providers, including Razorpay.
            </p>
            <p className="mt-2 text-xs text-[#8e8a82]">
              Your payment information is processed according to the security and privacy practices of the respective payment provider.
            </p>
            <p className="mt-2 text-xs text-[#8e8a82]">
              We do not intentionally store complete card numbers, CVV numbers or UPI PINs on our website servers.
            </p>
          </section>

          {/* Section 5: Cookies */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">5.</span> Cookies
            </h2>
            <p>Our website may use cookies and similar technologies to:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside text-xs text-[#8e8a82]">
              <li>Improve website functionality.</li>
              <li>Remember customer preferences.</li>
              <li>Maintain shopping cart information.</li>
              <li>Understand website traffic and usage.</li>
              <li>Improve the overall browsing experience.</li>
            </ul>
            <p className="mt-3 text-xs text-[#8e8a82]">
              You can manage cookies through your browser settings. Some website functionality may be affected if cookies are disabled.
            </p>
          </section>

          {/* Section 6: Comments and Customer Communication */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">6.</span> Comments and Customer Communication
            </h2>
            <p>
              If visitors submit comments, feedback or enquiries through our website, we may collect the information submitted in those forms.
            </p>
            <p className="mt-2 text-xs text-[#8e8a82]">
              This information is used to respond to enquiries, manage customer communication and improve our services.
            </p>
          </section>

          {/* Section 7: Sharing Your Information */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">7.</span> Sharing Your Information
            </h2>
            <p>
              We may share relevant information with trusted third parties when necessary to operate our business, including:
            </p>
            <ul className="mt-3 space-y-2 list-disc list-inside text-xs text-[#8e8a82]">
              <li>Payment gateway providers.</li>
              <li>Shipping and delivery partners.</li>
              <li>Website hosting providers.</li>
              <li>Technical service providers.</li>
              <li>Legal or regulatory authorities when required by law.</li>
            </ul>
            <div className="mt-4 p-3.5 rounded-xl border border-[#c6a15b]/20 bg-[#171715] text-xs text-[#f4efe6] font-medium">
              We do not sell customers' personal information to third parties.
            </div>
          </section>

          {/* Section 8: Data Retention */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">8.</span> Data Retention
            </h2>
            <p>
              We retain personal information only for as long as necessary to fulfil the purposes described in this Privacy Policy, provide customer support and comply with applicable legal and accounting requirements.
            </p>
          </section>

          {/* Section 9: Your Privacy Rights */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">9.</span> Your Privacy Rights
            </h2>
            <p>Subject to applicable laws, you may request:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside text-xs text-[#8e8a82]">
              <li>Access to your personal information.</li>
              <li>Correction of inaccurate information.</li>
              <li>Deletion of personal information where legally permissible.</li>
              <li>Information about how your data is being used.</li>
            </ul>
            <p className="mt-3 text-xs text-[#8e8a82]">
              For such requests, please contact us using the details below.
            </p>
          </section>

          {/* Section 10: Data Security */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">10.</span> Data Security
            </h2>
            <p>
              We take reasonable technical and organisational measures to protect customer information against unauthorised access, misuse, loss or disclosure.
            </p>
            <p className="mt-2 text-xs text-[#8e8a82]">
              However, no online transmission or electronic storage method can be guaranteed to be completely secure.
            </p>
          </section>

          {/* Section 11: Third-Party Websites */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">11.</span> Third-Party Websites
            </h2>
            <p>
              Our website may contain links to external websites and services.
            </p>
            <p className="mt-2 text-xs text-[#8e8a82]">
              We are not responsible for the privacy practices of third-party websites. We recommend reviewing their privacy policies separately.
            </p>
          </section>

          {/* Section 12: Changes to This Policy */}
          <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#141412]">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">12.</span> Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time.
            </p>
            <p className="mt-2 text-xs text-[#8e8a82]">
              Any changes will be published on this page along with the revised update date.
            </p>
          </section>

          {/* Section 13: Contact Us */}
          <section className="p-6 sm:p-8 rounded-2xl border border-[#c6a15b]/30 bg-[#171715] shadow-xl">
            <h2 className="text-base sm:text-lg font-semibold text-[#f4efe6] mb-3 flex items-center gap-2">
              <span className="text-[#c6a15b]">13.</span> Contact Us
            </h2>
            <p className="text-xs text-[#8e8a82]">
              For questions or concerns regarding this Privacy Policy:
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
            to="/terms"
            className="text-[#c6a15b] hover:text-[#d8c08a] transition underline"
          >
            &rarr; Read our Terms & Conditions
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
