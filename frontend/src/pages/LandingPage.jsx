import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Users, 
  Zap, 
  BarChart2, 
  ArrowRight, 
  PlayCircle,
  CheckCircle,
  Star
} from 'lucide-react';
import Navbar from '../components/common/Navbar';
import '../assets/styles/landing.css';

export default function LandingPage() {
  return (
    <div className="landing-page">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            ✨ New: AI Script Generation
          </div>
          <h1 className="hero-title">
            Predict the Next <br />
            <span>Viral Trend</span>
          </h1>
          <p className="hero-subtitle">
            Stop guessing what to post. Use AI to analyze competitors, 
            spot rising trends, and generate high-performing scripts in seconds.
          </p>
          <div className="hero-cta-group">
            <Link to="/register" className="btn btn-primary">
              Start Free Trial <ArrowRight size={20} />
            </Link>
            <button className="btn btn-secondary">
              <PlayCircle size={20} /> Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <h3>10k+</h3>
            <p>Creators Empowered</p>
          </div>
          <div className="stat-item">
            <h3>5M+</h3>
            <p>Trends Analyzed</p>
          </div>
          <div className="stat-item">
            <h3>500%</h3>
            <p>Avg Growth</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="section-header">
          <h2 className="section-title">Everything you need to go viral</h2>
          <p className="section-subtitle">Powerful tools to supercharge your content strategy</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <TrendingUp size={24} />
            </div>
            <h3 className="feature-title">Trend Prediction</h3>
            <p className="feature-desc">
              Identify rising topics before they peak. Our AI analyzes millions of data points to spot what's next.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Users size={24} />
            </div>
            <h3 className="feature-title">Competitor Analysis</h3>
            <p className="feature-desc">
              Spy on top creators in your niche. See what's working for them and how you can do it better.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Zap size={24} />
            </div>
            <h3 className="feature-title">AI Script Generator</h3>
            <p className="feature-desc">
              Generate hook-optimized scripts in seconds. Choose your tone, length, and let AI do the writing.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <BarChart2 size={24} />
            </div>
            <h3 className="feature-title">Performance Analytics</h3>
            <p className="feature-desc">
              Deep dive into your metrics. Understand exactly why a video performed well and how to replicate it.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-header">
          <h2 className="section-title">How it works</h2>
          <p className="section-subtitle">Go from idea to viral hit in 3 simple steps</p>
        </div>
        
        <div className="steps-container">
          <div className="step-item">
            <div className="step-number">1</div>
            <h3 className="step-title">Connect Accounts</h3>
            <p className="step-desc">Link your social media profiles to let our AI analyze your niche and performance history.</p>
          </div>
          <div className="step-item">
            <div className="step-number">2</div>
            <h3 className="step-title">Get Insights</h3>
            <p className="step-desc">Receive personalized trend alerts and topic suggestions tailored to your audience.</p>
          </div>
          <div className="step-item">
            <div className="step-number">3</div>
            <h3 className="step-title">Generate Content</h3>
            <p className="step-desc">Use our AI tools to create scripts and content calendars that are guaranteed to perform.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-header">
          <h2 className="section-title">Trusted by top creators</h2>
          <p className="section-subtitle">Join thousands of creators who are growing faster with FlowAI</p>
        </div>
        
        <div className="testimonials-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="testimonial-card">
              <div className="testimonial-header">
                <div className="user-avatar" style={{ background: `hsl(${i * 60}, 70%, 50%)` }}></div>
                <div className="user-info">
                  <h4>Creator Name {i}</h4>
                  <p>@creator_handle</p>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '2px' }}>
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={14} fill="#fbbf24" color="#fbbf24" />
                  ))}
                </div>
              </div>
              <p className="testimonial-quote">
                "This tool completely changed my content strategy. I went from 10k to 100k views in just a month thanks to the trend predictions!"
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="nav-logo">
              <div style={{ background: 'var(--primary-color)', padding: '6px', borderRadius: '8px', display: 'flex' }}>
                <TrendingUp size={24} color="white" />
              </div>
              <span>Flow<span style={{ color: 'var(--primary-color)' }}>AI</span></span>
            </div>
            <p>
              The advanced AI platform for content creators to analyze trends, spy on competitors, and generate viral scripts.
            </p>
          </div>
          
          <div className="footer-col">
            <h4>Product</h4>
            <ul className="footer-links">
              <li><Link to="/features">Features</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
              <li><Link to="/examples">Case Studies</Link></li>
              <li><Link to="/roadmap">Roadmap</Link></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h4>Company</h4>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h4>Legal</h4>
            <ul className="footer-links">
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/cookies">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} FlowAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
