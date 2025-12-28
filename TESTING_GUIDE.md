# 🧪 How to Test & Use Hackney Forge AI

This guide shows you exactly how to test and use your Hackney Boss AI platform.

## Quick Test (3 Steps - 5 Minutes)

### Step 1: Get a Free OpenAI API Key

1. Go to: **https://platform.openai.com/api-keys**
2. Sign up (FREE - no credit card needed at first)
3. Click **"Create new secret key"**
4. Copy the key (starts with `sk-`)

**You get $5 in free credits** = thousands of messages!

---

### Step 2: Configure & Validate

```bash
# Navigate to backend folder
cd backend

# Run the validation script
node setup-api-keys.js
```

**You'll see:**
```
❌ ERROR: OpenAI API key is not configured!

To fix this:
  1. Get your API key from: https://platform.openai.com/api-keys
  2. Open backend/.env file
  3. Set OPENAI_API_KEY=sk-your-actual-key-here
```

**Now add your key:**
1. Open `backend/.env` in any text editor (VS Code, TextEdit, Notepad, etc.)
2. Find this line:
   ```
   OPENAI_API_KEY=PASTE_YOUR_OPENAI_API_KEY_HERE
   ```
3. Replace with your actual key:
   ```
   OPENAI_API_KEY=sk-proj-abc123xyz456...
   ```
4. Save the file

**Run validation again:**
```bash
node setup-api-keys.js
```

**You should now see:**
```
✓ OpenAI API Key: Configured
  Key starts with: sk-proj-ab...
  
✓ All required API keys are configured!
🚀 Let's get started, innit!
```

---

### Step 3: Start & Test

```bash
# Go back to project root
cd ..

# Install dependencies (first time only)
npm install

# Start the application
npm run dev
```

**This will:**
- Start the backend server on port 5000
- Start the frontend on port 5173
- Open automatically in your browser

**Visit:** http://localhost:5173

---

## Testing the AI Chat

### Option 1: Use the Web Interface (Recommended)

1. **Open:** http://localhost:5173
2. **Sign Up** - Create an account (you get 3 free queries to test)
3. **Navigate to "AI Gang"** or **"Hackney Boss"**
4. **Type a message** like:
   - "Hey, tell me about AI"
   - "What's machine learning?"
   - "Explain quantum computing in simple terms"
5. **Send** and watch the AI respond!

### Option 2: Test the API Directly (For Developers)

```bash
# First, create a user account (from project root)
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "test123456"
  }'

# Login to get a token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456"
  }'

# Copy the "token" from the response, then test the Boss AI:
curl -X POST http://localhost:5000/api/ai/boss-query \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "message": "Tell me about artificial intelligence"
  }'
```

---

## What to Test

### ✅ Validation Script
- **Run:** `cd backend && node setup-api-keys.js`
- **Test:** Remove your API key and run again (should show error)
- **Test:** Add it back and run again (should show success)

### ✅ Server Startup Protection
- **Test:** Try starting the server without an API key
  ```bash
  # Remove your key from backend/.env temporarily
  cd backend
  npm run dev
  ```
- **Expected:** Server should refuse to start with a clear error message

### ✅ Chat Functionality
- **Test:** Ask simple questions
- **Test:** Ask complex questions
- **Test:** Have a conversation (multiple messages back and forth)

### ✅ Different AI Models
The platform supports multiple models:
- **gpt-3.5-turbo** (default, fast, cheap)
- **gpt-4** (slower, more expensive, but smarter)

### ✅ Features to Try
1. **Create an account** - Test the free trial (3 queries)
2. **Chat with AI Gang Members** - Each has a unique personality
3. **Hackney Boss AI** - The main strategic AI
4. **Create Custom AI** - Build your own AI with custom personality
5. **Complete Challenges** - Earn points and level up

---

## Troubleshooting

### "Invalid API key" error
- Make sure you copied the entire key (including `sk-` prefix)
- No spaces before or after the key in the `.env` file
- Key is active in your OpenAI dashboard

### Server won't start
- Run `cd backend && npm run validate` to check configuration
- Make sure you're in the correct directory
- Check if port 5000 or 5173 is already in use

### No response from AI
- Check backend logs for errors
- Verify your OpenAI account has credits
- Check your OpenAI dashboard for rate limits

### MongoDB connection error (optional)
- You can ignore this initially if just testing the API
- Or use MongoDB Atlas (free): https://www.mongodb.com/cloud/atlas

---

## Example Test Session

Here's a complete test session:

```bash
# 1. Set up API key
cd backend
node setup-api-keys.js
# (Add your key to .env file)
node setup-api-keys.js  # Verify it works

# 2. Start the app
cd ..
npm run dev

# 3. Open browser to http://localhost:5173

# 4. Create account and chat:
#    - Username: testuser
#    - Email: test@test.com
#    - Password: test123
#
#    Message: "Explain AI in simple terms"
#    
#    You should get a response in 2-3 seconds!
```

---

## Cost Monitoring

While testing:
- **Monitor usage:** https://platform.openai.com/account/usage
- **Set spending limits** in your OpenAI dashboard
- **Track costs:** Each message costs ~$0.001 with gpt-3.5-turbo

Your $5 free credits = thousands of test messages!

---

## Next Steps After Testing

Once you've verified everything works:

1. **Explore the AI Gang** - Try different AI personalities
2. **Create Custom AIs** - Build specialized assistants
3. **Test Gamification** - Complete challenges and earn points
4. **Add Optional Features:**
   - Hugging Face API for more models
   - MongoDB for persistence
   - Stripe for payments

---

## Need Help?

If you run into issues:
1. Run `cd backend && npm run validate` to check your setup
2. Check the backend console for error messages
3. Review [QUICKSTART.md](QUICKSTART.md) for setup instructions
4. Check [API_KEYS_GUIDE.md](API_KEYS_GUIDE.md) for detailed API info

---

**That's it! You're now ready to test and use your Hackney Boss AI!** 🚀

Keep it real, innit! 💪
