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
    e.preventDefault(); e.stopPropagation()
    if (!isAuthenticated) { toast.error('Please login to download notes'); return }
    await downloadNote.mutateAsync(note._id)
  }

  const handleBookmark = async (e) => {
    e.preventDefault(); e.stopPropagation()
    if (!isAuthenticated) { toast.error('Please login to bookmark notes'); return }
    await toggleBookmark.mutateAsync(note._id)
  }

  const handleCopyLink = async (e) => {
    e.preventDefault(); e.stopPropagation()
    try { await navigator.clipboard.writeText(noteUrl) } catch {
      const ta = document.createElement('textarea')
      ta.value = noteUrl; document.body.appendChild(ta)
      ta.select(); document.execCommand('copy'); document.body.removeChild(ta)
    }
    setCopied(true); setShowShareMenu(false)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleWhatsApp = (e) => {
    e.preventDefault(); e.stopPropagation()
    window.open(`https://wa.me/?text=${encodeURIComponent(`Check out these notes: *${note.title}*\n${noteUrl}`)}`, '_blank')
    setShowShareMenu(false)
  }

  const handleTwitter = (e) => {
    e.preventDefault(); e.stopPropagation()
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out "${note.title}" notes on NotesHub!`)}&url=${encodeURIComponent(noteUrl)}`, '_blank')
    setShowShareMenu(false)
  }

  const handlePreview = (e) => { e.preventDefault(); e.stopPropagation(); setShowPreview(true) }
  const handleReport = (e) => {
    e.preventDefault(); e.stopPropagation()
    if (!isAuthenticated) { toast.error('Please login to report notes'); return }
    setShowReportModal(true)
  }

  const isBookmarked = note.bookmarks?.some(b => b._id === user?._id)
  const isOwnNote = note.uploadedBy?._id === user?._id || note.uploadedBy === user?._id

  return (
    <>
      <motion.div
        {...(animate && {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.35, ease: 'easeOut' }
        })}
        whileHover={{ y: -5, transition: { duration: 0.2, ease: 'easeOut' } }}
        className="h-full group"
      >
        <Link to={`/notes/${note._id}`} className="block h-full">
          <div className="relative h-full flex flex-col rounded-2xl overflow-hidden border border-white/[0.08] bg-dark-secondary hover:border-primary-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10">

            {/* Top gradient line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Card body */}
            <div className="p-5 flex-1 flex flex-col">

              {/* Top row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-dark-accent border border-white/[0.06] flex items-center justify-center text-lg flex-shrink-0">
                    {getFileIcon(note.fileType)}
                  </div>
                  <div>
                    <span className={`px-2.5 py-0.5 text-[11px] font-semibold text-white rounded-full ${getSubjectColor(note.subject)}`}>
                      {note.subject}
                    </span>
                    <p className="text-[10px] text-gray-500 mt-0.5 font-medium">
                      {note.fileType?.toUpperCase()} · {formatFileSize(note.fileSize)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-0.5">
                  {isAuthenticated && !isOwnNote && (
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                      onClick={handleReport}
                      className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-all"
                    >
                      <Flag className="h-3.5 w-3.5" />
                    </motion.button>
                  )}
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={handleBookmark}
                    className={`p-1.5 rounded-lg transition-all duration-200 ${isBookmarked ? 'text-primary-400 bg-primary-400/10' : 'text-gray-500 hover:text-primary-400 hover:bg-primary-400/10'}`}
                  >
                    <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  </motion.button>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-[15px] font-semibold text-gray-100 mb-1.5 line-clamp-2 leading-snug group-hover:text-primary-300 transition-colors duration-200">
                {truncateText(note.title, 65)}
              </h3>

              {/* Description */}
              <p className="text-[13px] text-gray-500 mb-3 line-clamp-2 leading-relaxed flex-1">
                {truncateText(note.description, 100)}
              </p>

              {/* Tags */}
              {note.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {note.tags.slice(0, 3).map((tag, i) => (
                    <span key={i}
                      className="px-2 py-0.5 text-[11px] bg-dark-accent text-gray-400 rounded-md border border-white/[0.05] hover:bg-primary-500/15 hover:text-primary-300 hover:border-primary-500/30 transition-all duration-200"
                    >
                      #{tag}
                    </span>
                  ))}
                  {note.tags.length > 3 && (
                    <span className="px-2 py-0.5 text-[11px] bg-dark-accent text-gray-600 rounded-md border border-white/[0.04]">
                      +{note.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Stats row */}
              <div className="flex items-center justify-between text-[12px] mb-3">
                <div className="flex items-center gap-3">
                  {/* Stars */}
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-yellow-400 font-semibold">{note.averageRating.toFixed(1)}</span>
                  </div>
                  {/* Downloads */}
                  <div className="flex items-center gap-1 text-gray-400">
                    <Download className="h-3 w-3" />
                    <span>{note.downloads}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-gray-600 text-[11px]">
                  <FileText className="h-3 w-3" />
                  <span>{formatFileSize(note.fileSize)}</span>
                </div>
              </div>

              {/* Uploader + Date */}
              <div className="flex items-center justify-between text-[11px] text-gray-500 mb-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center">
                    <span className="text-[9px] font-bold text-primary-300 uppercase">
                      {note.uploadedBy?.username?.[0] || 'A'}
                    </span>
                  </div>
                  <span className="text-gray-400">{note.uploadedBy?.username || 'Anonymous'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(note.createdAt)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleDownload}
                  disabled={downloadNote.isLoading}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-[13px] font-medium transition-all duration-200 disabled:opacity-50"
                >
                  {downloadNote.isLoading
                    ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <Download className="h-3.5 w-3.5" />
                  }
                  Download
                </motion.button>

                <motion.button whileTap={{ scale: 0.93 }} onClick={handlePreview}
                  className="p-2 rounded-xl border border-white/[0.08] bg-dark-accent text-gray-400 hover:text-primary-400 hover:border-primary-500/40 hover:bg-primary-500/10 transition-all duration-200"
                >
                  <Eye className="h-4 w-4" />
                </motion.button>

                <div className="relative" ref={shareMenuRef}>
                  <motion.button whileTap={{ scale: 0.93 }}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowShareMenu(p => !p) }}
                    className={`p-2 rounded-xl border transition-all duration-200 ${
                      copied
                        ? 'text-green-400 border-green-400/30 bg-green-400/10'
                        : 'border-white/[0.08] bg-dark-accent text-gray-400 hover:text-primary-400 hover:border-primary-500/40 hover:bg-primary-500/10'
                    }`}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                  </motion.button>

                  <AnimatePresence>
                    {showShareMenu && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-full mb-2 right-0 z-50 w-48 rounded-xl overflow-hidden shadow-2xl border border-white/10"
                        style={{ background: 'linear-gradient(145deg, #1e2035, #16182a)' }}
                        onClick={e => e.stopPropagation()}
                      >
                        <div className="px-4 py-2 border-b border-white/5">
                          <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest">Share via</p>
                        </div>
                        {[
                          {
                            onClick: handleCopyLink,
                            icon: copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Link2 className="h-3.5 w-3.5 text-gray-400" />,
                            iconBg: copied ? 'bg-green-500/20' : 'bg-white/5',
                            label: copied ? 'Copied!' : 'Copy Link',
                            color: copied ? 'text-green-400' : 'text-gray-300'
                          },
                          {
                            onClick: handleWhatsApp,
                            icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
                            iconBg: 'bg-green-500/10',
                            label: 'WhatsApp',
                            color: 'text-gray-300'
                          },
                          {
                            onClick: handleTwitter,
                            icon: <svg viewBox="0 0 24 24" fill="currentColor" className="text-sky-400 w-3.5 h-3.5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
                            iconBg: 'bg-sky-500/10',
                            label: 'Twitter / X',
                            color: 'text-gray-300'
                          }
                        ].map((item, i) => (
                          <React.Fragment key={i}>
                            {i > 0 && <div className="mx-4 border-t border-white/5" />}
                            <button onClick={item.onClick}
                              className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-white/5 transition-all duration-150"
                            >
                              <span className={`flex items-center justify-center w-7 h-7 rounded-lg ${item.iconBg}`}>{item.icon}</span>
                              <span className={`text-[13px] ${item.color}`}>{item.label}</span>
                            </button>
                          </React.Fragment>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
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