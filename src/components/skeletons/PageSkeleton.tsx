import { BookGridSkeleton } from "./BookGridSkeleton";

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg">
      {/* Top Navbar Skeleton */}
      <div className="h-20 border-b border-gray-100 dark:border-white/10 px-6 flex items-center justify-between bg-white dark:bg-dark-bg/80 animate-pulse">
        <div className="w-36 h-8 bg-gray-200 dark:bg-gray-800 rounded-xl" />
        <div className="hidden md:flex gap-6">
          <div className="w-20 h-4 bg-gray-200 dark:bg-gray-800 rounded-md" />
          <div className="w-20 h-4 bg-gray-200 dark:bg-gray-800 rounded-md" />
          <div className="w-20 h-4 bg-gray-200 dark:bg-gray-800 rounded-md" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full" />
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full" />
        </div>
      </div>

      {/* Hero / Header Area Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="w-full h-44 sm:h-64 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 dark:from-dark-card dark:via-gray-800 dark:to-dark-card rounded-3xl mb-12 animate-pulse flex flex-col justify-center p-8">
          <div className="w-48 h-8 bg-gray-300 dark:bg-gray-700/60 rounded-xl mb-3" />
          <div className="w-80 h-4 bg-gray-300 dark:bg-gray-700/60 rounded-md" />
        </div>

        {/* Catalog Grid Skeleton */}
        <BookGridSkeleton count={10} />
      </div>
    </div>
  );
}
