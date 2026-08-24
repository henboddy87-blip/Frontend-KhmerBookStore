import { Link } from 'react-router-dom';
import { Book } from '../types';
import { BookRowSection } from './BookRowSection';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface FeaturedBooksProps {
  books: Book[];
  onBookClick: (book: Book) => void;
  onViewAll?: () => void;
  loading?: boolean;
}

export function FeaturedBooks({ books, onBookClick, loading }: FeaturedBooksProps) {
  const [bannerRef, bannerVisible] = useScrollReveal();

  // Dynamic filter rows strictly checked directly from Admin book status flags only:
  // 1. Best Sellers: is_bestseller === true
  const bestsellers = books
    .filter((b) => Boolean(b.isBestseller || (b as any).is_bestseller))
    .sort((a, b) => (b.id || 0) - (a.id || 0));
  
  // 2. New Arrivals: is_new === true
  const newArrivals = books
    .filter((b) => Boolean(b.isNew || (b as any).is_new))
    .sort((a, b) => (b.id || 0) - (a.id || 0));

  // 3. Top Rated: is_top_rated === true
  const topRated = books
    .filter((b) => Boolean(b.isTopRated || (b as any).is_top_rated))
    .sort((a, b) => (b.rating || 0) - (a.rating || 0));

  // 4. On Sale: is_sale === true
  const onSale = books
    .filter((b) => Boolean(b.isSale || (b as any).is_sale))
    .sort((a, b) => (b.id || 0) - (a.id || 0));

  // 5. Special Offers: is_special_offer === true
  const specialOffers = books
    .filter((b) => Boolean(b.isSpecialOffer || (b as any).is_special_offer))
    .sort((a, b) => (b.id || 0) - (a.id || 0));

  if (loading) {
    return (
      <section className="py-12 bg-emerald-50/40 dark:bg-dark-bg/20 transition-colors duration-500 space-y-12">
        <BookRowSection title="Best Sellers" subtitle="Our most popular and highly demanded titles" books={[]} onBookClick={onBookClick} loading={true} accentColor="emerald" />
        <BookRowSection title="New Arrivals" subtitle="Fresh off the press — discover the newest additions" books={[]} onBookClick={onBookClick} loading={true} accentColor="emerald" />
        <BookRowSection title="Top Rated" subtitle="Highest-rated literature praised by our reading community" books={[]} onBookClick={onBookClick} loading={true} accentColor="purple" />
      </section>
    );
  }

  return (
    <section className="py-12 bg-emerald-50/40 dark:bg-dark-bg/20 transition-colors duration-500 space-y-12">
      {/* 1. Best Sellers Row */}
      {bestsellers.length > 0 && (
        <BookRowSection
          title="Best Sellers"
          subtitle="Our most popular and highly demanded titles"
          books={bestsellers}
          viewAllLink="/bestsellers"
          viewAllText="Explore Bestsellers"
          onBookClick={onBookClick}
          accentColor="emerald"
        />
      )}

      {/* 2. New Arrivals Row */}
      {newArrivals.length > 0 && (
        <BookRowSection
          title="New Arrivals"
          subtitle="Fresh off the press — discover the newest additions"
          books={newArrivals}
          viewAllLink="/new-arrivals"
          viewAllText="See New Arrivals"
          onBookClick={onBookClick}
          accentColor="emerald"
        />
      )}

      {/* Feature Club Promo Banner */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 my-16">
        <div
          ref={bannerRef}
          className={`relative rounded-3xl overflow-hidden reveal-scale shadow-2xl ${
            bannerVisible ? 'revealed' : ''
          }`}
        >
          <div className="absolute inset-0">
            <img
              src="https://i.pinimg.com/1200x/16/82/78/168278ef6ef3ec25574bee8eadbc519d.jpg"
              alt="Book club cover"
              className="w-full h-full object-cover"
            />
            {/* Dark gradient overlay so text remains readable */}
            <div className="absolute inset-0 bg-black/40 bg-gradient-to-r from-black/80 to-transparent" />
          </div>

          <div className="relative px-6 sm:px-12 md:px-16 py-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="text-white max-w-2xl">
              
              <h3
                className="text-2xl sm:text-3xl md:text-4xl font-black text-white mt-1 mb-3"
                style={{ fontFamily: 'Merriweather, serif' }}
              >
                Curated Stories for Every Passionate Reader
              </h3>
              <p className="text-emerald-100/80 text-sm sm:text-base leading-relaxed">
                Enjoy exclusive access to author spotlights, upcoming book releases, and verified staff picks delivered directly to your doorstep.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-shrink-0 w-full lg:w-auto">
              <Link
                to="/books"
                className="px-8 py-4 bg-white text-emerald-950 font-bold rounded-full hover:bg-emerald-50 transition-all shadow-xl hover:shadow-2xl text-center active:scale-95 cursor-pointer inline-block"
              >
                Browse All Books
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Top Rated Row */}
      {topRated.length > 0 && (
        <BookRowSection
          title="Top Rated"
          subtitle="Highest-rated literature praised by our reading community"
          books={topRated}
          viewAllLink="/award-winners"
          viewAllText="View Top Rated"
          onBookClick={onBookClick}
          accentColor="purple"
        />
      )}

      {/* 4. On Sale Row (Dedicated) */}
      {onSale.length > 0 && (
        <BookRowSection
          title="On Sale"
          subtitle="Exceptional books with discounted prices and markdown deals"
          books={onSale}
          viewAllLink="/on-sale"
          viewAllText="Shop On Sale"
          onBookClick={onBookClick}
          accentColor="red"
        />
      )}

      {/* 5. Special Offers Row (Separated) */}
      {specialOffers.length > 0 && (
        <BookRowSection
          title="Special Offers"
          subtitle="Exclusive limited-time promotions, bundle specials, and featured perks"
          books={specialOffers}
          viewAllLink="/special-offers"
          viewAllText="Explore Special Offers"
          onBookClick={onBookClick}
          accentColor="blue"
        />
      )}

      {/* View All Catalog CTA */}
      <div className="text-center pt-8 pb-4">
        <Link
          to="/books"
          className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-800 text-white rounded-full font-bold hover:from-emerald-800 hover:to-emerald-700 transition-all group shadow-xl shadow-emerald-900/20 cursor-pointer"
        >
          <span>View All Books</span>
  
        </Link>
      </div>
    </section>
  );
}
