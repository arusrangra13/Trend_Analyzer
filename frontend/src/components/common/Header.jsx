import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';

export default function Header() {
  const { user } = useAuth0();

  return (
    <header className="top-header">
      <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="btn-icon mobile-only" style={{ background: 'none', border: 'none', color: 'white', display: 'none' }}>
           <Menu size={24} />
        </button>
        <div className="header-search">
          <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input type="text" className="search-input" placeholder="Search trends, analyzed profiles..." />
        </div>
      </div>

      <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button style={{ position: 'relative', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <Bell size={20} />
          <span style={{ position: 'absolute', top: -2, right: -2, width: '8px', height: '8px', background: 'var(--secondary-color)', borderRadius: '50%' }}></span>
        </button>
        
        <div style={{ paddingLeft: '1rem', borderLeft: '1px solid var(--border-color)' }}>
           <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{user?.nickname || 'Creator'}</span>
        </div>
      </div>
    </header>
  );
}
