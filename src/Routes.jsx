import { Routes as RouterRoutes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Income from './pages/Income';
import Goals from './pages/Goals';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Settings from './pages/Settings';
import Reports from './pages/Reports';
import Calendar from './pages/Calendar';
import Challenges from './pages/Challenges';
import DebtTracker from './pages/DebtTracker';

export default function Routes() {
  return (
    <RouterRoutes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/expenses" element={
        <ProtectedRoute>
          <Expenses />
        </ProtectedRoute>
      } />
      <Route path="/income" element={
        <ProtectedRoute>
          <Income />
        </ProtectedRoute>
      } />
      <Route path="/goals" element={
        <ProtectedRoute>
          <Goals />
        </ProtectedRoute>
      } />
      <Route path="/calendar" element={
        <ProtectedRoute>
          <Calendar />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
      <Route path="/reports" element={
        <ProtectedRoute>
          <Reports />
        </ProtectedRoute>
      } />
      <Route path="/challenges" element={
        <ProtectedRoute>
          <Challenges />
        </ProtectedRoute>
      } />
      <Route path="/debt" element={
        <ProtectedRoute>
          <DebtTracker />
        </ProtectedRoute>
      } />
    </RouterRoutes>
  );
} 