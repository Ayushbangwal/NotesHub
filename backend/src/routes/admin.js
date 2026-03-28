import express from 'express';
import { getStats, getAllUsers, toggleUserBan, getAllNotes, deleteNote, toggleNoteApproval } from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected and admin only
router.use(protect);
router.use(adminOnly);

// Admin dashboard routes
router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.put('/users/:id/ban', toggleUserBan);
router.get('/notes', getAllNotes);
router.delete('/notes/:id', deleteNote);
router.put('/notes/:id/approve', toggleNoteApproval);

export default router;
