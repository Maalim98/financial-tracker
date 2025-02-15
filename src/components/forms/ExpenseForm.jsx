import { useState } from 'react';
import { formatCurrency } from '../../utils/formatCurrency';

function ExpenseForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    icon: ''
  });

  const categories = [
    { id: 'food', label: 'Food & Dining', icon: '🍽️' },
    { id: 'transport', label: 'Transportation', icon: '🚗' },
    { id: 'utilities', label: 'Utilities', icon: '⚡' },
    { id: 'rent', label: 'Rent', icon: '🏠' },
    { id: 'shopping', label: 'Shopping', icon: '🛍️' },
    { id: 'entertainment', label: 'Entertainment', icon: '🎬' },
    { id: 'health', label: 'Healthcare', icon: '🏥' },
    { id: 'other', label: 'Other', icon: '📌' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category') {
      // When category changes, update the icon too
      const selectedCategory = categories.find(cat => cat.id === value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        icon: selectedCategory ? selectedCategory.icon : '💰'
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5002/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          type: 'expense',
          category: categories.find(cat => cat.id === formData.category)?.label || formData.category,
          amount: Number(formData.amount),
          description: formData.description,
          date: formData.date,
          icon: formData.icon
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Expense added:', data);
        // Reset form
        setFormData({
          category: '',
          amount: '',
          date: new Date().toISOString().split('T')[0],
          description: '',
          icon: ''
        });
        // Call the success callback to refresh the list
        onSuccess();
      } else {
        const errorData = await response.json();
        console.error('Failed to add expense:', errorData.message);
      }
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            required
          >
            <option value="">Select a category</option>
            {categories.map(category => (
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
            className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            required
            min="0"
            step="0.01"
          />
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
        Add Expense
      </button>
    </form>
  );
}

export default ExpenseForm; 