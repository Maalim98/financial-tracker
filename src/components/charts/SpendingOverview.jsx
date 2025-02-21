import { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { formatCurrency } from '../../utils/formatCurrency';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function SpendingOverview() {
  const [chartData, setChartData] = useState({
    labels: [],
    amounts: [],
    total: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Colors for different categories
  const categoryColors = {
    backgroundColor: [
      'rgba(255, 99, 132, 0.8)',   // Food
      'rgba(54, 162, 235, 0.8)',   // Transport
      'rgba(255, 206, 86, 0.8)',   // Shopping
      'rgba(75, 192, 192, 0.8)',   // Entertainment
      'rgba(153, 102, 255, 0.8)',  // Health
      'rgba(255, 159, 64, 0.8)',   // Other
    ],
    borderColor: [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)',
      'rgba(255, 159, 64, 1)',
    ]
  };

  useEffect(() => {
    const fetchMonthlyExpenses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5002/api/transactions', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Failed to fetch expenses');

        const data = await response.json();
        
        // Filter for current month's expenses
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        
        const monthlyExpenses = data.transactions.filter(transaction => {
          const expenseDate = new Date(transaction.date);
          return expenseDate.getMonth() === currentMonth && 
                 expenseDate.getFullYear() === currentYear &&
                 transaction.type === 'expense';
        });

        // Group by category
        const categoryTotals = monthlyExpenses.reduce((acc, expense) => {
          const category = expense.category;
          if (!acc[category]) {
            acc[category] = 0;
          }
          acc[category] += Math.abs(expense.amount);
          return acc;
        }, {});

        // Calculate total
        const total = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

        setChartData({
          labels: Object.keys(categoryTotals),
          amounts: Object.values(categoryTotals),
          total: total
        });

      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMonthlyExpenses();
  }, []);

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        data: chartData.amounts,
        backgroundColor: categoryColors.backgroundColor.slice(0, chartData.labels.length),
        borderColor: categoryColors.borderColor.slice(0, chartData.labels.length),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: 'rgb(156, 163, 175)',
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          },
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => ({
                text: `${label} - ${formatCurrency(data.datasets[0].data[i])}`,
                fillStyle: data.datasets[0].backgroundColor[i],
                strokeStyle: data.datasets[0].borderColor[i],
                lineWidth: 1,
                hidden: false,
                index: i
              }));
            }
            return [];
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${formatCurrency(value)} (${percentage}%)`;
          }
        }
      }
    },
    maintainAspectRatio: false
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          Monthly Spending Overview
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Total: {formatCurrency(chartData.total)}
        </p>
      </div>
      <div className="h-64">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}

export default SpendingOverview; 