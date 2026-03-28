# 🚀 Quick Start Guide - NotesHub

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas account)
- Cloudinary account (for file storage)

## Step 1: Environment Setup

### Backend (.env)
Create `.env` file in `backend/` directory:
```env
MONGODB_URI=mongodb://localhost:27017/noteshub
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
PORT=5000
CLIENT_URL=http://localhost:5173
```

### Frontend (.env)
Create `.env` file in `frontend/` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

## Step 2: Install Dependencies & Start

### Method 1: Manual Setup
```bash
# Backend
cd backend
npm install
npm run seed  # Optional: populate with sample data
npm run dev

# Frontend (in new terminal)
cd frontend
npm install
npm run dev
```

### Method 2: Quick Start Script
```bash
# From project root
npm run setup:backend
npm run setup:frontend
npm run dev
```

## Step 3: Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

## Default Login Credentials
After running seed script:
- **Admin**: admin@noteshub.com / Admin123!
- **User 1**: john@student.com / Student123!
- **User 2**: jane@student.com / Student123!

## Features Ready to Use
✅ User Authentication (Login/Signup)
✅ Notes Upload & Management
✅ Search & Filtering
✅ Rating & Bookmarking
✅ User Dashboard
✅ Admin Panel
✅ Download Tracking
✅ Comments System
✅ Leaderboard

## Troubleshooting

### Common Issues
1. **MongoDB Connection Error**
   - Ensure MongoDB is running locally
   - Check MONGODB_URI in .env file
   - For Atlas, whitelist your IP

2. **Cloudinary Upload Error**
   - Verify Cloudinary credentials
   - Check cloud name, API key, and secret
   - Ensure cloudinary account is active

3. **CORS Errors**
   - Verify CLIENT_URL matches frontend URL
   - Check both frontend and backend ports

4. **JWT Token Issues**
   - Clear browser localStorage
   - Check JWT_SECRET is set
   - Verify token expiration (7 days)

### Port Conflicts
If ports 5000 or 5173 are occupied:
```bash
# Backend - change PORT in .env
PORT=5001

# Frontend - update vite.config.js
server: {
  port: 5174,
  proxy: {
    '/api': {
      target: 'http://localhost:5001',
    }
  }
}
```

## Development Tips
- Backend logs show in terminal
- Frontend hot-reloads automatically
- Use browser DevTools for debugging
- Check Network tab for API calls

## Production Deployment
- **Frontend**: Deploy to Vercel
- **Backend**: Deploy to Render or Heroku
- **Database**: Use MongoDB Atlas
- **Files**: Keep Cloudinary configuration

## Need Help?
- Check README.md for detailed documentation
- Review API endpoints in docs
- Open an issue for bugs/questions

Happy Coding! 🎉
