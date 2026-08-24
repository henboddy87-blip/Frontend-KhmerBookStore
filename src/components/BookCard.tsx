import { useState, useEffect } from "react";
import {
  Star as FaStar,
  Flame as FaFire,
  Zap,
} from "lucide-react";
import { WishlistIcon } from "./NavIcons";
import { Book } from "../types";
import { useStore } from "../context/StoreContext";
import { useSales } from "../context/SalesContext";
import { OptimizedImage } from "./OptimizedImage";

interface BookCardProps {
  book: Book;
  onBookClick: (book: Book) => void;
}

export function BookCard({ book, onBookClick }: BookCardProps) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } =
    useStore();
  const { getBookDiscount } = useSales();
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const inWishlist = isInWishlist(book.id);
  const [liked, setLiked] = useState<boolean>(inWishlist);

  // Check if book has an active discount or flash sale
  const activeDiscount = getBookDiscount(book);
  const displayPrice = Number(activeDiscount ? activeDiscount.salePrice : book.price) || 0;
  const originalPrice = Number(
    activeDiscount
      ? activeDiscount.originalPrice
      : (book.originalPrice ?? (book as any).original_price ?? book.price)
  ) || 0;
  const discountPercent = activeDiscount
    ? activeDiscount.discountPercent
    : originalPrice > displayPrice
    ? Math.round((1 - displayPrice / originalPrice) * 100)
    : 0;
  const isBookInStock = (book.inStock ?? (book as any).in_stock ?? true);

  // Keep local liked state in sync with store
  useEffect(() => {
    setLiked(inWishlist);
  }, [inWishlist]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({ ...book, price: displayPrice }, book.format);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(book.id);
      setLiked(false);
    } else {
      addToWishlist(book);
      setLiked(true);
    }
    // quick visual pulse
    setTimeout(() => {
      setLiked((v) => v);
    }, 250);
  };

  return (
    <div className="card-3d">
      <div
        onClick={() => onBookClick(book)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="card-3d-inner group bg-white dark:bg-dark-card rounded-2xl overflow-hidden border border-gray-100 dark:border-white/5 flex flex-col cursor-pointer shadow-sm"
      >
      {/* Cover */}
      <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 aspect-[3/4] overflow-hidden flex items-center justify-center p-4">
        <OptimizedImage
          src={book.image}
          alt={book.title}
          className={`h-full w-auto max-w-full object-contain drop-shadow-xl cover-glow transition-all duration-500 ${hovered ? 'scale-105' : 'scale-100'}`}
          wrapperClassName="h-full w-full"
        />

        {/* Badges strictly from Admin flags & Sales promotions */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {activeDiscount?.isFlashSale && (
            <span className="badge-bounce px-2.5 py-0.5 bg-gradient-to-r from-red-500 to-rose-600 text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-lg shadow-red-500/30 flex items-center gap-1 border border-white/20 backdrop-blur-md">
              <Zap size={10} className="fill-current text-yellow-200" /> -{discountPercent}%
            </span>
          )}
          {!activeDiscount?.isFlashSale && activeDiscount && (
            <span className="badge-bounce px-2.5 py-0.5 bg-gradient-to-r from-red-500 to-rose-600 text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-lg shadow-red-500/30 border border-white/20 backdrop-blur-md">
              -{discountPercent}% OFF
            </span>
          )}
          {(book.isNew || (book as any).is_new) && (
            <span className="badge-bounce px-2.5 py-0.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-lg shadow-amber-500/30 border border-white/20 backdrop-blur-md">
              NEW
            </span>
          )}
          {(book.isBestseller || (book as any).is_bestseller) && (
            <span className="badge-bounce px-2.5 py-0.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-lg shadow-orange-500/30 flex items-center gap-1 border border-white/20 backdrop-blur-md">
              <FaFire size={10} className="text-yellow-200" /> BEST
            </span>
          )}
          {(book.isTopRated || (book as any).is_top_rated) && (
            <span className="badge-bounce px-2.5 py-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-lg shadow-indigo-500/30 flex items-center gap-1 border border-white/20 backdrop-blur-md">
              <FaStar size={10} className="text-purple-200" /> TOP
            </span>
          )}
          {(book.isSpecialOffer || (book as any).is_special_offer) && (
            <span className="badge-bounce px-2.5 py-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-lg shadow-blue-500/30 border border-white/20 backdrop-blur-md">
              SPECIAL
            </span>
          )}
          {!activeDiscount && (book.isSale || (book as any).is_sale) && (
            <span className="badge-bounce px-2.5 py-0.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-lg shadow-pink-500/30 border border-white/20 backdrop-blur-md">
              {discountPercent > 0 ? `-${discountPercent}%` : 'SALE'}
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          type="button"
          onClick={handleWishlist}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all z-10 shadow-md ${
            liked
              ? "bg-red-500 text-white scale-105"
              : "bg-white/90 dark:bg-dark-card/90 text-gray-500 dark:text-gray-400 hover:text-red-500 hover:scale-110"
          }`}
          aria-pressed={liked}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
        >
          <WishlistIcon className={`w-4 h-4 ${liked ? "fill-white" : ""}`} />
        </button>

        {/* Format badge */}
        <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/60 text-white text-xs rounded-lg backdrop-blur-sm">
          {book.format}
        </div>

        {/* Hover Overlay */}
        <div
          className={`absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3 p-4 transition-all duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}
        >
          <button
            type="button"
            onClick={handleAddToCart}
            className={`cursor-pointer w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center shadow-lg transition-all ${
              added
                ? "bg-emerald-500 text-white"
                : "bg-white dark:bg-emerald-600 text-gray-900 dark:text-white hover:bg-emerald-50 dark:hover:bg-emerald-500"
            }`}
            aria-label={added ? "Added to cart" : "Add to cart"}
          >
            {added ? "Added ✓" : "Add to Cart"}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onBookClick(book);
            }}
            className="cursor-pointer w-full py-2.5 rounded-xl border-2 border-white text-white font-semibold text-sm flex items-center justify-center hover:bg-white/20 transition-all"
            aria-label="Open quick view"
          >
            Quick View
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-emerald-700 dark:text-emerald-500 font-semibold uppercase tracking-wide mb-1">
          {book.genre}
        </p>
        <h3
          className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 text-sm leading-snug mb-1"
          style={{ fontFamily: "Merriweather, serif" }}
        >
          {book.title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 truncate">
          by {book.author}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => {
              const isFull = i < Math.floor(book.rating);
              const isHalf =
                i === Math.floor(book.rating) && book.rating % 1 !== 0;
              return (
                <div key={i} className="relative">
                  {/* Background Star (Muted) */}
                  <FaStar
                    size={11}
                    className="text-gray-200 dark:text-gray-700"
                  />
                  {/* Foreground Star (Filled) */}
                  <div
                    className="absolute inset-0 overflow-hidden text-emerald-400"
                    style={{ width: isFull ? "100%" : isHalf ? "50%" : "0%" }}
                  >
                    <FaStar size={11} className="fill-current" />
                  </div>
                </div>
              );
            })}
          </div>
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            {book.rating ? book.rating.toFixed(1) : "0.0"}
          </span>
          <span className="text-xs text-gray-400">
            ({(book.reviews || 0).toLocaleString()})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <span
              className={`text-lg font-black ${
                activeDiscount?.isFlashSale
                  ? "text-red-600 dark:text-red-400"
                  : "text-gray-900 dark:text-emerald-400"
              }`}
            >
              ${displayPrice.toFixed(2)}
            </span>
            {originalPrice && originalPrice > displayPrice && (
              <span className="text-xs text-gray-400 line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          {isBookInStock ? (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              In Stock
            </span>
          ) : (
            <span className="text-xs text-red-500 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
              Out of Stock
            </span>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
