import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Income from './pages/Income';
import Goals from './pages/Goals';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Sidebar from './components/Sidebar';
import Settings from './pages/Settings';
import { ThemeProvider } from './context/ThemeContext';
import Reports from './pages/Reports';
import Calendar from './pages/Calendar';
import Challenges from './pages/Challenges';
import DebtTracker from './pages/DebtTracker';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
          <Sidebar />
          <main className="lg:ml-64 min-h-screen pt-[64px] lg:pt-0">
            <div className="p-4 lg:p-8">
              <Routes>
                <Route path="/" element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/expenses" element={
                  <ProtectedRoute>
                    <Layout>
                      <Expenses />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/income" element={
                  <ProtectedRoute>
                    <Layout>
                      <Income />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/goals" element={
                  <ProtectedRoute>
                    <Layout>
                      <Goals />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Layout>
                      <Settings />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/challenges" element={<Challenges />} />
                <Route path="/debt" element={<DebtTracker />} />
              </Routes>
            </div>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
