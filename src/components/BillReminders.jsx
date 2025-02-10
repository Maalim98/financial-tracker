import { useState } from 'react';
import { formatCurrency } from '../utils/formatCurrency';

function BillReminders() {
  const [bills] = useState([
    { id: 1, name: 'Electricity', amount: 5000, dueDate: '2024-03-25', icon: '⚡' },
    { id: 2, name: 'Internet', amount: 2500, dueDate: '2024-03-28', icon: '🌐' },
    { id: 3, name: 'Water', amount: 1200, dueDate: '2024-03-30', icon: '💧' }
  ]);

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Bills</h2>
      <div className="space-y-3">
        {bills.map(bill => (
          <div key={bill.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-xl">{bill.icon}</span>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{bill.name}</p>
                <p className="text-sm text-gray-500">Due in {getDaysUntilDue(bill.dueDate)} days</p>
              </div>
            </div>
            <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(bill.amount)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BillReminders; 