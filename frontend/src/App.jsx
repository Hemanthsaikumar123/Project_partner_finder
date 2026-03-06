import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import MyProjects from './components/MyProjects';
import LoginPage from './components/LoginPage';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <Navbar user={user} onLogout={handleLogout} />
        
        <Routes>
          <Route 
            path="/" 
            element={<Dashboard user={user} />} 
          />
          
          <Route 
            path="/login" 
            element={!user ? <LoginPage setUser={setUser} /> : <Navigate to="/" />} 
          />
          
          <Route 
            path="/my-projects" 
            element={user ? <MyProjects user={user} /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;