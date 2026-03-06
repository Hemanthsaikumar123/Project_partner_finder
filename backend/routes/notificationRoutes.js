const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// GET user's notifications (protected route)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate('notifications.fromUser', 'name email')
      .populate('notifications.projectId', 'title');
    
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Sort notifications by date (newest first)
    const notifications = user.notifications.sort((a, b) => b.createdAt - a.createdAt);
    
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT Mark notification as read (protected route)
router.put('/:notificationId/read', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.userId, 'notifications._id': req.params.notificationId },
      { $set: { 'notifications.$.read': true } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ msg: "Notification not found" });
    }

    res.json({ msg: "Notification marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT Mark all notifications as read (protected route)
router.put('/read-all', authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.userId,
      { $set: { 'notifications.$[].read': true } }
    );

    res.json({ msg: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a notification (protected route)
router.delete('/:notificationId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $pull: { notifications: { _id: req.params.notificationId } } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ msg: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
