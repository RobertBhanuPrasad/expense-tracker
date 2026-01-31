import { Expense } from '@/types/expense';
import { CategoryBadge } from './CategoryBadge';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ExpenseItemProps {
  expense: Expense;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export function ExpenseItem({ expense, onDelete, isDeleting }: ExpenseItemProps) {
  const formattedDate = format(new Date(expense.date), 'MMM d, yyyy');
  const formattedAmount = expense.amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div 
      className={cn(
        "card-elevated-hover p-4 animate-fade-in group",
        isDeleting && "opacity-50 pointer-events-none"
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <CategoryBadge category={expense.category} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground truncate">
              {expense.description || 'No description'}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {formattedDate}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="amount-display text-foreground">
            ₹{formattedAmount}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(expense.id)}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
