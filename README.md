# 🔥 Hackney Forge AI

> London's realest AI platform. No filters, no BS, just pure AI power with proper vibes.

Hackney Forge AI is a modern, full-stack AI platform featuring specialized AI gang members from different parts of Hackney, custom AI model creation, gamification, and subscription-based access. Built with React, Node.js, Express, MongoDB, OpenAI, and Hugging Face.

## ✨ Features

### AI Gang Members
- **👑 Hackney Boss AI** - THE BOSS. Chief Overseer for strategic guidance and quality control
- **Dalston AI** - Creative Director for writing, branding, and innovative ideas
- **Clapton AI** - Music Producer & Audio Specialist for beats, lyrics, and sound
- **Shoreditch AI** - Tech Developer for coding and digital solutions
- **Stoke Newington AI** - Business Strategist for entrepreneurship and growth
- **Hackney Wick AI** - Lifestyle Coach for personal development and wellness
- **Homerton AI** - Street Wisdom & Life Experience for real talk
- **Mare Street AI** - Education & Learning Specialist for study help
- **Victoria Park AI** - Culture & Entertainment Expert for the London scene
- **London Fields AI** - Food & Culinary Specialist for cooking and recipes
- **Hackney Central AI** - General Knowledge & All-Rounder for anything
- **De Beauvoir AI** - Writing & Communication Expert for professional writing

### Core Features
- 🤖 **Chat with AI Gang Members** - Each with unique personalities and specialties
- 🎨 **Custom AI Creation** - Build and train your own AI models with custom data
- 🎮 **Gamification System** - Earn gang points, complete challenges, level up
- 💰 **Flexible Pricing** - Free trial (3 queries), monthly sub (£5), or pay-per-query (£0.50)
- 🗣️ **London Slang** - Authentic London vibes without Cockney stereotypes
- 🔓 **Uncensored Responses** - Real talk, direct answers

## 🚀 Tech Stack

### Frontend
- React 18
- Vite
- React Router
- Axios
- CSS3 with custom design system

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT Authentication
- Stripe for payments

### AI Integration
- OpenAI API (GPT-3.5-turbo, GPT-4)
- Hugging Face Inference API
- Custom London slang injection system

## 📦 Installation

### Quick Start (5 Minutes) ⚡

See [QUICKSTART.md](QUICKSTART.md) for the fastest way to get started!

