import { useEffect, useState } from 'react';
import { getGangMembers, queryGangMember, queryBossAI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './GangMembers.css';

function GangMembers() {
  const [gangMembers, setGangMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, updateUser } = useAuth();

  useEffect(() => {
    fetchGangMembers();
  }, []);

  const fetchGangMembers = async () => {
    try {
      const data = await getGangMembers();
      setGangMembers(data.gangMembers);
    } catch (error) {
      console.error('Failed to fetch gang members:', error);
    }
  };

  const handleSelectMember = (member) => {
    setSelectedMember(member);
    setConversation([]);
    setError('');
  };

  const handleBossAI = () => {
    setSelectedMember({
      _id: 'boss',
      name: '👑 Hackney Boss AI',
      role: 'THE BOSS - Chief AI Overseer',
      londonArea: 'Central Hackney',
      description: 'Strategic guidance and quality control from THE BOSS himself. When you need the top-level view, proper authority, and real talk - you come to the Boss, innit.'
    });
    setConversation([]);
    setError('');
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedMember) return;

    setError('');
    setLoading(true);

    const userMessage = { role: 'user', content: message };
    const newConversation = [...conversation, userMessage];
    setConversation(newConversation);
    setMessage('');

    try {
      let response;
      if (selectedMember._id === 'boss') {
        response = await queryBossAI(message, conversation);
      } else {
        response = await queryGangMember(selectedMember._id, message, conversation);
      }

      const aiMessage = { 
        role: 'assistant', 
        content: response.response,
        gangMember: response.gangMember
      };
      
      setConversation([...newConversation, aiMessage]);

      // Update user stats
      if (response.user) {
        updateUser(response.user);
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to get response. Please try again.');
      // Remove the user message if request failed
      setConversation(conversation);
      setMessage(userMessage.content);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gang-members">
      <div className="container">
        <h1>AI Gang Members</h1>
        <p className="subtitle">Choose your specialist and start chatting</p>

        {user && (
          <div className="user-queries-info">
            <span>Queries remaining: <strong>
              {user.subscriptionType === 'monthly' ? '∞' : user.freeQueriesRemaining}
            </strong></span>
            <span>Points: <strong>{user.gangPoints}</strong></span>
          </div>
        )}

        <div className="gang-layout">
          <div className="gang-list">
            <h3>Choose Your AI</h3>
            
            <div 
              className={`gang-card card boss-card ${selectedMember?._id === 'boss' ? 'selected' : ''}`}
              onClick={handleBossAI}
            >
              <h4>👑 Hackney Boss AI</h4>
              <p className="role">THE BOSS - Chief Overseer</p>
              <p className="area">Central Hackney</p>
              <p className="badge">+15 points per query</p>
            </div>

            <div className="gang-divider">
              <span>Gang Members</span>
            </div>

            {gangMembers.map((member) => (
              <div
                key={member._id}
                className={`gang-card card ${selectedMember?._id === member._id ? 'selected' : ''}`}
                onClick={() => handleSelectMember(member)}
              >
                <h4>{member.name}</h4>
                <p className="role">{member.role}</p>
                <p className="area">{member.londonArea}</p>
              </div>
            ))}
          </div>

          <div className="chat-area">
            {selectedMember ? (
              <>
                <div className="chat-header card">
                  <h3>{selectedMember.name}</h3>
                  <p>{selectedMember.role}</p>
                  <p className="description">{selectedMember.description}</p>
                </div>

                <div className="chat-messages">
                  {conversation.length === 0 && (
                    <div className="empty-state">
                      <p>Start a conversation with {selectedMember.name}</p>
                      <p className="hint">Ask anything - it's uncensored and real</p>
                    </div>
                  )}
                  
                  {conversation.map((msg, index) => (
                    <div key={index} className={`message ${msg.role}`}>
                      <div className="message-content">
                        {msg.role === 'assistant' && (
                          <div className="message-author">{msg.gangMember?.name}</div>
                        )}
                        <div className="message-text">{msg.content}</div>
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="message assistant">
                      <div className="message-content">
                        <div className="loading"></div>
                      </div>
                    </div>
                  )}
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSendMessage} className="chat-input">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={`Ask ${selectedMember.name} anything...`}
                    disabled={loading}
                  />
                  <button type="submit" className="btn-primary" disabled={loading || !message.trim()}>
                    Send
                  </button>
                </form>
              </>
            ) : (
              <div className="no-selection">
                <h3>Select an AI gang member to start chatting</h3>
                <p>Each member has their own specialty and personality</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GangMembers;
