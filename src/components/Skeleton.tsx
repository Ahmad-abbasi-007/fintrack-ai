export function Skeleton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`animate-pulse bg-gray-800/60 rounded-lg ${className}`}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <Skeleton className="h-8 w-8 rounded-full mb-3" />
      <Skeleton className="h-4 w-24 mb-2" />
      <Skeleton className="h-7 w-32" />
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <Skeleton className="h-6 w-40 mb-6" />
      <Skeleton className="h-64 w-full rounded-2xl" />
    </div>
  );
}

export function SkeletonList({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-800">
        <Skeleton className="h-5 w-40" />
      </div>
      <ul className="divide-y divide-gray-800">
        {Array.from({ length: rows }).map((_, i) => (
          <li key={i} className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4 flex-1">
              <Skeleton className="w-10 h-10 rounded-full shrink-0" />
              <div className="flex-1">
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
            <Skeleton className="h-4 w-20" />
          </li>
        ))}
      </ul>
    </div>
  );
}