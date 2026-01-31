import { ExpenseCategory, categoryConfig } from '@/types/expense';
import { TrendingUp, Wallet } from 'lucide-react';

interface SummaryBarProps {
  total: number;
  categoryTotals: Record<ExpenseCategory, number>;
  filteredCategory: ExpenseCategory | 'all';
}

export function SummaryBar({ total, categoryTotals, filteredCategory }: SummaryBarProps) {
  const formattedTotal = total.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Get top spending category
  const topCategory = Object.entries(categoryTotals)
    .filter(([_, amount]) => amount > 0)
    .sort(([, a], [, b]) => b - a)[0];

  return (
    <div className="card-elevated p-4 mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
            <Wallet className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
              {filteredCategory === 'all' ? 'Total Expenses' : `${filteredCategory} Expenses`}
            </p>
            <p className="text-2xl font-bold text-foreground amount-display">
              ₹{formattedTotal}
            </p>
          </div>
        </div>

        {topCategory && filteredCategory === 'all' && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Top category:
            </span>
            <span className={`category-badge ${categoryConfig[topCategory[0] as ExpenseCategory].className}`}>
              {categoryConfig[topCategory[0] as ExpenseCategory].icon} {topCategory[0]}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
