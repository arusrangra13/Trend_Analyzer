import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Layout, TrendingUp } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

export default function Navbar() {
  const { isAuthenticated } = useAuth();

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
        <Link 
          to="/login"
          className="nav-link" 
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          Login
        </Link>
        <Link 
          to="/register"
          className="btn btn-primary" 
          style={{ 
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none'
          }}
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}

