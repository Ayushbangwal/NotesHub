import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Upload, 
  BookOpen, 
  Download, 
  Bookmark,
  TrendingUp,
  Eye,
  Star,
  Calendar,
  FileText,
  BarChart3
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100 mb-2">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-gray-400">Manage your notes and track your progress</p>
        </div>
        <Link to="/upload">
          <Button icon={<Upload className="h-4 w-4" />}>
            Upload New Note
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Uploads</p>
                  <p className="text-2xl font-bold text-gray-100">{stats.totalUploads}</p>
                </div>
                <Upload className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Downloads</p>
                  <p className="text-2xl font-bold text-gray-100">{stats.totalViews}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Bookmarks</p>
                  <p className="text-2xl font-bold text-gray-100">{stats.totalBookmarks}</p>
                </div>
                <Bookmark className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Avg Rating</p>
                  <p className="text-2xl font-bold text-gray-100">
                    {stats.averageRating ? stats.averageRating.toFixed(1) : 'N/A'}
                  </p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="border-b border-dark-border">
        <nav className="flex space-x-8">
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
                  <Upload className="h-5 w-5" />
                  <span>Recent Uploads</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {uploadedNotes.length > 0 ? (
                  <div className="space-y-3">
                    {uploadedNotes.slice(0, 5).map((note) => (
                      <div key={note._id} className="flex items-center justify-between p-3 bg-dark-accent rounded-lg">
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/notes/${note._id}`}
                            className="text-sm font-medium text-gray-100 hover:text-primary-400 truncate"
                          >
                            {note.title}
                          </Link>
                          <div className="flex items-center space-x-4 text-xs text-gray-400 mt-1">
                            <span>{formatDate(note.createdAt)}</span>
                            <span>{note.downloads} downloads</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 text-yellow-400">
                          <Star className="h-3 w-3 fill-current" />
                          <span className="text-xs">{note.averageRating.toFixed(1)}</span>
                        </div>
                      </div>
                    ))}
                    {uploadedNotes.length > 5 && (
                      <Link to="/dashboard?tab=uploaded" className="text-sm text-primary-400 hover:text-primary-300">
                        View all uploads →
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Upload className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-400 mb-3">No notes uploaded yet</p>
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
                  <Download className="h-5 w-5" />
                  <span>Recent Downloads</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {downloadHistory.length > 0 ? (
                  <div className="space-y-3">
                    {downloadHistory.slice(0, 5).map((item) => (
                      <div key={item._id} className="flex items-center justify-between p-3 bg-dark-accent rounded-lg">
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/notes/${item.note._id}`}
                            className="text-sm font-medium text-gray-100 hover:text-primary-400 truncate"
                          >
                            {item.note.title}
                          </Link>
                          <div className="flex items-center space-x-4 text-xs text-gray-400 mt-1">
                            <span>by {item.note.uploadedBy.username}</span>
                            <span>{formatDate(item.downloadedAt)}</span>
                          </div>
                        </div>
                        <FileText className="h-4 w-4 text-gray-400" />
                      </div>
                    ))}
                    {downloadHistory.length > 5 && (
                      <Link to="/dashboard?tab=downloads" className="text-sm text-primary-400 hover:text-primary-300">
                        View all downloads →
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Download className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-400 mb-3">No downloads yet</p>
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
              <h2 className="text-xl font-semibold text-gray-100">My Uploaded Notes</h2>
              <Link to="/upload">
                <Button icon={<Upload className="h-4 w-4" />}>
                  Upload New
                </Button>
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
                  <Upload className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-100 mb-2">No notes uploaded yet</h3>
                  <p className="text-gray-400 mb-4">Start sharing your knowledge with the community</p>
                  <Link to="/upload">
                    <Button icon={<Upload className="h-4 w-4" />}>
                      Upload Your First Note
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Downloads Tab */}
        {activeTab === 'downloads' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-100 mb-6">Download History</h2>
            {downloadHistory.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {downloadHistory.map((item) => (
                  <NoteCard key={item._id} note={item.note} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Download className="h-12 w-12 text-gray-500 mx-auto mb-4" />
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
            <h2 className="text-xl font-semibold text-gray-100 mb-6">Bookmarked Notes</h2>
            {bookmarkedNotes.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarkedNotes.map((note) => (
                  <NoteCard key={note._id} note={note} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Bookmark className="h-12 w-12 text-gray-500 mx-auto mb-4" />
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
