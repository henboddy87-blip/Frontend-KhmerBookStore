export function FlashSaleSkeleton() {
  return (
    <section className="relative py-16 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-dark-bg dark:via-dark-card/50 dark:to-dark-bg border-y border-gray-100 dark:border-white/5 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="w-32 h-6 bg-red-200 dark:bg-red-950/40 rounded-full mb-3" />
            <div className="w-64 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg mb-2" />
            <div className="w-80 h-4 bg-gray-200 dark:bg-gray-800 rounded-md" />
          </div>
          <div className="w-48 h-12 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-dark-card border border-gray-200 dark:border-white/10 rounded-3xl p-5 shadow-lg flex flex-col justify-between"
            >
              <div className="aspect-[3/4] w-full rounded-2xl bg-gray-100 dark:bg-gray-800 mb-4 flex items-center justify-center">
                <div className="w-20 h-28 bg-gray-200 dark:bg-gray-700/60 rounded-xl" />
              </div>
              <div className="space-y-2 mb-4">
                <div className="w-full h-5 bg-gray-200 dark:bg-gray-800 rounded-md" />
                <div className="w-1/2 h-3 bg-gray-200 dark:bg-gray-800 rounded-md" />
                <div className="w-full h-12 bg-gray-100 dark:bg-gray-800/60 rounded-xl" />
                <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-800 rounded-full" />
              </div>
              <div className="w-full h-11 bg-gray-200 dark:bg-gray-800 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
