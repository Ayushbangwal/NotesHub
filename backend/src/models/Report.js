import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  note: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note',
    required: true
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reason: {
    type: String,
    enum: [
      'spam',
      'inappropriate_content',
      'copyright_violation',
      'misinformation',
      'harassment',
      'other'
    ],
    required: true
  },
  description: {
    type: String,
    maxlength: 500,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
    default: 'pending'
  },
  adminNote: {
    type: String,
    default: ''
  }
}, { timestamps: true });

reportSchema.index({ note: 1, reportedBy: 1 }, { unique: true });

export default mongoose.model('Report', reportSchema);