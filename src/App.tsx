import { useState, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider, defaultQueryClient } from "./query/QueryClient";
import { StoreProvider } from "./context/StoreContext";
import { SalesProvider } from "./context/SalesContext";
import { ScrollToTop } from "./components/ScrollToTop";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { PageSkeleton, BookDetailSkeleton } from "./components/skeletons";
import { Book } from "./types";

// Instant core page
import { HomePage } from "./pages/HomePage";

// Lazy Loaded Shop Pages (Code Splitting)
const AllBooksPage = lazy(() =>
  import("./pages/shop").then((m) => ({ default: m.AllBooksPage }))
);
const NewArrivalsPage = lazy(() =>
  import("./pages/shop").then((m) => ({ default: m.NewArrivalsPage }))
);
const BestsellersPage = lazy(() =>
  import("./pages/shop").then((m) => ({ default: m.BestsellersPage }))
);
const OnSalePage = lazy(() =>
  import("./pages/shop").then((m) => ({ default: m.OnSalePage }))
);
const SpecialOffersPage = lazy(() =>
  import("./pages/shop").then((m) => ({ default: m.SpecialOffersPage }))
);
const AwardWinnersPage = lazy(() =>
  import("./pages/shop").then((m) => ({ default: m.AwardWinnersPage }))
);
const BookBundlesPage = lazy(() =>
  import("./pages/shop").then((m) => ({ default: m.BookBundlesPage }))
);

// Lazy Loaded Profile & Payments
const ProfilePage = lazy(() =>
  import("./pages/ProfilePage").then((m) => ({ default: m.ProfilePage }))
);
const PaymentCallbackPage = lazy(() =>
  import("./pages/PaymentCallbackPage").then((m) => ({
    default: m.PaymentCallbackPage,
  }))
);

// Lazy Loaded Genre Pages
const FictionPage = lazy(() =>
  import("./pages/genre").then((m) => ({ default: m.FictionPage }))
);
const NonFictionPage = lazy(() =>
  import("./pages/genre").then((m) => ({ default: m.NonFictionPage }))
);
const SelfHelpPage = lazy(() =>
  import("./pages/genre").then((m) => ({ default: m.SelfHelpPage }))
);
const BiographyPage = lazy(() =>
  import("./pages/genre").then((m) => ({ default: m.BiographyPage }))
);
const ChildrensPage = lazy(() =>
  import("./pages/genre").then((m) => ({ default: m.ChildrensPage }))
);
const ScienceFictionPage = lazy(() =>
  import("./pages/genre").then((m) => ({ default: m.ScienceFictionPage }))
);
const TechnologyPage = lazy(() =>
  import("./pages/genre").then((m) => ({ default: m.TechnologyPage }))
);
const KhmerLiteraturePage = lazy(() =>
  import("./pages/genre").then((m) => ({ default: m.KhmerLiteraturePage }))
);
const NovelPage = lazy(() =>
  import("./pages/genre").then((m) => ({ default: m.NovelPage }))
);
const HealthPage = lazy(() =>
  import("./pages/genre").then((m) => ({ default: m.HealthPage }))
);
const FinancePage = lazy(() =>
  import("./pages/genre").then((m) => ({ default: m.FinancePage }))
);
const ArtPage = lazy(() =>
  import("./pages/genre").then((m) => ({ default: m.ArtPage }))
);

// Lazy Loaded Help Pages
const FAQPage = lazy(() =>
  import("./pages/help").then((m) => ({ default: m.FAQPage }))
);
const ShippingInfoPage = lazy(() =>
  import("./pages/help").then((m) => ({ default: m.ShippingInfoPage }))
);
const ReturnsPage = lazy(() =>
  import("./pages/help").then((m) => ({ default: m.ReturnsPage }))
);
const TrackOrderPage = lazy(() =>
  import("./pages/help").then((m) => ({ default: m.TrackOrderPage }))
);
const ContactUsPage = lazy(() =>
  import("./pages/help").then((m) => ({ default: m.ContactUsPage }))
);

