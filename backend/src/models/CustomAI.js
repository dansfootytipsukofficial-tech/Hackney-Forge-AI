const mongoose = require('mongoose');

const customAISchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  trainingData: {
    type: String, // Could be text or reference to file storage
    required: true
  },
  modelType: {
    type: String,
    enum: ['text-generation', 'image-generation', 'music-generation', 'custom'],
    default: 'text-generation'
  },
  baseModel: {
    type: String,
    default: 'gpt-3.5-turbo'
  },
  personality: {
    type: String,
    default: 'Professional and helpful'
  },
  londonSlang: {
    type: Boolean,
    default: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  usageCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['training', 'ready', 'failed'],
    default: 'ready'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('CustomAI', customAISchema);
