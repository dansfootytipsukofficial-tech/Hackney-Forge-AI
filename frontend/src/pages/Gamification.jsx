import { useEffect, useState } from 'react';
import { getChallenges, completeChallenge } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Gamification.css';

function Gamification() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, updateUser } = useAuth();

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const data = await getChallenges();
      setChallenges(data.challenges);
    } catch (error) {
      console.error('Failed to fetch challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteChallenge = async (challengeId) => {
    try {
      const result = await completeChallenge(challengeId);
      alert(`${result.message}\n+${result.pointsEarned} points!${result.leveledUp ? '\n🎉 Level Up!' : ''}`);
      
      // Update user stats
      updateUser({
        gangPoints: result.totalPoints,
        level: result.level
      });

      // Refresh challenges
      fetchChallenges();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to complete challenge');
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
    <div className="gamification-page">
      <div className="container">
        <h1>Challenges & Gamification</h1>
        <p className="subtitle">Earn gang points and level up your status</p>

        <div className="stats-overview grid grid-3">
          <div className="card stat-box">
            <h3>⭐ Gang Points</h3>
            <div className="stat-value">{user?.gangPoints || 0}</div>
          </div>

          <div className="card stat-box">
            <h3>🏆 Level</h3>
            <div className="stat-value">{user?.level || 1}</div>
            <p className="progress-text">
              {((user?.gangPoints || 0) % 100)} / 100 to next level
            </p>
          </div>

          <div className="card stat-box">
            <h3>✅ Challenges</h3>
            <div className="stat-value">
              {challenges.filter(c => c.isCompleted).length} / {challenges.length}
            </div>
          </div>
        </div>

        <div className="challenges-section">
          <h2>Available Challenges</h2>
          
          <div className="challenges-grid">
            {challenges
              .filter(c => c.type === 'achievement')
              .map((challenge) => (
                <div 
                  key={challenge._id} 
                  className={`card challenge-card ${challenge.isCompleted ? 'completed' : ''}`}
                >
                  <div className="challenge-header">
                    <h3>{challenge.title}</h3>
                    <span className="challenge-type">{challenge.type}</span>
                  </div>
                  
                  <p className="challenge-description">{challenge.description}</p>
                  <p className="challenge-requirement">{challenge.requirement}</p>
                  
                  <div className="challenge-footer">
                    <span className="points-reward">+{challenge.pointsReward} points</span>
                    {challenge.isCompleted ? (
                      <span className="completed-badge">✅ Completed</span>
                    ) : (
                      <button 
                        className="btn-primary"
                        onClick={() => handleCompleteChallenge(challenge._id)}
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="challenges-section">
          <h2>Daily & Weekly Challenges</h2>
          
          <div className="challenges-grid">
            {challenges
              .filter(c => c.type === 'daily' || c.type === 'weekly')
              .map((challenge) => (
                <div 
                  key={challenge._id} 
                  className={`card challenge-card ${challenge.isCompleted ? 'completed' : ''}`}
                >
                  <div className="challenge-header">
                    <h3>{challenge.title}</h3>
                    <span className={`challenge-type ${challenge.type}`}>{challenge.type}</span>
                  </div>
                  
                  <p className="challenge-description">{challenge.description}</p>
                  <p className="challenge-requirement">{challenge.requirement}</p>
                  
                  <div className="challenge-footer">
                    <span className="points-reward">+{challenge.pointsReward} points</span>
                    {challenge.isCompleted ? (
                      <span className="completed-badge">✅ Completed</span>
                    ) : (
                      <button 
                        className="btn-primary"
                        onClick={() => handleCompleteChallenge(challenge._id)}
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>

          {challenges.filter(c => c.type === 'daily' || c.type === 'weekly').length === 0 && (
            <p className="empty-message">No daily or weekly challenges available right now. Check back later!</p>
          )}
        </div>

        <div className="rewards-info card">
          <h3>💎 How It Works</h3>
          <ul>
            <li><strong>Earn Points:</strong> Complete challenges, chat with AI gang members, create custom AIs</li>
            <li><strong>Level Up:</strong> Every 100 points = 1 level increase</li>
            <li><strong>Unlock Benefits:</strong> Higher levels unlock special features (coming soon)</li>
            <li><strong>Compete:</strong> Check the leaderboard to see how you rank</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Gamification;