// Lazy Loaded Legal Pages
const PrivacyPolicyPage = lazy(() =>
  import("./pages/legal").then((m) => ({ default: m.PrivacyPolicyPage }))
);
const TermsOfServicePage = lazy(() =>
  import("./pages/legal").then((m) => ({ default: m.TermsOfServicePage }))
);
const CookiePolicyPage = lazy(() =>
  import("./pages/legal").then((m) => ({ default: m.CookiePolicyPage }))
);
const AccessibilityPage = lazy(() =>
  import("./pages/legal").then((m) => ({ default: m.AccessibilityPage }))
);

// Lazy Loaded Modals & Floating Widgets
const BookDetail = lazy(() =>
  import("./components/BookDetail").then((m) => ({ default: m.BookDetail }))
);
const ChatBot = lazy(() =>
  import("./components/ChatBot").then((m) => ({ default: m.ChatBot }))
);

export function App() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={defaultQueryClient}>
        <BrowserRouter>
          <ScrollToTop />
          <StoreProvider>
            <SalesProvider>
              <Suspense fallback={<PageSkeleton />}>
                <ErrorBoundary>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route
                      path="/payment/callback"
                      element={<PaymentCallbackPage />}
                    />
                    <Route path="/books" element={<AllBooksPage />} />
                    <Route path="/new-arrivals" element={<NewArrivalsPage />} />
                    <Route path="/bestsellers" element={<BestsellersPage />} />
                    <Route path="/on-sale" element={<OnSalePage />} />
                    <Route
                      path="/special-offers"
                      element={<SpecialOffersPage />}
                    />
                    <Route path="/deals" element={<SpecialOffersPage />} />
                    <Route path="/flash-sales" element={<SpecialOffersPage />} />
                    <Route
                      path="/award-winners"
                      element={<AwardWinnersPage />}
                    />
                    <Route path="/book-bundles" element={<BookBundlesPage />} />
                    <Route path="/genre/fiction" element={<FictionPage />} />
                    <Route
                      path="/genre/non-fiction"
                      element={<NonFictionPage />}
                    />
                    <Route path="/genre/self-help" element={<SelfHelpPage />} />
                    <Route
                      path="/genre/biography"
                      element={<BiographyPage />}
                    />
                    <Route path="/genre/children" element={<ChildrensPage />} />
                    <Route
                      path="/genre/science"
                      element={<ScienceFictionPage />}
                    />
                    <Route
                      path="/genre/technology"
                      element={<TechnologyPage />}
                    />
                    <Route
                      path="/genre/khmer-literature"
                      element={<KhmerLiteraturePage />}
                    />
                    <Route path="/genre/novel" element={<NovelPage />} />
                    <Route path="/genre/health" element={<HealthPage />} />
                    <Route path="/genre/finance" element={<FinancePage />} />
                    <Route path="/genre/art" element={<ArtPage />} />
                    <Route path="/faq" element={<FAQPage />} />
                    <Route path="/shipping" element={<ShippingInfoPage />} />
                    <Route path="/returns" element={<ReturnsPage />} />
                    <Route path="/track-order" element={<TrackOrderPage />} />
                    <Route path="/contact" element={<ContactUsPage />} />

                    {/* Legal Pages */}
                    <Route
                      path="/privacy-policy"
                      element={<PrivacyPolicyPage />}
                    />
                    <Route
                      path="/terms-of-service"
                      element={<TermsOfServicePage />}
                    />
                    <Route
                      path="/cookie-policy"
                      element={<CookiePolicyPage />}
                    />
                    <Route
                      path="/accessibility"
                      element={<AccessibilityPage />}
                    />
                  </Routes>
                </ErrorBoundary>
              </Suspense>

              {/* Floating AI RAG ChatBot */}
              <Suspense fallback={null}>
                <ErrorBoundary>
                  <ChatBot onOpenBookDetail={setSelectedBook} />
                </ErrorBoundary>
              </Suspense>

              {/* Global Book Detail Modal */}
              {selectedBook && (
                <Suspense
                  fallback={
                    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
                      <div className="bg-white dark:bg-dark-bg rounded-3xl max-w-6xl w-full p-8 shadow-2xl">
                        <BookDetailSkeleton />
                      </div>
                    </div>
                  }
                >
                  <ErrorBoundary>
                    <BookDetail
                      book={selectedBook}
                      onClose={() => setSelectedBook(null)}
                    />
                  </ErrorBoundary>
                </Suspense>
              )}
            </SalesProvider>
          </StoreProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
