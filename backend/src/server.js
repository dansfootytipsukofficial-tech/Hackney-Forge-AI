require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/database');
const { apiLimiter } = require('./middleware/rateLimiter');
const { isValidOpenAIKey } = require('./utils/apiKeyValidator');

// Validate required environment variables
function validateEnvironment() {
  const openaiKey = process.env.OPENAI_API_KEY;
  
  if (!isValidOpenAIKey(openaiKey)) {
    console.error('\n❌ ERROR: OpenAI API key is not configured!');
    console.error('\nTo fix this:');
    console.error('  1. Get your API key from: https://platform.openai.com/api-keys');
    console.error('  2. Open backend/.env file');
    console.error('  3. Set OPENAI_API_KEY=sk-your-actual-key-here');
    console.error('  4. Run: node setup-api-keys.js to validate\n');
    console.error('💡 Tip: New OpenAI accounts come with free credits!\n');
    process.exit(1);
  }
  
  console.log('✓ OpenAI API key configured');
}

// Validate environment before starting
validateEnvironment();

// Import routes
const authRoutes = require('./routes/auth');
const aiRoutes = require('./routes/ai');
const userRoutes = require('./routes/user');
const subscriptionRoutes = require('./routes/subscription');
const gamificationRoutes = require('./routes/gamification');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting to all API routes
app.use('/api/', apiLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'alive', 
    message: 'Hackney Forge AI backend is running, innit',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/user', userRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/gamification', gamificationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Something went wrong, bruv',
    status: err.status || 500
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found, mate' });
});

app.listen(PORT, () => {
  console.log(`🚀 Hackney Forge AI backend running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
