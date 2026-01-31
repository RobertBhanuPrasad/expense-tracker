import { Expense, ExpenseCategory, ExpenseFormData } from '@/types/expense';
import { SortOrder } from '@/hooks/useExpenses';
import { ExpenseFilters } from './ExpenseFilters';
import { ExpenseItem } from './ExpenseItem';
import { ExpenseListSkeleton } from './ExpenseListSkeleton';
import { AddExpenseDialog } from './AddExpenseDialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Receipt } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  allExpenses: Expense[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  onAddExpense: (data: ExpenseFormData) => void;
  categoryFilter: ExpenseCategory | 'all';
  onCategoryChange: (category: ExpenseCategory | 'all') => void;
  dateFilter: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
}

export function ExpenseList({
  expenses,
  allExpenses,
  isLoading,
  onDelete,
  onAddExpense,
  categoryFilter,
  onCategoryChange,
  dateFilter,
  onDateChange,
  sortOrder,
  onSortChange,
}: ExpenseListProps) {
  const isEmpty = expenses.length === 0;
  const isFiltered = categoryFilter !== 'all' || dateFilter !== undefined;

  return (
    <div className="card-elevated p-6 flex flex-col h-full">
      <div className="mb-4 flex-shrink-0 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Expense History</h2>
          <p className="text-sm text-muted-foreground mt-1">
            View and manage your expenses
          </p>
        </div>
        <AddExpenseDialog onSubmit={onAddExpense} isLoading={isLoading} />
      </div>

      <div className="flex-shrink-0">
        <ExpenseFilters
          categoryFilter={categoryFilter}
          onCategoryChange={onCategoryChange}
          dateFilter={dateFilter}
          onDateChange={onDateChange}
          sortOrder={sortOrder}
          onSortChange={onSortChange}
          totalCount={allExpenses.length}
          filteredCount={expenses.length}
        />
      </div>

      {isLoading && allExpenses.length === 0 ? (
        <ExpenseListSkeleton />
      ) : isEmpty ? (
        <div className="py-12 text-center animate-fade-in flex-1 flex flex-col items-center justify-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Receipt className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-medium text-foreground mb-1">
            {isFiltered ? 'No matching expenses' : 'No expenses yet'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isFiltered 
              ? 'Try changing your filter or add a new expense'
              : 'Add your first expense to get started'
            }
          </p>
        </div>
      ) : (
        <ScrollArea className="flex-1 -mr-3 pr-3">
          <div className="space-y-3">
            {expenses.map((expense) => (
              <ExpenseItem
                key={expense.id}
                expense={expense}
                onDelete={onDelete}
                isDeleting={isLoading}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
