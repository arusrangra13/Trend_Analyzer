import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Header({ onMenuClick }) {
  const { user } = useAuth();

  return (
    <header className="top-header">
      <div className="header-left">
        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn" 
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>

        <div className="header-search">
          <Search size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input type="text" className="search-input" placeholder="Search trends or analytics..." />
        </div>
      </div>

      <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <button style={{ 
          position: 'relative', 
          background: 'rgba(255,255,255,0.03)', 
          border: '1px solid var(--border-color)', 
          color: 'var(--text-secondary)', 
          cursor: 'pointer',
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s'
        }}>
          <Bell size={20} />
          <span style={{ position: 'absolute', top: '10px', right: '10px', width: '6px', height: '6px', background: 'var(--secondary-color)', borderRadius: '50%', border: '2px solid var(--background-card)' }}></span>
        </button>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem',
          padding: '0.35rem 0.5rem 0.35rem 1rem', 
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '12px',
          border: '1px solid var(--border-color)'
        }}>
           <div style={{ textAlign: 'right' }}>
             <p style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>{user?.name || 'Creator'}</p>
             <p style={{ fontSize: '0.7rem', margin: 0, color: 'var(--text-muted)' }}>Free Plan</p>
           </div>
           <div style={{ 
             width: '32px', 
             height: '32px', 
             borderRadius: '8px', 
             background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center',
             color: 'white',
             fontSize: '0.8rem',
             fontWeight: 700
           }}>
             {(user?.name || 'C').charAt(0).toUpperCase()}
           </div>
        </div>
      </div>
    </header>
  );
}
