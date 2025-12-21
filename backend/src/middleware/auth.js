const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No auth token, access denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

const checkQueryLimit = async (req, res, next) => {
  try {
    if (!req.user.canMakeQuery()) {
      return res.status(403).json({ 
        error: 'Query limit reached. Upgrade your subscription to continue.',
        subscriptionStatus: req.user.subscriptionStatus,
        freeQueriesRemaining: req.user.freeQueriesRemaining
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Error checking query limit' });
  }
};

module.exports = { auth, checkQueryLimit };
