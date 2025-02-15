import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function Sidebar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActiveLink = (path) => {
    return location.pathname === path ? 'bg-indigo-800 text-white' : 'text-gray-300 hover:bg-indigo-800 hover:text-white';
  };

  const handleLogout = () => {
    logout();
    // No need to navigate - ProtectedRoute will handle it
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-0 w-full bg-indigo-950 z-30 h-16">
        <div className="flex items-center justify-between p-4">
          <Link to="/" className="text-xl font-bold text-white">
            FinTrack
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-indigo-800 text-white hover:bg-indigo-700 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 left-0 z-20 w-64 bg-indigo-900 transform transition-transform duration-300 lg:translate-x-0 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo Section - Hidden on Mobile (shown in top bar instead) */}
        <div className="hidden lg:flex items-center justify-center h-16 bg-indigo-950">
          <Link to="/" className="text-2xl font-bold text-white">
            FinTrack
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="mt-8">
          <div className="px-4 space-y-2">
            <Link
              to="/"
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActiveLink('/')}`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </Link>

            <Link
              to="/expenses"
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActiveLink('/expenses')}`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Expenses
            </Link>

            <Link
              to="/income"
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActiveLink('/income')}`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
              Income
            </Link>

            <Link
              to="/goals"
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActiveLink('/goals')}`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Goals
            </Link>

            <Link
              to="/calendar"
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActiveLink('/calendar')}`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Calendar
            </Link>

            <Link
              to="/settings"
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActiveLink('/settings')}`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </Link>
          </div>
        </nav>

        {/* User Section */}
        <div className="absolute bottom-0 w-full p-4 bg-indigo-950">
          {user ? (
            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-indigo-800">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                <span className="text-white font-medium">
                  {user.name[0].toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <button 
                  onClick={handleLogout}
                  className="text-xs text-indigo-300 hover:text-white"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="flex items-center space-x-3 hover:bg-indigo-800 p-3 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Login</p>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}

export default Sidebar; 