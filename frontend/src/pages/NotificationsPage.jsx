import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { useToast } from '../contexts/ToastContext';
import { 
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Trash2,
  Filter,
  TrendingUp,
  FileText,
  Calendar,
  Settings,
  AlertCircle,
  Info,
  Sparkles,
  Clock
} from 'lucide-react';

export default function NotificationsPage() {
  const toast = useToast();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [selectedType, setSelectedType] = useState('all'); // all, script, trend, system

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    const saved = localStorage.getItem('notifications');
    if (saved) {
      setNotifications(JSON.parse(saved));
    } else {
      // Sample notifications for demo
      const sampleNotifications = [
        {
          id: '1',
          type: 'script',
          title: 'Script Generation Complete',
          message: 'Your YouTube script "10 Tips for Better Content" is ready!',
          timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          read: false,
          icon: 'FileText'
        },
        {
          id: '2',
          type: 'trend',
          title: 'New Trending Topic',
          message: 'AI Technology is trending with high viral potential (Score: 85)',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          read: false,
          icon: 'TrendingUp'
        },
        {
          id: '3',
          type: 'calendar',
          title: 'Upcoming Post Reminder',
          message: 'You have a post scheduled for tomorrow at 10:00 AM',
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          read: true,
          icon: 'Calendar'
        },
        {
          id: '4',
          type: 'system',
          title: 'Welcome to FlowAI!',
          message: 'Get started by generating your first AI-powered script',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          read: true,
          icon: 'Sparkles'
        }
      ];
      setNotifications(sampleNotifications);
      localStorage.setItem('notifications', JSON.stringify(sampleNotifications));
    }
  };

  const saveNotifications = (updatedNotifications) => {
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    setNotifications(updatedNotifications);
  };

  const markAsRead = (id) => {
    const updated = notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    );
    saveNotifications(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map(notif => ({ ...notif, read: true }));
    saveNotifications(updated);
    toast.success('All notifications marked as read');
  };

  const deleteNotification = (id) => {
    const updated = notifications.filter(notif => notif.id !== id);
    saveNotifications(updated);
    toast.success('Notification deleted');
  };

  const clearAll = () => {
    if (confirm('Are you sure you want to clear all notifications?')) {
      saveNotifications([]);
      toast.success('All notifications cleared');
    }
  };

  const getIcon = (iconName) => {
    const icons = {
      FileText: <FileText size={20} />,
      TrendingUp: <TrendingUp size={20} />,
      Calendar: <Calendar size={20} />,
      Sparkles: <Sparkles size={20} />,
      Settings: <Settings size={20} />,
      AlertCircle: <AlertCircle size={20} />,
      Info: <Info size={20} />
    };
    return icons[iconName] || <Bell size={20} />;
  };

  const getTypeColor = (type) => {
    const colors = {
      script: 'var(--primary-color)',
      trend: '#10b981',
      calendar: '#f59e0b',
      system: '#6366f1'
    };
    return colors[type] || 'var(--text-muted)';
  };

  const getTypeLabel = (type) => {
    const labels = {
      script: 'Script',
      trend: 'Trend',
      calendar: 'Calendar',
      system: 'System'
    };
    return labels[type] || 'Other';
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = Math.floor((now - time) / 1000); // seconds

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return time.toLocaleDateString();
  };

  const filteredNotifications = notifications
    .filter(notif => {
      if (filter === 'unread' && notif.read) return false;
      if (filter === 'read' && !notif.read) return false;
      if (selectedType !== 'all' && notif.type !== selectedType) return false;
      return true;
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DashboardLayout>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
              position: 'relative'
            }}>
              <Bell size={24} color="white" />
              {unreadCount > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#ef4444',
                  color: 'white',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {unreadCount}
                </div>
              )}
            </div>
            <div>
              <h1 style={{ fontSize: '2rem', margin: 0, fontWeight: 800, color: 'var(--text-primary)' }}>
                Notifications
              </h1>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="btn btn-secondary"
                style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <CheckCheck size={18} />
                Mark All Read
              </button>
            )}
            <button
              onClick={clearAll}
              className="btn btn-secondary"
              style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Trash2 size={18} />
              Clear All
            </button>
          </div>
        </div>

        {/* Filters */}
        <div style={{
          background: 'var(--background-card)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.25rem',
          border: '1px solid var(--border-color)',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} color="var(--text-muted)" />
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>Filter:</span>
          </div>

          {/* Read/Unread Filter */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['all', 'unread', 'read'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '0.5rem 1rem',
                  background: filter === f ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${filter === f ? 'var(--primary-color)' : 'var(--border-color)'}`,
                  borderRadius: 'var(--radius-md)',
                  color: filter === f ? 'white' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  transition: 'all 0.2s'
                }}
              >
                {f}
              </button>
            ))}
          </div>

          <div style={{ width: '1px', height: '24px', background: 'var(--border-color)' }} />

          {/* Type Filter */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['all', 'script', 'trend', 'calendar', 'system'].map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                style={{
                  padding: '0.5rem 1rem',
                  background: selectedType === type ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${selectedType === type ? 'var(--primary-color)' : 'var(--border-color)'}`,
                  borderRadius: 'var(--radius-md)',
                  color: selectedType === type ? 'white' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  transition: 'all 0.2s'
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredNotifications.map(notification => (
            <div
              key={notification.id}
              onClick={() => !notification.read && markAsRead(notification.id)}
              style={{
                background: notification.read ? 'var(--background-card)' : 'rgba(99, 102, 241, 0.05)',
                borderRadius: 'var(--radius-xl)',
                padding: '1.5rem',
                border: `1px solid ${notification.read ? 'var(--border-color)' : 'rgba(99, 102, 241, 0.2)'}`,
                boxShadow: 'var(--shadow-sm)',
                cursor: notification.read ? 'default' : 'pointer',
                transition: 'all 0.2s',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', gap: '1rem' }}>
                {/* Icon */}
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: `${getTypeColor(notification.type)}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: getTypeColor(notification.type),
                  flexShrink: 0
                }}>
                  {getIcon(notification.icon)}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                      {notification.title}
                    </h3>
                    <span style={{
                      padding: '0.25rem 0.65rem',
                      background: `${getTypeColor(notification.type)}15`,
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: getTypeColor(notification.type),
                      textTransform: 'capitalize'
                    }}>
                      {getTypeLabel(notification.type)}
                    </span>
                    {!notification.read && (
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: 'var(--primary-color)'
                      }} />
                    )}
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0 0 0.75rem 0', lineHeight: 1.5 }}>
                    {notification.message}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <Clock size={14} />
                    {getTimeAgo(notification.timestamp)}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  {!notification.read && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}
                      style={{
                        padding: '0.5rem',
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        color: '#10b981',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      title="Mark as read"
                    >
                      <Check size={16} />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                    style={{
                      padding: '0.5rem',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      color: '#ef4444',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          background: 'var(--background-card)',
          borderRadius: 'var(--radius-xl)',
          padding: '4rem 2rem',
          textAlign: 'center',
          border: '2px dashed var(--border-color)'
        }}>
          <BellOff size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            No notifications
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            {filter !== 'all' || selectedType !== 'all' 
              ? 'Try adjusting your filters' 
              : 'You\'re all caught up!'}
          </p>
        </div>
      )}
    </DashboardLayout>
  );
}
