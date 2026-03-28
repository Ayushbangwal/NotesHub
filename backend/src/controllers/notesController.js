import Note from '../models/Note.js';
import Comment from '../models/Comment.js';
import Download from '../models/Download.js';
import User from '../models/User.js';
import { validationResult } from 'express-validator';

// Get all notes with search and filters
export const getAllNotes = async (req, res) => {
  try {
    const {
      search,
      subject,
      tags,
      fileType,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 12
    } = req.query;

    // Build query
    const query = {
      isDeleted: false,
      isApproved: true
    };

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by subject
    if (subject) {
      query.subject = subject;
    }

    // Filter by tags
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }

    // Filter by file type
    if (fileType) {
      query.fileType = fileType;
    }

    // Sort options
    const sortOptions = {};
    const validSortFields = ['createdAt', 'downloads', 'averageRating', 'title'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    sortOptions[sortField] = order === 'asc' ? 1 : -1;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const notes = await Note.find(query)
      .populate('uploadedBy', 'username avatar')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Note.countDocuments(query);

    res.json({
      notes,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ message: 'Server error while fetching notes' });
  }
};

// Get single note by ID
export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
      .populate('uploadedBy', 'username avatar')
      .populate('ratings.user', 'username')
      .populate('bookmarks', 'username');

    if (!note || note.isDeleted) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ note });
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ message: 'Server error while fetching note' });
  }
};

// Upload new note
export const uploadNote = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, subject, tags, fileUrl, fileName, fileType, fileSize, fileHash } = req.body;

    // Check for duplicate file
    const existingNote = await Note.findOne({ fileHash, isDeleted: false });
    if (existingNote) {
      return res.status(400).json({ message: 'This file has already been uploaded' });
    }

    // Create new note
    const note = new Note({
      title,
      description,
      subject,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      fileUrl,
      fileName,
      fileType,
      fileSize,
      fileHash,
      uploadedBy: req.user.id
    });

    await note.save();

    // Update user stats
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { 'stats.notesUploaded': 1 }
    });

    // Populate user info
    await note.populate('uploadedBy', 'username avatar');

    res.status(201).json({
      message: 'Note uploaded successfully',
      note
    });
  } catch (error) {
    console.error('Upload note error:', error);
    res.status(500).json({ message: 'Server error while uploading note' });
  }
};

// Update note
export const updateNote = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, subject, tags } = req.body;

    const note = await Note.findById(req.params.id);
    if (!note || note.isDeleted) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Check ownership
    if (note.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this note' });
    }

    // Update fields
    note.title = title || note.title;
    note.description = description || note.description;
    note.subject = subject || note.subject;
    note.tags = tags ? tags.split(',').map(tag => tag.trim()) : note.tags;

    await note.save();
    await note.populate('uploadedBy', 'username avatar');

    res.json({
      message: 'Note updated successfully',
      note
    });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ message: 'Server error while updating note' });
  }
};

// Delete note
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Check ownership
    if (note.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this note' });
    }

    // Soft delete
    note.isDeleted = true;
    await note.save();

    // Update user stats
    await User.findByIdAndUpdate(note.uploadedBy, {
      $inc: { 'stats.notesUploaded': -1 }
    });

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ message: 'Server error while deleting note' });
  }
};

// Download note
export const downloadNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note || note.isDeleted) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Check if already downloaded
    const existingDownload = await Download.findOne({
      user: req.user.id,
      note: note._id
    });

    if (!existingDownload) {
      // Create download record
      await Download.create({
        user: req.user.id,
        note: note._id
      });

      // Update download count
      note.downloads += 1;
      await note.save();

      // Update uploader stats
      await User.findByIdAndUpdate(note.uploadedBy, {
        $inc: { 'stats.totalDownloads': 1 }
      });
    }

    res.json({
      message: 'Download recorded successfully',
      fileUrl: note.fileUrl,
      fileName: note.fileName
    });
  } catch (error) {
    console.error('Download note error:', error);
    res.status(500).json({ message: 'Server error while downloading note' });
  }
};

// Rate note
export const rateNote = async (req, res) => {
  try {
    const { rating } = req.body;
    const noteId = req.params.id;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const note = await Note.findById(noteId);
    if (!note || note.isDeleted) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Check if user already rated
    const existingRatingIndex = note.ratings.findIndex(
      r => r.user.toString() === req.user.id
    );

    if (existingRatingIndex !== -1) {
      // Update existing rating
      note.ratings[existingRatingIndex].rating = rating;
    } else {
      // Add new rating
      note.ratings.push({ user: req.user.id, rating });
    }

    await note.save();

    res.json({
      message: 'Rating submitted successfully',
      averageRating: note.averageRating
    });
  } catch (error) {
    console.error('Rate note error:', error);
    res.status(500).json({ message: 'Server error while rating note' });
  }
};

// Bookmark/Unbookmark note
export const toggleBookmark = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note || note.isDeleted) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const userId = req.user.id;
    const isBookmarked = note.bookmarks.includes(userId);

    if (isBookmarked) {
      // Remove bookmark
      note.bookmarks = note.bookmarks.filter(id => id.toString() !== userId);
    } else {
      // Add bookmark
      note.bookmarks.push(userId);
    }

    await note.save();

    res.json({
      message: isBookmarked ? 'Bookmark removed' : 'Bookmark added',
      isBookmarked: !isBookmarked
    });
  } catch (error) {
    console.error('Toggle bookmark error:', error);
    res.status(500).json({ message: 'Server error while toggling bookmark' });
  }
};

// Get trending notes
export const getTrendingNotes = async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const trendingNotes = await Note.find({
      isDeleted: false,
      isApproved: true,
      createdAt: { $gte: oneWeekAgo }
    })
      .populate('uploadedBy', 'username avatar')
      .sort({ downloads: -1, averageRating: -1 })
      .limit(10);

    res.json({ notes: trendingNotes });
  } catch (error) {
    console.error('Get trending notes error:', error);
    res.status(500).json({ message: 'Server error while fetching trending notes' });
  }
};
