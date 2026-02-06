// Subscription and Script Usage Management Service
import UserStorageService from './userStorageService';

export class SubscriptionService {

  // Get current subscription (user-specific)
  static getCurrentSubscription(userId = null) {
    try {
      // Try user-specific storage first
      const subscription = UserStorageService.getItem('subscriptionData', userId);
      if (subscription) {
        const parsed = JSON.parse(subscription);

        // Check if subscription is expired
        if (parsed.expiresAt && new Date(parsed.expiresAt) < new Date()) {
          this.clearSubscription(userId);
          return null;
        }

        return parsed;
      }

      // Fallback to old format for migration
      const oldSubscription = localStorage.getItem('userSubscription');
      if (oldSubscription) {
        const parsed = JSON.parse(oldSubscription);

        // Check if subscription is expired
        if (new Date(parsed.endDate) < new Date()) {
          this.clearSubscription(userId);
          return null;
        }

        // Migrate to user-specific storage
        if (userId) {
          UserStorageService.setItem('subscriptionData', oldSubscription, userId);
          localStorage.removeItem('userSubscription');
        }

        return parsed;
      }

      return null;
    } catch (error) {
      console.error('Error getting subscription:', error);
      return null;
    }
  }

  // Save subscription (user-specific)
  static saveSubscription(subscription, userId = null) {
    try {
      if (userId) {
        UserStorageService.setItem('subscriptionData', JSON.stringify(subscription), userId);
      } else {
        // Fallback to old format
        localStorage.setItem('userSubscription', JSON.stringify(subscription));
      }
      return true;
    } catch (error) {
      console.error('Error saving subscription:', error);
      return false;
    }
  }

  // Clear subscription (user-specific)
  static clearSubscription(userId = null) {
    try {
      if (userId) {
        UserStorageService.removeItem('subscriptionData', userId);
      }
      // Also clear old format
      localStorage.removeItem('userSubscription');
      return true;
    } catch (error) {
      console.error('Error clearing subscription:', error);
      return false;
    }
  }

  // Check if user can generate script
  static canGenerateScript() {
    const subscription = this.getCurrentSubscription();
    if (!subscription) return false;

    return subscription.scriptsRemaining > 0;
  }

  // Get remaining scripts
  static getRemainingScripts() {
    const subscription = this.getCurrentSubscription();
    return subscription ? subscription.scriptsRemaining : 0;
  }

  // Use a script (decrement count)
  static useScript() {
    const subscription = this.getCurrentSubscription();
    if (!subscription || subscription.scriptsRemaining <= 0) {
      throw new Error('No scripts remaining. Please upgrade your plan.');
    }

    subscription.scriptsRemaining -= 1;
    this.saveSubscription(subscription);

    return subscription.scriptsRemaining;
  }

  // Reset scripts (for monthly renewal)
  static resetScripts() {
    const subscription = this.getCurrentSubscription();
    if (!subscription) return;

    const plans = {
      basic: 2,
      pro: 20,
      advance: 30
    };

    subscription.scriptsRemaining = plans[subscription.plan] || 0;
    subscription.startDate = new Date().toISOString();
    subscription.endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    this.saveSubscription(subscription);
  }

  // Check if user has access to feature
  static hasFeature(feature) {
    const subscription = this.getCurrentSubscription();
    if (!subscription) return false;

    const features = {
      // Basic features
      basic_templates: ['basic', 'advance', 'pro'],
      standard_trending: ['basic', 'advance', 'pro'],
      email_support: ['basic', 'advance', 'pro'],
      basic_analytics: ['basic', 'advance', 'pro'],

      // Advance features
      advanced_templates: ['advance', 'pro'],
      domain_analysis: ['advance', 'pro'],
      gemini_ai: ['advance', 'pro'],
      priority_support: ['advance', 'pro'],
      advanced_analytics: ['advance', 'pro'],
      custom_styles: ['advance', 'pro'],
      keyword_suggestions: ['advance', 'pro'],

      // Pro features
      premium_templates: ['pro'],
      realtime_trending: ['pro'],
      advanced_gemini: ['pro'],
      priority_247_support: ['pro'],
      premium_analytics: ['pro'],
      viral_analysis: ['pro'],
      competitor_analysis: ['pro'],
      multilingual: ['pro'],
      api_access: ['pro'],
      custom_branding: ['pro']
    };

    return features[feature]?.includes(subscription.plan) || false;
  }

