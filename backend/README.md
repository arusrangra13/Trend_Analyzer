# Trend Analyzer Backend

Backend API server for Trend Analyzer with Auth0 authentication and MongoDB database.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Update `.env` with your Auth0 credentials:
```
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_AUDIENCE=your-api-identifier
MONGODB_URI=mongodb://localhost:27017/trend-analyzer
PORT=3001
FRONTEND_URL=http://localhost:5175
```

4. Start MongoDB (make sure it's running locally)

5. Start the server:
```bash
npm start
# or for development:
npm run dev
```

## API Endpoints

### Protected Routes (require Auth0 token)

- `GET /api/users/profile` - Get user profile
- `POST /api/users/profile` - Save/update user profile
- `POST /api/users` - Create/update user after login
- `PUT /api/users/subscription` - Update user subscription

### Public Routes

- `GET /api/health` - Health check

## Database Schema

Users collection stores:
- Auth0 user ID
- Email, name, picture
- Profile data (social links, bio)
- Subscription information
- Timestamps

## Security

- Auth0 JWT validation
- Rate limiting
- CORS protection
- Helmet security headers
