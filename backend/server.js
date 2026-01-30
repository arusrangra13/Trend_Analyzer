require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { auth } = require('express-oauth2-jwt-bearer');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5175',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Auth0 middleware
const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
  tokenSigningAlg: 'RS256'
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/trend-analyzer', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  auth0Id: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  picture: { type: String },
  profileData: {
    name: {
      value: { type: String, default: '' },
      placeholder: { type: String, default: 'Enter your name' }
    },
    basicDetail: { type: String, default: '' },
    youtubeLink: { type: String, default: '' },
    instagramLink: { type: String, default: '' },
    twitterLink: { type: String, default: '' },
    otherLink: { type: String, default: '' },
    otherLinkLabel: { type: String, default: '' }
  },
  subscription: {
    plan: { type: String, default: 'free' },
    status: { type: String, default: 'active' },
    scriptsIncluded: { type: Number, default: 10 },
    scriptsRemaining: { type: Number, default: 10 },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Routes

// Get user profile
app.get('/api/users/profile', checkJwt, async (req, res) => {
  try {
    const user = await User.findOne({ auth0Id: req.auth.payload.sub });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save/update user profile
app.post('/api/users/profile', checkJwt, async (req, res) => {
  try {
    const { profileData, subscription } = req.body;
    
    const user = await User.findOneAndUpdate(
      { auth0Id: req.auth.payload.sub },
      { 
        profileData: profileData,
        subscription: subscription,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );
    
    res.json(user);
  } catch (error) {
    console.error('Error saving user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create/update user (called after login)
app.post('/api/users', checkJwt, async (req, res) => {
  try {
    const auth0User = req.auth.payload;
    
    const user = await User.findOneAndUpdate(
      { auth0Id: auth0User.sub },
      { 
        email: auth0User.email,
        name: auth0User.name || auth0User.nickname,
        picture: auth0User.picture,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );
    
    res.json(user);
  } catch (error) {
    console.error('Error creating/updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update subscription
app.put('/api/users/subscription', checkJwt, async (req, res) => {
  try {
    const { subscription } = req.body;
    
    const user = await User.findOneAndUpdate(
      { auth0Id: req.auth.payload.sub },
      { 
        subscription: subscription,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
