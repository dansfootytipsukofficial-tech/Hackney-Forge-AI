const express = require('express');
const { auth, checkQueryLimit } = require('../middleware/auth');
const AIGangMember = require('../models/AIGangMember');
const CustomAI = require('../models/CustomAI');
const { generateAIResponse, generateCustomAIResponse } = require('../services/openaiService');
const { generateText, generateImage } = require('../services/huggingfaceService');

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
router.post('/query/:gangMemberId', auth, checkQueryLimit, async (req, res) => {
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

// Query Hackney Boss AI (oversight AI)
router.post('/boss-query', auth, checkQueryLimit, async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    // Hackney Boss AI has special system prompt for oversight
    const bossAI = {
      name: 'Hackney Boss',
      role: 'Chief AI Overseer',
      londonArea: 'Central Hackney',
      systemPrompt: `You are the Hackney Boss AI, the chief overseer of all AI gang members in Hackney Forge. You provide strategic guidance, coordinate between different AI specialists, and ensure quality control. You're wise, experienced, and straight-talking. You keep it real but maintain authority. You use London slang naturally but professionally.`,
      modelName: 'gpt-3.5-turbo', // Using GPT-3.5 to control costs; upgrade to GPT-4 for production
      londonSlang: true
    };

    const aiResponse = await generateAIResponse(bossAI, message, conversationHistory);

    // Deduct query from user
    await req.user.useQuery();

    // Award more points for Boss AI queries
    req.user.gangPoints += 10;
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
router.post('/custom-ai/:customAIId/query', auth, checkQueryLimit, async (req, res) => {
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
