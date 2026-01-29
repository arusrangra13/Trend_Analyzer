import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { useAuth0 } from '@auth0/auth0-react';
import { SubscriptionService } from '../services/subscriptionService';
import { SocialMediaService } from '../services/socialMediaService';
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Globe, 
  Palette, 
  Database, 
  Download,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  LogOut,
  HelpCircle,
  Mail,
  Lock,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  Volume2,
  Wifi,
  WifiOff
} from 'lucide-react';

export default function SettingsPage() {
  const { user, logout } = useAuth0();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile Settings
  const [profileSettings, setProfileSettings] = useState({
    displayName: user?.name || '',
    email: user?.email || '',
    bio: '',
    location: '',
    website: '',
    language: 'en',
    timezone: 'UTC'
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    scriptGenerationComplete: true,
    subscriptionExpiry: true,
    weeklyReports: false,
    trendAlerts: true,
    marketingEmails: false
  });

  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showAnalytics: true,
    showSubscriptionStatus: false,
    dataSharing: false,
    cookiesEnabled: true,
    analyticsTracking: true
  });

  // Appearance Settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    fontSize: 'medium',
    sidebarCollapsed: false,
    compactMode: false,
    highContrast: false,
    animationsEnabled: true
  });

  // Script Generator Settings
  const [scriptSettings, setScriptSettings] = useState({
    defaultPlatform: 'youtube',
    defaultStyle: 'casual',
    defaultWordCount: 100,
    autoSave: true,
    showTrendingTopics: true,
    enableAI: true,
    preferredLanguage: 'en'
  });

  // API Settings
  const [apiSettings, setApiSettings] = useState({
    geminiApiKey: '',
    customApiEndpoint: '',
    requestTimeout: 30000,
    retryAttempts: 3,
    enableFallback: true
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    try {
      const saved = localStorage.getItem('userSettings');
      if (saved) {
        const settings = JSON.parse(saved);
        setProfileSettings(prev => ({ ...prev, ...settings.profile }));
        setNotificationSettings(prev => ({ ...prev, ...settings.notifications }));
        setPrivacySettings(prev => ({ ...prev, ...settings.privacy }));
        setAppearanceSettings(prev => ({ ...prev, ...settings.appearance }));
        setScriptSettings(prev => ({ ...prev, ...settings.script }));
        setApiSettings(prev => ({ ...prev, ...settings.api }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const settings = {
        profile: profileSettings,
        notifications: notificationSettings,
        privacy: privacySettings,
        appearance: appearanceSettings,
        script: scriptSettings,
        api: apiSettings
      };
      localStorage.setItem('userSettings', JSON.stringify(settings));
      
      // Apply theme immediately
      if (appearanceSettings.theme === 'dark') {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
      
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const exportData = () => {
    try {
      const data = {
        profile: profileSettings,
        subscription: SubscriptionService.getCurrentSubscription(),
        socialMedia: SocialMediaService.loadSocialData(),
        settings: {
          notifications: notificationSettings,
          privacy: privacySettings,
          appearance: appearanceSettings,
          script: scriptSettings
        },
        exportDate: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `flowai-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data');
    }
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      try {
        localStorage.clear();
        alert('All data cleared successfully');
        logout();
      } catch (error) {
        console.error('Error clearing data:', error);
        alert('Failed to clear data');
      }
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: <User size={18} /> },
    { id: 'notifications', name: 'Notifications', icon: <Bell size={18} /> },
    { id: 'privacy', name: 'Privacy', icon: <Shield size={18} /> },
    { id: 'appearance', name: 'Appearance', icon: <Palette size={18} /> },
    { id: 'script', name: 'Script Generator', icon: <Database size={18} /> },
    { id: 'api', name: 'API Settings', icon: <Globe size={18} /> },
    { id: 'data', name: 'Data Management', icon: <Database size={18} /> }
  ];

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
          Settings
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px' }}>
          Manage your account settings, preferences, and data
        </p>
      </div>

      <div style={{ display: 'flex', gap: '2rem' }}>
        {/* Sidebar */}
        <div style={{ width: '250px', flexShrink: 0 }}>
          <div style={{
            background: 'var(--background-light)',
            borderRadius: '12px',
            padding: '1rem',
            border: '1px solid var(--border-color)'
          }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  marginBottom: '0.5rem',
                  border: 'none',
                  borderRadius: '8px',
                  background: activeTab === tab.id ? 'var(--primary-color)' : 'transparent',
                  color: activeTab === tab.id ? 'white' : 'var(--text-primary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          <div style={{
            background: 'var(--background-light)',
            borderRadius: '12px',
            padding: '2rem',
            border: '1px solid var(--border-color)'
          }}>
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div>
                <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                  Profile Settings
                </h2>
                
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)', fontWeight: '500' }}>
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={profileSettings.displayName}
                      onChange={(e) => setProfileSettings(prev => ({ ...prev, displayName: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        background: 'var(--background-color)',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)', fontWeight: '500' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={profileSettings.email}
                      onChange={(e) => setProfileSettings(prev => ({ ...prev, email: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        background: 'var(--background-color)',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)', fontWeight: '500' }}>
                      Bio
                    </label>
                    <textarea
                      value={profileSettings.bio}
                      onChange={(e) => setProfileSettings(prev => ({ ...prev, bio: e.target.value }))}
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        background: 'var(--background-color)',
                        color: 'var(--text-primary)',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)', fontWeight: '500' }}>
                        Location
                      </label>
                      <input
                        type="text"
                        value={profileSettings.location}
                        onChange={(e) => setProfileSettings(prev => ({ ...prev, location: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid var(--border-color)',
                          borderRadius: '8px',
                          background: 'var(--background-color)',
                          color: 'var(--text-primary)'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)', fontWeight: '500' }}>
                        Website
                      </label>
                      <input
                        type="url"
                        value={profileSettings.website}
                        onChange={(e) => setProfileSettings(prev => ({ ...prev, website: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid var(--border-color)',
                          borderRadius: '8px',
                          background: 'var(--background-color)',
                          color: 'var(--text-primary)'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div>
                <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                  Notification Settings
                </h2>
                
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {Object.entries({
                    emailNotifications: 'Email Notifications',
                    pushNotifications: 'Push Notifications',
                    scriptGenerationComplete: 'Script Generation Complete',
                    subscriptionExpiry: 'Subscription Expiry Reminder',
                    weeklyReports: 'Weekly Reports',
                    trendAlerts: 'Trend Alerts',
                    marketingEmails: 'Marketing Emails'
                  }).map(([key, label]) => (
                    <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--background-color)', borderRadius: '8px' }}>
                      <span style={{ color: 'var(--text-primary)' }}>{label}</span>
                      <button
                        onClick={() => setNotificationSettings(prev => ({ ...prev, [key]: !prev[key] }))}
                        style={{
                          width: '50px',
                          height: '26px',
                          borderRadius: '13px',
                          background: notificationSettings[key] ? 'var(--primary-color)' : 'var(--border-color)',
                          border: 'none',
                          cursor: 'pointer',
                          position: 'relative',
                          transition: 'background 0.3s ease'
                        }}
                      >
                        <div style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          background: 'white',
                          position: 'absolute',
                          top: '2px',
                          left: notificationSettings[key] ? '26px' : '2px',
                          transition: 'left 0.3s ease'
                        }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Privacy Settings */}
            {activeTab === 'privacy' && (
              <div>
                <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                  Privacy Settings
                </h2>
                
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)', fontWeight: '500' }}>
                      Profile Visibility
                    </label>
                    <select
                      value={privacySettings.profileVisibility}
                      onChange={(e) => setPrivacySettings(prev => ({ ...prev, profileVisibility: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        background: 'var(--background-color)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="friends">Friends Only</option>
                    </select>
                  </div>

                  {Object.entries({
                    showAnalytics: 'Show Analytics in Profile',
                    showSubscriptionStatus: 'Show Subscription Status',
                    dataSharing: 'Share Anonymous Usage Data',
                    cookiesEnabled: 'Enable Cookies',
                    analyticsTracking: 'Enable Analytics Tracking'
                  }).map(([key, label]) => (
                    <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--background-color)', borderRadius: '8px' }}>
                      <span style={{ color: 'var(--text-primary)' }}>{label}</span>
                      <button
                        onClick={() => setPrivacySettings(prev => ({ ...prev, [key]: !prev[key] }))}
                        style={{
                          width: '50px',
                          height: '26px',
                          borderRadius: '13px',
                          background: privacySettings[key] ? 'var(--primary-color)' : 'var(--border-color)',
                          border: 'none',
                          cursor: 'pointer',
                          position: 'relative',
                          transition: 'background 0.3s ease'
                        }}
                      >
                        <div style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          background: 'white',
                          position: 'absolute',
                          top: '2px',
                          left: privacySettings[key] ? '26px' : '2px',
                          transition: 'left 0.3s ease'
                        }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div>
                <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                  Appearance Settings
                </h2>
                
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)', fontWeight: '500' }}>
                      Theme
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                      {[
                        { value: 'light', label: 'Light', icon: <Sun size={16} /> },
                        { value: 'dark', label: 'Dark', icon: <Moon size={16} /> },
                        { value: 'auto', label: 'Auto', icon: <Monitor size={16} /> }
                      ].map(theme => (
                        <button
                          key={theme.value}
                          onClick={() => setAppearanceSettings(prev => ({ ...prev, theme: theme.value }))}
                          style={{
                            padding: '1rem',
                            border: `2px solid ${appearanceSettings.theme === theme.value ? 'var(--primary-color)' : 'var(--border-color)'}`,
                            borderRadius: '8px',
                            background: 'var(--background-color)',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          {theme.icon}
                          {theme.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)', fontWeight: '500' }}>
                      Font Size
                    </label>
                    <select
                      value={appearanceSettings.fontSize}
                      onChange={(e) => setAppearanceSettings(prev => ({ ...prev, fontSize: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        background: 'var(--background-color)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                      <option value="extra-large">Extra Large</option>
                    </select>
                  </div>

                  {Object.entries({
                    sidebarCollapsed: 'Collapse Sidebar by Default',
                    compactMode: 'Compact Mode',
                    highContrast: 'High Contrast',
                    animationsEnabled: 'Enable Animations'
                  }).map(([key, label]) => (
                    <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--background-color)', borderRadius: '8px' }}>
                      <span style={{ color: 'var(--text-primary)' }}>{label}</span>
                      <button
                        onClick={() => setAppearanceSettings(prev => ({ ...prev, [key]: !prev[key] }))}
                        style={{
                          width: '50px',
                          height: '26px',
                          borderRadius: '13px',
                          background: appearanceSettings[key] ? 'var(--primary-color)' : 'var(--border-color)',
                          border: 'none',
                          cursor: 'pointer',
                          position: 'relative',
                          transition: 'background 0.3s ease'
                        }}
                      >
                        <div style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          background: 'white',
                          position: 'absolute',
                          top: '2px',
                          left: appearanceSettings[key] ? '26px' : '2px',
                          transition: 'left 0.3s ease'
                        }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Script Generator Settings */}
            {activeTab === 'script' && (
              <div>
                <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                  Script Generator Settings
                </h2>
                
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)', fontWeight: '500' }}>
                        Default Platform
                      </label>
                      <select
                        value={scriptSettings.defaultPlatform}
                        onChange={(e) => setScriptSettings(prev => ({ ...prev, defaultPlatform: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid var(--border-color)',
                          borderRadius: '8px',
                          background: 'var(--background-color)',
                          color: 'var(--text-primary)'
                        }}
                      >
                        <option value="youtube">YouTube</option>
                        <option value="instagram">Instagram</option>
                        <option value="twitter">Twitter</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)', fontWeight: '500' }}>
                        Default Style
                      </label>
                      <select
                        value={scriptSettings.defaultStyle}
                        onChange={(e) => setScriptSettings(prev => ({ ...prev, defaultStyle: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid var(--border-color)',
                          borderRadius: '8px',
                          background: 'var(--background-color)',
                          color: 'var(--text-primary)'
                        }}
                      >
                        <option value="casual">Casual</option>
                        <option value="professional">Professional</option>
                        <option value="energetic">Energetic</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)', fontWeight: '500' }}>
                      Default Word Count: <span style={{ color: 'var(--primary-color)' }}>{scriptSettings.defaultWordCount}</span>
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="500"
                      value={scriptSettings.defaultWordCount}
                      onChange={(e) => setScriptSettings(prev => ({ ...prev, defaultWordCount: parseInt(e.target.value) }))}
                      style={{
                        width: '100%',
                        height: '6px',
                        borderRadius: '3px',
                        background: 'var(--border-color)',
                        outline: 'none'
                      }}
                    />
                  </div>

                  {Object.entries({
                    autoSave: 'Auto-save Scripts',
                    showTrendingTopics: 'Show Trending Topics',
                    enableAI: 'Enable AI Generation'
                  }).map(([key, label]) => (
                    <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--background-color)', borderRadius: '8px' }}>
                      <span style={{ color: 'var(--text-primary)' }}>{label}</span>
                      <button
                        onClick={() => setScriptSettings(prev => ({ ...prev, [key]: !prev[key] }))}
                        style={{
                          width: '50px',
                          height: '26px',
                          borderRadius: '13px',
                          background: scriptSettings[key] ? 'var(--primary-color)' : 'var(--border-color)',
                          border: 'none',
                          cursor: 'pointer',
                          position: 'relative',
                          transition: 'background 0.3s ease'
                        }}
                      >
                        <div style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          background: 'white',
                          position: 'absolute',
                          top: '2px',
                          left: scriptSettings[key] ? '26px' : '2px',
                          transition: 'left 0.3s ease'
                        }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* API Settings */}
            {activeTab === 'api' && (
              <div>
                <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                  API Settings
                </h2>
                
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)', fontWeight: '500' }}>
                      Gemini API Key
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type={apiSettings.geminiApiKey ? 'password' : 'text'}
                        value={apiSettings.geminiApiKey}
                        onChange={(e) => setApiSettings(prev => ({ ...prev, geminiApiKey: e.target.value }))}
                        placeholder="Enter your Gemini API key"
                        style={{
                          flex: 1,
                          padding: '0.75rem',
                          border: '1px solid var(--border-color)',
                          borderRadius: '8px',
                          background: 'var(--background-color)',
                          color: 'var(--text-primary)'
                        }}
                      />
                      <button
                        onClick={() => {
                          const input = document.querySelector('input[type="password"], input[type="text"]');
                          if (input) {
                            input.type = input.type === 'password' ? 'text' : 'password';
                          }
                        }}
                        style={{
                          padding: '0.75rem',
                          border: '1px solid var(--border-color)',
                          borderRadius: '8px',
                          background: 'var(--background-color)',
                          color: 'var(--text-primary)',
                          cursor: 'pointer'
                        }}
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)', fontWeight: '500' }}>
                      Custom API Endpoint
                    </label>
                    <input
                      type="url"
                      value={apiSettings.customApiEndpoint}
                      onChange={(e) => setApiSettings(prev => ({ ...prev, customApiEndpoint: e.target.value }))}
                      placeholder="https://api.example.com"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        background: 'var(--background-color)',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)', fontWeight: '500' }}>
                        Request Timeout (ms)
                      </label>
                      <input
                        type="number"
                        value={apiSettings.requestTimeout}
                        onChange={(e) => setApiSettings(prev => ({ ...prev, requestTimeout: parseInt(e.target.value) }))}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid var(--border-color)',
                          borderRadius: '8px',
                          background: 'var(--background-color)',
                          color: 'var(--text-primary)'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)', fontWeight: '500' }}>
                        Retry Attempts
                      </label>
                      <input
                        type="number"
                        value={apiSettings.retryAttempts}
                        onChange={(e) => setApiSettings(prev => ({ ...prev, retryAttempts: parseInt(e.target.value) }))}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid var(--border-color)',
                          borderRadius: '8px',
                          background: 'var(--background-color)',
                          color: 'var(--text-primary)'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--background-color)', borderRadius: '8px' }}>
                    <span style={{ color: 'var(--text-primary)' }}>Enable Fallback Mode</span>
                    <button
                      onClick={() => setApiSettings(prev => ({ ...prev, enableFallback: !prev.enableFallback }))}
                      style={{
                        width: '50px',
                        height: '26px',
                        borderRadius: '13px',
                        background: apiSettings.enableFallback ? 'var(--primary-color)' : 'var(--border-color)',
                        border: 'none',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'background 0.3s ease'
                      }}
                    >
                      <div style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        background: 'white',
                        position: 'absolute',
                        top: '2px',
                        left: apiSettings.enableFallback ? '26px' : '2px',
                        transition: 'left 0.3s ease'
                      }} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Data Management */}
            {activeTab === 'data' && (
              <div>
                <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                  Data Management
                </h2>
                
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  <div style={{
                    padding: '1.5rem',
                    background: 'var(--background-color)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)'
                  }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Export Your Data</h3>
                    <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                      Download all your data including profile, settings, and generated scripts.
                    </p>
                    <button
                      onClick={exportData}
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: 'var(--primary-color)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <Download size={16} />
                      Export Data
                    </button>
                  </div>

                  <div style={{
                    padding: '1.5rem',
                    background: 'var(--background-color)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)'
                  }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Clear All Data</h3>
                    <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                      Permanently delete all your data from this device. This action cannot be undone.
                    </p>
                    <button
                      onClick={clearAllData}
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <Trash2 size={16} />
                      Clear All Data
                    </button>
                  </div>

                  <div style={{
                    padding: '1.5rem',
                    background: 'var(--background-color)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)'
                  }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Storage Usage</h3>
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Profile Data</span>
                        <span style={{ color: 'var(--text-primary)' }}>~2 KB</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Settings</span>
                        <span style={{ color: 'var(--text-primary)' }}>~1 KB</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Social Media Data</span>
                        <span style={{ color: 'var(--text-primary)' }}>~5 KB</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                        <span style={{ color: 'var(--text-primary)' }}>Total</span>
                        <span style={{ color: 'var(--primary-color)' }}>~8 KB</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={saveSettings}
                  disabled={saving}
                  style={{
                    padding: '0.75rem 2rem',
                    background: 'var(--primary-color)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    opacity: saving ? 0.7 : 1
                  }}
                >
                  {saving ? (
                    <>
                      <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Settings
                    </>
                  )}
                </button>
              </div>

              <button
                onClick={logout}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'transparent',
                  color: '#ef4444',
                  border: '1px solid #ef4444',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
