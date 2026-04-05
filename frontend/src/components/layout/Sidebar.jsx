import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Home, BookOpen, Upload, TrendingUp, Bookmark, Shield, BarChart3
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { cn } from '../../utils/helpers'

const Sidebar = () => {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Home', icon: Home, show: true },
    { path: '/notes', label: 'All Notes', icon: BookOpen, show: true },
    { path: '/trending', label: 'Trending', icon: TrendingUp, show: true },
    { path: '/upload', label: 'Upload', icon: Upload, show: isAuthenticated },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3, show: isAuthenticated },
    { path: '/bookmarks', label: 'Bookmarks', icon: Bookmark, show: isAuthenticated },
    { path: '/admin', label: 'Admin Panel', icon: Shield, show: user?.role === 'admin' }
  ].filter(item => item.show)

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="sticky top-0 hidden lg:flex h-screen w-64 flex-shrink-0 flex-col border-r border-dark-border bg-dark-secondary self-start"
    >
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="space-y-2 px-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-dark-accent hover:text-gray-100'
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {isAuthenticated && user && (
          <div className="mt-6 px-3 py-4 border-t border-dark-border">
            <div className="flex items-center space-x-3">
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=6366f1&color=fff`}
                alt={user.username}
                className="h-10 w-10 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-100 truncate">{user.username}</p>
                <p className="text-xs text-gray-400 capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  )
}

export default Sidebar