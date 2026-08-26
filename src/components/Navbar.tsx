import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Search as FaSearch,
  Menu as FaBars,
  X as FaTimes,
  Star as FaStar,
  Sun as FaSun,
  Moon as FaMoon,
} from "lucide-react";
import { WishlistIcon, CartIcon, AccountIcon } from "./NavIcons";
import { useStore } from "../context/StoreContext";
import { Book } from "../types";
import { TranslationKey } from "../data/translations";

interface NavbarProps {
  onCartClick: () => void;
  onWishlistClick: () => void;
  onAuthClick: () => void;
  onSearch: (query: string) => void;
}

const navCategories: { id: string; label: TranslationKey }[] = [
  { id: "all", label: "allBooks" },
  { id: "khmer-literature", label: "khmerLiterature" },
  { id: "fiction", label: "fiction" },
  { id: "non-fiction", label: "nonFiction" },
  { id: "selfHelp", label: "selfHelp" },
  { id: "biography", label: "biography" },
  { id: "children", label: "children" },
  { id: "health", label: "health" },
];

export function Navbar({
  onCartClick,
  onWishlistClick,
  onAuthClick,
  onSearch,
}: NavbarProps) {
  const {
    cartCount,
    wishlist,
    user,
    language,
    setLanguage,
    t,
    books,
    isDarkMode,
    toggleDarkMode,
  } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [compactDetail, setCompactDetail] = useState(false);
  const [cartShake, setCartShake] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Shake cart icon when items change
  useEffect(() => {
    if (cartCount > 0) {
      setCartShake(true);
      const timer = setTimeout(() => setCartShake(false), 600);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  // Close dropdowns on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;

      // Search outside check
      const insideDesktopSearch = searchRef.current?.contains(target);
      const insideMobileSearch = mobileSearchRef.current?.contains(target);
      if (!insideDesktopSearch && !insideMobileSearch) {
        setShowDropdown(false);
      }

      // Language menu outside check
      const insideLangMenu = langMenuRef.current?.contains(target);
      if (!insideLangMenu) {
        setShowLanguageMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Observe BookDetail open/close via body class
  useEffect(() => {
    setCompactDetail(
      typeof document !== "undefined" &&
        document.body.classList.contains("book-detail-open"),
    );
    const obs = new MutationObserver(() => {
      setCompactDetail(document.body.classList.contains("book-detail-open"));
    });
    obs.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);

  // Search suggestions
  const searchResults = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase();
    return books
      .filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.genre.toLowerCase().includes(q),
      )
      .slice(0, 8);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    setShowDropdown(false);
  };

  const handleSearchInput = (val: string) => {
    setSearchQuery(val);
    setShowDropdown(val.length >= 2);
  };

  const handleResultClick = (book: Book) => {
    setSearchQuery(book.title);
    onSearch(book.title);
    setShowDropdown(false);
  };

  const handleHomeClick = () => {
    navigate("/");
    setMobileOpen(false);
  };

  const catSlug = (catId: string) => {
    const slugMap: Record<string, string> = { selfHelp: "self-help" };
    return slugMap[catId] ?? catId;
  };

  const isCatActive = (catId: string): boolean => {
    if (isHome) return false;
    if (catId === "all") return location.pathname === "/books";
    return location.pathname === `/genre/${catSlug(catId)}`;
  };

  const handleCatClick = (catId: string) => {
    navigate(catId === "all" ? "/books" : `/genre/${catSlug(catId)}`);
    setMobileOpen(false);
  };

  /* ── Search Dropdown Renderer ── */
  const SearchDropdown = () => {
    if (!showDropdown || searchResults.length === 0) return null;
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-dark-card rounded-2xl shadow-2xl border border-gray-100 dark:border-white/5 overflow-hidden z-50 animate-fadeIn">
        <div className="px-4 py-2.5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
            Suggestions
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {searchResults.map((book) => (
            <button
              key={book.id}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleResultClick(book)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-emerald-50 dark:hover:bg-white/5 transition-colors text-left"
            >
              <div className="w-10 h-14 flex-shrink-0 bg-gray-100 dark:bg-white/5 rounded-lg overflow-hidden flex items-center justify-center p-0.5">
                <img
                  src={book.image}
                  alt={book.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-auto object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                  {book.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  by {book.author}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-emerald-700 dark:text-emerald-500 font-semibold">
                    ${book.price.toFixed(2)}
                  </span>
                  <div className="flex items-center gap-0.5">
                    <FaStar size={9} className="text-emerald-400" />
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {book.rating}
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-full flex-shrink-0">
                {book.genre}
              </span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            onSearch(searchQuery);
            setShowDropdown(false);
          }}
          className="w-full px-4 py-3 text-sm font-semibold text-emerald-800 dark:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-white/5 transition-colors border-t border-gray-100 dark:border-white/5 flex items-center justify-center gap-2"
        >
          <FaSearch size={12} />
          View all results for &ldquo;{searchQuery}&rdquo;
        </button>
      </div>
    );
  };

  return (
    <>
      {/* Main Nav */}
      <nav
        className={`sticky top-0 z-[110] transition-all duration-300 ${isScrolled ? "bg-white/95 dark:bg-dark-bg/95 backdrop-blur-md shadow-md" : "bg-white dark:bg-dark-bg shadow-sm"}`}
      >
        <div className="max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-8">
          <div
            className={`flex items-center justify-between gap-2 sm:gap-4 ${compactDetail ? "py-1.5" : "py-2.5 sm:py-3"}`}
          >
            {/* Logo + Desktop Nav links */}
            <div className="flex min-w-0 items-center gap-3 lg:gap-4 xl:gap-5 flex-shrink-0">
              {/* Logo */}
              <button
                type="button"
                onClick={handleHomeClick}
                aria-label="Go to homepage"
                className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 cursor-pointer"
              >
                <div
                  className={`h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 ${compactDetail ? "h-9 w-9 sm:h-11 sm:w-11" : ""} flex items-center justify-center flex-shrink-0`}
                >
                  <img
                    src="/logo.png"
                    alt="KhmerBookStore Logo"
                    className="w-full h-full object-contain cursor-pointer"
                  />
                </div>
                <div className="flex items-center tracking-tight">
                  <span
                    className="text-lg sm:text-xl md:text-2xl font-black text-emerald-900 dark:text-emerald-400 cursor-pointer"
                    style={{ fontFamily: "Merriweather, serif" }}
                  >
                    Khmer
                  </span>
                  <span
                    className="text-lg sm:text-xl md:text-2xl font-black text-emerald-600 dark:text-emerald-500 cursor-pointer"
                    style={{ fontFamily: "Merriweather, serif" }}
                  >
                    Bookstore
                  </span>
                </div>
              </button>

              {/* Book categories on large screens */}
              <div className="hidden 2xl:flex items-center gap-1">
                <button
                  onClick={handleHomeClick}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isHome
                      ? "bg-emerald-900 text-white dark:bg-emerald-800"
                      : "text-gray-600 dark:text-gray-300 hover:text-emerald-900 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-white/5"
                  }`}
                >
                  {t("home")}
                </button>

                {/* Deals Hub Link */}
                <button
                  type="button"
                  onClick={() => navigate("/special-offers")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                    location.pathname === "/special-offers" || location.pathname === "/deals"
                      ? "bg-emerald-600 text-white shadow-md"
                      : "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 border border-red-500/20"
                  }`}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  <span>Deals</span>
                </button>

                {navCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCatClick(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      isCatActive(cat.id)
                        ? "bg-emerald-900 text-white dark:bg-emerald-800"
                        : "text-gray-600 dark:text-gray-300 hover:text-emerald-900 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-white/5"
                    }`}
                  >
                    {t(cat.label)}
                  </button>
                ))}
              </div>

              {/* Tablet/Laptop categories (xl breakpoint) */}
              <div className="hidden xl:flex 2xl:hidden items-center gap-1">
                <button
                  onClick={handleHomeClick}
                  className={`px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isHome
                      ? "bg-emerald-900 text-white dark:bg-emerald-800"
                      : "text-gray-600 dark:text-gray-300 hover:text-emerald-900 dark:hover:text-emerald-400"
                  }`}
                >
                  {t("home")}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/special-offers")}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 border border-red-500/20 whitespace-nowrap cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  Deals
                </button>
                <button
                  onClick={() => navigate("/books")}
                  className="px-2.5 py-1.5 rounded-full text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-emerald-900 dark:hover:text-emerald-400 whitespace-nowrap cursor-pointer"
                >
                  {t("allBooks")}
                </button>
              </div>
            </div>

            {/* Desktop Search Bar */}
            <form
              onSubmit={handleSearch}
              className="hidden lg:flex flex-1 max-w-sm xl:max-w-md 2xl:max-w-xl mx-2 xl:mx-4"
            >
              <div
                ref={searchRef}
                className={`relative w-full transition-all ${searchFocused ? "scale-[1.01]" : ""}`}
              >
                <input
                  type="text"
                  placeholder={t("searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  onFocus={() => {
                    setSearchFocused(true);
                    if (searchQuery.length >= 2) setShowDropdown(true);
                  }}
                  onBlur={() => {
                    setSearchFocused(false);
                    setTimeout(() => setShowDropdown(false), 200);
                  }}
                  className={`w-full px-4 py-2.5 pl-11 rounded-full border-2 transition-all focus:outline-none bg-white dark:bg-dark-card text-sm dark:text-white ${
                    searchFocused
                      ? "border-emerald-500 shadow-md dark:border-emerald-600"
                      : "border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20"
                  }`}
                />
                <FaSearch
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors text-base ${searchFocused ? "text-emerald-600" : "text-gray-400"}`}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      onSearch("");
                      setShowDropdown(false);
                    }}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-white dark:bg-dark-card rounded-full p-1 cursor-pointer"
                  >
                    <FaTimes size={14} />
                  </button>
                )}
                <SearchDropdown />
              </div>
            </form>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {/* Language Switcher Dropdown */}
              <div ref={langMenuRef} className="relative group">
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-full bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm border border-gray-200 dark:border-white/10 hover:border-emerald-500 dark:hover:border-emerald-600 hover:shadow-sm transition-all cursor-pointer"
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  aria-label="Change language"
                >
                  <div className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-white/5 shadow-inner border border-gray-100 dark:border-white/5 flex-shrink-0">
                    <img
                      src={
                        language === "km"
                          ? "https://flagcdn.com/w40/kh.png"
                          : "https://flagcdn.com/w40/us.png"
                      }
                      alt={language}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-gray-700 dark:text-gray-300 hidden xs:inline">
                    {language === "km" ? "ភាសាខ្មែរ" : "EN"}
                  </span>
                  <div
                    className={`w-1.5 h-1.5 border-r-2 border-b-2 border-gray-400 transition-transform ${showLanguageMenu ? "rotate-225 -translate-y-0.5" : "rotate-45 translate-y-0"}`}
                    style={{
                      transform: showLanguageMenu
                        ? "rotate(225deg)"
                        : "rotate(45deg)",
                    }}
                  />
                </button>

                {showLanguageMenu && (
                  <div className="absolute top-full right-0 mt-2 w-36 sm:w-40 bg-white dark:bg-dark-card rounded-2xl shadow-2xl border border-gray-100 dark:border-white/5 py-2 z-[60] animate-fadeIn">
                    <div className="px-3 py-1 mb-1">
                      <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                        Language
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setLanguage("km");
                        setShowLanguageMenu(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-emerald-50 dark:hover:bg-white/5 transition-colors text-left cursor-pointer ${language === "km" ? "bg-emerald-50/50 dark:bg-white/10" : ""}`}
                    >
                      <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0 border border-gray-100 dark:border-white/10 shadow-sm">
                        <img
                          src="https://flagcdn.com/w40/kh.png"
                          alt="Khmer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span
                        className={`text-xs sm:text-sm font-bold ${language === "km" ? "text-emerald-900 dark:text-emerald-400" : "text-gray-700 dark:text-gray-300"}`}
                      >
                        ភាសាខ្មែរ
                      </span>
                      {language === "km" && (
                        <div className="ml-auto w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setLanguage("en");
                        setShowLanguageMenu(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-emerald-50 dark:hover:bg-white/5 transition-colors text-left cursor-pointer ${language === "en" ? "bg-emerald-50/50 dark:bg-white/10" : ""}`}
                    >
                      <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0 border border-gray-100 dark:border-white/10 shadow-sm">
                        <img
                          src="https://flagcdn.com/w40/us.png"
                          alt="English"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span
                        className={`text-xs sm:text-sm font-bold ${language === "en" ? "text-emerald-900 dark:text-emerald-400" : "text-gray-700 dark:text-gray-300"}`}
                      >
                        English
                      </span>
                      {language === "en" && (
                        <div className="ml-auto w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* User Account */}
              <button
                type="button"
                onClick={user ? () => navigate('/profile') : onAuthClick}
                aria-label={user ? "Go to profile" : "Open sign in panel"}
                className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:px-3 sm:py-2 rounded-full text-gray-700 dark:text-gray-200 hover:text-emerald-900 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-white/5 transition-all cursor-pointer"
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center overflow-hidden ${user ? "bg-emerald-800 dark:bg-emerald-700 text-white" : "bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300"}`}
                >
                  {user ? (
                    user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs sm:text-sm font-bold">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    )
                  ) : (
                    <AccountIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  )}
                </div>
                <div className="text-left hidden 2xl:block">
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-tight">
                    {user ? t("hello") + "," : t("welcome")}
                  </p>
                  <p className="text-xs font-semibold dark:text-white truncate max-w-[90px]">
                    {user ? user.name?.split(" ")[0] || "User" : t("signIn")}
                  </p>
                </div>
              </button>

              {/* Wishlist */}
              <button
                type="button"
                onClick={onWishlistClick}
                aria-label="Open wishlist"
                className="relative p-2 sm:p-2.5 text-gray-700 dark:text-gray-200 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all cursor-pointer flex items-center justify-center"
              >
                <WishlistIcon className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 sm:w-5 sm:h-5 bg-red-500 text-white text-[10px] sm:text-xs rounded-full flex items-center justify-center font-bold shadow-sm">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button
                type="button"
                onClick={onCartClick}
                aria-label="Open cart"
                className={`relative p-2 sm:p-2.5 text-gray-700 dark:text-gray-200 hover:text-emerald-800 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-white/5 rounded-full transition-all cursor-pointer flex items-center justify-center btn-press ${cartShake ? 'animate-cart-shake' : ''}`}
              >
                <CartIcon className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 sm:w-5 sm:h-5 bg-emerald-800 text-white text-[10px] sm:text-xs rounded-full flex items-center justify-center font-bold shadow-sm">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Dark Mode Toggle */}
              <button
                type="button"
                onClick={toggleDarkMode}
                className={`p-2 sm:p-2.5 rounded-full transition-all cursor-pointer ${isDarkMode ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20" : "bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-900"}`}
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <FaSun size={17} /> : <FaMoon size={17} />}
              </button>

              {/* Mobile / Tablet Menu Toggle */}
              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={
                  mobileOpen ? "Close menu" : "Open menu"
                }
                className="2xl:hidden p-2 sm:p-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-all cursor-pointer"
              >
                {mobileOpen ? <FaTimes size={19} /> : <FaBars size={19} />}
              </button>
            </div>
          </div>

          {/* Mobile & Tablet Drawer / Menu */}
          {mobileOpen && (
            <div className="2xl:hidden py-4 border-t dark:border-white/10 animate-fadeIn">
              <div ref={mobileSearchRef} className="relative mb-4">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={t("searchPlaceholder")}
                      value={searchQuery}
                      onChange={(e) => handleSearchInput(e.target.value)}
                      onFocus={() => {
                        if (searchQuery.length >= 2) setShowDropdown(true);
                      }}
                      className="w-full px-4 py-2.5 pl-11 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm dark:text-white"
                    />
                    <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          onSearch("");
                          setShowDropdown(false);
                        }}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        <FaTimes size={14} />
                      </button>
                    )}
                  </div>
                </form>

                {/* Mobile Search Dropdown */}
                {showDropdown && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-dark-card rounded-xl shadow-xl border border-gray-100 dark:border-white/5 overflow-hidden z-50">
                    <div className="max-h-64 overflow-y-auto">
                      {searchResults.slice(0, 5).map((book) => (
                        <button
                          key={book.id}
                          type="button"
                          onClick={() => {
                            handleResultClick(book);
                            setMobileOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-emerald-50 dark:hover:bg-white/5 transition-colors text-left cursor-pointer"
                        >
                          <div className="w-8 h-11 flex-shrink-0 bg-gray-100 dark:bg-white/5 rounded-lg overflow-hidden flex items-center justify-center">
                            <img
                              src={book.image}
                              alt={book.title}
                              loading="lazy"
                              decoding="async"
                              className="h-full w-auto object-contain"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate">
                              {book.title}
                            </p>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                              by {book.author} · ${book.price.toFixed(2)}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onSearch(searchQuery);
                        setShowDropdown(false);
                        setMobileOpen(false);
                      }}
                      className="w-full px-4 py-2.5 text-xs sm:text-sm font-semibold text-emerald-800 dark:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-white/5 border-t border-gray-100 dark:border-white/5 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <FaSearch size={11} />
                      See all results
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                <button
                  onClick={handleHomeClick}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all text-left cursor-pointer ${
                    isHome
                      ? "bg-emerald-900 text-white dark:bg-emerald-800 shadow-sm"
                      : "bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-white/10"
                  }`}
                >
                  {t("home")}
                </button>

                <button
                  onClick={() => {
                    navigate("/special-offers");
                    setMobileOpen(false);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all text-left cursor-pointer ${
                    location.pathname === "/special-offers" || location.pathname === "/deals"
                      ? "bg-red-600 text-white shadow-md"
                      : "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-500/20"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span>Deals & Sales</span>
                </button>

                {navCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCatClick(cat.id)}
                    className={`px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all text-left cursor-pointer ${
                      isCatActive(cat.id)
                        ? "bg-emerald-900 text-white dark:bg-emerald-800 shadow-sm"
                        : "bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-white/10"
                    }`}
                  >
                    {t(cat.label)}
                  </button>
                ))}
              </div>

              <div className="mt-4">
                <button
                  onClick={() => {
                    if (user) {
                      navigate('/profile');
                    } else {
                      onAuthClick();
                    }
                    setMobileOpen(false);
                  }}
                  className="w-full py-3 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer shadow-md"
                >
                  {user
                    ? `${t("hello")}, ${user.name?.split(" ")[0] || "User"}!`
                    : t("signIn") + " / " + t("signUp")}
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>


    </>
  );
}
