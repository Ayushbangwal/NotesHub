import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Search, Upload, User, LogOut, Menu, X, BookOpen, BarChart3,
  Home, TrendingUp, Bookmark, Shield
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { cn } from '../../utils/helpers'
import AnnouncementBanner from './AnnouncementBanner'

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/notes?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setIsMobileMenuOpen(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsMobileMenuOpen(false)
  }

  // ✅ Mobile ke liye FULL nav items (sidebar nahi hoti mobile pe)
  const mobileNavItems = [
    { path: '/', label: 'Home', icon: Home, show: true },
    { path: '/notes', label: 'All Notes', icon: BookOpen, show: true },
    { path: '/trending', label: 'Trending', icon: TrendingUp, show: true },
    { path: '/upload', label: 'Upload', icon: Upload, show: isAuthenticated },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3, show: isAuthenticated },
    { path: '/bookmarks', label: 'Bookmarks', icon: Bookmark, show: isAuthenticated },
    { path: '/admin', label: 'Admin Panel', icon: Shield, show: user?.role === 'admin' },
  ].filter(item => item.show)

  return (
    <>
      <AnnouncementBanner />
      <nav className="sticky top-0 z-40 border-b border-dark-border bg-dark-primary/95 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">

            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 text-xl font-bold gradient-text">
              <BookOpen className="h-8 w-8" />
              <span>NotesHub</span>
            </Link>

            {/* Search Bar - Desktop only */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
              <Input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="h-4 w-4" />}
                className="w-full"
              />
            </form>

            {/* ✅ Desktop — sirf Upload + User menu, nav links NAHI */}
            <div className="hidden md:flex items-center space-x-3">
              {isAuthenticated ? (
                <>
                  <Link to="/upload">
                    <Button size="sm" icon={<Upload className="h-4 w-4" />}>
                      Upload
                    </Button>
                  </Link>
                  <div className="relative group">
                    <Button variant="ghost" size="sm" icon={<User className="h-4 w-4" />}>
                      {user?.username}
                    </Button>
                    <div className="absolute right-0 mt-2 w-48 rounded-md border border-dark-border bg-dark-secondary shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="p-2">
                        <Link
                          to="/dashboard"
                          className="block w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-dark-accent rounded-md"
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/change-password"
                          className="block w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-dark-accent rounded-md"
                        >
                          Change Password
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-dark-accent rounded-md"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/login">
                    <Button variant="outline" size="sm">Login</Button>
                  </Link>
                  <Link to="/signup">
                    <Button size="sm">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-300 hover:bg-dark-accent"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* ✅ Mobile Menu — full navigation yahan */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: isMobileMenuOpen ? 'auto' : 0, opacity: isMobileMenuOpen ? 1 : 0 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden"
          >
            <div className="py-4 space-y-4">

              {/* Mobile Search */}
              <form onSubmit={handleSearch}>
                <Input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="h-4 w-4" />}
                />
              </form>

              {/* Mobile Nav Links */}
              <div className="space-y-1">
                {mobileNavItems.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.path
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-300 hover:bg-dark-accent'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </div>

              {/* Mobile Auth Buttons */}
              {!isAuthenticated ? (
                <div className="space-y-2 pt-4 border-t border-dark-border">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Login</Button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </div>
              ) : (
                <div className="pt-4 border-t border-dark-border">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm text-red-400 hover:bg-dark-accent rounded-md"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </nav>
    </>
  )
}

export default Navbar