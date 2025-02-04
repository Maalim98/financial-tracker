import { useState } from 'react';
import { formatCurrency } from '../../utils/formatCurrency';

function IncomeForm() {
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  const categories = [
    { id: 'salary', label: 'Salary', icon: '💰' },
    { id: 'freelance', label: 'Freelance', icon: '💻' },
    { id: 'investments', label: 'Investments', icon: '📈' },
    { id: 'business', label: 'Business', icon: '🏢' },
    { id: 'rental', label: 'Rental', icon: '🏠' },
    { id: 'side_hustle', label: 'Side Hustle', icon: '🎯' },
    { id: 'gifts', label: 'Gifts', icon: '🎁' },
    { id: 'other', label: 'Other', icon: '📌' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({
      category: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <div>
          <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-3">
            Income Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-5 py-3.5 text-base rounded-xl border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
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
          <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-3">
            Amount (KSH)
          </label>
          <div className="relative">
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0"
              className="w-full pl-12 pr-5 py-3.5 text-lg font-semibold rounded-xl border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
              required
              min="0"
              step="1"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
              KSH
            </span>
          </div>
        </div>

        <div>
          <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-3">
            Date Received
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-5 py-3.5 text-base rounded-xl border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
            required
          />
        </div>

        <div>
          <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-3">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add notes about this income"
            rows="3"
            className="w-full px-5 py-3.5 text-base rounded-xl border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 resize-none"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="px-8 py-4 bg-emerald-600 text-white text-lg font-semibold rounded-xl hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transform transition-all duration-200 hover:scale-[1.02] w-full md:w-auto"
        >
          Add Income
        </button>
      </div>
    </form>
  );
}

export default IncomeForm; 