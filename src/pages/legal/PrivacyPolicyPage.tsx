import { Link } from "react-router-dom";
import { LegalLayout, Section } from "./LegalLayout";

export function PrivacyPolicyPage() {
  return (
    <LegalLayout
      badge="Legal"
      title="Privacy Policy"
      subtitle="How we collect, use, and protect your personal data when you use our services."
      lastUpdated="May 15, 2024"
    >
      <Section title="1. Information We Collect">
        <p>
          We collect information you provide directly to us when you create an
          account, make a purchase, or contact customer support. This includes:
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-emerald-900/70 dark:text-gray-400">
          <li>Name and contact information (email address, phone number)</li>
          <li>Billing and shipping addresses</li>
          <li>Payment information (processed securely by our partners)</li>
          <li>Order history and reading preferences</li>
        </ul>
      </Section>

      <Section title="2. How We Use Your Information">
        <p>
          The information we collect is used to fulfill your orders, provide
          customer support, and improve your browsing experience. Specifically,
          we use it to:
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-emerald-900/70 dark:text-gray-400">
          <li>Process transactions and send related information</li>
          <li>Send administrative messages, security alerts, and updates</li>
          <li>Personalize your experience and provide book recommendations</li>
          <li>Monitor and analyze trends to improve our store</li>
        </ul>
      </Section>

      <Section title="3. Data Sharing and Disclosure">
        <p>
          We do not sell your personal data. We may share your information with
          third-party service providers who perform services on our behalf, such
          as payment processing, shipping, and data analysis. These partners are
          obligated to protect your information and only use it for the intended
          purpose.
        </p>
      </Section>

      <Section title="4. Your Rights and Choices">
        <p>
          Depending on your location, you may have the right to access, update,
          or delete your personal information. You can manage your account
          settings by logging in or by contacting our support team at{" "}
          <Link
            to="/contact"
            className="text-emerald-600 hover:text-emerald-800 underline transition-colors"
          >
            privacy@bookstore.com
          </Link>
          .
        </p>
      </Section>

      <Section title="5. Data Security">
        <p>
          We implement appropriate technical and organizational measures to
          protect your personal data against unauthorized access, loss, or
          alteration. While we strive to protect your information, no system is
          completely secure, and we cannot guarantee absolute security.
        </p>
      </Section>

      <Section title="6. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. We will notify
          you of any significant changes by posting the new policy on this page
          and updating the "Last Updated" date at the top.
        </p>
      </Section>
    </LegalLayout>
  );
}
