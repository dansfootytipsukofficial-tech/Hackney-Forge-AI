# 🔑 API Keys Setup Guide

This guide explains how to get and configure API keys for Hackney Forge AI.

## OpenAI API Key (Required) ✅

The OpenAI API key is **required** for the AI to work. This is what powers the chat functionality.

### Getting Your Free OpenAI API Key

1. **Visit OpenAI**: Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)

2. **Create Account** (if you don't have one):
   - Click "Sign up" 
   - New accounts get **$5 in free credits**!
   - No credit card required for initial signup
   - Free credits last 3-6 months for typical usage

3. **Generate API Key**:
   - Click "Create new secret key"
   - Give it a name like "Hackney Forge AI"
   - **Copy the key immediately** - you won't be able to see it again!
   - The key starts with `sk-` (e.g., `sk-proj-abc123...`)

4. **Save the Key**: Store it in a secure location (password manager, notes app, etc.)

### Adding Your OpenAI Key to the Project

**Method 1: Use the Setup Helper (Recommended)**

```bash
cd backend
node setup-api-keys.js
```

Follow the instructions to add your key.

**Method 2: Manual Configuration**

1. Open `backend/.env` in any text editor
2. Find this line:
   ```
   OPENAI_API_KEY=PASTE_YOUR_OPENAI_API_KEY_HERE
   ```
3. Replace with your actual key:
   ```
   OPENAI_API_KEY=sk-proj-abc123xyz456...
   ```
4. Save the file
5. Verify: `cd backend && npm run validate`

### Best Models to Use

Your API key works with multiple models:

| Model | Best For | Cost | Speed |
|-------|----------|------|-------|
| **gpt-3.5-turbo** | General use, testing, development | Very cheap (~$0.002/1K tokens) | Fast |
| **gpt-4o-mini** | Balanced performance | Moderate | Fast |
| **gpt-4** | Complex tasks, high accuracy | Expensive (~$0.03/1K tokens) | Slower |
| **gpt-4-turbo** | Complex tasks with speed | Expensive | Fast |

**Recommendation**: Start with **gpt-3.5-turbo** (the default). It's fast, affordable, and perfect for most use cases. Your $5 free credits will give you thousands of messages!

### Understanding Costs

- **Token**: ~4 characters or ~0.75 words
- **Typical message**: ~500 tokens
- **Your free $5 credits with gpt-3.5-turbo**: 
  - ≈ 2.5 million tokens
  - ≈ 5,000+ typical conversations
  - ≈ 1,900+ words per conversation

**Real example**:
- Ask: "Explain quantum computing" (5 tokens)
- Response: 200 words (≈270 tokens)
- Total: ~275 tokens = **$0.0005** (half a penny!)

---

## Hugging Face API Key (Optional) 🤗

Hugging Face provides access to thousands of open-source AI models. This is **optional** but adds more capabilities.

### Getting Your Hugging Face Key

1. **Visit**: [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. **Sign up** for a free account (no credit card needed)
3. **Create token**: Click "New token"
   - Type: "Read"
   - Name: "Hackney Forge AI"
4. **Copy the token** (starts with `hf_`)

### Adding Hugging Face Key

In `backend/.env`:
```env
HUGGINGFACE_API_KEY=hf_your_token_here
```

**Note**: Hugging Face has generous free tier limits for API usage!

---

## MongoDB (Database)

### Option 1: Use MongoDB Atlas (Recommended - Free)

1. **Visit**: [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. **Create free account** (no credit card required)
3. **Create free cluster** (M0 - Free tier):
   - Cloud Provider: Any (AWS, Google, Azure)
   - Region: Closest to you
4. **Create database user**:
   - Choose username and password
   - Save these credentials!
5. **Whitelist IP**: Add `0.0.0.0/0` (allow all IPs for development)
6. **Get connection string**:
   - Click "Connect" > "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password

In `backend/.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/hackney-forge-ai?retryWrites=true&w=majority
```

### Option 2: Local MongoDB

**Mac**:
```bash
brew install mongodb-community
brew services start mongodb-community
```

**Ubuntu/Debian**:
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

**Windows**: Download from [mongodb.com](https://www.mongodb.com/try/download/community)

In `backend/.env` (default):
```env
MONGODB_URI=mongodb://localhost:27017/hackney-forge-ai
```

---

## Stripe API Keys (Optional - For Payments)

Only needed if you want to test payment features.

### Getting Stripe Test Keys

1. **Visit**: [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
2. **Create account** (free)
3. **Get test keys**: [https://dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys)
   - Copy "Secret key" (starts with `sk_test_`)
4. **Get webhook secret**:
   - Go to Webhooks > Add endpoint
   - URL: `http://localhost:5000/api/subscription/webhook`
   - Copy signing secret (starts with `whsec_`)

In `backend/.env`:
```env
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
```

---

## Environment Variables Summary

Here's what your `backend/.env` should look like:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB (choose one)
MONGODB_URI=mongodb://localhost:27017/hackney-forge-ai
# OR
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hackney-forge-ai

# JWT Secret (keep this secure!)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Required: OpenAI API
OPENAI_API_KEY=sk-proj-your-openai-key-here

# Optional: Additional APIs
HUGGINGFACE_API_KEY=hf_your_huggingface_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Business Configuration
FREE_TRIAL_QUERIES=3
SUBSCRIPTION_PRICE_MONTHLY=5.00
PAY_PER_QUERY_PRICE=0.50
CURRENCY=GBP

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

---

## Validation Checklist ✅

Run this to verify your setup:

```bash
cd backend
npm run validate
```

You should see:
- ✓ OpenAI API Key: Configured
- ✓ All required API keys are configured!

---

## Security Best Practices 🔒

1. **Never commit API keys**: The `.env` file is in `.gitignore` - keep it there!
2. **Rotate keys**: If you accidentally expose a key, regenerate it immediately
3. **Use different keys**: Development vs. production keys
4. **Monitor usage**: Check your OpenAI dashboard for unexpected usage
5. **Set spending limits**: In OpenAI dashboard, set monthly spending limits

---

## Troubleshooting

### "Invalid API key" Error

- Check for typos in the key
- Ensure key starts with `sk-` (OpenAI) or `hf_` (Hugging Face)
- No spaces before or after the key
- Key is active (not revoked) in your dashboard

### "Insufficient credits" Error

- Check your OpenAI billing dashboard
- Add payment method or purchase more credits
- Consider using gpt-3.5-turbo instead of gpt-4 (cheaper)

### "Rate limit exceeded" Error

- You're making too many requests too quickly
- Wait a few minutes and try again
- Upgrade your OpenAI tier for higher limits

---

## Cost Management Tips 💰

1. **Start with gpt-3.5-turbo**: Much cheaper than GPT-4
2. **Set spending limits**: In OpenAI dashboard, set alerts
3. **Monitor usage**: Check usage daily when starting out
4. **Optimize prompts**: Shorter, clearer prompts = fewer tokens
5. **Cache responses**: The app already does this for you!

---

## Need Help?

- **Setup issues**: Run `node backend/setup-api-keys.js` for diagnostics
- **API errors**: Check the backend logs (`npm run dev`)
- **OpenAI dashboard**: [https://platform.openai.com/account/usage](https://platform.openai.com/account/usage)

---

**You're all set!** 🚀

With your OpenAI API key configured, you're ready to experience the power of Hackney Forge AI. Keep it real! 💪
