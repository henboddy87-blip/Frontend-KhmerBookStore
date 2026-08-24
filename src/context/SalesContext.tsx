import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { FlashSale, DiscountCampaign, Coupon, SpecialOffer, Book } from "../types";
import { useStore } from "./StoreContext";

export interface TimeRemaining {
  total: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  isUpcoming: boolean;
  formatted: string;
}

interface SalesContextType {
  flashSales: FlashSale[];
  campaigns: DiscountCampaign[];
  specialOffers: SpecialOffer[];
  coupons: Coupon[];
  loadingSales: boolean;
  activeFlashSales: FlashSale[];
  activeCampaigns: DiscountCampaign[];
  activeCoupons: Coupon[];
  copiedCoupon: string | null;
  copyCoupon: (code: string) => Promise<boolean>;
  getTimeRemaining: (endTime: string | Date, startTime?: string | Date) => TimeRemaining;
  getBookFlashSale: (bookId: number) => FlashSale | undefined;
  getBookDiscount: (book: Book) => {
    discountPercent: number;
    salePrice: number;
    originalPrice: number;
    campaignTitle?: string;
    isFlashSale: boolean;
  } | null;
  refreshSales: () => Promise<void>;
}

import { API_BASE as ROOT_API_BASE } from "../config";

const API_BASE = `${ROOT_API_BASE}/api/sales`;



