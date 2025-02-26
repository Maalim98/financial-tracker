import { useState } from 'react';
import PropTypes from 'prop-types';

function ExpenseForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    icon: '',
    type: 'daily' // Add type to distinguish between daily and bills
  });
  
  // Add error state
  const [errors, setErrors] = useState({});

  // Split categories into daily expenses and bills
  const categories = {
    daily: [
      { id: 'food', label: 'Food & Dining', icon: '🍽️' },
      { id: 'transport', label: 'Transportation', icon: '🚗' },
      { id: 'shopping', label: 'Shopping', icon: '🛍️' },
      { id: 'entertainment', label: 'Entertainment', icon: '🎬' },
      { id: 'health', label: 'Healthcare', icon: '🏥' },
      { id: 'other', label: 'Other', icon: '📌' },
    ],
    bills: [
      { id: 'rent', label: 'Rent', icon: '🏠' },
      { id: 'utilities', label: 'Utilities', icon: '⚡' },
      { id: 'internet', label: 'Internet', icon: '🌐' },
      { id: 'phone', label: 'Phone Bill', icon: '📱' },
      { id: 'insurance', label: 'Insurance', icon: '🔒' },
      { id: 'subscription', label: 'Subscriptions', icon: '📺' },
    ]
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Clear error when user starts typing
    setErrors(prev => ({ ...prev, [name]: '' }));

    if (name === 'category') {
      const selectedCategory = categories[formData.type].find(cat => cat.id === value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        icon: selectedCategory ? selectedCategory.icon : '💰'
      }));
    } else if (name === 'amount') {
      // Validate amount as user types
      if (Number(value) <= 0) {
        setErrors(prev => ({ ...prev, amount: 'Amount must be greater than zero' }));
      }
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      console.log('Submitting expense...'); // Debug log
      const submitData = {
        type: 'expense',
        expenseType: formData.type, // Add expense type (daily/bill)
        category: categories[formData.type].find(cat => cat.id === formData.category)?.label || formData.category,
        amount: -Math.abs(Number(formData.amount)),
        description: formData.description,
        date: formData.date,
        icon: formData.icon
      };

      const response = await fetch('http://localhost:5002/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add expense');
      }

      const data = await response.json();
      console.log('Expense added successfully:', data);
      
      // Reset form
      setFormData({
        category: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        icon: '',
        type: 'daily'
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      setErrors(prev => ({ 
        ...prev, 
        submit: error.message || 'Failed to connect to server. Please try again.' 
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.submit && (
        <div className="p-3 bg-red-100 text-red-600 rounded-lg text-sm">
          {errors.submit}
        </div>
      )}
      
      {/* Expense Type Toggle */}
      <div className="flex space-x-4 mb-4">
        <button
          type="button"
          onClick={() => setFormData(prev => ({ ...prev, type: 'daily' }))}
          className={`flex-1 py-2 px-4 rounded-lg ${
            formData.type === 'daily'
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
          }`}
        >
          Daily Expenses
        </button>
        <button
          type="button"
          onClick={() => setFormData(prev => ({ ...prev, type: 'bills' }))}
          className={`flex-1 py-2 px-4 rounded-lg ${
            formData.type === 'bills'
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
          }`}
        >
          Bills
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {formData.type === 'daily' ? 'Expense Category' : 'Bill Type'}
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            required
          >
            <option value="">Select a category</option>
            {categories[formData.type].map(category => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Amount (KSH)
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.amount ? 'border-red-500' : 'border-gray-300'
            } bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400`}
            required
            min="0.01"
            step="0.01"
          />
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
            className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-200 hover:scale-[1.02]"
      >
        Add {formData.type === 'daily' ? 'Expense' : 'Bill'}
      </button>
    </form>
  );
}

ExpenseForm.propTypes = {
  onSuccess: PropTypes.func
};

ExpenseForm.defaultProps = {
  onSuccess: () => {}
};

export default ExpenseForm; 