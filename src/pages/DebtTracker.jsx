import React, { useState } from 'react';
import { formatCurrency } from '../utils/formatCurrency';

function DebtTracker() {
  const [debts] = useState([
    {
      id: 1,
      name: 'Car Loan',
      total: 500000,
      remaining: 350000,
      interest: 12.5,
      dueDate: '2024-03-30'
    },
    // ...
  ]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Debt Tracker</h1>
      <div className="grid gap-4">
        {debts.map(debt => (
          <div key={debt.id} className="bg-white p-4 rounded-lg">
            <div className="flex justify-between">
              <h3 className="font-medium">{debt.name}</h3>
              <span className="text-red-600">{formatCurrency(debt.remaining)}</span>
            </div>
            <div className="mt-2 h-2 bg-gray-100 rounded-full">
              <div 
                className="h-full bg-red-500 rounded-full"
                style={{ width: `${(debt.remaining/debt.total) * 100}%` }}
              />
            </div>
            <div className="mt-2 text-sm text-gray-500">
              {debt.interest}% Interest • Due {debt.dueDate}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DebtTracker; 