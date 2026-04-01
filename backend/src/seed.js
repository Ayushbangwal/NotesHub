import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Note from './models/Note.js';
import dotenv from 'dotenv';

dotenv.config();

// Sample data
const sampleUsers = [
  {
    username: 'admin',
    email: 'ayushbangwal0@gmail.com',
    password: 'handsome$123',
    role: 'admin',
    isEmailVerified: true,
    avatar: 'https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff'
  }
];

const sampleNotes = [
  {
    title: 'Introduction to Calculus',
    description: 'Comprehensive notes on differential and integral calculus with examples and practice problems.',
    subject: 'Mathematics',
    tags: ['calculus', 'derivatives', 'integrals', 'mathematics'],
    fileName: 'calculus-introduction.pdf',
    fileType: 'pdf',
    fileSize: 2048576,
    fileUrl: 'https://res.cloudinary.com/demo/image/upload/v1234567/calculus-introduction.pdf',
    fileHash: 'abc123def456'
  },
  {
    title: 'Physics Mechanics Fundamentals',
    description: 'Basic concepts of mechanics including Newton\'s laws, motion, and energy.',
    subject: 'Physics',
    tags: ['mechanics', 'newton', 'motion', 'physics'],
    fileName: 'physics-mechanics.docx',
    fileType: 'docx',
    fileSize: 1536000,
    fileUrl: 'https://res.cloudinary.com/demo/image/upload/v1234567/physics-mechanics.docx',
    fileHash: 'def456ghi789'
  },
  {
    title: 'Organic Chemistry Reactions',
    description: 'Common organic chemistry reactions with mechanisms and examples.',
    subject: 'Chemistry',
    tags: ['organic', 'reactions', 'mechanisms', 'chemistry'],
    fileName: 'organic-reactions.pdf',
    fileType: 'pdf',
    fileSize: 3072000,
    fileUrl: 'https://res.cloudinary.com/demo/image/upload/v1234567/organic-reactions.pdf',
    fileHash: 'ghi789jkl012'
  },
  {
    title: 'Cell Biology Overview',
    description: 'Introduction to cell structure, organelles, and cellular processes.',
    subject: 'Biology',
    tags: ['cells', 'organelles', 'biology', 'life'],
    fileName: 'cell-biology.ppt',
    fileType: 'ppt',
    fileSize: 4096000,
    fileUrl: 'https://res.cloudinary.com/demo/image/upload/v1234567/cell-biology.ppt',
    fileHash: 'jkl012mno345'
  },
  {
    title: 'Data Structures and Algorithms',
    description: 'Essential data structures and algorithms for computer science students.',
    subject: 'Computer Science',
    tags: ['data-structures', 'algorithms', 'programming', 'cs'],
    fileName: 'data-structures.pdf',
    fileType: 'pdf',
    fileSize: 2560000,
    fileUrl: 'https://res.cloudinary.com/demo/image/upload/v1234567/data-structures.pdf',
    fileHash: 'mno345pqr678'
  },
  {
    title: 'Engineering Mathematics',
    description: 'Advanced mathematical concepts for engineering students.',
    subject: 'Engineering',
    tags: ['engineering', 'mathematics', 'advanced', 'calculus'],
    fileName: 'engineering-math.docx',
    fileType: 'docx',
    fileSize: 1792000,
    fileUrl: 'https://res.cloudinary.com/demo/image/upload/v1234567/engineering-math.docx',
    fileHash: 'pqr678stu901'
  },
  {
    title: 'Human Anatomy Basics',
    description: 'Introduction to human anatomy and major body systems.',
    subject: 'Medicine',
    tags: ['anatomy', 'human-body', 'medicine', 'health'],
    fileName: 'human-anatomy.pdf',
    fileType: 'pdf',
    fileSize: 5120000,
    fileUrl: 'https://res.cloudinary.com/demo/image/upload/v1234567/human-anatomy.pdf',
    fileHash: 'stu901vwx234'
  },
  {
    title: 'Business Economics Principles',
    description: 'Fundamental principles of economics for business students.',
    subject: 'Business',
    tags: ['economics', 'business', 'principles', 'finance'],
    fileName: 'business-economics.ppt',
    fileType: 'ppt',
    fileSize: 3584000,
    fileUrl: 'https://res.cloudinary.com/demo/image/upload/v1234567/business-economics.ppt',
    fileHash: 'vwx234yz a567'
  },
  {
    title: 'World War II History',
    description: 'Comprehensive overview of World War II events and consequences.',
    subject: 'History',
    tags: ['history', 'war', 'world-war-2', 'events'],
    fileName: 'ww2-history.docx',
    fileType: 'docx',
    fileSize: 2048000,
    fileUrl: 'https://res.cloudinary.com/demo/image/upload/v1234567/ww2-history.docx',
    fileHash: 'yza567bcd890'
  },
  {
    title: 'Shakespearean Literature',
    description: 'Analysis of major works by William Shakespeare.',
    subject: 'Literature',
    tags: ['shakespeare', 'literature', 'analysis', 'classics'],
    fileName: 'shakespeare-works.pdf',
    fileType: 'pdf',
    fileSize: 2816000,
    fileUrl: 'https://res.cloudinary.com/demo/image/upload/v1234567/shakespeare-works.pdf',
    fileHash: 'bcd890efg123'
  }
];

// Seed database
const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/noteshub');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Note.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
    }
    console.log('Created sample users');

    // Create notes with random users
    const createdNotes = [];
    for (let i = 0; i < sampleNotes.length; i++) {
      const noteData = sampleNotes[i];
      const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      
      const note = new Note({
        ...noteData,
        uploadedBy: randomUser._id,
        downloads: Math.floor(Math.random() * 100),
        ratings: []
      });

      await note.save();
      createdNotes.push(note);

      // Update user stats
      await User.findByIdAndUpdate(randomUser._id, {
        $inc: { 
          'stats.notesUploaded': 1,
          'stats.totalDownloads': note.downloads
        }
      });
    }
    console.log('Created sample notes');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed function
seedDatabase();
