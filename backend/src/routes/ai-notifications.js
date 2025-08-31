const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const aiNotificationService = require('../services/aiNotificationService');

// Get AI notifications for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.auth.userId;
    const userRole = req.auth.role;
    
    console.log(`🤖 Generating AI notifications for user ${userId} (${userRole})`);
    
    let notifications = [];
    
    if (userRole === 'host') {
      // Generate host-specific notifications
      notifications = await aiNotificationService.generateHostNotifications(userId);
    } else {
      // Generate user-specific notifications
      // For now, we'll use mock points. In a real app, this would come from the user's actual points
      const mockUserPoints = Math.floor(Math.random() * 300) + 50; // 50-350 points
      notifications = await aiNotificationService.generateUserNotifications(userId, mockUserPoints);
    }
    
    console.log(`✅ Generated ${notifications.length} AI notifications`);
    
    res.json({
      success: true,
      notifications,
      count: notifications.length,
      unreadCount: notifications.filter(n => !n.isRead).length
    });
    
  } catch (error) {
    console.error('❌ Error generating AI notifications:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate AI notifications',
      message: error.message
    });
  }
});

// Mark notification as read
router.patch('/:notificationId/read', authenticateToken, async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.auth.userId;
    
    console.log(`📝 Marking notification ${notificationId} as read for user ${userId}`);
    
    // In a real app, this would update the database
    // For MVP, we'll just return success
    res.json({
      success: true,
      message: 'Notification marked as read'
    });
    
  } catch (error) {
    console.error('❌ Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark notification as read',
      message: error.message
    });
  }
});

// Mark all notifications as read
router.patch('/read-all', authenticateToken, async (req, res) => {
  try {
    const userId = req.auth.userId;
    
    console.log(`📝 Marking all notifications as read for user ${userId}`);
    
    // In a real app, this would update the database
    // For MVP, we'll just return success
    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
    
  } catch (error) {
    console.error('❌ Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark all notifications as read',
      message: error.message
    });
  }
});

// Delete a notification
router.delete('/:notificationId', authenticateToken, async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.auth.userId;
    
    console.log(`🗑️ Deleting notification ${notificationId} for user ${userId}`);
    
    // In a real app, this would delete from the database
    // For MVP, we'll just return success
    res.json({
      success: true,
      message: 'Notification deleted'
    });
    
  } catch (error) {
    console.error('❌ Error deleting notification:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete notification',
      message: error.message
    });
  }
});

module.exports = router;
