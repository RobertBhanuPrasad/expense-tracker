import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Expense, ExpenseCategory } from '@/types/expense';

interface ExpenseChartsProps {
  expenses: Expense[];
}

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Food: '#10b981',      // emerald-500
  Travel: '#3b82f6',    // blue-500
  Rent: '#8b5cf6',      // violet-500
  Shopping: '#f59e0b',  // amber-500
  Utilities: '#06b6d4', // cyan-500
  Other: '#6b7280',     // gray-500
};

const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  Food: 'Food',
  Travel: 'Travel',
  Rent: 'Rent',
  Shopping: 'Shopping',
  Utilities: 'Utilities',
  Other: 'Other',
};

export function ExpenseCharts({ expenses }: ExpenseChartsProps) {
  const chartData = useMemo(() => {
    const categoryTotals: Record<ExpenseCategory, number> = {
      Food: 0,
      Travel: 0,
      Rent: 0,
      Shopping: 0,
      Utilities: 0,
      Other: 0,
    };

    expenses.forEach((expense) => {
      categoryTotals[expense.category] += expense.amount;
    });

    return Object.entries(categoryTotals)
      .filter(([_, value]) => value > 0)
      .map(([category, amount]) => ({
        name: CATEGORY_LABELS[category as ExpenseCategory],
        amount,
        color: CATEGORY_COLORS[category as ExpenseCategory],
      }));
  }, [expenses]);

  const hasData = chartData.length > 0;

  const formatCurrency = (value: number) => `₹${value.toLocaleString('en-IN')}`;

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Bar Chart */}
      <div className="card-elevated p-6 flex-1 flex flex-col min-h-0">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Spending by Category
        </h3>
        {hasData ? (
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  className="fill-muted-foreground"
                  axisLine={{ className: 'stroke-border' }}
                  tickLine={{ className: 'stroke-border' }}
                />
                <YAxis
                  tickFormatter={(value) => `₹${value}`}
                  tick={{ fontSize: 12 }}
                  className="fill-muted-foreground"
                  axisLine={{ className: 'stroke-border' }}
                  tickLine={{ className: 'stroke-border' }}
                />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), 'Amount']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            No expense data to display
          </div>
        )}
      </div>

      {/* Pie Chart */}
      <div className="card-elevated p-6 flex-1 flex flex-col min-h-0">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Expense Distribution
        </h3>
        {hasData ? (
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius="40%"
                  outerRadius="70%"
                  paddingAngle={2}
                  dataKey="amount"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), 'Amount']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                />
                <Legend
                  formatter={(value) => (
                    <span className="text-foreground text-sm">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            No expense data to display
          </div>
        )}
      </div>
    </div>
  );
}
