import { useEffect, useState } from 'react';
import { createCustomAI, getCustomAIs, queryCustomAI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './CustomAI.css';

function CustomAI() {
  const [customAIs, setCustomAIs] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedAI, setSelectedAI] = useState(null);
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const { updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    trainingData: '',
    personality: '',
    londonSlang: true
  });

  useEffect(() => {
    fetchCustomAIs();
  }, []);

  const fetchCustomAIs = async () => {
    try {
      const data = await getCustomAIs();
      setCustomAIs(data.customAIs);
    } catch (error) {
      console.error('Failed to fetch custom AIs:', error);
    }
  };

  const handleCreateAI = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await createCustomAI(formData);
      alert(result.message);
      fetchCustomAIs();
      setShowCreateForm(false);
      setFormData({
        name: '',
        description: '',
        trainingData: '',
        personality: '',
        londonSlang: true
      });
      updateUser({ gangPoints: result.gangPoints });
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to create custom AI');
    } finally {
      setLoading(false);
    }
  };

  const handleQueryAI = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedAI) return;

    setLoading(true);
    try {
      const result = await queryCustomAI(selectedAI._id, message);
      setResponse(result.response);
      updateUser(result.user);
      setMessage('');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to query custom AI');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="custom-ai-page">
      <div className="container">
        <h1>Custom AI Models</h1>
        <p className="subtitle">Create your own AI with custom training data</p>

        <div className="actions-bar">
          <button 
            className="btn-primary" 
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? 'Cancel' : '+ Create New AI'}
          </button>
        </div>

        {showCreateForm && (
          <div className="card create-form">
            <h3>Create Custom AI</h3>
            <form onSubmit={handleCreateAI}>
              <div className="form-group">
                <label>AI Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., My Business Coach"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="What does this AI specialize in?"
                  required
                />
              </div>

              <div className="form-group">
                <label>Training Data *</label>
                <textarea
                  value={formData.trainingData}
                  onChange={(e) => setFormData({...formData, trainingData: e.target.value})}
                  placeholder="Paste your training data here... (examples, context, guidelines)"
                  required
                  rows="8"
                />
              </div>

              <div className="form-group">
                <label>Personality</label>
                <input
                  type="text"
                  value={formData.personality}
                  onChange={(e) => setFormData({...formData, personality: e.target.value})}
                  placeholder="e.g., Professional and friendly"
                />
              </div>

              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.londonSlang}
                    onChange={(e) => setFormData({...formData, londonSlang: e.target.checked})}
                  />
                  Add London slang to responses
                </label>
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? <span className="loading"></span> : 'Create AI (+50 points)'}
              </button>
            </form>
          </div>
        )}

        <div className="custom-ai-layout">
          <div className="ai-list">
            <h3>Your Custom AIs ({customAIs.length})</h3>
            {customAIs.length === 0 ? (
              <p className="empty-message">No custom AIs yet. Create your first one!</p>
            ) : (
              customAIs.map((ai) => (
                <div
                  key={ai._id}
                  className={`ai-card card ${selectedAI?._id === ai._id ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedAI(ai);
                    setResponse('');
                  }}
                >
                  <h4>{ai.name}</h4>
                  <p>{ai.description}</p>
                  <div className="ai-stats">
                    <span>Used {ai.usageCount} times</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="query-area">
            {selectedAI ? (
              <div className="card">
                <h3>{selectedAI.name}</h3>
                <p>{selectedAI.description}</p>
                <p className="ai-detail">Personality: {selectedAI.personality}</p>

                <form onSubmit={handleQueryAI} className="query-form">
                  <div className="form-group">
                    <label>Ask your custom AI</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your question..."
                      rows="4"
                      disabled={loading}
                    />
                  </div>
                  <button type="submit" className="btn-primary" disabled={loading || !message.trim()}>
                    {loading ? <span className="loading"></span> : 'Ask AI'}
                  </button>
                </form>

                {response && (
                  <div className="response-box">
                    <h4>Response:</h4>
                    <p>{response}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="no-selection card">
                <h3>Select a custom AI to query</h3>
                <p>Or create a new one to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomAI;
