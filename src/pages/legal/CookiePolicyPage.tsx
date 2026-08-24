import { Link } from "react-router-dom";
import { LegalLayout, Section } from "./LegalLayout";

export function CookiePolicyPage() {
  return (
    <LegalLayout
      badge="Legal"
      title="Cookie Policy"
      subtitle="Information about how we use cookies and similar technologies."
      lastUpdated="April 10, 2024"
    >
      <Section title="1. What Are Cookies?">
        <p>
          Cookies are small text files stored on your device when you visit a
          website. They are widely used to make websites work more efficiently and
          provide information to the owners of the site. Cookies help us remember
          your preferences and understand how you interact with our platform.
        </p>
      </Section>

      <Section title="2. How We Use Cookies">
        <p>
          We use cookies for several reasons, including:
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-emerald-900/70 dark:text-gray-400">
          <li><strong>Essential Cookies:</strong> Required for the website to function properly (e.g., shopping cart, login sessions).</li>
          <li><strong>Performance Cookies:</strong> Allow us to analyze how visitors use our site so we can measure and improve performance.</li>
          <li><strong>Functional Cookies:</strong> Enable enhanced functionality and personalization, such as remembering your language preference.</li>
          <li><strong>Targeting Cookies:</strong> Used to deliver relevant advertisements and track ad campaign performance.</li>
        </ul>
      </Section>

      <Section title="3. Third-Party Cookies">
        <p>
          In some cases, we use cookies provided by trusted third parties, such
          as analytics providers (e.g., Google Analytics) and social media platforms.
          These third parties may use cookies to collect data about your browsing
          habits across different websites.
        </p>
      </Section>

      <Section title="4. Managing Your Cookie Preferences">
        <p>
          You can control and manage cookies in various ways. Most browsers allow
          you to view, delete, or block cookies from specific websites. Please note
          that if you disable essential cookies, certain parts of our website may
          not function correctly.
        </p>
        <p className="mt-2">
          For more information on how to manage cookies, visit the help section
          of your browser or visit{" "}
          <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-800 underline transition-colors">
            aboutcookies.org
          </a>.
        </p>
      </Section>

      <Section title="5. Contact Us">
        <p>
          If you have any questions or concerns about our use of cookies, please
          contact us at{" "}
          <Link
            to="/contact"
            className="text-emerald-600 hover:text-emerald-800 underline transition-colors"
          >
            privacy@bookstore.com
          </Link>
          .
        </p>
      </Section>
    </LegalLayout>
  );
}
