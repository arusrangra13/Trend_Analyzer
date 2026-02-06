import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';

import { useAuth } from '../contexts/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const name = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;

    const result = await register(name, email, password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create an account" 
      subtitle="Start your 14-day free trial today"
    >
      <form onSubmit={handleSubmit}>
        {error && (
            <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.875rem' }}>
                {error}
            </div>
        )}
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <div style={{ position: 'relative' }}>
            <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="John Doe"
              style={{ paddingLeft: '2.5rem' }} 
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="email" 
              className="form-input" 
              placeholder="you@example.com"
              style={{ paddingLeft: '2.5rem' }} 
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••"
              style={{ paddingLeft: '2.5rem' }} 
              required
            />
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Must be at least 8 characters long
          </p>
        </div>

        <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center' }}>
          {loading ? 'Creating account...' : 'Create Account'}
          {!loading && <ArrowRight size={18} />}
        </button>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
        
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          By clicking "Create Account", you agree to our <Link to="/terms" style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}>Terms</Link> and <Link to="/privacy" style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}>Privacy Policy</Link>.
        </div>
      </form>
    </AuthLayout>
  );
}
