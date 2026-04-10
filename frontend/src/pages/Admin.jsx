import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, BookOpen, Download, TrendingUp, Shield, Ban,
  Trash2, Eye, Search, CheckSquare, Square, CheckCheck,
  XCircle, Megaphone, Plus, ToggleLeft, ToggleRight, AlertTriangle,
  FileText, Clock, Activity
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
import toast from 'react-hot-toast'

const TYPE_STYLES = {
  info:    { bg: 'bg-blue-500/20 border-blue-500/40',    text: 'text-blue-400',    badge: 'bg-blue-500' },
  warning: { bg: 'bg-yellow-500/20 border-yellow-500/40', text: 'text-yellow-400', badge: 'bg-yellow-500' },
  success: { bg: 'bg-green-500/20 border-green-500/40',   text: 'text-green-400',  badge: 'bg-green-500' },
  danger:  { bg: 'bg-red-500/20 border-red-500/40',       text: 'text-red-400',    badge: 'bg-red-500' },
}

const Admin = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedNote, setSelectedNote] = useState(null)
  const [selectedNoteIds, setSelectedNoteIds] = useState([])
  const [bulkAction, setBulkAction] = useState('')
  const [showBulkConfirm, setShowBulkConfirm] = useState(false)
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false)
  const [announcementForm, setAnnouncementForm] = useState({
    title: '', message: '', type: 'info', expiresAt: ''
  })

  const { data: statsData } = useQuery({
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
    enabled: (activeTab === 'notes' || activeTab === 'bulk') && user?.role === 'admin'
  })

  const { data: announcementsData, isLoading: announcementsLoading } = useQuery({
    queryKey: ['admin-announcements'],
    queryFn: adminService.getAllAnnouncements,
    enabled: activeTab === 'announcements' && user?.role === 'admin'
  })

  const banUserMutation = useMutation({
    mutationFn: ({ id, reason }) => adminService.toggleUserBan(id, { reason }),
    onSuccess: () => { queryClient.invalidateQueries(['admin-users']); setSelectedUser(null) }
  })

  const deleteNoteMutation = useMutation({
    mutationFn: adminService.deleteNote,
    onSuccess: () => { queryClient.invalidateQueries(['admin-notes']); setSelectedNote(null) }
  })

  const approveNoteMutation = useMutation({
    mutationFn: adminService.toggleNoteApproval,
    onSuccess: () => { queryClient.invalidateQueries(['admin-notes']); toast.success('Note status updated!') }
  })

  const bulkActionMutation = useMutation({
    mutationFn: ({ noteIds, action }) => adminService.bulkNoteAction(noteIds, action),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['admin-notes'])
      setSelectedNoteIds([])
      setBulkAction('')
      setShowBulkConfirm(false)
      toast.success(`Done! ${data.modifiedCount} notes updated.`)
    },
    onError: () => toast.error('Bulk action failed!')
  })

  const createAnnouncementMutation = useMutation({
    mutationFn: adminService.createAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-announcements'])
      setShowAnnouncementModal(false)
      setAnnouncementForm({ title: '', message: '', type: 'info', expiresAt: '' })
      toast.success('Announcement created!')
    }
  })

  const toggleAnnouncementMutation = useMutation({
    mutationFn: adminService.toggleAnnouncement,
    onSuccess: () => { queryClient.invalidateQueries(['admin-announcements']); toast.success('Updated!') }
  })

  const deleteAnnouncementMutation = useMutation({
    mutationFn: adminService.deleteAnnouncement,
    onSuccess: () => { queryClient.invalidateQueries(['admin-announcements']); toast.success('Deleted!') }
  })

  if (user?.role !== 'admin') {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="h-10 w-10 text-red-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-100 mb-2">Access Denied</h2>
        <p className="text-gray-400">You don't have permission to access this page.</p>
      </div>
    )
  }

  const stats = statsData?.stats || {}
  const recentUsers = statsData?.recentUsers || []
  const recentNotes = statsData?.recentNotes || []
  const subjectStats = statsData?.subjectStats || []
  const notes = notesData?.notes || []
  const announcements = announcementsData?.announcements || []
  const pendingNotes = notes.filter(n => !n.isApproved)

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'notes', label: 'Notes', icon: BookOpen },
    { id: 'bulk', label: 'Bulk Actions', icon: CheckCheck },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
  ]

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { label: 'Total Notes', value: stats.totalNotes, icon: BookOpen, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
    { label: 'Total Downloads', value: stats.totalDownloads, icon: Download, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    { label: 'Total Comments', value: stats.totalComments, icon: Activity, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  ]

  const toggleSelectNote = (id) => {
    setSelectedNoteIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedNoteIds.length === notes.length) setSelectedNoteIds([])
    else setSelectedNoteIds(notes.map(n => n._id))
  }

  const handleBulkConfirm = () => {
    if (!bulkAction) return toast.error('Please select an action')
    if (selectedNoteIds.length === 0) return toast.error('Select at least one note')
    setShowBulkConfirm(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-100 mb-1">Admin Dashboard</h1>
          <p className="text-gray-400">Manage users, notes, announcements and more</p>
        </div>
        {pendingNotes.length > 0 && activeTab !== 'notes' && (
          <button
            onClick={() => setActiveTab('notes')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 text-sm font-medium hover:bg-yellow-500/25 transition-colors"
          >
            <Clock className="h-4 w-4" />
            {pendingNotes.length} note{pendingNotes.length > 1 ? 's' : ''} pending approval
          </button>
        )}
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
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
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

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <Card className={`border ${s.border} hover:scale-[1.02] transition-transform duration-200`}>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1">{s.label}</p>
                        <p className="text-2xl font-bold text-gray-100">{s.value ?? '—'}</p>
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

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-blue-400" /> Recent Users</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentUsers.map(u => (
                    <div key={u._id} className="flex items-center justify-between p-3 bg-dark-accent rounded-lg">
                      <div className="flex items-center gap-3">
                        <img src={u.avatar || `https://ui-avatars.com/api/?name=${u.username}&background=6366f1&color=fff`} alt={u.username} className="h-8 w-8 rounded-full" />
                        <div>
                          <p className="font-medium text-gray-100 text-sm">{u.username}</p>
                          <p className="text-xs text-gray-500">{u.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{formatDate(u.createdAt)}</p>
                        <span className={`px-2 py-0.5 text-[10px] rounded-full font-medium ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-600/50 text-gray-300'}`}>{u.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-green-400" /> Recent Notes</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentNotes.map(note => (
                    <div key={note._id} className="flex items-center justify-between p-3 bg-dark-accent rounded-lg">
                      <div className="flex-1 min-w-0 mr-3">
                        <p className="font-medium text-gray-100 text-sm truncate">{note.title}</p>
                        <p className="text-xs text-gray-500">by {note.uploadedBy?.username}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-gray-500">{formatDate(note.createdAt)}</p>
                        <p className="text-xs text-gray-500">{note.downloads} downloads</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {subjectStats.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Notes by Subject</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {subjectStats.map(s => (
                    <div key={s._id} className="text-center p-4 bg-dark-accent rounded-xl hover:bg-dark-accent/80 transition-colors">
                      <p className="text-xl font-bold text-primary-400">{s.count}</p>
                      <p className="text-xs text-gray-400 mt-1">{s._id}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === 'users' && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-100">User Management</h2>
              <p className="text-sm text-gray-500">{usersData?.users?.length ?? 0} users total</p>
            </div>
            <Input type="text" placeholder="Search users..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="h-4 w-4" />} className="w-full sm:w-64" />
          </div>
          {usersLoading ? <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div> : (
            <div className="overflow-x-auto rounded-xl border border-dark-border">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-border bg-dark-accent/50">
                    {['User', 'Email', 'Role', 'Joined', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-border">
                  {usersData?.users?.map(u => (
                    <tr key={u._id} className="hover:bg-dark-accent/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <img src={u.avatar || `https://ui-avatars.com/api/?name=${u.username}&background=6366f1&color=fff`} alt={u.username} className="h-8 w-8 rounded-full" />
                          <span className="font-medium text-gray-100 text-sm">{u.username}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-sm">{u.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-600/50 text-gray-300'}`}>{u.role}</span>
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-sm">{formatDate(u.createdAt)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${u.isBanned ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>{u.isBanned ? 'Banned' : 'Active'}</span>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="outline" size="sm" onClick={() => setSelectedUser(u)}>
                          {u.isBanned ? <><Eye className="h-3 w-3 mr-1" />Unban</> : <><Ban className="h-3 w-3 mr-1" />Ban</>}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* NOTES TAB */}
      {activeTab === 'notes' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-100">Note Management</h2>
              {pendingNotes.length > 0 && (
                <p className="text-sm text-yellow-400 mt-0.5">⚠️ {pendingNotes.length} note{pendingNotes.length > 1 ? 's' : ''} pending approval</p>
              )}
            </div>
          </div>
          {notesLoading ? <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div> : (
            <div className="overflow-x-auto rounded-xl border border-dark-border">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-border bg-dark-accent/50">
                    {['Note', 'Author', 'Subject', 'Downloads', 'Rating', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-border">
                  {notes.map(note => (
                    <tr key={note._id} className={`hover:bg-dark-accent/30 transition-colors ${!note.isApproved ? 'bg-yellow-500/3' : ''}`}>
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-100 text-sm truncate max-w-[200px]">{note.title}</p>
                        <span className="text-[10px] font-bold text-gray-500 uppercase">{note.fileType}</span>
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-sm">{note.uploadedBy?.username}</td>
                      <td className="py-3 px-4 text-gray-400 text-sm">{note.subject}</td>
                      <td className="py-3 px-4 text-gray-400 text-sm">{note.downloads}</td>
                      <td className="py-3 px-4 text-gray-400 text-sm">{note.averageRating?.toFixed(1)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${note.isApproved ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                          {note.isApproved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => approveNoteMutation.mutate(note._id)}>
                            {note.isApproved ? <XCircle className="h-3.5 w-3.5" /> : <CheckSquare className="h-3.5 w-3.5" />}
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => setSelectedNote(note)}>
                            <Trash2 className="h-3.5 w-3.5" />
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

      {/* BULK ACTIONS TAB */}
      {activeTab === 'bulk' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-100">Bulk Actions</h2>
              <p className="text-gray-400 text-sm">{selectedNoteIds.length} note(s) selected</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <select value={bulkAction} onChange={(e) => setBulkAction(e.target.value)}
                className="px-4 py-2 rounded-lg bg-dark-accent border border-white/10 text-gray-200 text-sm focus:outline-none focus:border-primary-400">
                <option value="">Select Action</option>
                <option value="approve">✅ Approve Selected</option>
                <option value="unapprove">⏸ Unapprove Selected</option>
                <option value="delete">🗑 Delete Selected</option>
              </select>
              <Button onClick={handleBulkConfirm} disabled={selectedNoteIds.length === 0 || !bulkAction}>
                Apply to {selectedNoteIds.length} notes
              </Button>
            </div>
          </div>

          {notesLoading ? <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div> : (
            <div className="overflow-x-auto rounded-xl border border-dark-border">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-border bg-dark-accent/50">
                    <th className="py-3 px-4">
                      <button onClick={toggleSelectAll} className="text-gray-400 hover:text-primary-400">
                        {selectedNoteIds.length === notes.length && notes.length > 0
                          ? <CheckCheck className="h-5 w-5 text-primary-400" />
                          : <Square className="h-5 w-5" />}
                      </button>
                    </th>
                    {['Note', 'Author', 'Subject', 'Status'].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-border">
                  {notes.map(note => (
                    <tr key={note._id} className={`transition-colors ${selectedNoteIds.includes(note._id) ? 'bg-primary-500/5' : 'hover:bg-dark-accent/30'}`}>
                      <td className="py-3 px-4">
                        <button onClick={() => toggleSelectNote(note._id)} className="text-gray-400 hover:text-primary-400">
                          {selectedNoteIds.includes(note._id)
                            ? <CheckSquare className="h-5 w-5 text-primary-400" />
                            : <Square className="h-5 w-5" />}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-100 text-sm truncate max-w-[200px]">{note.title}</p>
                        <p className="text-[10px] text-gray-500 uppercase">{note.fileType}</p>
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-sm">{note.uploadedBy?.username}</td>
                      <td className="py-3 px-4 text-gray-400 text-sm">{note.subject}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${note.isApproved ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                          {note.isApproved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ANNOUNCEMENTS TAB */}
      {activeTab === 'announcements' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-100">Announcements</h2>
              <p className="text-gray-400 text-sm">Send banners/notices to all users</p>
            </div>
            <Button onClick={() => setShowAnnouncementModal(true)} icon={<Plus className="h-4 w-4" />}>
              New Announcement
            </Button>
          </div>

          {announcementsLoading ? <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div> : (
            <div className="space-y-4">
              {announcements.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Megaphone className="h-8 w-8 text-gray-500" />
                  </div>
                  <p className="text-gray-400">No announcements yet</p>
                  <p className="text-gray-600 text-sm mt-1">Create one to notify all users</p>
                </div>
              ) : announcements.map(ann => {
                const style = TYPE_STYLES[ann.type] || TYPE_STYLES.info
                return (
                  <div key={ann._id} className={`rounded-xl border p-5 transition-opacity ${style.bg} ${!ann.isActive ? 'opacity-50' : ''}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className={`text-xs px-2 py-0.5 rounded-full text-white font-medium ${style.badge}`}>{ann.type}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ann.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                            {ann.isActive ? 'Active' : 'Inactive'}
                          </span>
                          <span className="text-xs text-gray-500">{formatDate(ann.createdAt)}</span>
                          {ann.expiresAt && <span className="text-xs text-gray-500">Expires: {formatDate(ann.expiresAt)}</span>}
                        </div>
                        <p className={`font-semibold ${style.text} mb-1`}>{ann.title}</p>
                        <p className="text-gray-300 text-sm">{ann.message}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => toggleAnnouncementMutation.mutate(ann._id)} className="text-gray-400 hover:text-primary-400 transition-colors">
                          {ann.isActive ? <ToggleRight className="h-5 w-5 text-green-400" /> : <ToggleLeft className="h-5 w-5" />}
                        </button>
                        <button onClick={() => deleteAnnouncementMutation.mutate(ann._id)} className="text-gray-400 hover:text-red-400 transition-colors">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* MODALS */}
      <Modal isOpen={!!selectedUser} onClose={() => setSelectedUser(null)}
        title={selectedUser?.isBanned ? 'Unban User' : 'Ban User'} size="sm">
        <div className="space-y-4">
          <p className="text-gray-300">Are you sure you want to {selectedUser?.isBanned ? 'unban' : 'ban'} "<strong>{selectedUser?.username}</strong>"?</p>
          <div className="flex space-x-3 justify-end">
            <Button variant="outline" onClick={() => setSelectedUser(null)}>Cancel</Button>
            <Button variant={selectedUser?.isBanned ? 'primary' : 'danger'}
              onClick={() => banUserMutation.mutateAsync({ id: selectedUser._id, reason: 'Admin action' })}
              loading={banUserMutation.isLoading}>
              {selectedUser?.isBanned ? 'Unban' : 'Ban'} User
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!selectedNote} onClose={() => setSelectedNote(null)} title="Delete Note" size="sm">
        <div className="space-y-4">
          <p className="text-gray-300">Delete "<strong>{selectedNote?.title}</strong>"? This cannot be undone.</p>
          <div className="flex space-x-3 justify-end">
            <Button variant="outline" onClick={() => setSelectedNote(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => deleteNoteMutation.mutateAsync(selectedNote._id)} loading={deleteNoteMutation.isLoading}>Delete</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showBulkConfirm} onClose={() => setShowBulkConfirm(false)} title="Confirm Bulk Action" size="sm">
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <AlertTriangle className="h-5 w-5 text-yellow-400 shrink-0" />
            <p className="text-gray-300 text-sm">
              You are about to <strong className="text-yellow-400">{bulkAction}</strong> <strong>{selectedNoteIds.length}</strong> note(s). Are you sure?
            </p>
          </div>
          <div className="flex space-x-3 justify-end">
            <Button variant="outline" onClick={() => setShowBulkConfirm(false)}>Cancel</Button>
            <Button variant={bulkAction === 'delete' ? 'danger' : 'primary'}
              onClick={() => bulkActionMutation.mutate({ noteIds: selectedNoteIds, action: bulkAction })}
              loading={bulkActionMutation.isLoading}>
              Confirm {bulkAction}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showAnnouncementModal} onClose={() => setShowAnnouncementModal(false)} title="New Announcement" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Title *</label>
            <input value={announcementForm.title}
              onChange={(e) => setAnnouncementForm(p => ({ ...p, title: e.target.value }))}
              placeholder="e.g. Maintenance tonight at 10 PM"
              className="w-full px-3 py-2 rounded-lg bg-dark-accent border border-white/10 text-gray-200 text-sm focus:outline-none focus:border-primary-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Message *</label>
            <textarea value={announcementForm.message}
              onChange={(e) => setAnnouncementForm(p => ({ ...p, message: e.target.value }))}
              rows={3} placeholder="Describe the announcement..."
              className="w-full px-3 py-2 rounded-lg bg-dark-accent border border-white/10 text-gray-200 text-sm resize-none focus:outline-none focus:border-primary-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
            <select value={announcementForm.type}
              onChange={(e) => setAnnouncementForm(p => ({ ...p, type: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-dark-accent border border-white/10 text-gray-200 text-sm focus:outline-none focus:border-primary-400">
              <option value="info">ℹ️ Info</option>
              <option value="warning">⚠️ Warning</option>
              <option value="success">✅ Success</option>
              <option value="danger">🚨 Danger</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Expires At (optional)</label>
            <input type="datetime-local" value={announcementForm.expiresAt}
              onChange={(e) => setAnnouncementForm(p => ({ ...p, expiresAt: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-dark-accent border border-white/10 text-gray-200 text-sm focus:outline-none focus:border-primary-400" />
          </div>
          {announcementForm.title && (
            <div className={`rounded-lg border p-4 ${TYPE_STYLES[announcementForm.type]?.bg}`}>
              <p className={`font-semibold text-sm ${TYPE_STYLES[announcementForm.type]?.text}`}>{announcementForm.title}</p>
              {announcementForm.message && <p className="text-gray-300 text-xs mt-1">{announcementForm.message}</p>}
            </div>
          )}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowAnnouncementModal(false)}>Cancel</Button>
            <Button onClick={() => createAnnouncementMutation.mutate(announcementForm)}
              loading={createAnnouncementMutation.isLoading}
              disabled={!announcementForm.title || !announcementForm.message}>
              Publish Announcement
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Admin