import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserStats } from '../services/api';
import { Link } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getUserStats();
      setStats(data.stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
        <div className="loading"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="container">
        <h1>Welcome back, {user?.username}! 👋</h1>
        <p className="subtitle">Ready to chat with the gang?</p>

        <div className="grid grid-2">
          <div className="card stat-card">
            <h3>⭐ Gang Points</h3>
            <div className="stat-value">{stats?.gangPoints || 0}</div>
            <p>Keep chatting to earn more points!</p>
          </div>

          <div className="card stat-card">
            <h3>🏆 Level</h3>
            <div className="stat-value">{stats?.level || 1}</div>
            <p>Every 100 points = 1 level up</p>
          </div>

          <div className="card stat-card">
            <h3>💬 Queries Remaining</h3>
            <div className="stat-value">
              {stats?.subscriptionType === 'monthly' ? '∞' : stats?.freeQueriesRemaining || 0}
            </div>
            <p>
              {stats?.subscriptionType === 'monthly' 
                ? 'Unlimited with monthly sub' 
                : 'Free queries left'}
            </p>
          </div>

          <div className="card stat-card">
            <h3>📊 Subscription</h3>
            <div className="stat-value subscription-status" data-status={stats?.subscriptionStatus}>
              {stats?.subscriptionStatus || 'trial'}
            </div>
            <p>{stats?.subscriptionType || 'free'} plan</p>
          </div>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="grid grid-3">
            <Link to="/gang" className="card action-card">
              <h3>🎯 Chat with AI Gang</h3>
              <p>Talk to Dalston, Clapton, and the crew</p>
            </Link>

            <Link to="/custom-ai" className="card action-card">
              <h3>🤖 Create Custom AI</h3>
              <p>Build your own AI with custom data</p>
            </Link>

            <Link to="/gamification" className="card action-card">
              <h3>🎮 Complete Challenges</h3>
              <p>Earn points and level up</p>
            </Link>
          </div>
        </div>

        {stats?.freeQueriesRemaining === 0 && stats?.subscriptionStatus === 'inactive' && (
          <div className="upgrade-banner card">
            <h3>⚠️ You've used all your free queries</h3>
            <p>Upgrade to keep chatting with the gang</p>
            <Link to="/subscription" className="btn-primary">View Subscription Options</Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
