import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { TranslationKey } from "../data/translations";
import { useScrollReveal } from "../hooks/useScrollReveal";

const SHOP_LINKS: { label: TranslationKey; to: string }[] = [
  { label: "allBooks", to: "/books" },
  { label: "newArrivals", to: "/new-arrivals" },
  { label: "bestsellers", to: "/bestsellers" },
  { label: "onSale", to: "/on-sale" },
  { label: "specialOffers", to: "/special-offers" },
];

const GENRE_LINKS: { label: TranslationKey; to: string }[] = [
  { label: "fiction", to: "/genre/fiction" },
  { label: "nonFiction", to: "/genre/non-fiction" },
  { label: "selfHelp", to: "/genre/self-help" },
  { label: "biography", to: "/genre/biography" },
  { label: "children", to: "/genre/children" },
  { label: "scienceFiction", to: "/genre/science" },
];

const HELP_LINKS: { label: TranslationKey; to: string }[] = [
  { label: "faq", to: "/faq" },
  { label: "shippingInfo", to: "/shipping" },
  { label: "returns", to: "/returns" },
  { label: "trackOrder", to: "/track-order" },
  { label: "contactUs", to: "/contact" },
];

const LEGAL_LINKS: { label: TranslationKey; to: string }[] = [
  { label: "privacyPolicy", to: "/privacy-policy" },
  { label: "termsOfService", to: "/terms-of-service" },
  { label: "cookiePolicy", to: "/cookie-policy" },
  { label: "accessibility", to: "/accessibility" },
];

const PAYMENT_LOGOS = [
  {
    src: "/payment/khqr.png",
    alt: "KHQR",
  },
  {
    src: "/payment/aba.png",
    alt: "ABA",
  },
  {
    src: "/payment/aceleda.png",
    alt: "Aceleda",
  },
  {
    src: "/payment/wing.png",
    alt: "Wing",
  },
];

