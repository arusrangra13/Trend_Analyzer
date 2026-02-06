import { SocialMediaParser } from './socialMediaParser';
import UserStorageService from './userStorageService';
import BackendService from './backendService';

export class SocialMediaService {

  // Get social media URLs from profile data
  static getSocialUrlsFromProfile(profileData) {
    const urls = [];

    if (profileData.youtubeLink) urls.push(profileData.youtubeLink);
    if (profileData.instagramLink) urls.push(profileData.instagramLink);
    if (profileData.twitterLink) urls.push(profileData.twitterLink);
    if (profileData.otherLink) urls.push(profileData.otherLink);

    return urls;
  }

  // Fetch all social media data from profile URLs
  static async fetchAllSocialData(profileData) {
    const urls = this.getSocialUrlsFromProfile(profileData);
    const socialData = [];

    for (const url of urls) {
      try {
        const data = await SocialMediaParser.fetchSocialMediaData(url);
        if (data) {
          socialData.push(data);
        }
      } catch (error) {
        console.error(`Error fetching data for ${url}:`, error);
      }
    }

    return socialData;
  }

  // Calculate total metrics across all platforms
  static calculateTotalMetrics(socialData) {
    const totals = {
      totalFollowers: 0,
      totalViews: 0,
      totalEngagement: 0,
      totalPosts: 0,
      platformCount: socialData.length,
      averageEngagement: 0,
      growthRate: 0
    };

    socialData.forEach(data => {
      switch (data.platform) {
        case 'youtube':
          totals.totalFollowers += data.subscribers || 0;
          totals.totalViews += data.totalViews || 0;
          totals.totalEngagement += parseFloat(data.engagement) || 0;
          totals.totalPosts += data.videos || 0;
          totals.growthRate += parseFloat(data.recentGrowth) || 0;
          break;
        case 'instagram':
          totals.totalFollowers += data.followers || 0;
          totals.totalViews += data.reach || 0;
          totals.totalEngagement += parseFloat(data.engagement) || 0;
          totals.totalPosts += data.posts || 0;
          break;
        case 'twitter':
          totals.totalFollowers += data.followers || 0;
          totals.totalEngagement += parseFloat(data.engagement) || 0;
          totals.totalPosts += data.tweets || 0;
          break;
      }
    });

    // Calculate averages
    if (socialData.length > 0) {
      totals.averageEngagement = totals.totalEngagement / socialData.length;
      // Growth rate is primarily driven by YouTube in this logic, but we can average it if other platforms send it
      const growthContributors = socialData.filter(d => d.recentGrowth !== undefined).length;
      if (growthContributors > 0) {
        totals.growthRate = totals.growthRate / growthContributors;
      }
    }

    return totals;
  }

  // Get formatted metrics for dashboard display
  static getFormattedMetrics(socialData) {
    const totals = this.calculateTotalMetrics(socialData);

    return {
      totalViews: SocialMediaParser.formatNumber(totals.totalViews),
      totalFollowers: SocialMediaParser.formatNumber(totals.totalFollowers),
      totalPosts: SocialMediaParser.formatNumber(totals.totalPosts),
      averageEngagement: totals.averageEngagement.toFixed(1) + '%',
      growthRate: totals.growthRate > 0 ? `+${totals.growthRate.toFixed(1)}%` : `${totals.growthRate.toFixed(1)}%`,
      platformCount: totals.platformCount
    };
  }

  // Save social media data to localStorage and Backend
  static async saveSocialData(socialData, token = null) {
    // 1. Save to Local Storage (Cache/Offline)
    UserStorageService.setItem('socialMediaData', JSON.stringify(socialData));

    // 2. Save to Backend (if online and authenticated)
    if (token) {
      try {
        await BackendService.saveSocialAnalytics(socialData, token);
      } catch (error) {
        console.error('Failed to sync social data to backend', error);
      }
    }
  }

  // Load social media data from localStorage
  static loadSocialData() {
    try {
      const saved = UserStorageService.getItem('socialMediaData');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading social data:', error);
      return [];
    }
  }

  // Auto-sync profile URLs with social media data
  static async syncProfileWithSocialData(profileData) {
    const urls = this.getSocialUrlsFromProfile(profileData);
    const existingData = this.loadSocialData();

    // Remove data for URLs that are no longer in profile
    const filteredData = existingData.filter(item => urls.includes(item.url));

    let hasChanges = filteredData.length !== existingData.length;

    // Add new URLs
    for (const url of urls) {
      const exists = filteredData.some(item => item.url === url);
      if (!exists) {
        try {
          const data = await SocialMediaParser.fetchSocialMediaData(url);
          if (data) {
            filteredData.push(data);
            hasChanges = true;
          }
        } catch (error) {
          console.error(`Error fetching new data for ${url}:`, error);
        }
      }
    }

    if (hasChanges) {
      this.saveSocialData(filteredData);
    }
    return filteredData;
  }
}
