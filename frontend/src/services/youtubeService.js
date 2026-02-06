/**
 * YouTube Data API v3 Service
 * Fetches real data from YouTube including trending videos, channel stats, and search results
 */

class YouTubeService {
    constructor() {
        this.apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
        this.baseUrl = 'https://www.googleapis.com/youtube/v3';
    }

    /**
     * Check if API key is configured
     */
    isConfigured() {
        return this.apiKey && this.apiKey !== 'your_youtube_api_key_here';
    }

    /**
     * Get trending videos by region
     * @param {string} regionCode - ISO 3166-1 alpha-2 country code (e.g., 'US', 'IN', 'GB')
     * @param {number} maxResults - Number of results to return (default: 50, max: 50)
     * @param {string} videoCategoryId - Optional category ID to filter by
     */
    async getTrendingVideos(regionCode = 'US', maxResults = 50, videoCategoryId = null) {
        if (!this.isConfigured()) {
            console.warn('YouTube API key not configured, returning sample data');
            return this.getSampleTrendingVideos();
        }

        try {
            const params = new URLSearchParams({
                part: 'snippet,statistics,contentDetails',
                chart: 'mostPopular',
                regionCode: regionCode,
                maxResults: maxResults.toString(),
                key: this.apiKey
            });

            if (videoCategoryId) {
                params.append('videoCategoryId', videoCategoryId);
            }

            const response = await fetch(`${this.baseUrl}/videos?${params}`);

            if (!response.ok) {
                throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            return this.formatTrendingVideos(data.items || []);
        } catch (error) {
            console.error('Error fetching trending videos:', error);
            return this.getSampleTrendingVideos();
        }
    }

    /**
     * Search for videos by keyword
     * @param {string} query - Search query
     * @param {number} maxResults - Number of results (default: 25, max: 50)
     * @param {string} order - Sort order: relevance, date, rating, viewCount, title
     */
    async searchVideos(query, maxResults = 25, order = 'relevance') {
        if (!this.isConfigured()) {
            console.warn('YouTube API key not configured');
            return [];
        }

        try {
            const params = new URLSearchParams({
                part: 'snippet',
                q: query,
                type: 'video',
                maxResults: maxResults.toString(),
                order: order,
                key: this.apiKey
            });

            const response = await fetch(`${this.baseUrl}/search?${params}`);

            if (!response.ok) {
                throw new Error(`YouTube API error: ${response.status}`);
            }

            const data = await response.json();

            // Get video statistics
            if (data.items && data.items.length > 0) {
                const videoIds = data.items.map(item => item.id.videoId).join(',');
                return await this.getVideoDetails(videoIds);
            }

            return [];
        } catch (error) {
            console.error('Error searching videos:', error);
            return [];
        }
    }

    /**
     * Get detailed video information including statistics
     * @param {string} videoIds - Comma-separated video IDs
     */
    async getVideoDetails(videoIds) {
        if (!this.isConfigured()) {
            return [];
        }

        try {
            const params = new URLSearchParams({
                part: 'snippet,statistics,contentDetails',
                id: videoIds,
                key: this.apiKey
            });

            const response = await fetch(`${this.baseUrl}/videos?${params}`);

            if (!response.ok) {
                throw new Error(`YouTube API error: ${response.status}`);
            }

            const data = await response.json();
            return this.formatTrendingVideos(data.items || []);
        } catch (error) {
            console.error('Error fetching video details:', error);
            return [];
        }
    }

    /**
     * Get channel statistics
     * @param {string} channelId - YouTube channel ID
     */
    async getChannelStats(channelId) {
        if (!this.isConfigured()) {
            return this.getSampleChannelStats();
        }

        try {
            const params = new URLSearchParams({
                part: 'snippet,statistics,contentDetails',
                key: this.apiKey
            });

            if (channelId.startsWith('@')) {
                params.append('forHandle', channelId);
            } else {
                params.append('id', channelId);
            }

            const response = await fetch(`${this.baseUrl}/channels?${params}`);

            if (!response.ok) {
                throw new Error(`YouTube API error: ${response.status}`);
            }

            const data = await response.json();

            if (data.items && data.items.length > 0) {
                return this.formatChannelStats(data.items[0]);
            }

            return null;
        } catch (error) {
            console.error('Error fetching channel stats:', error);
            return this.getSampleChannelStats();
        }
    }

    /**
     * Get video categories for a region
     * @param {string} regionCode - ISO 3166-1 alpha-2 country code
     */
    async getVideoCategories(regionCode = 'US') {
        if (!this.isConfigured()) {
            return this.getSampleCategories();
        }

        try {
            const params = new URLSearchParams({
                part: 'snippet',
                regionCode: regionCode,
                key: this.apiKey
            });

            const response = await fetch(`${this.baseUrl}/videoCategories?${params}`);

            if (!response.ok) {
                throw new Error(`YouTube API error: ${response.status}`);
            }

            const data = await response.json();
            return data.items || [];
        } catch (error) {
            console.error('Error fetching categories:', error);
            return this.getSampleCategories();
        }
    }

    /**
     * Format trending videos data
     */
    formatTrendingVideos(items) {
        return items.map(item => ({
            id: item.id,
            title: item.snippet.title,
            description: item.snippet.description,
            channelTitle: item.snippet.channelTitle,
            channelId: item.snippet.channelId,
            publishedAt: item.snippet.publishedAt,
            thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
            categoryId: item.snippet.categoryId,
            tags: item.snippet.tags || [],
            viewCount: parseInt(item.statistics?.viewCount || 0),
            likeCount: parseInt(item.statistics?.likeCount || 0),
            commentCount: parseInt(item.statistics?.commentCount || 0),
            duration: item.contentDetails?.duration,
            engagement: this.calculateEngagement(item.statistics),
            viralScore: this.calculateViralScore(item),
            url: `https://www.youtube.com/watch?v=${item.id}`
        }));
    }

    /**
     * Format channel statistics
     */
    formatChannelStats(channel) {
        return {
            id: channel.id,
            title: channel.snippet.title,
            description: channel.snippet.description,
            customUrl: channel.snippet.customUrl,
            publishedAt: channel.snippet.publishedAt,
            thumbnail: channel.snippet.thumbnails?.high?.url,
            subscriberCount: parseInt(channel.statistics?.subscriberCount || 0),
            viewCount: parseInt(channel.statistics?.viewCount || 0),
            videoCount: parseInt(channel.statistics?.videoCount || 0),
            hiddenSubscriberCount: channel.statistics?.hiddenSubscriberCount || false
        };
    }

    /**
     * Calculate engagement rate
     */
    calculateEngagement(statistics) {
        if (!statistics) return 0;

        const views = parseInt(statistics.viewCount || 0);
        const likes = parseInt(statistics.likeCount || 0);
        const comments = parseInt(statistics.commentCount || 0);

        if (views === 0) return 0;

        return ((likes + comments) / views) * 100;
    }

    /**
     * Calculate viral score (0-100)
     */
    calculateViralScore(video) {
        const views = parseInt(video.statistics?.viewCount || 0);
        const likes = parseInt(video.statistics?.likeCount || 0);
        const comments = parseInt(video.statistics?.commentCount || 0);

        // Published date
        const publishedDate = new Date(video.snippet.publishedAt);
        const now = new Date();
        const hoursOld = (now - publishedDate) / (1000 * 60 * 60);

        // Views per hour
        const viewsPerHour = hoursOld > 0 ? views / hoursOld : views;

        // Engagement rate
        const engagementRate = this.calculateEngagement(video.statistics);

        // Calculate score
        let score = 0;

        // Views component (max 40 points)
        score += Math.min((viewsPerHour / 10000) * 40, 40);

        // Engagement component (max 30 points)
        score += Math.min(engagementRate * 3, 30);

        // Recency bonus (max 30 points)
        if (hoursOld < 24) {
            score += 30;
        } else if (hoursOld < 48) {
            score += 20;
        } else if (hoursOld < 72) {
            score += 10;
        }

        return Math.min(Math.round(score), 100);
    }

    /**
     * Parse ISO 8601 duration to readable format
     */
    parseDuration(duration) {
        if (!duration) return '0:00';

        const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

        const hours = (match[1] || '').replace('H', '');
        const minutes = (match[2] || '').replace('M', '');
        const seconds = (match[3] || '').replace('S', '');

        if (hours) {
            return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
        }

        return `${minutes || '0'}:${seconds.padStart(2, '0')}`;
    }

    /**
     * Format large numbers (e.g., 1.2M, 45K)
     */
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    /**
     * Sample trending videos (fallback)
     */
    getSampleTrendingVideos() {
        return [
            {
                id: 'sample1',
                title: 'AI Revolution: How ChatGPT is Changing Everything',
                description: 'Exploring the impact of AI on content creation',
                channelTitle: 'Tech Insights',
                publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
                thumbnail: 'https://via.placeholder.com/320x180/6366f1/ffffff?text=AI+Revolution',
                viewCount: 1250000,
                likeCount: 85000,
                commentCount: 12000,
                engagement: 7.76,
                viralScore: 85,
                url: 'https://youtube.com'
            },
            {
                id: 'sample2',
                title: '10 Content Creation Tips That Actually Work',
                description: 'Proven strategies for growing your channel',
                channelTitle: 'Creator Academy',
                publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
                thumbnail: 'https://via.placeholder.com/320x180/ec4899/ffffff?text=Creator+Tips',
                viewCount: 850000,
                likeCount: 62000,
                commentCount: 8500,
                engagement: 8.29,
                viralScore: 78,
                url: 'https://youtube.com'
            }
        ];
    }

    /**
     * Sample channel stats (fallback)
     */
    getSampleChannelStats() {
        return {
            id: 'sample-channel',
            title: 'Your Channel',
            subscriberCount: 125000,
            viewCount: 5420000,
            videoCount: 156
        };
    }

    /**
     * Sample categories (fallback)
     */
    getSampleCategories() {
        return [
            { id: '1', snippet: { title: 'Film & Animation' } },
            { id: '2', snippet: { title: 'Autos & Vehicles' } },
            { id: '10', snippet: { title: 'Music' } },
            { id: '15', snippet: { title: 'Pets & Animals' } },
            { id: '17', snippet: { title: 'Sports' } },
            { id: '19', snippet: { title: 'Travel & Events' } },
            { id: '20', snippet: { title: 'Gaming' } },
            { id: '22', snippet: { title: 'People & Blogs' } },
            { id: '23', snippet: { title: 'Comedy' } },
            { id: '24', snippet: { title: 'Entertainment' } },
            { id: '25', snippet: { title: 'News & Politics' } },
            { id: '26', snippet: { title: 'Howto & Style' } },
            { id: '27', snippet: { title: 'Education' } },
            { id: '28', snippet: { title: 'Science & Technology' } }
        ];
    }
}

export default new YouTubeService();
