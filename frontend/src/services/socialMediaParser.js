// Social Media URL Parser and Data Fetcher
export class SocialMediaParser {
  
  // Extract username from different URL formats
  static extractUsername(url, platform) {
    const patterns = {
      youtube: [
        /youtube\.com\/@([^\/\?]+)/,
        /youtube\.com\/channel\/([^\/\?]+)/,
        /youtube\.com\/c\/([^\/\?]+)/,
        /youtube\.com\/user\/([^\/\?]+)/
      ],
      instagram: [
        /instagram\.com\/([^\/\?]+)/
      ],
      twitter: [
        /twitter\.com\/([^\/\?]+)/,
        /x\.com\/([^\/\?]+)/
      ],
      tiktok: [
        /tiktok\.com\/@([^\/\?]+)/
      ]
    };

    const platformPatterns = patterns[platform.toLowerCase()];
    if (!platformPatterns) return null;

    for (const pattern of platformPatterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  }

  // Detect platform from URL
  static detectPlatform(url) {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('instagram.com')) return 'instagram';
    if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter';
    if (url.includes('tiktok.com')) return 'tiktok';
    return 'unknown';
  }

  // Fetch public YouTube channel data
  static async fetchYouTubeData(channelUrl) {
    try {
      const username = this.extractUsername(channelUrl, 'youtube');
      if (!username) throw new Error('Invalid YouTube URL');

      // For demo purposes, return mock data
      // In production, you'd use a backend service or CORS proxy
      return {
        platform: 'youtube',
        username: username,
        url: channelUrl,
        subscribers: this.generateRandomNumber(1000, 1000000),
        totalViews: this.generateRandomNumber(10000, 10000000),
        videos: this.generateRandomNumber(10, 1000),
        engagement: this.generateRandomNumber(1, 20),
        recentGrowth: this.generateRandomNumber(-10, 50)
      };
    } catch (error) {
      console.error('YouTube fetch error:', error);
      return null;
    }
  }

  // Fetch public Instagram data
  static async fetchInstagramData(profileUrl) {
    try {
      const username = this.extractUsername(profileUrl, 'instagram');
      if (!username) throw new Error('Invalid Instagram URL');

      return {
        platform: 'instagram',
        username: username,
        url: profileUrl,
        followers: this.generateRandomNumber(500, 500000),
        following: this.generateRandomNumber(100, 5000),
        posts: this.generateRandomNumber(10, 1000),
        engagement: this.generateRandomNumber(1, 15),
        reach: this.generateRandomNumber(1000, 100000)
      };
    } catch (error) {
      console.error('Instagram fetch error:', error);
      return null;
    }
  }

  // Fetch public Twitter data
  static async fetchTwitterData(profileUrl) {
    try {
      const username = this.extractUsername(profileUrl, 'twitter');
      if (!username) throw new Error('Invalid Twitter URL');

      return {
        platform: 'twitter',
        username: username,
        url: profileUrl,
        followers: this.generateRandomNumber(100, 100000),
        following: this.generateRandomNumber(50, 2000),
        tweets: this.generateRandomNumber(10, 5000),
        engagement: this.generateRandomNumber(0.5, 10),
        retweets: this.generateRandomNumber(10, 1000)
      };
    } catch (error) {
      console.error('Twitter fetch error:', error);
      return null;
    }
  }

  // Generate realistic random numbers for demo
  static generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Format numbers for display
  static formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }

  // Main function to fetch data from any social media URL
  static async fetchSocialMediaData(url) {
    const platform = this.detectPlatform(url);
    
    switch (platform) {
      case 'youtube':
        return await this.fetchYouTubeData(url);
      case 'instagram':
        return await this.fetchInstagramData(url);
      case 'twitter':
        return await this.fetchTwitterData(url);
      default:
        throw new Error('Unsupported platform. Please use YouTube, Instagram, or Twitter URLs.');
    }
  }

  // Analyze trends from social media data
  static analyzeTrends(data) {
    const trends = {
      growth: 'stable',
      engagement: 'moderate',
      recommendations: []
    };

    // Analyze growth trend
    if (data.recentGrowth > 20) {
      trends.growth = 'high';
      trends.recommendations.push('Your growth is excellent! Consider posting more frequently.');
    } else if (data.recentGrowth < -5) {
      trends.growth = 'declining';
      trends.recommendations.push('Consider reviewing your content strategy to boost engagement.');
    }

    // Analyze engagement
    if (data.engagement > 10) {
      trends.engagement = 'high';
      trends.recommendations.push('Great engagement! Your audience is very active.');
    } else if (data.engagement < 3) {
      trends.engagement = 'low';
      trends.recommendations.push('Try using more engaging content formats like questions or polls.');
    }

    // Platform-specific recommendations
    if (data.platform === 'youtube' && data.videos < 50) {
      trends.recommendations.push('Consider increasing your video frequency to grow your channel.');
    }

    if (data.platform === 'instagram' && data.posts < 100) {
      trends.recommendations.push('Post consistently with quality content to increase reach.');
    }

    return trends;
  }
}
