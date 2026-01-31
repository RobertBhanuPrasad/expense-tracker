export type ExpenseCategory = 
  | 'Food'
  | 'Travel'
  | 'Rent'
  | 'Shopping'
  | 'Utilities'
  | 'Other';

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;
  createdAt: string;
}

export interface ExpenseFormData {
  amount: string;
  category: ExpenseCategory;
  description: string;
  date: Date | undefined;
}

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Travel',
  'Rent',
  'Shopping',
  'Utilities',
  'Other',
];

export const categoryConfig: Record<ExpenseCategory, { className: string; icon: string }> = {
  Food: { className: 'category-food', icon: '🍕' },
  Travel: { className: 'category-travel', icon: '✈️' },
  Rent: { className: 'category-rent', icon: '🏠' },
  Shopping: { className: 'category-shopping', icon: '🛍️' },
  Utilities: { className: 'category-utilities', icon: '⚡' },
  Other: { className: 'category-other', icon: '📌' },
};
