import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Github } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';

import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError('');
    
    // Get values from form
    const email = e.target[0].value;
    const password = e.target[1].value;

    const result = await login(email, password);
    
    if (result.success) {
        navigate('/dashboard');
    } else {
        setError(result.error);
        setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Welcome back" 
      subtitle="Log in to access your dashboard"
    >
      <form onSubmit={handleLogin}>
        {/* Visual placeholders for inputs - in a real Auth0 redirect flow, 
            the user actually logs in on the Universal Login Page. 
            We keep these for aesthetics or if we switch to Custom Login later. */}
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="email" 
              className="form-input" 
              placeholder="you@example.com"
              style={{ paddingLeft: '2.5rem' }} 
            />
          </div>
        </div>

        <div className="form-group">
           {/* ... existing password field ... */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
          </div>
          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••"
              style={{ paddingLeft: '2.5rem' }} 
            />
          </div>
        </div>

        {error && (
            <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.875rem' }}>
                {error}
            </div>
        )}

        <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center' }} disabled={loading}>
          {loading ? 'Logging in...' : 'Continue to Login'}
          {!loading && <ArrowRight size={18} />}
        </button>

        <div className="auth-divider">
          <span>Or continue with</span>
        </div>

        <button type="button" className="social-login-btn">
          <Github size={20} />
          <span>Sign in with GitHub</span>
        </button>
        
        <button type="button" className="social-login-btn" style={{ background: '#4285F4', color: 'white' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          <span>Sign in with Google</span>
        </button>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Sign up for free</Link>
        </div>
      </form>
    </AuthLayout>
  );
}
