import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  TrendingUp, 
  FileText, 
  BarChart3, 
  Settings, 
  User, 
  CreditCard,
  LogOut,
  FolderOpen,
  Calendar,
  BookTemplate,
  HelpCircle,
  Palette,
  Lightbulb,
  Bell,
  Youtube,
  Cpu
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/script-generator', icon: FileText, label: 'Script Generator' },
    { path: '/library', icon: FolderOpen, label: 'Content Library' },
    { path: '/templates', icon: BookTemplate, label: 'Templates' },
    { path: '/brand-kit', icon: Palette, label: 'Brand Kit' },
    { path: '/content-ideas', icon: Lightbulb, label: 'Content Ideas' },
    { path: '/youtube-trending', icon: Youtube, label: 'YouTube Trending' },
    { path: '/suggestions', icon: TrendingUp, label: 'Suggestions' },
    { path: '/analysis', icon: BarChart3, label: 'Analysis' },
    { path: '/brainstorm', icon: Cpu, label: 'Local Brainstorm' },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
    { path: '/notifications', icon: Bell, label: 'Notifications' },
    { path: '/subscription', icon: CreditCard, label: 'Subscription' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/settings', icon: Settings, label: 'Settings' },
    { path: '/help', icon: HelpCircle, label: 'Help & Support' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLinkClick = () => {
    // Close sidebar on mobile when a link is clicked
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)',
            padding: '0.6rem', 
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
          }}>
            <TrendingUp size={24} color="white" />
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Flow<span style={{ color: 'var(--primary-light)' }}>AI</span>
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
              onClick={handleLinkClick}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
        
        <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
          <button 
            onClick={() => logout()}
            className="nav-item" 
            style={{ 
              width: '100%', 
              border: 'none', 
              background: 'transparent',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              marginTop: '0.5rem'
            }}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
