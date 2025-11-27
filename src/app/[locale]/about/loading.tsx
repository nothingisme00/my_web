export default function AboutLoading() {
  return (
    <div className="py-16 lg:py-20 min-h-screen">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="mx-auto max-w-3xl text-center mb-16 animate-pulse">
          <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-lg w-48 mx-auto mb-6" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mx-auto mb-3" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mx-auto" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-8 animate-pulse">
              <div className="rounded-2xl bg-gray-50/50 dark:bg-gray-800/30 p-8 border-0">
                <div className="aspect-square rounded-xl bg-gray-200 dark:bg-gray-800 mb-6" />
                <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-6" />
                <div className="space-y-4 mb-8">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
                </div>
                <div className="space-y-3">
                  <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-full" />
                  <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="lg:col-span-2 animate-pulse">
            <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden p-8 md:p-10">
              <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-32 mb-6" />
              <div className="space-y-4 mb-10">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
              </div>
              
              <div className="h-px bg-gray-200 dark:bg-gray-800 mb-10" />
              
              <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-40 mb-8" />
              <div className="space-y-8">
                {[1, 2].map((i) => (
                  <div key={i} className="pl-8 border-l-2 border-gray-200 dark:border-gray-800">
                    <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-3" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
