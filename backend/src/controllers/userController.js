import Note from '../models/Note.js';
import Download from '../models/Download.js';
import User from '../models/User.js';

// Get user dashboard data
export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's uploaded notes
    const uploadedNotes = await Note.find({
      uploadedBy: userId,
      isDeleted: false
    })
      .populate('uploadedBy', 'username avatar')
      .sort({ createdAt: -1 });

    // Get download history
    const downloadHistory = await Download.find({ user: userId })
      .populate({
        path: 'note',
        match: { isDeleted: false },
        populate: {
          path: 'uploadedBy',
          select: 'username avatar'
        }
      })
      .sort({ downloadedAt: -1 });

    // Filter out deleted notes from download history
    const validDownloads = downloadHistory.filter(d => d.note);

    // Get bookmarked notes
    const bookmarkedNotes = await Note.find({
      _id: { $in: await Note.find({ bookmarks: userId }).distinct('_id') },
      isDeleted: false
    })
      .populate('uploadedBy', 'username avatar')
      .sort({ createdAt: -1 });

    // Calculate stats
    const stats = {
      totalUploads: uploadedNotes.length,
      totalDownloads: validDownloads.length,
      totalBookmarks: bookmarkedNotes.length,
      totalViews: uploadedNotes.reduce((sum, note) => sum + note.downloads, 0),
      averageRating: uploadedNotes.length > 0
        ? uploadedNotes.reduce((sum, note) => sum + note.averageRating, 0) / uploadedNotes.length
        : 0
    };

    res.json({
      stats,
      uploadedNotes,
      downloadHistory: validDownloads,
      bookmarkedNotes
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ message: 'Server error while fetching dashboard data' });
  }
};

// Get user's bookmarks
export const getBookmarks = async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookmarkedNotes = await Note.find({
      bookmarks: req.user.id,
      isDeleted: false
    })
      .populate('uploadedBy', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Note.countDocuments({
      bookmarks: req.user.id,
      isDeleted: false
    });

    res.json({
      notes: bookmarkedNotes,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Get bookmarks error:', error);
    res.status(500).json({ message: 'Server error while fetching bookmarks' });
  }
};

// Get leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const topUploaders = await User.find({ isBanned: false })
      .sort({ 'stats.totalDownloads': -1, 'stats.notesUploaded': -1 })
      .limit(10)
      .select('username avatar stats');

    const leaderboard = topUploaders.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      avatar: user.avatar,
      totalDownloads: user.stats.totalDownloads,
      notesUploaded: user.stats.notesUploaded,
      score: user.stats.totalDownloads + (user.stats.notesUploaded * 10)
    }));

    res.json({ leaderboard });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ message: 'Server error while fetching leaderboard' });
  }
};
