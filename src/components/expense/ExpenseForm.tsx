import { useState, useEffect } from 'react';
import { ExpenseCategory, ExpenseFormData, EXPENSE_CATEGORIES } from '@/types/expense';
import { saveFormData, loadFormData, clearFormData } from '@/hooks/useExpenses';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, IndianRupee, Loader2, Plus } from 'lucide-react';

interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => Promise<boolean> | void;
  isLoading?: boolean;
  isDialog?: boolean;
}

const defaultFormData: ExpenseFormData = {
  amount: '',
  category: 'Food',
  description: '',
  date: new Date(),
};

export function ExpenseForm({ onSubmit, isLoading, isDialog }: ExpenseFormProps) {
  const [formData, setFormData] = useState<ExpenseFormData>(defaultFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof ExpenseFormData, string>>>({});

  // Load saved form data on mount
  useEffect(() => {
    const saved = loadFormData();
    if (saved) {
      setFormData(prev => ({
        ...prev,
        ...saved,
        date: saved.date instanceof Date ? saved.date : (saved.date ? new Date(saved.date) : new Date()),
      }));
    }
  }, []);

  // Save form data on change
  useEffect(() => {
    if (formData.amount || formData.description) {
      saveFormData(formData);
    }
  }, [formData]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ExpenseFormData, string>> = {};
    
    const amount = parseFloat(formData.amount);
    if (!formData.amount || isNaN(amount)) {
      newErrors.amount = 'Amount is required';
    } else if (amount <= 0) {
      newErrors.amount = 'Amount must be positive';
    } else if (amount > 10000000) {
      newErrors.amount = 'Amount seems too high';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (formData.description.length > 200) {
      newErrors.description = 'Description is too long';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const success = await onSubmit(formData);
    
    if (success) {
      setFormData(defaultFormData);
      clearFormData();
      setErrors({});
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setFormData(prev => ({ ...prev, amount: value }));
      if (errors.amount) setErrors(prev => ({ ...prev, amount: undefined }));
    }
  };

  return (
    <div className={isDialog ? '' : 'card-elevated p-6'}>
      {!isDialog && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground">Add Expense</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Track your spending by adding a new expense
          </p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Amount Field */}
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-sm font-medium">
            Amount <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">
              <IndianRupee className="h-4 w-4" />
            </div>
            <Input
              id="amount"
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleAmountChange}
              className={cn(
                "input-currency text-base pl-8",
                errors.amount && "border-destructive focus-visible:ring-destructive"
              )}
              disabled={isLoading}
            />
          </div>
          {errors.amount && (
            <p className="text-xs text-destructive">{errors.amount}</p>
          )}
        </div>

        {/* Category Field */}
        <div className="space-y-2">
          <Label htmlFor="category" className="text-sm font-medium">
            Category <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.category}
            onValueChange={(value: ExpenseCategory) => 
              setFormData(prev => ({ ...prev, category: value }))
            }
            disabled={isLoading}
          >
            <SelectTrigger id="category" className="bg-card">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {EXPENSE_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Description Field */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Description
          </Label>
          <Textarea
            id="description"
            placeholder="What was this expense for?"
            value={formData.description}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, description: e.target.value }));
              if (errors.description) setErrors(prev => ({ ...prev, description: undefined }));
            }}
            className={cn(
              "resize-none bg-card",
              errors.description && "border-destructive focus-visible:ring-destructive"
            )}
            rows={3}
            disabled={isLoading}
          />
          <div className="flex justify-between">
            {errors.description ? (
              <p className="text-xs text-destructive">{errors.description}</p>
            ) : (
              <span />
            )}
            <p className="text-xs text-muted-foreground">
              {formData.description.length}/200
            </p>
          </div>
        </div>

        {/* Date Field */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Date <span className="text-destructive">*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-card",
                  !formData.date && "text-muted-foreground",
                  errors.date && "border-destructive focus-visible:ring-destructive"
                )}
                disabled={isLoading}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.date}
                onSelect={(date) => {
                  setFormData(prev => ({ ...prev, date }));
                  if (errors.date) setErrors(prev => ({ ...prev, date: undefined }));
                }}
                disabled={(date) => date > new Date()}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          {errors.date && (
            <p className="text-xs text-destructive">{errors.date}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-11 text-base font-medium"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
