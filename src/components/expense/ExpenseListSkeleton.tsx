export function ExpenseListSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div 
          key={i} 
          className="card-elevated p-4 animate-pulse"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Category badge skeleton */}
              <div className="h-6 w-20 skeleton-shimmer rounded-full" />
              <div className="space-y-1.5">
                {/* Description skeleton */}
                <div className="h-4 w-32 skeleton-shimmer" />
                {/* Date skeleton */}
                <div className="h-3 w-20 skeleton-shimmer" />
              </div>
            </div>
            {/* Amount skeleton */}
            <div className="h-5 w-16 skeleton-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}
