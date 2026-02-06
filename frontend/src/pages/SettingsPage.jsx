import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { SubscriptionService } from '../services/subscriptionService';
import BackendService from '../services/backendService';
import { 
  User, 
  Bell, 
  Shield, 
  Key,
  Palette, 
  Database, 
  Download,
  Trash2,
  Eye,
  EyeOff,
  Save,
  CheckCircle,
  AlertCircle,
  Moon,
  Sun,
  Globe,
  Lock,
  Mail,
  Smartphone,
  Settings as SettingsIcon,
  Crown,
  Zap
} from 'lucide-react';

export default function SettingsPage() {
  const { user, updateUserData, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('account');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  // Account Settings
  const [accountData, setAccountData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || ''
  });

  // API Settings
  const [apiData, setApiData] = useState({
    geminiApiKey: localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '',
    youtubeApiKey: localStorage.getItem('youtube_api_key') || '',
    enableFallback: true
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    scriptComplete: true,
    trendAlerts: true,
    weeklyReport: false,
    subscriptionReminders: true
  });

  // Privacy Settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showStats: true,
    dataSharing: false,
    analyticsTracking: true
  });

  // Appearance Settings
  const [appearance, setAppearance] = useState({
    theme: localStorage.getItem('theme') || 'dark',
    fontSize: 'medium',
    compactMode: false,
    animationsEnabled: true
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    // Load saved settings from localStorage
    const savedNotifications = localStorage.getItem('notification_settings');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }

    const savedPrivacy = localStorage.getItem('privacy_settings');
    if (savedPrivacy) {
      setPrivacy(JSON.parse(savedPrivacy));
    }

    const savedAppearance = localStorage.getItem('appearance_settings');
    if (savedAppearance) {
      setAppearance(JSON.parse(savedAppearance));
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // Save to localStorage
      localStorage.setItem('notification_settings', JSON.stringify(notifications));
      localStorage.setItem('privacy_settings', JSON.stringify(privacy));
      localStorage.setItem('appearance_settings', JSON.stringify(appearance));
      
      // Save API keys
      if (apiData.geminiApiKey) {
        localStorage.setItem('gemini_api_key', apiData.geminiApiKey);
      }
      if (apiData.youtubeApiKey) {
        localStorage.setItem('youtube_api_key', apiData.youtubeApiKey);
      }

      // Update account data
      if (user) {
        await updateUserData({
          name: accountData.name,
          bio: accountData.bio,
          location: accountData.location,
          website: accountData.website
        });
      }

      // Apply theme
      if (appearance.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('theme', appearance.theme);

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = () => {
    const data = {
      account: accountData,
      notifications,
      privacy,
      appearance,
      subscription: SubscriptionService.getCurrentSubscription(),
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trend-analyzer-data-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all local data? This cannot be undone.')) {
      localStorage.clear();
      alert('All local data has been cleared. Please refresh the page.');
    }
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: <User size={18} /> },
    { id: 'api', label: 'API Keys', icon: <Key size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'privacy', label: 'Privacy', icon: <Shield size={18} /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette size={18} /> },
    { id: 'data', label: 'Data', icon: <Database size={18} /> }
  ];

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
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
            }}>
              <SettingsIcon size={24} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize: '2rem', margin: 0, fontWeight: 800, color: 'var(--text-primary)' }}>
                Settings
              </h1>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Manage your account, preferences, and integrations
              </p>
            </div>
          </div>

          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="btn btn-primary"
            style={{
              padding: '0.75rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              opacity: saving ? 0.6 : 1
            }}
          >
            {saveSuccess ? (
              <>
                <CheckCircle size={18} />
                Saved!
              </>
            ) : (
              <>
                <Save size={18} />
                {saving ? 'Saving...' : 'Save Changes'}
              </>
            )}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
        {/* Sidebar Tabs */}
        <div style={{
          background: 'var(--background-card)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-md)',
          height: 'fit-content'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '0.875rem 1rem',
                  background: activeTab === tab.id ? 'var(--primary-color)' : 'transparent',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div style={{
          background: 'var(--background-card)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-lg)'
        }}>
          {/* Account Settings */}
          {activeTab === 'account' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Account Settings
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <FormField
                  label="Full Name"
                  icon={<User size={18} />}
                  value={accountData.name}
                  onChange={(e) => setAccountData({ ...accountData, name: e.target.value })}
                  placeholder="Your full name"
                />

                <FormField
                  label="Email Address"
                  icon={<Mail size={18} />}
                  value={accountData.email}
                  onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
                  placeholder="your@email.com"
                  disabled
                  hint="Email cannot be changed"
                />

                <FormField
                  label="Bio"
                  icon={<User size={18} />}
                  value={accountData.bio}
                  onChange={(e) => setAccountData({ ...accountData, bio: e.target.value })}
                  placeholder="Tell us about yourself"
                  multiline
                />

                <FormField
                  label="Location"
                  icon={<Globe size={18} />}
                  value={accountData.location}
                  onChange={(e) => setAccountData({ ...accountData, location: e.target.value })}
                  placeholder="City, Country"
                />

                <FormField
                  label="Website"
                  icon={<Globe size={18} />}
                  value={accountData.website}
                  onChange={(e) => setAccountData({ ...accountData, website: e.target.value })}
                  placeholder="https://yourwebsite.com"
                />

                {/* Subscription Info */}
                <div style={{
                  marginTop: '1rem',
                  padding: '1.5rem',
                  background: 'rgba(99, 102, 241, 0.1)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  borderRadius: 'var(--radius-lg)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <Crown size={20} color="var(--primary-color)" />
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Subscription Status
                    </h3>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Plan: <strong style={{ color: 'var(--primary-color)' }}>
                      {SubscriptionService.getCurrentSubscription()?.plan || 'Free'}
                    </strong>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    Scripts Remaining: <strong style={{ color: 'var(--primary-color)' }}>
                      {SubscriptionService.getCurrentSubscription()?.scriptsRemaining || 0}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* API Settings */}
          {activeTab === 'api' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                API Configuration
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Configure your API keys for enhanced features
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Gemini API Key */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <Zap size={20} color="var(--primary-color)" />
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Google Gemini API
                    </h3>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    Required for AI-powered script generation. Get your API key from{' '}
                    <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)' }}>
                      Google AI Studio
                    </a>
                  </p>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={apiData.geminiApiKey}
                      onChange={(e) => setApiData({ ...apiData, geminiApiKey: e.target.value })}
                      placeholder="AIza..."
                      style={{
                        width: '100%',
                        padding: '0.875rem 3rem 0.875rem 1rem',
                        background: 'var(--background-dark)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        fontFamily: 'monospace'
                      }}
                    />
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      style={{
                        position: 'absolute',
                        right: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        padding: '0.5rem'
                      }}
                    >
                      {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {apiData.geminiApiKey && (
                    <div style={{
                      marginTop: '0.75rem',
                      padding: '0.75rem 1rem',
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.85rem',
                      color: '#10b981'
                    }}>
                      <CheckCircle size={16} />
                      API key configured
                    </div>
                  )}
                </div>

                {/* YouTube API Key */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <Globe size={20} color="var(--primary-color)" />
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      YouTube Data API
                    </h3>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    Optional: For real-time YouTube analytics. Get your API key from{' '}
                    <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)' }}>
                      Google Cloud Console
                    </a>
                  </p>
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={apiData.youtubeApiKey}
                    onChange={(e) => setApiData({ ...apiData, youtubeApiKey: e.target.value })}
                    placeholder="AIza..."
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      background: 'var(--background-dark)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem',
                      fontFamily: 'monospace'
                    }}
                  />
                </div>

                {/* Fallback Option */}
                <div style={{
                  padding: '1.25rem',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-color)'
                }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={apiData.enableFallback}
                      onChange={(e) => setApiData({ ...apiData, enableFallback: e.target.checked })}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        Enable Fallback Mode
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        Use template-based generation if API fails
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Notification Preferences
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <ToggleOption
                  icon={<Mail size={18} />}
                  label="Email Notifications"
                  description="Receive updates via email"
                  checked={notifications.emailNotifications}
                  onChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                />
                <ToggleOption
                  icon={<CheckCircle size={18} />}
                  label="Script Generation Complete"
                  description="Notify when AI finishes generating scripts"
                  checked={notifications.scriptComplete}
                  onChange={(checked) => setNotifications({ ...notifications, scriptComplete: checked })}
                />
                <ToggleOption
                  icon={<Zap size={18} />}
                  label="Trend Alerts"
                  description="Get notified about trending topics in your niche"
                  checked={notifications.trendAlerts}
                  onChange={(checked) => setNotifications({ ...notifications, trendAlerts: checked })}
                />
                <ToggleOption
                  icon={<Database size={18} />}
                  label="Weekly Report"
                  description="Receive weekly analytics summary"
                  checked={notifications.weeklyReport}
                  onChange={(checked) => setNotifications({ ...notifications, weeklyReport: checked })}
                />
                <ToggleOption
                  icon={<Crown size={18} />}
                  label="Subscription Reminders"
                  description="Alerts about subscription status and renewals"
                  checked={notifications.subscriptionReminders}
                  onChange={(checked) => setNotifications({ ...notifications, subscriptionReminders: checked })}
                />
              </div>
            </div>
          )}

          {/* Privacy */}
          {activeTab === 'privacy' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Privacy & Security
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Profile Visibility
                  </label>
                  <select
                    value={privacy.profileVisibility}
                    onChange={(e) => setPrivacy({ ...privacy, profileVisibility: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      background: 'var(--background-dark)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="friends">Friends Only</option>
                  </select>
                </div>

                <ToggleOption
                  icon={<Eye size={18} />}
                  label="Show Analytics"
                  description="Display your performance stats on your profile"
                  checked={privacy.showStats}
                  onChange={(checked) => setPrivacy({ ...privacy, showStats: checked })}
                />
                <ToggleOption
                  icon={<Database size={18} />}
                  label="Data Sharing"
                  description="Share anonymized data to improve the platform"
                  checked={privacy.dataSharing}
                  onChange={(checked) => setPrivacy({ ...privacy, dataSharing: checked })}
                />
                <ToggleOption
                  icon={<Globe size={18} />}
                  label="Analytics Tracking"
                  description="Allow usage analytics for better experience"
                  checked={privacy.analyticsTracking}
                  onChange={(checked) => setPrivacy({ ...privacy, analyticsTracking: checked })}
                />
              </div>
            </div>
          )}

          {/* Appearance */}
          {activeTab === 'appearance' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Appearance
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Theme
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                    <button
                      onClick={() => setTheme('light')}
                      style={{
                        padding: '1rem',
                        background: theme === 'light' ? 'var(--primary-color)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${theme === 'light' ? 'var(--primary-color)' : 'var(--border-color)'}`,
                        borderRadius: 'var(--radius-md)',
                        color: theme === 'light' ? 'white' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        fontSize: '0.9rem',
                        fontWeight: 600
                      }}
                    >
                      <Sun size={20} />
                      Light Mode
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      style={{
                        padding: '1rem',
                        background: theme === 'dark' ? 'var(--primary-color)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${theme === 'dark' ? 'var(--primary-color)' : 'var(--border-color)'}`,
                        borderRadius: 'var(--radius-md)',
                        color: theme === 'dark' ? 'white' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        fontSize: '0.9rem',
                        fontWeight: 600
                      }}
                    >
                      <Moon size={20} />
                      Dark Mode
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Font Size
                  </label>
                  <select
                    value={appearance.fontSize}
                    onChange={(e) => setAppearance({ ...appearance, fontSize: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      background: 'var(--background-dark)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>

                <ToggleOption
                  icon={<Smartphone size={18} />}
                  label="Compact Mode"
                  description="Reduce spacing for more content on screen"
                  checked={appearance.compactMode}
                  onChange={(checked) => setAppearance({ ...appearance, compactMode: checked })}
                />
                <ToggleOption
                  icon={<Zap size={18} />}
                  label="Animations"
                  description="Enable smooth transitions and animations"
                  checked={appearance.animationsEnabled}
                  onChange={(checked) => setAppearance({ ...appearance, animationsEnabled: checked })}
                />
              </div>
            </div>
          )}

          {/* Data Management */}
          {activeTab === 'data' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Data Management
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Export Data */}
                <div style={{
                  padding: '1.5rem',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: 'var(--radius-lg)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <Download size={20} color="#10b981" />
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Export Your Data
                    </h3>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    Download all your account data, settings, and generated scripts in JSON format.
                  </p>
                  <button
                    onClick={handleExportData}
                    className="btn btn-secondary"
                    style={{ padding: '0.65rem 1.25rem', fontSize: '0.875rem' }}
                  >
                    <Download size={16} />
                    Export Data
                  </button>
                </div>

                {/* Clear Local Data */}
                <div style={{
                  padding: '1.5rem',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: 'var(--radius-lg)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <Trash2 size={20} color="#ef4444" />
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Clear Local Data
                    </h3>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    Remove all locally stored data including settings, cache, and scripts. This action cannot be undone.
                  </p>
                  <button
                    onClick={handleClearData}
                    style={{
                      padding: '0.65rem 1.25rem',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.875rem',
                      fontWeight: 600,
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

                {/* Account Deletion */}
                <div style={{
                  padding: '1.5rem',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <AlertCircle size={20} color="var(--text-muted)" />
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Delete Account
                    </h3>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    Permanently delete your account and all associated data. This action is irreversible.
                  </p>
                  <button
                    onClick={() => alert('Account deletion is not available in this version. Please contact support.')}
                    style={{
                      padding: '0.65rem 1.25rem',
                      background: 'transparent',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Request Account Deletion
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

function FormField({ label, icon, value, onChange, placeholder, disabled, hint, multiline }) {
  return (
    <div>
      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        {icon && (
          <div style={{
            position: 'absolute',
            left: '1rem',
            top: multiline ? '1rem' : '50%',
            transform: multiline ? 'none' : 'translateY(-50%)',
            color: 'var(--text-muted)'
          }}>
            {icon}
          </div>
        )}
        {multiline ? (
          <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            rows={4}
            style={{
              width: '100%',
              padding: icon ? '0.875rem 1rem 0.875rem 3rem' : '0.875rem 1rem',
              background: disabled ? 'rgba(255,255,255,0.02)' : 'var(--background-dark)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            style={{
              width: '100%',
              padding: icon ? '0.875rem 1rem 0.875rem 3rem' : '0.875rem 1rem',
              background: disabled ? 'rgba(255,255,255,0.02)' : 'var(--background-dark)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: '0.9rem'
            }}
          />
        )}
      </div>
      {hint && (
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
          {hint}
        </div>
      )}
    </div>
  );
}

function ToggleOption({ icon, label, description, checked, onChange }) {
  return (
    <div style={{
      padding: '1.25rem',
      background: 'rgba(255, 255, 255, 0.02)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
        <div style={{ color: 'var(--primary-color)' }}>
          {icon}
        </div>
        <div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {label}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {description}
          </div>
        </div>
      </div>
      <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '26px', cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          style={{ opacity: 0, width: 0, height: 0 }}
        />
        <span style={{
          position: 'absolute',
          cursor: 'pointer',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: checked ? 'var(--primary-color)' : '#ccc',
          transition: '0.3s',
          borderRadius: '26px'
        }}>
          <span style={{
            position: 'absolute',
            content: '',
            height: '20px',
            width: '20px',
            left: checked ? '25px' : '3px',
            bottom: '3px',
            background: 'white',
            transition: '0.3s',
            borderRadius: '50%'
          }} />
        </span>
      </label>
    </div>
  );
}
