import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Search, 
  Upload, 
  User, 
  LogOut, 
  Menu, 
  X,
  Moon,
  Sun,
  BookOpen,
  BarChart3
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { cn } from '../../utils/helpers'

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
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navItems = [
    { path: '/', label: 'Home', icon: BookOpen },
    { path: '/notes', label: 'Notes', icon: BookOpen },
    ...(isAuthenticated ? [
      { path: '/dashboard', label: 'Dashboard', icon: BarChart3 }
    ] : []),
    ...(user?.role === 'admin' ? [
      { path: '/admin', label: 'Admin', icon: BarChart3 }
    ] : [])
  ]

  return (
    <nav className="sticky top-0 z-40 border-b border-dark-border bg-dark-primary/95 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-xl font-bold gradient-text"
          >
            <BookOpen className="h-8 w-8" />
            <span>NotesHub</span>
          </Link>

          {/* Search Bar - Desktop */}
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary-400',
                    isActive ? 'text-primary-400' : 'text-gray-300'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link to="/upload">
                  <Button size="sm" icon={<Upload className="h-4 w-4" />}>
                    Upload
                  </Button>
                </Link>
                
                <div className="relative group">
                  <Button variant="ghost" size="sm" icon={<User className="h-4 w-4" />}>
                    {user?.username}
                  </Button>
                  
                  <div className="absolute right-0 mt-2 w-48 rounded-md border border-dark-border bg-dark-secondary shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="p-2">
                      <Link
                        to="/dashboard"
                        className="block w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-dark-accent rounded-md"
                      >
                        Dashboard
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
              </div>
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

        {/* Mobile Menu */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ 
            height: isMobileMenuOpen ? 'auto' : 0, 
            opacity: isMobileMenuOpen ? 1 : 0 
          }}
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

            {/* Mobile Navigation */}
            <div className="space-y-2">
              {navItems.map((item) => {
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

            {/* Mobile Auth */}
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
              <div className="space-y-2 pt-4 border-t border-dark-border">
                <Link to="/upload" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full" icon={<Upload className="h-4 w-4" />}>
                    Upload Note
                  </Button>
                </Link>
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
  )
}

export default Navbar
