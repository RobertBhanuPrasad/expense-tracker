import { Skeleton } from '@/components/ui/skeleton';

export function ExpenseChartsSkeleton() {
  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Bar Chart Skeleton */}
      <div className="card-elevated p-6 flex-1 flex flex-col min-h-0">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="flex-1 flex items-center justify-center">
          <Skeleton className="h-40 w-full rounded" />
        </div>
      </div>
      {/* Pie Chart Skeleton */}
      <div className="card-elevated p-6 flex-1 flex flex-col min-h-0">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="flex-1 flex items-center justify-center">
          <Skeleton className="h-40 w-40 rounded-full" />
        </div>
      </div>
    </div>
  );
}
