import { useState } from 'react';
import axios from 'axios';
import './Auth.css';

function Auth({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const url = isLogin ? 'http://localhost:5000/api/auth/login' : 'http://localhost:5000/api/auth/register';
    
    try {
      const res = await axios.post(url, formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
    } catch (err) {
      const errorMsg = err.response?.data?.msg || err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMsg);
      alert(errorMsg);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="auth-form">
        {!isLogin && (
          <input 
            type="text" 
            placeholder="Full Name" 
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})} 
            className="auth-input"
            required
          />
        )}
        <input 
          type="email" 
          placeholder="Email Address" 
          value={formData.email}
          onChange={e => setFormData({...formData, email: e.target.value})} 
          className="auth-input"
          required
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={formData.password}
          onChange={e => setFormData({...formData, password: e.target.value})} 
          className="auth-input"
          required
          minLength="6"
        />
        <button type="submit" className="auth-submit-btn">
          {isLogin ? '🔓 Login' : '🚀 Sign Up'}
        </button>
      </form>
      <p 
        onClick={() => { 
          setIsLogin(!isLogin); 
          setError(''); 
          setFormData({ name: '', email: '', password: '' }); 
        }} 
        className="auth-toggle"
      >
        {isLogin ? 'Need an account? Register here' : 'Already have an account? Login here'}
      </p>
    </div>
  );
}

export default Auth;