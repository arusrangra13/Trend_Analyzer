import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import SocialMediaAnalytics from '../components/dashboard/SocialMediaAnalytics';
import { SocialMediaService } from '../services/socialMediaService';
import { TrendingUp, Users, FileText, ArrowUpRight } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth0();
  const [socialData, setSocialData] = useState([]);
  const [metrics, setMetrics] = useState({
    totalViews: '2.4M',
    totalFollowers: '125K',
    totalPosts: '48',
    growthRate: '+14%'
  });

  // Load social media data and calculate metrics
  useEffect(() => {
    const loadMetrics = async () => {
      try {
        // Load profile data and sync
        const profileData = localStorage.getItem('userProfileData');
        if (profileData) {
          const parsedProfile = JSON.parse(profileData);
          const syncedData = await SocialMediaService.syncProfileWithSocialData(parsedProfile);
          setSocialData(syncedData);
          
          // Calculate real metrics
          const formattedMetrics = SocialMediaService.getFormattedMetrics(syncedData);
          setMetrics({
            totalViews: formattedMetrics.totalViews || '2.4M',
            totalFollowers: formattedMetrics.totalFollowers || '125K',
            totalPosts: formattedMetrics.totalPosts || '48',
            growthRate: formattedMetrics.growthRate || '+14%'
          });
        } else {
          // Fallback to existing social media data
          const existingData = SocialMediaService.loadSocialData();
          if (existingData.length > 0) {
            setSocialData(existingData);
            const formattedMetrics = SocialMediaService.getFormattedMetrics(existingData);
            setMetrics({
              totalViews: formattedMetrics.totalViews || '2.4M',
              totalFollowers: formattedMetrics.totalFollowers || '125K',
              totalPosts: formattedMetrics.totalPosts || '48',
              growthRate: formattedMetrics.growthRate || '+14%'
            });
          }
        }
      } catch (error) {
        console.error('Error loading metrics:', error);
      }
    };

    loadMetrics();
  }, []);

  return (
    <DashboardLayout>
      <div className="welcome-card">
        <div className="welcome-content">
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
            Welcome back, {user?.nickname || 'Creator'}!
          </h1>
          <p style={{ opacity: 0.9, maxWidth: '600px' }}>
            You have 3 new trend opportunities in your niche today. 
            Your engagement rate is up by 12% this week.
          </p>
          <button className="btn" style={{ background: 'white', color: 'var(--primary-color)', marginTop: '1.5rem' }}>
            View Daily Insights
          </button>
        </div>
      </div>

      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Total Views Analysis</p>
            <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{metrics.totalViews}</h3>
            <span style={{ color: '#10b981', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <ArrowUpRight size={12} /> {metrics.growthRate} vs last week
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(236, 72, 153, 0.1)', color: 'var(--secondary-color)' }}>
            <FileText size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Scripts Generated</p>
            <h3 style={{ fontSize: '1.5rem', margin: 0 }}>48</h3>
            <span style={{ color: '#10b981', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <ArrowUpRight size={12} /> 12 new this week
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
            <Users size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Total Followers</p>
            <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{metrics.totalFollowers}</h3>
            <span style={{ color: '#10b981', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <ArrowUpRight size={12} /> Across all platforms
            </span>
          </div>
        </div>
      </div>

      {/* Social Media Analytics Section */}
      <SocialMediaAnalytics />

      <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', marginTop: '2rem' }}>Recent Activity</h2>
      <div className="recent-activity">
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 0', borderBottom: i !== 3 ? '1px solid var(--border-color)' : 'none' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--background-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={18} color="var(--primary-color)" />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Trend Analysis: "AI Tools for Productivity"</h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Completed 2 hours ago</p>
            </div>
            <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>View Report</button>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
