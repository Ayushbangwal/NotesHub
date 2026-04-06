import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Download, Star, Bookmark, Eye, Calendar,
  User, FileText, Share2, Check, Link2, Flag
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../hooks/useAuth'
import { useDownloadNote, useToggleBookmark } from '../../hooks/useNotes'
import Button from '../ui/Button'
import NotePreviewModal from './NotePreviewModal'
import ReportModal from './ReportModal'
import { formatDate, formatFileSize, getFileIcon, getSubjectColor, truncateText } from '../../utils/helpers'

const NoteCard = ({ note, animate = true }) => {
  const { user, isAuthenticated } = useAuth()
  const downloadNote = useDownloadNote()
  const toggleBookmark = useToggleBookmark()
  const [copied, setCopied] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
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
    if (!isAuthenticated) { toast.error('Please login to download notes'); return }
    await downloadNote.mutateAsync(note._id)
  }

  const handleBookmark = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) { toast.error('Please login to bookmark notes'); return }
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
    window.open(`https://wa.me/?text=${encodeURIComponent(`Check out these notes: *${note.title}*\n${noteUrl}`)}`, '_blank')
    setShowShareMenu(false)
  }

  const handleTwitter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out "${note.title}" notes on NotesHub!`)}&url=${encodeURIComponent(noteUrl)}`, '_blank')
    setShowShareMenu(false)
  }

  const handlePreview = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setShowPreview(true)
  }

  const handleReport = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) { toast.error('Please login to report notes'); return }
    setShowReportModal(true)
  }

  const isBookmarked = note.bookmarks?.some(bookmark => bookmark._id === user?._id)
  const isOwnNote = note.uploadedBy?._id === user?._id || note.uploadedBy === user?._id

  return (
    <>
      <motion.div
        {...(animate && {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.35, ease: 'easeOut' }
        })}
        whileHover={{
          y: -6,
          transition: { duration: 0.2, ease: 'easeOut' }
        }}
        className="h-full group"
      >
        <Link to={`/notes/${note._id}`} className="block h-full">
          <div className="card card-glow h-full flex flex-col relative overflow-hidden">

            {/* Animated top border on hover */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 via-purple-500 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Header */}
            <div className="p-6 pb-4 flex-1">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <motion.span
                    className="text-2xl"
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.2 }}
                    transition={{ duration: 0.4 }}
                  >
                    {getFileIcon(note.fileType)}
                  </motion.span>
                  <span className={`px-2.5 py-1 text-xs font-medium text-white rounded-full ${getSubjectColor(note.subject)} shadow-sm`}>
                    {note.subject}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {isAuthenticated && !isOwnNote && (
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleReport}
                        className="p-1 text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
                        title="Report this note"
                      >
                        <Flag className="h-3.5 w-3.5" />
                      </Button>
                    </motion.div>
                  )}
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleBookmark}
                      className={`p-1 transition-all duration-200 ${isBookmarked ? 'text-primary-400' : 'text-gray-400 hover:text-primary-400'}`}
                    >
                      <Bookmark className={`h-4 w-4 transition-all duration-200 ${isBookmarked ? 'fill-current scale-110' : ''}`} />
                    </Button>
                  </motion.div>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-100 mb-2 line-clamp-2 group-hover:text-primary-300 transition-colors duration-200">
                {truncateText(note.title, 60)}
              </h3>

              <p className="text-sm text-gray-400 mb-4 line-clamp-3 leading-relaxed">
                {truncateText(note.description, 120)}
              </p>

              {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {note.tags.slice(0, 3).map((tag, index) => (
                    <motion.span
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      className="px-2 py-0.5 text-xs bg-dark-accent text-gray-300 rounded-md hover:bg-primary-500/20 hover:text-primary-300 transition-colors duration-200 cursor-default"
                    >
                      #{tag}
                    </motion.span>
                  ))}
                  {note.tags.length > 3 && (
                    <span className="px-2 py-0.5 text-xs bg-dark-accent text-gray-400 rounded-md">
                      +{note.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 pb-5 space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1 hover:text-gray-300 transition-colors">
                    <Download className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium">{note.downloads}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400/50" />
                    <span className="text-xs font-medium text-yellow-400">{note.averageRating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <FileText className="h-3 w-3" />
                  <span>{formatFileSize(note.fileSize)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-1 hover:text-gray-400 transition-colors">
                  <User className="h-3 w-3" />
                  <span>{note.uploadedBy?.username || 'Anonymous'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(note.createdAt)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-1">
                <motion.div className="flex-1" whileTap={{ scale: 0.97 }}>
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={handleDownload}
                    loading={downloadNote.isLoading}
                  >
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    Download
                  </Button>
                </motion.div>

                {/* Share */}
                <div className="relative" ref={shareMenuRef}>
                  <motion.div whileTap={{ scale: 0.93 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowShareMenu(prev => !prev) }}
                      className={`transition-all duration-200 ${copied ? 'text-green-400 border-green-400/50' : 'text-gray-400 hover:text-primary-400 hover:border-primary-500/50'}`}
                      title="Share"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                    </Button>
                  </motion.div>

                  <AnimatePresence>
                    {showShareMenu && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 8 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute bottom-full mb-2 right-0 z-50 w-48 rounded-xl overflow-hidden shadow-2xl border border-white/10"
                        style={{ background: 'linear-gradient(145deg, #1e2035, #16182a)' }}
                        onClick={e => e.stopPropagation()}
                      >
                        <div className="px-4 py-2 border-b border-white/5">
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Share via</p>
                        </div>
                        {[
                          {
                            onClick: handleCopyLink,
                            icon: copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Link2 className="h-3.5 w-3.5 text-gray-400" />,
                            iconBg: copied ? 'bg-green-500/20' : 'bg-white/5',
                            label: copied ? 'Copied!' : 'Copy Link',
                            labelColor: copied ? 'text-green-400' : 'text-gray-300'
                          },
                          {
                            onClick: handleWhatsApp,
                            icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
                            iconBg: 'bg-green-500/10 group-hover:bg-green-500/20',
                            label: 'WhatsApp',
                            labelColor: 'text-gray-300'
                          },
                          {
                            onClick: handleTwitter,
                            icon: <svg viewBox="0 0 24 24" fill="currentColor" className="text-sky-400 w-3.5 h-3.5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
                            iconBg: 'bg-sky-500/10 group-hover:bg-sky-500/20',
                            label: 'Twitter / X',
                            labelColor: 'text-gray-300'
                          }
                        ].map((item, i) => (
                          <React.Fragment key={i}>
                            {i > 0 && <div className="mx-4 border-t border-white/5" />}
                            <button
                              onClick={item.onClick}
                              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-all duration-150 group hover:bg-white/5"
                            >
                              <span className={`flex items-center justify-center w-7 h-7 rounded-lg transition-colors ${item.iconBg}`}>
                                {item.icon}
                              </span>
                              <span className={item.labelColor}>{item.label}</span>
                            </button>
                          </React.Fragment>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Preview */}
                <motion.div whileTap={{ scale: 0.93 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreview}
                    title="Preview"
                    className="text-gray-400 hover:text-primary-400 hover:border-primary-500/50 transition-all duration-200"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>

      <NotePreviewModal isOpen={showPreview} onClose={() => setShowPreview(false)} note={note} />
      {showReportModal && (
        <ReportModal noteId={note._id} noteTitle={note.title} onClose={() => setShowReportModal(false)} />
      )}
    </>
  )
}

export default NoteCard