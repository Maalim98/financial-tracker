import { useState } from 'react';
import { formatCurrency } from '../utils/formatCurrency';

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([
    { 
      id: 1,
      date: '2024-03-25', 
      type: 'bill', 
      title: 'Electricity Bill', 
      amount: 5000,
      status: 'pending',
      recurring: true
    },
    { 
      id: 2,
      date: '2024-03-30', 
      type: 'income', 
      title: 'Salary', 
      amount: 35000,
      status: 'upcoming',
      recurring: true
    },
    { 
      id: 3,
      date: '2024-03-28', 
      type: 'bill', 
      title: 'Internet Bill', 
      amount: 2500,
      status: 'pending',
      recurring: true
    }
  ]);

  const [showAddEvent, setShowAddEvent] = useState(false);

  // New state for form
  const [eventForm, setEventForm] = useState({
    title: '',
    type: 'bill', // or 'income'
    amount: '',
    date: new Date().toISOString().split('T')[0],
    recurring: false,
    status: 'pending'
  });

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    if (isEditing) {
      setSelectedEvent(prev => ({
        ...prev,
        [name]: newValue
      }));
    } else {
      setEventForm(prev => ({
        ...prev,
        [name]: newValue
      }));
    }
  };

  const handleDeleteEvent = (eventId) => {
    if (confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(event => event.id !== eventId));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEvent = {
      id: Date.now(),
      ...eventForm,
      amount: Number(eventForm.amount)
    };
    
    setEvents(prev => [...prev, newEvent]);
    
    // Reset form and close modal
    setEventForm({
      title: '',
      type: 'bill',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      recurring: false,
      status: 'pending'
    });
    setShowAddEvent(false);
  };

  const handleEdit = () => {
    setEvents(prev => prev.map(event => 
      event.id === selectedEvent.id ? selectedEvent : event
    ));
    setSelectedEvent(null);
    setIsEditing(false);
  };

  // Calendar helper functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);

  const getEventsForDay = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => event.date === dateStr);
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Financial Calendar</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your financial schedule</p>
        </div>
        <button 
          onClick={() => setShowAddEvent(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Add Event
        </button>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={previousMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          ←
        </button>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          {formatDate(currentDate)}
        </h2>
        <button 
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          →
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {/* Days header */}
        <div className="grid grid-cols-7 gap-px bg-gray-100 dark:bg-gray-700">
          {days.map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-600 dark:text-gray-300">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar cells */}
        <div className="grid grid-cols-7 gap-px bg-gray-100 dark:bg-gray-700">
          {[...Array(42)].map((_, index) => {
            const day = index - firstDayOfMonth + 1;
            const isCurrentMonth = day > 0 && day <= daysInMonth;
            const dayEvents = isCurrentMonth ? getEventsForDay(day) : [];

            return (
              <div 
                key={index}
                className={`min-h-[120px] bg-white dark:bg-gray-800 p-2 ${
                  !isCurrentMonth ? 'text-gray-400 dark:text-gray-600' : ''
                }`}
              >
                <p className="text-sm font-medium mb-1">{isCurrentMonth ? day : ''}</p>
                <div className="space-y-1">
                  {dayEvents.map(event => (
                    <div 
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className={`group relative text-xs p-1 rounded cursor-pointer ${
                        event.type === 'income' 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <p className="font-medium truncate">{event.title}</p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEvent(event.id);
                          }}
                          className="hidden group-hover:block p-1 hover:text-red-600 dark:hover:text-red-400"
                          title="Delete event"
                        >
                          ✕
                        </button>
                      </div>
                      <p>{formatCurrency(event.amount)}</p>
                      {event.recurring && (
                        <span className="absolute top-1 right-1 text-xs">🔄</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && !isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Event Details</h2>
              <button 
                onClick={() => setSelectedEvent(null)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Title</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">{selectedEvent.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Amount</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {formatCurrency(selectedEvent.amount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white capitalize">{selectedEvent.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {new Date(selectedEvent.date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white capitalize">{selectedEvent.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Recurring</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {selectedEvent.recurring ? 'Yes' : 'No'}
                </p>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => {
                    setIsEditing(true);
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Edit Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {isEditing && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Event</h2>
              <button 
                onClick={() => {
                  setIsEditing(false);
                  setSelectedEvent(null);
                }}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              handleEdit();
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={selectedEvent.title}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type
                </label>
                <select
                  name="type"
                  value={selectedEvent.type}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="bill">Bill</option>
                  <option value="income">Income</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  value={selectedEvent.amount}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={selectedEvent.date}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="recurring"
                  checked={selectedEvent.recurring}
                  onChange={handleFormChange}
                  className="h-4 w-4 text-indigo-600 rounded border-gray-300"
                />
                <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Recurring Event
                </label>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedEvent(null);
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {showAddEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add Financial Event</h2>
              <button 
                onClick={() => setShowAddEvent(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={eventForm.title}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type
                </label>
                <select
                  name="type"
                  value={eventForm.type}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="bill">Bill</option>
                  <option value="income">Income</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  value={eventForm.amount}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={eventForm.date}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="recurring"
                  checked={eventForm.recurring}
                  onChange={handleFormChange}
                  className="h-4 w-4 text-indigo-600 rounded border-gray-300"
                />
                <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Recurring Event
                </label>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddEvent(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar; 