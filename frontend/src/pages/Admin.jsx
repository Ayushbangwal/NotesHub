import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  BookOpen, 
  Download, 
  TrendingUp,
  Shield,
  Ban,
  Trash2,
  Eye,
  Search,
  Filter
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '../services/adminService'
import { useAuth } from '../hooks/useAuth'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import Modal from '../components/ui/Modal'
import { formatDate } from '../utils/helpers'

const Admin = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedNote, setSelectedNote] = useState(null)

  const queryClient = useQueryClient()

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: adminService.getStats,
    enabled: user?.role === 'admin'
  })

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users', searchTerm],
    queryFn: () => adminService.getAllUsers({ search: searchTerm }),
    enabled: activeTab === 'users' && user?.role === 'admin'
  })

  const { data: notesData, isLoading: notesLoading } = useQuery({
    queryKey: ['admin-notes'],
    queryFn: () => adminService.getAllNotes(),
    enabled: activeTab === 'notes' && user?.role === 'admin'
  })

  const banUserMutation = useMutation({
    mutationFn: ({ id, reason }) => adminService.toggleUserBan(id, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users'])
      setSelectedUser(null)
    }
  })

  const deleteNoteMutation = useMutation({
    mutationFn: adminService.deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-notes'])
      setSelectedNote(null)
    }
  })

  if (user?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <Shield className="h-12 w-12 text-gray-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-100 mb-2">Access Denied</h2>
        <p className="text-gray-400">You don't have permission to access this page.</p>
      </div>
    )
  }

  const stats = statsData?.stats || {}
  const recentUsers = statsData?.recentUsers || []
  const recentNotes = statsData?.recentNotes || []
  const subjectStats = statsData?.subjectStats || []

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'notes', label: 'Notes', icon: BookOpen }
  ]

  const handleBanUser = async () => {
    if (selectedUser) {
      await banUserMutation.mutateAsync({ 
        id: selectedUser._id, 
        reason: 'Administrative action' 
      })
    }
  }

  const handleDeleteNote = async () => {
    if (selectedNote) {
      await deleteNoteMutation.mutateAsync(selectedNote._id)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Manage users, notes, and platform statistics</p>
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
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
                      <p className="text-sm font-medium text-gray-400">Total Users</p>
                      <p className="text-2xl font-bold text-gray-100">{stats.totalUsers}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-500" />
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
                      <p className="text-sm font-medium text-gray-400">Total Notes</p>
                      <p className="text-2xl font-bold text-gray-100">{stats.totalNotes}</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-green-500" />
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
                      <p className="text-sm font-medium text-gray-400">Total Downloads</p>
                      <p className="text-2xl font-bold text-gray-100">{stats.totalDownloads}</p>
                    </div>
                    <Download className="h-8 w-8 text-purple-500" />
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
                      <p className="text-sm font-medium text-gray-400">Total Comments</p>
                      <p className="text-2xl font-bold text-gray-100">{stats.totalComments}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recent Activity */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Users */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Recent Users</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentUsers.map((user) => (
                    <div key={user._id} className="flex items-center justify-between p-3 bg-dark-accent rounded-lg">
                      <div>
                        <p className="font-medium text-gray-100">{user.username}</p>
                        <p className="text-sm text-gray-400">{user.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">{formatDate(user.createdAt)}</p>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.role === 'admin' 
                            ? 'bg-purple-500 text-white' 
                            : 'bg-gray-600 text-gray-200'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Recent Notes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentNotes.map((note) => (
                    <div key={note._id} className="flex items-center justify-between p-3 bg-dark-accent rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-100 truncate">{note.title}</p>
                        <p className="text-sm text-gray-400">by {note.uploadedBy.username}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">{formatDate(note.createdAt)}</p>
                        <p className="text-xs text-gray-400">{note.downloads} downloads</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Subject Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Notes by Subject</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {subjectStats.map((subject) => (
                  <div key={subject._id} className="text-center p-4 bg-dark-accent rounded-lg">
                    <p className="text-lg font-semibold text-gray-100">{subject.count}</p>
                    <p className="text-sm text-gray-400">{subject._id}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-100">User Management</h2>
            <div className="mt-4 sm:mt-0">
              <Input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="h-4 w-4" />}
                className="w-full sm:w-64"
              />
            </div>
          </div>

          {usersLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">User</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Role</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Joined</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersData?.users?.map((user) => (
                    <tr key={user._id} className="border-b border-dark-border">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=6366f1&color=fff`}
                            alt={user.username}
                            className="h-8 w-8 rounded-full"
                          />
                          <span className="font-medium text-gray-100">{user.username}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-300">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.role === 'admin' 
                            ? 'bg-purple-500 text-white' 
                            : 'bg-gray-600 text-gray-200'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-300">{formatDate(user.createdAt)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.isBanned 
                            ? 'bg-red-500 text-white' 
                            : 'bg-green-500 text-white'
                        }`}>
                          {user.isBanned ? 'Banned' : 'Active'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedUser(user)}
                            icon={user.isBanned ? <Eye className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                          >
                            {user.isBanned ? 'Unban' : 'Ban'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Notes Tab */}
      {activeTab === 'notes' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-100">Note Management</h2>
          </div>

          {notesLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Note</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Author</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Subject</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Downloads</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Rating</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {notesData?.notes?.map((note) => (
                    <tr key={note._id} className="border-b border-dark-border">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-100 truncate max-w-xs">{note.title}</p>
                          <p className="text-sm text-gray-400">{note.fileType.toUpperCase()}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-300">{note.uploadedBy.username}</td>
                      <td className="py-3 px-4 text-gray-300">{note.subject}</td>
                      <td className="py-3 px-4 text-gray-300">{note.downloads}</td>
                      <td className="py-3 px-4 text-gray-300">{note.averageRating.toFixed(1)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          note.isApproved 
                            ? 'bg-green-500 text-white' 
                            : 'bg-yellow-500 text-white'
                        }`}>
                          {note.isApproved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => setSelectedNote(note)}
                            icon={<Trash2 className="h-4 w-4" />}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Ban User Modal */}
      <Modal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title={selectedUser?.isBanned ? 'Unban User' : 'Ban User'}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to {selectedUser?.isBanned ? 'unban' : 'ban'} "{selectedUser?.username}"?
          </p>
          <div className="flex space-x-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setSelectedUser(null)}
            >
              Cancel
            </Button>
            <Button
              variant={selectedUser?.isBanned ? 'primary' : 'danger'}
              onClick={handleBanUser}
              loading={banUserMutation.isLoading}
            >
              {selectedUser?.isBanned ? 'Unban' : 'Ban'} User
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Note Modal */}
      <Modal
        isOpen={!!selectedNote}
        onClose={() => setSelectedNote(null)}
        title="Delete Note"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to delete "{selectedNote?.title}"? This action cannot be undone.
          </p>
          <div className="flex space-x-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setSelectedNote(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteNote}
              loading={deleteNoteMutation.isLoading}
            >
              Delete Note
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Admin
