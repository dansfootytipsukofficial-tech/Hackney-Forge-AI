import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <h1>Welcome to Hackney Forge AI</h1>
          <p className="hero-subtitle">
            London's realest AI platform. No filters, no BS, just pure AI power with proper vibes.
          </p>
          <p className="hero-description">
            Chat with our AI gang members from different parts of Hackney - each with their own specialty and personality.
            Create your own custom AI models. Keep it 100, innit.
          </p>
          
          <div className="cta-buttons">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary">Get Started Free</Link>
                <Link to="/login" className="btn-secondary">Login</Link>
              </>
            )}
          </div>

          <div className="trial-info">
            <p>🎁 3 free queries to get started • £5/month or £0.50/query after trial</p>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Meet The Gang</h2>
          <div className="grid grid-3">
            <div className="card feature-card">
              <h3>🎨 Dalston AI</h3>
              <p><strong>Creative Director</strong></p>
              <p>Your go-to for creative writing, branding, and innovative ideas. Bold and experimental.</p>
            </div>
            
            <div className="card feature-card">
              <h3>🎵 Clapton AI</h3>
              <p><strong>Music Producer</strong></p>
              <p>Music production, lyrics, beats, and everything audio. Smooth and knowledgeable.</p>
            </div>
            
            <div className="card feature-card">
              <h3>💻 Shoreditch AI</h3>
              <p><strong>Tech Developer</strong></p>
              <p>Coding, development, and tech solutions. Practical and straight to the point.</p>
            </div>
            
            <div className="card feature-card">
              <h3>💼 Stoke Newington AI</h3>
              <p><strong>Business Strategist</strong></p>
              <p>Business strategy, entrepreneurship, and smart moves. Strategic and ambitious.</p>
            </div>
            
            <div className="card feature-card">
              <h3>💪 Hackney Wick AI</h3>
              <p><strong>Lifestyle Coach</strong></p>
              <p>Personal development, fitness, and motivation. Energetic and positive.</p>
            </div>
            
            <div className="card feature-card">
              <h3>👑 Hackney Boss AI</h3>
              <p><strong>Chief Overseer</strong></p>
              <p>Strategic guidance and quality control. Wise and authoritative.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="benefits">
        <div className="container">
          <h2>Why Hackney Forge?</h2>
          <div className="grid grid-2">
            <div className="card">
              <h3>🔓 Uncensored Responses</h3>
              <p>Real talk, no corporate filtering. Get authentic, direct answers.</p>
            </div>
            
            <div className="card">
              <h3>🗣️ London Vibes</h3>
              <p>Natural London slang without Cockney stereotypes. Keep it authentic.</p>
            </div>
            
            <div className="card">
              <h3>🎮 Gamification</h3>
              <p>Earn gang points, complete challenges, and level up your status.</p>
            </div>
            
            <div className="card">
              <h3>🤖 Custom AI Models</h3>
              <p>Create and train your own AI with your data. Make it personal.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pricing">
        <div className="container">
          <h2>Pricing That Makes Sense</h2>
          <div className="grid grid-3">
            <div className="card pricing-card">
              <h3>Free Trial</h3>
              <div className="price">3 Queries</div>
              <p>Test the waters with 3 free AI queries</p>
              <ul>
                <li>Access all AI gang members</li>
                <li>Basic features</li>
                <li>No credit card required</li>
              </ul>
            </div>
            
            <div className="card pricing-card featured">
              <div className="badge">Popular</div>
              <h3>Monthly Sub</h3>
              <div className="price">£5<span>/month</span></div>
              <p>Unlimited queries for serious users</p>
              <ul>
                <li>Unlimited AI queries</li>
                <li>All gang members</li>
                <li>Custom AI creation</li>
                <li>Priority support</li>
              </ul>
            </div>
            
            <div className="card pricing-card">
              <h3>Pay Per Query</h3>
              <div className="price">£0.50<span>/query</span></div>
              <p>Perfect for occasional use</p>
              <ul>
                <li>Pay as you go</li>
                <li>No monthly commitment</li>
                <li>Access all features</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
