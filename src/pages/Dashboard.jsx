import { useAuth } from '../context/AuthContext';
import SpendingOverview from '../components/charts/SpendingOverview';
import ExpenseTrend from '../components/charts/ExpenseTrend';
import { formatCurrency } from '../utils/formatCurrency';
import BillReminders from '../components/BillReminders';
import Notifications from '../components/Notifications';
import { useState, useEffect } from 'react';

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const { user } = useAuth();

  const fetchTransactions = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/transactions', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      const response = await fetch(`http://localhost:5002/api/transactions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setTransactions(prev => prev.filter(t => t._id !== id));
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
          Welcome back, {user?.name || 'User'}! 👋
        </h1>
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
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div 
                key={transaction._id} 
                className="flex items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="h-12 w-12 flex items-center justify-center bg-gray-100 dark:bg-gray-600 rounded-xl mr-4">
                  <span className="text-2xl">{transaction.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">{transaction.category}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.description}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <p className={`font-bold ${
                        transaction.type === 'income' 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(Math.abs(transaction.amount))}
                      </p>
                      <button
                        onClick={() => handleDeleteTransaction(transaction._id)}
                        className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add new sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <BillReminders />
        <Notifications />
      </div>
    </div>
  );
}

export default Dashboard; 