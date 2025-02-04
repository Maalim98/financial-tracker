import SpendingOverview from '../components/charts/SpendingOverview';
import ExpenseTrend from '../components/charts/ExpenseTrend';
import { formatCurrency } from '../utils/formatCurrency';

function Dashboard() {
  const transactions = [
    { type: 'expense', category: 'Groceries', amount: -1205, date: '2024-03-15', icon: '🛒', description: 'Weekly groceries at Carrefour' },
    { type: 'income', category: 'Salary', amount: 35000, date: '2024-03-01', icon: '💰', description: 'Monthly salary' },
    { type: 'expense', category: 'Utilities', amount: -850, date: '2024-03-10', icon: '⚡', description: 'Electricity bill' },
  ];

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">Welcome back, User! 👋</h1>
        <p className="text-gray-600 dark:text-gray-400">Here&apos;s your financial overview</p>
      </div>

      {/* Dashboard Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Balance Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-lg p-6 border border-indigo-400/20 hover:shadow-xl transition-shadow duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8">
            <svg className="w-full h-full text-indigo-400/20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="relative">
            <h3 className="text-lg font-medium text-white/80">Total Balance</h3>
            <p className="text-3xl font-bold text-white mt-2 mb-1">{formatCurrency(52400)}</p>
            <div className="inline-flex items-center text-sm text-white/80 bg-indigo-500/30 px-2 py-1 rounded-lg">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              +2.5% from last month
            </div>
          </div>
        </div>

        {/* Monthly Income Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg p-6 border border-emerald-400/20 hover:shadow-xl transition-shadow duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8">
            <svg className="w-full h-full text-emerald-400/20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
          </div>
          <div className="relative">
            <h3 className="text-lg font-medium text-white/80">Monthly Income</h3>
            <p className="text-3xl font-bold text-white mt-2 mb-1">{formatCurrency(35000)}</p>
            <div className="inline-flex items-center text-sm text-white/80 bg-emerald-500/30 px-2 py-1 rounded-lg">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Last updated today
            </div>
          </div>
        </div>

        {/* Monthly Expenses Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg p-6 border border-red-400/20 hover:shadow-xl transition-shadow duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8">
            <svg className="w-full h-full text-red-400/20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 13l-5 5m0 0l-5-5m5 5V6" />
            </svg>
          </div>
          <div className="relative">
            <h3 className="text-lg font-medium text-white/80">Monthly Expenses</h3>
            <p className="text-3xl font-bold text-white mt-2 mb-1">{formatCurrency(22600)}</p>
            <div className="inline-flex items-center text-sm text-white/80 bg-red-500/30 px-2 py-1 rounded-lg">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
              64.5% of income
            </div>
          </div>
        </div>
      </div>

      {/* Two Most Important Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <SpendingOverview />
        <ExpenseTrend />
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Recent Transactions</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Your latest spending activity</p>
            </div>
            <button 
              type="button"
              className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
            >
              View All
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {transactions.map((transaction, index) => (
              <div 
                key={index} 
                className="flex items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="h-12 w-12 flex items-center justify-center bg-gray-100 dark:bg-gray-600 rounded-xl mr-4">
                  <span className="text-2xl">{transaction.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{transaction.category}</p>
                    <p className={`font-bold ${
                      transaction.type === 'income' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.description}</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">{transaction.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 