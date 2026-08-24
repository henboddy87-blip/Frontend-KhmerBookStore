import { Link } from "react-router-dom";
import { LegalLayout, Section } from "./LegalLayout";

export function TermsOfServicePage() {
  return (
    <LegalLayout
      badge="Legal"
      title="Terms of Service"
      subtitle="The rules and guidelines that govern your use of our bookstore platform."
      lastUpdated="June 01, 2024"
    >
      <Section title="1. Acceptance of Terms">
        <p>
          By accessing or using our website, purchasing our products, or engaging
          with our services, you agree to be bound by these Terms of Service. If
          you do not agree with any part of these terms, you must not use our
          services.
        </p>
      </Section>

      <Section title="2. Account Registration">
        <p>
          You may need to create an account to use certain features. You agree
          to provide accurate, current, and complete information during the
          registration process and to update such information to keep it accurate.
          You are responsible for safeguarding your password and for all activities
          that occur under your account.
        </p>
      </Section>

      <Section title="3. Purchases and Pricing">
        <p>
          All prices are subject to change without notice. We reserve the right
          to refuse or cancel any order placed for a product listed at an
          incorrect price. If your order is canceled after your credit card has
          been charged, we will issue a full refund to your original payment method.
        </p>
      </Section>

      <Section title="4. Intellectual Property">
        <p>
          The content on this website, including text, graphics, logos, and
          images, is the property of the bookstore or its content suppliers and
          is protected by copyright and intellectual property laws. You may not
          reproduce, distribute, or create derivative works without express
          written permission.
        </p>
      </Section>

      <Section title="5. User Conduct">
        <p>
          You agree not to use the website for any unlawful purpose or in any way
          that could damage, disable, overburden, or impair our servers or
          networks. You must not attempt to gain unauthorized access to any
          portion of the website or any other systems connected to it.
        </p>
      </Section>

      <Section title="6. Limitation of Liability">
        <p>
          In no event shall the bookstore, its directors, employees, or affiliates
          be liable for any indirect, incidental, special, consequential, or
          punitive damages arising out of or related to your use of the service.
          Our total liability for any claim arising out of these terms shall not
          exceed the amount you paid for the product or service in question.
        </p>
      </Section>

      <Section title="7. Contact Information">
        <p>
          If you have any questions about these Terms of Service, please contact
          us at{" "}
          <Link
            to="/contact"
            className="text-emerald-600 hover:text-emerald-800 underline transition-colors"
          >
            legal@bookstore.com
          </Link>
          .
        </p>
      </Section>
    </LegalLayout>
  );
}
