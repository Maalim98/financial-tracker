import { useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function Goals() {
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: 'Emergency Fund',
      target: 50000,
      current: 30000,
      deadline: '2024-12-31',
      category: 'Savings',
      color: '#4F46E5'
    },
    {
      id: 2,
      title: 'New Car',
      target: 1500000,
      current: 500000,
      deadline: '2025-06-30',
      category: 'Purchase',
      color: '#7C3AED'
    },
    // Add more sample goals
  ]);

  const [showNewGoalModal, setShowNewGoalModal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    target: '',
    deadline: '',
    category: 'Savings',
    current: 0
  });

  const handleAddGoal = (e) => {
    e.preventDefault();
    setGoals(prev => [...prev, {
      ...newGoal,
      id: Date.now(),
      color: '#4F46E5',
      target: Number(newGoal.target),
    }]);
    setNewGoal({
      title: '',
      target: '',
      deadline: '',
      category: 'Savings',
      current: 0
    });
    setShowNewGoalModal(false);
  };

  const calculateProgress = (current, target) => {
    return (current / target) * 100;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Financial Goals</h1>
          <p className="text-gray-500 dark:text-gray-400">Track and manage your financial goals</p>
        </div>
        <button
          onClick={() => setShowNewGoalModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add New Goal
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map(goal => (
          <div
            key={goal.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{goal.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{goal.category}</p>
              </div>
              <div className="w-20 h-20">
                <CircularProgressbar
                  value={calculateProgress(goal.current, goal.target)}
                  text={`${Math.round(calculateProgress(goal.current, goal.target))}%`}
                  styles={buildStyles({
                    pathColor: goal.color,
                    textColor: goal.color,
                    trailColor: '#E5E7EB'
                  })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Current</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(goal.current)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Target</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(goal.target)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Deadline</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(goal.deadline).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button className="w-full px-4 py-2 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg">
                Update Progress
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Goal Modal */}
      {showNewGoalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Goal</h2>
              <button
                onClick={() => setShowNewGoalModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddGoal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Goal Title
                </label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Target Amount
                </label>
                <input
                  type="number"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, target: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Deadline
                </label>
                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="Savings">Savings</option>
                  <option value="Purchase">Purchase</option>
                  <option value="Investment">Investment</option>
                  <option value="Debt">Debt Repayment</option>
                  <option value="Education">Education</option>
                  <option value="Travel">Travel</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowNewGoalModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
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