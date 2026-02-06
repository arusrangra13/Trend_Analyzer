import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { SubscriptionService } from '../services/subscriptionService';
import { GeminiService } from '../services/geminiService';
import { TrendService } from '../services/trendService';
import { ScriptTrackingService } from '../services/scriptTrackingService';
import { SocialMediaService } from '../services/socialMediaService';
import { 
  FileText, 
  TrendingUp, 
  Copy, 
  Download,
  RefreshCw,
  CheckCircle,
  Sparkles,
  Zap,
  Clock,
  Target,
  Hash,
  Wand2,
  Save,
  History,
  Play,
  Youtube,
  Instagram,
  Twitter,
  Linkedin,
  Film
} from 'lucide-react';

export default function ScriptGeneratorPage() {
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Form state
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('youtube');
  const [style, setStyle] = useState('professional');
  const [duration, setDuration] = useState('medium');
  const [includeHook, setIncludeHook] = useState(true);
  const [includeCTA, setIncludeCTA] = useState(true);
  const [includeHashtags, setIncludeHashtags] = useState(true);
  
  // Generated content
  const [generatedScript, setGeneratedScript] = useState('');
  const [generatedHook, setGeneratedHook] = useState('');
  const [generatedHashtags, setGeneratedHashtags] = useState([]);
  const [scriptMetrics, setScriptMetrics] = useState(null);
  
  // Trending topics
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [savedScripts, setSavedScripts] = useState([]);

  useEffect(() => {
    checkSubscription();
    loadTrendingTopics();
    loadSavedScripts();
  }, []);

  const checkSubscription = () => {
    const currentSubscription = SubscriptionService.getCurrentSubscription();
    setSubscription(currentSubscription);
    setLoading(false);
  };

  const loadTrendingTopics = async () => {
    try {
      const socialData = SocialMediaService.loadSocialData();
      const trends = await TrendService.getTrendAnalysis(socialData);
      setTrendingTopics(trends?.twitterTrends?.slice(0, 6) || []);
    } catch (error) {
      console.error('Error loading trending topics:', error);
    }
  };

  const loadSavedScripts = () => {
    const scripts = ScriptTrackingService.getAllScripts();
    setSavedScripts(scripts.slice(0, 5)); // Show last 5
  };

  const handleGenerateScript = async () => {
    if (!SubscriptionService.canGenerateScript()) {
      navigate('/subscription');
      return;
    }

    if (!topic.trim()) {
      alert('Please enter a topic for your script');
      return;
    }

    setGenerating(true);
    try {
      // Use a script from quota
      const remaining = SubscriptionService.useScript();
      setSubscription(prev => ({ ...prev, scriptsRemaining: remaining }));

      // Calculate word count based on duration
      const wordCount = getWordCountForDuration(duration);

      // Get trending data for context
      const socialData = SocialMediaService.loadSocialData();
      const trends = await TrendService.getTrendAnalysis(socialData);
      const domain = trends?.domain || 'general content';
      const keywords = trends?.keywords?.slice(0, 5).map(k => k.keyword) || [];

      // Generate script using Gemini - pass object with all required properties
      const scriptData = {
        topic,
        platform,
        style,
        length: duration,
        wordCount,
        domain,
        trendingKeywords: keywords
      };

      const script = await GeminiService.generateScript(scriptData);
      
      // Generate hook if requested
      let hook = '';
      if (includeHook) {
        hook = await generateHook(topic, platform, style);
      }

      // Generate hashtags if requested
      let hashtags = [];
      if (includeHashtags) {
        hashtags = await generateHashtags(topic, platform);
      }

      setGeneratedScript(script);
      setGeneratedHook(hook);
      setGeneratedHashtags(hashtags);

      // Calculate metrics
      const metrics = calculateScriptMetrics(script, duration);
      setScriptMetrics(metrics);

      // Save to history
      ScriptTrackingService.saveScript({
        topic,
        platform,
        style,
        duration,
        script,
        hook,
        hashtags,
        wordCount: script.split(/\s+/).length,
        timestamp: new Date().toISOString()
      });

      loadSavedScripts();
    } catch (error) {
      console.error('Error generating script:', error);
      alert(`Failed to generate script: ${error.message}. Please check your API key and try again.`);
    } finally {
      setGenerating(false);
    }
  };

  const generateHook = async (topic, platform, style) => {
    const hookPrompt = `Generate a compelling 1-2 sentence hook for a ${platform} video about "${topic}". 
    Style: ${style}. 
    Make it attention-grabbing and scroll-stopping. 
    Return ONLY the hook text, nothing else.`;
    
    try {
      const hook = await GeminiService.generateCustomAIContent(hookPrompt);
      return hook.trim();
    } catch (error) {
      console.error('Error generating hook:', error);
      return '';
    }
  };

  const generateHashtags = async (topic, platform) => {
    const hashtagPrompt = `Generate 8-10 relevant hashtags for a ${platform} post about "${topic}". 
    Include a mix of popular and niche hashtags. 
    Return ONLY the hashtags separated by spaces, with # symbols.`;
    
    try {
      const response = await GeminiService.generateCustomAIContent(hashtagPrompt);
      const hashtags = response.split(/\s+/).filter(tag => tag.startsWith('#')).slice(0, 10);
      return hashtags;
    } catch (error) {
      console.error('Error generating hashtags:', error);
      return [];
    }
  };

  const getWordCountForDuration = (duration) => {
    const counts = {
      'short': 150,      // 30-60 seconds
      'medium': 300,     // 1-2 minutes
      'long': 600,       // 3-5 minutes
      'extended': 1200   // 8-10 minutes
    };
    return counts[duration] || 300;
  };

  const calculateScriptMetrics = (script, duration) => {
    const words = script.split(/\s+/).length;
    const characters = script.length;
    const sentences = script.split(/[.!?]+/).filter(s => s.trim()).length;
    
    // Average speaking rate: 150 words per minute
    const estimatedMinutes = Math.ceil(words / 150);
    
    return {
      words,
      characters,
      sentences,
      estimatedTime: `${estimatedMinutes} min`,
      readability: sentences > 0 ? Math.round(words / sentences) : 0
    };
  };

  const handleCopyScript = () => {
    const fullContent = [
      generatedHook ? `HOOK:\n${generatedHook}\n\n` : '',
      `SCRIPT:\n${generatedScript}`,
      generatedHashtags.length > 0 ? `\n\nHASHTAGS:\n${generatedHashtags.join(' ')}` : ''
    ].join('');

    navigator.clipboard.writeText(fullContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadScript = () => {
    const fullContent = [
      `Topic: ${topic}`,
      `Platform: ${platform}`,
      `Style: ${style}`,
      `Duration: ${duration}`,
      `Generated: ${new Date().toLocaleString()}`,
      '\n---\n',
      generatedHook ? `HOOK:\n${generatedHook}\n\n` : '',
      `SCRIPT:\n${generatedScript}`,
      generatedHashtags.length > 0 ? `\n\nHASHTAGS:\n${generatedHashtags.join(' ')}` : '',
      scriptMetrics ? `\n\n---\nMETRICS:\nWords: ${scriptMetrics.words}\nEstimated Time: ${scriptMetrics.estimatedTime}` : ''
    ].join('');

    const blob = new Blob([fullContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `script-${topic.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'youtube': return <Youtube size={18} />;
      case 'instagram': return <Instagram size={18} />;
      case 'twitter': return <Twitter size={18} />;
      case 'linkedin': return <Linkedin size={18} />;
      case 'tiktok': return <Film size={18} />;
      default: return <FileText size={18} />;
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
            <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
              <Sparkles size={24} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize: '2rem', margin: 0, fontWeight: 800, color: 'var(--text-primary)' }}>
                AI Script Generator
              </h1>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Create professional scripts powered by Google Gemini AI
              </p>
            </div>
          </div>
          
          {subscription && (
            <div style={{
              background: 'var(--background-card)',
              padding: '1rem 1.5rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 600 }}>
                Scripts Remaining
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-color)' }}>
                {subscription.scriptsRemaining || 0}
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem' }}>
        {/* Main Generator */}
        <div>
          {/* Input Form */}
          <div style={{
            background: 'var(--background-card)',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-lg)',
            marginBottom: '2rem'
          }}>
            <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Script Configuration
            </h3>

            {/* Topic Input */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Topic / Title
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., How to grow on Instagram in 2024"
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  background: 'var(--background-dark)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              />
            </div>

            {/* Platform Selection */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Platform
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem' }}>
                {[
                  { value: 'youtube', label: 'YouTube', icon: <Youtube size={18} /> },
                  { value: 'instagram', label: 'Instagram', icon: <Instagram size={18} /> },
                  { value: 'tiktok', label: 'TikTok', icon: <Film size={18} /> },
                  { value: 'twitter', label: 'Twitter', icon: <Twitter size={18} /> },
                  { value: 'linkedin', label: 'LinkedIn', icon: <Linkedin size={18} /> }
                ].map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setPlatform(p.value)}
                    style={{
                      padding: '0.75rem',
                      background: platform === p.value ? 'var(--primary-color)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${platform === p.value ? 'var(--primary-color)' : 'var(--border-color)'}`,
                      borderRadius: 'var(--radius-md)',
                      color: platform === p.value ? 'white' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      transition: 'all 0.2s'
                    }}
                  >
                    {p.icon}
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Style Selection */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Tone & Style
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                {[
                  { value: 'professional', label: 'Professional' },
                  { value: 'casual', label: 'Casual' },
                  { value: 'humorous', label: 'Humorous' },
                  { value: 'educational', label: 'Educational' }
                ].map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setStyle(s.value)}
                    style={{
                      padding: '0.75rem',
                      background: style === s.value ? 'var(--primary-color)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${style === s.value ? 'var(--primary-color)' : 'var(--border-color)'}`,
                      borderRadius: 'var(--radius-md)',
                      color: style === s.value ? 'white' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      transition: 'all 0.2s'
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Selection */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Video Duration
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                {[
                  { value: 'short', label: '30-60s', words: '~150 words' },
                  { value: 'medium', label: '1-2 min', words: '~300 words' },
                  { value: 'long', label: '3-5 min', words: '~600 words' },
                  { value: 'extended', label: '8-10 min', words: '~1200 words' }
                ].map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setDuration(d.value)}
                    style={{
                      padding: '0.75rem',
                      background: duration === d.value ? 'var(--primary-color)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${duration === d.value ? 'var(--primary-color)' : 'var(--border-color)'}`,
                      borderRadius: 'var(--radius-md)',
                      color: duration === d.value ? 'white' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      transition: 'all 0.2s',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem'
                    }}
                  >
                    <span>{d.label}</span>
                    <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>{d.words}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Options */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Include
              </label>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={includeHook}
                    onChange={(e) => setIncludeHook(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Viral Hook</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={includeCTA}
                    onChange={(e) => setIncludeCTA(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Call-to-Action</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={includeHashtags}
                    onChange={(e) => setIncludeHashtags(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Hashtags</span>
                </label>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateScript}
              disabled={generating || !topic.trim()}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                opacity: generating || !topic.trim() ? 0.6 : 1
              }}
            >
              {generating ? (
                <>
                  <RefreshCw size={20} className="spinning" />
                  Generating with AI...
                </>
              ) : (
                <>
                  <Wand2 size={20} />
                  Generate Script
                </>
              )}
            </button>
          </div>

          {/* Generated Script Output */}
          {generatedScript && (
            <div style={{
              background: 'var(--background-card)',
              borderRadius: 'var(--radius-xl)',
              padding: '2rem',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Generated Script
                </h3>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={handleCopyScript}
                    className="btn btn-secondary"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={handleDownloadScript}
                    className="btn btn-secondary"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>
              </div>

              {/* Hook */}
              {generatedHook && (
                <div style={{
                  background: 'rgba(99, 102, 241, 0.1)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <Zap size={16} color="var(--primary-color)" />
                    <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary-color)', textTransform: 'uppercase' }}>
                      Viral Hook
                    </h4>
                  </div>
                  <p style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)', lineHeight: 1.6, fontWeight: 500 }}>
                    {generatedHook}
                  </p>
                </div>
              )}

              {/* Main Script */}
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                marginBottom: '1.5rem'
              }}>
                <pre style={{
                  margin: 0,
                  fontFamily: 'inherit',
                  fontSize: '0.95rem',
                  color: 'var(--text-primary)',
                  lineHeight: 1.8,
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word'
                }}>
                  {generatedScript}
                </pre>
              </div>

              {/* Hashtags */}
              {generatedHashtags.length > 0 && (
                <div style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <Hash size={16} color="#10b981" />
                    <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase' }}>
                      Recommended Hashtags
                    </h4>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {generatedHashtags.map((tag, index) => (
                      <span
                        key={index}
                        style={{
                          padding: '0.35rem 0.75rem',
                          background: 'rgba(16, 185, 129, 0.15)',
                          borderRadius: '20px',
                          fontSize: '0.85rem',
                          color: '#10b981',
                          fontWeight: 600
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Metrics */}
              {scriptMetrics && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                  gap: '1rem',
                  padding: '1.25rem',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: 'var(--radius-lg)'
                }}>
                  <MetricItem label="Words" value={scriptMetrics.words} />
                  <MetricItem label="Characters" value={scriptMetrics.characters} />
                  <MetricItem label="Sentences" value={scriptMetrics.sentences} />
                  <MetricItem label="Est. Time" value={scriptMetrics.estimatedTime} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          {/* Trending Topics */}
          <div style={{
            background: 'var(--background-card)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.5rem',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-md)',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <TrendingUp size={18} color="var(--primary-color)" />
              <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Trending Topics
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {trendingTopics.map((trend, index) => (
                <button
                  key={index}
                  onClick={() => setTopic(trend.name)}
                  style={{
                    padding: '0.75rem',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '0.85rem',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>{trend.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {trend.volume}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Scripts */}
          <div style={{
            background: 'var(--background-card)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.5rem',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <History size={18} color="var(--primary-color)" />
              <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Recent Scripts
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {savedScripts.length > 0 ? (
                savedScripts.map((script, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '0.875rem',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      {getPlatformIcon(script.platform)}
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {script.topic.substring(0, 30)}...
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {script.wordCount} words • {new Date(script.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0' }}>
                  No scripts yet
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function MetricItem({ label, value }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 600 }}>
        {label}
      </div>
      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
        {value}
      </div>
    </div>
  );
}
