import React, { useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { 
  HelpCircle,
  Book,
  Video,
  MessageCircle,
  Mail,
  Search,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Zap,
  FileText,
  BarChart3,
  Settings,
  CreditCard,
  CheckCircle,
  Play
} from 'lucide-react';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const categories = [
    { id: 'getting-started', label: 'Getting Started', icon: <Zap size={18} /> },
    { id: 'script-generator', label: 'Script Generator', icon: <FileText size={18} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
    { id: 'settings', label: 'Settings & API', icon: <Settings size={18} /> },
    { id: 'subscription', label: 'Subscription', icon: <CreditCard size={18} /> }
  ];

  const faqs = {
    'getting-started': [
      {
        question: 'How do I get started with FlowAI?',
        answer: 'Start by creating an account and choosing a subscription plan. Then, connect your social media accounts on the Dashboard, and you\'re ready to generate scripts!'
      },
      {
        question: 'What platforms does FlowAI support?',
        answer: 'FlowAI supports YouTube, Instagram, TikTok, Twitter, and LinkedIn. You can generate platform-specific scripts optimized for each platform\'s audience and format.'
      },
      {
        question: 'Do I need an API key to use FlowAI?',
        answer: 'For basic features, no API key is required. However, to unlock AI-powered script generation with Google Gemini, you\'ll need to add your Gemini API key in Settings > API Keys.'
      }
    ],
    'script-generator': [
      {
        question: 'How does the AI script generator work?',
        answer: 'Our script generator uses Google Gemini AI to create professional, engaging scripts based on your topic, platform, style, and duration preferences. It analyzes trending topics and your niche to generate relevant content.'
      },
      {
        question: 'Can I customize the generated scripts?',
        answer: 'Yes! After generation, you can copy the script to your clipboard and edit it in any text editor. You can also regenerate with different parameters to get variations.'
      },
      {
        question: 'What are viral hooks and hashtags?',
        answer: 'Viral hooks are attention-grabbing opening lines designed to stop scrolling and engage viewers. Hashtags are AI-generated tags optimized for discoverability on your chosen platform.'
      },
      {
        question: 'How many scripts can I generate?',
        answer: 'The number of scripts depends on your subscription plan: Free (5/month), Pro (50/month), Advance (Unlimited). Scripts reset monthly.'
      }
    ],
    'analytics': [
      {
        question: 'How do I connect my social media accounts?',
        answer: 'Go to the Dashboard and click "Add Platform" in the Social Media Analytics section. Enter your profile URL, and FlowAI will fetch your analytics data.'
      },
      {
        question: 'What analytics does FlowAI track?',
        answer: 'FlowAI tracks followers, engagement rates, views, growth trends, best posting times, and content performance by type. The Analysis page provides detailed insights.'
      },
      {
        question: 'How often is analytics data updated?',
        answer: 'Analytics data is fetched when you add or refresh a platform. For real-time updates, configure your YouTube API key in Settings.'
      }
    ],
    'settings': [
      {
        question: 'Where do I get a Gemini API key?',
        answer: 'Visit Google AI Studio (makersuite.google.com/app/apikey), sign in with your Google account, and create a new API key. Copy it and paste it in Settings > API Keys.'
      },
      {
        question: 'Is my API key secure?',
        answer: 'Yes! Your API key is stored locally in your browser and never sent to our servers. It\'s only used to communicate directly with Google\'s API.'
      },
      {
        question: 'Can I export my data?',
        answer: 'Absolutely! Go to Settings > Data Management and click "Export Data" to download all your scripts, settings, and analytics in JSON format.'
      }
    ],
    'subscription': [
      {
        question: 'What subscription plans are available?',
        answer: 'We offer three plans: Free (5 scripts/month), Pro (₹99/month, 50 scripts), and Advance (₹199/month, unlimited scripts + priority support).'
      },
      {
        question: 'Can I upgrade or downgrade my plan?',
        answer: 'Yes! Visit the Subscription page to change your plan anytime. Upgrades are instant, and downgrades take effect at the next billing cycle.'
      },
      {
        question: 'Do unused scripts roll over?',
        answer: 'No, script quotas reset monthly. However, all generated scripts are saved in your Content Library permanently.'
      }
    ]
  };

  const tutorials = [
    {
      title: 'Getting Started with FlowAI',
      description: 'Learn the basics and create your first script',
      duration: '5 min',
      icon: <Play size={20} />
    },
    {
      title: 'Optimizing Scripts for Each Platform',
      description: 'Platform-specific tips for maximum engagement',
      duration: '8 min',
      icon: <Play size={20} />
    },
    {
      title: 'Using Analytics to Grow Your Audience',
      description: 'Understand your data and make informed decisions',
      duration: '10 min',
      icon: <Play size={20} />
    },
    {
      title: 'Setting Up API Keys',
      description: 'Configure Gemini and YouTube APIs',
      duration: '3 min',
      icon: <Play size={20} />
    }
  ];

  const quickLinks = [
    { label: 'API Documentation', icon: <Book size={16} />, url: 'https://ai.google.dev/docs' },
    { label: 'Community Forum', icon: <MessageCircle size={16} />, url: '#' },
    { label: 'Feature Requests', icon: <Zap size={16} />, url: '#' },
    { label: 'Report a Bug', icon: <Mail size={16} />, url: '#' }
  ];

  const filteredFAQs = searchQuery
    ? Object.values(faqs).flat().filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs[activeCategory] || [];

  return (
    <DashboardLayout>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
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
            <HelpCircle size={24} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '2rem', margin: 0, fontWeight: 800, color: 'var(--text-primary)' }}>
              Help & Support
            </h1>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Find answers, tutorials, and get help with FlowAI
            </p>
          </div>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', maxWidth: '600px', marginTop: '1.5rem' }}>
          <Search size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem 1.25rem 1rem 3.5rem',
              background: 'var(--background-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              color: 'var(--text-primary)',
              fontSize: '1rem'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem' }}>
        {/* Sidebar */}
        <div>
          {/* Categories */}
          <div style={{
            background: 'var(--background-card)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.5rem',
            border: '1px solid var(--border-color)',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase' }}>
              Categories
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setSearchQuery('');
                  }}
                  style={{
                    padding: '0.75rem 1rem',
                    background: activeCategory === cat.id ? 'var(--primary-color)' : 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    color: activeCategory === cat.id ? 'white' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    textAlign: 'left',
                    transition: 'all 0.2s'
                  }}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div style={{
            background: 'var(--background-card)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.5rem',
            border: '1px solid var(--border-color)'
          }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase' }}>
              Quick Links
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {quickLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    transition: 'all 0.2s'
                  }}
                >
                  {link.icon}
                  {link.label}
                  <ExternalLink size={12} style={{ marginLeft: 'auto' }} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div>
          {/* Video Tutorials */}
          <div style={{
            background: 'var(--background-card)',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            border: '1px solid var(--border-color)',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Video size={24} color="var(--primary-color)" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Video Tutorials
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {tutorials.map((tutorial, i) => (
                <div
                  key={i}
                  style={{
                    padding: '1.25rem',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: 'rgba(99, 102, 241, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--primary-color)'
                    }}>
                      {tutorial.icon}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {tutorial.duration}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    {tutorial.title}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                    {tutorial.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div style={{
            background: 'var(--background-card)',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Book size={24} color="var(--primary-color)" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                {searchQuery ? 'Search Results' : 'Frequently Asked Questions'}
              </h2>
            </div>

            {filteredFAQs.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredFAQs.map((faq, i) => (
                  <FAQItem
                    key={i}
                    question={faq.question}
                    answer={faq.answer}
                    isExpanded={expandedFAQ === i}
                    onToggle={() => setExpandedFAQ(expandedFAQ === i ? null : i)}
                  />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                <Search size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                <p>No results found for "{searchQuery}"</p>
              </div>
            )}
          </div>

          {/* Contact Support */}
          <div style={{
            marginTop: '2rem',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1))',
            border: '1px solid var(--primary-color)',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <MessageCircle size={40} color="var(--primary-color)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              Still need help?
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
              Our support team is here to help. Send us a message and we'll get back to you within 24 hours.
            </p>
            <button
              className="btn btn-primary"
              style={{ padding: '0.875rem 2rem' }}
              onClick={() => window.location.href = 'mailto:support@flowai.com'}
            >
              <Mail size={18} />
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function FAQItem({ question, answer, isExpanded, onToggle }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      transition: 'all 0.2s'
    }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          padding: '1.25rem 1.5rem',
          background: 'transparent',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          textAlign: 'left'
        }}
      >
        <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', flex: 1, paddingRight: '1rem' }}>
          {question}
        </span>
        {isExpanded ? <ChevronDown size={20} color="var(--primary-color)" /> : <ChevronRight size={20} color="var(--text-muted)" />}
      </button>
      {isExpanded && (
        <div style={{
          padding: '0 1.5rem 1.25rem 1.5rem',
          fontSize: '0.9rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.7,
          borderTop: '1px solid var(--border-color)',
          paddingTop: '1.25rem'
        }}>
          {answer}
        </div>
      )}
    </div>
  );
}
