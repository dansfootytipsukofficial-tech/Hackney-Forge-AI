const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Register new user
router.post('/register', authLimiter, async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      subscriptionStatus: 'trial',
      freeQueriesRemaining: parseInt(process.env.FREE_TRIAL_QUERIES) || 3
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Welcome to Hackney Forge AI, bruv!',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        subscriptionStatus: user.subscriptionStatus,
        freeQueriesRemaining: user.freeQueriesRemaining,
        gangPoints: user.gangPoints,
        level: user.level
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Welcome back to the manor!',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionType: user.subscriptionType,
        freeQueriesRemaining: user.freeQueriesRemaining,
        gangPoints: user.gangPoints,
        level: user.level
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

module.exports = router;
