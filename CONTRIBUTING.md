# Contributing to Hackney Forge AI

Thanks for your interest in contributing! This project is designed to be a demonstration of a full-stack AI platform.

## Development Setup

See [QUICKSTART.md](QUICKSTART.md) for setup instructions.

## Project Architecture

### Backend Architecture
```
backend/
├── config/       # Database and configuration
├── models/       # MongoDB schemas
├── routes/       # API endpoints
├── middleware/   # Auth and validation
├── services/     # AI integrations (OpenAI, Hugging Face)
└── server.js     # Express app
```

### Frontend Architecture
```
frontend/
├── components/   # Reusable UI components
├── context/      # React context (auth, etc.)
├── pages/        # Route pages
├── services/     # API service layer
└── App.jsx       # Main app with routing
```

## Code Style

- **Backend**: Standard Node.js conventions
- **Frontend**: React functional components with hooks
- **Naming**: camelCase for variables, PascalCase for components
- **Comments**: Use JSDoc for functions, inline comments for complex logic

## Adding Features

### Adding a New AI Gang Member

1. Add to seed data in `backend/src/seed.js`:
```javascript
{
  name: 'Finsbury Park AI',
  role: 'Your Role',
  description: 'Your description',
  personality: 'Your personality',
  specialties: ['Specialty 1', 'Specialty 2'],
  systemPrompt: 'Your system prompt',
  londonArea: 'Finsbury Park'
}
```

2. Re-seed the database:
```bash
cd backend && node src/seed.js
```

### Adding a New Page

1. Create page component in `frontend/src/pages/YourPage.jsx`
2. Create styles in `frontend/src/pages/YourPage.css`
3. Add route in `frontend/src/App.jsx`:
```javascript
<Route path="/your-page" element={<YourPage />} />
```
4. Add navigation link in `frontend/src/components/Navbar.jsx`

### Adding a New API Endpoint

1. Add route in appropriate file in `backend/src/routes/`
2. Add service function if needed in `backend/src/services/`
3. Add frontend API call in `frontend/src/services/api.js`

## Testing

Currently, this project doesn't have automated tests, but you should manually test:

1. **Authentication**: Register, login, logout
2. **AI Queries**: Test with each gang member
3. **Custom AI**: Create and query custom AI
4. **Gamification**: Complete challenges, check points
5. **Subscription**: Test payment flow (use Stripe test cards)

### Stripe Test Cards
- Success: 4242 4242 4242 4242
- Decline: 4000 0000 0000 0002

## London Slang Guidelines

Keep it authentic:
- ✅ Do: Use natural London slang (bruv, innit, safe, wagwan)
- ❌ Don't: Use Cockney rhyming slang or stereotypes
- ✅ Do: Inject slang naturally and sparingly
- ❌ Don't: Overdo it - keep responses readable

Good examples:
- "That's a solid idea, innit"
- "Yeah bruv, I got you"
- "Safe, let me help with that"

## Security

- Never commit API keys or secrets
- Always validate user input
- Use JWT for authentication
- Hash passwords with bcrypt
- Sanitize MongoDB queries

## Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Update documentation if needed
6. Submit a pull request

## Questions?

Open an issue for:
- Bug reports
- Feature requests
- Documentation improvements
- General questions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
