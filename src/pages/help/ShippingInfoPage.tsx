import { Truck, Globe, Clock, Package } from 'lucide-react';
import { PageLayout } from '../../components/PageLayout';
import { PageHero, InfoCard } from './HelpShared';

export function ShippingInfoPage() {
  return (
    <PageLayout>
      <PageHero
        icon={Truck}
        title="Shipping Information"
        subtitle="Everything you need to know about delivery times and costs."
        crumb="Shipping"
      />
      
      <div className="max-w-4xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-6">
        <InfoCard icon={Clock} title="Processing Time">
          <p className="text-sm text-emerald-900/70 dark:text-gray-400 leading-relaxed">
            All orders are processed within 1-2 business days (excluding weekends and holidays) 
            after receiving your order confirmation email. You will receive another notification 
            when your order has shipped.
          </p>
        </InfoCard>

        <InfoCard icon={Truck} title="Domestic Shipping">
          <div className="space-y-3 mt-2 text-sm text-emerald-900/70 dark:text-gray-400">
            <div className="flex justify-between border-b border-emerald-100 dark:border-white/5 pb-2">
              <span>Standard (3-5 days)</span>
              <span className="font-bold text-emerald-950 dark:text-gray-200">$4.99</span>
            </div>
            <div className="flex justify-between border-b border-emerald-100 dark:border-white/5 pb-2">
              <span>Express (1-2 days)</span>
              <span className="font-bold text-emerald-950 dark:text-gray-200">$12.99</span>
            </div>
            <div className="flex justify-between pb-2">
              <span>Orders over $50</span>
              <span className="font-bold text-green-600 dark:text-green-400">FREE</span>
            </div>
          </div>
        </InfoCard>

        <InfoCard icon={Globe} title="International Shipping">
          <p className="text-sm text-emerald-900/70 dark:text-gray-400 leading-relaxed">
            We offer international shipping to most countries. Shipping charges for your order 
            will be calculated and displayed at checkout. Please note that your order may be 
            subject to import duties and taxes (including VAT), which are incurred once a shipment 
            reaches your destination country.
          </p>
        </InfoCard>

        <InfoCard icon={Package} title="Order Tracking">
          <p className="text-sm text-emerald-900/70 dark:text-gray-400 leading-relaxed">
            When your order has shipped, you will receive an email notification from us which will 
            include a tracking number you can use to check its status. Please allow 48 hours for 
            the tracking information to become available.
          </p>
        </InfoCard>
      </div>
    </PageLayout>
  );
}
