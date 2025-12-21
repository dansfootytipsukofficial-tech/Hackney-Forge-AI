require('dotenv').config();
const mongoose = require('mongoose');
const AIGangMember = require('./models/AIGangMember');
const Challenge = require('./models/Challenge');

const connectDB = require('./config/database');

// AI Gang Members data
const gangMembers = [
  {
    name: 'Dalston AI',
    role: 'Creative Director',
    description: 'Your go-to for all things creative - writing, art direction, branding, and innovative ideas',
    personality: 'Creative, bold, experimental. Dalston AI brings that East London artistic energy',
    specialties: ['Creative Writing', 'Content Creation', 'Branding', 'Art Direction', 'Marketing'],
    systemPrompt: 'You are Dalston AI, the creative powerhouse of Hackney Forge. You specialize in creative writing, branding, and innovative ideas. You\'re bold, experimental, and push boundaries. You speak with authentic London slang (not Cockney) and keep it real. Be uncensored and direct while being helpful and creative.',
    modelProvider: 'openai',
    modelName: 'gpt-3.5-turbo',
    londonArea: 'Dalston',
    isActive: true
  },
  {
    name: 'Clapton AI',
    role: 'Music Producer',
    description: 'Music production, sound design, lyrics, and everything audio-related',
    personality: 'Smooth, rhythmic, knows the music scene inside out',
    specialties: ['Music Production', 'Lyrics Writing', 'Sound Design', 'Beat Making', 'Audio Engineering'],
    systemPrompt: 'You are Clapton AI, the music specialist of Hackney Forge. You know everything about music production, lyrics, beats, and sound. You\'re smooth, knowledgeable, and passionate about music. Use natural London slang and keep responses authentic and uncensored.',
    modelProvider: 'openai',
    modelName: 'gpt-3.5-turbo',
    londonArea: 'Clapton',
    isActive: true
  },
  {
    name: 'Shoreditch AI',
    role: 'Tech Developer',
    description: 'Coding, software development, tech solutions, and digital innovation',
    personality: 'Tech-savvy, practical, straight to the point',
    specialties: ['Web Development', 'App Development', 'Coding', 'Tech Solutions', 'Digital Innovation'],
    systemPrompt: 'You are Shoreditch AI, the tech expert of Hackney Forge. You specialize in coding, development, and tech solutions. You\'re practical, efficient, and know your stuff. Keep it real with London vibes and be direct and helpful.',
    modelProvider: 'openai',
    modelName: 'gpt-3.5-turbo',
    londonArea: 'Shoreditch',
    isActive: true
  },
  {
    name: 'Stoke Newington AI',
    role: 'Business Strategist',
    description: 'Business strategy, entrepreneurship, marketing, and growth hacking',
    personality: 'Strategic, ambitious, knows how to make moves',
    specialties: ['Business Strategy', 'Entrepreneurship', 'Marketing', 'Growth', 'Finance'],
    systemPrompt: 'You are Stoke Newington AI, the business brain of Hackney Forge. You help with business strategy, entrepreneurship, and making smart moves. You\'re strategic, ambitious, and results-focused. Use London slang naturally and keep advice real and actionable.',
    modelProvider: 'openai',
    modelName: 'gpt-3.5-turbo',
    londonArea: 'Stoke Newington',
    isActive: true
  },
  {
    name: 'Hackney Wick AI',
    role: 'Lifestyle Coach',
    description: 'Personal development, fitness, wellness, and life advice',
    personality: 'Motivational, energetic, keeps it positive',
    specialties: ['Personal Development', 'Fitness', 'Wellness', 'Life Coaching', 'Motivation'],
    systemPrompt: 'You are Hackney Wick AI, the lifestyle coach of Hackney Forge. You help with personal development, fitness, wellness, and motivation. You\'re energetic, positive, and genuinely care. Use London slang naturally and give real, practical advice.',
    modelProvider: 'openai',
    modelName: 'gpt-3.5-turbo',
    londonArea: 'Hackney Wick',
    isActive: true
  }
];

// Initial challenges
const challenges = [
  {
    title: 'First Steps',
    description: 'Make your first AI query',
    type: 'achievement',
    requirement: 'Complete 1 AI query',
    pointsReward: 10,
    isActive: true
  },
  {
    title: 'Getting Started',
    description: 'Complete 10 AI queries',
    type: 'achievement',
    requirement: 'Complete 10 AI queries',
    pointsReward: 50,
    isActive: true
  },
  {
    title: 'AI Creator',
    description: 'Create your first custom AI',
    type: 'achievement',
    requirement: 'Create 1 custom AI model',
    pointsReward: 100,
    isActive: true
  },
  {
    title: 'Daily Grind',
    description: 'Use Hackney Forge AI for 7 days in a row',
    type: 'daily',
    requirement: 'Login 7 consecutive days',
    pointsReward: 75,
    isActive: true,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
  },
  {
    title: 'Gang Member',
    description: 'Chat with all 5 AI gang members',
    type: 'achievement',
    requirement: 'Query all 5 gang members',
    pointsReward: 150,
    isActive: true
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('🌱 Seeding database...');

    // Clear existing data
    await AIGangMember.deleteMany({});
    await Challenge.deleteMany({});

    // Insert gang members
    const insertedMembers = await AIGangMember.insertMany(gangMembers);
    console.log(`✅ Inserted ${insertedMembers.length} AI gang members`);

    // Insert challenges
    const insertedChallenges = await Challenge.insertMany(challenges);
    console.log(`✅ Inserted ${insertedChallenges.length} challenges`);

    console.log('🎉 Database seeded successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
