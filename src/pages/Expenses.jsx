import ExpenseForm from '../components/forms/ExpenseForm';
import { formatCurrency } from '../utils/formatCurrency';
import { useState, useEffect } from 'react';

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState({
    today: 0,
    thisMonth: 0,
    average: 0,
    monthlyBudget: 35000,
    monthlyPercentage: 0  // Initialize monthlyPercentage
  });

  // Calculate stats from expenses
  const calculateStats = (expenseData) => {
    const today = new Date().toISOString().split('T')[0];
    const thisMonth = new Date().getMonth();
    
    // Today's total
    const todayExpenses = expenseData.filter(exp => 
      new Date(exp.date).toISOString().split('T')[0] === today
    ).reduce((sum, exp) => sum + Math.abs(exp.amount), 0);

    // This month's total
    const monthExpenses = expenseData.filter(exp => 
      new Date(exp.date).getMonth() === thisMonth
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
      monthlyPercentage: monthlyPercentage || 0  // Provide default value
    });
  };

  // Fetch expenses and calculate stats
  const fetchExpenses = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/transactions', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      const expenseData = data.filter(transaction => transaction.type === 'expense');
      setExpenses(expenseData);
      calculateStats(expenseData);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      const response = await fetch(`http://localhost:5002/api/transactions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setExpenses(prev => prev.filter(exp => exp._id !== id));
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const cleanupTestExpenses = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/transactions/cleanup/test', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        // Refresh the expenses list
        fetchExpenses();
      }
    } catch (error) {
      console.error('Error cleaning up test expenses:', error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Expenses Manager</h1>
        <p className="text-gray-600 dark:text-gray-400">Track and manage your daily expenses</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                Fill in the details to record a new expense
              </p>
            </div>
            <div className="p-6">
              <ExpenseForm onSuccess={() => {
                console.log('Expense added, refreshing list...');
                fetchExpenses();
              }} />
            </div>
          </div>
        </div>

        {/* Recent Expenses List */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Recent Expenses</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {expenses.map((expense) => (
                  <div 
                    key={expense._id}
                    className="flex items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="p-3 bg-gray-100 dark:bg-gray-600 rounded-lg mr-4">
                      <span className="text-2xl">{expense.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-gray-200">{expense.category}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{expense.description}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <p className="font-bold text-red-600 dark:text-red-400">
                            {formatCurrency(Math.abs(expense.amount))}
                          </p>
                          <button
                            onClick={() => handleDeleteExpense(expense._id)}
                            className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 dark:text-gray-500">
                        {new Date(expense.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={cleanupTestExpenses}
        className="px-4 py-2 bg-red-600 text-white rounded-lg"
      >
        Clean Up Test Expenses
      </button>
    </div>
  );
}

export default Expenses; 