export const mapSalesBook = (b: any): Book => {
  const origPrice = Number(b.original_price ?? b.originalPrice ?? b.price ?? 0);
  const currPrice = Number(b.price ?? 0);
  const stock = Number(b.stock_count ?? b.stockCount ?? 0);
  const inStockVal = b.in_stock !== undefined 
    ? Boolean(b.in_stock) 
    : (b.inStock !== undefined ? Boolean(b.inStock) : stock > 0);

  let parsedImages: string[] = [];
  if (Array.isArray(b.images)) {
    parsedImages = b.images.filter(Boolean);
  } else if (typeof b.images === "string" && b.images.trim()) {
    try {
      const json = JSON.parse(b.images);
      if (Array.isArray(json)) parsedImages = json.filter(Boolean);
      else parsedImages = [b.images];
    } catch {
      parsedImages = [b.images];
    }
  }
  if (parsedImages.length === 0 && b.image) {
    parsedImages = [b.image];
  }

  let parsedTags: string[] = [];
  if (Array.isArray(b.tags)) {
    parsedTags = b.tags.filter(Boolean);
  } else if (typeof b.tags === "string" && b.tags.trim()) {
    try {
      const json = JSON.parse(b.tags);
      if (Array.isArray(json)) parsedTags = json.filter(Boolean);
      else parsedTags = b.tags.split(",").map((s: string) => s.trim()).filter(Boolean);
    } catch {
      parsedTags = b.tags.split(",").map((s: string) => s.trim()).filter(Boolean);
    }
  }

  return {
    ...b,
    id: Number(b.id),
    title: b.title || "Untitled Book",
    author: b.author || "Unknown Author",
    price: currPrice,
    originalPrice: origPrice > 0 ? origPrice : currPrice,
    image: b.image || "/images/personal-development/1.jpg",
    images: parsedImages,
    category: b.category || "general",
    genre: b.genre || b.category || "General",
    rating: Number(b.rating ?? 0),
    reviews: Number(b.reviews ?? 0),
    pages: Number(b.pages ?? 0),
    publisher: b.publisher || "Publisher",
    publishedYear: Number(b.published_year ?? b.publishedYear ?? 2024),
    isbn: b.isbn || "978-0000000000",
    language: b.language || "English",
    format: b.format || "Paperback",
    description: b.description || "",
    isNew: Boolean(b.is_new ?? b.isNew),
    isSale: Boolean(b.is_sale ?? b.isSale ?? (origPrice > currPrice)),
    isBestseller: Boolean(b.is_bestseller ?? b.isBestseller),
    isTopRated: Boolean(b.is_top_rated ?? b.isTopRated),
    isSpecialOffer: Boolean(b.is_special_offer ?? b.isSpecialOffer),
    inStock: inStockVal,
    stockCount: stock,
    tags: parsedTags,
  };
};

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export function SalesProvider({ children }: { children: ReactNode }) {
  const { books } = useStore();
  const [flashSales, setFlashSales] = useState<FlashSale[]>([]);
  const [campaigns, setCampaigns] = useState<DiscountCampaign[]>([]);
  const [specialOffers, setSpecialOffers] = useState<SpecialOffer[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loadingSales, setLoadingSales] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);
  const [, setClock] = useState(0);

  // Tick clock every second for live countdowns
  useEffect(() => {
    const timer = setInterval(() => {
      setClock((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const calculateTimeRemaining = useCallback(
    (endTimeStr: string | Date, startTimeStr?: string | Date): TimeRemaining => {
      const now = Date.now();
      const end = new Date(endTimeStr).getTime();
      const start = startTimeStr ? new Date(startTimeStr).getTime() : 0;

      if (start > now) {
        // Sale is upcoming
        const diff = start - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        return {
          total: diff,
          days,
          hours,
          minutes,
          seconds,
          isExpired: false,
          isUpcoming: true,
          formatted: `${days > 0 ? `${days}d ` : ""}${hours.toString().padStart(2, "0")}h : ${minutes.toString().padStart(2, "0")}m : ${seconds.toString().padStart(2, "0")}s`,
        };
      }

      const total = end - now;
      if (total <= 0 || isNaN(total)) {
        return {
          total: 0,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
          isUpcoming: false,
          formatted: "00h : 00m : 00s",
        };
      }

      const days = Math.floor(total / (1000 * 60 * 60 * 24));
      const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((total / 1000 / 60) % 60);
      const seconds = Math.floor((total / 1000) % 60);

      const formatted = `${days > 0 ? `${days}d ` : ""}${hours.toString().padStart(2, "0")}h : ${minutes.toString().padStart(2, "0")}m : ${seconds.toString().padStart(2, "0")}s`;

      return {
        total,
        days,
        hours,
        minutes,
        seconds,
        isExpired: false,
        isUpcoming: false,
        formatted,
      };
    },
    []
  );

  const fetchSalesData = useCallback(async () => {
    try {
      // 1. Fetch from /hub
      const hubRes = await fetch(`${API_BASE}/hub?_t=${Date.now()}`, {
        cache: "no-store",
      }).catch(() => null);

      if (hubRes && hubRes.ok) {
        const hubData = await hubRes.json();
        if (hubData) {
          if (Array.isArray(hubData.flash_sales)) {
            // Attach book if missing in relations & ensure mapped
            const salesWithBooks = hubData.flash_sales.map((fs: FlashSale) => {
              const matchedBook = fs.book ? mapSalesBook(fs.book) : (fs.book_id && books.length > 0 ? books.find((b) => b.id === fs.book_id) : undefined);
              return { 
                ...fs, 
                original_price: Number(fs.original_price || matchedBook?.originalPrice || matchedBook?.price || 0),
                flash_price: Number(fs.flash_price || matchedBook?.price || 0),
                book: matchedBook 
              };
            });
            setFlashSales(salesWithBooks);
          }
          if (Array.isArray(hubData.campaigns)) setCampaigns(hubData.campaigns);
          if (Array.isArray(hubData.special_offers)) setSpecialOffers(hubData.special_offers);
          if (Array.isArray(hubData.coupons)) setCoupons(hubData.coupons);
          setLoadingSales(false);
          return;
        }
      }

      // 2. Fallback to individual active endpoints
      const [fsRes, campRes, spRes, coupRes] = await Promise.all([
        fetch(`${API_BASE}/flash-sales?_t=${Date.now()}`).catch(() => null),
        fetch(`${API_BASE}/campaigns?_t=${Date.now()}`).catch(() => null),
        fetch(`${API_BASE}/special-offers?_t=${Date.now()}`).catch(() => null),
        fetch(`${API_BASE}/coupons?_t=${Date.now()}`).catch(() => null),
      ]);

      if (fsRes && fsRes.ok) {
        const fsData = await fsRes.json();
        if (Array.isArray(fsData)) {
          const mapped = fsData.map((fs: FlashSale) => {
            const matchedBook = fs.book ? mapSalesBook(fs.book) : (fs.book_id && books.length > 0 ? books.find((b) => b.id === fs.book_id) : undefined);
            return { 
              ...fs, 
              original_price: Number(fs.original_price || matchedBook?.originalPrice || matchedBook?.price || 0),
              flash_price: Number(fs.flash_price || matchedBook?.price || 0),
              book: matchedBook 
            };
          });
          setFlashSales(mapped);
        }
      }

      if (campRes && campRes.ok) {
        const campData = await campRes.json();
        if (Array.isArray(campData)) {
          setCampaigns(campData);
        }
      }

      if (spRes && spRes.ok) {
        const spData = await spRes.json();
        if (Array.isArray(spData)) setSpecialOffers(spData);
      }

      if (coupRes && coupRes.ok) {
        const coupData = await coupRes.json();
        if (Array.isArray(coupData)) {
          setCoupons(coupData);
        }
      }
    } catch (e) {
      console.warn("Failed fetching sales data", e);
    } finally {
      setLoadingSales(false);
    }
  }, [books]);

  useEffect(() => {
    fetchSalesData();

    // Listen to admin sync events & storage updates
    const handleSync = (e: StorageEvent) => {
      if (
        e.key === "sales_updated_at" ||
        e.key === "admin_books_sync" ||
        e.key === "books_updated_at"
      ) {
        fetchSalesData();
      }
    };

    const handleFocus = () => {
      fetchSalesData();
    };

    window.addEventListener("storage", handleSync);
    window.addEventListener("focus", handleFocus);

    // Regular polling interval (every 8 seconds) to keep sales live
    const interval = setInterval(fetchSalesData, 8000);

    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("focus", handleFocus);
      clearInterval(interval);
    };
  }, [fetchSalesData]);

  // Construct active flash sales (active + within discount period)
  const activeFlashSales = flashSales.filter((fs) => {
    if (!fs.is_active) return false;
    const { isExpired } = calculateTimeRemaining(fs.end_time, fs.start_time);
    return !isExpired;
  });

  // Construct active campaigns (active + within start_date/end_date if defined)
  const activeCampaigns = campaigns.filter((camp) => {
    if (!camp.is_active) return false;
    const now = Date.now();
    if (camp.start_date && new Date(camp.start_date).getTime() > now) return false;
    if (camp.end_date && new Date(camp.end_date).getTime() < now) return false;
    return true;
  });

  // Construct active coupons
  const activeCoupons = coupons.filter((coup) => {
    if (!coup.is_active) return false;
    const now = Date.now();
    if (coup.start_date && new Date(coup.start_date).getTime() > now) return false;
    if (coup.end_date && new Date(coup.end_date).getTime() < now) return false;
    return true;
  });

  // 1-Click Copy Coupon Code
  const copyCoupon = async (code: string): Promise<boolean> => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(code);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = code;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopiedCoupon(code);
      setTimeout(() => setCopiedCoupon(null), 2500);
      return true;
    } catch {
      return false;
    }
  };

  // Find if book has an active flash sale
  const getBookFlashSale = useCallback(
    (bookId: number): FlashSale | undefined => {
      return activeFlashSales.find((fs) => fs.book_id === bookId);
    },
    [activeFlashSales]
  );

  // Compute any active discounts on a book
  const getBookDiscount = useCallback(
    (book?: Book | null) => {
      if (!book || !book.id) return null;

      // 1. Check flash sale first
      const flash = activeFlashSales.find((fs) => fs.book_id === book.id);
      if (flash && flash.flash_price > 0) {
        const orig = Number(flash.original_price || book.originalPrice || book.price || flash.flash_price);
        const flashPrice = Number(flash.flash_price);
        const pct = orig > flashPrice ? Math.round(((orig - flashPrice) / orig) * 100) : 30;
        return {
          discountPercent: pct > 0 ? pct : 30,
          salePrice: flashPrice,
          originalPrice: orig,
          campaignTitle: flash.title || "Flash Sale Lightning Deal",
          isFlashSale: true,
        };
      }

      // 2. Check active campaigns matching book category or genre or "all"
      const matchingCamp = activeCampaigns.find(
        (c) =>
          c.is_active &&
          (c.category === "all" ||
            (book.category && c.category?.toLowerCase() === book.category.toLowerCase()) ||
            (book.genre && c.category?.toLowerCase() === book.genre.toLowerCase()))
      );
      if (matchingCamp && matchingCamp.discount_percent > 0) {
        const orig = Number(book.originalPrice || book.price || 0);
        const discountPrice =
          Math.round(orig * (1 - matchingCamp.discount_percent / 100) * 100) / 100;
        return {
          discountPercent: matchingCamp.discount_percent,
          salePrice: discountPrice > 0 ? discountPrice : orig,
          originalPrice: orig,
          campaignTitle: matchingCamp.title,
          isFlashSale: false,
        };
      }

      // 3. Check regular book sale flag or original price greater than price
      const orig = Number(book.originalPrice ?? (book as any).original_price ?? 0);
      const curr = Number(book.price ?? 0);
      if ((book.isSale || (book as any).is_sale || orig > curr) && orig > curr && orig > 0) {
        const pct = Math.round(((orig - curr) / orig) * 100);
        return {
          discountPercent: pct > 0 ? pct : 10,
          salePrice: curr,
          originalPrice: orig,
          campaignTitle: "Sale Discount",
          isFlashSale: false,
        };
      }

      return null;
    },
    [activeFlashSales, activeCampaigns]
  );

  return (
    <SalesContext.Provider
      value={{
        flashSales,
        campaigns,
        specialOffers,
        coupons,
        loadingSales,
        activeFlashSales,
        activeCampaigns,
        activeCoupons,
        copiedCoupon,
        copyCoupon,
        getTimeRemaining: calculateTimeRemaining,
        getBookFlashSale,
        getBookDiscount,
        refreshSales: fetchSalesData,
      }}
    >
      {children}
    </SalesContext.Provider>
  );
}

export function useSales() {
  const context = useContext(SalesContext);
  if (!context) {
    throw new Error("useSales must be used within a SalesProvider");
  }
  return context;
}
