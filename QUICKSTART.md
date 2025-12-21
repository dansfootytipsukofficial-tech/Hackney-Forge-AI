# Quick Start Guide - Hackney Forge AI

## 🚀 Fastest Way to Get Started

### Option 1: Automated Setup (Recommended)

```bash
# Run the setup script
./setup.sh

# Update your API keys in backend/.env
nano backend/.env  # or use your favorite editor

# Seed the database
cd backend && node src/seed.js && cd ..

# Start the application
npm run dev
```

Visit http://localhost:5173 and you're good to go! 🔥

### Option 2: Docker (Production-like)

```bash
# Create .env file with your keys
cp backend/.env.example backend/.env
# Edit backend/.env with your API keys

# Start all services with Docker
docker-compose up -d

# Seed the database
docker-compose exec backend node src/seed.js
```

Visit http://localhost

### Option 3: Manual Setup

```bash
# 1. Install dependencies
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# 2. Setup environment
cp backend/.env.example backend/.env
# Edit backend/.env with your API keys

# 3. Start MongoDB (if local)
mongod

# 4. Seed database
cd backend && node src/seed.js && cd ..

# 5. Start backend
cd backend && npm run dev

# 6. In another terminal, start frontend
cd frontend && npm run dev
```

## 🔑 Required API Keys

### OpenAI API Key (Required)
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Add to `backend/.env`: `OPENAI_API_KEY=sk-...`

### Hugging Face API Key (Optional)
1. Go to https://huggingface.co/settings/tokens
2. Create a new token
3. Add to `backend/.env`: `HUGGINGFACE_API_KEY=hf_...`

### Stripe API Keys (Required for Payments)
1. Go to https://dashboard.stripe.com/test/apikeys
2. Get your test keys
3. Add to `backend/.env`:
   - `STRIPE_SECRET_KEY=sk_test_...`
   - `STRIPE_WEBHOOK_SECRET=whsec_...`

### MongoDB (Required)
- **Local**: Use default `mongodb://localhost:27017/hackney-forge-ai`
- **Atlas**: Get connection string from https://cloud.mongodb.com
  - Add to `backend/.env`: `MONGODB_URI=mongodb+srv://...`

## 📱 First Steps After Setup

1. **Create an Account**
   - Visit http://localhost:5173
   - Click "Sign Up"
   - You get 3 free queries!

2. **Chat with AI Gang**
   - Go to "AI Gang" page
   - Pick a gang member (try Dalston AI for creativity)
   - Start chatting!

3. **Create Custom AI**
   - Navigate to "Custom AI"
   - Click "Create New AI"
   - Add your training data
   - Chat with your custom AI

4. **Complete Challenges**
   - Visit "Challenges" page
   - Complete challenges to earn points
   - Level up!

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB
mongod

# Or use MongoDB Atlas and update MONGODB_URI
```

### Port Already in Use
```bash
# Backend (port 5000)
lsof -ti:5000 | xargs kill -9

# Frontend (port 5173)
lsof -ti:5173 | xargs kill -9
```

### OpenAI API Errors
- Check your API key is correct
- Ensure you have credits in your OpenAI account
- Check rate limits: https://platform.openai.com/account/limits

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

## 🔧 Development Tips

### Hot Reload
Both frontend and backend support hot reload:
- Frontend: Changes reflect immediately
- Backend: Nodemon restarts on file changes

### Testing API Endpoints
```bash
# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@test.com","password":"test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

### Database Management
```bash
# Connect to MongoDB
mongosh hackney-forge-ai

# View users
db.users.find().pretty()

# Clear all data
db.users.deleteMany({})
db.aigangmembers.deleteMany({})
db.challenges.deleteMany({})

# Re-seed
node backend/src/seed.js
```

## 📊 Monitoring

### Check Logs
```bash
# Backend logs
cd backend && npm run dev

# Frontend logs  
cd frontend && npm run dev

# Docker logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Health Check
```bash
# Backend health
curl http://localhost:5000/health

# Should return: {"status":"alive","message":"..."}
```

## 🚢 Deployment Checklist

Before deploying to production:

- [ ] Update JWT_SECRET to a strong random string
- [ ] Use production MongoDB (MongoDB Atlas)
- [ ] Add real Stripe API keys (not test keys)
- [ ] Set FRONTEND_URL to your domain
- [ ] Enable HTTPS
- [ ] Set up proper CORS origins
- [ ] Configure rate limiting
- [ ] Add monitoring (e.g., Sentry)
- [ ] Set up backups for MongoDB
- [ ] Review .gitignore (no secrets committed)
- [ ] Add proper error tracking

## 💡 Pro Tips

1. **Save API costs**: Use GPT-3.5-turbo instead of GPT-4 for development
2. **Quick iterations**: Test on the Gang Members page with short messages
3. **Custom AI training**: Start with small training data sets
4. **Points hack**: Complete challenges to test gamification
5. **Mock payments**: Use Stripe test cards for subscription testing

---

Need help? Check the main README.md or open an issue!

Keep it real! 💪
