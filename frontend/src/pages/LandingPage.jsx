import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  TrendingUp, 
  Sparkles, 
  Zap, 
  BarChart3, 
  ArrowRight, 
  CheckCircle,
  Star,
  Youtube,
  Instagram,
  Twitter,
  Calendar,
  FileText,
  Users,
  Eye,
  ThumbsUp,
  Target,
  Rocket,
  Shield,
  Clock,
  Award,
  ChevronRight,
  Play
} from 'lucide-react';
import '../assets/styles/landing.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="nav-logo">
            <div className="logo-icon">
              <TrendingUp size={24} />
            </div>
            <span className="logo-text">Flow<span style={{ color: 'var(--primary-color)' }}>AI</span></span>
          </div>
          
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#pricing">Pricing</a>
            <a href="#testimonials">Testimonials</a>
          </div>

          <div className="nav-actions">
            {isAuthenticated ? (
              <button onClick={() => navigate('/dashboard')} className="btn-primary">
                Go to Dashboard
              </button>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="btn-secondary">
                  Sign In
                </button>
                <button onClick={handleGetStarted} className="btn-primary">
                  Get Started Free
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={14} />
              <span>Powered by Advanced AI Technology</span>
            </div>
            
            <h1 className="hero-title">
              Create Viral Content
              <br />
              <span className="gradient-text">10x Faster</span>
            </h1>
            
            <p className="hero-description">
              Transform your content strategy with AI-powered insights. Analyze trending topics,
              generate engaging scripts, and schedule posts across all platforms—all in one place.
            </p>

            <div className="hero-cta">
              <button onClick={handleGetStarted} className="btn-hero-primary">
                Start Creating Free
                <ArrowRight size={20} />
              </button>
              <button className="btn-hero-secondary">
                <Play size={18} />
                Watch Demo
              </button>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">50K+</div>
                <div className="stat-label">Scripts Generated</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">98%</div>
                <div className="stat-label">Success Rate</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">4.9/5</div>
                <div className="stat-label">User Rating</div>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="dashboard-preview">
              <div className="preview-card card-1">
                <div className="card-header">
                  <TrendingUp size={20} color="#10b981" />
                  <span>Trending Topics</span>
                </div>
                <div className="card-content">
                  <div className="trend-item">
                    <span className="trend-score">95</span>
                    <span className="trend-text">AI Technology</span>
                  </div>
                  <div className="trend-item">
                    <span className="trend-score">87</span>
                    <span className="trend-text">Content Creation</span>
                  </div>
                </div>
              </div>

              <div className="preview-card card-2">
                <div className="card-header">
                  <Sparkles size={20} color="#6366f1" />
                  <span>AI Script Generator</span>
                </div>
                <div className="card-content">
                  <div className="script-line"></div>
                  <div className="script-line short"></div>
                  <div className="script-line"></div>
                </div>
              </div>

              <div className="preview-card card-3">
                <div className="card-header">
                  <BarChart3 size={20} color="#f59e0b" />
                  <span>Analytics</span>
                </div>
                <div className="card-content">
                  <div className="chart-bars">
                    <div className="bar" style={{ height: '60%' }}></div>
                    <div className="bar" style={{ height: '80%' }}></div>
                    <div className="bar" style={{ height: '45%' }}></div>
                    <div className="bar" style={{ height: '90%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="social-proof">
        <div className="container">
          <p className="proof-text">Trusted by content creators from</p>
          <div className="company-logos">
            <div className="logo-item"><Youtube size={32} /></div>
            <div className="logo-item"><Instagram size={32} /></div>
            <div className="logo-item"><Twitter size={32} /></div>
            <div className="logo-item"><TrendingUp size={32} /></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <Zap size={14} />
              <span>Powerful Features</span>
            </div>
            <h2 className="section-title">Everything You Need to Go Viral</h2>
            <p className="section-description">
              Professional tools designed for modern content creators
            </p>
          </div>

          <div className="features-grid">
            <FeatureCard
              icon={<Sparkles size={24} />}
              title="AI Script Generation"
              description="Generate engaging scripts in seconds with our advanced AI. Perfect hooks, compelling narratives, and optimized hashtags."
              color="#6366f1"
            />
            <FeatureCard
              icon={<TrendingUp size={24} />}
              title="Real-Time Trending Topics"
              description="Stay ahead with live YouTube trending data. Discover what's viral before your competitors do."
              color="#10b981"
            />
            <FeatureCard
              icon={<BarChart3 size={24} />}
              title="Advanced Analytics"
              description="Track performance, engagement rates, and viral scores. Make data-driven decisions for your content."
              color="#f59e0b"
            />
            <FeatureCard
              icon={<Calendar size={24} />}
              title="Content Calendar"
              description="Plan and schedule posts across all platforms. Never miss the perfect posting time again."
              color="#ec4899"
            />
            <FeatureCard
              icon={<Target size={24} />}
              title="Brand Kit"
              description="Maintain consistent branding with custom colors, fonts, voice, and keywords across all content."
              color="#8b5cf6"
            />
            <FeatureCard
              icon={<FileText size={24} />}
              title="Content Library"
              description="Organize and manage all your scripts in one place. Search, filter, and reuse your best content."
              color="#14b8a6"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-it-works">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <Rocket size={14} />
              <span>Simple Process</span>
            </div>
            <h2 className="section-title">Start Creating in 3 Easy Steps</h2>
          </div>

          <div className="steps-grid">
            <StepCard
              number="01"
              title="Discover Trends"
              description="Browse real-time trending topics from YouTube. Filter by category, region, and viral score."
              icon={<Eye size={40} />}
            />
            <StepCard
              number="02"
              title="Generate Scripts"
              description="Let AI create professional scripts tailored to your brand voice and target audience."
              icon={<Sparkles size={40} />}
            />
            <StepCard
              number="03"
              title="Schedule & Publish"
              description="Plan your content calendar and schedule posts for optimal engagement times."
              icon={<Calendar size={40} />}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <Users size={32} />
              </div>
              <div className="stat-value">10,000+</div>
              <div className="stat-label">Active Creators</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <FileText size={32} />
              </div>
              <div className="stat-value">50K+</div>
              <div className="stat-label">Scripts Generated</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <ThumbsUp size={32} />
              </div>
              <div className="stat-value">98%</div>
              <div className="stat-label">Satisfaction Rate</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Award size={32} />
              </div>
              <div className="stat-value">4.9/5</div>
              <div className="stat-label">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="testimonials">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <Star size={14} />
              <span>Testimonials</span>
            </div>
            <h2 className="section-title">Loved by Content Creators</h2>
          </div>

          <div className="testimonials-grid">
            <TestimonialCard
              quote="FlowAI completely transformed my content strategy. I've seen a 300% increase in engagement since using their AI script generator."
              author="Sarah Johnson"
              role="YouTube Creator"
              rating={5}
            />
            <TestimonialCard
              quote="The trending topics feature is a game-changer. I'm always ahead of the curve and my views have skyrocketed."
              author="Mike Chen"
              role="Social Media Manager"
              rating={5}
            />
            <TestimonialCard
              quote="Best investment I've made for my content business. The time I save with AI scripts is incredible."
              author="Emma Davis"
              role="Content Strategist"
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="pricing">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <Zap size={14} />
              <span>Pricing Plans</span>
            </div>
            <h2 className="section-title">Choose Your Plan</h2>
            <p className="section-description">Start free, upgrade when you're ready</p>
          </div>

          <div className="pricing-grid">
            <PricingCard
              name="Free"
              price="₹0"
              period="forever"
              features={[
                '2 AI scripts per month',
                'Basic trending topics',
                'Content calendar',
                'Community support'
              ]}
              cta="Get Started Free"
              onClick={handleGetStarted}
            />
            <PricingCard
              name="Basic"
              price="₹199"
              period="per month"
              features={[
                '20 AI scripts per month',
                'Real-time YouTube data',
                'Advanced analytics',
                'Brand kit',
                'Content library',
                'Email support'
              ]}
              cta="Start Free Trial"
              popular={true}
              onClick={handleGetStarted}
            />
            <PricingCard
              name="Pro"
              price="₹299"
              period="per month"
              features={[
                '30 AI scripts',
                'Everything in Basic',
                'Priority support',
                'Export features (PDF/CSV)',
                'Team collaboration',
                'Advanced integrations',
                'Custom branding'
              ]}
              cta="Start Free Trial"
              onClick={handleGetStarted}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Create Viral Content?</h2>
            <p className="cta-description">
              Join thousands of creators who are already using FlowAI to grow their audience
            </p>
            <button onClick={handleGetStarted} className="btn-cta">
              Start Creating for Free
              <ArrowRight size={20} />
            </button>
            <p className="cta-note">No credit card required • Free forever plan available</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">
                <TrendingUp size={24} />
                <span>Flow<span style={{ color: 'var(--primary-color)' }}>AI</span></span>
              </div>
              <p className="footer-tagline">
                AI-powered content creation for modern creators
              </p>
            </div>

            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <a href="#features">Features</a>
                <a href="#pricing">Pricing</a>
                <a href="#how-it-works">How It Works</a>
              </div>
              <div className="footer-column">
                <h4>Company</h4>
                <a href="#about">About Us</a>
                <a href="#blog">Blog</a>
                <a href="#careers">Careers</a>
              </div>
              <div className="footer-column">
                <h4>Support</h4>
                <a href="#help">Help Center</a>
                <a href="#contact">Contact</a>
                <a href="#status">Status</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2024 FlowAI. All rights reserved.</p>
            <div className="footer-legal">
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }) {
  return (
    <div className="feature-card">
      <div className="feature-icon" style={{ background: `${color}15`, color: color }}>
        {icon}
      </div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
      <a href="#" className="feature-link">
        Learn more <ChevronRight size={16} />
      </a>
    </div>
  );
}

function StepCard({ number, title, description, icon }) {
  return (
    <div className="step-card">
      <div className="step-number">{number}</div>
      <div className="step-icon">{icon}</div>
      <h3 className="step-title">{title}</h3>
      <p className="step-description">{description}</p>
    </div>
  );
}

function TestimonialCard({ quote, author, role, rating }) {
  return (
    <div className="testimonial-card">
      <div className="testimonial-rating">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
        ))}
      </div>
      <p className="testimonial-quote">"{quote}"</p>
      <div className="testimonial-author">
        <div className="author-avatar">{author[0]}</div>
        <div>
          <div className="author-name">{author}</div>
          <div className="author-role">{role}</div>
        </div>
      </div>
    </div>
  );
}

function PricingCard({ name, price, period, features, cta, popular, onClick }) {
  return (
    <div className={`pricing-card ${popular ? 'popular' : ''}`}>
      {popular && <div className="popular-badge">Most Popular</div>}
      <h3 className="pricing-name">{name}</h3>
      <div className="pricing-price">
        <span className="price-amount">{price}</span>
        <span className="price-period">/{period}</span>
      </div>
      <ul className="pricing-features">
        {features.map((feature, index) => (
          <li key={index}>
            <CheckCircle size={18} color="#10b981" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <button onClick={onClick} className={`pricing-cta ${popular ? 'primary' : 'secondary'}`}>
        {cta}
      </button>
    </div>
  );
}
