import { useState } from "react";
import { Clock, ShieldCheck, Star } from "lucide-react";
import { useSales } from "../context/SalesContext";
import { useStore } from "../context/StoreContext";
import { Book } from "../types";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { OptimizedImage } from "./OptimizedImage";

interface FlashSaleSectionProps {
  onBookClick?: (book: Book) => void;
}

export function FlashSaleSection({ onBookClick }: FlashSaleSectionProps) {
  const { activeFlashSales, getTimeRemaining } = useSales();
  const { addToCart, books } = useStore();
  const [sectionRef, isVisible] = useScrollReveal({ threshold: 0.1 });
  const [addedIds, setAddedIds] = useState<Record<number, boolean>>({});

  if (!activeFlashSales || activeFlashSales.length === 0) {
    return null;
  }

  const handleAddToCart = (e: React.MouseEvent, book: Book, flashPrice: number) => {
    e.stopPropagation();
    addToCart({ ...book, price: flashPrice }, "Paperback");
    setAddedIds((prev) => ({ ...prev, [book.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [book.id]: false }));
    }, 2000);
  };

  return (
    <section
      ref={sectionRef}
      className={`relative py-16 bg-[#111111] border-y border-white/10 overflow-hidden transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {/* Cinematic Dark Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none mix-blend-overlay" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-rose-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 relative z-10">
        {/* Flash Sale Header Banner (Restored original green card) */}
        <div className="flex flex-col xl:flex-row items-center justify-between gap-8 mb-12 bg-emerald-900 rounded-[2rem] p-8 sm:p-12 text-white border border-emerald-500/30 shadow-2xl relative overflow-hidden group">
          <div className="absolute -right-20 -top-20 w-72 h-72 bg-emerald-500/25 rounded-full blur-[80px] pointer-events-none group-hover:bg-emerald-500/35 transition-all duration-700" />
          <div className="absolute -left-20 -bottom-20 w-72 h-72 bg-teal-500/20 rounded-full blur-[80px] pointer-events-none transition-all duration-700" />

          <div className="relative z-10 text-center xl:text-left flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/20 border border-red-400/40 text-red-300 text-xs font-black uppercase tracking-widest mb-4 shadow-[0_0_15px_rgba(225,29,72,0.2)]">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" /> Limited Time Deal
            </div>
            <h2
              className="text-4xl sm:text-6xl font-black tracking-tight text-white drop-shadow-sm"
              style={{ fontFamily: "Merriweather, serif" }}
            >
              Flash Sales & Lightning Deals
            </h2>
            <p className="text-emerald-100/90 text-base sm:text-lg mt-4 max-w-2xl mx-auto xl:mx-0 font-medium leading-relaxed">
              Grab bestselling books at deeply discounted prices. Don't blink—these exclusive offers vanish when the timer runs out!
            </p>
          </div>

          {/* Primary Global Countdown Timer */}
          {activeFlashSales.length > 0 && (
            <div className="relative z-10 flex flex-col items-center gap-4 bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl shrink-0">
              <div className="flex items-center gap-2 text-rose-400 text-sm font-black uppercase tracking-widest">
                <Clock className="w-5 h-5 animate-pulse" />
                <span>Offer Ends In</span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                {(() => {
                  const firstSale = activeFlashSales[0];
                  const time = getTimeRemaining(firstSale.end_time, firstSale.start_time);
                  return (
                    <>
                      {time.days > 0 && (
                        <div className="flex flex-col items-center">
                          <span className="bg-gradient-to-b from-white/20 to-white/5 border border-white/10 px-4 py-3 rounded-2xl text-2xl sm:text-4xl font-black text-white shadow-inner">
                            {time.days.toString().padStart(2, "0")}
                          </span>
                          <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-2">Days</span>
                        </div>
                      )}
                      <div className="flex flex-col items-center">
                        <span className="bg-gradient-to-b from-white/20 to-white/5 border border-white/10 px-4 py-3 rounded-2xl text-2xl sm:text-4xl font-black text-white shadow-inner">
                          {time.hours.toString().padStart(2, "0")}
                        </span>
                        <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-2">Hours</span>
                      </div>
                      <span className="text-white/30 font-black text-3xl mb-5">:</span>
                      <div className="flex flex-col items-center">
                        <span className="bg-gradient-to-b from-white/20 to-white/5 border border-white/10 px-4 py-3 rounded-2xl text-2xl sm:text-4xl font-black text-white shadow-inner">
                          {time.minutes.toString().padStart(2, "0")}
                        </span>
                        <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-2">Min</span>
                      </div>
                      <span className="text-white/30 font-black text-3xl mb-5">:</span>
                      <div className="flex flex-col items-center">
                        <span className="bg-gradient-to-b from-rose-500 to-red-600 border border-rose-400/50 px-4 py-3 rounded-2xl text-2xl sm:text-4xl font-black text-white shadow-[0_0_20px_rgba(225,29,72,0.4)]">
                          {time.seconds.toString().padStart(2, "0")}
                        </span>
                        <span className="text-[10px] text-rose-300 uppercase font-black tracking-widest mt-2">Sec</span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </div>

        {/* Flash Sale Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {activeFlashSales.map((sale) => {
            const book = sale.book || books.find((b) => b.id === sale.book_id);
            const time = getTimeRemaining(sale.end_time, sale.start_time);
            const origPrice = Number(sale.original_price || book?.originalPrice || book?.price || 0);
            const flashPrice = Number(sale.flash_price || book?.price || 0);
            const discountPct = origPrice > flashPrice ? Math.round(((origPrice - flashPrice) / origPrice) * 100) : 30;
            const savings = (origPrice - flashPrice > 0 ? origPrice - flashPrice : 0).toFixed(2);
            const stockLimit = Number(sale.stock_limit || 50);
            const soldCount = Number(sale.sold_count || 0);
            const stockPct = Math.min(100, Math.round((soldCount / (stockLimit > 0 ? stockLimit : 50)) * 100));
            const remaining = Math.max(0, stockLimit - soldCount);
            const isAdded = book ? addedIds[book.id] : false;

            return (
              <div
                key={sale.id}
                onClick={() => book && onBookClick && onBookClick(book)}
                className="group relative bg-white dark:bg-dark-card border border-gray-200 dark:border-white/10 hover:border-emerald-500 dark:hover:border-emerald-500/80 rounded-3xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden"
              >
                {/* Sale Badge */}
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                  <span className="badge-bounce px-3 py-1.5 bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs font-black uppercase tracking-wider rounded-full shadow-lg shadow-red-500/30 border border-white/20 backdrop-blur-md flex items-center gap-1">
                    -{discountPct}% OFF
                  </span>
                  {remaining <= 10 && remaining > 0 && (
                    <span className="bg-orange-500/90 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg border border-orange-400/50 backdrop-blur-md animate-pulse">
                      Only {remaining} left!
                    </span>
                  )}
                </div>

                {/* Top Section: Cover & Quick Details */}
                <div>
                  <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-emerald-50 dark:bg-emerald-950/20 mb-4 flex items-center justify-center p-3">
                    {book?.image ? (
                      <OptimizedImage
                        src={book.image}
                        alt={book.title || sale.title}
                        className="w-full h-full object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-500"
                        wrapperClassName="w-full h-full"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <span className="text-xs text-gray-500 font-bold">{sale.title}</span>
                      </div>
                    )}
                  </div>

                  {/* Title & Author */}
                  <h3
                    className="font-bold text-gray-900 dark:text-white text-base sm:text-lg line-clamp-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors"
                    title={book?.title || sale.title}
                  >
                    {book?.title || sale.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    {book?.author || "Bestseller Edition"}
                  </p>

                  {/* Rating snippet */}
                  {book?.rating ? (
                    <div className="flex items-center gap-1.5 mb-3">
                      <div className="flex items-center text-emerald-400">
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </div>
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                        {book.rating.toFixed(1)}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        ({book.reviews || 42})
                      </span>
                    </div>
                  ) : null}

                  {/* Pricing Box */}
                  <div className="bg-emerald-500/10 dark:bg-emerald-500/5 rounded-2xl p-3.5 mb-4 border border-emerald-500/20">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-red-600 dark:text-red-400">
                        ${sale.flash_price.toFixed(2)}
                      </span>
                      <span className="text-sm font-semibold text-gray-400 line-through">
                        ${sale.original_price.toFixed(2)}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      Save ${savings} during this flash period!
                    </span>
                  </div>

                  {/* Stock Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-[11px] font-bold text-gray-600 dark:text-gray-300 mb-1.5">
                      <span className="flex items-center gap-1">
                        <span>Sold: {sale.sold_count || 0} / {sale.stock_limit || 50}</span>
                      </span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">{stockPct}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden p-0.5 border border-emerald-500/20">
                      <div
                        className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                        style={{ width: `${stockPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Action & Period Indicator */}
                <div>
                  <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 mb-3 px-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-600" />
                      <span>{time.formatted}</span>
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      In Stock
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => book && handleAddToCart(e, book, sale.flash_price)}
                    className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer ${
                      isAdded
                        ? "bg-emerald-600 text-white"
                        : "bg-emerald-600 hover:from-red-500 hover:to-emerald-600 text-white shadow-emerald-900/20 hover:shadow-lg"
                    }`}
                  >
                    {isAdded ? "Added to Cart!" : `Claim Deal ($${sale.flash_price.toFixed(2)})`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
