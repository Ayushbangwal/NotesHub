import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import authRoutes from './src/routes/auth.js';
import notesRoutes from './src/routes/notes.js';
import usersRoutes from './src/routes/users.js';
import adminRoutes from './src/routes/admin.js';
import reportRoutes from './src/routes/reports.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://notes-hub-eta.vercel.app',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(helmet());
app.use(limiter);

// ✅ FIX 1: Health check CORS se PEHLE rakho
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'NotesHub API is running',
    timestamp: new Date().toISOString()
  });
});

// ✅ FIX 2: HEAD /health bhi handle karo UptimeRobot ke liye
app.head('/health', (req, res) => {
  res.status(200).end();
});

// ✅ FIX 3: CORS mein null origin aur unknown origins handle karo gracefully
app.use(cors({
  origin: function (origin, callback) {
    // No origin = curl, mobile apps, UptimeRobot, Render health checks
    if (!origin) return callback(null, true);
    
    // Allowed origins check
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // ✅ Render internal health check origins allow karo
    if (origin.includes('onrender.com') || origin.includes('uptimerobot.com')) {
      return callback(null, true);
    }

    // Baaki sab block
    console.warn(`CORS blocked origin: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reports', reportRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Connect to MongoDB
// connet to MongoDb
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/noteshub')
.then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});