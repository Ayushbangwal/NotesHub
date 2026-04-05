import { Routes, Route } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { motion } from 'framer-motion'

import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'
import Footer from './components/layout/Footer'

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

      <div className="flex flex-1">
        <Sidebar />

        {/* ✅ Main + Footer dono ek wrapper mein, sidebar ke baad */}
        <div className="flex flex-col flex-1 w-full lg:pl-64">
          <main className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="px-4 py-8"
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/notes/:id" element={<NoteDetail />} />
                <Route path="/trending" element={<Trending />} />
                <Route path="/upload" element={user ? <Upload /> : <Login />} />
                <Route path="/login" element={!user ? <Login /> : <Home />} />
                <Route path="/signup" element={!user ? <Signup /> : <Home />} />
                <Route path="/dashboard" element={user ? <Dashboard /> : <Login />} />
                <Route path="/change-password" element={user ? <ChangePassword /> : <Login />} />
                <Route path="/admin" element={user?.role === 'admin' ? <Admin /> : <Home />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
              </Routes>
            </motion.div>
          </main>

          {/* ✅ Footer ab sidebar ke baad, same width mein */}
          <Footer />
        </div>
      </div>

      <BackToTop />
    </div>
  )
}

export default App