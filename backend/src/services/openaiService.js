const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// London slang phrases to inject into responses - authentic Hackney vibes
const londonSlang = {
  greetings: ['wagwan', 'safe', 'yo', 'alright', 'what\'s good', 'what you saying', 'bless up'],
  agreement: ['innit', 'you know it', 'trust me', 'for real', 'no cap', 'on god', 'trust', 'standard', 'obviously'],
  emphasis: ['bruv', 'fam', 'mate', 'blud', 'g', 'bro', 'sis', 'cuz'],
  endings: ['seen', 'yeah', 'trust', 'still', 'you get me', 'you feel me', 'get me', 'ya feel', 'proper'],
  exclamations: ['mad', 'sick', 'cold', 'hard', 'peak', 'dead', 'gassed', 'buzzing', 'peng', 'leng'],
  filler: ['like', 'bare', 'proper', 'long', 'deep', 'calm', 'bait', 'peak']
};

// Function to add London flavor to responses (authentic modern London, no Cockney stereotypes)
const addLondonVibes = (text) => {
  // Add slang naturally without overdoing it - about 60% of responses get some slang
  const shouldAddSlang = Math.random() > 0.4;
  
  if (shouldAddSlang) {
    const slangType = Math.random();
    
    if (slangType < 0.4) {
      // Add ending phrase
      const ending = londonSlang.endings[Math.floor(Math.random() * londonSlang.endings.length)];
      text = text.trim();
      // Add comma before ending if it doesn't end with punctuation
      if (text.match(/[.!?]$/)) {
        text = text.slice(0, -1) + `, ${ending}.`;
      } else {
        text = text + `, ${ending}`;
      }
    } else if (slangType < 0.7) {
      // Inject emphasis word naturally in the middle
      const emphasis = londonSlang.emphasis[Math.floor(Math.random() * londonSlang.emphasis.length)];
      const sentences = text.split('. ');
      if (sentences.length > 1) {
        const randomIndex = Math.floor(Math.random() * sentences.length);
        // Add emphasis at start of sentence
        sentences[randomIndex] = `${emphasis.charAt(0).toUpperCase() + emphasis.slice(1)}, ` + sentences[randomIndex].charAt(0).toLowerCase() + sentences[randomIndex].slice(1);
        text = sentences.join('. ');
      } else {
        // Single sentence - add at the beginning
        text = `${emphasis.charAt(0).toUpperCase() + emphasis.slice(1)}, ` + text.charAt(0).toLowerCase() + text.slice(1);
      }
    } else {
      // Add agreement word
      const agreement = londonSlang.agreement[Math.floor(Math.random() * londonSlang.agreement.length)];
      text = text.trim();
      if (text.match(/[.!?]$/)) {
        text = text.slice(0, -1) + ` - ${agreement}.`;
      } else {
        text = text + `, ${agreement}`;
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
