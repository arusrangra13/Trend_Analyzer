// Real-time Trend Analysis Service
export class TrendService {

  // Twitter API v2 - Free tier available
  static async fetchTwitterTrends() {
    try {
      // In production, you'd use your Twitter API credentials
      // For now, simulating real trending topics
      const trends = [
        {
          name: 'AI Tools',
          volume: '125K',
          growth: '+45%',
          sentiment: 'positive',
          category: 'Technology',
          keywords: ['AI', 'automation', 'machine learning', 'ChatGPT']
        },
        {
          name: 'Sustainable Living',
          volume: '89K',
          growth: '+32%',
          sentiment: 'positive',
          category: 'Lifestyle',
          keywords: ['eco-friendly', 'sustainability', 'green living', 'climate']
        },
        {
          name: 'Remote Work',
          volume: '76K',
          growth: '+28%',
          sentiment: 'neutral',
          category: 'Business',
          keywords: ['work from home', 'remote jobs', 'digital nomad', 'productivity']
        },
        {
          name: 'Web3 Gaming',
          volume: '54K',
          growth: '+67%',
          sentiment: 'positive',
          category: 'Gaming',
          keywords: ['blockchain', 'NFT', 'crypto gaming', 'metaverse']
        },
        {
          name: 'Mental Health',
          volume: '92K',
          growth: '+41%',
          sentiment: 'positive',
          category: 'Health',
          keywords: ['wellness', 'mindfulness', 'self-care', 'therapy']
        }
      ];

      return trends;
    } catch (error) {
      console.error('Error fetching Twitter trends:', error);
      return [];
    }
  }

  // Reddit API - Free and public
  static async fetchRedditTrends() {
    try {
      // Simulating Reddit viral posts from popular subreddits
      const viralPosts = [
        {
          subreddit: 'technology',
          title: 'New AI breakthrough changes everything we know about machine learning',
          upvotes: 45200,
          comments: 3200,
          engagement: 'high',
          keywords: ['AI', 'machine learning', 'breakthrough', 'technology']
        },
        {
          subreddit: 'LifeProTips',
          title: 'LPT: Use the 2-minute rule to never procrastinate again',
          upvotes: 38900,
          comments: 2100,
          engagement: 'high',
          keywords: ['productivity', 'life hacks', 'motivation', 'self-improvement']
        },
        {
          subreddit: 'gadgets',
          title: 'This new gadget solved a problem I didn\'t even know I had',
          upvotes: 28700,
          comments: 1800,
          engagement: 'medium',
          keywords: ['gadgets', 'tech', 'innovation', 'productivity']
        }
      ];

      return viralPosts;
    } catch (error) {
      console.error('Error fetching Reddit trends:', error);
      return [];
    }
  }

  // Analyze user's domain from their social media
  static analyzeUserDomain(socialData) {
    const domains = {
      technology: ['tech', 'software', 'coding', 'AI', 'developer', 'programming'],
      fitness: ['fitness', 'workout', 'gym', 'health', 'exercise', 'nutrition'],
      fashion: ['fashion', 'style', 'clothing', 'outfit', 'beauty', 'trends'],
      business: ['business', 'entrepreneur', 'startup', 'marketing', 'finance'],
      lifestyle: ['lifestyle', 'travel', 'food', 'home', 'living'],
      gaming: ['gaming', 'gamer', 'games', 'esports', 'streaming'],
      education: ['education', 'learning', 'courses', 'skills', 'knowledge']
    };

    // Analyze from social media content and usernames
    let userDomain = 'general';
    let confidence = 0;

    socialData.forEach(platform => {
      const text = `${platform.username} ${platform.platform}`.toLowerCase();

      Object.entries(domains).forEach(([domain, keywords]) => {
        const matches = keywords.filter(keyword => text.includes(keyword)).length;
        if (matches > confidence) {
          confidence = matches;
          userDomain = domain;
        }
      });
    });

    return { domain: userDomain, confidence };
  }

  // Generate viral keywords based on domain
  static generateViralKeywords(domain, trends) {
    const keywordSets = {
      technology: [
        'AI revolution', 'machine learning', 'automation tools',
        'coding tips', 'tech trends 2024', 'software development',
        'digital transformation', 'future of work'
      ],
      fitness: [
        'home workout', 'fitness journey', 'healthy habits',
        'gym routine', 'nutrition tips', 'weight loss',
        'mental health', 'wellness routine'
      ],
      fashion: [
        'sustainable fashion', 'style tips', 'outfit ideas',
        'fashion trends', 'wardrobe essentials', 'thrifting',
        'minimalist style', 'seasonal looks'
      ],
      business: [
        'startup success', 'entrepreneur tips', 'business strategy',
        'marketing hacks', 'productivity tools', 'passive income',
        'leadership skills', 'growth hacking'
      ],
      lifestyle: [
        'daily routine', 'life hacks', 'home organization',
        'travel tips', 'food recipes', 'minimalism',
        'self-care routine', 'productivity habits'
      ],
      gaming: [
        'gaming setup', 'esports news', 'game reviews',
        'streaming tips', 'gaming moments', 'retro games',
        'gaming community', 'game development'
      ],
      education: [
        'study tips', 'online learning', 'skill development',
        'career growth', 'knowledge sharing', 'educational content',
        'learning techniques', 'personal development'
      ]
    };

    const baseKeywords = keywordSets[domain] || keywordSets.lifestyle;

    // Mix with trending keywords
    const trendingKeywords = trends.flatMap(trend => trend.keywords || []);
    const combined = [...baseKeywords, ...trendingKeywords];

    // Remove duplicates and add viral modifiers
    const unique = [...new Set(combined)];
    const viralKeywords = unique.map(keyword => ({
      keyword,
      viral: Math.random() > 0.5,
      volume: Math.floor(Math.random() * 100000) + 10000,
      difficulty: Math.floor(Math.random() * 100) + 1
    }));

    return viralKeywords.sort((a, b) => b.volume - a.volume).slice(0, 15);
  }

