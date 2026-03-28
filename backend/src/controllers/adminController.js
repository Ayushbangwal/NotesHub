import User from '../models/User.js';
import Note from '../models/Note.js';
import Download from '../models/Download.js';
import Comment from '../models/Comment.js';

// Get platform statistics
export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isBanned: false });
    const totalNotes = await Note.countDocuments({ isDeleted: false });
    const totalDownloads = await Download.countDocuments();
    const totalComments = await Comment.countDocuments();

    // Get recent activity
    const recentUsers = await User.find({ isBanned: false })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('username email createdAt');

    const recentNotes = await Note.find({ isDeleted: false })
      .populate('uploadedBy', 'username')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get top subjects
    const subjectStats = await Note.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: '$subject', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      stats: {
        totalUsers,
        totalNotes,
        totalDownloads,
        totalComments
      },
      recentUsers,
      recentNotes,
      subjectStats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error while fetching statistics' });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build query
    const query = {};
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-password');

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
};

// Ban/unban user
export const toggleUserBan = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent banning admins
    if (user.role === 'admin' && req.user.role !== 'super-admin') {
      return res.status(403).json({ message: 'Cannot ban admin users' });
    }

    user.isBanned = !user.isBanned;
    await user.save();

    res.json({
      message: user.isBanned ? 'User banned successfully' : 'User unbanned successfully',
      isBanned: user.isBanned
    });
  } catch (error) {
    console.error('Toggle user ban error:', error);
    res.status(500).json({ message: 'Server error while updating user status' });
  }
};

// Get all notes for admin
export const getAllNotes = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, subject, isApproved } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build query
    const query = { isDeleted: false };
    if (search) {
      query.$text = { $search: search };
    }
    if (subject) {
      query.subject = subject;
    }
    if (isApproved !== undefined) {
      query.isApproved = isApproved === 'true';
    }

    const notes = await Note.find(query)
      .populate('uploadedBy', 'username email')
      .sort({ createdAt: -1 })
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
    console.error('Get admin notes error:', error);
    res.status(500).json({ message: 'Server error while fetching notes' });
  }
};

// Delete note (admin)
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
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

// Approve/unapprove note
export const toggleNoteApproval = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    note.isApproved = !note.isApproved;
    await note.save();

    res.json({
      message: note.isApproved ? 'Note approved successfully' : 'Note unapproved successfully',
      isApproved: note.isApproved
    });
  } catch (error) {
    console.error('Toggle note approval error:', error);
    res.status(500).json({ message: 'Server error while updating note status' });
  }
};
