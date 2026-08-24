import { useQuery, useMutation, useQueryClient } from "./QueryClient";
import { Book, FlashSale, SalesCampaign, CouponVoucher } from "../types";
import { mapBackendBook } from "../context/StoreContext";
import { mapSalesBook } from "../context/SalesContext";
import { API_BASE } from "../config";

// 1. All Books Query (Stale time: 5 minutes, instant hydration)
export function useBooksQuery() {
  return useQuery<Book[]>({
    queryKey: ["books", "all"],
    staleTime: 1000 * 60 * 5, // 5 mins
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/api/books/all`);
      if (!res.ok) throw new Error("Failed to fetch books catalog");
      const data = await res.json();
      if (!Array.isArray(data)) return [];
      return data.map(mapBackendBook);
    },
  });
}

// 2. Sales Hub Query (Flash sales, active campaigns, special offers)
export function useSalesHubQuery() {
  return useQuery<{
    flash_sales: FlashSale[];
    campaigns: SalesCampaign[];
    special_offers: any[];
  }>({
    queryKey: ["sales", "hub"],
    staleTime: 1000 * 60 * 2, // 2 mins
    refetchInterval: 1000 * 60, // Poll every 60s for real-time sales
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/api/sales/hub`);
      if (!res.ok) throw new Error("Failed to fetch sales hub");
      const data = await res.json();
      return {
        flash_sales: (data.flash_sales || []).map((fs: any) => ({
          ...fs,
          book: fs.book ? mapSalesBook(fs.book) : undefined,
        })),
        campaigns: data.campaigns || [],
        special_offers: data.special_offers || [],
      };
    },
  });
}

// 3. Coupons Query
export function useCouponsQuery() {
  return useQuery<CouponVoucher[]>({
    queryKey: ["sales", "coupons"],
    staleTime: 1000 * 60 * 10,
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/api/sales/coupons`);
      if (!res.ok) throw new Error("Failed to fetch coupons");
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
  });
}

// 4. Single Book Detail Query
export function useBookDetailQuery(bookId: number | string | undefined) {
  return useQuery<Book>({
    queryKey: ["books", "detail", bookId],
    enabled: Boolean(bookId),
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/api/books/${bookId}`);
      if (!res.ok) throw new Error(`Failed to fetch book detail #${bookId}`);
      const data = await res.json();
      return mapBackendBook(data);
    },
  });
}

// 5. Book Reviews Query
export function useBookReviewsQuery(bookId: number | string | undefined) {
  return useQuery<any[]>({
    queryKey: ["reviews", "book", bookId],
    enabled: Boolean(bookId),
    staleTime: 1000 * 60 * 2,
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/api/reviews/book/${bookId}`);
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
  });
}

// 6. Submit Review Mutation
export function useSubmitReviewMutation(bookId: number | string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      rating,
      comment,
      token,
    }: {
      rating: number;
      comment: string;
      token: string;
    }) => {
      const res = await fetch(`${API_BASE}/api/reviews/${bookId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || "Failed to submit review");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews", "book", bookId]);
      queryClient.invalidateQueries(["books", "detail", bookId]);
      queryClient.invalidateQueries(["books", "all"]);
    },
  });
}
