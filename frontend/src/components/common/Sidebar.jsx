import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { 
  LayoutDashboard, 
  User, 
  BarChart2, 
  Lightbulb, 
  FileText, 
  CreditCard, 
  Settings, 
  LogOut,
  TrendingUp
} from 'lucide-react';

export default function Sidebar() {
  const { logout, user } = useAuth0();

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Analysis', icon: <BarChart2 size={20} />, path: '/analysis' },
    { name: 'Suggestions', icon: <Lightbulb size={20} />, path: '/suggestions' },
    { name: 'Script Generator', icon: <FileText size={20} />, path: '/script-generator' },
    { name: 'Profile', icon: <User size={20} />, path: '/profile' },
    { name: 'Subscription', icon: <CreditCard size={20} />, path: '/subscription' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link to="/dashboard" className="nav-logo" style={{ textDecoration: 'none', color: 'white' }}>
          <div style={{ background: 'var(--primary-color)', padding: '6px', borderRadius: '8px', display: 'flex' }}>
            <TrendingUp size={20} color="white" />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>FlowAI</span>
        </Link>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        {user && (
          <div className="user-profile-preview">
            <img 
              src={user.picture} 
              alt={user.name} 
              className="user-avatar-small" 
              style={{ objectFit: 'cover' }}
            />
            <div style={{ overflow: 'hidden' }}>
              <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</p>
            </div>
          </div>
        )}
        
        <button 
          onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          className="nav-item" 
          style={{ width: '100%', marginTop: '1rem', border: 'none', background: 'transparent' }}
        >
          <LogOut size={20} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
