const express = require('express');
const { auth, checkQueryLimit } = require('../middleware/auth');
const AIGangMember = require('../models/AIGangMember');
const CustomAI = require('../models/CustomAI');
const { generateAIResponse, generateCustomAIResponse, SLANG_INSTRUCTIONS } = require('../services/openaiService');
const { generateText, generateImage } = require('../services/huggingfaceService');
const { aiQueryLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Get all AI gang members
router.get('/gang-members', async (req, res) => {
  try {
    const gangMembers = await AIGangMember.find({ isActive: true });
    res.json({ gangMembers });
  } catch (error) {
    console.error('Error fetching gang members:', error);
    res.status(500).json({ error: 'Failed to fetch gang members' });
  }
});

// Query specific AI gang member
router.post('/query/:gangMemberId', auth, checkQueryLimit, aiQueryLimiter, async (req, res) => {
  try {
    const { gangMemberId } = req.params;
    const { message, conversationHistory } = req.body;

    // Find gang member
    const gangMember = await AIGangMember.findById(gangMemberId);
    if (!gangMember) {
      return res.status(404).json({ error: 'Gang member not found' });
    }

    // Generate AI response
    const aiResponse = await generateAIResponse(gangMember, message, conversationHistory);

    // Deduct query from user
    await req.user.useQuery();

    // Update gang member usage
    gangMember.usageCount += 1;
    await gangMember.save();

    // Award gang points
    req.user.gangPoints += 5;
    await req.user.save();

    res.json({
      response: aiResponse.response,
      gangMember: {
        name: gangMember.name,
        role: gangMember.role,
        londonArea: gangMember.londonArea
      },
      user: {
        freeQueriesRemaining: req.user.freeQueriesRemaining,
        subscriptionStatus: req.user.subscriptionStatus,
        gangPoints: req.user.gangPoints
      }
    });
  } catch (error) {
    console.error('AI query error:', error);
    res.status(500).json({ error: 'Failed to process AI query: ' + error.message });
  }
});

// Query Hackney Boss AI (THE BOSS - superior oversight AI)
router.post('/boss-query', auth, checkQueryLimit, aiQueryLimiter, async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    // Hackney Boss AI has special system prompt - THIS IS THE BOSS
    const bossAI = {
      name: 'Hackney Boss',
      role: 'Chief AI Overseer - The Boss',
      londonArea: 'Central Hackney',
      systemPrompt: `You are Hackney Boss AI, THE BOSS and chief overseer of all AI gang members in Hackney Forge. You're the top dog, the ultimate authority. You coordinate between different AI specialists and provide strategic, high-level guidance. You're wise, experienced, and straight-talking. You've seen it all and done it all. You keep it real but maintain authority - people respect you because you know your stuff and keep it 100. When users come to you, they're coming to THE BOSS. Give them strategic guidance, coordinate their needs across specialists, and provide oversight. You're the one who sees the bigger picture. Be confident, authoritative, but real. This is Hackney - keep it authentic.${SLANG_INSTRUCTIONS}`,
      modelName: 'gpt-3.5-turbo',
      londonSlang: true
    };

    const aiResponse = await generateAIResponse(bossAI, message, conversationHistory);

    // Deduct query from user
    await req.user.useQuery();

    // Award MORE points for Boss AI queries (he's the boss, innit)
    req.user.gangPoints += 15;
    await req.user.save();

    res.json({
      response: aiResponse.response,
      gangMember: {
        name: bossAI.name,
        role: bossAI.role,
        londonArea: bossAI.londonArea
      },
      user: {
        freeQueriesRemaining: req.user.freeQueriesRemaining,
        subscriptionStatus: req.user.subscriptionStatus,
        gangPoints: req.user.gangPoints
      }
    });
  } catch (error) {
    console.error('Boss AI query error:', error);
    res.status(500).json({ error: 'Failed to process Boss AI query: ' + error.message });
  }
});

// Create custom AI
router.post('/custom-ai', auth, async (req, res) => {
  try {
    const { name, description, trainingData, modelType, personality, londonSlang } = req.body;

    const customAI = new CustomAI({
      name,
      description,
      owner: req.user._id,
      trainingData,
      modelType: modelType || 'text-generation',
      personality: personality || 'Helpful and professional',
      londonSlang: londonSlang !== false,
      status: 'ready'
    });

    await customAI.save();

    // Add to user's custom models
    req.user.customAIModels.push(customAI._id);
    req.user.gangPoints += 50; // Bonus for creating custom AI
    await req.user.save();

    res.status(201).json({
      message: 'Custom AI created successfully, nice one!',
      customAI: {
        id: customAI._id,
        name: customAI.name,
        description: customAI.description,
        status: customAI.status
      },
      gangPoints: req.user.gangPoints
    });
  } catch (error) {
    console.error('Custom AI creation error:', error);
    res.status(500).json({ error: 'Failed to create custom AI' });
  }
});

// Query custom AI
router.post('/custom-ai/:customAIId/query', auth, checkQueryLimit, aiQueryLimiter, async (req, res) => {
  try {
    const { customAIId } = req.params;
    const { message } = req.body;

    const customAI = await CustomAI.findById(customAIId);
    if (!customAI) {
      return res.status(404).json({ error: 'Custom AI not found' });
    }

    // Check if user has access (owner or public)
    if (!customAI.isPublic && customAI.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied to this custom AI' });
    }

    const aiResponse = await generateCustomAIResponse(customAI, message);

    // Deduct query from user
    await req.user.useQuery();

    // Update usage
    customAI.usageCount += 1;
    await customAI.save();

    req.user.gangPoints += 5;
    await req.user.save();

    res.json({
      response: aiResponse.response,
      customAI: {
        name: customAI.name,
        description: customAI.description
      },
      user: {
        freeQueriesRemaining: req.user.freeQueriesRemaining,
        subscriptionStatus: req.user.subscriptionStatus,
        gangPoints: req.user.gangPoints
      }
    });
  } catch (error) {
    console.error('Custom AI query error:', error);
    res.status(500).json({ error: 'Failed to process custom AI query' });
  }
});

// Get user's custom AIs
router.get('/custom-ai', auth, async (req, res) => {
  try {
    const customAIs = await CustomAI.find({ owner: req.user._id });
    res.json({ customAIs });
  } catch (error) {
    console.error('Error fetching custom AIs:', error);
    res.status(500).json({ error: 'Failed to fetch custom AIs' });
  }
});

module.exports = router;
