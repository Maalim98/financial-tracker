import { useState } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { formatCurrency } from '../utils/formatCurrency';

function Reports() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [comparisonType, setComparisonType] = useState('budget');

  const categories = [
    { 
      id: 'food', 
      label: 'Food & Dining', 
      icon: '🍽️',
      subcategories: ['Groceries', 'Restaurants', 'Coffee Shops', 'Food Delivery'],
      budget: 25000,
      actual: 28500
    },
    { 
      id: 'transport', 
      label: 'Transportation', 
      icon: '🚗',
      subcategories: ['Fuel', 'Public Transport', 'Taxi/Uber', 'Maintenance'],
      budget: 15000,
      actual: 12000
    },
    { 
      id: 'utilities', 
      label: 'Utilities', 
      icon: '⚡',
      subcategories: ['Electricity', 'Water', 'Internet', 'Phone'],
      budget: 10000,
      actual: 9500
    },
    { 
      id: 'shopping', 
      label: 'Shopping', 
      icon: '🛍️',
      subcategories: ['Clothing', 'Electronics', 'Home', 'Personal Care'],
      budget: 20000,
      actual: 25000
    },
    { 
      id: 'entertainment', 
      label: 'Entertainment', 
      icon: '🎬',
      subcategories: ['Movies', 'Games', 'Events', 'Subscriptions'],
      budget: 8000,
      actual: 7500
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Advanced Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400">Deep dive into your spending patterns</p>
      </div>

      {/* Analysis Type Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
        <div className="flex space-x-4">
                  <button
            onClick={() => setComparisonType('budget')}
            className={`px-4 py-2 rounded-lg ${
              comparisonType === 'budget' 
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            Budget vs Actual
                  </button>
                  <button
            onClick={() => setComparisonType('previous')}
            className={`px-4 py-2 rounded-lg ${
              comparisonType === 'previous' 
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            Previous Period
                  </button>
          <button
            onClick={() => setComparisonType('custom')}
            className={`px-4 py-2 rounded-lg ${
              comparisonType === 'custom' 
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            Custom Comparison
                </button>
            </div>
          </div>

      {/* Main Analysis Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Category Details */}
        <div className="lg:col-span-2 space-y-6">
          {selectedCategory ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{selectedCategory.icon}</span>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {selectedCategory.label} Analysis
                  </h3>
                </div>
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ← Back to Overview
                </button>
              </div>
              
              {/* Subcategory Breakdown */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {selectedCategory.subcategories.map(sub => (
                  <div key={sub} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{sub}</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                      {formatCurrency(Math.random() * 10000)}
                    </p>
                  </div>
                ))}
            </div>

              {/* Detailed Chart */}
              <div className="h-[300px]">
                <Line
                  data={{
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                    datasets: [
                      {
                        label: 'Actual',
                        data: [7500, 8200, 6800, 6000],
                        borderColor: 'rgb(99, 102, 241)',
                        tension: 0.4,
                      },
                      {
                        label: 'Budget',
                        data: [6250, 6250, 6250, 6250],
                        borderColor: 'rgb(234, 179, 8)',
                        borderDash: [5, 5],
                        tension: 0.4,
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                      }
                    }
                  }}
                />
              </div>
            </div>
          ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Select a category for detailed analysis
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {categories.map(category => (
                <button
                  key={category.id}
                    onClick={() => setSelectedCategory(category)}
                    className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{category.icon}</span>
                      <div className="text-left">
                        <p className="font-medium text-gray-900 dark:text-white">
                    {category.label}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Budget: {formatCurrency(category.budget)}
                        </p>
                      </div>
                  </div>
                </button>
              ))}
            </div>
            </div>
          )}
        </div>

        {/* Analysis Controls */}
        <div className="space-y-6">
          {/* Download Reports Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Download Reports
            </h3>
            <div className="space-y-4">
              {/* Monthly Report */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Monthly Report</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Complete analysis of February 2024
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    Download
                  </button>
                </div>
              </div>

              {/* Category Report */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Category Report</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Detailed category-wise breakdown
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    Download
                  </button>
                </div>
              </div>

              {/* Custom Report */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Custom Report</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Generate a custom report
                    </p>
                  </div>
                  <button className="px-4 py-2 border border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors">
                    Generate
                  </button>
                </div>
              </div>
            </div>

            {/* Export Options */}
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">Export Data</h4>
              <div className="flex space-x-4">
                <button className="flex items-center px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Excel
                </button>
                <button className="flex items-center px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  PDF
                </button>
                <button className="flex items-center px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                  </svg>
                  CSV
                </button>
              </div>
            </div>
          </div>

          {/* Insights section remains the same */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Insights
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Food & Dining is 14% over budget this month
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-200">
                  Transportation spending reduced by 20%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports; 