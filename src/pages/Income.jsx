import { formatCurrency } from '../utils/formatCurrency';
import IncomeForm from '../components/forms/IncomeForm';

function Income() {
  const recentIncome = [
    { category: 'Salary', amount: 35000, date: '2024-03-01', icon: '💰', description: 'Monthly salary' },
    { category: 'Freelance', amount: 15000, date: '2024-03-10', icon: '💻', description: 'Web development project' },
    { category: 'Investment', amount: 5000, date: '2024-03-15', icon: '📈', description: 'Stock dividends' },
  ];

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Income Manager</h1>
        <p className="text-gray-600 dark:text-gray-400">Track and manage your income sources</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg p-6 border border-emerald-400/20 hover:shadow-xl transition-shadow duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8">
            <svg className="w-full h-full text-emerald-400/20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="relative">
            <h3 className="text-lg font-medium text-white/80">Monthly Income</h3>
            <p className="text-3xl font-bold text-white mt-2 mb-1">{formatCurrency(55000)}</p>
            <div className="inline-flex items-center text-sm text-white/80 bg-emerald-500/30 px-2 py-1 rounded-lg">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              +15% from last month
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 border border-blue-400/20 hover:shadow-xl transition-shadow duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8">
            <svg className="w-full h-full text-blue-400/20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="relative">
            <h3 className="text-lg font-medium text-white/80">Average Monthly</h3>
            <p className="text-3xl font-bold text-white mt-2 mb-1">{formatCurrency(48000)}</p>
            <div className="inline-flex items-center text-sm text-white/80 bg-blue-500/30 px-2 py-1 rounded-lg">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Based on last 6 months
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl shadow-lg p-6 border border-violet-400/20 hover:shadow-xl transition-shadow duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8">
            <svg className="w-full h-full text-violet-400/20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
          </div>
          <div className="relative">
            <h3 className="text-lg font-medium text-white/80">Projected Annual</h3>
            <p className="text-3xl font-bold text-white mt-2 mb-1">{formatCurrency(660000)}</p>
            <div className="inline-flex items-center text-sm text-white/80 bg-violet-500/30 px-2 py-1 rounded-lg">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Based on current trend
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Add Income Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Add New Income
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Record your income from various sources
              </p>
            </div>
            <div className="p-6">
              <IncomeForm />
            </div>
          </div>
        </div>

        {/* Recent Income List */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Recent Income
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Your latest earnings
                  </p>
                </div>
                <button 
                  type="button"
                  className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
                >
                  View All
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentIncome.map((income, index) => (
                  <div 
                    key={index} 
                    className="flex items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="h-12 w-12 flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/30 rounded-xl mr-4">
                      <span className="text-2xl">{income.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-gray-800 dark:text-gray-200">{income.category}</p>
                        <p className="font-bold text-emerald-600 dark:text-emerald-400">
                          +{formatCurrency(income.amount)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500 dark:text-gray-400">{income.description}</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">{income.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Income; 