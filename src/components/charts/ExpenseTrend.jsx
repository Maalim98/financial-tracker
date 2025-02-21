import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { formatCurrency } from '../../utils/formatCurrency';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function ExpenseTrend() {
  const [trendData, setTrendData] = useState({
    labels: [],
    expenses: [],
    income: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5002/api/transactions/trends', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Failed to fetch trend data');

        const data = await response.json();
        
        // Process the data for the chart
        const months = Object.keys(data).sort();
        const monthLabels = months.map(month => {
          const [year, monthNum] = month.split('-');
          return new Date(year, monthNum - 1).toLocaleString('default', { month: 'short' });
        });

        setTrendData({
          labels: monthLabels,
          expenses: months.map(month => data[month].expenses),
          income: months.map(month => data[month].income)
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendData();
  }, []);

  const data = {
    labels: trendData.labels,
    datasets: [
      {
        label: 'Monthly Expenses',
        data: trendData.expenses,
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderRadius: 8,
      },
      {
        label: 'Monthly Income',
        data: trendData.income,
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderRadius: 8,
      }
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'rgb(156, 163, 175)',
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${formatCurrency(context.raw)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
          callback: (value) => formatCurrency(value)
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
        }
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
        Income vs Expenses
      </h3>
      <div className="h-64">
        <Bar data={data} options={options} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">Average Income</p>
          <p className="text-lg font-bold text-green-600 dark:text-green-400">
            {formatCurrency(trendData.income.reduce((a, b) => a + b, 0) / trendData.income.length || 0)}
          </p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/30 p-3 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">Average Expenses</p>
          <p className="text-lg font-bold text-red-600 dark:text-red-400">
            {formatCurrency(trendData.expenses.reduce((a, b) => a + b, 0) / trendData.expenses.length || 0)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ExpenseTrend; 