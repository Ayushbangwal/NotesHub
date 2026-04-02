import express from 'express';
import {
  getStats, getAllUsers, toggleUserBan, getAllNotes,
  deleteNote, toggleNoteApproval, bulkNoteAction,
  createAnnouncement, getAllAnnouncements, getActiveAnnouncements,
  toggleAnnouncement, deleteAnnouncement
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Stats
router.get('/stats', protect, adminOnly, getStats);

// Users
router.get('/users', protect, adminOnly, getAllUsers);
router.patch('/users/:id/ban', protect, adminOnly, toggleUserBan);

// Notes
router.get('/notes', protect, adminOnly, getAllNotes);
router.delete('/notes/:id', protect, adminOnly, deleteNote);
router.patch('/notes/:id/approve', protect, adminOnly, toggleNoteApproval);
router.post('/notes/bulk', protect, adminOnly, bulkNoteAction);

// ✅ Announcements — active PEHLE aana chahiye :id se
router.get('/announcements/active', getActiveAnnouncements);  // ✅ PEHLE
router.get('/announcements', protect, adminOnly, getAllAnnouncements);
router.post('/announcements', protect, adminOnly, createAnnouncement);
router.patch('/announcements/:id/toggle', protect, adminOnly, toggleAnnouncement);
router.delete('/announcements/:id', protect, adminOnly, deleteAnnouncement);

export default router;