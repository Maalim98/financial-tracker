import { useState } from 'react';
import { formatCurrency } from '../utils/formatCurrency';

function Goals() {
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [selectedView, setSelectedView] = useState('grid'); // 'grid' or 'list'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'ongoing', 'completed'

  // Add sorting options
  const [sortBy, setSortBy] = useState('deadline'); // 'deadline', 'progress', 'amount'

  const goals = [
    {
      id: 1,
      title: 'Buy a Car',
      target: 1500000,
      saved: 500000,
      deadline: '2024-12-31',
      category: 'savings',
      icon: '🚗'
    },
    {
      id: 2,
      title: 'Emergency Fund',
      target: 300000,
      saved: 150000,
      deadline: '2024-06-30',
      category: 'emergency',
      icon: '🏦'
    },
    {
      id: 3,
      title: 'Vacation',
      target: 200000,
      saved: 50000,
      deadline: '2024-08-15',
      category: 'travel',
      icon: '✈️'
    }
  ];

  const filteredGoals = goals.filter(goal => {
    if (filterStatus === 'all') return true;
    const progress = (goal.saved / goal.target) * 100;
    return filterStatus === 'completed' ? progress === 100 : progress < 100;
  });

  return (
    <div className="p-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Financial Goals</h1>
          <p className="text-gray-600 dark:text-gray-400">Track and manage your financial targets</p>
        </div>
        <button
          onClick={() => setShowAddGoal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add New Goal
        </button>
      </div>

      {/* Add Filter and View Controls */}
      <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* View Toggle */}
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setSelectedView('grid')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                selectedView === 'grid'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setSelectedView('list')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                selectedView === 'list'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              List
            </button>
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm"
          >
            <option value="all">All Goals</option>
            <option value="ongoing">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm"
          >
            <option value="deadline">Deadline</option>
            <option value="progress">Progress</option>
            <option value="amount">Amount</option>
          </select>
        </div>

        {/* Summary Stats */}
        <div className="flex space-x-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg px-4 py-2 shadow-sm">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Goals</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{goals.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg px-4 py-2 shadow-sm">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Saved</p>
            <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(goals.reduce((sum, goal) => sum + goal.saved, 0))}
            </p>
          </div>
        </div>
      </div>

      {/* Goals Display */}
      {selectedView === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGoals.map(goal => {
            const progress = (goal.saved / goal.target) * 100;
            const deadline = new Date(goal.deadline);
            const daysLeft = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));

            return (
              <div key={goal.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-3xl mr-3">{goal.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{goal.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {daysLeft} days left
                      </p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500 dark:text-gray-400">Progress</span>
                    <span className="font-medium text-indigo-600 dark:text-indigo-400">{progress.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Saved</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(goal.saved)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Target</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(goal.target)}
                    </span>
                  </div>
                </div>

                <button className="w-full mt-6 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
                  Add Money
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          {filteredGoals.map(goal => {
            const progress = (goal.saved / goal.target) * 100;
            const deadline = new Date(goal.deadline);
            const daysLeft = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));

            return (
              <div 
                key={goal.id} 
                className="border-b border-gray-100 dark:border-gray-700 last:border-0 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl">{goal.icon}</span>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{goal.title}</h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {daysLeft} days left
                        </span>
                        <div className="w-32 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-600 rounded-full"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                          {progress.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(goal.saved)} / {formatCurrency(goal.target)}
                    </p>
                    <button className="mt-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                      Add Money
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Goal Modal */}
      {showAddGoal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Add New Goal</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Goal Title
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="e.g., Buy a Car"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Target Amount
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Deadline
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddGoal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Goals; 