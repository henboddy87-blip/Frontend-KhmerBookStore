import { useMemo, useState, useEffect } from "react";
import {
  X as FaTimes,
  Star as FaStar,
  Check as FaCheck,
  Zap,
  Clock,
  Flame,
  Sparkles,
  Tag,
} from "lucide-react";
import { WishlistIcon, CartIcon } from "./NavIcons";
import { Book } from "../types";
import { useStore } from "../context/StoreContext";
import { useSales } from "../context/SalesContext";
import { OptimizedImage } from "./OptimizedImage";

interface BookDetailProps {
  book: Book;
  onClose: () => void;
}

export function BookDetail({ book, onClose }: BookDetailProps) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist, user, token } =
    useStore();
  const { getBookDiscount, getBookFlashSale, getTimeRemaining } = useSales();
  const activeDiscount = getBookDiscount(book);
  const flashSale = getBookFlashSale(book.id);
  const flashTime = flashSale ? getTimeRemaining(flashSale.end_time, flashSale.start_time) : null;

  const displayPrice = Number(activeDiscount ? activeDiscount.salePrice : book.price) || 0;
  const originalPrice = Number(
    activeDiscount
      ? activeDiscount.originalPrice
      : (book.originalPrice ?? (book as any).original_price ?? book.price)
  ) || 0;
  const isBookInStock = (book.inStock ?? (book as any).in_stock ?? true);
  const stockCount = Number(book.stockCount ?? (book as any).stock_count ?? 15);
  const isNew = Boolean(book.isNew ?? (book as any).is_new);
  const isBestseller = Boolean(book.isBestseller ?? (book as any).is_bestseller);
  const isTopRated = Boolean(book.isTopRated ?? (book as any).is_top_rated);
  const isSpecialOffer = Boolean(book.isSpecialOffer ?? (book as any).is_special_offer);
  const isSale = Boolean(book.isSale ?? (book as any).is_sale);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "description" | "details" | "reviews"
  >("description");
  const [added, setAdded] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);
  const inWishlist = isInWishlist(book.id);
  
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");

  const totalApprovedReviews = reviews.length;
  const currentAvgRating = totalApprovedReviews > 0
    ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / totalApprovedReviews)
    : (book.rating || 0);
  const displayRating = currentAvgRating > 0 ? currentAvgRating.toFixed(1) : "0.0";
  const displayReviewsCount = totalApprovedReviews > 0 ? totalApprovedReviews : (book.reviews || 0);

  const starPercentages = useMemo(() => {
    return [5, 4, 3, 2, 1].map((s) => {
      const count = reviews.filter((r) => Math.round(r.rating) === s).length;
      const pct = totalApprovedReviews > 0 ? Math.round((count / totalApprovedReviews) * 100) : 0;
      return { star: s, pct, count };
    });
  }, [reviews, totalApprovedReviews]);

  useEffect(() => {
    document.body.classList.add("book-detail-open");
    
    // Fetch real reviews for this book
    fetch(`http://127.0.0.1:8000/api/reviews/book/${book.id}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setReviews(data);
      })
      .catch(console.error);
      
    return () => document.body.classList.remove("book-detail-open");
  }, [book.id]);

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    const activeToken = token || localStorage.getItem("frontend_token");
    if (!activeToken) {
      setReviewMessage("Please log in to write a review.");
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/reviews/${book.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify(reviewForm),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || "Failed to submit review");
      }

      setReviewForm({ rating: 5, comment: "" });
      setReviewMessage("Review submitted! It will appear once approved by the admin.");
    } catch (err: any) {
      setReviewMessage(err.message || "Something went wrong.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const galleryImages = useMemo(() => {
    let base: string[] = [];
    if (book.image) base.push(book.image);
    if (Array.isArray(book.images)) {
      base.push(...book.images);
    } else if (typeof book.images === "string" && book.images) {
      try {
        const parsed = JSON.parse(book.images);
        if (Array.isArray(parsed)) base.push(...parsed);
      } catch {}
    }
    const unique = Array.from(new Set(base.filter(Boolean)));
    return unique.length > 0 ? unique : [book.image || "/images/personal-development/1.jpg"];
  }, [book.image, book.images]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++)
      addToCart({ ...book, price: displayPrice }, book.format);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-[150] overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md z-[150]"
        onClick={onClose}
      />
      <div className="relative min-h-screen flex items-center justify-center p-3 sm:p-5 md:p-8 py-6 md:py-10 z-[150]">
        <div className="relative bg-white dark:bg-dark-bg rounded-3xl max-w-6xl w-full shadow-2xl overflow-hidden animate-scale-in border border-gray-100 dark:border-white/10 my-auto">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 w-11 h-11 bg-white/90 dark:bg-white/10 hover:bg-gray-100 dark:hover:bg-white/20 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-200 hover:rotate-90 transition-all shadow-md border border-gray-200/60 dark:border-white/10 cursor-pointer"
            aria-label="Close modal"
          >
            <FaTimes size={19} />
          </button>

          <div className="grid lg:grid-cols-5 gap-0">
            {/* Left - Book Cover */}
            <div className="lg:col-span-2 bg-gray-50/50 dark:bg-dark-card border-r border-gray-100 dark:border-white/5 p-6 md:p-8 flex flex-col justify-between">
              {/* Badges with Lucide Icons */}
              <div className="flex flex-wrap gap-2 mb-4">
                {activeDiscount?.isFlashSale && (
                  <span className="badge-bounce px-3 py-1 bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs font-black uppercase tracking-wider rounded-full shadow-md flex items-center gap-1.5 border border-white/20">
                    <Zap size={13} className="fill-current text-yellow-200" />
                    FLASH DEAL -{activeDiscount.discountPercent}%
                  </span>
                )}
                {!activeDiscount?.isFlashSale && activeDiscount && (
                  <span className="badge-bounce px-3 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-black uppercase tracking-wider rounded-full shadow-md flex items-center gap-1.5 border border-white/20">
                    <Tag size={13} className="text-emerald-200" />
                    -{activeDiscount.discountPercent}% OFF
                  </span>
                )}
                {isNew && (
                  <span className="badge-bounce px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-black uppercase tracking-wider rounded-full shadow-md flex items-center gap-1.5 border border-white/20">
                    <Sparkles size={13} className="text-yellow-100" />
                    NEW
                  </span>
                )}
                {isBestseller && (
                  <span className="badge-bounce px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-black uppercase tracking-wider rounded-full shadow-md flex items-center gap-1.5 border border-white/20">
                    <Flame size={13} className="text-yellow-200" />
                    BESTSELLER
                  </span>
                )}
                {isTopRated && (
                  <span className="badge-bounce px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-black uppercase tracking-wider rounded-full shadow-md flex items-center gap-1.5 border border-white/20">
                    <FaStar size={13} className="text-purple-200 fill-current" />
                    TOP RATED
                  </span>
                )}
                {isSpecialOffer && (
                  <span className="badge-bounce px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-black uppercase tracking-wider rounded-full shadow-md flex items-center gap-1.5 border border-white/20">
                    <Tag size={13} className="text-cyan-200" />
                    SPECIAL
                  </span>
                )}
                {isSale && !activeDiscount && (
                  <span className="badge-bounce px-3 py-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-black uppercase tracking-wider rounded-full shadow-md flex items-center gap-1.5 border border-white/20">
                    <Tag size={13} className="text-pink-200" />
                    SALE
                  </span>
                )}
              </div>

              <div className="flex gap-4 flex-1 items-center justify-center my-4">
                {/* Thumbnails (Left side) */}
                {galleryImages.length > 1 && (
                  <div className="flex flex-col gap-2 shrink-0 max-h-[400px] overflow-y-auto pr-1">
                    {galleryImages.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImg(i)}
                        className={`w-14 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                          currentImg === i
                            ? "border-emerald-500 shadow-md shadow-emerald-500/20 scale-105"
                            : "border-gray-200 dark:border-white/10 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <OptimizedImage
                          src={img}
                          alt=""
                          className="w-full h-full object-cover"
                          wrapperClassName="w-full h-full bg-white/10"
                        />
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Main Image */}
                <div className="relative flex-1 flex justify-center items-center w-full min-h-[350px]">
                  <OptimizedImage
                    src={galleryImages[currentImg] || book.image}
                    alt={`${book.title} - view ${currentImg + 1}`}
                    priority={true}
                    className="relative w-full max-h-[460px] object-contain rounded-2xl drop-shadow-2xl hover:scale-102 transition-transform duration-300"
                    wrapperClassName="w-full h-full min-h-[350px]"
                  />
                </div>
              </div>

              <div className="text-center pt-2">
                <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                  ISBN: {book.isbn || "978-BookStore"}
                </span>
              </div>
            </div>

            {/* Right - Details */}
            <div className="lg:col-span-3 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 font-black uppercase tracking-widest mb-1.5">
                  {book.genre || book.category || "Literature"}
                </p>
                <h1
                  className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-2 leading-tight"
                  style={{ fontFamily: "Merriweather, serif" }}
                >
                  {book.title}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                  by{" "}
                  <span className="text-emerald-800 dark:text-emerald-400 font-bold">
                    {book.author}
                  </span>
                </p>

                {/* Rating & Stock row */}
                <div className="flex items-center gap-3 mb-5 flex-wrap">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => {
                      const isFull = i < Math.floor(currentAvgRating);
                      const isHalf =
                        i === Math.floor(currentAvgRating) && currentAvgRating % 1 !== 0;
                      return (
                        <div key={i} className="relative">
                          <FaStar
                            size={16}
                            className="text-gray-200 dark:text-gray-700"
                          />
                          <div
                            className="absolute inset-0 overflow-hidden text-emerald-400"
                            style={{
                              width: isFull ? "100%" : isHalf ? "50%" : "0%",
                            }}
                          >
                            <FaStar size={16} className="fill-current" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <span className="font-bold text-gray-700 dark:text-gray-300 text-sm">
                    {displayRating}
                  </span>
                  <span className="text-gray-300 dark:text-gray-700">|</span>
                  <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                    {displayReviewsCount.toLocaleString()} reviews
                  </span>
                  <span className="text-gray-300 dark:text-gray-700">|</span>
                  <span
                    className={`font-bold text-xs sm:text-sm flex items-center gap-1.5 ${isBookInStock ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${isBookInStock ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    {isBookInStock
                      ? `In Stock (${stockCount} available)`
                      : "Out of Stock"}
                  </span>
                </div>

                {/* Dynamic Rich Promotion Box (Non-flat, lively design) */}
                {activeDiscount && (
                  <div className="relative overflow-hidden bg-gradient-to-r from-emerald-900 to-teal-950 text-white rounded-2xl p-4 sm:p-5 mb-5 border border-emerald-500/40 shadow-xl">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="flex items-center justify-between gap-3 flex-wrap relative z-10 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-red-500 text-white rounded-lg shadow-md animate-pulse">
                          <Zap className="w-4 h-4 fill-current" />
                        </span>
                        <div>
                          <p className="text-xs font-black uppercase tracking-wider text-emerald-300">
                            {activeDiscount.isFlashSale ? "Flash Deal In Progress" : "Special Campaign Deal"}
                          </p>
                          <p className="text-sm font-bold text-white">
                            {activeDiscount.campaignTitle || "Promotional Discount"}
                          </p>
                        </div>
                      </div>

                      {flashTime && !flashTime.isExpired && (
                        <div className="flex items-center gap-1.5 bg-black/40 border border-white/20 px-3 py-1.5 rounded-xl font-mono text-xs font-bold text-white shadow-inner">
                          <Clock className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                          <span>Ends in {flashTime.formatted}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-emerald-100/90 border-t border-white/10 pt-2.5 mt-2">
                      <span>✓ Discount automatically applied</span>
                      <span className="font-bold text-emerald-300">Save {(activeDiscount.discountPercent)}% Today</span>
                    </div>
                  </div>
                )}

                {/* Price Display */}
                <div className="flex items-baseline gap-3 mb-6 flex-wrap">
                  <span className={`text-3xl sm:text-4xl font-black ${activeDiscount?.isFlashSale ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-emerald-400'}`}>
                    ${displayPrice.toFixed(2)}
                  </span>
                  {originalPrice > displayPrice && (
                    <>
                      <span className="text-lg sm:text-xl text-gray-400 line-through">
                        ${originalPrice.toFixed(2)}
                      </span>
                      <span className="px-3 py-1 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/40 text-xs font-black rounded-full shadow-sm">
                        Save ${(originalPrice - displayPrice).toFixed(2)} (-{activeDiscount?.discountPercent || Math.round((1 - displayPrice / originalPrice) * 100)}%)
                      </span>
                    </>
                  )}
                </div>

                {/* Quantity */}
                <div className="mb-6">
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-2">
                    QUANTITY
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden bg-white dark:bg-dark-card shadow-sm">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-base font-bold dark:text-white cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="w-12 text-center font-bold text-base dark:text-white">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(stockCount > 0 ? stockCount : 10, quantity + 1))}
                        className="px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-base font-bold dark:text-white cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    {stockCount <= 10 && stockCount > 0 && (
                      <span className="text-red-500 text-xs font-bold animate-pulse">
                        Only {stockCount} left in stock!
                      </span>
                    )}
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex gap-3 mb-6">
                  <button
                    onClick={handleAddToCart}
                    disabled={!isBookInStock}
                    className={`flex-1 py-4 rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      added
                        ? "bg-emerald-600 text-white shadow-lg"
                        : !isBookInStock
                          ? "bg-gray-200 dark:bg-white/10 text-gray-400 cursor-not-allowed"
                          : "bg-emerald-800 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-900/20 active:scale-98"
                    }`}
                  >
                    {added ? (
                      <>
                        <FaCheck size={18} />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <CartIcon className="w-5 h-5 text-white" />
                        <span>Add to Cart (${(displayPrice * quantity).toFixed(2)})</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() =>
                      inWishlist
                        ? removeFromWishlist(book.id)
                        : addToWishlist(book)
                    }
                    aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                      inWishlist
                        ? "bg-red-500 text-white shadow-lg"
                        : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-red-50 hover:text-red-500 border border-gray-200 dark:border-white/10"
                    }`}
                  >
                    <WishlistIcon className={`w-6 h-6 ${inWishlist ? "fill-white" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Tabs Section */}
              <div className="border-t border-gray-100 dark:border-white/5 pt-4">
                <div className="flex border-b border-gray-100 dark:border-white/5">
                  {(["description", "details", "reviews"] as const).map(
                    (tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`cursor-pointer flex-1 py-3 text-xs sm:text-sm font-bold capitalize transition-all ${
                          activeTab === tab
                            ? "text-emerald-800 dark:text-emerald-400 border-b-2 border-emerald-800 dark:border-emerald-400 bg-emerald-50/50 dark:bg-white/5"
                            : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                        }`}
                      >
                        {tab === "reviews"
                          ? `Reviews (${displayReviewsCount.toLocaleString()})`
                          : tab}
                      </button>
                    ),
                  )}
                </div>

                <div className="py-4 max-h-56 overflow-y-auto pr-1 text-sm">
                  {activeTab === "description" && (
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {book.description || "No description provided for this book edition."}
                    </p>
                  )}

                  {activeTab === "details" && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { label: "Pages", value: (book.pages || 0).toLocaleString() },
                        { label: "Author", value: book.author || "Unknown" },
                        { label: "Published", value: (book.publishedYear || 2024).toString() },
                        { label: "Language", value: book.language || "English" },
                        { label: "ISBN", value: book.isbn || "N/A" },
                        { label: "Publisher", value: book.publisher || "N/A" },
                      ].map(({ label, value }) => (
                        <div
                          key={label}
                          className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5"
                        >
                          <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-0.5">
                            {label}
                          </p>
                          <p className="text-xs sm:text-sm font-bold text-gray-800 dark:text-white truncate">
                            {value}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "reviews" && (
                    <div className="space-y-4">
                      {/* Summary */}
                      <div className="bg-emerald-50/70 dark:bg-white/5 rounded-2xl p-4 flex items-center gap-6 border border-emerald-100 dark:border-white/5">
                        <div className="text-center">
                          <p className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
                            {displayRating}
                          </p>
                          <div className="flex justify-center my-1">
                            {[...Array(5)].map((_, i) => {
                              const isFull = i < Math.floor(currentAvgRating);
                              const isHalf =
                                i === Math.floor(currentAvgRating) &&
                                currentAvgRating % 1 !== 0;
                              return (
                                <div key={i} className="relative">
                                  <FaStar
                                    size={12}
                                    className="text-gray-300 dark:text-gray-700"
                                  />
                                  <div
                                    className="absolute inset-0 overflow-hidden text-emerald-400"
                                    style={{
                                      width: isFull
                                        ? "100%"
                                        : isHalf
                                          ? "50%"
                                          : "0%",
                                    }}
                                  >
                                    <FaStar
                                      size={12}
                                      className="fill-current"
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <p className="text-[11px] text-gray-500">
                            {displayReviewsCount.toLocaleString()} reviews
                          </p>
                        </div>
                        <div className="flex-1 space-y-1">
                          {starPercentages.map(({ star, pct }) => (
                            <div key={star} className="flex items-center gap-2">
                              <span className="text-xs text-gray-500 w-2">
                                {star}
                              </span>
                              <FaStar size={10} className="text-emerald-400" />
                              <div className="flex-1 h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                  style={{
                                    width: `${pct}%`,
                                  }}
                                />
                              </div>
                              <span className="text-[11px] text-gray-400 w-8 text-right">
                                {pct}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Review Form */}
                      {user ? (
                        <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                          <div className="flex items-center gap-3 mb-3">
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-8 h-8 rounded-full object-cover shadow-sm border border-gray-200 dark:border-white/10"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                                {user.name?.charAt(0) || 'U'}
                              </div>
                            )}
                            <div>
                              <h4 className="font-bold text-gray-900 dark:text-white text-sm">Write a Review</h4>
                              <p className="text-xs text-gray-400">Posting as {user.name}</p>
                            </div>
                          </div>
                          {reviewMessage && (
                            <div className="mb-3 p-2 bg-emerald-50 text-emerald-700 text-xs rounded-lg border border-emerald-200">
                              {reviewMessage}
                            </div>
                          )}
                          <form onSubmit={submitReview} className="space-y-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Rating:</span>
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                                    className="cursor-pointer p-0.5"
                                  >
                                    <FaStar
                                      size={16}
                                      className={star <= reviewForm.rating ? "text-emerald-400 fill-emerald-400" : "text-gray-300 dark:text-gray-600"}
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>
                            <textarea
                              value={reviewForm.comment}
                              onChange={e => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                              placeholder="What did you think about this book?"
                              required
                              className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                              rows={2}
                            />
                            <button
                              type="submit"
                              disabled={submittingReview}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors disabled:opacity-50 cursor-pointer"
                            >
                              {submittingReview ? "Submitting..." : "Submit Review"}
                            </button>
                          </form>
                        </div>
                      ) : (
                        <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl text-center text-xs text-gray-500 border border-gray-100 dark:border-white/5">
                          Sign in to submit your verified rating and review.
                        </div>
                      )}

                      {reviews.length === 0 ? (
                        <p className="text-gray-400 text-center py-3 text-xs">No customer reviews yet. Be the first to share your thoughts!</p>
                      ) : (
                        reviews.map((rev, i) => (
                          <div
                            key={i}
                            className="border-b border-gray-100 dark:border-white/5 pb-3 last:border-0"
                          >
                            <div className="flex items-start gap-3">
                              {rev.user?.avatar ? (
                                <img
                                  src={rev.user.avatar}
                                  alt={rev.user.name || "User"}
                                  className="w-8 h-8 rounded-full object-cover flex-shrink-0 shadow-sm border border-gray-200 dark:border-white/10"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = "none";
                                  }}
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold flex-shrink-0 text-xs">
                                  {rev.user?.name?.charAt(0) || 'U'}
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                  <div className="flex items-center gap-2">
                                    <p className="font-bold text-gray-900 dark:text-white text-xs">
                                      {rev.user?.name || 'Reader'}
                                    </p>
                                    <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded-full font-semibold">
                                      Verified
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-gray-400 dark:text-gray-500">
                                    {new Date(rev.created_at || Date.now()).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex my-1">
                                  {[...Array(5)].map((_, j) => (
                                    <FaStar
                                      key={j}
                                      size={10}
                                      className={
                                        j < rev.rating
                                          ? "text-emerald-400 fill-emerald-400"
                                          : "text-gray-200 dark:text-gray-700"
                                      }
                                    />
                                  ))}
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 text-xs mt-0.5">
                                  {rev.comment}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
