import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login/Login';
import DashboardAdmin from './pages/Dashboard/DashboardAdmin';
import DashboardClient from './pages/Dashboard/DashboardClient';
import DashboardLivreur from './pages/Dashboard/DashboardLivreur';
import UserManagement from './pages/Admin/User/UserManagement';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/admin" element={<DashboardAdmin />} />
        <Route path="/dashboard/client" element={<DashboardClient />} />
        <Route path="/dashboard/livreur" element={<DashboardLivreur />} />
        <Route path="/users" element={<UserManagement />} />
        
        {/* Redirection par défaut - à modifier selon votre logique d'authentification */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Redirection pour les chemins non définis */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
