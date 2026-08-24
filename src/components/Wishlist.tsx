import {
  X as FaTimes,
  Trash2 as FaTrash,
} from "lucide-react";
import { WishlistIcon, CartIcon } from "./NavIcons";
import { useStore } from "../context/StoreContext";
import { Book } from "../types";

interface WishlistProps {
  isOpen: boolean;
  onClose: () => void;
  onBookClick: (book: Book) => void;
}

export function Wishlist({ isOpen, onClose, onBookClick }: WishlistProps) {
  const { wishlist, removeFromWishlist, addToCart } = useStore();

  const handleAddToCart = (book: Book) => {
    addToCart(book, book.format);
    removeFromWishlist(book.id);
  };

  const handleAddAllToCart = () => {
    wishlist.forEach((b) => {
      addToCart(b, b.format);
      removeFromWishlist(b.id);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] overflow-hidden">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-dark-bg shadow-2xl flex flex-col animate-slideInRight">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b dark:border-white/5 bg-red-50 dark:bg-dark-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
              <WishlistIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2
                className="text-xl font-bold text-gray-900 dark:text-white"
                style={{ fontFamily: "Merriweather, serif" }}
              >
                My Wishlist
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {wishlist.length} saved book{wishlist.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white dark:bg-white/10 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/20 hover:rotate-90 transition-all shadow-sm cursor-pointer"
          >
            <FaTimes />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {wishlist.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-red-50 dark:bg-red-900/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <WishlistIcon className="w-12 h-12 text-red-200 dark:text-red-400/30" />
              </div>
              <h3
                className="text-xl font-bold text-gray-900 dark:text-white mb-2"
                style={{ fontFamily: "Merriweather, serif" }}
              >
                Your wishlist is empty
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                Save books you love to read them later.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all cursor-pointer"
              >
                Discover Books
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {wishlist.map((book) => (
                  <div
                    key={book.id}
                    className="flex gap-4 bg-gray-50 dark:bg-white/5 rounded-2xl p-4 group hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                  >
                  <div
                    className="w-20 h-28 flex-shrink-0 bg-white dark:bg-dark-bg rounded-xl overflow-hidden shadow-sm flex items-center justify-center p-2 cursor-pointer"
                    onClick={() => {
                      onBookClick(book);
                      onClose();
                    }}
                  >
                    <img
                      src={book.image}
                      alt={book.title}
                      className="h-full w-auto object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div
                        className="cursor-pointer flex-1"
                        onClick={() => {
                          onBookClick(book);
                          onClose();
                        }}
                      >
                        <p className="text-xs text-emerald-700 font-semibold uppercase">
                          {book.genre}
                        </p>
                        <h4
                          className="font-bold text-gray-900 dark:text-white text-sm line-clamp-2 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          style={{ fontFamily: "Merriweather, serif" }}
                        >
                          {book.title}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          by {book.author}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromWishlist(book.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0 cursor-pointer"
                      >
                        <FaTrash size={20} />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-lg font-black text-gray-900 dark:text-emerald-400">
                        ${book.price.toFixed(2)}
                      </span>
                      {book.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          ${book.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddToCart(book)}
                      className="mt-3 w-full py-2.5 bg-emerald-800 text-white text-xs rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CartIcon className="w-3.5 h-3.5" /> Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {wishlist.length > 0 && (
          <div className="border-t dark:border-white/5 p-6">
            <button
              onClick={handleAddAllToCart}
              className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg cursor-pointer"
            >
              <CartIcon className="w-5 h-5" /> Add All to Cart ({wishlist.length} books)
            </button>
            <p className="text-center text-xs text-gray-400 mt-3">
              Items will be moved from wishlist to cart
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
