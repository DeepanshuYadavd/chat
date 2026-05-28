import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import './SignIn.css';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { login, loading } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.warning('Please fill in all fields');
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      toast.success('Signed in successfully! Welcome back.');
      navigate('/chats');
    } else {
      toast.error(result.message || 'Invalid email or password');
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-card">
        <div className="signin-header">
          <div className="signin-icon-wrapper">
            <KeyRound size={28} />
          </div>
          <h1 className="signin-title">Welcome Back</h1>
          <p className="signin-subtitle">Enter your credentials to access your workspace</p>
        </div>

        <form className="signin-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input 
                type="email" 
                id="email" 
                className="form-input" 
                placeholder="name@company.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input 
                type="password" 
                id="password" 
                className="form-input" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>

          <button type="submit" className="signin-btn" disabled={loading}>
            <LogIn size={18} />
            <span>{loading ? 'Signing In...' : 'Sign In to Account'}</span>
          </button>
        </form>

        <div className="signin-footer">
          Don't have an account? <Link to="/signup" className="signin-link">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
