export function BookCardSkeleton() {
  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden border border-gray-100 dark:border-white/5 flex flex-col shadow-sm animate-pulse">
      {/* Cover Skeleton */}
      <div className="aspect-[3/4] bg-gray-200 dark:bg-gray-800 relative overflow-hidden flex items-center justify-center p-4">
        <div className="w-16 h-20 bg-gray-300 dark:bg-gray-700/60 rounded-lg opacity-40" />
      </div>

      {/* Info Skeleton */}
      <div className="p-4 flex flex-col flex-1 gap-2.5">
        {/* Genre Pill */}
        <div className="w-20 h-3 bg-gray-200 dark:bg-gray-800 rounded-full" />
        
        {/* Title Lines */}
        <div className="w-full h-4 bg-gray-200 dark:bg-gray-800 rounded-md" />
        <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-800 rounded-md" />

        {/* Author Line */}
        <div className="w-1/2 h-3 bg-gray-200 dark:bg-gray-800 rounded-md mt-1" />

        {/* Rating Line */}
        <div className="flex items-center gap-2 mt-1">
          <div className="w-20 h-3 bg-gray-200 dark:bg-gray-800 rounded-md" />
          <div className="w-8 h-3 bg-gray-200 dark:bg-gray-800 rounded-md" />
        </div>

        {/* Price & Stock */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="w-16 h-5 bg-gray-200 dark:bg-gray-800 rounded-md" />
          <div className="w-14 h-3 bg-gray-200 dark:bg-gray-800 rounded-md" />
        </div>
      </div>
    </div>
  );
}
