import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Download, 
  Star, 
  Bookmark, 
  Eye, 
  Calendar,
  User,
  FileText
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useDownloadNote, useToggleBookmark } from '../../hooks/useNotes'
import Button from '../ui/Button'
import { formatDate, formatFileSize, getFileIcon, getSubjectColor, truncateText } from '../../utils/helpers'

const NoteCard = ({ note, animate = true }) => {
  const { user, isAuthenticated } = useAuth()
  const downloadNote = useDownloadNote()
  const toggleBookmark = useToggleBookmark()

  const handleDownload = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) {
      toast.error('Please login to download notes')
      return
    }
    await downloadNote.mutateAsync(note._id)
  }

  const handleBookmark = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) {
      toast.error('Please login to bookmark notes')
      return
    }
    await toggleBookmark.mutateAsync(note._id)
  }

  const isBookmarked = note.bookmarks?.some(bookmark => bookmark._id === user?._id)
  const isOwner = note.uploadedBy?._id === user?._id

  const MotionComponent = animate ? motion.div : 'div'
  
  return (
    <MotionComponent
      {...(animate && {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3 }
      })}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Link to={`/notes/${note._id}`} className="block h-full">
        <div className="card hover-lift h-full flex flex-col">
          {/* Header */}
          <div className="p-6 pb-4 flex-1">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getFileIcon(note.fileType)}</span>
                <span className={`px-2 py-1 text-xs font-medium text-white rounded-full ${getSubjectColor(note.subject)}`}>
                  {note.subject}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className={`p-1 ${isBookmarked ? 'text-primary-400' : 'text-gray-400'}`}
              >
                <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </Button>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-100 mb-2 line-clamp-2">
              {truncateText(note.title, 60)}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-400 mb-4 line-clamp-3">
              {truncateText(note.description, 120)}
            </p>

            {/* Tags */}
            {note.tags && note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {note.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-dark-accent text-gray-300 rounded"
                  >
                    {tag}
                  </span>
                ))}
                {note.tags.length > 3 && (
                  <span className="px-2 py-1 text-xs bg-dark-accent text-gray-300 rounded">
                    +{note.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 pb-4 space-y-3">
            {/* Stats */}
            <div className="flex items-center justify-between text-sm text-gray-400">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Download className="h-4 w-4" />
                  <span>{note.downloads}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{note.averageRating.toFixed(1)}</span>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-xs">
                <FileText className="h-3 w-3" />
                <span>{formatFileSize(note.fileSize)}</span>
              </div>
            </div>

            {/* Author and Date */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <User className="h-3 w-3" />
                <span>{note.uploadedBy?.username || 'Anonymous'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(note.createdAt)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button
                size="sm"
                className="flex-1"
                onClick={handleDownload}
                loading={downloadNote.isLoading}
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </MotionComponent>
  )
}

export default NoteCard
