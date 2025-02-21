import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Settings() {
  const { darkMode, toggleDarkMode } = useTheme();
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement profile update
    setIsEditing(false);
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5002/api/profile/avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      // Update user context or state with new avatar
      console.log('Avatar uploaded:', data);
    } catch (error) {
      console.error('Avatar upload error:', error);
    }
  };

  const handleAvatarDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5002/api/profile/avatar', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete avatar');
      }

      const data = await response.json();
      // Update user in context
      updateUser(data.user);
    } catch (error) {
      console.error('Avatar delete error:', error);
      alert('Failed to delete avatar');
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');

    try {
      // Validate passwords match
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setPasswordError('New passwords do not match');
        return;
      }

      // Validate password length
      if (passwordForm.newPassword.length < 6) {
        setPasswordError('Password must be at least 6 characters long');
        return;
      }

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5002/api/profile/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update password');
      }

      // Reset form and close modal
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setIsChangingPassword(false);
      alert('Password updated successfully');
    } catch (error) {
      console.error('Password update error:', error);
      setPasswordError(error.message || 'Failed to update password. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Account Settings</h1>

      <div className="space-y-6">
        {/* Profile Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Profile Information</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Update your account information</p>
          </div>

          <div className="p-6">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                {/* Profile Photo and Basic Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    {/* Profile Photo */}
                    <div className="relative group">
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                        {user?.avatar ? (
                          <img 
                            src={`http://localhost:5002${user.avatar}`} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl text-gray-400">
                            {user?.name?.[0]?.toUpperCase() || '👤'}
                          </div>
                        )}
                        <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                          <span className="text-sm">Change Photo</span>
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleAvatarUpload}
                          />
                        </label>
                      </div>
                      {user?.avatar && (
                        <button
                          onClick={handleAvatarDelete}
                          className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
                          title="Remove photo"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>

                    {/* Basic Info */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{user?.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                      {user?.phone && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Edit Button */}
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Preferences</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Customize your experience</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-medium text-gray-900 dark:text-white">Dark Mode</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {darkMode ? 'Dark theme enabled' : 'Light theme enabled'}
                </p>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  darkMode ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
                role="switch"
                aria-checked={darkMode}
              >
                <span className="sr-only">Toggle dark mode</span>
                <span
                  className={`${
                    darkMode ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out`}
                />
              </button>
            </div>

            {/* Email Notifications Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-medium text-gray-900 dark:text-white">Email Notifications</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive updates and alerts</p>
              </div>
              <button
                onClick={() => {/* TODO: Implement email notifications toggle */}}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
              </button>
            </div>

            {/* Currency Selection */}
            <div>
              <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">Currency</h3>
              <select
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                defaultValue="KES"
              >
                <option value="KES">Kenyan Shilling (KES)</option>
                <option value="USD">US Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="GBP">British Pound (GBP)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Security</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your security settings</p>
          </div>

          <div className="p-6 space-y-4">
            <button 
              onClick={() => setIsChangingPassword(true)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div>
                <h3 className="text-base font-medium text-gray-900 dark:text-white">Change Password</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Update your password</p>
              </div>
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <div>
                <h3 className="text-base font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security</p>
              </div>
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-red-200 dark:border-red-900/50">
          <div className="p-6 border-b border-red-200 dark:border-red-900/50">
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">Danger Zone</h2>
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">Irreversible actions</p>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-medium text-red-600 dark:text-red-400">Delete Account</h3>
                <p className="text-sm text-red-500 dark:text-red-400">Permanently delete your account and data</p>
              </div>
              <button className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {isChangingPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Change Password</h2>
              <button 
                onClick={() => {
                  setIsChangingPassword(false);
                  setPasswordError('');
                  setPasswordForm({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                }}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              {passwordError && (
                <p className="text-sm text-red-600 dark:text-red-400">{passwordError}</p>
              )}

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordError('');
                    setPasswordForm({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings; 