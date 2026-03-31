import express from 'express';
import {
  createReport,
  getAllReports,
  updateReportStatus,
  checkUserReport
} from '../controllers/reportController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createReport);
router.get('/', protect, adminOnly, getAllReports);
router.get('/check/:noteId', protect, checkUserReport);
router.patch('/:id', protect, adminOnly, updateReportStatus);

export default router;