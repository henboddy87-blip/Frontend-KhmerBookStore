// Central API configuration — uses VITE_API_URL env var in production,
// falls back to localhost for local development.
const rawUrl = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "") || "http://127.0.0.1:8000";
export const API_BASE = rawUrl.endsWith("/api") ? rawUrl.slice(0, -4) : rawUrl;
