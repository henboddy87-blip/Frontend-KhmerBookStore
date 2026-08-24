export function DynamicCampaignsSkeleton() {
  return (
    <section className="py-14 bg-white dark:bg-dark-bg border-b border-gray-100 dark:border-white/5 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="w-28 h-5 bg-emerald-100 dark:bg-emerald-950/40 rounded-full mb-2" />
            <div className="w-56 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg" />
          </div>
          <div className="w-24 h-4 bg-gray-200 dark:bg-gray-800 rounded-md" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-50 dark:bg-dark-card border border-gray-200 dark:border-white/10 rounded-3xl p-6 min-h-[220px] flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between mb-4">
                  <div className="w-24 h-7 bg-gray-200 dark:bg-gray-800 rounded-full" />
                  <div className="w-16 h-7 bg-gray-200 dark:bg-gray-800 rounded-full" />
                </div>
                <div className="w-3/4 h-6 bg-gray-200 dark:bg-gray-800 rounded-md mb-2" />
                <div className="w-full h-4 bg-gray-200 dark:bg-gray-800 rounded-md" />
              </div>
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200/60 dark:border-white/10">
                <div className="w-32 h-4 bg-gray-200 dark:bg-gray-800 rounded-md" />
                <div className="w-24 h-9 bg-gray-200 dark:bg-gray-800 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
