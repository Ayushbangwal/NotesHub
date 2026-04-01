import User from '../models/User.js';
import Note from '../models/Note.js';
import Download from '../models/Download.js';
import Comment from '../models/Comment.js';
import Announcement from '../models/Announcement.js';

// Get platform statistics
export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isBanned: false });
    const totalNotes = await Note.countDocuments({ isDeleted: false });
    const totalDownloads = await Download.countDocuments();
    const totalComments = await Comment.countDocuments();

    const recentUsers = await User.find({ isBanned: false })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('username email createdAt role');

    const recentNotes = await Note.find({ isDeleted: false })
      .populate('uploadedBy', 'username')
      .sort({ createdAt: -1 })
      .limit(5);

    const subjectStats = await Note.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: '$subject', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({ stats: { totalUsers, totalNotes, totalDownloads, totalComments }, recentUsers, recentNotes, subjectStats });
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching statistics' });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const query = {};
    if (search) query.$or = [{ username: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
    if (role) query.role = role;

    const users = await User.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).select('-password');
    const total = await User.countDocuments(query);

    res.json({ users, pagination: { current: parseInt(page), pages: Math.ceil(total / parseInt(limit)), total } });
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching users' });
  }
};

// Ban/unban user
export const toggleUserBan = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ message: 'Cannot ban admin users' });

    user.isBanned = !user.isBanned;
    await user.save();

    res.json({ message: user.isBanned ? 'User banned successfully' : 'User unbanned successfully', isBanned: user.isBanned });
  } catch (error) {
    res.status(500).json({ message: 'Server error while updating user status' });
  }
};

// Get all notes for admin
export const getAllNotes = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, subject, isApproved } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const query = { isDeleted: false };
    if (search) query.$text = { $search: search };
    if (subject) query.subject = subject;
    if (isApproved !== undefined) query.isApproved = isApproved === 'true';

    const notes = await Note.find(query).populate('uploadedBy', 'username email').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
    const total = await Note.countDocuments(query);

    res.json({ notes, pagination: { current: parseInt(page), pages: Math.ceil(total / parseInt(limit)), total } });
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching notes' });
  }
};

// Delete note
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    note.isDeleted = true;
    await note.save();
    await User.findByIdAndUpdate(note.uploadedBy, { $inc: { 'stats.notesUploaded': -1 } });

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting note' });
  }
};

// Approve/unapprove note
export const toggleNoteApproval = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    note.isApproved = !note.isApproved;
    await note.save();

    res.json({ message: note.isApproved ? 'Note approved' : 'Note unapproved', isApproved: note.isApproved });
  } catch (error) {
    res.status(500).json({ message: 'Server error while updating note status' });
  }
};

// ✅ NEW — Bulk Actions on Notes
export const bulkNoteAction = async (req, res) => {
  try {
    const { noteIds, action } = req.body;

    if (!noteIds || !Array.isArray(noteIds) || noteIds.length === 0) {
      return res.status(400).json({ message: 'noteIds array is required' });
    }

    if (!['approve', 'unapprove', 'delete'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action. Use: approve, unapprove, delete' });
    }

    let updateQuery = {};
    if (action === 'approve') updateQuery = { isApproved: true };
    else if (action === 'unapprove') updateQuery = { isApproved: false };
    else if (action === 'delete') updateQuery = { isDeleted: true };

    const result = await Note.updateMany({ _id: { $in: noteIds } }, updateQuery);

    res.json({
      message: `Bulk ${action} successful`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during bulk action' });
  }
};

// ✅ NEW — Create Announcement
export const createAnnouncement = async (req, res) => {
  try {
    const { title, message, type, expiresAt } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: 'Title and message are required' });
    }

    const announcement = await Announcement.create({
      title,
      message,
      type: type || 'info',
      expiresAt: expiresAt || null,
      createdBy: req.user._id
    });

    res.status(201).json({ message: 'Announcement created', announcement });
  } catch (error) {
    res.status(500).json({ message: 'Server error while creating announcement' });
  }
};

// ✅ NEW — Get All Announcements (admin)
export const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });

    res.json({ announcements });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ NEW — Get Active Announcements (public — website pe dikhane ke liye)
export const getActiveAnnouncements = async (req, res) => {
  try {
    const now = new Date();
    const announcements = await Announcement.find({
      isActive: true,
      $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }]
    }).sort({ createdAt: -1 });

    res.json({ announcements });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ NEW — Toggle Announcement Active/Inactive
export const toggleAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).json({ message: 'Announcement not found' });

    announcement.isActive = !announcement.isActive;
    await announcement.save();

    res.json({ message: `Announcement ${announcement.isActive ? 'activated' : 'deactivated'}`, isActive: announcement.isActive });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ NEW — Delete Announcement
export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) return res.status(404).json({ message: 'Announcement not found' });

    res.json({ message: 'Announcement deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};