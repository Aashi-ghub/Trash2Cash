const dbConfig = require('../config/database');

class AINotificationService {
  constructor() {
    this.notificationTypes = {
      GOAL: 'goal',
      OFFER: 'offer', 
      ACHIEVEMENT: 'achievement',
      TIP: 'tip',
      ALERT: 'alert'
    };
  }

  // Generate personalized notifications for a user
  async generateUserNotifications(userId, userPoints = 0) {
    try {
      const supabase = dbConfig.getAdminClient();
      
      // Get user's recent activity
      const { data: recentEvents, error: eventsError } = await supabase
        .from('bin_events')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (eventsError) {
        console.error('Failed to fetch user events:', eventsError);
        return this.generateDefaultNotifications(userPoints);
      }

      const notifications = [];

      // 1. Goal-based notifications
      const goalNotifications = this.generateGoalNotifications(userPoints);
      notifications.push(...goalNotifications);

      // 2. Achievement notifications
      const achievementNotifications = this.generateAchievementNotifications(userPoints, recentEvents);
      notifications.push(...achievementNotifications);

      // 3. Smart tips based on user behavior
      const tipNotifications = this.generateSmartTips(recentEvents);
      notifications.push(...tipNotifications);

      // 4. Limited time offers
      const offerNotifications = this.generateLimitedTimeOffers(userPoints);
      notifications.push(...offerNotifications);

      // 5. Bin alerts (if user has favorite bins)
      const alertNotifications = await this.generateBinAlerts(userId);
      notifications.push(...alertNotifications);

      return notifications.sort((a, b) => b.priority - a.priority);

    } catch (error) {
      console.error('Error generating AI notifications:', error);
      return this.generateDefaultNotifications(userPoints);
    }
  }

  generateGoalNotifications(userPoints) {
    const notifications = [];
    
    // Coffee voucher goal (200 points)
    if (userPoints >= 150 && userPoints < 200) {
      const pointsNeeded = 200 - userPoints;
      notifications.push({
        id: `goal_coffee_${Date.now()}`,
        type: this.notificationTypes.GOAL,
        title: '🎯 Goal Alert: Coffee Shop Voucher',
        message: `You need ${pointsNeeded} more points to redeem a free coffee voucher!`,
        pointsNeeded,
        currentPoints: userPoints,
        targetPoints: 200,
        reward: 'Free Coffee Voucher',
        progress: Math.round((userPoints / 200) * 100),
        priority: 'high',
        timestamp: new Date(),
        isRead: false
      });
    }

    // Movie ticket goal (150 points)
    if (userPoints >= 120 && userPoints < 150) {
      const pointsNeeded = 150 - userPoints;
      notifications.push({
        id: `goal_movie_${Date.now()}`,
        type: this.notificationTypes.GOAL,
        title: '🔥 Limited Time: Movie Ticket Offer',
        message: `Recycle ${Math.ceil(pointsNeeded / 10)} more items (${pointsNeeded} points) to unlock 50% off movie tickets!`,
        pointsNeeded,
        currentPoints: userPoints,
        targetPoints: 150,
        reward: '50% Off Movie Tickets',
        progress: Math.round((userPoints / 150) * 100),
        priority: 'high',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        isRead: false
      });
    }

    // Restaurant discount goal (300 points)
    if (userPoints >= 220 && userPoints < 300) {
      const pointsNeeded = 300 - userPoints;
      notifications.push({
        id: `goal_restaurant_${Date.now()}`,
        type: this.notificationTypes.GOAL,
        title: '🎁 Weekend Special: Restaurant Discount',
        message: `Need ${pointsNeeded} more points to get 25% off at your favorite restaurant!`,
        pointsNeeded,
        currentPoints: userPoints,
        targetPoints: 300,
        reward: '25% Restaurant Discount',
        progress: Math.round((userPoints / 300) * 100),
        priority: 'medium',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        isRead: false
      });
    }

    return notifications;
  }

