import { Link } from "react-router-dom";
import { LegalLayout, Section } from "./LegalLayout";

export function AccessibilityPage() {
  return (
    <LegalLayout
      badge="Legal"
      title="Accessibility Statement"
      subtitle="Our commitment to making our bookstore accessible to everyone."
      lastUpdated="March 20, 2024"
    >
      <Section title="1. Our Commitment">
        <p>
          We are committed to ensuring digital accessibility for people with
          disabilities. We are continually improving the user experience for
          everyone and applying the relevant accessibility standards to guarantee
          equal access to our products and services.
        </p>
      </Section>

      <Section title="2. Conformance Status">
        <p>
          The Web Content Accessibility Guidelines (WCAG) defines requirements for
          designers and developers to improve accessibility for people with
          disabilities. It defines three levels of conformance: Level A, Level AA,
          and Level AAA. Our website is partially conformant with WCAG 2.1 level AA.
          Partially conformant means that some parts of the content do not fully
          conform to the accessibility standard.
        </p>
      </Section>

      <Section title="3. Accessibility Features">
        <p>
          We have implemented several features to improve accessibility, including:
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-emerald-900/70 dark:text-gray-400">
          <li>Semantic HTML structure to support screen readers</li>
          <li>High contrast color modes and text clarity</li>
          <li>Keyboard navigation support for all interactive elements</li>
          <li>Alternative text descriptions for all meaningful images</li>
          <li>Accessible form labels and error states</li>
        </ul>
      </Section>

      <Section title="4. Known Limitations">
        <p>
          Despite our best efforts to ensure accessibility, there may be some
          limitations. For example, older PDF documents or third-party content
          embedded on our site may not be fully accessible. We are actively
          working to resolve these issues.
        </p>
      </Section>

      <Section title="5. Feedback and Support">
        <p>
          We welcome your feedback on the accessibility of our website. If you
          encounter any accessibility barriers or need assistance using our platform,
          please contact us:
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-emerald-900/70 dark:text-gray-400">
          <li>Email: <a href="mailto:accessibility@bookstore.com" className="text-emerald-600 hover:text-emerald-800 underline transition-colors">accessibility@bookstore.com</a></li>
          <li>Phone: +1 (555) 123-4567</li>
          <li>Or via our <Link to="/contact" className="text-emerald-600 hover:text-emerald-800 underline transition-colors">Contact Us</Link> page.</li>
        </ul>
        <p className="mt-2">
          We try to respond to feedback within 2 business days.
        </p>
      </Section>
    </LegalLayout>
  );
}
