import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, Sparkles } from 'lucide-react';
import './Home.css';

function Home() {
  return (
    <div className="home-page">
      <div className="home-container">
        <span className="home-badge">Welcome to OmniChat</span>
        
        <h1 className="home-title">
          Next-Generation <span>Real-time Messaging</span> Space
        </h1>
        
        <p className="home-desc">
          OmniChat is a premium secure messaging platform designed for seamless team collaboration. 
          We provide high-performance, real-time message sync, state-of-the-art security, 
          and a beautiful, minimal environment that helps teams communicate effectively and stay focused.
        </p>
        
        <div className="home-cta-group">
          <Link to="/signup" className="home-btn-primary">
            Get Started Free
          </Link>
          <Link to="/signin" className="home-btn-secondary">
            Sign In to Account
          </Link>
        </div>
        
        <div className="home-features">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Zap size={24} />
            </div>
            <h3>Instant Delivery</h3>
            <p>Built on ultra-low latency technology for real-time messaging, updates and reactions.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Shield size={24} />
            </div>
            <h3>End-to-End Secure</h3>
            <p>Your messages and files are secure, protecting your private business data.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Sparkles size={24} />
            </div>
            <h3>Premium Aesthetic</h3>
            <p>Minimal layout, custom gradients, and fluid micro-animations for ultimate focus.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
