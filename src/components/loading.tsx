export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div className="h-10 w-10 animate-pulse rounded-lg bg-gray-100" />
        <div className="h-5 w-20 animate-pulse rounded-full bg-gray-100" />
      </div>
      <div className="mt-4 h-5 w-3/4 animate-pulse rounded bg-gray-100" />
      <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-gray-100" />
      <div className="mt-3 h-4 w-full animate-pulse rounded bg-gray-100" />
      <div className="mt-1 h-4 w-2/3 animate-pulse rounded bg-gray-100" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="h-4 flex-1 animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-20 animate-pulse rounded bg-gray-100" />
        </div>
      ))}
    </div>
  );
}