  generateAchievementNotifications(userPoints, recentEvents) {
    const notifications = [];

    // Eco Warrior achievement (200 points)
    if (userPoints >= 200 && recentEvents.length > 0) {
      const lastEvent = recentEvents[0];
      const hoursSinceAchievement = (Date.now() - new Date(lastEvent.created_at).getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceAchievement < 24) { // Show achievement notification for 24 hours
        notifications.push({
          id: `achievement_warrior_${Date.now()}`,
          type: this.notificationTypes.ACHIEVEMENT,
          title: '🏆 Achievement Unlocked: Eco Warrior',
          message: 'Congratulations! You\'ve reached 200 points and unlocked the Eco Warrior badge.',
          currentPoints: userPoints,
          targetPoints: 200,
          reward: 'Eco Warrior Badge',
          progress: 100,
          priority: 'medium',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
          isRead: true
        });
      }
    }

    // First recycling achievement (10 points)
    if (userPoints >= 10 && recentEvents.length === 1) {
      notifications.push({
        id: `achievement_first_${Date.now()}`,
        type: this.notificationTypes.ACHIEVEMENT,
        title: '🌟 First Step: Welcome to Trash2Cash!',
        message: 'Great job on your first recycling! You\'re now part of the eco-friendly community.',
        currentPoints: userPoints,
        targetPoints: 10,
        reward: 'Newcomer Badge',
        progress: 100,
        priority: 'medium',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        isRead: true
      });
    }

    return notifications;
  }

  generateSmartTips(recentEvents) {
    const notifications = [];

    if (recentEvents.length === 0) {
      // New user tip
      notifications.push({
        id: `tip_new_user_${Date.now()}`,
        type: this.notificationTypes.TIP,
        title: '💡 Getting Started Tip',
        message: 'Visit any smart bin to start earning points! Each item recycled gives you 10 points.',
        priority: 'low',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        isRead: false
      });
    } else {
      // Analyze user patterns
      const eventTimes = recentEvents.map(e => new Date(e.created_at).getHours());
      const avgHour = eventTimes.reduce((sum, hour) => sum + hour, 0) / eventTimes.length;
      
      if (avgHour >= 9 && avgHour <= 11) {
        notifications.push({
          id: `tip_peak_hours_${Date.now()}`,
          type: this.notificationTypes.TIP,
          title: '💡 Smart Tip: Peak Hours',
          message: 'Visit bins between 2-4 PM for faster processing and bonus points!',
          priority: 'low',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
          isRead: true
        });
      }

      // Frequency tip
      if (recentEvents.length >= 5) {
        notifications.push({
          id: `tip_frequency_${Date.now()}`,
          type: this.notificationTypes.TIP,
          title: '💡 Consistency Bonus',
          message: 'Recycling regularly increases your efficiency score and unlocks bonus rewards!',
          priority: 'low',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
          isRead: true
        });
      }
    }

    return notifications;
  }

  generateLimitedTimeOffers(userPoints) {
    const notifications = [];

    // Weekend special (only show on weekends)
    const isWeekend = [0, 6].includes(new Date().getDay());
    if (isWeekend && userPoints >= 100) {
      notifications.push({
        id: `offer_weekend_${Date.now()}`,
        type: this.notificationTypes.OFFER,
        title: '🎉 Weekend Special: Double Points!',
        message: 'Recycle this weekend to earn double points on all items!',
        priority: 'high',
        timestamp: new Date(),
        isRead: false
      });
    }

    // Monthly challenge
    const dayOfMonth = new Date().getDate();
    if (dayOfMonth >= 25 && userPoints >= 50) {
      notifications.push({
        id: `offer_monthly_${Date.now()}`,
        type: this.notificationTypes.OFFER,
        title: '📅 Monthly Challenge: Last Chance!',
        message: 'Complete 5 more recyclings this month to unlock exclusive rewards!',
        priority: 'medium',
        timestamp: new Date(),
        isRead: false
      });
    }

    return notifications;
  }

  async generateBinAlerts(userId) {
    try {
      const supabase = dbConfig.getAdminClient();
      
      // Get bins with high fill levels
      const { data: highFillBins, error } = await supabase
        .from('bins')
        .select('bin_code, location, latitude, longitude')
        .limit(5);

      if (error || !highFillBins) {
        return [];
      }

      const notifications = [];

      // Simulate high fill level alerts (in real app, this would come from actual sensor data)
      highFillBins.forEach((bin, index) => {
        if (index < 2) { // Show alerts for first 2 bins
          const fillLevel = 75 + Math.floor(Math.random() * 20); // 75-95%
          notifications.push({
            id: `alert_bin_${bin.bin_code}_${Date.now()}`,
            type: this.notificationTypes.ALERT,
            title: `⚠️ High Fill Level Alert`,
            message: `${bin.bin_code} at ${bin.location} is ${fillLevel}% full. Consider visiting soon for optimal points!`,
            priority: 'medium',
            timestamp: new Date(Date.now() - (index + 1) * 60 * 60 * 1000), // Staggered times
            isRead: false
          });
        }
      });

      return notifications;

    } catch (error) {
      console.error('Error generating bin alerts:', error);
      return [];
    }
  }

