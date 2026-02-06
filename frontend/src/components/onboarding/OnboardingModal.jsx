import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  FileText,
  TrendingUp,
  BarChart3,
  Calendar,
  Settings,
  CheckCircle
} from 'lucide-react';

export default function OnboardingModal({ onComplete }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('onboarding_completed');
    if (!hasCompletedOnboarding) {
      setTimeout(() => setIsVisible(true), 500);
    }
  }, []);

  const steps = [
    {
      title: 'Welcome to FlowAI! 🎉',
      description: 'Your AI-powered content creation platform',
      content: (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{
            width: '120px',
            height: '120px',
            margin: '0 auto 2rem',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)'
          }}>
            <Sparkles size={60} color="white" />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
            Welcome to FlowAI
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '500px', margin: '0 auto' }}>
            Create viral content with AI-powered scripts, trending topics, and analytics. Let's get you started!
          </p>
        </div>
      )
    },
    {
      title: 'AI Script Generator',
      description: 'Create professional scripts in seconds',
      icon: <FileText size={40} />,
      content: (
        <div style={{ padding: '1.5rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 1.5rem',
            borderRadius: '16px',
            background: 'rgba(99, 102, 241, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FileText size={40} color="var(--primary-color)" />
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', textAlign: 'center', color: 'var(--text-primary)' }}>
            AI Script Generator
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 2 }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <CheckCircle size={20} color="#10b981" />
              Generate scripts for YouTube, Instagram, TikTok & more
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <CheckCircle size={20} color="#10b981" />
              AI-powered viral hooks and hashtags
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <CheckCircle size={20} color="#10b981" />
              Customize tone, style, and duration
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <CheckCircle size={20} color="#10b981" />
              Export and save to your library
            </li>
          </ul>
        </div>
      )
    },
    {
      title: 'Trending Suggestions',
      description: 'Discover viral content ideas',
      icon: <TrendingUp size={40} />,
      content: (
        <div style={{ padding: '1.5rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 1.5rem',
            borderRadius: '16px',
            background: 'rgba(236, 72, 153, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <TrendingUp size={40} color="var(--secondary-color)" />
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', textAlign: 'center', color: 'var(--text-primary)' }}>
            Trending Suggestions
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 2 }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <CheckCircle size={20} color="#10b981" />
              Real-time trending topics from Twitter & Reddit
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <CheckCircle size={20} color="#10b981" />
              Viral score & competition analysis
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <CheckCircle size={20} color="#10b981" />
              Save favorite topics for later
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <CheckCircle size={20} color="#10b981" />
              Platform-specific recommendations
            </li>
          </ul>
        </div>
      )
    },
    {
      title: 'Analytics & Insights',
      description: 'Track your performance',
      icon: <BarChart3 size={40} />,
      content: (
        <div style={{ padding: '1.5rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 1.5rem',
            borderRadius: '16px',
            background: 'rgba(245, 158, 11, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BarChart3 size={40} color="var(--accent-color)" />
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', textAlign: 'center', color: 'var(--text-primary)' }}>
            Analytics & Insights
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 2 }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <CheckCircle size={20} color="#10b981" />
              Track followers, engagement & growth
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <CheckCircle size={20} color="#10b981" />
              Best posting times & content performance
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <CheckCircle size={20} color="#10b981" />
              Multi-platform analytics dashboard
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <CheckCircle size={20} color="#10b981" />
              Export reports as PDF/CSV
            </li>
          </ul>
        </div>
      )
    },
    {
      title: 'Get Started!',
      description: 'You\'re all set',
      content: (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{
            width: '100px',
            height: '100px',
            margin: '0 auto 2rem',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)'
          }}>
            <CheckCircle size={50} color="white" />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
            You're All Set!
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '450px', margin: '0 auto 2rem' }}>
            Ready to create amazing content? Let's start with your first AI-generated script!
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', maxWidth: '400px', margin: '0 auto' }}>
            <button
              onClick={() => {
                handleComplete();
                navigate('/script-generator');
              }}
              className="btn btn-primary"
              style={{ padding: '0.875rem 1.5rem', fontSize: '0.95rem', fontWeight: 600 }}
            >
              <Sparkles size={18} />
              Generate Script
            </button>
            <button
              onClick={() => {
                handleComplete();
                navigate('/suggestions');
              }}
              className="btn btn-secondary"
              style={{ padding: '0.875rem 1.5rem', fontSize: '0.95rem', fontWeight: 600 }}
            >
              <TrendingUp size={18} />
              View Trends
            </button>
          </div>
        </div>
      )
    }
  ];

  const handleComplete = () => {
    localStorage.setItem('onboarding_completed', 'true');
    setIsVisible(false);
    if (onComplete) onComplete();
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '1rem',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      <div style={{
        background: 'var(--background-card)',
        borderRadius: 'var(--radius-xl)',
        maxWidth: '600px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        border: '1px solid var(--border-color)',
        position: 'relative',
        animation: 'slideUp 0.4s ease-out'
      }}>
        {/* Close Button */}
        <button
          onClick={handleSkip}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'rgba(255,255,255,0.05)',
            border: 'none',
            borderRadius: '8px',
            padding: '0.5rem',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            transition: 'all 0.2s',
            zIndex: 10
          }}
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div style={{ padding: '2rem' }}>
          {steps[currentStep].content}
        </div>

        {/* Progress Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '0 2rem 1.5rem' }}>
          {steps.map((_, index) => (
            <div
              key={index}
              style={{
                width: index === currentStep ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: index === currentStep ? 'var(--primary-color)' : 'rgba(255,255,255,0.2)',
                transition: 'all 0.3s'
              }}
            />
          ))}
        </div>

        {/* Navigation */}
        {currentStep < steps.length - 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0 2rem 2rem',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '1.5rem'
          }}>
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="btn btn-secondary"
              style={{
                padding: '0.75rem 1.25rem',
                opacity: currentStep === 0 ? 0.5 : 1,
                cursor: currentStep === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              <ChevronLeft size={18} />
              Previous
            </button>
            <button
              onClick={handleSkip}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 600
              }}
            >
              Skip Tour
            </button>
            <button
              onClick={handleNext}
              className="btn btn-primary"
              style={{ padding: '0.75rem 1.25rem' }}
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
