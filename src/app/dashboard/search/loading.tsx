export default function SearchLoading() {
  return (
    <div>
      <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
      <div className="mt-2 h-4 w-64 bg-gray-100 rounded animate-pulse"></div>

      <div className="sticky top-[72px] z-40 mt-6 rounded-xl border border-gray-200 bg-white/95 p-5 shadow-sm">
        <div className="h-12 w-full bg-gray-100 rounded-lg animate-pulse"></div>
      </div>

      <div className="mt-8">
        <div className="mb-4 h-4 w-32 bg-gray-100 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-xl border border-gray-200 bg-gray-50" />
          ))}
        </div>
      </div>
    </div>
  );
}
