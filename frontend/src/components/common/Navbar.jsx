import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Layout, TrendingUp } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

export default function Navbar() {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleLogin = async () => {
    setIsAuthenticating(true);
    try {
      await loginWithRedirect({
        screen_hint: 'login'
      });
    } catch (error) {
      console.error('Login error:', error);
      setIsAuthenticating(false);
    }
  };

  const handleSignup = async () => {
    setIsAuthenticating(true);
    try {
      await loginWithRedirect({
        screen_hint: 'signup'
      });
    } catch (error) {
      console.error('Signup error:', error);
      setIsAuthenticating(false);
    }
  };

  return (
    <nav className="landing-nav">
      <Link to="/" className="nav-logo">
        <div style={{ background: 'var(--primary-color)', padding: '6px', borderRadius: '8px', display: 'flex' }}>
          <TrendingUp size={24} color="white" />
        </div>
        <span>Flow<span style={{ color: 'var(--primary-color)' }}>AI</span></span>
      </Link>
      
      <div className="nav-links">
        <Link to="/features" className="nav-link">Features</Link>
        <Link to="/pricing" className="nav-link">Pricing</Link>
        <button 
          onClick={handleLogin} 
          className="nav-link" 
          disabled={isAuthenticating}
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: isAuthenticating ? 'not-allowed' : 'pointer',
            opacity: isAuthenticating ? 0.7 : 1,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          {isAuthenticating ? (
            <>
              <LoadingSpinner size="small" text="" />
              Connecting...
            </>
          ) : (
            'Login'
          )}
        </button>
        <button 
          onClick={handleSignup} 
          className="btn btn-primary" 
          disabled={isAuthenticating}
          style={{ 
            padding: '0.5rem 1rem',
            opacity: isAuthenticating ? 0.7 : 1,
            cursor: isAuthenticating ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          {isAuthenticating ? (
            <>
              <LoadingSpinner size="small" text="" />
              Connecting...
            </>
          ) : (
            'Get Started'
          )}
        </button>
      </div>
    </nav>
  );
}
