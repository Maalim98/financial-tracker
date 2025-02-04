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
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Monthly Expenses',
        data: [15000, 18000, 22600, 19500, 21000, 22600],
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderRadius: 8,
      },
      {
        label: 'Monthly Income',
        data: [35000, 35000, 35000, 35000, 35000, 35000],
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
            {formatCurrency(35000)}
          </p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/30 p-3 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">Average Expenses</p>
          <p className="text-lg font-bold text-red-600 dark:text-red-400">
            {formatCurrency(19783)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ExpenseTrend; 