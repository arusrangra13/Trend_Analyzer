import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { SubscriptionService } from '../services/subscriptionService';
import { SocialMediaService } from '../services/socialMediaService';
import { TrendService } from '../services/trendService';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  TrendingUp, 
  Brain, 
  Zap, 
  AlertCircle, 
  CheckCircle,
  CreditCard,
  ArrowRight,
  MessageSquare,
  Hash,
  Target,
  Clock,
  Eye,
  Sparkles
} from 'lucide-react';

export default function ScriptGeneratorPage() {
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [scriptData, setScriptData] = useState({
    topic: '',
    platform: 'youtube',
    style: 'casual',
    length: 'medium',
    keywords: []
  });
  const [generatedScript, setGeneratedScript] = useState('');
  const [trendingTopics, setTrendingTopics] = useState([]);

  useEffect(() => {
    checkSubscription();
    loadTrendingTopics();
  }, []);

  const checkSubscription = () => {
    const currentSubscription = SubscriptionService.getCurrentSubscription();
    const status = SubscriptionService.getSubscriptionStatus();
    
    setSubscription(currentSubscription);
    setSubscriptionStatus(status);
    setLoading(false);

    // Redirect to subscription if no active plan
    if (!status.canGenerate) {
      setTimeout(() => {
        navigate('/subscription');
      }, 2000);
    }
  };

  const loadTrendingTopics = async () => {
    try {
      const socialData = SocialMediaService.loadSocialData();
      const trends = await TrendService.getTrendAnalysis(socialData);
      setTrendingTopics(trends?.twitterTrends?.slice(0, 5) || []);
    } catch (error) {
      console.error('Error loading trending topics:', error);
    }
  };

  const handleGenerateScript = async () => {
    if (!SubscriptionService.canGenerateScript()) {
      navigate('/subscription');
      return;
    }

    setGenerating(true);
    try {
      // Use a script
      const remaining = SubscriptionService.useScript();
      setSubscription(prev => ({ ...prev, scriptsRemaining: remaining }));

      // Generate script using Google Gemini API (simulated for now)
      const script = await generateScriptWithGemini(scriptData);
      setGeneratedScript(script);
    } catch (error) {
      console.error('Error generating script:', error);
      alert(error.message);
    } finally {
      setGenerating(false);
    }
  };

  const generateScriptWithGemini = async (data) => {
    // Simulate Google Gemini API call
    // In production, integrate with actual Google Gemini API
    await new Promise(resolve => setTimeout(resolve, 2000));

    const templates = {
      youtube: {
        casual: `Hey everyone! Welcome back to the channel. Today we're talking about ${data.topic}.\n\n${data.topic} has been trending lately, and for good reason. Let me break down what you need to know...\n\nFirst off, ${data.topic} is changing the game because...\n\nIf you found this helpful, don't forget to like and subscribe!`,
        professional: `In today's comprehensive analysis, we'll examine ${data.topic} and its implications for the industry.\n\n${data.topic} represents a significant shift in how we approach... Let's explore the key factors:\n\n1. Understanding the fundamentals of ${data.topic}\n2. Recent developments and trends\n3. Future implications and opportunities\n\nThank you for watching. Please share your thoughts in the comments below.`,
        energetic: `WHAT'S UP EVERYONE! 🔥 Today we're diving deep into ${data.topic} and trust me, you don't want to miss this!\n\n${data.topic} is absolutely blowing up right now and I'm here to tell you WHY!\n\nLet's go! 💪\n\nSMASH that like button if you're excited about ${data.topic}!`
      },
      instagram: {
        casual: `${data.topic} ✨\n\nBeen seeing this everywhere lately and had to share my thoughts!\n\nWhat do you guys think about ${data.topic}? Drop a comment below! 👇\n\n#${data.topic.replace(/\s+/g, '')} #trending #viral`,
        professional: `Understanding ${data.topic}: A Professional Perspective\n\nKey insights on ${data.topic} and its impact on our industry.\n\nFollow for more expert analysis on trending topics.\n\n#${data.topic.replace(/\s+/g, '')} #business #professional`,
        energetic: `${data.topic} IS TAKING OVER! 🚀\n\nCan't believe how fast ${data.topic} is growing!\n\nWho else is excited about this?! 🙌\n\n#${data.topic.replace(/\s+/g, '')} #trending #viral #excited`
      },
      twitter: {
        casual: `${data.topic} is trending and I have thoughts... 🤔\n\nWhat's your take on ${data.topic}?\n\n#${data.topic.replace(/\s+/g, '')} #trending`,
        professional: `Analysis: ${data.topic} represents a significant development in the industry. Key implications include...\n\n#${data.topic.replace(/\s+/g, '')} #analysis #business`,
        energetic: `${data.topic} IS EVERYWHERE RIGHT NOW! 🔥\n\nIf you're not talking about ${data.topic}, you're missing out!\n\n#${data.topic.replace(/\s+/g, '')} #trending #viral`
      }
    };

    const platformTemplates = templates[data.platform] || templates.youtube;
    const script = platformTemplates[data.style] || platformTemplates.casual;

    return script;
  };

  const handleTopicSelect = (topic) => {
    setScriptData(prev => ({ ...prev, topic: topic.name }));
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ color: 'var(--text-secondary)' }}>Loading subscription status...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!subscriptionStatus?.canGenerate) {
    return (
      <DashboardLayout>
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          background: 'var(--background-light)',
          borderRadius: '12px',
          border: '1px solid var(--border-color)'
        }}>
          <AlertCircle size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
          <h2 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>
            No Active Subscription
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            {subscriptionStatus?.message || 'You need an active subscription to generate scripts.'}
          </p>
          <button
            onClick={() => navigate('/subscription')}
            className="btn btn-primary"
            style={{ padding: '1rem 2rem', fontSize: '1rem' }}
          >
            <CreditCard size={18} style={{ marginRight: '0.5rem' }} />
            Choose a Plan
          </button>
          <div style={{ marginTop: '2rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Redirecting to subscription page...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header with Subscription Status */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>
            Script Generator
          </h1>
          <div style={{
            background: 'var(--background-light)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} color="var(--primary-color)" />
              <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>
                {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)} Plan
              </span>
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>
              {subscription.scriptsRemaining}/{subscription.totalScripts} scripts
            </div>
          </div>
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>
          Generate AI-powered scripts using Google Gemini, trending topics, and domain-specific insights
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Left Column - Input Form */}
        <div>
          {/* Trending Topics */}
          {trendingTopics.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={18} color="#ef4444" />
                Trending Topics
              </h3>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {trendingTopics.map((topic, index) => (
                  <div
                    key={index}
                    onClick={() => handleTopicSelect(topic)}
                    style={{
                      background: 'var(--background-light)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '0.75rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'var(--primary-color)';
                      e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'var(--background-light)';
                      e.target.style.color = 'var(--text-primary)';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: '500' }}>{topic.name}</span>
                      <span style={{ color: '#10b981', fontSize: '0.875rem' }}>{topic.growth}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                      {topic.volume} mentions • {topic.category}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Script Form */}
          <div style={{
            background: 'var(--background-light)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '1.5rem'
          }}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
              Script Details
            </h3>

            {/* Topic Input */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)', fontWeight: '500' }}>
                Topic/Subject
              </label>
              <input
                type="text"
                value={scriptData.topic}
                onChange={(e) => setScriptData(prev => ({ ...prev, topic: e.target.value }))}
                placeholder="Enter your topic or select from trending topics"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  background: 'var(--background-color)',
                  color: 'var(--text-primary)',
                  fontSize: '1rem'
                }}
              />
            </div>

            {/* Platform Selection */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)', fontWeight: '500' }}>
                Platform
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                {['youtube', 'instagram', 'twitter'].map(platform => (
                  <button
                    key={platform}
                    onClick={() => setScriptData(prev => ({ ...prev, platform }))}
                    className={`btn ${scriptData.platform === platform ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '0.5rem', fontSize: '0.875rem' }}
                  >
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Style Selection */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)', fontWeight: '500' }}>
                Style
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                {['casual', 'professional', 'energetic'].map(style => (
                  <button
                    key={style}
                    onClick={() => setScriptData(prev => ({ ...prev, style }))}
                    className={`btn ${scriptData.style === style ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '0.5rem', fontSize: '0.875rem' }}
                  >
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Length Selection */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)', fontWeight: '500' }}>
                Length
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                {['short', 'medium', 'long'].map(length => (
                  <button
                    key={length}
                    onClick={() => setScriptData(prev => ({ ...prev, length }))}
                    className={`btn ${scriptData.length === length ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '0.5rem', fontSize: '0.875rem' }}
                  >
                    {length.charAt(0).toUpperCase() + length.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateScript}
              disabled={!scriptData.topic.trim() || generating}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1rem',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {generating ? (
                <>
                  <div style={{ width: '16px', height: '16px', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  Generating with AI...
                </>
              ) : (
                <>
                  <Brain size={18} />
                  Generate Script ({subscription.scriptsRemaining} left)
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column - Generated Script */}
        <div>
          <div style={{
            background: 'var(--background-light)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '1.5rem',
            minHeight: '400px'
          }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={18} />
              Generated Script
            </h3>
            
            {generatedScript ? (
              <div>
                <div style={{
                  background: 'var(--background-color)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '1rem',
                  marginBottom: '1rem',
                  whiteSpace: 'pre-wrap',
                  color: 'var(--text-primary)',
                  lineHeight: '1.6'
                }}>
                  {generatedScript}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => navigator.clipboard.writeText(generatedScript)}
                    className="btn btn-secondary"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                  >
                    Copy Script
                  </button>
                  <button
                    onClick={() => setGeneratedScript('')}
                    className="btn btn-secondary"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                  >
                    Clear
                  </button>
                </div>
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '3rem 1rem',
                color: 'var(--text-secondary)'
              }}>
                <FileText size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <p>Your generated script will appear here</p>
                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  Fill in the details and click "Generate Script" to create AI-powered content
                </p>
              </div>
            )}
          </div>

          {/* AI Features Info */}
          {SubscriptionService.hasFeature('gemini_ai') && (
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '12px',
              padding: '1.5rem',
              marginTop: '1.5rem',
              color: 'white'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Brain size={20} />
                <span style={{ fontWeight: 'bold' }}>Powered by Google Gemini AI</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>
                Advanced AI technology analyzes trending topics, your domain expertise, and platform-specific requirements to create engaging, high-quality scripts.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
