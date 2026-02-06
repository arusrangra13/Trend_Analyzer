import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Edit2, Save, X, Youtube, Instagram, Twitter, Globe, Link2, Crown, Star, Shield } from 'lucide-react';
import { SocialMediaService } from '../../services/socialMediaService';
import { SubscriptionService } from '../../services/subscriptionService';
import BackendService from '../../services/backendService';
import UserStorageService from '../../services/userStorageService';

export default function ProfileCard() {
  const { user, getAccessTokenSilently, isAuthenticated, updateUserData } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Load data from user-specific localStorage on initial render
  const [profileData, setProfileData] = useState(() => {
    if (isAuthenticated && user) {
      // Set current user ID for storage service
      UserStorageService.setCurrentUserId(user.sub);
      
      // Get user-specific profile data
      const savedData = UserStorageService.getItem('userProfileData', user.sub);
      if (savedData) {
        try {
          return JSON.parse(savedData);
        } catch (error) {
          console.error('Error parsing saved profile data:', error);
        }
      }
    }
    
    // Fallback to old format for migration
    const oldData = localStorage.getItem('userProfileData');
    if (oldData) {
      try {
        const parsed = JSON.parse(oldData);
        // Migrate to user-specific storage
        if (isAuthenticated && user) {
          UserStorageService.setItem('userProfileData', oldData, user.sub);
          localStorage.removeItem('userProfileData');
        }
        return parsed;
      } catch (error) {
        console.error('Error parsing old profile data:', error);
      }
    }
    
    return {
      name: {
        value: '',
        placeholder: 'Enter your name'
      },
      basicDetail: '',
      youtubeLink: '',
      instagramLink: '',
      twitterLink: '',
      otherLink: '',
      otherLinkLabel: ''
    };
  });

  const [tempData, setTempData] = useState({ ...profileData });

  useEffect(() => {
    // 1. Initial Load: Try to get detailed profile from user object or backend
    if (isAuthenticated && user) {
      if (user.profileData) {
        setProfileData(prev => ({ ...prev, ...user.profileData }));
      } else {
        const loadFromBackend = async () => {
          try {
            const token = await getAccessTokenSilently();
            const profile = await BackendService.safeGetUserProfile(token);
            if (profile && profile.profileData) {
              setProfileData(prev => ({ ...prev, ...profile.profileData }));
            }
          } catch (e) {
            console.error("Load fallback failed", e);
          }
        };
        loadFromBackend();
      }

      // 2. Handle Subscription
      if (user.subscription) {
        setSubscription(user.subscription);
      } else {
        // Try user-specific storage first
        if (user?.sub) {
          const subData = UserStorageService.getItem('subscriptionData', user.sub);
          if (subData) {
            setSubscription(JSON.parse(subData));
          } else {
            setSubscription(SubscriptionService.getCurrentSubscription(user.sub));
          }
        } else {
          setSubscription(SubscriptionService.getCurrentSubscription());
        }
      }
      
      // Don't merge with user.profileData - use local storage as source of truth
      // This prevents stale user.profileData from overwriting local changes
    } else {
      // Fallback for non-auth or initial load
      setSubscription(SubscriptionService.getCurrentSubscription(user?.sub));
    }
  }, [user, isAuthenticated, user?.subscription]);
  // Remove user?.profileData dependency to prevent overwriting local changes
  // Only track user and subscription changes, not profileData changes

  const handleEdit = () => {
    // Create a complete tempData object with all current values
    const completeTempData = {
      name: {
        value: profileData.name?.value || '',
        placeholder: profileData.name?.placeholder || 'Enter your name'
      },
      basicDetail: profileData.basicDetail || '',
      youtubeLink: profileData.youtubeLink || '',
      instagramLink: profileData.instagramLink || '',
      twitterLink: profileData.twitterLink || '',
      otherLink: profileData.otherLink || '',
      otherLinkLabel: profileData.otherLinkLabel || ''
    };
    
    setTempData(completeTempData);
    setIsEditing(true);
  };

  const handleSave = async () => {
    // Basic validation
    if (!tempData.name.value.trim()) {
      alert('Name is required');
      return;
    }

    setLoading(true);
    
    try {
      // Save to user-specific localStorage (new functionality)
      const profileDataString = JSON.stringify(tempData);
      if (isAuthenticated && user) {
        UserStorageService.setItem('userProfileData', profileDataString, user.sub);
      } else {
        // Fallback to regular localStorage for non-authenticated users
        localStorage.setItem('userProfileData', profileDataString);
      }
      
      setProfileData(tempData);
      setIsEditing(false);

      // Try to save to backend (new functionality)
      if (user && isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          // Use the dedicated service method which uses POST /api/users/profile
          const response = await BackendService.saveUserProfile(tempData, token);
          
          if (response && response.profileData) {
            // Update the user context with the full response data
            updateUserData(response);
          } else if (response) {
            // Fallback if response structure is weird but it succeeded
            const updatedUser = { ...user, profileData: tempData };
            updateUserData(updatedUser);
          }
        } catch (error) {
          console.error('Backend save failed:', error);
          // Still update local context even if backend fails
          const updatedUser = { ...user, profileData: tempData };
          updateUserData(updatedUser);
        }
      }
    } catch (error) {
      console.error('Error in handleSave:', error);
      alert('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleCancel = () => {
    setTempData({ ...profileData });
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setTempData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="dashboard-comp-ProfileCard" style={{
      background: 'var(--background-light)',
      borderRadius: '12px',
      padding: '1.5rem',
      border: '1px solid var(--border-color)',
      position: 'relative'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'var(--primary-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            overflow: 'hidden',
            position: 'relative'
          }}>
            {user?.picture ? (
              <img 
                src={user.picture} 
                alt="Profile" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '50%'
                }}
              />
            ) : (
              <User size={24} />
            )}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                {isEditing ? (
                  <input
                    type="text"
                    value={tempData.name.value}
                    onChange={(e) => handleChange('name', { ...tempData.name, value: e.target.value })}
                    placeholder={tempData.name.placeholder}
                    style={{
                      background: 'var(--background-color)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '6px',
                      padding: '0.5rem',
                      fontSize: '1.25rem',
                      color: 'var(--text-primary)',
                      width: '200px'
                    }}
                  />
                ) : (
                  profileData.name.value || user?.name || user?.nickname || profileData.name.placeholder
                )}
              </h3>
              
              {/* Subscription Badge */}
              {subscription && (
                <div style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  textTransform: 'uppercase'
                }}>
                  {subscription.plan === 'advance' ? (
                    <div style={{
                      background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      <Crown size={12} />
                      ADVANCE
                    </div>
                  ) : subscription.plan === 'pro' ? (
                    <div style={{
                      background: '#f59e0b',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      <Star size={12} />
                      PRO
                    </div>
                  ) : (
                    <div style={{
                      background: 'var(--border-color)',
                      color: 'var(--text-secondary)',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      <Shield size={12} />
                      FREE
                    </div>
                  )}
                </div>
              )}
            </div>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Profile Settings
            </p>
            {user?.email && (
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {user.email}
              </p>
            )}
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="btn btn-primary"
                style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Save size={16} />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <X size={16} />
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className="btn btn-secondary"
              style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Edit2 size={16} />
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Subscription Info */}
      {subscription && (
        <div style={{
          background: 'var(--background-color)',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1.5rem',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
              Subscription Details
            </h4>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Plan: </span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 'bold', textTransform: 'capitalize' }}>
                {subscription.plan}
              </span>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Scripts: </span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>
                {subscription.scriptsRemaining}/{subscription.totalScripts || subscription.scriptsIncluded}
              </span>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Status: </span>
              <span style={{ 
                color: subscription.status === 'active' ? '#10b981' : '#ef4444', 
                fontWeight: 'bold',
                textTransform: 'capitalize'
              }}>
                {subscription.status}
              </span>
            </div>
          </div>
          {subscription.endDate && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Expires: {new Date(subscription.endDate).toLocaleDateString()}
            </div>
          )}
        </div>
      )}

      {/* Basic Detail */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Basic Detail
        </label>
        {isEditing ? (
          <textarea
            value={tempData.basicDetail}
            onChange={(e) => handleChange('basicDetail', e.target.value)}
            placeholder="Tell us about yourself..."
            style={{
              width: '100%',
              minHeight: '80px',
              background: 'var(--background-color)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              padding: '0.75rem',
              color: 'var(--text-primary)',
              resize: 'vertical'
            }}
          />
        ) : (
          <p style={{ margin: 0, color: 'var(--text-primary)', lineHeight: '1.5' }}>
            {profileData.basicDetail || 'No basic details added yet. Click Edit to add your information.'}
          </p>
        )}
      </div>

      {/* Social Media Links */}
      <div>
        <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)', fontSize: '1rem' }}>
          Social Media Links
        </h4>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* YouTube */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Youtube size={20} color="#FF0000" />
            {isEditing ? (
              <input
                type="url"
                value={tempData.youtubeLink}
                onChange={(e) => handleChange('youtubeLink', e.target.value)}
                placeholder="YouTube channel URL"
                style={{
                  flex: 1,
                  background: 'var(--background-color)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '0.5rem 0.75rem',
                  color: 'var(--text-primary)'
                }}
              />
            ) : (
              <span style={{ color: 'var(--text-primary)' }}>
                {profileData.youtubeLink ? (
                  <a href={profileData.youtubeLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>
                    {profileData.youtubeLink}
                  </a>
                ) : (
                  <span style={{ color: 'var(--text-secondary)' }}>Not added</span>
                )}
              </span>
            )}
          </div>

          {/* Instagram */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Instagram size={20} color="#E4405F" />
            {isEditing ? (
              <input
                type="url"
                value={tempData.instagramLink}
                onChange={(e) => handleChange('instagramLink', e.target.value)}
                placeholder="Instagram profile URL"
                style={{
                  flex: 1,
                  background: 'var(--background-color)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '0.5rem 0.75rem',
                  color: 'var(--text-primary)'
                }}
              />
            ) : (
              <span style={{ color: 'var(--text-primary)' }}>
                {profileData.instagramLink ? (
                  <a href={profileData.instagramLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>
                    {profileData.instagramLink}
                  </a>
                ) : (
                  <span style={{ color: 'var(--text-secondary)' }}>Not added</span>
                )}
              </span>
            )}
          </div>

          {/* Twitter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Twitter size={20} color="#1DA1F2" />
            {isEditing ? (
              <input
                type="url"
                value={tempData.twitterLink}
                onChange={(e) => handleChange('twitterLink', e.target.value)}
                placeholder="Twitter profile URL"
                style={{
                  flex: 1,
                  background: 'var(--background-color)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '0.5rem 0.75rem',
                  color: 'var(--text-primary)'
                }}
              />
            ) : (
              <span style={{ color: 'var(--text-primary)' }}>
                {profileData.twitterLink ? (
                  <a href={profileData.twitterLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>
                    {profileData.twitterLink}
                  </a>
                ) : (
                  <span style={{ color: 'var(--text-secondary)' }}>Not added</span>
                )}
              </span>
            )}
          </div>

          {/* Other Link */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Globe size={20} color="#808080" />
            {isEditing ? (
              <div style={{ flex: 1, display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={tempData.otherLinkLabel}
                  onChange={(e) => handleChange('otherLinkLabel', e.target.value)}
                  placeholder="Label (e.g., Website, Blog)"
                  style={{
                    flex: 1,
                    background: 'var(--background-color)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    padding: '0.5rem 0.75rem',
                    color: 'var(--text-primary)'
                  }}
                />
                <input
                  type="url"
                  value={tempData.otherLink}
                  onChange={(e) => handleChange('otherLink', e.target.value)}
                  placeholder="URL"
                  style={{
                    flex: 2,
                    background: 'var(--background-color)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    padding: '0.5rem 0.75rem',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
            ) : (
              <span style={{ color: 'var(--text-primary)' }}>
                {profileData.otherLink ? (
                  <a href={profileData.otherLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>
                    {profileData.otherLinkLabel || 'Other'}: {profileData.otherLink}
                  </a>
                ) : (
                  <span style={{ color: 'var(--text-secondary)' }}>Not added</span>
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
