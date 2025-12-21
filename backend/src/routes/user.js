const express = require('express');
const { auth } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('customAIModels');

    res.json({ user });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { username } = req.body;

    if (username) {
      req.user.username = username;
      await req.user.save();
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        username: req.user.username,
        email: req.user.email,
        gangPoints: req.user.gangPoints,
        level: req.user.level
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get user stats
router.get('/stats', auth, async (req, res) => {
  try {
    res.json({
      stats: {
        username: req.user.username,
        level: req.user.level,
        gangPoints: req.user.gangPoints,
        subscriptionType: req.user.subscriptionType,
        subscriptionStatus: req.user.subscriptionStatus,
        freeQueriesRemaining: req.user.freeQueriesRemaining,
        customAIModels: req.user.customAIModels.length,
        challengesCompleted: req.user.challengesCompleted.length,
        memberSince: req.user.createdAt
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
