import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Subscription.css';

function Subscription() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (type) => {
    setLoading(true);
    
    // TODO: In production, integrate with Stripe's Payment Element or Checkout
    // This is a placeholder for demonstration purposes
    // Real implementation should:
    // 1. Create a Stripe Checkout Session or Payment Intent
    // 2. Redirect user to Stripe's hosted page or show Payment Element
    // 3. Handle webhook for subscription confirmation
    alert(`This would redirect to Stripe payment for ${type} subscription. In production, this will use the Stripe API with real payment processing.`);
    
    setLoading(false);
  };

  return (
    <div className="subscription-page">
      <div className="container">
        <h1>Subscription Plans</h1>
        <p className="subtitle">Choose the plan that works for you</p>

        <div className="current-plan card">
          <h3>Current Plan</h3>
          <div className="plan-info">
            <div className="plan-detail">
              <span className="label">Status:</span>
              <span className={`status ${user?.subscriptionStatus}`}>
                {user?.subscriptionStatus || 'trial'}
              </span>
            </div>
            <div className="plan-detail">
              <span className="label">Type:</span>
              <span>{user?.subscriptionType || 'free'}</span>
            </div>
            <div className="plan-detail">
              <span className="label">Queries Remaining:</span>
              <span>
                {user?.subscriptionType === 'monthly' 
                  ? '∞ Unlimited' 
                  : user?.freeQueriesRemaining || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="plans-grid grid grid-3">
          <div className="card plan-card">
            <h3>Free Trial</h3>
            <div className="price">3 Queries</div>
            <p className="plan-description">Test the waters with free queries</p>
            
            <ul className="features-list">
              <li>✅ 3 free AI queries</li>
              <li>✅ Access all gang members</li>
              <li>✅ Basic features</li>
              <li>✅ No credit card required</li>
              <li>❌ Limited custom AI</li>
            </ul>

            <button className="btn-secondary" disabled>
              {user?.subscriptionStatus === 'trial' ? 'Current Plan' : 'Trial Used'}
            </button>
          </div>

          <div className="card plan-card featured">
            <div className="badge">Most Popular</div>
            <h3>Monthly Subscription</h3>
            <div className="price">£5<span>/month</span></div>
            <p className="plan-description">Unlimited queries for serious users</p>
            
            <ul className="features-list">
              <li>✅ Unlimited AI queries</li>
              <li>✅ All gang members</li>
              <li>✅ Custom AI creation</li>
              <li>✅ Hackney Boss AI access</li>
              <li>✅ Priority support</li>
              <li>✅ All gamification features</li>
            </ul>

            <button 
              className="btn-primary" 
              onClick={() => handleSubscribe('monthly')}
              disabled={loading || user?.subscriptionType === 'monthly'}
            >
              {user?.subscriptionType === 'monthly' ? 'Current Plan' : 'Subscribe Monthly'}
            </button>
          </div>

          <div className="card plan-card">
            <h3>Pay Per Query</h3>
            <div className="price">£0.50<span>/query</span></div>
            <p className="plan-description">Perfect for occasional use</p>
            
            <ul className="features-list">
              <li>✅ Pay as you go</li>
              <li>✅ No monthly commitment</li>
              <li>✅ Access all features</li>
              <li>✅ All gang members</li>
              <li>✅ Custom AI creation</li>
              <li>⚠️ Per-query charge</li>
            </ul>

            <button 
              className="btn-secondary"
              onClick={() => handleSubscribe('pay-per-query')}
              disabled={loading}
            >
              Buy Single Query
            </button>
          </div>
        </div>

        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          
          <div className="card faq-item">
            <h4>Can I cancel anytime?</h4>
            <p>Yeah, no stress. Cancel your monthly sub anytime from your dashboard. No questions asked, innit.</p>
          </div>

          <div className="card faq-item">
            <h4>What payment methods do you accept?</h4>
            <p>We use Stripe for secure payments. Credit cards, debit cards, and most major payment methods are accepted.</p>
          </div>

          <div className="card faq-item">
            <h4>Is there a refund policy?</h4>
            <p>If you're not happy within the first 7 days of your monthly sub, we'll sort you out with a full refund. Just reach out to us.</p>
          </div>

          <div className="card faq-item">
            <h4>What happens after my free trial?</h4>
            <p>Your account stays active but you can't make queries until you upgrade. All your data and gang points are saved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Subscription;
