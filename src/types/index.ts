export interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  genre: string; 
  rating: number;
  reviews: number;
  pages: number;
  publisher: string;
  publishedYear: number;
  isbn: string;
  language: string;
  format: 'Hardcover' | 'Paperback' | 'E-Book' | 'Audiobook';
  description: string;
  isNew?: boolean;
  isSale?: boolean;
  isBestseller?: boolean;
  isTopRated?: boolean;
  isSpecialOffer?: boolean;
  inStock: boolean;
  stockCount: number;
  tags: string[];
}

export interface CartItem extends Book {
  quantity: number;
  selectedFormat: string;
}

export interface WishlistItem extends Book {}

export interface User {
  name: string;
  email: string;
  avatar?: string;
  isLoggedIn: boolean;
  joinDate?: string;
  ordersCount?: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  date: string;
  estimatedDelivery: string;
}

export interface Review {
  id: number;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  helpful: number;
  verified: boolean;
}

export interface FlashSale {
  id: number;
  title: string;
  book_id: number | null;
  flash_price: number;
  original_price: number;
  stock_limit: number;
  sold_count: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
  created_at?: string;
  book?: Book;
}

export interface DiscountCampaign {
  id: number;
  title: string;
  description: string;
  discount_percent: number;
  category: string;
  banner_image: string;
  bg_gradient: string;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  created_at?: string;
}

export interface Coupon {
  id: number;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_spend?: number;
  max_discount?: number;
  usage_limit?: number;
  used_count?: number;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
}

export interface SpecialOffer {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  discount_percent: number;
  image: string;
  link_url: string;
  is_active: boolean;
}

// Aliases for unified query and domain models
export type SalesCampaign = DiscountCampaign;
export type CouponVoucher = Coupon;


