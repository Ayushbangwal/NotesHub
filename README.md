# NotesHub - Online Notes Sharing Platform

A comprehensive web application for students to share, discover, and collaborate on educational notes. Built with modern technologies and best practices.

## 🚀 Features

### Core Features
- **🔐 Authentication System** - JWT-based signup/login with role management (user/admin)
- **📚 Notes Management** - Upload, view, edit, and delete notes with file support (PDF, DOCX, PPT)
- **🔍 Advanced Search & Filters** - Search by title, subject, tags with real-time filtering
- **⭐ Rating System** - 5-star rating with average calculations
- **📌 Bookmarks** - Save favorite notes for quick access
- **💬 Comments** - Engage with the community through comments
- **📊 Dashboard** - Personal dashboard with statistics and activity tracking
- **🛡️ Admin Panel** - Complete admin control over users and content

### Advanced Features
- **📈 Trending Notes** - Discover popular content based on downloads and ratings
- **🏆 Leaderboard** - Top contributors and most active users
- **📱 Responsive Design** - Mobile-first approach with beautiful UI
- **🌙 Dark Mode** - Default dark theme with light mode toggle
- **🎨 Modern UI** - Beautiful animations and micro-interactions
- **📥 Download Tracking** - Monitor download history and statistics

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **Axios** - HTTP client
- **React Query** - Server state management
- **Zustand** - Client state management
- **React Hot Toast** - Beautiful notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Cloudinary** - Cloud file storage
- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
noteshub/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   └── utils/          # Utility functions
│   ├── server.js           # Entry point
│   └── package.json
│
└── frontend/               # React + Vite app
    ├── src/
    │   ├── components/     # Reusable components
    │   │   ├── ui/        # Base UI components
    │   │   ├── auth/      # Authentication components
    │   │   ├── notes/     # Note-related components
    │   │   └── layout/    # Layout components
    │   ├── pages/          # Page components
    │   ├── hooks/          # Custom React hooks
    │   ├── services/       # API services
    │   ├── store/          # State management
    │   ├── utils/          # Helper functions
    │   └── contexts/       # React contexts
    ├── index.html
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Cloudinary account (for file storage)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd noteshub
```

2. **Backend Setup**
```bash
cd backend
npm install
```

3. **Environment Variables**
Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/noteshub
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
PORT=5000
CLIENT_URL=http://localhost:5173
```

4. **Database Setup**
- Start MongoDB locally or use MongoDB Atlas
- Run the seed script to populate sample data:
```bash
npm run seed
```

5. **Start Backend Server**
```bash
npm run dev
```

6. **Frontend Setup**
```bash
cd ../frontend
npm install
```

7. **Environment Variables for Frontend**
Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
```

8. **Start Frontend Development Server**
```bash
npm run dev
```

9. **Access the Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/health

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Notes Endpoints
- `GET /api/notes` - Get all notes (with search/filters)
- `GET /api/notes/:id` - Get single note
- `POST /api/notes` - Upload new note (auth required)
- `PUT /api/notes/:id` - Update note (auth, owner only)
- `DELETE /api/notes/:id` - Delete note (auth, owner or admin)
- `POST /api/notes/:id/download` - Download note
- `POST /api/notes/:id/rate` - Rate note
- `POST /api/notes/:id/bookmark` - Toggle bookmark
- `GET /api/notes/trending` - Get trending notes

### User Endpoints
- `GET /api/users/dashboard` - Get user dashboard data
- `GET /api/users/bookmarks` - Get user bookmarks
- `GET /api/users/leaderboard` - Get leaderboard

### Admin Endpoints
- `GET /api/admin/stats` - Get platform statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/ban` - Ban/unban user
- `GET /api/admin/notes` - Get all notes
- `DELETE /api/admin/notes/:id` - Delete note
- `PUT /api/admin/notes/:id/approve` - Approve/unapprove note

## 🎯 Key Features Implementation

### Authentication & Authorization
- JWT tokens with 7-day expiry
- Role-based access control (user/admin)
- Protected routes middleware
- Password hashing with bcrypt

### File Upload System
- Multer for file handling
- Cloudinary integration for cloud storage
- File type validation (PDF, DOCX, PPT)
- Duplicate detection using file hashing
- 10MB file size limit

### Search & Filtering
- MongoDB text search
- Filter by subject, tags, file type
- Debounced search (300ms)
- Sort by newest, most downloaded, highest rated

### Rating System
- 5-star rating system
- One rating per user per note
- Automatic average rating calculation
- Rating history tracking

### Admin Features
- User management (ban/unban)
- Content moderation
- Platform statistics
- Subject-wise analytics

## 🔒 Security Features

- **Helmet.js** - Security headers
- **CORS** - Configured cross-origin requests
- **Rate Limiting** - Prevent abuse
- **Input Validation** - Express-validator
- **File Type Check** - MIME type validation
- **JWT Expiry** - Token expiration
- **Password Hashing** - bcrypt with salt rounds

## 🌟 Sample Data

The application comes with sample data including:
- 3 users (1 admin, 2 regular users)
- 10 sample notes across different subjects
- Sample ratings and comments

Run `npm run seed` in the backend directory to populate the database.

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Render)
1. Connect your GitHub repository to Render
2. Set environment variables in Render dashboard
3. Choose Node.js environment
4. Deploy automatically on push to main branch

### Database (MongoDB Atlas)
1. Create a free MongoDB Atlas cluster
2. Configure IP whitelist and database user
3. Update connection string in environment variables

### File Storage (Cloudinary)
1. Create a free Cloudinary account
2. Get API credentials from dashboard
3. Update environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Framer Motion for beautiful animations
- Cloudinary for file storage services
- MongoDB for the flexible database solution

## 📞 Support

If you have any questions or need support, please:
- Open an issue on GitHub
- Contact the development team
- Check the documentation

---

**Built with ❤️ for students worldwide**
