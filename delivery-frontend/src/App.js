import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import MasterPage from './layouts/MainMasterPage/MasterPage';
import Profile from './pages/Profile/Profile';
import api from './api/api';

function App() {
  const [user, setUser] = useState(null);



  useEffect(() => {
    const token = localStorage.getItem('apiToken');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      api.get('/api/user')
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('apiToken');
        });
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!user ? <Login onLogin={setUser} /> : <Navigate to="/dashboard" />} />
        
        {/* Master Page Layout with nested routes */}
        <Route 
          path="/" 
          element={user ? <MasterPage user={user} onLogout={() => setUser(null)} /> : <Navigate to="/login" />}
        >
          <Route path="dashboard" element={<Dashboard user={user} />} />
          <Route index element={<Navigate to="/dashboard" />} />
          
          {/* Add more routes here as needed */}
          <Route path="profile" element={<div className="page-content"><h1>Profile Page</h1></div>} />
          <Route path="orders" element={<div className="page-content"><h1>Orders Page</h1></div>} />
          <Route path="messages" element={<div className="page-content"><h1>Messages Page</h1></div>} />
          <Route path="analytics" element={<div className="page-content"><h1>Analytics Page</h1></div>} />
          <Route path="settings" element={<div className="page-content"><h1>Settings Page</h1></div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
