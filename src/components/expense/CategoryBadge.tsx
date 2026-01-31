import { ExpenseCategory, categoryConfig } from '@/types/expense';
import { cn } from '@/lib/utils';

interface CategoryBadgeProps {
  category: ExpenseCategory;
  showIcon?: boolean;
  className?: string;
}

export function CategoryBadge({ category, showIcon = true, className }: CategoryBadgeProps) {
  const config = categoryConfig[category];
  
  return (
    <span className={cn('category-badge', config.className, className)}>
      {showIcon && <span className="mr-1">{config.icon}</span>}
      {category}
    </span>
  );
}
