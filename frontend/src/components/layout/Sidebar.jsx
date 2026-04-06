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
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="sticky top-0 hidden lg:flex h-screen w-64 flex-shrink-0 flex-col border-r border-dark-border bg-dark-secondary self-start"
    >
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'group flex items-center space-x-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary-600/90 text-white shadow-lg shadow-primary-500/20'
                    : 'text-gray-400 hover:bg-dark-accent hover:text-gray-100'
                )}
              >
                <span className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-white/10'
                    : 'bg-dark-primary group-hover:bg-primary-500/10'
                )}>
                  <Icon className={cn(
                    'h-4 w-4 transition-colors duration-200',
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-primary-400'
                  )} />
                </span>
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70" />
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {isAuthenticated && user && (
        <div className="px-3 py-4 border-t border-dark-border">
          <div className="flex items-center space-x-3 p-2 rounded-xl hover:bg-dark-accent transition-colors duration-200 cursor-pointer">
            <img
              src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=6366f1&color=fff`}
              alt={user.username}
              className="h-9 w-9 rounded-full ring-2 ring-primary-500/30"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-100 truncate">{user.username}</p>
              <p className="text-xs text-primary-400 capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      )}
    </motion.aside>
  )
}

export default Sidebar