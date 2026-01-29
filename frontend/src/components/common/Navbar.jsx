import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, TrendingUp } from 'lucide-react';

export default function Navbar() {
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
        <Link to="/login" className="nav-link">Login</Link>
        <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
          Get Started
        </Link>
      </div>
    </nav>
  );
}
