import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from "react";

// ============================================================================
// TanStack Query Type-Safe Client & React Hooks
// ============================================================================

export type QueryKey = readonly unknown[] | string;

export interface QueryOptions<TData = any, TError = any> {
  queryKey: QueryKey;
  queryFn: () => Promise<TData>;
  staleTime?: number; // ms until data is considered stale (default: 300,000 = 5 mins)
  gcTime?: number; // ms to keep inactive data in cache (default: 600,000 = 10 mins)
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  refetchInterval?: number | false;
  initialData?: TData | (() => TData);
  placeholderData?: TData;
  retry?: number | boolean;
  cacheTime?: number; // backwards compatibility alias
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
}

export interface QueryResult<TData = any, TError = Error> {
  data: TData | undefined;
  error: TError | null;
  isLoading: boolean;
  isFetching: boolean;
  isSuccess: boolean;
  isError: boolean;
  status: "pending" | "success" | "error";
  dataUpdatedAt: number;
  errorUpdatedAt: number;
  refetch: () => Promise<TData | undefined>;
}

export interface MutationOptions<TData = any, TVariables = any, TError = Error> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onSuccess?: (data: TData, variables: TVariables) => void | Promise<void>;
  onError?: (error: TError, variables: TVariables) => void | Promise<void>;
  onSettled?: (data: TData | undefined, error: TError | null, variables: TVariables) => void | Promise<void>;
}

export interface MutationResult<TData = any, TVariables = any, TError = Error> {
  mutate: (variables: TVariables) => void;
  mutateAsync: (variables: TVariables) => Promise<TData>;
  data: TData | undefined;
  error: TError | null;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  reset: () => void;
}

interface CacheEntry<T = any> {
  data: T;
  updatedAt: number;
  promise?: Promise<T>;
  subscribers: Set<() => void>;
}

function serializeKey(key: QueryKey): string {
  if (typeof key === "string") return key;
  try {
    return JSON.stringify(key);
  } catch {
    return String(key);
  }
}

export class QueryClient {
  private cache = new Map<string, CacheEntry>();
  private defaultStaleTime: number;

  constructor(config?: { defaultStaleTime?: number }) {
    this.defaultStaleTime = config?.defaultStaleTime ?? 1000 * 60 * 5; // 5 mins
  }

  getQueryData<T>(key: QueryKey): T | undefined {
    const serialized = serializeKey(key);
    return this.cache.get(serialized)?.data as T | undefined;
  }

  setQueryData<T>(key: QueryKey, data: T | ((old: T | undefined) => T)): void {
    const serialized = serializeKey(key);
    const existing = this.cache.get(serialized);
    const newData = typeof data === "function" ? (data as any)(existing?.data) : data;

    if (existing) {
      existing.data = newData;
      existing.updatedAt = Date.now();
      existing.subscribers.forEach((cb) => cb());
    } else {
      this.cache.set(serialized, {
        data: newData,
        updatedAt: Date.now(),
        subscribers: new Set(),
      });
    }

    // Persist critical queries to sessionStorage for ultra-fast hydration
    if (typeof window !== "undefined" && serialized.includes("books")) {
      try {
        sessionStorage.setItem(`tq_${serialized}`, JSON.stringify(newData));
      } catch {}
    }
  }

  invalidateQueries(key?: QueryKey): void {
    if (!key) {
      this.cache.forEach((entry) => {
        entry.updatedAt = 0;
        entry.subscribers.forEach((cb) => cb());
      });
      return;
    }

    const serialized = serializeKey(key);
    this.cache.forEach((entry, k) => {
      if (k === serialized || k.startsWith(serialized) || k.includes(serialized)) {
        entry.updatedAt = 0;
        entry.subscribers.forEach((cb) => cb());
      }
    });
  }

  prefetchQuery<TData = any, TError = any>(options: QueryOptions<TData, TError>): Promise<TData> {
    const serialized = serializeKey(options.queryKey);
    const existing = this.cache.get(serialized);
    const staleTime = options.staleTime ?? this.defaultStaleTime;

    if (existing && Date.now() - existing.updatedAt < staleTime) {
      return Promise.resolve(existing.data);
    }

    return options.queryFn().then((data) => {
      this.setQueryData(options.queryKey, data);
      return data;
    });
  }

  subscribe(key: QueryKey, callback: () => void): () => void {
    const serialized = serializeKey(key);
    let entry = this.cache.get(serialized);
    if (!entry) {
      entry = {
        data: undefined,
        updatedAt: 0,
        subscribers: new Set(),
      };
      this.cache.set(serialized, entry);
    }
    entry.subscribers.add(callback);
    return () => {
      entry?.subscribers.delete(callback);
    };
  }

