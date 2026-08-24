import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  X as FaTimes,
  User as FaUser,
  Mail as FaEnvelope,
  Lock as FaLock,
  LogOut as FaSignOutAlt,
  Heart as FaHeart,
  ChevronRight as FaChevronRight,
  PackageOpen as FaBoxOpen,
  CheckCircle2 as FaCheckCircle,
  Clock3 as FaClock,
  Eye as FaEye,
  EyeOff as FaEyeSlash,
  Edit2 as FaEdit,
} from "lucide-react";
import { useStore } from "../context/StoreContext";
import { useGoogleLogin } from "@react-oauth/google";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export type Tab = "profile" | "orders" | "wishlist";

/* ── Orders Tab ── */
export function OrdersTab() {
  const { orders, t } = useStore();
  const navigate = useNavigate();

  const statusMeta = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s.includes("deliver"))
      return {
        color:
          "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
        icon: FaCheckCircle,
      };
    if (s.includes("prepare") || s.includes("process"))
      return {
        color:
          "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20",
        icon: FaBoxOpen,
      };
    return {
      color:
        "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20",
      icon: FaClock,
    };
  };

  return (
    <div>
      <h3
        className="font-black text-gray-900 dark:text-white text-lg mb-4"
        style={{ fontFamily: "Merriweather, serif" }}
      >
        {t("orders")}
      </h3>

      {orders.length === 0 ? (
        <div className="text-center py-10 text-gray-400 dark:text-gray-500">
          <FaBoxOpen size={36} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm font-semibold">{t("noOrders")}</p>
          <p className="text-xs mt-1">{t("checkoutToSee")}</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-2">
          {orders.map((order) => {
            const { color, icon: Icon } = statusMeta(order.status);
            return (
              <div
                key={order.id}
                className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-4 transition-all hover:border-zinc-300 dark:hover:border-zinc-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-black text-zinc-900 dark:text-white text-sm">
                    {order.id.startsWith("#") ? order.id : `#${order.id}`}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${color}`}
                  >
                    <Icon size={10} /> {order.status}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mb-2">{order.date}</p>
                {/* Book covers */}
                {order.itemImages && order.itemImages.length > 0 && (
                  <div className="flex gap-2 mb-3">
                    {order.itemImages.slice(0, 4).map((b, i) => (
                      <div
                        key={i}
                        className="w-10 h-14 bg-white dark:bg-zinc-800 rounded-lg shadow-sm overflow-hidden flex items-center justify-center p-0.5 flex-shrink-0 border border-zinc-200 dark:border-zinc-700"
                      >
                        <img
                          src={b.image}
                          alt={b.title}
                          className="h-full w-auto object-contain"
                        />
                      </div>
                    ))}
                    {order.itemImages.length > 4 && (
                      <div className="w-10 h-14 bg-zinc-200 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-xs font-bold text-zinc-700 dark:text-zinc-300 flex-shrink-0">
                        +{order.itemImages.length - 4}
                      </div>
                    )}
                  </div>
                )}
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3 line-clamp-1">
                  {order.items.join(", ")}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-zinc-200/60 dark:border-zinc-800">
                  <span className="font-black text-zinc-900 dark:text-white font-mono">
                    {order.total}
                  </span>
                  <button 
                    onClick={() => {
                      navigate(`/track-order?orderId=${encodeURIComponent(order.id)}`);
                    }}
                    className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    Track Order <FaChevronRight size={10} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Wishlist Tab ── */
export function WishlistTab() {
  const { wishlist, removeFromWishlist, t } = useStore();

  if (wishlist.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400 dark:text-gray-500">
        <FaHeart size={36} className="mx-auto mb-3 opacity-40" />
        <p className="text-sm font-semibold">{t("wishlistEmpty")}</p>
        <p className="text-xs mt-1">{t("saveBooks")}</p>
      </div>
    );
  }

  return (
    <div>
      <h3
        className="font-black text-gray-900 dark:text-white text-lg mb-4"
        style={{ fontFamily: "Merriweather, serif" }}
      >
        {t("wishlist")}{" "}
        <span className="text-emerald-600 dark:text-emerald-400">
          ({wishlist.length})
        </span>
      </h3>

      {/* Make wishlist scrollable with a fixed max height similar to orders */}
      <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-2">
        {wishlist.map((book) => (
          <div
            key={book.id}
            className="flex gap-3 bg-emerald-50 dark:bg-white/5 border border-emerald-100 dark:border-white/5 rounded-2xl p-3"
          >
            <img
              src={book.image}
              alt={book.title}
              className="w-12 h-16 object-cover rounded-lg flex-shrink-0"
            />
            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
              <div>
                <p className="font-bold text-gray-900 dark:text-white text-sm leading-tight line-clamp-2">
                  {book.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                  {book.author}
                </p>
              </div>
              <p className="text-emerald-700 dark:text-emerald-400 font-black text-sm">
                ${book.price}
              </p>
            </div>
            <div className="flex flex-col justify-end flex-shrink-0 pb-0.5">
              <button
                onClick={() => removeFromWishlist(book.id)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 transition-colors"
                title="Remove"
              >
                <FaTimes size={11} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Library Tab ── */
// Library tab removed per UI simplification

/* ── Profile Tab ── */
export function ProfileTab({
  user,
  onLogout,
}: {
  user: { name: string; email: string; avatar?: string };
  onLogout: () => void;
}) {
  const { orders, wishlist, t, updateProfile } = useStore();
  const [uploading, setUploading] = useState(false);

  // library removed; only show orders and wishlist counts

  return (
    <div>
      <div className="text-center mb-6">
        <div className="relative inline-block mx-auto mb-3">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full shadow-lg object-cover" />
          ) : (
            <div className="w-20 h-20 bg-emerald-800 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-3xl font-black text-white">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <label className="absolute bottom-0 right-0 bg-white dark:bg-dark-bg text-emerald-700 dark:text-emerald-400 p-1.5 rounded-full shadow-md cursor-pointer hover:scale-110 transition-transform">
            {uploading ? (
               <div className="w-3.5 h-3.5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            ) : (
               <FaEdit size={12} />
            )}
            <input 
              type="file" 
              className="hidden" 
              accept="image/*"
              disabled={uploading}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setUploading(true);
                  const reader = new FileReader();
                  reader.onload = async (ev) => {
                    if (ev.target?.result) {
                      try {
                        await updateProfile({ avatar: ev.target.result as string });
                      } catch (err) {
                        console.error('Failed to upload avatar', err);
                      } finally {
                        setUploading(false);
                      }
                    }
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </label>
        </div>
        <h2
          className="text-xl font-black text-gray-900 dark:text-white"
          style={{ fontFamily: "Merriweather, serif" }}
        >
          {user.name}
        </h2>
        <p className="text-gray-400 dark:text-gray-500 text-sm">{user.email}</p>
      </div>
      <div className="bg-emerald-50 dark:bg-white/5 rounded-2xl p-4 mb-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white dark:bg-dark-bg rounded-xl shadow-sm flex items-center justify-center">
            <FaUser className="text-emerald-700 dark:text-emerald-400" size={13} />
          </div>
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {t("name")}
            </p>
            <p className="font-bold text-gray-900 dark:text-white text-sm">
              {user.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white dark:bg-dark-bg rounded-xl shadow-sm flex items-center justify-center">
            <FaEnvelope
              className="text-emerald-700 dark:text-emerald-400"
              size={13}
            />
          </div>
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {t("email")}
            </p>
            <p className="font-bold text-gray-900 dark:text-white text-sm">
              {user.email}
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-5 text-center">
        {[
          { label: t("orders"), value: orders.length },
          { label: t("wishlist"), value: wishlist.length },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-emerald-50 dark:bg-white/5 rounded-xl py-3"
          >
            <p className="text-xl font-black text-emerald-800 dark:text-emerald-400">
              {s.value}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {s.label}
            </p>
          </div>
        ))}
      </div>
      <button
        onClick={onLogout}
        className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all cursor-pointer"
      >
        <FaSignOutAlt /> {t("signOut")}
      </button>
    </div>
  );
}

/* ── Main Modal ── */
export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { user, login, googleAuth, authError, t } = useStore();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    agreedTerms: "",
  });

  const isEmailValid = (value: string) => /^\S+@\S+\.\S+$/.test(value);
  
  const hasUpper = /[A-Z]/.test(form.password);
  const hasLower = /[a-z]/.test(form.password);
  const hasNumber = /[0-9]/.test(form.password);
  const hasSymbol = /[^A-Za-z0-9]/.test(form.password);
  const hasMinLength = form.password.length >= 8;
  const isPasswordStrong = hasUpper && hasLower && hasNumber && hasSymbol && hasMinLength;

  const passwordStrength = (value: string) => {
    if (!value) return "";
    let score = 0;
    if (hasMinLength) score++;
    if (hasUpper) score++;
    if (hasLower) score++;
    if (hasNumber) score++;
    if (hasSymbol) score++;
    if (score <= 2) return "Weak";
    if (score <= 4) return "Good";
    return "Strong";
  };

  const validateForm = () => {
    const nextErrors = {
      name: "",
      email: "",
      password: "",
      confirm: "",
      agreedTerms: "",
    };

    if (!form.email || !isEmailValid(form.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (isLogin) {
      if (!form.password || form.password.length < 6) {
        nextErrors.password = "Password must be at least 6 characters.";
      }
    } else {
      if (!form.name.trim()) {
        nextErrors.name = "Provide your full name.";
      }
      if (!isPasswordStrong) {
        nextErrors.password = "Password must include uppercase, lowercase, number, and symbol (min 8 characters).";
      }
      if (form.password !== form.confirm) {
        nextErrors.confirm = "Passwords do not match.";
      }
      if (!agreedTerms) {
        nextErrors.agreedTerms = "You must agree to the terms.";
      }
    }

    setErrors(nextErrors);
    return Object.values(nextErrors).every((value) => !value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await login(form.email, form.password, form.name, !isLogin);
      onClose();
      navigate('/profile');
    } catch (err) {
      // Error is handled in context and surfaced via authError
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }).then(res => res.json());
        
        let pictureUrl = userInfo.picture;
        if (pictureUrl && (pictureUrl.includes('default-user') || pictureUrl.includes('silhouette'))) {
          pictureUrl = undefined;
        }
        
        await googleAuth(userInfo.email, userInfo.name, pictureUrl);
        
        onClose();
        navigate('/profile');
      } catch (err) {
        console.error('Google login failed', err);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleSocialLogin = (provider: string) => {
    if (provider === 'Google') {
       googleLogin();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative min-h-screen flex items-center justify-center p-4">
        {/* Changed layout wrapper to max-w-2xl to give the form fields and layout premium spacing */}
        <div className="relative bg-white dark:bg-dark-bg rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden animate-fadeIn border dark:border-white/5">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-100 dark:bg-white/10 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/20 hover:rotate-90 transition-all cursor-pointer"
          >
            <FaTimes />
          </button>

          {!user && (
            <div>
              {/* Header */}
              <div className="px-8 pt-10 pb-4 text-center">
                {/* Changed layout box size from w-24 h-24 to a larger, crisp configuration (w-36 h-32) to showcase the intricate royal detail and make the Khmer text perfectly clear */}
                <div className="mx-auto mb-3 w-36 h-32 flex items-center justify-center">
                  <img
                    src="/logo.png"
                    alt="KhmerBookStore logo"
                    className="w-full h-full object-contain scale-110 drop-shadow-sm"
                  />
                </div>
                <h2
                  className="text-2xl font-black text-gray-900 dark:text-white"
                  style={{ fontFamily: "Merriweather, serif" }}
                >
                  {isLogin ? t("signInTo") : t("createAccount")}
                </h2>
                <p className="text-sm mt-1.5 text-gray-500 dark:text-gray-400">
                  {isLogin ? t("authHintSignIn") : t("authHintSignUp")}
                </p>
              </div>

              {/* Form Content Wrapper */}
              <div className="px-10 pb-10 pt-4">
                {/* Social Login Buttons */}
                <div className="space-y-3 mb-6">
                  <button
                    type="button"
                    onClick={() => handleSocialLogin("Google")}
                    disabled={loading}
                    className="w-full py-3.5 border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-dark-card rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-white/5 hover:border-gray-300 transition-all text-sm dark:text-white cursor-pointer disabled:opacity-50"
                  >
                    <img
                      src="https://www.svgrepo.com/show/303108/google-icon-logo.svg"
                      alt="Google logo"
                      className="w-5 h-5 object-contain"
                    />
                    {t("continueWithGoogle")}
                  </button>
                </div>

                {/* Divider */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-gray-100 dark:border-white/5" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 bg-white dark:bg-dark-bg text-gray-400 dark:text-gray-500 text-xs font-medium uppercase tracking-wider">
                      {t("orWithEmail")}
                    </span>
                  </div>
                </div>

                {/* Email/Password Form */}
                {authError && (
                  <div className="mb-5 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-sm font-bold flex items-center justify-center gap-2.5 shadow-xs">
                    <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-950/60 flex items-center justify-center shrink-0">
                      <FaTimes size={11} className="text-red-600 dark:text-red-400" />
                    </div>
                    <span>{authError}</span>
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <div>
                      <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                        {t("fullName")}
                      </label>
                      <div className="relative">
                        <FaUser
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                          size={13}
                        />
                        <input
                          type="text"
                          placeholder="Your Full Name"
                          value={form.name}
                          required
                          onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                          }
                          className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-dark-card rounded-xl focus:outline-none focus:border-emerald-500 transition-colors text-sm dark:text-white"
                        />
                      </div>
                      {errors.name && (
                        <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                          {errors.name}
                        </p>
                      )}
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                      {t("emailAddress")}
                    </label>
                    <div className="relative">
                      <FaEnvelope
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={13}
                      />
                      <input
                        type="email"
                        placeholder="Your Email"
                        value={form.email}
                        required
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        className={`w-full pl-11 pr-4 py-3.5 border-2 ${
                          isLogin && (authError === "Invalid email" || authError === "Invalid email and password")
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-200 dark:border-white/10 focus:border-emerald-500"
                        } bg-white dark:bg-dark-card rounded-xl focus:outline-none transition-colors text-sm dark:text-white`}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                        {t("password")}
                      </label>
                      {isLogin && (
                        <button
                          type="button"
                          className="text-xs text-emerald-700 dark:text-emerald-500 hover:underline font-semibold"
                        >
                          {t("forgotPassword")}
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <FaLock
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={13}
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder={
                          isLogin ? "Enter your password" : "Min. 8 characters with upper, lower, number, symbol"
                        }
                        value={form.password}
                        required
                        onChange={(e) =>
                          setForm({ ...form, password: e.target.value })
                        }
                        className={`w-full pl-11 pr-12 py-3.5 border-2 ${
                          isLogin && (authError === "Invalid password" || authError === "Invalid email and password")
                            ? "border-red-500 focus:border-red-500"
                            : !isLogin && form.password
                            ? isPasswordStrong
                              ? "border-emerald-500 focus:border-emerald-500"
                              : "border-amber-400 focus:border-amber-400"
                            : "border-gray-200 dark:border-white/10 focus:border-emerald-500"
                        } bg-white dark:bg-dark-card rounded-xl focus:outline-none transition-colors text-sm dark:text-white`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? (
                          <FaEyeSlash size={15} />
                        ) : (
                          <FaEye size={15} />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                        {errors.password}
                      </p>
                    )}

                    {/* Register Password Requirement Checklist */}
                    {!isLogin && (
                      <div className="mt-2.5 space-y-2 p-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-gray-700 dark:text-gray-300">Password Requirements:</span>
                          {form.password && (
                            <span className={`font-bold ${
                              isPasswordStrong ? "text-emerald-700 dark:text-emerald-400" : "text-amber-500"
                            }`}>
                              Strength: {passwordStrength(form.password)}
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                          <div className={`flex items-center gap-1 font-medium ${hasUpper ? "text-emerald-700 dark:text-emerald-400" : "text-gray-400"}`}>
                            {hasUpper ? <FaCheckCircle size={11} /> : <span className="w-2.5 h-2.5 rounded-full border border-gray-300 inline-block" />}
                            Uppercase (A-Z)
                          </div>
                          <div className={`flex items-center gap-1 font-medium ${hasLower ? "text-emerald-700 dark:text-emerald-400" : "text-gray-400"}`}>
                            {hasLower ? <FaCheckCircle size={11} /> : <span className="w-2.5 h-2.5 rounded-full border border-gray-300 inline-block" />}
                            Lowercase (a-z)
                          </div>
                          <div className={`flex items-center gap-1 font-medium ${hasNumber ? "text-emerald-700 dark:text-emerald-400" : "text-gray-400"}`}>
                            {hasNumber ? <FaCheckCircle size={11} /> : <span className="w-2.5 h-2.5 rounded-full border border-gray-300 inline-block" />}
                            Number (0-9)
                          </div>
                          <div className={`flex items-center gap-1 font-medium ${hasSymbol ? "text-emerald-700 dark:text-emerald-400" : "text-gray-400"}`}>
                            {hasSymbol ? <FaCheckCircle size={11} /> : <span className="w-2.5 h-2.5 rounded-full border border-gray-300 inline-block" />}
                            Symbol (!@#$...)
                          </div>
                          <div className={`col-span-2 flex items-center gap-1 font-medium ${hasMinLength ? "text-emerald-700 dark:text-emerald-400" : "text-gray-400"}`}>
                            {hasMinLength ? <FaCheckCircle size={11} /> : <span className="w-2.5 h-2.5 rounded-full border border-gray-300 inline-block" />}
                            Minimum 8 characters
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {isLogin && (
                    <div className="flex items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 accent-emerald-700"
                        />
                        Remember me
                      </label>
                    </div>
                  )}
                  {!isLogin && (
                    <>
                      <div>
                        {/* Confirm Password Label & Matching Status */}
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                            {t("confirmPassword")}
                          </label>
                          {form.confirm.length > 0 && (
                            <span className={`text-xs font-bold flex items-center gap-1 ${
                              form.password === form.confirm
                                ? "text-emerald-700 dark:text-emerald-400"
                                : "text-red-500"
                            }`}>
                              {form.password === form.confirm ? (
                                <>
                                  <FaCheckCircle size={13} className="text-emerald-700 dark:text-emerald-400" /> Passwords match
                                </>
                              ) : (
                                <>
                                  <FaTimes size={13} className="text-red-500" /> Passwords do not match
                                </>
                              )}
                            </span>
                          )}
                        </div>
                        <div className="relative">
                          <FaLock
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            size={13}
                          />
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Re-enter your password"
                            value={form.confirm}
                            required
                            onChange={(e) =>
                              setForm({ ...form, confirm: e.target.value })
                            }
                            className={`w-full pl-11 pr-12 py-3.5 border-2 ${
                              form.confirm.length === 0
                                ? "border-gray-200 dark:border-white/10 focus:border-emerald-500"
                                : form.password === form.confirm
                                ? "border-emerald-500 focus:border-emerald-500"
                                : "border-red-500 focus:border-red-500"
                            } bg-white dark:bg-dark-card rounded-xl focus:outline-none transition-colors text-sm dark:text-white`}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showConfirmPassword ? (
                              <FaEyeSlash size={15} />
                            ) : (
                              <FaEye size={15} />
                            )}
                          </button>
                        </div>
                        {errors.confirm && (
                          <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                            {errors.confirm}
                          </p>
                        )}
                      </div>
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={agreedTerms}
                          onChange={(e) => setAgreedTerms(e.target.checked)}
                          className="w-4 h-4 accent-emerald-700 mt-0.5 flex-shrink-0"
                        />
                        <span className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                          {t("agreeTo")}{" "}
                          <span className="text-emerald-700 dark:text-emerald-500 font-semibold hover:underline">
                            {t("terms")}
                          </span>{" "}
                          {t("and")}{" "}
                          <span className="text-emerald-700 dark:text-emerald-500 font-semibold hover:underline">
                            {t("privacy")}
                          </span>
                        </span>
                      </label>
                      {errors.agreedTerms && (
                        <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                          {errors.agreedTerms}
                        </p>
                      )}
                    </>
                  )}

                  <button
                    type="submit"
                    disabled={loading || (!isLogin && (!agreedTerms || !isPasswordStrong || form.password !== form.confirm))}
                    className="w-full py-4 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                        Please wait...
                      </>
                    ) : isLogin ? (
                      t("signIn")
                    ) : (
                      t("createAccount")
                    )}
                  </button>
                </form>

                {/* Toggle Login/Register */}
                <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-6">
                  {isLogin
                    ? t("dontHaveAccount") + " "
                    : t("alreadyMember") + " "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setForm({
                        name: "",
                        email: "",
                        password: "",
                        confirm: "",
                      });
                      setShowPassword(false);
                      setShowConfirmPassword(false);
                      setAgreedTerms(false);
                    }}
                    className="text-emerald-700 dark:text-emerald-500 font-bold hover:underline"
                  >
                    {isLogin ? t("signUp") : t("signIn")}
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
