import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';

function Settings() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-8">Settings</h1>

      <div className="max-w-2xl space-y-4">
        {/* Profile Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <div className="flex items-start space-x-6">
            {/* Profile Picture */}
            <div className="relative group">
              <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-3xl overflow-hidden">
                👤
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity">
                <span className="text-xs">Change</span>
                <input type="file" className="hidden" accept="image/*" />
              </label>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue="John Doe"
                      className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="john@example.com"
                      className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      defaultValue="+254 712 345 678"
                      className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">John Doe</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">john@example.com</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">+254 712 345 678</p>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="mt-3 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Toggle dark theme</p>
            </div>
            <button 
              onClick={toggleDarkMode}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                darkMode ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            >
              <span 
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                  darkMode ? 'translate-x-5' : 'translate-x-0'
                }`} 
              />
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Notifications</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Email updates</p>
            </div>
            <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none">
              <span className="inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out" />
            </button>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Password</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Last changed 3 months ago</p>
            </div>
            <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
              Change
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-red-800 dark:text-red-400">Delete Account</h3>
              <p className="text-sm text-red-600 dark:text-red-300">Permanently delete your account</p>
            </div>
            <button className="text-sm text-red-600 dark:text-red-400 hover:underline">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings; 