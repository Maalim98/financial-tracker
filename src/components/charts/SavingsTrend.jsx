import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function SavingsTrend() {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Savings',
        data: [1200, 1350, 1250, 1500, 1750, 2000],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Target',
        data: [1000, 1200, 1400, 1600, 1800, 2000],
        borderColor: 'rgb(249, 115, 22)',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        borderDash: [5, 5],
        tension: 0.4,
        fill: true,
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
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
          callback: (value) => `$${value}`
        }
      },
      x: {
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
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
        Savings Trend
      </h3>
      <div className="h-80">
        <Line data={data} options={options} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">Current Savings</p>
          <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">$2,000</p>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">Target Savings</p>
          <p className="text-xl font-bold text-orange-600 dark:text-orange-400">$2,000</p>
        </div>
      </div>
    </div>
  );
}

export default SavingsTrend; 