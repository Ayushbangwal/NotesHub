import { Routes, Route } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { motion } from 'framer-motion'

// Layout Components
import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'
import Footer from './components/layout/Footer'
// Pages
import Home from './pages/Home'
import Notes from './pages/Notes'
import NoteDetail from './pages/NoteDetail'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Upload from './pages/Upload'
import Trending from './pages/Trending'
import ChangePassword from './pages/ChangePassword'

// UI Components
import LoadingSpinner from './components/ui/LoadingSpinner'
import BackToTop from './components/BackToTop'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-primary flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-primary flex flex-col">
      <Navbar />

      {/* ✅ FIX: This wrapper handles sidebar + content side by side */}
      <div className="flex flex-1 pt-16">
        {/* pt-16 = pushes below Navbar (assuming navbar is h-16 = 64px) */}

        <Sidebar />

        {/* ✅ FIX: lg:pl-64 instead of lg:ml-64 works better with fixed sidebar */}
        <main className="flex-1 w-full lg:pl-64 min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="px-4 py-8"
          >
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/notes/:id" element={<NoteDetail />} />
              <Route path="/trending" element={<Trending />} />
              <Route path="/upload" element={user ? <Upload /> : <Login />} />
{/* Auth Routes */}
              <Route path="/login" element={!user ? <Login /> : <Home />} />
              <Route path="/signup" element={!user ? <Signup /> : <Home />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={user ? <Dashboard /> : <Login />} />
              <Route path="/change-password" element={user ? <ChangePassword /> : <Login />} />
             
              <Route path="/admin" element={user?.role === 'admin' ? <Admin /> : <Home />} />

              {/* Password Routes */}
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Routes>
          </motion.div>
        </main>
      </div>

      <BackToTop />
      <Footer />
    </div>
  )
}

export default App