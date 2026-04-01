import Report from '../models/Report.js';
import Note from '../models/Note.js';
import User from '../models/User.js';
import { sendReportNotification } from '../utils/emailService.js';

// POST /api/reports
export const createReport = async (req, res) => {
  try {
    const { noteId, reason, description } = req.body;
    const reportedBy = req.user._id;

    const note = await Note.findById(noteId).populate('uploadedBy', 'username email');
    if (!note) return res.status(404).json({ message: 'Note not found' });

    if (note.uploadedBy._id.toString() === reportedBy.toString()) {
      return res.status(400).json({ message: 'You cannot report your own note' });
    }

    const existing = await Report.findOne({ note: noteId, reportedBy });
    if (existing) {
      return res.status(400).json({ message: 'You have already reported this note' });
    }

    const report = await Report.create({ note: noteId, reportedBy, reason, description });

    // ✅ Admin ko email bhejo
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER
    const reporterName = req.user.username || req.user.email

    // Email async chalao — response hold mat karo
    sendReportNotification({
      adminEmail,
      reporterName,
      noteTitle: note.title,
      noteId: note._id,
      reason,
      description: description || ''
    }).catch(err => console.error('Report email error:', err))

    res.status(201).json({ message: 'Note reported successfully', report });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/reports — admin only
export const getAllReports = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = status ? { status } : {};

    const reports = await Report.find(filter)
      .populate('note', 'title subject fileType')
      .populate('reportedBy', 'username email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Report.countDocuments(filter);
    res.json({ reports, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PATCH /api/reports/:id — admin only
export const updateReportStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status, adminNote },
      { new: true }
    );

    if (!report) return res.status(404).json({ message: 'Report not found' });

    if (status === 'resolved') {
      await Note.findByIdAndUpdate(report.note, { isHidden: true });
    }

    res.json({ message: 'Report updated', report });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/reports/check/:noteId
export const checkUserReport = async (req, res) => {
  try {
    const existing = await Report.findOne({
      note: req.params.noteId,
      reportedBy: req.user._id
    });
    res.json({ hasReported: !!existing });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};