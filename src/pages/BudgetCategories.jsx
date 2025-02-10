import React, { useState } from 'react';
import { formatCurrency } from '../utils/formatCurrency';

function BudgetCategories() {
  const [categories] = useState([
    { 
      id: 1, 
      name: 'Food & Dining', 
      icon: '🍽️', 
      limit: 25000, 
      used: 18000,
      subcategories: ['Groceries', 'Restaurants', 'Delivery']
    },
    { 
      id: 2, 
      name: 'Transportation', 
      icon: '🚗', 
      limit: 15000, 
      used: 12000,
      subcategories: ['Fuel', 'Public Transit', 'Maintenance']
    },
    { 
      id: 3, 
      name: 'Housing', 
      icon: '🏠', 
      limit: 45000, 
      used: 42000,
      subcategories: ['Rent', 'Utilities', 'Internet']
    },
    { 
      id: 4, 
      name: 'Entertainment', 
      icon: '🎬', 
      limit: 10000, 
      used: 8500,
      subcategories: ['Movies', 'Games', 'Subscriptions']
    }
  ]);

  const [showAddCategory, setShowAddCategory] = useState(false);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Budget Categories</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your spending limits</p>
        </div>
        <button 
          onClick={() => setShowAddCategory(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Add Category
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
          <h3 className="text-green-800 dark:text-green-200 font-medium">Under Budget</h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">2 Categories</p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg">
          <h3 className="text-yellow-800 dark:text-yellow-200 font-medium">Near Limit</h3>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">1 Category</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
          <h3 className="text-red-800 dark:text-red-200 font-medium">Over Budget</h3>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">1 Category</p>
        </div>
      </div>

      {/* Categories List */}
      <div className="space-y-4">
        {categories.map(cat => {
          const percentUsed = (cat.used / cat.limit) * 100;
          const getProgressColor = () => {
            if (percentUsed >= 100) return 'bg-red-500';
            if (percentUsed >= 80) return 'bg-yellow-500';
            return 'bg-green-500';
          };

          return (
            <div key={cat.id} className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cat.icon}</span>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{cat.name}</h3>
                    <p className="text-sm text-gray-500">
                      {cat.subcategories.join(' • ')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(cat.used)} / {formatCurrency(cat.limit)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {percentUsed.toFixed(1)}% used
                  </p>
                </div>
              </div>
              
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                <div 
                  className={`h-full rounded-full transition-all ${getProgressColor()}`}
                  style={{ width: `${Math.min(percentUsed, 100)}%` }}
                />
              </div>

              <div className="flex justify-end mt-4 space-x-2">
                <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  Edit
                </button>
                <button className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Category Modal */}
      {showAddCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Category</h2>
            {/* Add form here */}
            <button 
              onClick={() => setShowAddCategory(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BudgetCategories; 