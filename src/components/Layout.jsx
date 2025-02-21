import PropTypes from 'prop-types';
import Sidebar from './Sidebar';
import { useTheme } from '../context/ThemeContext';

export default function Layout({ children }) {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
        <Sidebar />
        <main className="lg:ml-64 min-h-screen">
          <div className="p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
}; 