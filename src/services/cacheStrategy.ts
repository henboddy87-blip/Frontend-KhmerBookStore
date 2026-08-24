/**
 * Frontend Multi-Tier Caching Architecture & Redis Integration Guide
 *
 * Tier 1: TanStack Query (Memory Cache + In-Flight Request Deduplication)
 * Tier 2: Storage Hydration (SessionStorage instant paint on tab switch/reload)
 * Tier 3: Browser HTTP Cache (Headers & Immutable Image Assets)
 * Tier 4: Server Cache (FastAPI In-Memory TTL + Redis Scalable Cache)
 */

export const CacheConfig = {
  // TanStack Query Stale Times (in milliseconds)
  CATALOG_STALE_TIME: 1000 * 60 * 5, // 5 minutes
  SALES_HUB_STALE_TIME: 1000 * 60 * 2, // 2 minutes
  COUPONS_STALE_TIME: 1000 * 60 * 10, // 10 minutes
  REVIEWS_STALE_TIME: 1000 * 60 * 3, // 3 minutes

  // Storage Keys
  STORAGE_KEYS: {
    BOOKS_CACHE: "bh_cached_books",
    SALES_CACHE: "bh_cached_sales",
    COUPONS_CACHE: "bh_cached_coupons",
    CART: "book_haven_cart",
    WISHLIST: "book_haven_wishlist",
  },
};

/**
 * Helper to clear client caches when user manually refreshes or data updates
 */
export function clearClientCache() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(CacheConfig.STORAGE_KEYS.BOOKS_CACHE);
    sessionStorage.removeItem(CacheConfig.STORAGE_KEYS.SALES_CACHE);
    sessionStorage.removeItem(CacheConfig.STORAGE_KEYS.COUPONS_CACHE);
  } catch (e) {
    console.warn("Could not clear client cache:", e);
  }
}
