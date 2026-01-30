import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { 
  Home, 
  TrendingUp, 
  FileText, 
  BarChart3, 
  Settings, 
  User, 
  CreditCard,
  LogOut
} from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth0();

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/script-generator', icon: FileText, label: 'Script Generator' },
    { path: '/suggestions', icon: TrendingUp, label: 'Suggestions' },
    { path: '/analysis', icon: BarChart3, label: 'Analysis' },
    { path: '/subscription', icon: CreditCard, label: 'Subscription' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            background: 'var(--primary-color)', 
            padding: '0.5rem', 
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <TrendingUp size={24} color="white" />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
            Flow<span style={{ color: 'var(--primary-color)' }}>AI</span>
          </span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
        
        {/* Logout Button */}
        <button 
          onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          className="nav-item" 
          style={{ 
            width: '100%', 
            marginTop: '1rem', 
            border: 'none', 
            background: 'transparent',
            color: 'var(--text-secondary)',
            cursor: 'pointer'
          }}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
}
