const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  subscriptionType: {
    type: String,
    enum: ['free', 'monthly', 'pay-per-query'],
    default: 'free'
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'inactive', 'cancelled', 'trial'],
    default: 'trial'
  },
  freeQueriesRemaining: {
    type: Number,
    default: 3
  },
  stripeCustomerId: {
    type: String,
    default: null
  },
  stripeSubscriptionId: {
    type: String,
    default: null
  },
  gangPoints: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  customAIModels: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CustomAI'
  }],
  challengesCompleted: [{
    challengeId: String,
    completedAt: Date,
    pointsEarned: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to check if user can make query
userSchema.methods.canMakeQuery = function() {
  if (this.subscriptionStatus === 'active' && 
      (this.subscriptionType === 'monthly' || this.subscriptionType === 'pay-per-query')) {
    return true;
  }
  if (this.subscriptionStatus === 'trial' && this.freeQueriesRemaining > 0) {
    return true;
  }
  return false;
};

// Method to deduct query
userSchema.methods.useQuery = async function() {
  if (this.subscriptionStatus === 'trial' && this.freeQueriesRemaining > 0) {
    this.freeQueriesRemaining -= 1;
    if (this.freeQueriesRemaining === 0) {
      this.subscriptionStatus = 'inactive';
    }
    await this.save();
  }
};

module.exports = mongoose.model('User', userSchema);
