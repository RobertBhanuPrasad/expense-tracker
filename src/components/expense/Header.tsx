import { Wallet } from 'lucide-react';

interface HeaderProps {
  totalExpenses: number;
  expenseCount: number;
}

export function Header({ totalExpenses, expenseCount }: HeaderProps) {
  const formattedTotal = totalExpenses.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <header className="bg-card border-b border-border sticky top-0 z-20">
      <div className="container max-w-6xl py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Expense Tracker
              </h1>
              <p className="text-xs text-muted-foreground">
                Track your personal expenses
              </p>
            </div>
          </div>

          <div className="stat-badge">
            <span className="font-medium">₹{formattedTotal}</span>
            <span className="text-xs opacity-75">
              ({expenseCount} {expenseCount === 1 ? 'item' : 'items'})
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
