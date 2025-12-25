const OpenAI = require('openai');

// Validate API key before initializing
if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here' || process.env.OPENAI_API_KEY === 'PASTE_YOUR_OPENAI_API_KEY_HERE') {
  throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY in your .env file.');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// London slang phrases to inject into responses
const londonSlang = {
  greetings: ['wagwan', 'safe', 'yo', 'alright', 'what\'s good'],
  agreement: ['innit', 'you know it', 'trust me', 'for real', 'no cap'],
  emphasis: ['bruv', 'fam', 'mate', 'blud', 'g'],
  endings: ['seen', 'yeah', 'trust', 'still', 'you get me']
};

// Function to add London flavor to responses (no Cockney stereotypes)
const addLondonVibes = (text) => {
  // Add occasional slang without overdoing it
  const shouldAddSlang = Math.random() > 0.5;
  
  if (shouldAddSlang) {
    const ending = londonSlang.endings[Math.floor(Math.random() * londonSlang.endings.length)];
    const emphasis = londonSlang.emphasis[Math.floor(Math.random() * londonSlang.emphasis.length)];
    
    // Randomly add slang at the end or inject emphasis
    if (Math.random() > 0.5) {
      text = text + `, ${ending}`;
    } else {
      // Inject emphasis word naturally
      const sentences = text.split('. ');
      if (sentences.length > 1) {
        const randomIndex = Math.floor(Math.random() * sentences.length);
        sentences[randomIndex] = sentences[randomIndex].replace(/^/, `${emphasis}, `);
        text = sentences.join('. ');
      }
    }
  }
  
  return text;
};

// Generate AI response with specific gang member personality
const generateAIResponse = async (gangMember, userMessage, conversationHistory = []) => {
  try {
    const messages = [
      {
        role: 'system',
        content: gangMember.systemPrompt + '\n\nIMPORTANT: Be authentic, direct, and uncensored. Use natural London slang (not Cockney). Be helpful but keep it real.'
      },
      ...conversationHistory,
      {
        role: 'user',
        content: userMessage
      }
    ];

    const completion = await openai.chat.completions.create({
      model: gangMember.modelName || 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.8, // Higher for more creative/uncensored responses
      max_tokens: 1000,
    });

    let response = completion.choices[0].message.content;
    
    // Add London vibes if enabled
    if (gangMember.londonSlang !== false) {
      response = addLondonVibes(response);
    }

    return {
      response,
      usage: completion.usage
    };
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to generate AI response: ' + error.message);
  }
};

// Generate response for custom AI model
const generateCustomAIResponse = async (customModel, userMessage) => {
  try {
    const messages = [
      {
        role: 'system',
        content: `You are ${customModel.name}. ${customModel.description}\n\nPersonality: ${customModel.personality}\n\nTraining context: ${customModel.trainingData.substring(0, 500)}`
      },
      {
        role: 'user',
        content: userMessage
      }
    ];

    const completion = await openai.chat.completions.create({
      model: customModel.baseModel || 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.7,
      max_tokens: 800,
    });

    let response = completion.choices[0].message.content;
    
    if (customModel.londonSlang) {
      response = addLondonVibes(response);
    }

    return {
      response,
      usage: completion.usage
    };
  } catch (error) {
    console.error('OpenAI Custom AI Error:', error);
    throw new Error('Failed to generate custom AI response: ' + error.message);
  }
};

module.exports = {
  generateAIResponse,
  generateCustomAIResponse,
  addLondonVibes
};
