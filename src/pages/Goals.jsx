import { useState } from 'react';
import { formatCurrency } from '../utils/formatCurrency';

function Goals() {
  const [showAddGoal, setShowAddGoal] = useState(false);

  const goals = [
    {
      id: 1,
      title: 'Buy a Car',
      target: 1500000,
      saved: 500000,
      deadline: '2024-12-31',
      icon: '🚗'
    },
    {
      id: 2,
      title: 'Emergency Fund',
      target: 300000,
      saved: 150000,
      deadline: '2024-06-30',
      icon: '🏦'
    },
    {
      id: 3,
      title: 'Vacation',
      target: 200000,
      saved: 50000,
      deadline: '2024-08-15',
      icon: '✈️'
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Financial Goals</h1>
        <button
          onClick={() => setShowAddGoal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Add Goal
        </button>
      </div>

      <div className="grid gap-4">
        {goals.map(goal => {
          const progress = (goal.saved / goal.target) * 100;
          return (
            <div 
              key={goal.id} 
              className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{goal.icon}</span>
                  <h3 className="font-medium text-gray-900 dark:text-white">{goal.title}</h3>
                </div>
                <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  {progress.toFixed(0)}%
                </span>
              </div>

              <div className="mt-4">
                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  {formatCurrency(goal.saved)} saved
                </span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {formatCurrency(goal.target)} goal
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {showAddGoal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">New Goal</h2>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Goal name"
                className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <input
                type="number"
                placeholder="Target amount"
                className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <input
                type="date"
                className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddGoal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Create
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