  generateDefaultNotifications(userPoints) {
    return [
      {
        id: 'default_1',
        type: this.notificationTypes.TIP,
        title: '💡 Welcome to Trash2Cash!',
        message: 'Start recycling to earn points and unlock amazing rewards. Find a smart bin near you!',
        priority: 'high',
        timestamp: new Date(),
        isRead: false
      },
      {
        id: 'default_2',
        type: this.notificationTypes.GOAL,
        title: '🎯 First Goal: Coffee Voucher',
        message: 'Recycle 20 items to earn 200 points and get a free coffee!',
        pointsNeeded: 200 - userPoints,
        currentPoints: userPoints,
        targetPoints: 200,
        reward: 'Free Coffee Voucher',
        progress: Math.round((userPoints / 200) * 100),
        priority: 'medium',
        timestamp: new Date(),
        isRead: false
      },
      {
        id: 'default_3',
        type: this.notificationTypes.TIP,
        title: '🗺️ Find Smart Bins',
        message: 'Use the map to locate smart bins near you. Each recycling earns you 10 points!',
        priority: 'low',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        isRead: false
      }
    ];
  }

  // Generate host-specific notifications
  async generateHostNotifications(hostId) {
    try {
      const supabase = dbConfig.getAdminClient();
      
      // Get host's bins and their status
      const { data: hostBins, error } = await supabase
        .from('bins')
        .select('*')
        .eq('user_id', hostId);

      if (error || !hostBins || hostBins.length === 0) {
        // If host has no bins, show onboarding notifications
        return [
          {
            id: `host_welcome_${Date.now()}`,
            type: this.notificationTypes.TIP,
            title: '🎉 Welcome to Trash2Cash Host Dashboard!',
            message: 'Get started by adding your first smart bin to start earning revenue.',
            priority: 'high',
            timestamp: new Date(),
            isRead: false
          },
          {
            id: `host_setup_${Date.now()}`,
            type: this.notificationTypes.TIP,
            title: '📋 Setup Guide',
            message: 'Contact our team to install smart bins at your location and start generating revenue.',
            priority: 'medium',
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
            isRead: false
          }
        ];
      }

      const notifications = [];

      // Bin performance insights
      hostBins.forEach((bin, index) => {
        const avgFillLevel = 60 + Math.floor(Math.random() * 30); // 60-90%
        
        if (avgFillLevel > 80) {
          notifications.push({
            id: `host_high_fill_${bin.bin_code}_${Date.now()}`,
            type: this.notificationTypes.ALERT,
            title: `🚨 High Fill Level: ${bin.bin_code}`,
            message: `${bin.bin_code} at ${bin.location} is ${avgFillLevel}% full. Schedule collection soon.`,
            priority: 'high',
            timestamp: new Date(Date.now() - index * 30 * 60 * 1000), // Staggered times
            isRead: false
          });
        }
      });

      // Revenue insights - only show if host has bins
      if (hostBins.length > 0) {
        const totalRevenue = hostBins.length * 15000; // Mock revenue per bin
        notifications.push({
          id: `host_revenue_${Date.now()}`,
          type: this.notificationTypes.TIP,
          title: '💰 Revenue Insight',
          message: `Your ${hostBins.length} bin${hostBins.length > 1 ? 's' : ''} generated ₹${totalRevenue.toLocaleString('en-IN')} this month. Great performance!`,
          priority: 'medium',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          isRead: false
        });

        // Maintenance alerts
        notifications.push({
          id: `host_maintenance_${Date.now()}`,
          type: this.notificationTypes.ALERT,
          title: '🔧 Maintenance Alert',
          message: 'Schedule sensor calibration for optimal bin performance.',
          priority: 'medium',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          isRead: false
        });

        // Performance tip
        notifications.push({
          id: `host_performance_${Date.now()}`,
          type: this.notificationTypes.TIP,
          title: '📈 Performance Tip',
          message: `Your bins are performing well! Consider adding more bins in high-traffic areas to increase revenue.`,
          priority: 'low',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
          isRead: false
        });
      }

      return notifications;

    } catch (error) {
      console.error('Error generating host notifications:', error);
      return this.generateDefaultHostNotifications();
    }
  }

  generateDefaultHostNotifications() {
    return [
      {
        id: 'host_default_1',
        type: this.notificationTypes.TIP,
        title: '📊 Welcome to Host Dashboard',
        message: 'Monitor your smart bins and optimize collection schedules for maximum efficiency.',
        priority: 'low',
        timestamp: new Date(),
        isRead: false
      }
    ];
  }
}

module.exports = new AINotificationService();
