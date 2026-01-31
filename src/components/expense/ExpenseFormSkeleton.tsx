export function ExpenseFormSkeleton() {
  return (
    <div className="card-elevated p-6 space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-6 w-32 skeleton-shimmer" />
        <div className="h-4 w-48 skeleton-shimmer" />
      </div>
      
      {/* Amount field */}
      <div className="space-y-2">
        <div className="h-4 w-16 skeleton-shimmer" />
        <div className="h-10 w-full skeleton-shimmer" />
      </div>
      
      {/* Category field */}
      <div className="space-y-2">
        <div className="h-4 w-20 skeleton-shimmer" />
        <div className="h-10 w-full skeleton-shimmer" />
      </div>
      
      {/* Description field */}
      <div className="space-y-2">
        <div className="h-4 w-24 skeleton-shimmer" />
        <div className="h-20 w-full skeleton-shimmer" />
      </div>
      
      {/* Date field */}
      <div className="space-y-2">
        <div className="h-4 w-12 skeleton-shimmer" />
        <div className="h-10 w-full skeleton-shimmer" />
      </div>
      
      {/* Submit button */}
      <div className="h-11 w-full skeleton-shimmer" />
    </div>
  );
}
