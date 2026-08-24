import { useState, useMemo, useEffect } from 'react';
import { Filter, ArrowRight, ChevronLeft, ChevronRight, Tag, Calendar, Gift } from 'lucide-react';
import { useSales } from '../../context/SalesContext';
import { useStore } from '../../context/StoreContext';
import { BookGrid } from '../../components/BookGrid';
import { BookDetail } from '../../components/BookDetail';
import { PageLayout } from '../../components/PageLayout';
import { Book } from '../../types';

export function SpecialOffersPage() {
  const { activeFlashSales, activeCampaigns, activeCoupons, copyCoupon, copiedCoupon } = useSales();
  const { books, addToCart } = useStore();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'flash' | 'campaigns' | 'coupons'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 15; // 3 rows of 5 on desktop

  // Format date range nicely
  const formatDateRange = (startDateStr?: string, endDateStr?: string) => {
    if (!startDateStr && !endDateStr) return "Limited Time Campaign";
    const start = startDateStr ? new Date(startDateStr) : null;
    const end = endDateStr ? new Date(endDateStr) : null;

    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
    if (start && end) {
      return `Valid: ${start.toLocaleDateString("en-US", options)} – ${end.toLocaleDateString("en-US", options)}`;
    }
    if (end) {
      return `Ends: ${end.toLocaleDateString("en-US", options)}`;
    }
    return "Active Campaign";
  };

  // Filter books on sale or special offer
  const discountedBooks = useMemo(() => {
    return books.filter((b) => {
      const isOffer = b.isSpecialOffer || (b as any).is_special_offer || b.isSale || (b as any).is_sale;
      const isFlash = activeFlashSales.some((fs) => fs.book_id === b.id);
      const isCampaign = activeCampaigns.some((c) => c.category === 'all' || c.category === b.category);
      const matchesCategory = categoryFilter === 'all' || b.category === categoryFilter;

      return (isOffer || isFlash || isCampaign) && matchesCategory;
    });
  }, [books, activeFlashSales, activeCampaigns, categoryFilter]);

  // Reset page when category or tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, activeTab]);

  const totalPages = Math.ceil(discountedBooks.length / ITEMS_PER_PAGE) || 1;
  const validCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);

  const paginatedBooks = useMemo(() => {
    const start = (validCurrentPage - 1) * ITEMS_PER_PAGE;
    return discountedBooks.slice(start, start + ITEMS_PER_PAGE);
  }, [discountedBooks, validCurrentPage, ITEMS_PER_PAGE]);

  const categories = useMemo(() => {
    const set = new Set(books.map((b) => b.category));
    return ['all', ...Array.from(set)];
  }, [books]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const el = document.getElementById('discounted-catalog-top');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50/50 dark:bg-dark-bg py-10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          {/* Header Banner */}
          <div className="relative rounded-3xl bg-emerald-900 text-white p-8 sm:p-12 mb-10 overflow-hidden shadow-2xl border border-emerald-500/20">
            <div className="absolute -right-16 -top-16 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl" />
            <div className="absolute left-1/4 -bottom-20 w-96 h-96 bg-red-600/15 rounded-full blur-3xl" />

            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black uppercase tracking-wider mb-4">
                <span>Deals & Promotions Hub</span>
              </div>
              <h1
                className="text-3xl sm:text-5xl font-black tracking-tight mb-4"
                style={{ fontFamily: 'Merriweather, serif' }}
              >
                Special Offers & Flash Discounts
              </h1>
              <p className="text-emerald-100/80 text-base sm:text-lg leading-relaxed">
                Discover limited-time flash deals, reader discount campaigns, and coupon codes updated in real-time.
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-gray-200 dark:border-white/10 pb-4 mb-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-emerald-900 text-white shadow-md'
                  : 'bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-white/5 border border-gray-200 dark:border-white/10'
              }`}
            >
              All Deals ({discountedBooks.length})
            </button>
            {activeFlashSales.length > 0 && (
              <button
                onClick={() => setActiveTab('flash')}
                className={`px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'flash'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-white/5 border border-gray-200 dark:border-white/10'
                }`}
              >
                <span>Flash Sales ({activeFlashSales.length})</span>
              </button>
            )}
            {activeCampaigns.length > 0 && (
              <button
                onClick={() => setActiveTab('campaigns')}
                className={`px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'campaigns'
                    ? 'bg-emerald-900 text-white shadow-md'
                    : 'bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-white/5 border border-gray-200 dark:border-white/10'
                }`}
              >
                <span>Campaigns ({activeCampaigns.length})</span>
              </button>
            )}
            {activeCoupons.length > 0 && (
              <button
                onClick={() => setActiveTab('coupons')}
                className={`px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'coupons'
                    ? 'bg-emerald-900 text-white shadow-md'
                    : 'bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-white/5 border border-gray-200 dark:border-white/10'
                }`}
              >
                <span>Coupons ({activeCoupons.length})</span>
              </button>
            )}
          </div>

          {/* Tab Content 1: Active Flash Sales Grid */}
          {(activeTab === 'all' || activeTab === 'flash') && activeFlashSales.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white" style={{ fontFamily: 'Merriweather, serif' }}>
                    Active Flash Sales
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Hurry! These lightning deals end soon.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {activeFlashSales.map((sale) => {
                  const book = sale.book;
                  return (
                    <div
                      key={sale.id}
                      onClick={() => book && setSelectedBook(book)}
                      className="bg-white dark:bg-dark-card rounded-2xl border border-red-500/20 p-4 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-3 flex items-center justify-center">
                        {book?.image && (
                          <img
                            src={book.image}
                            alt={book.title || sale.title}
                            className="w-full h-full object-contain p-2 hover:scale-105 transition-transform"
                          />
                        )}
                        <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                          Flash Deal
                        </span>
                      </div>

                      <div className="mb-3">
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1">
                          {book?.title || sale.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                          {book?.author || "Featured Author"}
                        </p>
                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="text-lg font-black text-red-600">
                            ${Number(sale.flash_price).toFixed(2)}
                          </span>
                          <span className="text-xs text-gray-400 line-through">
                            ${Number(sale.original_price).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (book) addToCart({ ...book, price: sale.flash_price }, "Paperback");
                        }}
                        className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
                      >
                        <span>Grab Deal (${Number(sale.flash_price).toFixed(2)})</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab Content 2: Active Discount Campaigns (Matches Homepage DynamicCampaignsSection Style) */}
          {(activeTab === 'all' || activeTab === 'campaigns') && activeCampaigns.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white" style={{ fontFamily: 'Merriweather, serif' }}>
                    Featured Discount Campaigns
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Seasonal discount campaigns applied across curated categories.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeCampaigns.map((camp, idx) => {
                  const sampleBook =
                    camp.category !== "all"
                      ? books.find((b) => b.category === camp.category || b.genre === camp.category)
                      : books[idx % books.length];

                  return (
                    <div
                      key={camp.id || idx}
                      className={`relative bg-slate-900 bg-gradient-to-br ${
                        camp.bg_gradient || "from-emerald-900 to-teal-900"
                      } rounded-3xl overflow-hidden min-h-[240px] flex items-center p-6 sm:p-10 transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-2xl group border border-white/10`}
                    >
                      {/* Background Decor Shapes */}
                      <div className="absolute -left-12 -bottom-12 w-52 h-52 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors" />
                      <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors" />

                      <div className="relative z-10 flex w-full items-center justify-between gap-6">
                        {/* Text side */}
                        <div className="flex-1 text-white">
                          {/* Campaign Badges */}
                          <div className="flex items-center gap-2 flex-wrap mb-3">
                            <span className="inline-flex items-center gap-1 bg-white/20 text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-md border border-white/20 shadow-sm">
                              <Tag className="w-3.5 h-3.5 text-emerald-300" />
                              {camp.discount_percent}% Discount
                            </span>

                            <span className="inline-flex items-center gap-1 bg-black/30 text-emerald-200 text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                              <Calendar className="w-3 h-3 text-emerald-300" />
                              {formatDateRange(camp.start_date, camp.end_date)}
                            </span>
                          </div>

                          {/* Campaign Title */}
                          <h3
                            className="text-2xl sm:text-3xl font-black mb-2 leading-tight tracking-tight text-white"
                            style={{ fontFamily: "Merriweather, serif" }}
                          >
                            {camp.title}
                          </h3>

                          {/* Campaign Description */}
                          <p className="text-white/80 text-xs sm:text-sm leading-relaxed mb-6 max-w-md line-clamp-2">
                            {camp.description ||
                              `Enjoy exclusive ${camp.discount_percent}% off on all ${camp.category.replace(/-/g, ' ')} books.`}
                          </p>

                          {/* CTA Button */}
                          <button
                            type="button"
                            onClick={() => setCategoryFilter(camp.category)}
                            className="inline-flex items-center gap-2 bg-white text-zinc-900 hover:bg-emerald-50 px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm hover:shadow-xl transition-all active:scale-95 group-hover:gap-3 cursor-pointer"
                          >
                            <span>Explore Deals</span>
                            <ArrowRight className="w-4 h-4 text-emerald-700 transition-transform group-hover:translate-x-0.5" />
                          </button>
                        </div>

                        {/* Visual Side (Book Preview with floating badge) */}
                        <div className="hidden sm:flex relative items-center justify-center flex-shrink-0 w-32 sm:w-40">
                          <div className="relative z-10 w-28 h-36 sm:w-32 sm:h-44 transform -rotate-6 group-hover:rotate-0 group-hover:-translate-y-2 transition-transform duration-500 rounded-xl overflow-hidden shadow-2xl border-4 border-white/25 bg-white/10 flex items-center justify-center">
                            {sampleBook?.image ? (
                              <img
                                src={sampleBook.image}
                                alt={sampleBook.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Gift className="w-12 h-12 text-white/60" />
                            )}
                          </div>

                          {/* Floating Percent Badge */}
                          <div className="absolute -top-3 -right-3 bg-emerald-600 text-white w-14 h-14 rounded-full flex flex-col items-center justify-center font-black shadow-xl transform rotate-12 z-20 border-2 border-white/30">
                            <span className="text-[9px] uppercase leading-none">Sale</span>
                            <span className="text-sm font-extrabold leading-none mt-0.5">
                              {camp.discount_percent}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab Content 3: Active Coupons Grid */}
          {(activeTab === 'all' || activeTab === 'coupons') && activeCoupons.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6" style={{ fontFamily: 'Merriweather, serif' }}>
                Active Promo Coupons
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {activeCoupons.map((coupon) => {
                  const isCopied = copiedCoupon === coupon.code;
                  return (
                    <div
                      key={coupon.id}
                      className="bg-white dark:bg-dark-card border-2 border-dashed border-emerald-500/40 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono font-black text-base text-emerald-800 dark:text-emerald-300 tracking-wider">
                            {coupon.code}
                          </span>
                          <span className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-black px-2 py-0.5 rounded-md">
                            {coupon.discount_type === 'percentage'
                              ? `${coupon.discount_value}% OFF`
                              : `$${coupon.discount_value} OFF`}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                          {coupon.description || `Save on orders over $${coupon.min_spend || 0}`}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => copyCoupon(coupon.code)}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          isCopied
                            ? 'bg-emerald-600 text-white'
                            : 'bg-emerald-900 hover:bg-emerald-800 text-white shadow-sm'
                        }`}
                      >
                        <span>{isCopied ? 'Code Copied!' : 'Copy Coupon Code'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Discounted Books Catalog */}
          <div id="discounted-catalog-top" className="pt-6 border-t border-gray-200 dark:border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white" style={{ fontFamily: 'Merriweather, serif' }}>
                  All Discounted Books ({discountedBooks.length})
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Showing {(validCurrentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(validCurrentPage * ITEMS_PER_PAGE, discountedBooks.length)} of {discountedBooks.length} books (3 rows per page)
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Category:
                </span>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all capitalize cursor-pointer ${
                      categoryFilter === cat
                        ? 'bg-emerald-900 text-white'
                        : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20'
                    }`}
                  >
                    {cat.replace(/-/g, ' ')}
                  </button>
                ))}
              </div>
            </div>

            {discountedBooks.length > 0 ? (
              <>
                <BookGrid books={paginatedBooks} onBookClick={setSelectedBook} />

                {/* Pagination Controls Matching All Books */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-6 border-t border-gray-200 dark:border-white/10">
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      Page <span className="font-bold text-gray-900 dark:text-white">{validCurrentPage}</span> of{' '}
                      <span className="font-bold text-gray-900 dark:text-white">{totalPages}</span>
                    </p>

                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <button
                        type="button"
                        onClick={() => handlePageChange(validCurrentPage - 1)}
                        disabled={validCurrentPage === 1}
                        className="px-3.5 py-2 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer flex items-center gap-1 text-xs font-bold"
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Previous</span>
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((p) => {
                          if (totalPages <= 7) return true;
                          if (p === 1 || p === totalPages) return true;
                          return Math.abs(p - validCurrentPage) <= 1;
                        })
                        .reduce<(number | string)[]>((acc, p, idx, arr) => {
                          if (idx > 0 && typeof arr[idx - 1] === 'number' && (p as number) - (arr[idx - 1] as number) > 1) {
                            acc.push('...');
                          }
                          acc.push(p);
                          return acc;
                        }, [])
                        .map((p, idx) =>
                          p === '...' ? (
                            <span key={`dots-${idx}`} className="px-2 py-1 text-gray-400 text-xs font-bold select-none">
                              ...
                            </span>
                          ) : (
                            <button
                              key={`page-${p}`}
                              type="button"
                              onClick={() => handlePageChange(Number(p))}
                              className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                validCurrentPage === p
                                  ? 'bg-emerald-900 dark:bg-emerald-700 text-white shadow-md shadow-emerald-900/20 scale-105'
                                  : 'border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-white/5'
                              }`}
                            >
                              {p}
                            </button>
                          )
                        )}

                      <button
                        type="button"
                        onClick={() => handlePageChange(validCurrentPage + 1)}
                        disabled={validCurrentPage === totalPages}
                        className="px-3.5 py-2 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer flex items-center gap-1 text-xs font-bold"
                        aria-label="Next page"
                      >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="py-20 text-center text-gray-400">
                <p className="text-lg font-bold mb-2">No discounted books in this category right now.</p>
                <button
                  onClick={() => setCategoryFilter('all')}
                  className="text-emerald-700 font-bold underline text-sm cursor-pointer"
                >
                  Clear filter to view all deals
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedBook && (
        <BookDetail book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </PageLayout>
  );
}
