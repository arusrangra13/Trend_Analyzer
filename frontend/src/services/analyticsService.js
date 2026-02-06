// Advanced Analytics Service
export class AnalyticsService {

    // Generate growth timeline data (simulated for demo, replace with real API)
    static generateGrowthTimeline(socialData, days = 30) {
        const timeline = [];
        const now = new Date();

        // Get base metrics from social data
        const totalFollowers = socialData.reduce((sum, platform) => {
            return sum + (platform.followers || platform.subscribers || 0);
        }, 0);

        // Generate daily data points
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);

            // Simulate growth with some variance
            const growthFactor = 1 - (i / days) * 0.3; // 30% growth over period
            const variance = (Math.random() - 0.5) * 0.05; // ±5% daily variance
            const followers = Math.floor(totalFollowers * (growthFactor + variance));

            // Simulate engagement
            const engagement = Math.floor(followers * (0.03 + Math.random() * 0.02)); // 3-5% engagement

            timeline.push({
                date: date.toISOString().split('T')[0],
                followers: followers,
                engagement: engagement,
                views: Math.floor(followers * (5 + Math.random() * 3)), // 5-8x followers
                posts: Math.floor(Math.random() * 3) // 0-2 posts per day
            });
        }

        return timeline;
    }

    // Analyze best posting times based on engagement patterns
    static analyzeBestPostingTimes(socialData) {
        // Simulated data - in production, this would analyze actual post performance
        const hourlyEngagement = Array(24).fill(0).map((_, hour) => {
            let baseEngagement = 50;

            // Peak times: 8-10am, 12-2pm, 6-9pm
            if ((hour >= 8 && hour <= 10) || (hour >= 12 && hour <= 14) || (hour >= 18 && hour <= 21)) {
                baseEngagement = 80 + Math.random() * 20;
            } else if (hour >= 22 || hour <= 6) {
                baseEngagement = 20 + Math.random() * 15;
            } else {
                baseEngagement = 40 + Math.random() * 20;
            }

            return {
                hour,
                engagement: Math.floor(baseEngagement),
                label: `${hour.toString().padStart(2, '0')}:00`
            };
        });

        // Find top 3 hours
        const sorted = [...hourlyEngagement].sort((a, b) => b.engagement - a.engagement);
        const bestTimes = sorted.slice(0, 3).map(t => ({
            time: t.label,
            engagement: t.engagement,
            recommendation: this.getTimeRecommendation(t.hour)
        }));

        return {
            hourlyData: hourlyEngagement,
            bestTimes,
            weekdayPattern: this.generateWeekdayPattern()
        };
    }

    static getTimeRecommendation(hour) {
        if (hour >= 8 && hour <= 10) return 'Morning commute - high mobile usage';
        if (hour >= 12 && hour <= 14) return 'Lunch break - peak browsing time';
        if (hour >= 18 && hour <= 21) return 'Evening relaxation - maximum engagement';
        if (hour >= 22 || hour <= 6) return 'Late night - limited audience';
        return 'Standard activity period';
    }

    static generateWeekdayPattern() {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        return days.map((day, index) => ({
            day,
            engagement: index < 5 ? 70 + Math.random() * 20 : 85 + Math.random() * 15, // Weekends slightly higher
            posts: Math.floor(1 + Math.random() * 2)
        }));
    }

    // Analyze content performance by type
    static analyzeContentPerformance(socialData) {
        // Simulated content type analysis
        const contentTypes = [
            {
                type: 'Video',
                count: 45,
                avgViews: 15420,
                avgEngagement: 4.2,
                avgLikes: 650,
                trend: 'up',
                trendValue: 12
            },
            {
                type: 'Image',
                count: 78,
                avgViews: 8930,
                avgEngagement: 3.8,
                avgLikes: 340,
                trend: 'stable',
                trendValue: 2
            },
            {
                type: 'Carousel',
                count: 23,
                avgViews: 12100,
                avgEngagement: 5.1,
                avgLikes: 520,
                trend: 'up',
                trendValue: 18
            },
            {
                type: 'Reels/Shorts',
                count: 34,
                avgViews: 28500,
                avgEngagement: 6.3,
                avgLikes: 1200,
                trend: 'up',
                trendValue: 25
            },
            {
                type: 'Text Post',
                count: 12,
                avgViews: 4200,
                avgEngagement: 2.1,
                avgLikes: 120,
                trend: 'down',
                trendValue: -8
            }
        ];

        // Calculate top performers
        const topPerformers = [...contentTypes]
            .sort((a, b) => b.avgEngagement - a.avgEngagement)
            .slice(0, 3);

        return {
            contentTypes,
            topPerformers,
            recommendations: this.generateContentRecommendations(contentTypes)
        };
    }

    static generateContentRecommendations(contentTypes) {
        const recommendations = [];

        // Find best performing type
        const best = contentTypes.reduce((prev, curr) =>
            curr.avgEngagement > prev.avgEngagement ? curr : prev
        );

        recommendations.push({
            type: 'success',
            title: `Focus on ${best.type}`,
            description: `${best.type} content has ${best.avgEngagement}% engagement rate, your highest performing format.`
        });

        // Find declining type
        const declining = contentTypes.find(c => c.trend === 'down');
        if (declining) {
            recommendations.push({
                type: 'warning',
                title: `Reduce ${declining.type}`,
                description: `${declining.type} content is trending down ${Math.abs(declining.trendValue)}%. Consider pivoting to other formats.`
            });
        }

        // Find growing type
        const growing = contentTypes
            .filter(c => c.trend === 'up')
            .sort((a, b) => b.trendValue - a.trendValue)[0];

        if (growing) {
            recommendations.push({
                type: 'info',
                title: `Increase ${growing.type}`,
                description: `${growing.type} is growing ${growing.trendValue}%. Capitalize on this momentum.`
            });
        }

        return recommendations;
    }

    // Calculate engagement metrics
    static calculateEngagementMetrics(socialData) {
        if (!socialData || socialData.length === 0) {
            return {
                overallEngagement: 0,
                engagementTrend: 0,
                topPlatform: null,
                averageReach: 0
            };
        }

        const totalEngagement = socialData.reduce((sum, platform) => {
            return sum + (platform.engagement || 0);
        }, 0);

        const avgEngagement = totalEngagement / socialData.length;

        // Find top platform by engagement
        const topPlatform = socialData.reduce((prev, curr) => {
            return (curr.engagement || 0) > (prev.engagement || 0) ? curr : prev;
        }, socialData[0]);

        return {
            overallEngagement: avgEngagement.toFixed(1),
            engagementTrend: Math.floor(Math.random() * 20) - 5, // -5% to +15%
            topPlatform: topPlatform.platform,
            averageReach: this.calculateAverageReach(socialData)
        };
    }

    static calculateAverageReach(socialData) {
        const totalReach = socialData.reduce((sum, platform) => {
            const followers = platform.followers || platform.subscribers || 0;
            const reach = followers * (platform.engagement / 100 || 0.03); // 3% default reach
            return sum + reach;
        }, 0);

        return Math.floor(totalReach);
    }

    // Format numbers for display
    static formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    }

    // Get growth percentage
    static calculateGrowth(current, previous) {
        if (!previous || previous === 0) return 0;
        return (((current - previous) / previous) * 100).toFixed(1);
    }
}
