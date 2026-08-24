import { useState } from 'react';
import { Gift, CreditCard, Mail } from 'lucide-react';
import { PageLayout } from '../../components/PageLayout';
import { PageHero } from './HelpShared';

const AMOUNTS = [25, 50, 75, 100, 150, 200];

export function GiftCardsPage() {
  const [selectedAmount, setSelectedAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  const handleAmountClick = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      setCustomAmount(val);
      if (val) setSelectedAmount(parseInt(val, 10));
    }
  };

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAmount || !recipientEmail) return;
    setStatus('processing');
    setTimeout(() => setStatus('success'), 2000);
  };

  return (
    <PageLayout>
      <PageHero
        icon={Gift}
        title="Digital Gift Cards"
        subtitle="Give the gift of reading. Delivered instantly via email."
        crumb="Gift Cards"
      />
      
      <div className="max-w-5xl mx-auto px-4 py-16 grid lg:grid-cols-2 gap-12">
        {/* Left Column: Preview */}
        <div>
          <div className="sticky top-24">
            <h2 className="text-2xl font-black text-emerald-950 dark:text-white mb-6 font-serif">
              Gift Card Preview
            </h2>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[1.58] bg-emerald-600 flex flex-col p-8 text-white transition-all transform hover:scale-[1.02]">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-serif font-black text-2xl tracking-wide">LUMINA</h3>
                  <p className="text-emerald-200/80 text-xs tracking-widest uppercase mt-1">Bookstore</p>
                </div>
                <Gift size={32} className="text-emerald-300 opacity-80" />
              </div>
              
              <div className="mt-auto">
                <p className="text-5xl font-black mb-2">${selectedAmount || '0'}</p>
                <div className="flex justify-between items-end border-t border-emerald-500/30 pt-4 mt-4">
                  <div>
                    <p className="text-xs text-emerald-200/70 uppercase tracking-wider mb-1">To</p>
                    <p className="font-bold">{recipientName || 'Recipient Name'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-emerald-200/70 uppercase tracking-wider mb-1">From</p>
                    <p className="font-bold">You</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                  <Mail className="text-emerald-700 dark:text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-950 dark:text-gray-200">Instant Delivery</h4>
                  <p className="text-sm text-emerald-900/70 dark:text-gray-400 mt-1">Sent to their email instantly, or schedule it for a special day.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                  <CreditCard className="text-emerald-700 dark:text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-950 dark:text-gray-200">Never Expires</h4>
                  <p className="text-sm text-emerald-900/70 dark:text-gray-400 mt-1">No rush to use them. Our gift cards never expire and have no hidden fees.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="bg-white dark:bg-dark-card border border-emerald-100 dark:border-white/5 rounded-2xl p-8 shadow-xl">
          {status === 'success' ? (
             <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
               <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-2">
                 <Gift size={40} className="text-green-600 dark:text-green-400" />
               </div>
               <h3 className="text-3xl font-black text-emerald-950 dark:text-white font-serif">Gift Sent!</h3>
               <p className="text-emerald-900/70 dark:text-gray-400">
                 Your ${selectedAmount} gift card has been successfully sent to {recipientEmail}.
               </p>
               <button 
                 onClick={() => {
                   setStatus('idle');
                   setRecipientName('');
                   setRecipientEmail('');
                   setMessage('');
                 }}
                 className="mt-8 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors"
               >
                 Buy Another
               </button>
             </div>
          ) : (
            <form onSubmit={handlePurchase} className="space-y-8">
              {/* Amount Selection */}
              <div>
                <h3 className="text-lg font-bold text-emerald-950 dark:text-white mb-4">1. Select Amount</h3>
                <div className="grid grid-cols-3 gap-3">
                  {AMOUNTS.map(amount => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => handleAmountClick(amount)}
                      className={`py-3 rounded-lg font-bold transition-all ${
                        selectedAmount === amount && !customAmount
                          ? 'bg-emerald-600 text-white shadow-md border-emerald-600'
                          : 'bg-emerald-50 dark:bg-white/5 text-emerald-900 dark:text-gray-300 border-transparent hover:bg-emerald-100 dark:hover:bg-white/10'
                      } border`}
                    >
                      ${amount}
                    </button>
                  ))}
                  <div className="col-span-3 relative mt-2">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-900/50 dark:text-gray-500 font-bold">$</span>
                    <input
                      type="text"
                      placeholder="Custom Amount"
                      value={customAmount}
                      onChange={handleCustomAmountChange}
                      className={`w-full pl-8 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow dark:bg-dark-bg dark:text-white ${
                        customAmount ? 'border-emerald-500 bg-emerald-50/30' : 'border-emerald-200 dark:border-white/10 bg-white'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Recipient Details */}
              <div>
                <h3 className="text-lg font-bold text-emerald-950 dark:text-white mb-4">2. Recipient Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-emerald-950 dark:text-gray-300 mb-1">Recipient Name</label>
                    <input
                      type="text"
                      required
                      value={recipientName}
                      onChange={e => setRecipientName(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-emerald-200 dark:border-white/10 bg-white dark:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow dark:text-white"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-emerald-950 dark:text-gray-300 mb-1">Recipient Email</label>
                    <input
                      type="email"
                      required
                      value={recipientEmail}
                      onChange={e => setRecipientEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-emerald-200 dark:border-white/10 bg-white dark:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow dark:text-white"
                      placeholder="jane@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-emerald-950 dark:text-gray-300 mb-1">Personal Message (Optional)</label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-emerald-200 dark:border-white/10 bg-white dark:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow dark:text-white resize-none"
                      placeholder="Happy reading!"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <div className="pt-4 border-t border-emerald-100 dark:border-white/5">
                <div className="flex justify-between items-end mb-6">
                  <span className="text-lg font-bold text-emerald-950 dark:text-gray-300">Total</span>
                  <span className="text-3xl font-black text-emerald-900 dark:text-emerald-400 font-serif">${selectedAmount || '0'}</span>
                </div>
                <button
                  type="submit"
                  disabled={status === 'processing' || !selectedAmount}
                  className="w-full py-4 bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-xl"
                >
                  {status === 'processing' ? 'Processing...' : 'Proceed to Payment'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