### Prerequisites
- Node.js 18+ 
- Free OpenAI account ([get free credits!](https://platform.openai.com/signup))
- MongoDB (local or free Atlas account) - optional for initial testing
- Stripe API keys - optional (for payment features)

### 1. Clone the Repository
```bash
git clone https://github.com/dansfootytipsukofficial-tech/Hackney-Forge-AI.git
cd Hackney-Forge-AI
```

### 2. Install Dependencies
```bash
# Install all dependencies at once
npm install
```

### 3. Configure Your OpenAI API Key 🔑

**Get your API key:**
1. Visit [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign in or create a FREE account (new accounts get free credits!)
3. Click "Create new secret key" and copy it (starts with `sk-`)

**Add it to the project:**
```bash
cd backend
node setup-api-keys.js  # This will guide you through configuration
```

Or manually edit `backend/.env`:
```env
OPENAI_API_KEY=sk-your-actual-key-here
```

### 4. Validate Your Setup ✅

```bash
cd backend
npm run validate
```

You should see: `✓ All required API keys are configured!`

### 5. Seed the Database (Optional)

Only needed if you want pre-populated AI gang members:
```bash
cd backend
node src/seed.js
cd ..
```

This will populate the database with:
- 11 AI gang members from different Hackney areas, each with unique specialties
- Hackney Boss AI as the chief overseer
- Initial challenges for gamification

### 6. Run the Application

**Start both frontend and backend:**
```bash
# From root directory - runs both frontend and backend
npm run dev
```

**Or run separately:**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

🎉 **You're ready! Open http://localhost:5173 and start chatting!**

---

## 💰 API Costs & Free Tier

**OpenAI Pricing:**
- New accounts get **$5 in free credits** (usually lasts 3-6 months)
- **gpt-3.5-turbo**: ~$0.002 per 1000 tokens (very affordable!)
- **gpt-4**: ~$0.03 per 1000 tokens (more powerful but pricier)

The platform defaults to **gpt-3.5-turbo** to keep costs low. One typical chat message uses ~500 tokens (~$0.001).

**Example costs:**
- 1000 messages with gpt-3.5-turbo ≈ $1-2
- Your free $5 credits = thousands of messages!

---

## 🏗️ Project Structure

```
hackney-forge-ai/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # MongoDB connection
│   │   ├── models/
│   │   │   ├── User.js              # User schema with subscription info
│   │   │   ├── AIGangMember.js      # AI gang member definitions
│   │   │   ├── CustomAI.js          # Custom AI models
│   │   │   ├── Transaction.js       # Payment transactions
│   │   │   └── Challenge.js         # Gamification challenges
│   │   ├── routes/
│   │   │   ├── auth.js              # Authentication endpoints
│   │   │   ├── ai.js                # AI query endpoints
│   │   │   ├── user.js              # User profile endpoints
│   │   │   ├── subscription.js      # Payment/subscription endpoints
│   │   │   └── gamification.js      # Challenges/points endpoints
│   │   ├── middleware/
│   │   │   └── auth.js              # JWT auth & query limit middleware
│   │   ├── services/
│   │   │   ├── openaiService.js     # OpenAI integration
│   │   │   └── huggingfaceService.js # Hugging Face integration
│   │   ├── server.js                # Express app setup
│   │   └── seed.js                  # Database seeding script
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx           # Navigation component
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Authentication context
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Landing page
│   │   │   ├── Login.jsx            # Login page
│   │   │   ├── Register.jsx         # Registration page
│   │   │   ├── Dashboard.jsx        # User dashboard
│   │   │   ├── GangMembers.jsx      # AI chat interface
│   │   │   ├── CustomAI.jsx         # Custom AI creation
│   │   │   ├── Subscription.jsx     # Subscription management
│   │   │   └── Gamification.jsx     # Challenges & leaderboard
│   │   ├── services/
│   │   │   └── api.js               # API service layer
│   │   ├── App.jsx                  # Main app component
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── vercel.json                       # Vercel deployment config
├── netlify.toml                      # Netlify deployment config
├── package.json                      # Root package.json
└── README.md
```

## 🎯 Usage

### 1. Create an Account
- Visit the homepage and click "Sign Up"
- Get 3 free queries to try the platform

### 2. Chat with AI Gang Members
- Navigate to "AI Gang" page
- Select a gang member based on your needs
- Start chatting - responses include London slang and are uncensored

### 3. Create Custom AI
- Go to "Custom AI" page
- Fill in your AI details and training data
- Use your custom AI for specialized tasks

### 4. Complete Challenges
- Visit "Challenges" page
- Complete challenges to earn gang points
- Level up every 100 points

### 5. Upgrade Subscription
- When free queries run out, visit "Subscription" page
- Choose monthly unlimited (£5/month) or pay-per-query (£0.50)

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login

### AI Queries
- `GET /api/ai/gang-members` - List all AI gang members
- `POST /api/ai/query/:gangMemberId` - Query specific gang member
- `POST /api/ai/boss-query` - Query Hackney Boss AI
- `POST /api/ai/custom-ai` - Create custom AI
- `GET /api/ai/custom-ai` - Get user's custom AIs
- `POST /api/ai/custom-ai/:customAIId/query` - Query custom AI

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `GET /api/user/stats` - Get user statistics

### Subscription
- `GET /api/subscription/status` - Get subscription status
- `POST /api/subscription/subscribe/monthly` - Subscribe monthly
- `POST /api/subscription/pay-per-query` - Buy single query
- `POST /api/subscription/cancel` - Cancel subscription

### Gamification
- `GET /api/gamification/challenges` - Get challenges
- `POST /api/gamification/challenges/:id/complete` - Complete challenge
- `GET /api/gamification/leaderboard` - Get leaderboard

## 🚢 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Netlify
1. Push code to GitHub
2. Import project in Netlify
3. Add environment variables
4. Deploy

### Manual Deployment
```bash
# Build frontend
cd frontend
npm run build

# Start backend in production
cd ../backend
NODE_ENV=production npm start
```

## 💳 Payment Integration

The platform uses Stripe for payment processing:
- Monthly subscriptions are handled via Stripe Subscriptions
- Pay-per-query uses Stripe Payment Intents
- Webhooks handle subscription lifecycle events

## 🎨 Design Philosophy

- **London Vibes**: Authentic London slang without Cockney stereotypes
- **Uncensored**: Direct, real responses without corporate filtering
- **Dark Theme**: Modern dark UI with accent colors
- **Mobile-First**: Responsive design for all devices

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Environment variable protection
- Input validation and sanitization

## 📝 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

This is a demonstration project. For production use, ensure:
- Proper error handling
- Rate limiting
- API key rotation
- Database backups
- Monitoring and logging
- GDPR compliance
- Terms of service

## 📧 Support

For questions or issues, open a GitHub issue or contact the development team.

---

Built with 💪 in Hackney, London. Keep it real, innit.
