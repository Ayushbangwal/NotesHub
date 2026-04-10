import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Upload, BookOpen, Download, Bookmark,
  TrendingUp, Eye, Star, Calendar,
  FileText, BarChart3, Lock, Trophy
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useQuery } from '@tanstack/react-query'
import { userService } from '../services/userService'
import Button from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import NoteCard from '../components/notes/NoteCard'
import { formatDate, formatFileSize } from '../utils/helpers'

const Dashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: userService.getDashboard,
    enabled: !!user
  })

  const { data: bookmarksData } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: () => userService.getBookmarks({ limit: 6 }),
    enabled: !!user
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const stats = dashboardData?.stats || {}
  const uploadedNotes = dashboardData?.uploadedNotes || []
  const downloadHistory = dashboardData?.downloadHistory || []
  const bookmarkedNotes = bookmarksData?.notes || []

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'uploaded', label: 'My Notes', icon: Upload },
    { id: 'downloads', label: 'Downloads', icon: Download },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark }
  ]

  const statCards = [
    {
      label: 'Total Uploads',
      value: stats.totalUploads ?? 0,
      icon: Upload,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20'
    },
    {
      label: 'Total Downloads',
      value: stats.totalViews ?? 0,
      icon: TrendingUp,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20'
    },
    {
      label: 'Bookmarks',
      value: stats.totalBookmarks ?? 0,
      icon: Bookmark,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20'
    },
    {
      label: 'Avg Rating',
      value: stats.averageRating ? `${stats.averageRating.toFixed(1)} ⭐` : '0.0',
      icon: Star,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-100 mb-1">
            Welcome back, <span className="text-primary-400">{user?.username}</span>! 👋
          </h1>
          <p className="text-gray-400">Manage your notes and track your progress</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Button
            variant="outline"
            onClick={() => navigate('/change-password')}
            icon={<Lock className="h-4 w-4" />}
          >
            Change Password
          </Button>
          <Link to="/upload">
            <Button icon={<Upload className="h-4 w-4" />}>
              Upload New Note
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
          >
            <Card className={`border ${s.border} hover:scale-[1.02] transition-transform duration-200`}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1">{s.label}</p>
                    <p className="text-2xl font-bold text-gray-100">{s.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center`}>
                    <s.icon className={`h-6 w-6 ${s.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-dark-border overflow-x-auto">
        <nav className="flex space-x-6 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Uploads */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5 text-blue-400" />
                  <span>Recent Uploads</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {uploadedNotes.length > 0 ? (
                  <div className="space-y-3">
                    {uploadedNotes.slice(0, 5).map((note) => (
                      <div key={note._id} className="flex items-center justify-between p-3 bg-dark-accent rounded-lg hover:bg-dark-accent/80 transition-colors">
                        <div className="flex-1 min-w-0 mr-3">
                          <Link
                            to={`/notes/${note._id}`}
                            className="text-sm font-medium text-gray-100 hover:text-primary-400 truncate block"
                          >
                            {note.title}
                          </Link>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                            <span>{formatDate(note.createdAt)}</span>
                            <span className="flex items-center gap-1">
                              <Download className="h-3 w-3" />
                              {note.downloads}
                            </span>
                            {note.fileSize && (
                              <span>{formatFileSize(note.fileSize)}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-400 shrink-0">
                          <Star className="h-3 w-3 fill-current" />
                          <span className="text-xs font-medium">
                            {note.averageRating ? note.averageRating.toFixed(1) : '0.0'}
                          </span>
                        </div>
                      </div>
                    ))}
                    {uploadedNotes.length > 5 && (
                      <button
                        onClick={() => setActiveTab('uploaded')}
                        className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
                      >
                        View all {uploadedNotes.length} uploads →
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Upload className="h-8 w-8 text-blue-400" />
                    </div>
                    <p className="text-gray-400 mb-4">No notes uploaded yet</p>
                    <Link to="/upload">
                      <Button size="sm">Upload Your First Note</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Downloads */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Download className="h-5 w-5 text-green-400" />
                  <span>Recent Downloads</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {downloadHistory.length > 0 ? (
                  <div className="space-y-3">
                    {downloadHistory.slice(0, 5).map((item) => (
                      <div key={item._id} className="flex items-center justify-between p-3 bg-dark-accent rounded-lg hover:bg-dark-accent/80 transition-colors">
                        <div className="flex-1 min-w-0 mr-3">
                          <Link
                            to={`/notes/${item.note._id}`}
                            className="text-sm font-medium text-gray-100 hover:text-primary-400 truncate block"
                          >
                            {item.note.title}
                          </Link>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                            <span>by {item.note.uploadedBy.username}</span>
                            <span>{formatDate(item.downloadedAt)}</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-dark-border text-gray-400 uppercase shrink-0">
                          {item.note.fileType || 'PDF'}
                        </span>
                      </div>
                    ))}
                    {downloadHistory.length > 5 && (
                      <button
                        onClick={() => setActiveTab('downloads')}
                        className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
                      >
                        View all downloads →
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Download className="h-8 w-8 text-green-400" />
                    </div>
                    <p className="text-gray-400 mb-4">No downloads yet</p>
                    <Link to="/notes">
                      <Button size="sm">Browse Notes</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* My Notes Tab */}
        {activeTab === 'uploaded' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-100">My Uploaded Notes</h2>
                <p className="text-sm text-gray-500 mt-0.5">{uploadedNotes.length} note{uploadedNotes.length !== 1 ? 's' : ''} uploaded</p>
              </div>
              <Link to="/upload">
                <Button icon={<Upload className="h-4 w-4" />}>Upload New</Button>
              </Link>
            </div>
            {uploadedNotes.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {uploadedNotes.map((note) => (
                  <NoteCard key={note._id} note={note} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="h-10 w-10 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-100 mb-2">No notes uploaded yet</h3>
                  <p className="text-gray-400 mb-4">Start sharing your knowledge with the community</p>
                  <Link to="/upload">
                    <Button icon={<Upload className="h-4 w-4" />}>Upload Your First Note</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Downloads Tab */}
        {activeTab === 'downloads' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-100">Download History</h2>
              <p className="text-sm text-gray-500 mt-0.5">{downloadHistory.length} note{downloadHistory.length !== 1 ? 's' : ''} downloaded</p>
            </div>
            {downloadHistory.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {downloadHistory.map((item) => (
                  <NoteCard key={item._id} note={item.note} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Download className="h-10 w-10 text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-100 mb-2">No downloads yet</h3>
                  <p className="text-gray-400 mb-4">Explore and download notes from the community</p>
                  <Link to="/notes">
                    <Button>Browse Notes</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Bookmarks Tab */}
        {activeTab === 'bookmarks' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-100">Bookmarked Notes</h2>
              <p className="text-sm text-gray-500 mt-0.5">{bookmarkedNotes.length} note{bookmarkedNotes.length !== 1 ? 's' : ''} bookmarked</p>
            </div>
            {bookmarkedNotes.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarkedNotes.map((note) => (
                  <NoteCard key={note._id} note={note} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bookmark className="h-10 w-10 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-100 mb-2">No bookmarks yet</h3>
                  <p className="text-gray-400 mb-4">Save your favorite notes for easy access</p>
                  <Link to="/notes">
                    <Button>Browse Notes</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard