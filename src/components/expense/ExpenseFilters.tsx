import { ExpenseCategory, EXPENSE_CATEGORIES } from '@/types/expense';
import { SortOrder } from '@/hooks/useExpenses';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ArrowDownWideNarrow, ArrowUpWideNarrow, Filter, CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ExpenseFiltersProps {
  categoryFilter: ExpenseCategory | 'all';
  onCategoryChange: (category: ExpenseCategory | 'all') => void;
  dateFilter: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
  totalCount: number;
  filteredCount: number;
}

export function ExpenseFilters({
  categoryFilter,
  onCategoryChange,
  dateFilter,
  onDateChange,
  sortOrder,
  onSortChange,
  totalCount,
  filteredCount,
}: ExpenseFiltersProps) {
  const toggleSort = () => {
    onSortChange(sortOrder === 'newest' ? 'oldest' : 'newest');
  };

  const isFiltered = categoryFilter !== 'all' || dateFilter !== undefined;

  return (
    <div className="filter-bar mb-4">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select
            value={categoryFilter}
            onValueChange={(value) => onCategoryChange(value as ExpenseCategory | 'all')}
          >
            <SelectTrigger className="w-[140px] h-9 text-sm bg-card">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {EXPENSE_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "h-9 gap-1.5 text-sm bg-card min-w-[130px] justify-start",
                  !dateFilter && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="h-4 w-4" />
                {dateFilter ? format(dateFilter, "MMM d, yyyy") : "Pick date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateFilter}
                onSelect={onDateChange}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>

          {dateFilter && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDateChange(undefined)}
              className="h-9 px-2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSort}
            className="h-9 gap-1.5 text-sm bg-card"
          >
            {sortOrder === 'newest' ? (
              <>
                <ArrowDownWideNarrow className="h-4 w-4" />
                <span className="hidden sm:inline">Newest</span>
              </>
            ) : (
              <>
                <ArrowUpWideNarrow className="h-4 w-4" />
                <span className="hidden sm:inline">Oldest</span>
              </>
            )}
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground">
          {isFiltered 
            ? `${filteredCount} of ${totalCount} expenses`
            : `${totalCount} expense${totalCount !== 1 ? 's' : ''}`
          }
        </p>
      </div>
    </div>
  );
}
