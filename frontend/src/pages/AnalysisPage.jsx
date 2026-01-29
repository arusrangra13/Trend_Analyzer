import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import AnalyticsChart from '../components/dashboard/AnalyticsChart';
import SocialMediaAnalytics from '../components/dashboard/SocialMediaAnalytics';
import { SubscriptionService } from '../services/subscriptionService';
import { Lock, Crown, Star, TrendingUp, BarChart3, Target, Zap } from 'lucide-react';

export default function AnalysisPage() {
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSubscription = () => {
      const currentSubscription = SubscriptionService.getCurrentSubscription();
      setSubscription(currentSubscription);
      setLoading(false);
    };

    checkSubscription();
  }, []);

  const hasProAccess = subscription && (subscription.plan === 'pro' || subscription.plan === 'advance');

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '400px',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid var(--border-color)', 
            borderTop: '4px solid var(--primary-color)', 
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <span style={{ color: 'var(--text-secondary)' }}>Checking subscription...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (!hasProAccess) {
    return (
      <DashboardLayout>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
          padding: '2rem'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '2rem'
          }}>
            <Lock size={40} color="white" />
          </div>
          
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
            Premium Feature
          </h1>
          
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '500px' }}>
            Advanced Analysis is available for Pro and Advance subscribers. Get comprehensive insights, detailed analytics, and actionable recommendations to grow your online presence.
          </p>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1.5rem', 
            marginBottom: '2rem',
            width: '100%',
            maxWidth: '600px'
          }}>
            <div style={{
              padding: '1.5rem',
              border: '2px solid var(--border-color)',
              borderRadius: '12px',
              background: 'var(--background-light)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Star size={20} color="#f59e0b" />
                <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Pro Features</h3>
              </div>
              <ul style={{ textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <li>Advanced trend analysis</li>
                <li>Competitor insights</li>
                <li>Performance predictions</li>
                <li>Custom reports</li>
              </ul>
            </div>

            <div style={{
              padding: '1.5rem',
              border: '2px solid var(--primary-color)',
              borderRadius: '12px',
              background: 'var(--background-light)',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '-10px',
                right: '20px',
                background: 'var(--primary-color)',
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: 'bold'
              }}>
                BEST VALUE
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Crown size={20} color="var(--primary-color)" />
                <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Advance Features</h3>
              </div>
              <ul style={{ textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <li>Everything in Pro</li>
                <li>AI-powered predictions</li>
                <li>Real-time monitoring</li>
                <li>Priority support</li>
              </ul>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/subscription')}
              style={{
                padding: '1rem 2rem',
                background: 'var(--primary-color)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Crown size={20} />
              Upgrade Now
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                padding: '1rem 2rem',
                background: 'transparent',
                color: 'var(--text-primary)',
                border: '2px solid var(--border-color)',
                borderRadius: '8px',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <h1 style={{ fontSize: '2rem', margin: 0, color: 'var(--text-primary)' }}>
            Comprehensive Analysis
          </h1>
          {subscription?.plan === 'advance' && (
            <div style={{
              background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
              color: 'white',
              padding: '0.25rem 0.75rem',
              borderRadius: '12px',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <Crown size={14} />
              ADVANCE
            </div>
          )}
          {subscription?.plan === 'pro' && (
            <div style={{
              background: '#f59e0b',
              color: 'white',
              padding: '0.25rem 0.75rem',
              borderRadius: '12px',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <Star size={14} />
              PRO
            </div>
          )}
        </div>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px' }}>
          Deep insights into your social media performance, trending topics, and actionable recommendations to grow your online presence.
        </p>
      </div>

      {/* Premium Features Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1))',
        border: '1px solid var(--primary-color)',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{
          background: 'var(--primary-color)',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Zap size={20} color="white" />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>
            Premium Analytics Active
          </h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            You have access to advanced analytics, AI-powered insights, and comprehensive trend analysis.
          </p>
        </div>
      </div>

      {/* Social Media Analytics Section */}
      <SocialMediaAnalytics />

      {/* Comprehensive Analytics Section */}
      <AnalyticsChart />

      {/* Additional Premium Features */}
      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          Advanced Insights
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '1.5rem' 
        }}>
          <div style={{
            padding: '1.5rem',
            background: 'var(--background-light)',
            borderRadius: '12px',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <TrendingUp size={20} color="var(--primary-color)" />
              <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Trend Predictions</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              AI-powered predictions for upcoming trends in your niche based on historical data and market analysis.
            </p>
          </div>

          <div style={{
            padding: '1.5rem',
            background: 'var(--background-light)',
            borderRadius: '12px',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <BarChart3 size={20} color="var(--primary-color)" />
              <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Performance Metrics</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Detailed breakdown of your content performance with engagement rates, reach, and conversion metrics.
            </p>
          </div>

          <div style={{
            padding: '1.5rem',
            background: 'var(--background-light)',
            borderRadius: '12px',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Target size={20} color="var(--primary-color)" />
              <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Competitor Analysis</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Track your competitors' strategies and identify opportunities to outperform them in your niche.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