  async fetchQuery<TData = any, TError = any>(options: QueryOptions<TData, TError>): Promise<TData> {
    const serialized = serializeKey(options.queryKey);
    let entry = this.cache.get(serialized);

    if (!entry) {
      // Check session storage first
      let cachedFromSession: any = undefined;
      if (typeof window !== "undefined") {
        try {
          const raw = sessionStorage.getItem(`tq_${serialized}`);
          if (raw) cachedFromSession = JSON.parse(raw);
        } catch {}
      }

      entry = {
        data: cachedFromSession,
        updatedAt: cachedFromSession ? Date.now() : 0,
        subscribers: new Set(),
      };
      this.cache.set(serialized, entry);
    }

    const staleTime = options.staleTime ?? this.defaultStaleTime;
    const isStale = Date.now() - entry.updatedAt > staleTime;

    if (!isStale && entry.data !== undefined) {
      return entry.data;
    }

    if (entry.promise) {
      return entry.promise;
    }

    entry.promise = (async () => {
      try {
        const data = await options.queryFn();
        entry!.data = data;
        entry!.updatedAt = Date.now();
        delete entry!.promise;

        if (typeof window !== "undefined") {
          try {
            sessionStorage.setItem(`tq_${serialized}`, JSON.stringify(data));
          } catch {}
        }

        entry!.subscribers.forEach((cb) => cb());
        return data;
      } catch (err) {
        delete entry!.promise;
        throw err;
      }
    })();

    return entry.promise;
  }
}

// Global default client
export const defaultQueryClient = new QueryClient();

const QueryClientContext = createContext<QueryClient>(defaultQueryClient);

export function QueryClientProvider({
  client = defaultQueryClient,
  children,
}: {
  client?: QueryClient;
  children: ReactNode;
}) {
  return (
    <QueryClientContext.Provider value={client}>
      {children}
    </QueryClientContext.Provider>
  );
}

export function useQueryClient(): QueryClient {
  return useContext(QueryClientContext);
}

export function useQuery<TData = any, TError = Error>(
  options: QueryOptions<TData, TError>
): QueryResult<TData, TError> {
  const client = useQueryClient();
  const serialized = serializeKey(options.queryKey);
  const enabled = options.enabled ?? true;

  // Initial read from cache or initialData
  const getInitial = () => {
    const cached = client.getQueryData<TData>(options.queryKey);
    if (cached !== undefined) return cached;
    if (typeof options.initialData === "function") {
      return (options.initialData as any)();
    }
    return options.initialData ?? options.placeholderData;
  };

  const [data, setData] = useState<TData | undefined>(getInitial);
  const [error, setError] = useState<TError | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [dataUpdatedAt, setDataUpdatedAt] = useState<number>(Date.now());
  const [errorUpdatedAt, setErrorUpdatedAt] = useState<number>(0);

  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const executeFetch = useCallback(async () => {
    if (!enabled) return;
    setIsFetching(true);
    try {
      const result = await client.fetchQuery(options);
      if (isMounted.current) {
        setData(result);
        setError(null);
        setDataUpdatedAt(Date.now());
        options.onSuccess?.(result);
      }
      return result;
    } catch (err: any) {
      if (isMounted.current) {
        setError(err);
        setErrorUpdatedAt(Date.now());
        options.onError?.(err);
      }
    } finally {
      if (isMounted.current) {
        setIsFetching(false);
      }
    }
  }, [client, serialized, enabled]);

  // Subscribe to changes in queryClient
  useEffect(() => {
    const unsubscribe = client.subscribe(options.queryKey, () => {
      const latest = client.getQueryData<TData>(options.queryKey);
      if (isMounted.current && latest !== undefined) {
        setData(latest);
        setDataUpdatedAt(Date.now());
      }
    });

    executeFetch();

    return unsubscribe;
  }, [serialized, executeFetch]);

  // Window Focus Refetching
  useEffect(() => {
    if (options.refetchOnWindowFocus === false || !enabled) return;

    const onFocus = () => {
      executeFetch();
    };

    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [executeFetch, options.refetchOnWindowFocus, enabled]);

  // Refetch Interval (polling)
  useEffect(() => {
    if (!options.refetchInterval || !enabled) return;
    const interval = setInterval(executeFetch, options.refetchInterval);
    return () => clearInterval(interval);
  }, [executeFetch, options.refetchInterval, enabled]);

  const isLoading = isFetching && data === undefined;
  const isSuccess = !isLoading && !error && data !== undefined;
  const isError = !isFetching && error !== null;

  return {
    data,
    error,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    status: isLoading ? "pending" : isError ? "error" : "success",
    dataUpdatedAt,
    errorUpdatedAt,
    refetch: executeFetch,
  };
}

export function useMutation<TData = any, TVariables = any, TError = Error>(
  options: MutationOptions<TData, TVariables, TError>
): MutationResult<TData, TVariables, TError> {
  const [data, setData] = useState<TData | undefined>(undefined);
  const [error, setError] = useState<TError | null>(null);
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = useCallback(
    async (variables: TVariables) => {
      setIsPending(true);
      setError(null);
      try {
        const result = await options.mutationFn(variables);
        setData(result);
        await options.onSuccess?.(result, variables);
        await options.onSettled?.(result, null, variables);
        return result;
      } catch (err: any) {
        setError(err);
        await options.onError?.(err, variables);
        await options.onSettled?.(undefined, err, variables);
        throw err;
      } finally {
        setIsPending(false);
      }
    },
    [options]
  );

  const mutate = useCallback(
    (variables: TVariables) => {
      mutateAsync(variables).catch(() => {});
    },
    [mutateAsync]
  );

  const reset = useCallback(() => {
    setData(undefined);
    setError(null);
    setIsPending(false);
  }, []);

  return {
    mutate,
    mutateAsync,
    data,
    error,
    isPending,
    isSuccess: !isPending && !error && data !== undefined,
    isError: !isPending && error !== null,
    reset,
  };
}
