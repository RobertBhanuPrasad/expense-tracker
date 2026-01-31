import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ExpenseForm } from './ExpenseForm';
import { ExpenseFormData } from '@/types/expense';

interface AddExpenseDialogProps {
  onSubmit: (data: ExpenseFormData) => void;
  isLoading: boolean;
}

export function AddExpenseDialog({ onSubmit, isLoading }: AddExpenseDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = (data: ExpenseFormData) => {
    onSubmit(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
        </DialogHeader>
        <ExpenseForm onSubmit={handleSubmit} isLoading={isLoading} isDialog />
      </DialogContent>
    </Dialog>
  );
}