  // Generate content suggestions based on trends and domain
  static generateContentSuggestions(domain, trends = [], keywords = []) {
    const suggestions = [];

    // Ensure trends is an array before using forEach
    if (Array.isArray(trends)) {
      // Trend-based suggestions
      trends.forEach(trend => {
        suggestions.push({
          type: 'trending',
          title: `Create content about "${trend.name}"`,
          description: `This topic is trending with ${trend.growth} growth and ${trend.volume} mentions`,
          urgency: trend.growth && trend.growth.includes('+') ? 'high' : 'medium',
          keywords: trend.keywords || [],
          estimatedReach: Math.floor(parseInt(trend.volume || 0) * 2.5)
        });
      });
    }

    // Ensure keywords is an array before using forEach
    if (Array.isArray(keywords)) {
      // Keyword-based suggestions
      keywords.slice(0, 5).forEach(keyword => {
        if (keyword && keyword.viral) {
          suggestions.push({
            type: 'viral',
            title: `Target viral keyword: "${keyword.keyword}"`,
            description: `High viral potential with ${keyword.volume} monthly searches`,
            urgency: 'high',
            keywords: [keyword.keyword],
            estimatedReach: (keyword.volume || 0) * 3
          });
        }
      });
    }

    // Domain-specific suggestions
    const domainSuggestions = {
      technology: [
        'Create a tutorial on the latest AI tools',
        'Review new tech products in your niche',
        'Share coding tips and tricks'
      ],
      fitness: [
        'Create a 30-day fitness challenge',
        'Share healthy recipe ideas',
        'Post workout routine for beginners'
      ],
      fashion: [
        'Create seasonal lookbook content',
        'Share sustainable fashion tips',
        'Post outfit styling guides'
      ]
    };

    const domainSpecific = domainSuggestions[domain] || domainSuggestions.lifestyle;
    if (Array.isArray(domainSpecific)) {
      domainSpecific.forEach((suggestion, index) => {
        suggestions.push({
          type: 'domain',
          title: suggestion,
          description: `Perfect for your ${domain || 'lifestyle'} niche audience`,
          urgency: 'medium',
          keywords: (keywords || []).slice(index, index + 3).map(k => k.keyword),
          estimatedReach: Math.floor(Math.random() * 50000) + 10000
        });
      });
    }

    return suggestions.sort((a, b) => {
      const urgencyOrder = { high: 3, medium: 2, low: 1 };
      return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
    });
  }

  // Main function to get all trend data
  static async getTrendAnalysis(socialData) {
    try {
      const [twitterTrends, redditTrends] = await Promise.all([
        this.fetchTwitterTrends(),
        this.fetchRedditTrends()
      ]);

      const { domain } = this.analyzeUserDomain(socialData);
      const keywords = this.generateViralKeywords(domain, twitterTrends);
      const suggestions = this.generateContentSuggestions(domain, twitterTrends, keywords);

      // We'll return the base analysis, and the component can call getAISuggestions separately if needed
      return {
        domain,
        twitterTrends,
        redditTrends,
        keywords,
        suggestions,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error in trend analysis:', error);
      return null;
    }
  }

  // Use Gemini to generate real-time AI suggestions
  static async getAISuggestions(domain, twitterTrends, redditTrends) {
    try {
      // Import GeminiService dynamically or use it directly if it's available
      // Note: In this environment, we should make sure GeminiService is accessible
      // For now, we'll construct the prompt and the component can call GeminiService

      const trendsText = twitterTrends.map(t => t.name).join(', ');
      const redditText = redditTrends.map(t => t.title).join(' | ');

      const prompt = `
        As an expert social media strategist, analyze these currently trending topics and provide 3 HIGH-CONVERSION content ideas for a creator in the "${domain}" niche.
        
        CURRENT TRENDS: ${trendsText}
        VIRAL DISCUSSIONS: ${redditText}
        
        Each idea must include:
        1. A catchy title
        2. Strategic reasoning (why it will go viral)
        3. Hook for the first 3 seconds
        4. Target platform (YouTube, Instagram, or Twitter)
        
        Format the response as a valid JSON array of objects with keys: title, reason, hook, platform.
        Do not include any other text, only the JSON.
      `;

      return prompt;
    } catch (error) {
      console.error('Error generating AI prompt:', error);
      return null;
    }
  }

  // Format numbers for display
  static formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }
}
