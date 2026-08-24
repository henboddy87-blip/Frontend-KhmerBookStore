export function BookDetailSkeleton() {
  return (
    <div className="grid lg:grid-cols-5 gap-0 animate-pulse">
      {/* Left - Cover Skeleton */}
      <div className="lg:col-span-2 bg-gray-50 dark:bg-dark-card border-r border-gray-100 dark:border-white/5 p-8 flex flex-col justify-between">
        <div className="flex gap-2 mb-4">
          <div className="w-24 h-6 bg-gray-200 dark:bg-gray-800 rounded-full" />
        </div>
        <div className="aspect-[3/4] w-full max-w-[280px] mx-auto bg-gray-200 dark:bg-gray-800 rounded-2xl my-6" />
        <div className="w-32 h-4 bg-gray-200 dark:bg-gray-800 rounded-md mx-auto" />
      </div>

      {/* Right - Details Skeleton */}
      <div className="lg:col-span-3 p-8 flex flex-col justify-between">
        <div>
          <div className="w-24 h-4 bg-gray-200 dark:bg-gray-800 rounded-full mb-2" />
          <div className="w-3/4 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg mb-2" />
          <div className="w-1/3 h-4 bg-gray-200 dark:bg-gray-800 rounded-md mb-6" />

          {/* Rating */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-24 h-4 bg-gray-200 dark:bg-gray-800 rounded-md" />
            <div className="w-16 h-4 bg-gray-200 dark:bg-gray-800 rounded-md" />
          </div>

          {/* Promo box */}
          <div className="w-full h-20 bg-gray-100 dark:bg-gray-800/50 rounded-2xl mb-6" />

          {/* Price */}
          <div className="w-36 h-10 bg-gray-200 dark:bg-gray-800 rounded-xl mb-6" />

          {/* Quantity */}
          <div className="w-40 h-12 bg-gray-100 dark:bg-gray-800/60 rounded-xl mb-6" />

          {/* Buttons */}
          <div className="flex gap-3 mb-6">
            <div className="flex-1 h-14 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
            <div className="w-14 h-14 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-100 dark:border-white/5 pt-4">
          <div className="flex gap-4 mb-4">
            <div className="w-20 h-6 bg-gray-200 dark:bg-gray-800 rounded-md" />
            <div className="w-20 h-6 bg-gray-200 dark:bg-gray-800 rounded-md" />
            <div className="w-20 h-6 bg-gray-200 dark:bg-gray-800 rounded-md" />
          </div>
          <div className="space-y-2">
            <div className="w-full h-4 bg-gray-200 dark:bg-gray-800 rounded-md" />
            <div className="w-5/6 h-4 bg-gray-200 dark:bg-gray-800 rounded-md" />
            <div className="w-4/6 h-4 bg-gray-200 dark:bg-gray-800 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
