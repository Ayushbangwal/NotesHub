import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Download, 
  Star, 
  Bookmark, 
  Eye, 
  Calendar,
  User,
  FileText,
  Share2,
  Check,
  Link2
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../hooks/useAuth'
import { useDownloadNote, useToggleBookmark } from '../../hooks/useNotes'
import Button from '../ui/Button'
import NotePreviewModal from './NotePreviewModal'
import { formatDate, formatFileSize, getFileIcon, getSubjectColor, truncateText } from '../../utils/helpers'

const NoteCard = ({ note, animate = true }) => {
  const { user, isAuthenticated } = useAuth()
  const downloadNote = useDownloadNote()
  const toggleBookmark = useToggleBookmark()
  const [copied, setCopied] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const shareMenuRef = useRef(null)

  const noteUrl = `${window.location.origin}/notes/${note._id}`

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(e.target)) {
        setShowShareMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

  const handleCopyLink = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(noteUrl)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = noteUrl
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setShowShareMenu(false)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleWhatsApp = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const text = `Check out these notes: *${note.title}*\n${noteUrl}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
    setShowShareMenu(false)
  }

  const handleTwitter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const text = `Check out "${note.title}" notes on NotesHub!`
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(noteUrl)}`,
      '_blank'
    )
    setShowShareMenu(false)
  }

  const handlePreview = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setShowPreview(true)
  }

  const isBookmarked = note.bookmarks?.some(bookmark => bookmark._id === user?._id)
  const MotionComponent = animate ? motion.div : 'div'
  
  return (
    <>
      <MotionComponent
        {...(animate && {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.3 }
        })}
        whileHover={{ 
          y: -6,
          scale: 1.02,
          boxShadow: "0 20px 40px rgba(99, 102, 241, 0.15)"
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
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

              <h3 className="text-lg font-semibold text-gray-100 mb-2 line-clamp-2">
                {truncateText(note.title, 60)}
              </h3>

              <p className="text-sm text-gray-400 mb-4 line-clamp-3">
                {truncateText(note.description, 120)}
              </p>

              {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {note.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="px-2 py-1 text-xs bg-dark-accent text-gray-300 rounded">
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

                {/* Share Dropdown */}
                <div className="relative" ref={shareMenuRef}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setShowShareMenu(prev => !prev)
                    }}
                    className={`transition-all duration-200 ${copied ? 'text-green-400 border-green-400' : 'text-gray-400'}`}
                    title="Share"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                  </Button>

                  {showShareMenu && (
                    <div
                      className="absolute bottom-full mb-2 right-0 z-50 bg-dark-card border border-dark-accent rounded-xl shadow-xl overflow-hidden w-44"
                      onClick={e => e.stopPropagation()}
                    >
                      <button
                        onClick={handleCopyLink}
                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-dark-accent transition-colors"
                      >
                        {copied
                          ? <Check className="h-4 w-4 text-green-400" />
                          : <Link2 className="h-4 w-4 text-gray-400" />
                        }
                        {copied ? 'Copied!' : 'Copy Link'}
                      </button>
                      <button
                        onClick={handleWhatsApp}
                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-dark-accent transition-colors"
                      >
                        <span className="text-base">💬</span>
                        WhatsApp
                      </button>
                      <button
                        onClick={handleTwitter}
                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-dark-accent transition-colors"
                      >
                        <span className="text-base">🐦</span>
                        Twitter / X
                      </button>
                    </div>
                  )}
                </div>

                {/* Preview Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreview}
                  title="Preview"
                  className="text-gray-400 hover:text-primary-400"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Link>
      </MotionComponent>

      <NotePreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        note={note}
      />
    </>
  )
}

export default NoteCard