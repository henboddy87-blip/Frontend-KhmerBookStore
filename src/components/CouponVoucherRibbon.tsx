import { useState } from 'react';
import {  Copy, Check, ChevronRight } from 'lucide-react';
import { useSales } from '../context/SalesContext';
import { Link } from 'react-router-dom';

export function CouponVoucherRibbon() {
  const { activeCoupons, copyCoupon, copiedCoupon } = useSales();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!activeCoupons || activeCoupons.length === 0) return null;

  return (
    <section className="bg-emerald-900 text-white border-y border-emerald-800/40 relative overflow-hidden py-3 px-4 shadow-inner">
      {/* Subtle background glow & sparkles */}
      <div className="absolute -left-10 top-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute right-0 bottom-0 w-60 h-40 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Title & Tagline */}
        <div className="flex items-center gap-2.5 text-center md:text-left flex-wrap justify-center md:justify-start">
          <span className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full border border-emerald-400/30">
            
            Special Deals
          </span>
          <span className="text-xs sm:text-sm font-semibold text-emerald-100/90">
            Get discount by using this promo code in checkout sections:
          </span>
        </div>

        {/* Coupons Carousel / Chips */}
        <div className="flex items-center gap-2.5 flex-wrap justify-center">
          {activeCoupons.slice(0, isExpanded ? activeCoupons.length : 3).map((coupon) => {
            const isCopied = copiedCoupon === coupon.code;
            return (
              <div
                key={coupon.id || coupon.code}
                className="group relative flex items-center bg-black/30 hover:bg-black/50 border border-emerald-400/30 hover:border-emerald-400/70 rounded-xl px-2.5 py-1.5 transition-all duration-200 shadow-sm"
              >
                <div className="flex items-center gap-1.5 mr-2">
              
                  <span className="font-mono font-black text-xs text-emerald-200 tracking-wider">
                    {coupon.code}
                  </span>
                  <span className="text-[11px] text-emerald-300/80 bg-emerald-500/20 px-1.5 py-0.5 rounded font-bold">
                    {coupon.discount_type === 'percentage'
                      ? `${coupon.discount_value}% OFF`
                      : `$${coupon.discount_value} OFF`}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => copyCoupon(coupon.code)}
                  aria-label={`Copy coupon code ${coupon.code}`}
                  className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg transition-all cursor-pointer ${
                    isCopied
                      ? 'bg-emerald-500 text-white shadow-sm scale-105'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-emerald-950 active:scale-95'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}

          {activeCoupons.length > 3 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-emerald-300 hover:text-white font-bold underline underline-offset-4 cursor-pointer ml-1"
            >
              {isExpanded ? 'Show less' : `+${activeCoupons.length - 3} more`}
            </button>
          )}

          <Link
            to="/special-offers"
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-300 hover:text-white hover:underline underline-offset-2 ml-1"
          >
            <span>All Deals</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
