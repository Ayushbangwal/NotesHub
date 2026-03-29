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
import ChangePassword from './pages/ChangePassword' // ✅ NEW

// UI Components
import LoadingSpinner from './components/ui/LoadingSpinner'
import BackToTop from './components/BackToTop' // ✅ NEW

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
    <div className="min-h-screen bg-dark-primary">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-0 lg:ml-64">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-8"
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
              <Route path="/change-password" element={user ? <ChangePassword /> : <Login />} /> {/* ✅ NEW */}

              <Route path="/admin" element={user?.role === 'admin' ? <Admin /> : <Home />} />
            </Routes>
          </motion.div>
        </main>
      </div>
      <BackToTop /> {/* ✅ NEW */}
      <Footer />
    </div>
  )
}

export default App