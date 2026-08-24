import { RotateCcw, ShieldCheck, Mail, CreditCard } from 'lucide-react';
import { PageLayout } from '../../components/PageLayout';
import { PageHero, InfoCard } from './HelpShared';
import { Link } from 'react-router-dom';

export function ReturnsPage() {
  return (
    <PageLayout>
      <PageHero
        icon={RotateCcw}
        title="Returns & Refunds"
        subtitle="Our hassle-free 30-day return policy."
        crumb="Returns"
      />
      
      <div className="max-w-4xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-6">
        <InfoCard icon={ShieldCheck} title="30-Day Guarantee">
          <p className="text-sm text-emerald-900/70 dark:text-gray-400 leading-relaxed">
            We accept returns up to 30 days after delivery, if the item is unused and in its 
            original condition, and we will refund the full order amount minus the shipping costs 
            for the return.
          </p>
        </InfoCard>

        <InfoCard icon={Mail} title="How to Return">
          <div className="text-sm text-emerald-900/70 dark:text-gray-400 leading-relaxed">
            <ol className="list-decimal pl-4 space-y-2">
              <li>Contact us at <Link to="/contact" className="text-emerald-600 hover:underline">returns@bookstore.com</Link></li>
              <li>Provide your order number and reason for return</li>
              <li>Receive a prepaid return shipping label via email</li>
              <li>Pack the book securely and drop it off at any authorized location</li>
            </ol>
          </div>
        </InfoCard>

        <InfoCard icon={RotateCcw} title="Condition Requirements">
          <ul className="list-disc pl-4 space-y-2 text-sm text-emerald-900/70 dark:text-gray-400">
            <li>Books must be unread and in original condition</li>
            <li>No bent pages, spine creases, or markings</li>
            <li>Shrink-wrapped items must remain unopened</li>
            <li>Gift cards and digital items are non-refundable</li>
          </ul>
        </InfoCard>

        <InfoCard icon={CreditCard} title="Refund Processing">
          <p className="text-sm text-emerald-900/70 dark:text-gray-400 leading-relaxed">
            Once your return is received and inspected, we will send you an email to notify you 
            that we have received your returned item. If approved, your refund will be processed, 
            and a credit will automatically be applied to your credit card or original method of 
            payment, within 5-7 business days.
          </p>
        </InfoCard>
      </div>
    </PageLayout>
  );
}
