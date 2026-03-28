import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Download, 
  Star, 
  Bookmark, 
  Calendar,
  User,
  FileText,
  ArrowLeft,
  Share2,
  Flag,
  Edit,
  Trash2
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useNote, useDownloadNote, useRateNote, useToggleBookmark, useDeleteNote } from '../hooks/useNotes'
import Button from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import Modal from '../components/ui/Modal'
import { formatDate, formatFileSize, getFileIcon, getSubjectColor } from '../utils/helpers'

const NoteDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)

  const { data: noteData, isLoading, error } = useNote(id)
  const downloadNote = useDownloadNote()
  const rateNote = useRateNote()
  const toggleBookmark = useToggleBookmark()
  const deleteNote = useDeleteNote()

  const note = noteData?.note

  const handleDownload = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to download notes')
      return
    }
    await downloadNote.mutateAsync(id)
  }

  const handleRating = async (newRating) => {
    if (!isAuthenticated) {
      toast.error('Please login to rate notes')
      return
    }
    await rateNote.mutateAsync({ id, rating: newRating })
    setRating(newRating)
  }

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to bookmark notes')
      return
    }
    await toggleBookmark.mutateAsync(id)
  }

  const handleDelete = async () => {
    await deleteNote.mutateAsync(id)
    navigate('/dashboard')
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: note.title,
        text: note.description,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  const isBookmarked = note?.bookmarks?.some(bookmark => bookmark._id === user?._id)
  const isOwner = note?.uploadedBy?._id === user?._id
  const userRating = note?.ratings?.find(r => r.user._id === user?._id)?.rating || 0

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !note) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-100 mb-2">Note not found</h3>
          <p className="text-gray-400 mb-4">The note you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/notes')}>Back to Notes</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        icon={<ArrowLeft className="h-4 w-4" />}
      >
        Back
      </Button>

      {/* Note Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-3xl">{getFileIcon(note.fileType)}</span>
                  <span className={`px-3 py-1 text-sm font-medium text-white rounded-full ${getSubjectColor(note.subject)}`}>
                    {note.subject}
                  </span>
                </div>
                
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-100 mb-4">
                  {note.title}
                </h1>
                
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {note.description}
                </p>

                {/* Tags */}
                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {note.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-sm bg-dark-accent text-gray-300 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Author Info */}
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{note.uploadedBy?.username || 'Anonymous'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(note.createdAt)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FileText className="h-4 w-4" />
                    <span>{formatFileSize(note.fileSize)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col space-y-3 lg:w-48">
                <Button
                  onClick={handleDownload}
                  loading={downloadNote.isLoading}
                  icon={<Download className="h-4 w-4" />}
                >
                  Download
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleBookmark}
                  icon={<Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />}
                >
                  {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleShare}
                  icon={<Share2 className="h-4 w-4" />}
                >
                  Share
                </Button>

                {isOwner && (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/notes/${id}/edit`)}
                      icon={<Edit className="h-4 w-4" />}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => setShowDeleteModal(true)}
                      icon={<Trash2 className="h-4 w-4" />}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats and Rating */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-400">{note.downloads}</div>
                  <div className="text-sm text-gray-400">Downloads</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{note.averageRating.toFixed(1)}</div>
                  <div className="text-sm text-gray-400">Average Rating</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rate this Note</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="text-2xl transition-colors"
                      disabled={!isAuthenticated}
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= (hoveredRating || userRating || rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-center text-sm text-gray-400">
                  {userRating ? `You rated: ${userRating} stars` : 'Click to rate'}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Note"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to delete "{note.title}"? This action cannot be undone.
          </p>
          <div className="flex space-x-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              loading={deleteNote.isLoading}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default NoteDetail
