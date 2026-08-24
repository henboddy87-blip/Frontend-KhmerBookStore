import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Book, CartItem, WishlistItem, User } from "../types";
import { translations, TranslationKey } from "../data/translations";

export interface Order {
  id: string;
  date: string;
  status: "Processing" | "In Transit" | "Delivered";
  statusColor: string;
  items: string[];
  itemImages: { title: string; image: string }[];
  total: string;
}

interface StoreContextType {
  books: Book[];
  loadingBooks: boolean;
  cart: CartItem[];
  wishlist: WishlistItem[];
  orders: Order[];
  user: User | null;
  token: string | null;
  addToCart: (book: Book, format: string) => void;
  removeFromCart: (bookId: number, format: string) => void;
  updateQuantity: (bookId: number, format: string, quantity: number) => void;
  clearCart: () => void;
  addOrder: (order: Order) => void;
  addToWishlist: (book: Book) => void;
  removeFromWishlist: (bookId: number) => void;
  isInWishlist: (bookId: number) => boolean;
  login: (email: string, password?: string, name?: string, isRegister?: boolean, avatar?: string) => Promise<void>;
  googleAuth: (email: string, name?: string, avatar?: string) => Promise<void>;
  authError: string | null;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  updateProfile: (updates: { name?: string; email?: string; avatar?: string; password?: string }) => Promise<void>;
  language: "en" | "km";
  setLanguage: (lang: "en" | "km") => void;
  t: (key: TranslationKey) => string;
  cartTotal: number;
  cartCount: number;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  openCheckout: () => void;
  closeCheckout: () => void;
}

const isTokenExpired = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return true;
    }
    return false;
  } catch (e) {
    return true;
  }
};

