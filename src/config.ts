// Central API configuration — uses VITE_API_URL env var in production,
// falls back to localhost for local development.
export const API_BASE =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
