import express from 'express';
import { body } from 'express-validator';
import {
  getAllNotes,
  getNoteById,
  uploadNote,
  updateNote,
  deleteNote,
  downloadNote,
  rateNote,
  toggleBookmark,
  getTrendingNotes
} from '../controllers/notesController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Validation rules
const uploadValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Description must be between 1 and 1000 characters'),
  body('subject')
    .isIn(['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Engineering', 'Medicine', 'Business', 'Economics', 'History', 'Literature', 'Psychology', 'Sociology', 'Philosophy', 'Other'])
    .withMessage('Please select a valid subject'),
  body('tags')
    .optional()
    .custom((value) => {
      if (typeof value === 'string') {
        const tags = value.split(',').map(tag => tag.trim());
        return tags.every(tag => tag.length <= 20);
      }
      return true;
    })
    .withMessage('Each tag must be 20 characters or less'),
  body('fileUrl')
    .isURL()
    .withMessage('File URL must be valid'),
  body('fileName')
    .trim()
    .notEmpty()
    .withMessage('File name is required'),
  body('fileType')
    .isIn(['pdf', 'docx', 'ppt'])
    .withMessage('File type must be pdf, docx, or ppt'),
  body('fileSize')
    .isNumeric()
    .withMessage('File size must be a number'),
  body('fileHash')
    .trim()
    .notEmpty()
    .withMessage('File hash is required')
];

const updateValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Description must be between 1 and 1000 characters'),
  body('subject')
    .optional()
    .isIn(['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Engineering', 'Medicine', 'Business', 'Economics', 'History', 'Literature', 'Psychology', 'Sociology', 'Philosophy', 'Other'])
    .withMessage('Please select a valid subject')
];

const ratingValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5')
];

// Public routes
router.get('/', getAllNotes);
router.get('/trending', getTrendingNotes);
router.get('/:id', getNoteById);

// Protected routes
router.post('/', protect, upload.single('file'), uploadValidation, uploadNote);
router.put('/:id', protect, updateValidation, updateNote);
router.delete('/:id', protect, deleteNote);
router.post('/:id/download', protect, downloadNote);
router.post('/:id/rate', protect, ratingValidation, rateNote);
router.post('/:id/bookmark', protect, toggleBookmark);

export default router;
