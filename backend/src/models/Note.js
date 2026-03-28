import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  }
}, { _id: false });

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    enum: [
      'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
      'Engineering', 'Medicine', 'Business', 'Economics', 'History',
      'Literature', 'Psychology', 'Sociology', 'Philosophy', 'Other'
    ]
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [20, 'Tag cannot exceed 20 characters']
  }],
  fileUrl: {
    type: String,
    required: [true, 'File URL is required']
  },
  fileName: {
    type: String,
    required: [true, 'File name is required']
  },
  fileType: {
    type: String,
    required: true,
    enum: ['pdf', 'docx', 'ppt']
  },
  fileSize: {
    type: Number,
    required: true
  },
  fileHash: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  downloads: {
    type: Number,
    default: 0
  },
  ratings: [ratingSchema],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isApproved: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for better performance
noteSchema.index({ title: 'text', description: 'text', tags: 'text' });
noteSchema.index({ subject: 1, createdAt: -1 });
noteSchema.index({ uploadedBy: 1, createdAt: -1 });
noteSchema.index({ averageRating: -1 });
noteSchema.index({ downloads: -1 });
noteSchema.index({ fileHash: 1 });

// Pre-save middleware to calculate average rating
noteSchema.pre('save', function(next) {
  if (this.ratings.length > 0) {
    this.averageRating = this.ratings.reduce((sum, r) => sum + r.rating, 0) / this.ratings.length;
  } else {
    this.averageRating = 0;
  }
  next();
});

// Method to check if user has rated this note
noteSchema.methods.hasUserRated = function(userId) {
  return this.ratings.some(rating => rating.user.toString() === userId.toString());
};

// Method to check if user has bookmarked this note
noteSchema.methods.isBookmarkedBy = function(userId) {
  return this.bookmarks.some(bookmark => bookmark.toString() === userId.toString());
};

export default mongoose.model('Note', noteSchema);
