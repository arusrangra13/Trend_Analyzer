import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TrendingUp, CheckCircle } from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';

import '../../assets/styles/auth.css';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="auth-container">
      <ThemeToggle />
      {/* Left Side - Brand & Info */}
      <div className="auth-sidebar">
        <div className="auth-sidebar-content">
          <Link to="/" className="nav-logo" style={{ color: 'white', textDecoration: 'none' }}>
            <div style={{ background: 'var(--primary-color)', padding: '6px', borderRadius: '8px', display: 'flex' }}>
              <TrendingUp size={24} color="white" />
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>FlowAI</span>
          </Link>
          
          <div style={{ marginTop: 'auto' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>
              Create viral content <br /> 
              <span style={{ color: 'var(--primary-color)' }}>10x faster</span>
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle size={20} color="var(--secondary-color)" />
                <span style={{ fontSize: '1.1rem' }}>AI Trend Prediction</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle size={20} color="var(--secondary-color)" />
                <span style={{ fontSize: '1.1rem' }}>Killer Script Generation</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle size={20} color="var(--secondary-color)" />
                <span style={{ fontSize: '1.1rem' }}>Competitor Analysis</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="auth-content">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">{title}</h1>
            <p className="auth-subtitle">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
