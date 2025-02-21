import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import PropTypes from 'prop-types';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const { user, updateUser } = useAuth();
  const [darkMode, setDarkMode] = useState(() => {
    // Start with light mode and then check user preference
    if (user?.preferences?.darkMode !== undefined) {
      return user.preferences.darkMode;
    }
    return false;
  });

  // Update document class when darkMode changes
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = async () => {
    try {
      const newDarkMode = !darkMode;
      setDarkMode(newDarkMode); // Update UI immediately

      if (user) {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5002/api/profile/preferences', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            ...user.preferences,
            darkMode: newDarkMode
          })
        });

        if (!response.ok) {
          throw new Error('Failed to update theme preference');
        }

        await response.json(); // Add this to handle the response
        // Update the user data in context with the new preferences
        updateUser({
          ...user,
          preferences: {
            ...user.preferences,
            darkMode: newDarkMode
          }
        });
      }
    } catch (error) {
      console.error('Error updating theme:', error);
      setDarkMode(darkMode); // Use current darkMode value instead of newDarkMode
    }
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 