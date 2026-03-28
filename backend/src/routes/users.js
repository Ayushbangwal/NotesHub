import express from 'express';
import { getDashboard, getBookmarks, getLeaderboard } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// User dashboard and profile routes
router.get('/dashboard', getDashboard);
router.get('/bookmarks', getBookmarks);
router.get('/leaderboard', getLeaderboard);

export default router;
