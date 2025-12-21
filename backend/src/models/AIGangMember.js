const mongoose = require('mongoose');

const aiGangMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  personality: {
    type: String,
    required: true
  },
  specialties: [String],
  systemPrompt: {
    type: String,
    required: true
  },
  modelProvider: {
    type: String,
    enum: ['openai', 'huggingface'],
    default: 'openai'
  },
  modelName: {
    type: String,
    default: 'gpt-3.5-turbo'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  usageCount: {
    type: Number,
    default: 0
  },
  avatar: {
    type: String,
    default: ''
  },
  londonArea: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('AIGangMember', aiGangMemberSchema);
