import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { PageLayout } from '../../components/PageLayout';
import { PageHero } from './HelpShared';

const FAQS = [
  {
    category: "Orders & Shipping",
    questions: [
      { q: "How long does shipping take?", a: "Standard shipping typically takes 3-5 business days. Express shipping takes 1-2 business days." },
      { q: "Do you ship internationally?", a: "Yes, we ship to most countries worldwide. International shipping usually takes 7-14 business days." },
      { q: "How can I track my order?", a: "Once your order ships, you will receive a confirmation email with a tracking link. You can also track your order on the Track Order page." }
    ]
  },
  {
    category: "Returns & Refunds",
    questions: [
      { q: "What is your return policy?", a: "We accept returns within 30 days of purchase. Books must be in their original, unread condition." },
      { q: "How do I initiate a return?", a: "Visit our Returns page and enter your order number and email address to print a return shipping label." },
      { q: "When will I receive my refund?", a: "Refunds are processed within 5-7 business days after we receive your returned item." }
    ]
  },
  {
    category: "Account & Payment",
    questions: [
      { q: "What payment methods do you accept?", a: "We accept all major credit cards, PayPal, Apple Pay, and Google Pay." },
      { q: "Is my payment information secure?", a: "Yes, all transactions are encrypted and processed through secure, PCI-compliant payment gateways." },
      { q: "Can I cancel my account?", a: "Yes, you can close your account at any time from your account settings." }
    ]
  }
];

export function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggle = (catIndex: number, qIndex: number) => {
    const key = `${catIndex}-${qIndex}`;
    setOpenIndex(openIndex === key ? null : key);
  };

  return (
    <PageLayout>
      <PageHero
        icon={HelpCircle}
        title="Frequently Asked Questions"
        subtitle="Find quick answers to common questions about our services."
        crumb="FAQ"
      />
      
      <div className="max-w-3xl mx-auto px-4 py-16">
        {FAQS.map((category, catIndex) => (
          <div key={category.category} className="mb-10">
            <h2 className="text-2xl font-black text-emerald-900 dark:text-emerald-400 mb-6 font-serif">
              {category.category}
            </h2>
            <div className="space-y-4">
              {category.questions.map((faq, qIndex) => {
                const isOpen = openIndex === `${catIndex}-${qIndex}`;
                return (
                  <div
                    key={qIndex}
                    className="bg-white dark:bg-dark-card border border-emerald-100 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm transition-all"
                  >
                    <button
                      onClick={() => toggle(catIndex, qIndex)}
                      className="w-full text-left px-6 py-4 flex items-center justify-between font-bold text-emerald-950 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-white/5 transition-colors"
                    >
                      {faq.q}
                      {isOpen ? (
                        <ChevronUp className="text-emerald-500" size={20} />
                      ) : (
                        <ChevronDown className="text-emerald-500" size={20} />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 pt-2 text-emerald-900/70 dark:text-gray-400 text-sm leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
