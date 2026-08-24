import { useState } from "react";
import {
  X as FaTimes,
  Minus as FaMinus,
  Plus as FaPlus,
  Trash2 as FaTrash,
  Tag as FaTag,
  Truck as FaTruck,
} from "lucide-react";
import { CartIcon } from "./NavIcons";
import { useStore } from "../context/StoreContext";
import { API_BASE } from "../config";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export function Cart({ isOpen, onClose, onCheckout }: CartProps) {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useStore();
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");

  const handlePromo = async () => {
    if (!promo.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/api/sales/coupons/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promo.trim(), cart_total: cartTotal }),
      });
      const data = await res.json();
      if (data.valid) {
        setPromoDiscount(data.discount_amount);
        setPromoApplied(true);
        setPromoError("");
      } else {
        const upper = promo.toUpperCase();
        if (upper === "BOOKWORM15") {
          setPromoDiscount(cartTotal * 0.15);
          setPromoApplied(true);
          setPromoError("");
        } else if (upper === "READER20") {
          setPromoDiscount(cartTotal * 0.2);
          setPromoApplied(true);
          setPromoError("");
        } else {
          setPromoError(data.message || "Invalid promo code");
          setPromoApplied(false);
          setPromoDiscount(0);
        }
      }
    } catch {
      const upper = promo.toUpperCase();
      if (upper === "BOOKWORM15") {
        setPromoDiscount(cartTotal * 0.15);
        setPromoApplied(true);
        setPromoError("");
      } else if (upper === "READER20") {
        setPromoDiscount(cartTotal * 0.2);
        setPromoApplied(true);
        setPromoError("");
      } else {
        setPromoError("Invalid promo code. Try BOOKWORM15 or READER20");
        setPromoApplied(false);
        setPromoDiscount(0);
      }
    }
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
        <div className="flex items-center justify-between p-6 border-b dark:border-white/5 bg-emerald-50 dark:bg-dark-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-800 rounded-xl flex items-center justify-center">
              <CartIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2
                className="text-xl font-bold text-gray-900 dark:text-white"
                style={{ fontFamily: "Merriweather, serif" }}
              >
                Your Cart
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {cart.length} item{cart.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white dark:bg-white/5 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:rotate-90 transition-all shadow-sm"
          >
            <FaTimes />
          </button>
        </div>

        {/* Free Shipping Bar */}
        {cart.length > 0 && cartTotal < 35 && (
          <div className="px-6 py-3 bg-emerald-50 dark:bg-emerald-900/10 border-b dark:border-white/5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm text-emerald-700 flex items-center gap-1 font-medium">
                <FaTruck size={12} /> Add ${(35 - cartTotal).toFixed(2)} for
                free shipping
              </span>
            </div>
            <div className="h-2 bg-emerald-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all"
                style={{ width: `${Math.min((cartTotal / 35) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
        {cart.length > 0 && cartTotal >= 35 && (
          <div className="px-6 py-2 bg-emerald-50 dark:bg-emerald-900/20 border-b dark:border-white/5 flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-sm font-medium">
            <FaTruck size={12} />  You qualify for free shipping!
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CartIcon className="w-12 h-12 text-emerald-300 dark:text-emerald-500/40" />
              </div>
              <h3
                className="text-xl font-bold text-gray-900 dark:text-white mb-2"
                style={{ fontFamily: "Merriweather, serif" }}
              >
                Your cart is empty
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                Discover thousands of books waiting for you.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-emerald-800 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all cursor-pointer"
              >
                Browse Books
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item, idx) => (
                <div
                  key={`${item.id}-${item.selectedFormat}-${idx}`}
                  className="flex gap-4 bg-gray-50 dark:bg-white/5 rounded-2xl p-4 group hover:bg-emerald-50 dark:hover:bg-white/10 transition-colors"
                >
                  <div className="w-20 h-28 flex-shrink-0 bg-white dark:bg-dark-bg rounded-xl overflow-hidden shadow-sm flex items-center justify-center p-2">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-auto object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <p className="text-xs text-emerald-700 font-semibold uppercase">
                          {item.selectedFormat}
                        </p>
                        <h4
                          className="font-bold text-gray-900 dark:text-gray-100 text-sm line-clamp-2 leading-snug"
                          style={{ fontFamily: "Merriweather, serif" }}
                        >
                          {item.title}
                        </h4>
                        <p className="text-xs text-gray-500">
                          by {item.author}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          removeFromCart(item.id, item.selectedFormat)
                        }
                        className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100 cursor-pointer"
                      >
                        <FaTrash size={13} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-dark-card overflow-hidden">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.selectedFormat,
                              item.quantity - 1,
                            )
                          }
                          className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors dark:text-gray-300 cursor-pointer"
                        >
                          <FaMinus size={10} />
                        </button>
                        <span className="w-8 text-center text-sm font-bold dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.selectedFormat,
                              item.quantity + 1,
                            )
                          }
                          className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors dark:text-gray-300 cursor-pointer"
                        >
                          <FaPlus size={10} />
                        </button>
                      </div>
                      <p className="font-black text-gray-900 dark:text-emerald-400">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t dark:border-white/5 p-6">
            {/* Promo */}
            <div className="mb-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <FaTag
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={13}
                  />
                  <input
                    type="text"
                    value={promo}
                    onChange={(e) => {
                      setPromo(e.target.value);
                      setPromoError("");
                    }}
                    placeholder="Promo code"
                    disabled={promoApplied}
                    className={`w-full pl-9 pr-3 py-3 border-2 rounded-xl text-sm focus:outline-none transition-all ${promoApplied ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20" : promoError ? "border-red-400" : "border-gray-200 dark:border-white/10 bg-white dark:bg-dark-card focus:border-emerald-500"}`}
                  />
                </div>
                <button
                  onClick={handlePromo}
                  disabled={promoApplied || !promo}
                  className={`px-5 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${promoApplied ? "bg-emerald-500 text-white" : "bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-40"}`}
                >
                  {promoApplied ? "Applied" : "Apply"}
                </button>
              </div>
              {promoApplied && (
                <p className="text-xs text-emerald-600 mt-1.5">
                  🎉 Discount applied! Saving ${promoDiscount.toFixed(2)}
                </p>
              )}
              {promoError && (
                <p className="text-xs text-red-500 mt-1.5">{promoError}</p>
              )}
            </div>

            {/* Summary */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                <span className="font-medium dark:text-white">${cartTotal.toFixed(2)}</span>
              </div>
              {promoApplied && (
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-600">Discount</span>
                  <span className="text-emerald-600 font-medium">
                    -${promoDiscount.toFixed(2)}
                  </span>
                </div>
              )}
              
            </div>

            <button
              onClick={onCheckout}
              className="w-full py-4 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center shadow-xl shadow-emerald-900/20 transition-all cursor-pointer"
            >
              Secure Checkout
            </button>
            <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-400">
              
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
