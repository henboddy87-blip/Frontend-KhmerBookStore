
export function WishlistIcon({ className = "w-5 h-5", strokeWidth = 1.9 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

export function CartIcon({ className = "w-5 h-5", strokeWidth = 1.9 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Handle */}
      <path d="M8.5 7.5a3.5 3.5 0 0 1 7 0" />
      {/* Bag Body */}
      <path d="M5.5 8.5h13a1.5 1.5 0 0 1 1.5 1.6l-1 9.4a2.5 2.5 0 0 1 -2.5 2.5h-9a2.5 2.5 0 0 1 -2.5 -2.5l-1 -9.4a1.5 1.5 0 0 1 1.5 -1.6z" />
      {/* Rivet studs */}
      <circle cx="9.5" cy="11.5" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="11.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function AccountIcon({ className = "w-5 h-5", strokeWidth = 1.9 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="7.5" r="3.75" />
      <path d="M5.5 20.5a6.5 6.5 0 0 1 13 0" />
    </svg>
  );
}
