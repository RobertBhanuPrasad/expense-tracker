import { useState, useCallback, useMemo } from 'react';
import { Expense, ExpenseCategory, ExpenseFormData } from '@/types/expense';
import { toast } from '@/hooks/use-toast';

const STORAGE_KEY = 'expense-tracker-expenses';
const FORM_STORAGE_KEY = 'expense-tracker-form';

// Generate unique ID
const generateId = () => crypto.randomUUID();

// Load expenses from localStorage
const loadExpenses = (): Expense[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Save expenses to localStorage
const saveExpenses = (expenses: Expense[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  } catch (error) {
    console.error('Failed to save expenses:', error);
  }
};

// Load saved form data
export const loadFormData = (): Partial<ExpenseFormData> | null => {
  try {
    const stored = localStorage.getItem(FORM_STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      // Convert date string back to Date object
      if (data.date) {
        data.date = new Date(data.date);
      }
      return data;
    }
    return null;
  } catch {
    return null;
  }
};

// Save form data
export const saveFormData = (data: Partial<ExpenseFormData>) => {
  try {
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save form data:', error);
  }
};

// Clear form data
export const clearFormData = () => {
  try {
    localStorage.removeItem(FORM_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear form data:', error);
  }
};

export type SortOrder = 'newest' | 'oldest';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>(loadExpenses);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<ExpenseCategory | 'all'>('all');
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  // Simulate network delay for realistic UX
  const simulateNetworkDelay = () => 
    new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 400));

  // Add new expense
  const addExpense = useCallback(async (formData: ExpenseFormData): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate network request
      await simulateNetworkDelay();
      
      // Validate
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Invalid amount');
      }
      
      if (!formData.date) {
        throw new Error('Date is required');
      }

      const newExpense: Expense = {
        id: generateId(),
        amount,
        category: formData.category,
        description: formData.description.trim(),
        date: formData.date.toISOString(),
        createdAt: new Date().toISOString(),
      };

      setExpenses(prev => {
        const updated = [newExpense, ...prev];
        saveExpenses(updated);
        return updated;
      });

      clearFormData();

      toast({
        title: "Expense added",
        description: `₹${amount.toLocaleString('en-IN')} for ${formData.category}`,
      });

      return true;
    } catch (error) {
      toast({
        title: "Failed to add expense",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Delete expense
  const deleteExpense = useCallback(async (id: string) => {
    setIsLoading(true);
    
    try {
      await simulateNetworkDelay();
      
      setExpenses(prev => {
        const updated = prev.filter(e => e.id !== id);
        saveExpenses(updated);
        return updated;
      });

      toast({
        title: "Expense deleted",
        description: "The expense has been removed",
      });
    } catch (error) {
      toast({
        title: "Failed to delete",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Filtered and sorted expenses
  const filteredExpenses = useMemo(() => {
    let result = [...expenses];
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter(e => e.category === categoryFilter);
    }
    
    // Apply date filter
    if (dateFilter) {
      const filterDateStr = dateFilter.toISOString().split('T')[0];
      result = result.filter(e => {
        const expenseDateStr = new Date(e.date).toISOString().split('T')[0];
        return expenseDateStr === filterDateStr;
      });
    }
    
    // Apply sort
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
    
    return result;
  }, [expenses, categoryFilter, dateFilter, sortOrder]);

  // Total of filtered expenses
  const total = useMemo(() => 
    filteredExpenses.reduce((sum, e) => sum + e.amount, 0),
    [filteredExpenses]
  );

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
