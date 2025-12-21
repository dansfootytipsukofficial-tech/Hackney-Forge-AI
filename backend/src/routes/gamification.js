const express = require('express');
const { auth } = require('../middleware/auth');
const Challenge = require('../models/Challenge');

const router = express.Router();

// Get all active challenges
router.get('/challenges', auth, async (req, res) => {
  try {
    const challenges = await Challenge.find({
      isActive: true,
      $or: [
        { expiresAt: { $gte: new Date() } },
        { expiresAt: null }
      ]
    });

    // Check which challenges user has completed
    const completedIds = req.user.challengesCompleted.map(c => c.challengeId);
    
    const challengesWithStatus = challenges.map(challenge => ({
      ...challenge.toObject(),
      isCompleted: completedIds.includes(challenge._id.toString())
    }));

    res.json({ challenges: challengesWithStatus });
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({ error: 'Failed to fetch challenges' });
  }
});

// Complete a challenge
router.post('/challenges/:challengeId/complete', auth, async (req, res) => {
  try {
    const { challengeId } = req.params;

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    // Check if already completed
    const alreadyCompleted = req.user.challengesCompleted.some(
      c => c.challengeId === challengeId
    );

    if (alreadyCompleted) {
      return res.status(400).json({ error: 'Challenge already completed' });
    }

    // Add to completed challenges
    req.user.challengesCompleted.push({
      challengeId,
      completedAt: new Date(),
      pointsEarned: challenge.pointsReward
    });

    // Award points
    req.user.gangPoints += challenge.pointsReward;

    // Check for level up (every 100 points = 1 level)
    const newLevel = Math.floor(req.user.gangPoints / 100) + 1;
    const leveledUp = newLevel > req.user.level;
    req.user.level = newLevel;

    await req.user.save();

    res.json({
      message: 'Challenge completed, nice work!',
      pointsEarned: challenge.pointsReward,
      totalPoints: req.user.gangPoints,
      level: req.user.level,
      leveledUp
    });
  } catch (error) {
    console.error('Error completing challenge:', error);
    res.status(500).json({ error: 'Failed to complete challenge' });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const topUsers = await User.find()
      .select('username gangPoints level')
      .sort({ gangPoints: -1 })
      .limit(10);

    res.json({ leaderboard: topUsers });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

module.exports = router;
