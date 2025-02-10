import { useState } from 'react';

function Notifications() {
  const [notifications] = useState([
    {
      id: 1,
      message: 'Electricity bill due in 3 days',
      type: 'warning',
      time: '10 min ago'
    },
    {
      id: 2,
      message: 'Entertainment budget is 90% used',
      type: 'alert',
      time: '30 min ago'
    },
    {
      id: 3,
      message: 'Emergency fund goal is 50% complete!',
      type: 'success',
      time: '1 hour ago'
    }
  ]);

  const getIcon = (type) => {
    switch (type) {
      case 'warning': return '⚠️';
      case 'alert': return '🔔';
      case 'success': return '✅';
      default: return 'ℹ️';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notifications</h2>
      <div className="space-y-3">
        {notifications.map(notif => (
          <div key={notif.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <span className="text-xl">{getIcon(notif.type)}</span>
            <div className="flex-1">
              <p className="text-gray-900 dark:text-white">{notif.message}</p>
              <p className="text-sm text-gray-500 mt-1">{notif.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications; 