export function Footer() {
  const { t } = useStore();
  const [footerRef, footerVisible] = useScrollReveal({ threshold: 0.05 });

  return (
    <footer className="bg-emerald-50 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-100 border-t border-emerald-100 dark:border-emerald-900">
      {/* Main Footer */}
      <div className="max-w-[1600px] mx-auto px-4 py-16">
        <div ref={footerRef} className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className={`md:col-span-2 reveal stagger-1 ${footerVisible ? 'revealed' : ''}`}>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 flex items-center justify-center flex-shrink-0">
                <img
                  src="/logo.png"
                  alt="logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span
                className="text-2xl font-black text-emerald-900 dark:text-white"
                style={{ fontFamily: "Merriweather, serif" }}
              >
                Khmer
                <span className="text-emerald-600 dark:text-emerald-400">
                  Bookstore
                </span>
              </span>
            </Link>
            <p className="text-emerald-900/70 dark:text-emerald-300/70 text-[18px] mb-6 max-w-xs leading-relaxed">
              Your premier online destination for books of every genre.
              Discover, read, and grow with over 50,000 titles.
            </p>
            <div className="mt-6">
              <span className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-900/80 dark:text-emerald-200/80 mb-3">
                {t("followUs")}
              </span>
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Instagram"
                  className="transition-transform duration-200 hover:scale-115 active:scale-95 flex items-center justify-center"
                >
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <radialGradient id="ig-rad" cx="30%" cy="107%" r="150%">
                        <stop offset="0%" stopColor="#fdf497" />
                        <stop offset="10%" stopColor="#fdf497" />
                        <stop offset="45%" stopColor="#fd5949" />
                        <stop offset="60%" stopColor="#d6249f" />
                        <stop offset="90%" stopColor="#285AEB" />
                      </radialGradient>
                    </defs>
                    <rect width="24" height="24" rx="6" fill="url(#ig-rad)" />
                    <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" stroke="#FFFFFF" strokeWidth="1.8" fill="none" />
                    <circle cx="12" cy="12" r="3.8" stroke="#FFFFFF" strokeWidth="1.8" fill="none" />
                    <circle cx="17.2" cy="6.8" r="1.1" fill="#FFFFFF" />
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on YouTube"
                  className="transition-transform duration-200 hover:scale-115 active:scale-95 flex items-center justify-center"
                >
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"
                      fill="#FF0000"
                    />
                    <polygon points="9.6,15.6 15.8,12 9.6,8.4" fill="#FFFFFF" />
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Facebook"
                  className="transition-transform duration-200 hover:scale-115 active:scale-95 flex items-center justify-center"
                >
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="24" height="24" rx="5" fill="#1877F2" />
                    <path
                      d="M15.5 13.2h-2.3V21h-3.4v-7.8H8v-3h1.8V8.3c0-1.8 1.1-2.9 3.2-2.9 1 0 1.9.1 2.1.1v2.5h-1.4c-.9 0-1.1.4-1.1 1.1v1.1h2.7l-.4 3z"
                      fill="#FFFFFF"
                    />
                  </svg>
                </a>

                {/* X (formerly Twitter) */}
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on X"
                  className="transition-transform duration-200 hover:scale-115 active:scale-95 flex items-center justify-center text-zinc-900 dark:text-white"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                {/* Telegram */}
                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Telegram"
                  className="transition-transform duration-200 hover:scale-115 active:scale-95 flex items-center justify-center"
                >
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="12" fill="#24A1DE" />
                    <path
                      d="M17.8 7.2l-2.4 11.3c-.2.8-.7 1-1.3.6l-3.6-2.7-1.7 1.6c-.2.2-.4.4-.8.4l.3-3.6 6.5-5.9c.3-.3-.1-.4-.4-.2L6.4 13.7 2.9 12.6c-.8-.2-.8-.8.2-1.2L16.6 6.2c.6-.2 1.2.2 1.2 1z"
                      fill="#FFFFFF"
                    />
                  </svg>
                </a>

                {/* TikTok */}
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on TikTok"
                  className="transition-transform duration-200 hover:scale-115 active:scale-95 flex items-center justify-center"
                >
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64c.29 0 .58.04.86.12V9.39a6.34 6.34 0 00-.86-.06C5.97 9.33 3 12.3 3 15.97 3 19.63 5.97 22.6 9.63 22.6c3.67 0 6.64-2.97 6.64-6.63V8.84a8.34 8.34 0 005.32 1.93v-3.46a4.85 4.85 0 01-2-.62z"
                      className="fill-zinc-900 dark:fill-white"
                    />
                  </svg>
                </a>

                {/* Messenger */}
                <a
                  href="https://messenger.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Messenger"
                  className="transition-transform duration-200 hover:scale-115 active:scale-95 flex items-center justify-center"
                >
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="msg-grad-ft" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00C6FF" />
                        <stop offset="50%" stopColor="#0078FF" />
                        <stop offset="100%" stopColor="#A827FF" />
                      </linearGradient>
                    </defs>
                    <path
                      fill="url(#msg-grad-ft)"
                      d="M12 2C6.477 2 2 6.145 2 11.26c0 2.915 1.45 5.518 3.722 7.184V22l3.41-1.872c.91.252 1.876.388 2.868.388 5.523 0 10-4.145 10-9.26C22 6.145 17.523 2 12 2z"
                    />
                    <path
                      fill="#FFFFFF"
                      d="M13.2 13.5l-2.4-2.6-4.7 2.6 5.2-5.5 2.5 2.6 4.6-2.6-5.2 5.5z"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Shop */}
          <div className={`reveal stagger-3 ${footerVisible ? 'revealed' : ''}`}>
            <h4
              className="font-bold text-[22px] text-emerald-950 dark:text-white mb-5"
              style={{ fontFamily: "Merriweather, serif" }}
            >
              {t("shop")}
            </h4>
            <ul className="space-y-2.5">
              {SHOP_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-emerald-900/60 dark:text-emerald-300/70 hover:text-emerald-700 dark:hover:text-emerald-200 transition-colors text-[18px]"
                  >
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Genres */}
          <div className={`reveal stagger-5 ${footerVisible ? 'revealed' : ''}`}>
            <h4
              className="font-bold text-[22px] text-emerald-950 dark:text-white mb-5"
              style={{ fontFamily: "Merriweather, serif" }}
            >
              {t("genres")}
            </h4>
            <ul className="space-y-2.5">
              {GENRE_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-emerald-900/60 dark:text-emerald-300/70 hover:text-emerald-700 dark:hover:text-emerald-200 transition-colors text-[18px]"
                  >
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div className={`reveal stagger-7 ${footerVisible ? 'revealed' : ''}`}>
            <h4
              className="font-bold text-[22px] text-emerald-950 dark:text-white mb-5"
              style={{ fontFamily: "Merriweather, serif" }}
            >
              {t("help")}
            </h4>
            <ul className="space-y-2.5">
              {HELP_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-emerald-900/60 dark:text-emerald-300/70 hover:text-emerald-700 dark:hover:text-emerald-200 transition-colors text-[18px]"
                  >
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* App badges */}
        <div className="border-t border-emerald-200 dark:border-emerald-900 mt-12 pt-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="w-full md:w-auto">
            <h4
              className="font-bold text-[22px] text-emerald-950 dark:text-white mb-2"
              style={{ fontFamily: "Merriweather, serif" }}
            >
              {t("readAnywhere")}
            </h4>
            <p className="text-emerald-900/60 dark:text-emerald-300/60 text-[18px]">
              {t("accessLibrary")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <a
              href="https://apps.apple.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download on the App Store"
              className="hover:opacity-80 transition-opacity"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                alt="Download on the App Store"
                loading="lazy"
                decoding="async"
                className="h-12 w-auto"
              />
            </a>
            <a
              href="https://play.google.com/store"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Get it on Google Play"
              className="hover:opacity-80 transition-opacity"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Get it on Google Play"
                loading="lazy"
                decoding="async"
                className="h-12 w-auto"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-emerald-200 dark:border-emerald-900">
        <div className="max-w-[1600px] mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Payment logos — plain images, no color/bg overrides */}
          <div className="flex flex-wrap items-center gap-3 max-w-full">
            <span className="text-[18px] text-emerald-800 dark:text-emerald-400 whitespace-nowrap">
              {t("weAccept")}:
            </span>
            <div className="flex flex-wrap items-center gap-2 overflow-x-auto py-1">
              {PAYMENT_LOGOS.map(({ src, alt }) => (
                <div
                  key={alt}
                  className="bg-white rounded overflow-hidden flex items-center justify-center h-6 w-10 border border-gray-200/50 flex-shrink-0"
                >
                  <img
                    src={src}
                    alt={alt}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap justify-center md:justify-end gap-5 text-[18px] text-emerald-900/40 dark:text-emerald-400/60">
            {LEGAL_LINKS.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                className="hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors"
              >
                {t(l.label)}
              </Link>
            ))}
          </div>

          <p className="text-[16px] text-emerald-900/30 dark:text-emerald-400/40 text-center md:text-right">
            © 2026 KhmerBookStore. {t("allRightsReserved")}
          </p>
        </div>
      </div>
    </footer>
  );
}
