#!/usr/bin/env node

/**
 * Hackney Forge AI - API Key Setup Helper
 * 
 * This script helps you configure your API keys for the Hackney Boss AI platform.
 * Run this before starting the server to ensure everything is configured properly.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

console.log(`\n${colors.bright}${colors.cyan}═══════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}🔥 Hackney Forge AI - API Key Setup${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}═══════════════════════════════════════════════${colors.reset}\n`);

// Check if .env file exists
if (!fs.existsSync(envPath)) {
  console.log(`${colors.yellow}⚠️  No .env file found. Creating from .env.example...${colors.reset}\n`);
  
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log(`${colors.green}✓ Created .env file${colors.reset}\n`);
  } else {
    console.log(`${colors.red}✗ Error: .env.example not found${colors.reset}\n`);
    process.exit(1);
  }
}

// Read current .env file
const envContent = fs.readFileSync(envPath, 'utf-8');
const envLines = envContent.split('\n');

// Parse environment variables
const envVars = {};
envLines.forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim();
    envVars[key] = value;
  }
});

// Check OpenAI API key
const openaiKey = envVars.OPENAI_API_KEY || '';
const hasOpenAIKey = openaiKey && 
                     openaiKey !== 'your_openai_api_key_here' && 
                     openaiKey !== 'PASTE_YOUR_OPENAI_API_KEY_HERE' &&
                     openaiKey.startsWith('sk-');

console.log(`${colors.bright}Configuration Status:${colors.reset}\n`);

if (hasOpenAIKey) {
  console.log(`${colors.green}✓ OpenAI API Key: Configured${colors.reset}`);
  console.log(`  Key starts with: ${openaiKey.substring(0, 10)}...${colors.reset}\n`);
} else {
  console.log(`${colors.red}✗ OpenAI API Key: NOT CONFIGURED${colors.reset}`);
  console.log(`${colors.yellow}  This is REQUIRED for the AI to work!${colors.reset}\n`);
}

// Check other optional keys
const huggingfaceKey = envVars.HUGGINGFACE_API_KEY || '';
const hasHuggingfaceKey = huggingfaceKey && huggingfaceKey !== 'your_huggingface_api_key_here';

if (hasHuggingfaceKey) {
  console.log(`${colors.green}✓ Hugging Face API Key: Configured (optional)${colors.reset}\n`);
} else {
  console.log(`${colors.yellow}○ Hugging Face API Key: Not configured (optional)${colors.reset}\n`);
}

// Check MongoDB URI
const mongoUri = envVars.MONGODB_URI || '';
if (mongoUri && mongoUri !== 'mongodb://localhost:27017/hackney-forge-ai') {
  console.log(`${colors.green}✓ MongoDB URI: Custom configuration${colors.reset}\n`);
} else {
  console.log(`${colors.cyan}○ MongoDB URI: Using default (localhost)${colors.reset}\n`);
}

console.log(`${colors.cyan}─────────────────────────────────────────────────${colors.reset}\n`);

if (!hasOpenAIKey) {
  console.log(`${colors.bright}${colors.yellow}⚠️  ACTION REQUIRED: Configure Your OpenAI API Key${colors.reset}\n`);
  console.log(`${colors.bright}How to get your OpenAI API key:${colors.reset}`);
  console.log(`  1. Go to: ${colors.cyan}https://platform.openai.com/api-keys${colors.reset}`);
  console.log(`  2. Sign in or create a free account`);
  console.log(`  3. Click "Create new secret key"`);
  console.log(`  4. Copy the key (starts with 'sk-')${colors.reset}\n`);
  
  console.log(`${colors.bright}To add your key:${colors.reset}`);
  console.log(`  1. Open: ${colors.cyan}backend/.env${colors.reset}`);
  console.log(`  2. Find the line: ${colors.yellow}OPENAI_API_KEY=PASTE_YOUR_OPENAI_API_KEY_HERE${colors.reset}`);
  console.log(`  3. Replace with: ${colors.green}OPENAI_API_KEY=sk-your-actual-key-here${colors.reset}`);
  console.log(`  4. Save the file and run this script again${colors.reset}\n`);
  
  console.log(`${colors.bright}${colors.yellow}Note:${colors.reset} ${colors.yellow}New OpenAI accounts include free credits!${colors.reset}`);
  console.log(`${colors.yellow}GPT-3.5-turbo is the most cost-effective model.${colors.reset}\n`);
  
  console.log(`${colors.red}${colors.bright}❌ Cannot start server without OpenAI API key${colors.reset}\n`);
  process.exit(1);
} else {
  console.log(`${colors.green}${colors.bright}✓ All required API keys are configured!${colors.reset}\n`);
  console.log(`${colors.bright}You're ready to start the server:${colors.reset}`);
  console.log(`  ${colors.cyan}npm run dev${colors.reset} - Start backend in development mode`);
  console.log(`  ${colors.cyan}npm start${colors.reset} - Start backend in production mode\n`);
  
  console.log(`${colors.bright}Best free model for you:${colors.reset}`);
  console.log(`  ${colors.green}gpt-3.5-turbo${colors.reset} - Fast, affordable, included in free tier\n`);
  
  console.log(`${colors.cyan}Visit the frontend at: ${colors.bright}http://localhost:5173${colors.reset}\n`);
  console.log(`${colors.green}${colors.bright}🚀 Let's get started, innit!${colors.reset}\n`);
}
