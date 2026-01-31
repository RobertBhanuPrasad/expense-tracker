import { useExpenses } from '@/hooks/useExpenses';
import {
  Header,
  ExpenseList,
  SummaryBar,
  ExpenseCharts,
} from '@/components/expense';

const Index = () => {
  const {
    expenses,
    allExpenses,
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
  } = useExpenses();

  // Calculate total of all expenses for header
  const grandTotal = allExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Header 
        totalExpenses={grandTotal} 
        expenseCount={allExpenses.length} 
      />

      <main className="flex-1 container max-w-6xl py-6 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          {/* Left Panel - Charts */}
          <div className="lg:col-span-5 h-full">
            <ExpenseCharts expenses={allExpenses} />
          </div>

          {/* Right Panel - List */}
          <div className="lg:col-span-7 flex flex-col gap-4 h-full min-h-0">
            <div className="flex-1 min-h-0">
              <ExpenseList
                expenses={expenses}
                allExpenses={allExpenses}
                isLoading={isLoading}
                onDelete={deleteExpense}
                onAddExpense={addExpense}
                categoryFilter={categoryFilter}
                onCategoryChange={setCategoryFilter}
                dateFilter={dateFilter}
                onDateChange={setDateFilter}
                sortOrder={sortOrder}
                onSortChange={setSortOrder}
              />
            </div>

            <SummaryBar
              total={total}
              categoryTotals={categoryTotals}
              filteredCategory={categoryFilter}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
