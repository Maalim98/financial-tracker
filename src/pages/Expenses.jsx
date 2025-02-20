import ExpenseForm from '../components/forms/ExpenseForm';
import { formatCurrency } from '../utils/formatCurrency';
import { useState, useEffect, useCallback } from 'react';

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    today: 0,
    thisMonth: 0,
    average: 0,
    monthlyBudget: 50000,
    monthlyPercentage: 0
  });
  const [filterOptions, setFilterOptions] = useState({
    dateRange: 'all', // all, week, month, custom
    startDate: '',
    endDate: '',
    category: 'all',
    searchQuery: '',
    sortBy: 'date', // date, amount, category
    sortOrder: 'desc' // asc, desc
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [monthlyBills, setMonthlyBills] = useState({
    total: 0,
    items: [],
    dueDate: null
  });

  // Add these functions after your existing state declarations
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Modify your calculateStats function to include today's total
  const calculateStats = (expenseData) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day
    
    // Today's total - only count expenses (negative amounts)
    const todayExpenses = expenseData.filter(exp => {
      const expDate = new Date(exp.date);
      expDate.setHours(0, 0, 0, 0);
      return expDate.getTime() === today.getTime() && exp.type === 'expense';
    }).reduce((sum, exp) => sum + Math.abs(exp.amount), 0);

    // This month's total
    const thisMonth = today.getMonth();
    const monthExpenses = expenseData.filter(exp => 
      new Date(exp.date).getMonth() === thisMonth && exp.type === 'expense'
    ).reduce((sum, exp) => sum + Math.abs(exp.amount), 0);

    // Average daily (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const last30DaysExpenses = expenseData.filter(exp => 
      new Date(exp.date) >= thirtyDaysAgo
    );
    
    const averageDaily = last30DaysExpenses.length > 0 
      ? last30DaysExpenses.reduce((sum, exp) => sum + Math.abs(exp.amount), 0) / 30 
      : 0;

    // Calculate percentage of monthly budget
    const monthlyPercentage = (monthExpenses / stats.monthlyBudget) * 100;

    setStats({
      today: todayExpenses,
      thisMonth: monthExpenses,
      average: averageDaily,
      monthlyBudget: stats.monthlyBudget,
      monthlyPercentage: monthlyPercentage || 0
    });
  };

  const calculateMonthlyBills = (allExpenses) => {
    const today = new Date();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const isLastDayOfMonth = today.getDate() === lastDayOfMonth;

    // Filter bills from all expenses
    const bills = allExpenses.filter(exp => exp.expenseType === 'bills');
    
    // Calculate total bills
    const billsTotal = bills.reduce((sum, bill) => sum + Math.abs(bill.amount), 0);

    setMonthlyBills({
      total: billsTotal,
      items: bills,
      dueDate: lastDayOfMonth
    });

    // If it's the last day of the month, show bills summary
    if (isLastDayOfMonth) {
      // You could trigger a notification or summary display here
      console.log('Monthly Bills Summary:', {
        total: billsTotal,
        breakdown: bills
      });
    }
  };

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      const response = await fetch('http://localhost:5002/api/transactions', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        throw new Error('Failed to fetch expenses');
      }

      const data = await response.json();
      const expenseTransactions = data.transactions.filter(t => t.type === 'expense');
      setExpenses(expenseTransactions);

      if (data.summary) {
        setStats(prev => ({
          ...prev,
          today: data.summary.today || 0,
          thisMonth: data.summary.thisMonth || 0,
          monthlyPercentage: (data.summary.thisMonth / prev.monthlyBudget) * 100 || 0
        }));
      }

      calculateMonthlyBills(data.transactions);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`http://localhost:5002/api/transactions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setExpenses(prev => prev.filter(exp => exp._id !== id));
        // Refetch to update stats
        fetchExpenses();
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const handleExpenseAdded = () => {
    fetchExpenses(); // Refresh expenses list
    setError(null); // Clear any existing errors
  };

  // Filter controls component
  const FilterControls = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-6">
      {/* Filter Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Filter Expenses
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Narrow down your transactions
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          {showFilters ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>
      </div>

      {/* Filter Content - Collapsible */}
      {showFilters && (
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Date Range Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Time Period
              </label>
              <select
                value={filterOptions.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category
              </label>
              <select
                value={filterOptions.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {/* Add your categories here */}
              </select>
            </div>

            {/* Search Box */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={filterOptions.searchQuery}
                  onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                  placeholder="Search expenses..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
                />
                <span className="absolute left-3 top-2.5 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          {/* Custom Date Range */}
          {filterOptions.dateRange === 'custom' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filterOptions.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  End Date
                </label>
                <input
                  type="date"
                  value={filterOptions.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Sort Controls */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
              <select
                value={filterOptions.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
              >
                <option value="date">Date</option>
                <option value="amount">Amount</option>
                <option value="category">Category</option>
              </select>
              <button
                onClick={() => handleFilterChange('sortOrder', filterOptions.sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
              >
                {filterOptions.sortOrder === 'asc' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9M3 12h5m0 0v8m0-8h2" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h5m0 0v-8m0 8h2" />
                  </svg>
                )}
              </button>
            </div>
            
            <button
              onClick={() => {
                setFilterOptions({
                  dateRange: 'all',
                  startDate: '',
                  endDate: '',
                  category: 'all',
                  searchQuery: '',
                  sortBy: 'date',
                  sortOrder: 'desc'
                });
              }}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Filter and sort logic
  const getFilteredExpenses = useCallback(() => {
    return expenses;
  }, [expenses]);

  const handleFilterChange = (key, value) => {
    setFilterOptions(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    fetchExpenses();
  }, [filterOptions]);

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading expenses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
          {error}
          <button 
            onClick={() => { setError(null); fetchExpenses(); }}
            className="ml-4 text-sm underline hover:text-red-700 dark:hover:text-red-300"
          >
            Try again
          </button>
        </div>
      )}

      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Expenses Manager
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Track and manage your daily expenses
        </p>
      </div>

      {/* Bills Summary Section - Shows on last day of month */}
      {new Date().getDate() === monthlyBills.dueDate && (
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-xl border border-yellow-200 dark:border-yellow-800">
          <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
            Monthly Bills Due Today
          </h3>
          <p className="text-yellow-700 dark:text-yellow-300">
            Total Amount Due: {formatCurrency(monthlyBills.total)}
          </p>
          <div className="mt-3 space-y-2">
            {monthlyBills.items.map((bill, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{bill.category}</span>
                <span>{formatCurrency(Math.abs(bill.amount))}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <FilterControls />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Today&apos;s Expenses</h3>
            <span className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{formatCurrency(stats.today)}</p>
          <p className="text-sm text-red-600 dark:text-red-400">Today&apos;s spending</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">This Month</h3>
            <span className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{formatCurrency(stats.thisMonth)}</p>
          <p className="text-sm text-indigo-600 dark:text-indigo-400">
            {(stats.monthlyPercentage || 0).toFixed(1)}% of monthly budget
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Average Daily</h3>
            <span className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{formatCurrency(stats.average)}</p>
          <p className="text-sm text-green-600 dark:text-green-400">Based on last 30 days</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Add Expense Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Add New Expense
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Record your daily expenses
              </p>
            </div>
            <div className="p-6">
              <ExpenseForm onSuccess={handleExpenseAdded} />
            </div>
          </div>
        </div>

        {/* Recent Expenses Card */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">Recent Expenses</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Your latest spending activity</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <div className="text-red-500 mb-2">⚠️ {error}</div>
                  <button 
                    onClick={fetchExpenses}
                    className="text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Try Again
                  </button>
                </div>
              ) : expenses.length > 0 ? (
                <div className="space-y-4">
                  {expenses.map((expense) => (
                    <div 
                      key={expense._id} 
                      className="flex items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group"
                    >
                      <div className="h-12 w-12 flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/30 rounded-xl mr-4">
                        <span className="text-2xl">{expense.icon}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div>
                            <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                              {expense.category}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {expense.description}
                            </p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <p className="font-bold text-red-600 dark:text-red-400">
                              {formatCurrency(Math.abs(expense.amount))}
                            </p>
                            <button
                              onClick={() => handleDeleteExpense(expense._id)}
                              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-all duration-200"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-400 dark:text-gray-500">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(expense.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">💸</div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No expenses yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Start tracking your expenses by adding your first expense
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Expenses; 