export const mapBackendBook = (b: any): Book => {
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
    isTopRated: Boolean(b.is_top_rated ?? b.isTopRated ?? (Number(b.rating ?? 0) >= 4.5)),
    isSpecialOffer: Boolean(b.is_special_offer ?? b.isSpecialOffer),
    inStock: inStockVal,
    stockCount: stock,
    tags: parsedTags,
  };
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const s = localStorage.getItem("bh_cart");
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    try {
      const s = localStorage.getItem("bh_wishlist");
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>([]);

  const [user, setUser] = useState<User | null>(() => {
    try {
      const s = localStorage.getItem("bh_user");
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    const t = localStorage.getItem("frontend_token");
    return t && t !== "undefined" && t !== "null" ? t : null;
  });

  const [language, setLanguage] = useState<"en" | "km">(() => {
    return (localStorage.getItem("bh_lang") as "en" | "km") || "en";
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("bh_theme") === "dark";
  });

  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem("bh_checkout_open") === "true";
    } catch {
      return false;
    }
  });

  const openCheckout = () => {
    try {
      sessionStorage.setItem("bh_checkout_open", "true");
    } catch {}
    setIsCheckoutOpen(true);
  };

  const closeCheckout = () => {
    try {
      sessionStorage.removeItem("bh_checkout_open");
      sessionStorage.removeItem("bh_checkout_step");
    } catch {}
    setIsCheckoutOpen(false);
  };

  useEffect(() => {
    try {
      if (isCheckoutOpen) {
        sessionStorage.setItem("bh_checkout_open", "true");
      } else {
        sessionStorage.removeItem("bh_checkout_open");
      }
    } catch {}
  }, [isCheckoutOpen]);

  const [books, setBooks] = useState<Book[]>(() => {
    try {
      const cached = sessionStorage.getItem("bh_cached_books");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(mapBackendBook);
        }
      }
    } catch {}
    return [];
  });
  const [loadingBooks, setLoadingBooks] = useState(() => books.length === 0);
  const [authError, setAuthError] = useState<string | null>(null);

  // Smart fetch with deduplication — prevents hammering the backend
  const lastFetchRef = { current: 0 };
  const fetchingRef = { current: false };
  const FETCH_DEBOUNCE_MS = 2000; // minimum ms between fetches

  const fetchBooks = (force = false) => {
    const now = Date.now();
    // Skip if already fetching or fetched very recently (unless forced)
    if (fetchingRef.current) return;
    if (!force && now - lastFetchRef.current < FETCH_DEBOUNCE_MS) return;

    fetchingRef.current = true;
    lastFetchRef.current = now;

    fetch("http://127.0.0.1:8000/api/books/all", {
      headers: { "Accept": "application/json" },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) return;
        const mappedBooks = data.map(mapBackendBook);
        setBooks(mappedBooks);
        setLoadingBooks(false);
        try {
          sessionStorage.setItem("bh_cached_books", JSON.stringify(mappedBooks));
        } catch {}
      })
      .catch((err) => {
        console.error("Failed to fetch books:", err);
        setLoadingBooks(false);
      })
      .finally(() => {
        fetchingRef.current = false;
      });
  };

  useEffect(() => {
    // Initial fetch — high priority
    fetchBooks(true);

    // Check and sync user from backend if token exists
    const storedToken = localStorage.getItem("frontend_token");
    if (storedToken && storedToken !== "undefined" && storedToken !== "null") {
      if (isTokenExpired(storedToken)) {
        localStorage.removeItem("frontend_token");
        localStorage.removeItem("bh_user");
        setToken(null);
        setUser(null);
      } else {
        setToken(storedToken);
        fetch("http://127.0.0.1:8000/api/auth/me", {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .then((res) => {
          if (res.status === 401) {
            localStorage.removeItem("frontend_token");
            localStorage.removeItem("bh_user");
            setToken(null);
            setUser(null);
            return null;
          }
          return res.ok ? res.json() : null;
        })
        .then((data) => {
          if (data) {
            setUser({
              name: data.name || data.email.split("@")[0],
              email: data.email,
              avatar: data.avatar,
              isLoggedIn: true,
              joinDate: new Date(data.created_at || Date.now()).getFullYear().toString(),
              ordersCount: 0,
            });
          }
        })
        .catch(() => {});
      }
    }

    // Cross-tab sync for admin changes
    const handleSync = (e: StorageEvent) => {
      if (e.key === "books_updated_at" || e.key === "admin_books_sync") {
        fetchBooks(true);
      }
    };

    // Refresh on tab focus — but debounced so rapid tab-switches don't spam
    const handleFocus = () => {
      fetchBooks();
    };

    window.addEventListener("storage", handleSync);
    window.addEventListener("focus", handleFocus);

    // Smart polling: 15s interval keeps data fresh without wasting bandwidth
    // (backend cache serves instantly anyway with 3s TTL)
    const interval = setInterval(() => fetchBooks(), 15000);

    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("focus", handleFocus);
      clearInterval(interval);
    };
  }, []);

  const fetchUserOrders = async (authToken?: string | null, userEmail?: string | null) => {
    const t = authToken || localStorage.getItem("frontend_token");
    if (!t || isTokenExpired(t)) {
      setOrders([]);
      return;
    }
    try {
      const res = await fetch("http://127.0.0.1:8000/api/orders/my-orders", {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const mapped: Order[] = data.map((o: any) => ({
            id: String(o.id),
            date: new Date(o.created_at || Date.now()).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            }),
            status: o.status ? o.status.charAt(0).toUpperCase() + o.status.slice(1) : "Processing",
            statusColor: o.status === "delivered" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700",
            items: (o.items || []).map((it: any) => it.book?.title || "Book"),
            itemImages: (o.items || []).map((it: any) => ({
              title: it.book?.title || "Book",
              image: it.book?.image || "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
            })),
            total: `$${Number(o.total || 0).toFixed(2)}`,
          }));
          setOrders(mapped);
          if (userEmail) {
            localStorage.setItem(`bh_orders_${userEmail}`, JSON.stringify(mapped));
          }
          return;
        }
      }
    } catch (err) {
      console.error("Failed to fetch user orders:", err);
    }
    if (userEmail) {
      try {
        const saved = localStorage.getItem(`bh_orders_${userEmail}`);
        if (saved) setOrders(JSON.parse(saved));
      } catch {}
    }
  };

  useEffect(() => {
    if (user?.email && token) {
      fetchUserOrders(token, user.email);
    } else {
      setOrders([]);
    }
  }, [user?.email, token]);

  useEffect(() => {
    localStorage.setItem("bh_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("bh_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (user) localStorage.setItem("bh_user", JSON.stringify(user));
    else localStorage.removeItem("bh_user");
  }, [user]);

  useEffect(() => {
    localStorage.setItem("bh_lang", language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("bh_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("bh_theme", "light");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const addToCart = (book: Book, format: string) => {
    setCart((prev) => {
      const existing = prev.find(
        (i) => i.id === book.id && i.selectedFormat === format,
      );
      if (existing) {
        return prev.map((i) =>
          i.id === book.id && i.selectedFormat === format
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        );
      }
      return [...prev, { ...book, quantity: 1, selectedFormat: format }];
    });
  };

  const removeFromCart = (bookId: number, format: string) => {
    setCart((prev) =>
      prev.filter((i) => !(i.id === bookId && i.selectedFormat === format)),
    );
  };

  const updateQuantity = (bookId: number, format: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId, format);
      return;
    }
    setCart((prev) =>
      prev.map((i) =>
        i.id === bookId && i.selectedFormat === format ? { ...i, quantity } : i,
      ),
    );
  };

  const clearCart = () => setCart([]);

  const addOrder = (order: Order) => {
    setOrders((prev) => {
      const updated = [order, ...prev];
      if (user?.email) {
        localStorage.setItem(`bh_orders_${user.email}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const addToWishlist = (book: Book) => {
    setWishlist((prev) => {
      if (prev.find((i) => i.id === book.id)) return prev;
      return [...prev, book];
    });
  };

  const removeFromWishlist = (bookId: number) => {
    setWishlist((prev) => prev.filter((i) => i.id !== bookId));
  };

  const isInWishlist = (bookId: number) =>
    wishlist.some((i) => i.id === bookId);

  const login = async (email: string, password?: string, name?: string, isRegister = false, avatar?: string) => {
    setAuthError(null);
    try {
      if (isRegister) {
        const res = await fetch("http://127.0.0.1:8000/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name: name || email.split('@')[0], avatar }),
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.detail || "Registration failed");
        }
      }
      
      const res = await fetch("http://127.0.0.1:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: password || "google-auth" }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Login failed");
      
      setUser({
        name: data.user.name || data.user.full_name,
        email: data.user.email,
        avatar: data.user.avatar,
        isLoggedIn: true,
        joinDate: new Date(data.user.created_at || Date.now()).getFullYear().toString(),
        ordersCount: 0,
      });
      setToken(data.access_token);
      localStorage.setItem("frontend_token", data.access_token);
      fetchUserOrders(data.access_token, data.user.email);
    } catch (err: any) {
      setAuthError(err.message);
      throw err;
    }
  };

  const googleAuth = async (email: string, name?: string, avatar?: string) => {
    setAuthError(null);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, avatar }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Google authentication failed");

      const userData: User = {
        name: data.user.name || data.user.full_name || email.split("@")[0],
        email: data.user.email,
        avatar: data.user.avatar,
        isLoggedIn: true,
        joinDate: new Date(data.user.created_at || Date.now()).getFullYear().toString(),
        ordersCount: 0,
      };
      setUser(userData);
      setToken(data.access_token);
      localStorage.setItem("frontend_token", data.access_token);
      localStorage.setItem("bh_user", JSON.stringify(userData));
      fetchUserOrders(data.access_token, data.user.email);
    } catch (err: any) {
      setAuthError(err.message);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setOrders([]);
    localStorage.removeItem("frontend_token");
    localStorage.removeItem("bh_user");
  };

  const updateProfile = async (updates: { name?: string; email?: string; avatar?: string; password?: string }) => {
    const token = localStorage.getItem("frontend_token");
    if (!token) throw new Error("Not logged in");
    
    const res = await fetch("http://127.0.0.1:8000/api/auth/me", {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(updates),
    });
    
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed to update profile");
    }
    
    const updatedUser = await res.json();
    setUser(prev => prev ? { 
      ...prev, 
      name: updatedUser.name || updatedUser.full_name,
      email: updatedUser.email,
      avatar: updatedUser.avatar 
    } : null);
  };

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
    if (updates.avatar || updates.name) {
      updateProfile({ avatar: updates.avatar, name: updates.name }).catch(console.error);
    }
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  return (
    <StoreContext.Provider
      value={{
        books,
        loadingBooks,
        cart,
        wishlist,
        orders,
        user,
        token,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        addOrder,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        login,
        googleAuth,
        authError,
        logout,
        updateUser,
        updateProfile,
        language,
        setLanguage,
        t,
        cartTotal,
        cartCount,
        isDarkMode,
        toggleDarkMode,
        isCheckoutOpen,
        setIsCheckoutOpen,
        openCheckout,
        closeCheckout,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}