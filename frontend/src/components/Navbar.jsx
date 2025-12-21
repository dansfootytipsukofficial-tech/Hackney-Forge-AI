import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <h2>🔥 Hackney Forge AI</h2>
          </Link>
          
          <div className="navbar-links">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/gang">AI Gang</Link>
                <Link to="/custom-ai">Custom AI</Link>
                <Link to="/gamification">Challenges</Link>
                <Link to="/subscription">Subscription</Link>
                <div className="user-info">
                  <span className="gang-points">⭐ {user?.gangPoints || 0} pts</span>
                  <span className="level">Lvl {user?.level || 1}</span>
                </div>
                <button onClick={logout} className="btn-secondary">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register" className="btn-primary">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