  // Get plan limits
  static getPlanLimits(plan) {
    const limits = {
      basic: {
        scripts: 2,
        features: ['basic_templates', 'standard_trending', 'email_support', 'basic_analytics']
      },
      pro: {
        scripts: 20,
        features: ['basic_templates', 'standard_trending', 'email_support', 'basic_analytics', 'advanced_templates', 'domain_analysis', 'gemini_ai', 'priority_support', 'advanced_analytics', 'custom_styles', 'keyword_suggestions']
      },
      advance: {
        scripts: 30,
        features: ['basic_templates', 'standard_trending', 'email_support', 'basic_analytics', 'advanced_templates', 'domain_analysis', 'gemini_ai', 'priority_support', 'advanced_analytics', 'custom_styles', 'keyword_suggestions', 'premium_templates', 'realtime_trending', 'advanced_gemini', 'priority_247_support', 'premium_analytics', 'viral_analysis', 'competitor_analysis', 'multilingual', 'api_access', 'custom_branding']
      }
    };

    return limits[plan] || limits.basic;
  }

  // Check subscription status
  static getSubscriptionStatus() {
    const subscription = this.getCurrentSubscription();
    if (!subscription) {
      return {
        status: 'none',
        message: 'No active subscription',
        canGenerate: false,
        remaining: 0
      };
    }

    const daysRemaining = Math.ceil((new Date(subscription.endDate) - new Date()) / (1000 * 60 * 60 * 24));

    if (subscription.scriptsRemaining <= 0) {
      return {
        status: 'out_of_scripts',
        message: 'No scripts remaining this month',
        canGenerate: false,
        remaining: 0,
        daysRemaining
      };
    }

    if (daysRemaining <= 7) {
      return {
        status: 'expiring_soon',
        message: `Subscription expires in ${daysRemaining} days`,
        canGenerate: true,
        remaining: subscription.scriptsRemaining,
        daysRemaining
      };
    }

    return {
      status: 'active',
      message: 'Subscription active',
      canGenerate: true,
      remaining: subscription.scriptsRemaining,
      daysRemaining
    };
  }

  // Upgrade plan
  static upgradePlan(newPlan) {
    const currentSubscription = this.getCurrentSubscription();
    const limits = this.getPlanLimits(newPlan);

    const updatedSubscription = {
      plan: newPlan,
      scriptsRemaining: limits.scripts,
      totalScripts: limits.scripts,
      features: limits.features,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      upgradedFrom: currentSubscription?.plan || 'none'
    };

    this.saveSubscription(updatedSubscription);
    return updatedSubscription;
  }

  // Get subscription analytics
  static getSubscriptionAnalytics() {
    const subscription = this.getCurrentSubscription();
    if (!subscription) return null;

    const totalDays = 30;
    const daysPassed = Math.floor((new Date() - new Date(subscription.startDate)) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.ceil((new Date(subscription.endDate) - new Date()) / (1000 * 60 * 60 * 24));

    const scriptsUsed = subscription.totalScripts - subscription.scriptsRemaining;
    const scriptUsagePercentage = (scriptsUsed / subscription.totalScripts) * 100;
    const timeUsagePercentage = (daysPassed / totalDays) * 100;

    return {
      plan: subscription.plan,
      totalScripts: subscription.totalScripts,
      scriptsUsed,
      scriptsRemaining: subscription.scriptsRemaining,
      scriptUsagePercentage,
      daysPassed,
      daysRemaining,
      timeUsagePercentage,
      isOnTrack: scriptUsagePercentage <= timeUsagePercentage,
      projectedUsage: Math.ceil((scriptsUsed / daysPassed) * totalDays)
    };
  }
}
