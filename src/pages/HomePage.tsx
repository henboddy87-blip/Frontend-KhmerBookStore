import { useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { CouponVoucherRibbon } from "../components/CouponVoucherRibbon";
import { Hero } from "../components/Hero";
import { FlashSaleSection } from "../components/FlashSaleSection";
import { DynamicCampaignsSection } from "../components/DynamicCampaignsSection";
import { CategoriesSection } from "../components/CategoriesSection";
import { FeaturedBooks } from "../components/FeaturedBooks";
import { CommunitySection } from "../components/CommunitySection";
import { BookGrid } from "../components/BookGrid";
import { BookDetail } from "../components/BookDetail";
import { Cart } from "../components/Cart";
import { Wishlist } from "../components/Wishlist";
import { Checkout } from "../components/Checkout";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { AuthModal } from "../components/AuthModal";
import { Footer } from "../components/Footer";

import { Book } from "../types";
import { useStore } from "../context/StoreContext";

export function HomePage() {
  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { t, books, loadingBooks, isCheckoutOpen, openCheckout, closeCheckout } = useStore();

  const ITEMS_PER_PAGE = 15; // 3 rows of 5 cards on desktop grid

  const filteredBooks = useMemo(() => {
    let res = [...books];
    if (category !== "all") res = res.filter((b) => b.category === category || b.genre === category);
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      res = res.filter((b) => {
        const title = (b.title || "").toLowerCase();
        const author = (b.author || "").toLowerCase();
        const genre = (b.genre || "").toLowerCase();
        const tags = Array.isArray(b.tags) ? b.tags : [];
        const hasTag = tags.some((t) => typeof t === "string" && t.toLowerCase().includes(q));
        return title.includes(q) || author.includes(q) || genre.includes(q) || hasTag;
      });
    }
    return res;
  }, [category, searchQuery, books]);

  useEffect(() => {
    setCurrentPage(1);
  }, [category, searchQuery]);

  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE) || 1;
  const validCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);

  const paginatedBooks = useMemo(() => {
    const start = (validCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredBooks.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredBooks, validCurrentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    document.getElementById("books-grid")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    setSearchQuery("");
    setCurrentPage(1);
    if (cat !== "all") {
      setShowGrid(true);
      setTimeout(
        () =>
          document
            .getElementById("books-grid")
            ?.scrollIntoView({ behavior: "smooth" }),
        100,
      );
    } else {
      setShowGrid(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
    if (q) {
      setShowGrid(true);
      setTimeout(
        () =>
          document
            .getElementById("books-grid")
            ?.scrollIntoView({ behavior: "smooth" }),
        100,
      );
    }
  };

  const handleShopNow = () => {
    setShowGrid(true);
    setCategory("all");
    setCurrentPage(1);
    setTimeout(
      () =>
        document
          .getElementById("books-grid")
          ?.scrollIntoView({ behavior: "smooth" }),
      100,
    );
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    openCheckout();
  };

  const handleBackHome = () => {
    setShowGrid(false);
    setCategory("all");
    setSearchQuery("");
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg">
      <Navbar
        onCartClick={() => setIsCartOpen(true)}
        onWishlistClick={() => setIsWishlistOpen(true)}
        onAuthClick={() => setIsAuthOpen(true)}
        onSearch={handleSearch}
      />
      <main>
        {!showGrid ? (
          <>
            <ErrorBoundary>
              <CouponVoucherRibbon />
            </ErrorBoundary>
            <Hero
              onShopNow={handleShopNow}
              onCategoryChange={handleCategoryChange}
            />
            <ErrorBoundary>
              <FlashSaleSection onBookClick={setSelectedBook} />
            </ErrorBoundary>
            <ErrorBoundary>
              <DynamicCampaignsSection onCategorySelect={handleCategoryChange} />
            </ErrorBoundary>
            <ErrorBoundary>
              <CategoriesSection onCategoryChange={handleCategoryChange} />
            </ErrorBoundary>
            <ErrorBoundary>
              <FeaturedBooks
                books={books}
                onBookClick={setSelectedBook}
                onViewAll={handleShopNow}
                loading={loadingBooks}
              />
            </ErrorBoundary>
            <CommunitySection />
          </>
        ) : (
          <>
            <div id="books-grid" className="max-w-[1600px] mx-auto px-4 sm:px-6 py-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b dark:border-white/10">
                <div>
                  <h2
                    className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white capitalize"
                    style={{ fontFamily: "Merriweather, serif" }}
                  >
                    {category === "all" ? t("allBooks") : category.replace(/-/g, " ")}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Showing {(validCurrentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(validCurrentPage * ITEMS_PER_PAGE, filteredBooks.length)} of {filteredBooks.length} {t("booksAvailable")} (3 rows)
                  </p>
                </div>
                <button
                  onClick={handleBackHome}
                  className="self-start sm:self-auto px-5 py-2.5 bg-gray-100 dark:bg-white/10 hover:bg-emerald-50 dark:hover:bg-white/20 text-gray-700 dark:text-gray-200 rounded-full text-xs font-bold transition-all cursor-pointer"
                >
                  ← {t("backToHome")}
                </button>
              </div>

              {loadingBooks ? (
                <BookGrid books={[]} onBookClick={() => {}} loading={true} />
              ) : filteredBooks.length > 0 ? (
                <>
                  <BookGrid
                    books={paginatedBooks}
                    onBookClick={setSelectedBook}
                  />

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-6 border-t border-gray-100 dark:border-white/10">
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        Page <span className="font-bold text-gray-900 dark:text-white">{validCurrentPage}</span> of{' '}
                        <span className="font-bold text-gray-900 dark:text-white">{totalPages}</span>
                      </p>

                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <button
                          type="button"
                          onClick={() => handlePageChange(validCurrentPage - 1)}
                          disabled={validCurrentPage === 1}
                          className="px-3 py-2 rounded-xl border border-emerald-200/60 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer flex items-center gap-1 text-xs font-bold"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span className="hidden sm:inline">Prev</span>
                        </button>

                        <div className="flex items-center gap-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter((page) => {
                              return (
                                page === 1 ||
                                page === totalPages ||
                                Math.abs(page - validCurrentPage) <= 1
                              );
                            })
                            .map((page, idx, arr) => {
                              const prev = arr[idx - 1];
                              return (
                                <div key={page} className="flex items-center">
                                  {prev && page - prev > 1 && (
                                    <span className="px-1.5 text-gray-400 text-xs select-none">...</span>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handlePageChange(page)}
                                    className={`w-9 h-9 rounded-xl text-xs font-black transition-all cursor-pointer ${
                                      validCurrentPage === page
                                        ? 'bg-emerald-800 text-white shadow-md shadow-emerald-900/20 scale-105'
                                        : 'bg-white dark:bg-dark-card border border-emerald-200/60 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-white/5'
                                    }`}
                                  >
                                    {page}
                                  </button>
                                </div>
                              );
                            })}
                        </div>

                        <button
                          type="button"
                          onClick={() => handlePageChange(validCurrentPage + 1)}
                          disabled={validCurrentPage === totalPages}
                          className="px-3 py-2 rounded-xl border border-emerald-200/60 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer flex items-center gap-1 text-xs font-bold"
                        >
                          <span className="hidden sm:inline">Next</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-20 text-center text-gray-400 dark:text-gray-500">
                  <p className="text-lg font-semibold mb-2">No books found in this selection.</p>
                  <p className="text-sm">Try browsing another category or clearing your search.</p>
                </div>
              )}
            </div>
            <div className="text-center py-10 border-t dark:border-white/10 bg-white dark:bg-dark-bg">
              <button
                onClick={handleBackHome}
                className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-900 text-white rounded-full font-bold hover:bg-emerald-800 transition-all shadow-xl cursor-pointer"
              >
                 {t('backToHome')}
              </button>
            </div>
          </>
        )}
      </main>
      <Footer />
      {selectedBook && (
        <BookDetail book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckout}
      />
      <Wishlist
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        onBookClick={setSelectedBook}
      />
      <Checkout
        isOpen={isCheckoutOpen}
        onClose={closeCheckout}
      />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
