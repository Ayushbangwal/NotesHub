import Note from '../models/Note.js';
import Comment from '../models/Comment.js';
import Download from '../models/Download.js';
import User from '../models/User.js';
import { validationResult } from 'express-validator';
import { v2 as cloudinary } from 'cloudinary';
import { generateFileHash } from '../middleware/upload.js';
import { sendDownloadNotification, sendRatingNotification } from '../utils/emailService.js';

// Get all notes with search and filters
export const getAllNotes = async (req, res) => {
  try {
    const {
      search, subject, tags, fileType,
      sortBy = 'createdAt', order = 'desc',
      page = 1, limit = 12
    } = req.query;

    const query = { isDeleted: false, isApproved: true };

    if (search) query.$text = { $search: search };
    if (subject) query.subject = subject;
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }
    if (fileType) query.fileType = fileType;

    const sortOptions = {};
    const validSortFields = ['createdAt', 'downloads', 'averageRating', 'title'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    sortOptions[sortField] = order === 'asc' ? 1 : -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const notes = await Note.find(query)
      .populate('uploadedBy', 'username avatar')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

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
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { title, description, subject, tags } = req.body;

    if (!title?.trim()) return res.status(400).json({ message: 'Title is required' });
    if (!description?.trim()) return res.status(400).json({ message: 'Description is required' });

    const validSubjects = [
      'Mathematics', 'Physics', 'Chemistry', 'Biology',
      'Computer Science', 'Engineering', 'Medicine', 'Business',
      'Economics', 'History', 'Literature', 'Psychology',
      'Sociology', 'Philosophy', 'Other'
    ];
    if (!subject || !validSubjects.includes(subject)) {
      return res.status(400).json({ message: 'Please select a valid subject' });
    }

    const fileHash = generateFileHash(req.file.buffer);
    const existingNote = await Note.findOne({ fileHash, isDeleted: false });
    if (existingNote) {
      return res.status(400).json({ message: 'This file has already been uploaded' });
    }

    const fileType = req.file.originalname.split('.').pop().toLowerCase();
    const fileName = req.file.originalname;

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'noteshub', resource_type: 'raw', public_id: `${Date.now()}-${fileName}` },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    const note = new Note({
      title: title.trim(),
      description: description.trim(),
      subject,
      tags: tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
      fileUrl: uploadResult.secure_url,
      fileName,
      fileType,
      fileSize: req.file.size,
      fileHash,
      uploadedBy: req.user.id
    });

    await note.save();
    await User.findByIdAndUpdate(req.user.id, { $inc: { 'stats.notesUploaded': 1 } });
    await note.populate('uploadedBy', 'username avatar');

    res.status(201).json({ message: 'Note uploaded successfully', note });
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

    if (note.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this note' });
    }

    note.title = title || note.title;
    note.description = description || note.description;
    note.subject = subject || note.subject;
    note.tags = tags ? tags.split(',').map(tag => tag.trim()) : note.tags;

    await note.save();
    await note.populate('uploadedBy', 'username avatar');

    res.json({ message: 'Note updated successfully', note });
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

    if (note.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this note' });
    }

    note.isDeleted = true;
    await note.save();
    await User.findByIdAndUpdate(note.uploadedBy, { $inc: { 'stats.notesUploaded': -1 } });

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

    const existingDownload = await Download.findOne({
      user: req.user.id,
      note: note._id
    });

    console.log('⬇️ Download attempt — existingDownload:', !!existingDownload)

    if (!existingDownload) {
      await Download.create({ user: req.user.id, note: note._id });
      note.downloads += 1;
      await note.save();

      const owner = await User.findByIdAndUpdate(
        note.uploadedBy,
        { $inc: { 'stats.totalDownloads': 1 } },
        { new: true }
      )

      console.log('🔍 Owner:', owner?.username, '|', owner?.email)
      console.log('🔍 Downloader ID:', req.user.id)
      console.log('🔍 Owner ID:', owner?._id?.toString())
      console.log('🔍 Same person?:', owner?._id?.toString() === req.user.id)

      if (owner && owner._id.toString() !== req.user.id) {
        const downloader = await User.findById(req.user.id).select('username')
        console.log('📧 Sending email to:', owner.email)
        await sendDownloadNotification({
          ownerEmail: owner.email,
          ownerName: owner.username,
          noteTitle: note.title,
          downloaderName: downloader?.username || 'Someone'
        })
      } else {
        console.log('⚠️ Email skip — same user ya owner null')
      }
    } else {
      console.log('⏭️ Already downloaded before — email skip')
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

    const isNewRating = !note.ratings.find(r => r.user.toString() === req.user.id)
    console.log('⭐ Rate attempt — isNewRating:', isNewRating)

    const existingRatingIndex = note.ratings.findIndex(
      r => r.user.toString() === req.user.id
    );

    if (existingRatingIndex !== -1) {
      note.ratings[existingRatingIndex].rating = rating;
    } else {
      note.ratings.push({ user: req.user.id, rating });
    }

    await note.save();

    if (isNewRating && note.uploadedBy.toString() !== req.user.id) {
      const owner = await User.findById(note.uploadedBy).select('username email')
      const rater = await User.findById(req.user.id).select('username')

      console.log('🔍 Rating owner:', owner?.username, '|', owner?.email)

      if (owner) {
        console.log('📧 Sending rating email to:', owner.email)
        await sendRatingNotification({
          ownerEmail: owner.email,
          ownerName: owner.username,
          noteTitle: note.title,
          raterName: rater?.username || 'Someone',
          rating
        })
      }
    } else {
      console.log('⚠️ Rating email skip — same user ya existing rating')
    }

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
      note.bookmarks = note.bookmarks.filter(id => id.toString() !== userId);
    } else {
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
