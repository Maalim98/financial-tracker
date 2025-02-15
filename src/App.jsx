import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Income from './pages/Income';
import Goals from './pages/Goals';
import Login from './pages/Login';
import Signup from './pages/Signup';
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
        <Routes>
          {/* All routes wrapped in Layout, no ProtectedRoute */}
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/expenses" element={<Layout><Expenses /></Layout>} />
          <Route path="/income" element={<Layout><Income /></Layout>} />
          <Route path="/goals" element={<Layout><Goals /></Layout>} />
          <Route path="/calendar" element={<Layout><Calendar /></Layout>} />
          <Route path="/settings" element={<Layout><Settings /></Layout>} />
          <Route path="/reports" element={<Layout><Reports /></Layout>} />
          <Route path="/challenges" element={<Layout><Challenges /></Layout>} />
          <Route path="/debt" element={<Layout><DebtTracker /></Layout>} />
          
          {/* Auth pages without Layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
