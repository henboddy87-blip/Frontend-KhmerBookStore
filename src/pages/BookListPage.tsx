import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LucideIcon, Filter, X, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { BookGrid } from '../components/BookGrid';
import { BookDetail } from '../components/BookDetail';
import { PageLayout } from '../components/PageLayout';
import { Book } from '../types';
import { useStore } from '../context/StoreContext';

interface BookListPageProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  filterFn?: (book: Book) => boolean;
  sortFn?: (a: Book, b: Book) => number;
  category?: string;
}

export default function BookListPage({
  title,
  subtitle,
  icon: Icon,
  filterFn,
  sortFn,
  category,
}: BookListPageProps) {
  const { books, loadingBooks } = useStore();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const ITEMS_PER_PAGE = 12; // Exactly 3 rows of 4 cards on desktop

  const filteredBooks = useMemo(() => {
    let res = [...books];
    if (filterFn) res = res.filter(filterFn);
    if (category && category !== 'all') res = res.filter(b => b.category === category);
    
    // Search Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      res = res.filter(b =>
        (b.title || '').toLowerCase().includes(q) ||
        (b.author || '').toLowerCase().includes(q) ||
        (b.genre || '').toLowerCase().includes(q)
      );
    }

    // Price Filter
    res = res.filter(b => Number(b.price || 0) >= priceRange[0] && Number(b.price || 0) <= priceRange[1]);

    // Rating Filter
    if (minRating > 0) {
      res = res.filter(b => Number(b.rating || 0) >= minRating);
    }

    // Availability Filter
    if (onlyInStock) {
      res = res.filter(b => Boolean(b.inStock ?? (b as any).in_stock ?? true));
    }

    // Genre Filter
    if (selectedGenres.length > 0) {
      res = res.filter(b => selectedGenres.includes(b.genre));
    }

    // Format Filter
    if (selectedFormats.length > 0) {
      res = res.filter(b => selectedFormats.includes(b.format));
    }

    // Complex Sorting
    switch (sortBy) {
      case 'newest': res.sort((a, b) => Number(b.publishedYear || 0) - Number(a.publishedYear || 0)); break;
      case 'rating': res.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0)); break;
      case 'price-low': res.sort((a, b) => Number(a.price || 0) - Number(b.price || 0)); break;
      case 'price-high': res.sort((a, b) => Number(b.price || 0) - Number(a.price || 0)); break;
      case 'az': res.sort((a, b) => (a.title || '').localeCompare(b.title || '')); break;
      default: if (sortFn) res.sort(sortFn); break;
    }

    return res;
  }, [searchQuery, priceRange, minRating, onlyInStock, selectedGenres, selectedFormats, sortBy, category, filterFn, sortFn]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, priceRange, minRating, onlyInStock, selectedGenres, selectedFormats, sortBy, category]);

  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE) || 1;
  const validCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);

  const paginatedBooks = useMemo(() => {
    const start = (validCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredBooks.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredBooks, validCurrentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    const bookListEl = document.getElementById('book-list-top');
    if (bookListEl) {
      bookListEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 350, behavior: 'smooth' });
    }
  };

  const resetFilters = () => {
    setPriceRange([0, 100]);
    setMinRating(0);
    setOnlyInStock(false);
    setSearchQuery('');
    setSortBy('featured');
    setSelectedGenres([]);
    setSelectedFormats([]);
    setCurrentPage(1);
  };

  return (
    <PageLayout>
      {/* Hero Banner */}
      
      <div className="bg-emerald-50/50 dark:bg-emerald-950/40 border-b border-emerald-100 dark:border-white/5 relative overflow-hidden transition-colors duration-500">
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2392400e' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="max-w-[1600px] mx-auto px-4 py-16 relative">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 text-sm font-semibold mb-4">
            <button onClick={() => navigate('/')} className="hover:text-emerald-900 dark:hover:text-white transition-colors">Home</button>
            <span>›</span>
            <span className="text-emerald-900 dark:text-white">{title}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-16 h-16 bg-white dark:bg-white/10 rounded-2xl flex items-center justify-center shadow-sm border border-emerald-100 dark:border-white/10">
              <Icon size={32} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white" style={{ fontFamily: 'Merriweather, serif' }}>
                {title}
              </h1>
              <p className="text-gray-500 dark:text-emerald-200/70 mt-2 text-lg font-medium">{subtitle}</p>
            </div>
          </div>

          {/* Search bar */}
          <div className="mt-10 max-w-2xl">
            <div className="relative group">
              <input
                type="text"
                placeholder={`Search in ${title.toLowerCase()}...`}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4.5 pr-14 rounded-2xl bg-white dark:bg-dark-card border-2 border-emerald-100 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-600 transition-all shadow-xl shadow-emerald-900/5 focus:ring-4 focus:ring-emerald-500/10"
              />
              <Search size={22} className="absolute right-5 top-1/2 -translate-y-1/2 text-emerald-600 dark:text-emerald-500 group-focus-within:scale-110 transition-transform" />
            </div>
          </div>
        </div>
      </div>



      {/* Results & Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Mobile Filter Toggle */}
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden flex items-center justify-center gap-2 w-full py-3 bg-white dark:bg-dark-card border border-emerald-200 dark:border-white/10 rounded-xl text-emerald-900 dark:text-emerald-400 font-bold shadow-sm"
          >
            <Filter size={18} />
            Filter & Sort
          </button>

          {/* Sidebar Filters */}
          <aside className={`
            fixed inset-0 z-50 lg:relative lg:inset-auto lg:z-0 lg:block
            transition-transform duration-300 lg:translate-x-0
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
            {/* Backdrop for mobile */}
            <div 
              className="absolute inset-0 bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
            
            <div className="relative bg-white dark:bg-dark-card h-full lg:h-auto w-80 lg:w-64 flex flex-col lg:rounded-2xl lg:border lg:border-emerald-100 dark:lg:border-white/10 lg:shadow-sm overflow-hidden">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-6 border-b border-emerald-50 dark:border-white/5">
                <h3 className="font-black text-emerald-900 dark:text-emerald-400" style={{ fontFamily: 'Merriweather, serif' }}>Filter Books</h3>
                <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 hover:bg-emerald-50 dark:hover:bg-white/10 rounded-full transition-colors">
                  <X size={20} className="text-emerald-900 dark:text-emerald-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                
                {/* Price Range */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-200">Price Range</p>
                    <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded">
                      ${priceRange[0]} - ${priceRange[1]}
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="0" max="100" 
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-1.5 bg-emerald-100 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="flex justify-between mt-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    <span>$0</span>
                    <span>$100+</span>
                  </div>
                </div>

                {/* Star Rating */}
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-200 mb-4">Minimum Rating</p>
                  <div className="space-y-2">
                    {[4, 3, 2].map((rating) => (
                      <button 
                        key={rating}
                        onClick={() => setMinRating(minRating === rating ? 0 : rating)}
                        className={`
                          flex items-center justify-between w-full p-2.5 rounded-xl border transition-all text-left
                          ${minRating === rating ? 'bg-emerald-900 dark:bg-emerald-600 border-emerald-900 dark:border-emerald-600 text-white' : 'bg-white dark:bg-white/5 border-emerald-100 dark:border-white/5 text-gray-600 dark:text-gray-400 hover:border-emerald-300'}
                        `}
                      >
                        <div className="flex items-center gap-1.5">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                size={12} 
                                className={i < rating ? (minRating === rating ? 'text-emerald-300 fill-emerald-300' : 'text-emerald-400 fill-emerald-400') : 'text-gray-200'} 
                              />
                            ))}
                          </div>
                          <span className="text-xs font-bold">& Up</span>
                        </div>
                        {minRating === rating && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-200 mb-4">Availability</p>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`relative w-11 h-6 rounded-full transition-colors ${onlyInStock ? 'bg-emerald-600' : 'bg-gray-200 dark:bg-white/10 group-hover:bg-gray-300 dark:group-hover:bg-white/20'}`}>
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={onlyInStock}
                        onChange={() => setOnlyInStock(!onlyInStock)}
                      />
                      <div className={`
                        absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200
                        ${onlyInStock ? 'translate-x-5' : 'translate-x-0'}
                      `} />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Only In Stock</span>
                  </label>
                </div>

                {/* Genre Filter */}
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-200 mb-4">Genre</p>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(books.map(b => b.genre))).slice(0, 10).map((genre) => (
                      <button 
                        key={genre}
                        onClick={() => setSelectedGenres(prev => prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre])}
                        className={`
                          px-3 py-1.5 rounded-full text-xs font-bold transition-all border
                          ${selectedGenres.includes(genre) ? 'bg-emerald-900 dark:bg-emerald-600 border-emerald-900 dark:border-emerald-600 text-white' : 'bg-white dark:bg-white/5 border-emerald-100 dark:border-white/5 text-gray-600 dark:text-gray-400 hover:border-emerald-300'}
                        `}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Format Filter */}
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-200 mb-4">Format</p>
                  <div className="space-y-2">
                    {['Paperback', 'Hardcover', 'E-Book', 'Audiobook'].map((format) => (
                      <label key={format} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox"
                          className="w-4 h-4 rounded border-emerald-200 dark:border-white/20 text-emerald-600 focus:ring-emerald-500 dark:bg-dark-bg"
                          checked={selectedFormats.includes(format)}
                          onChange={() => setSelectedFormats(prev => prev.includes(format) ? prev.filter(f => f !== format) : [...prev, format])}
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-emerald-900 dark:group-hover:text-emerald-400 transition-colors">{format}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Active Filters / Reset */}
                {(minRating > 0 || onlyInStock || priceRange[1] < 100 || searchQuery || selectedGenres.length > 0 || selectedFormats.length > 0) && (
                  <button 
                    onClick={resetFilters}
                    className="w-full py-3 text-sm font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-white/5 rounded-xl hover:bg-emerald-100 dark:hover:bg-white/10 transition-colors"
                  >
                    Reset All Filters
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* Book List Area */}
          <div className="flex-1" id="book-list-top">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-white/5">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Showing <span className="font-bold text-gray-900 dark:text-gray-100">{(validCurrentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(validCurrentPage * ITEMS_PER_PAGE, filteredBooks.length)}</span> of{' '}
                <span className="font-bold text-gray-900 dark:text-gray-100">{filteredBooks.length}</span> books
                {searchQuery && <> for "<span className="text-emerald-700 dark:text-emerald-400">{searchQuery}</span>"</>}
              </p>
              
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline text-xs font-bold text-gray-400 uppercase tracking-widest">Sort:</span>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white dark:bg-dark-card border border-emerald-100 dark:border-white/10 rounded-lg px-3 py-1.5 text-sm text-emerald-900 dark:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="rating">Top Rated</option>
                  <option value="price-low">Price: Low-High</option>
                  <option value="price-high">Price: High-Low</option>
                  <option value="az">A-Z</option>
                </select>
              </div>
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
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-6 border-t border-gray-100 dark:border-white/5">
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      Page <span className="font-bold text-gray-900 dark:text-white">{validCurrentPage}</span> of{' '}
                      <span className="font-bold text-gray-900 dark:text-white">{totalPages}</span> (3 rows per page)
                    </p>

                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <button
                        type="button"
                        onClick={() => handlePageChange(validCurrentPage - 1)}
                        disabled={validCurrentPage === 1}
                        className="px-3 py-2 rounded-xl border border-emerald-200/60 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer flex items-center gap-1 text-xs font-bold"
                        aria-label="Previous page"
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
              <div className="py-20 text-center bg-white dark:bg-dark-card rounded-3xl border border-dashed border-emerald-200 dark:border-white/10">
                <Search size={48} className="mx-auto text-emerald-200 dark:text-emerald-800 mb-4" />
                <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-400 mb-2">No books found</h3>
                <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters or search terms.</p>
                <button 
                  onClick={resetFilters}
                  className="mt-6 px-6 py-2 bg-emerald-900 text-white rounded-full font-bold hover:bg-emerald-800 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Back home */}
      <div className="text-center py-10 border-t dark:border-white/5 bg-white dark:bg-dark-bg">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-900 text-white rounded-full font-bold hover:bg-emerald-800 transition-all shadow-xl"
        >
           Back to Home
        </button>
      </div>

      {selectedBook && (
        <BookDetail book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </PageLayout>
  );
}