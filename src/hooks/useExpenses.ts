
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Expense, ExpenseCategory, ExpenseFormData } from '@/types/expense';
import { toast } from '@/hooks/use-toast';

const API_URL = import.meta.env.VITE_API_URL ;

// Form data helpers (optional, keep if you want to persist form state)
const FORM_STORAGE_KEY = 'expense-tracker-form';
export const loadFormData = (): Partial<ExpenseFormData> | null => {
  try {
    const stored = localStorage.getItem(FORM_STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      if (data.date) data.date = new Date(data.date);
      return data;
    }
    return null;
  } catch {
    return null;
  }
};
export const saveFormData = (data: Partial<ExpenseFormData>) => {
  try {
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save form data:', error);
  }
};
export const clearFormData = () => {
  try {
    localStorage.removeItem(FORM_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear form data:', error);
  }
};

export type SortOrder = 'newest' | 'oldest';


export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<ExpenseCategory | 'all'>('all');
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  // Fetch all expenses from backend
  const fetchExpenses = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/expenses`);
      const data = await res.json();
      // Convert backend format to frontend Expense type
      setExpenses(
        data.map((e: any) => ({
          id: e._id,
          amount: e.amount,
          category: e.category,
          description: e.title || e.description || '',
          date: e.date,
          createdAt: e.createdAt || e.date,
        }))
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      toast({
        title: 'Failed to fetch expenses',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Add new expense
  const addExpense = useCallback(async (formData: ExpenseFormData): Promise<boolean> => {
    setIsLoading(true);
    try {
      const amount = Number.parseFloat(formData.amount);
      if (Number.isNaN(amount) || amount <= 0) throw new Error('Invalid amount');
      if (!formData.date) throw new Error('Date is required');

      const res = await fetch(`${API_URL}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.description.trim(),
          amount,
          category: formData.category,
          date: formData.date.toISOString(),
        }),
      });
      if (!res.ok) throw new Error('Failed to add expense');
      await fetchExpenses();
      clearFormData();
      toast({
        title: 'Expense added',
        description: `₹${amount.toLocaleString('en-IN')} for ${formData.category}`,
      });
      return true;
    } catch (error) {
      toast({
        title: 'Failed to add expense',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchExpenses]);

  // Delete expense
  const deleteExpense = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/expenses/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete expense');
      await fetchExpenses();
      toast({
        title: 'Expense deleted',
        description: 'The expense has been removed',
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      toast({
        title: 'Failed to delete',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [fetchExpenses]);

  // Filtered and sorted expenses
  const filteredExpenses = useMemo(() => {
    let result = [...expenses];
    if (categoryFilter !== 'all') {
      result = result.filter(e => e.category === categoryFilter);
    }
    if (dateFilter) {
      const filterDateStr = dateFilter.toISOString().split('T')[0];
      result = result.filter(e => {
        const expenseDateStr = new Date(e.date).toISOString().split('T')[0];
        return expenseDateStr === filterDateStr;
      });
    }
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
    return result;
  }, [expenses, categoryFilter, dateFilter, sortOrder]);

  // Total of filtered expenses
  const total = useMemo(() => filteredExpenses.reduce((sum, e) => sum + e.amount, 0), [filteredExpenses]);

  // Category totals for summary
  const categoryTotals = useMemo(() => {
    const totals: Record<ExpenseCategory, number> = {
      Food: 0,
      Travel: 0,
      Rent: 0,
      Shopping: 0,
      Utilities: 0,
      Other: 0,
    };
    expenses.forEach(e => {
      totals[e.category] += e.amount;
    });
    return totals;
  }, [expenses]);

  return {
    expenses: filteredExpenses,
    allExpenses: expenses,
    isLoading,
    addExpense,
    deleteExpense,
    categoryFilter,
    setCategoryFilter,
    dateFilter,
    setDateFilter,
    sortOrder,
    setSortOrder,
    total,
    categoryTotals,
  };
}
