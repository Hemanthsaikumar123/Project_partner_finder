import { useNavigate } from 'react-router-dom';
import Auth from './Auth';
import './LoginPage.css';

function LoginPage({ setUser }) {
  const navigate = useNavigate();

  const handleSetUser = (user) => {
    setUser(user);
    navigate('/');
  };

  return (
    <div className="login-page-container">
      <div className="login-content">
        <div className="hero-section">
          <h1 className="hero-title">🎓 Campus Partner Finder</h1>
          <p className="hero-subtitle">
            Connect with fellow students, collaborate on projects, and build amazing things together!
          </p>
        </div>
        <Auth setUser={handleSetUser} />
      </div>
    </div>
  );
}

export default LoginPage;
