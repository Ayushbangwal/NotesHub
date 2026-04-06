import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Search, Upload, User, LogOut, Menu, X, BookOpen, BarChart3,
  Home, TrendingUp, Bookmark, Shield, Key
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
          <div className="flex h-16 items-center justify-between gap-4">

            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 text-xl font-bold gradient-text flex-shrink-0 group">
              <div className="p-1.5 rounded-lg bg-primary-500/10 group-hover:bg-primary-500/20 transition-colors duration-200">
                <BookOpen className="h-6 w-6 text-primary-400" />
              </div>
              <span>NotesHub</span>
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
              <Input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="h-4 w-4" />}
                className="w-full"
              />
            </form>

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center space-x-2 flex-shrink-0">
              {isAuthenticated ? (
                <>
                  <Link to="/upload">
                    <Button size="sm" icon={<Upload className="h-4 w-4" />}>
                      Upload
                    </Button>
                  </Link>
                  <div className="relative group">
                    <button className="flex items-center space-x-2 px-3 py-2 rounded-xl border border-dark-border bg-dark-secondary hover:border-primary-500/50 hover:bg-primary-500/5 transition-all duration-200 text-sm text-gray-300">
                      <img
                        src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username}&background=6366f1&color=fff`}
                        alt={user?.username}
                        className="h-6 w-6 rounded-full"
                      />
                      <span className="font-medium">{user?.username}</span>
                    </button>
                    <div className="absolute right-0 mt-2 w-52 rounded-xl border border-dark-border bg-dark-secondary shadow-xl shadow-black/30 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-1.5">
                      <Link
                        to="/dashboard"
                        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-300 hover:bg-dark-accent hover:text-gray-100 rounded-lg transition-colors"
                      >
                        <BarChart3 className="h-4 w-4 text-primary-400" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        to="/change-password"
                        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-300 hover:bg-dark-accent hover:text-gray-100 rounded-lg transition-colors"
                      >
                        <Key className="h-4 w-4 text-primary-400" />
                        <span>Change Password</span>
                      </Link>
                      <div className="my-1 border-t border-dark-border" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2">
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
              className="md:hidden p-2 rounded-lg text-gray-300 hover:bg-dark-accent hover:text-gray-100 transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile Menu */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: isMobileMenuOpen ? 'auto' : 0, opacity: isMobileMenuOpen ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden"
          >
            <div className="py-4 space-y-4">
              <form onSubmit={handleSearch}>
                <Input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="h-4 w-4" />}
                />
              </form>

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
                        'flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'bg-primary-600/90 text-white shadow-lg shadow-primary-500/20'
                          : 'text-gray-400 hover:bg-dark-accent hover:text-gray-100'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </div>

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
                <div className="pt-4 border-t border-dark-border space-y-1">
                  <Link
                    to="/change-password"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-300 hover:bg-dark-accent rounded-xl transition-colors"
                  >
                    <Key className="h-4 w-4 text-primary-400" />
                    <span>Change Password</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
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