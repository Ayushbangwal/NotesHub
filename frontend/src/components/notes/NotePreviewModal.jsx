import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, FileText, FileSpreadsheet, File } from 'lucide-react'
import Button from '../ui/Button'

const NotePreviewModal = ({ isOpen, onClose, note }) => {
  const [iframeLoading, setIframeLoading] = useState(true)
  const [iframeError, setIframeError] = useState(false)

  if (!isOpen || !note) return null

  const isPDF = note.fileType === 'pdf'

  const getFileIcon = (type) => {
    if (type === 'docx') return <FileText className="h-16 w-16 text-blue-400" />
    if (type === 'pptx') return <FileSpreadsheet className="h-16 w-16 text-orange-400" />
    return <File className="h-16 w-16 text-gray-400" />
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.88)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 24 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="bg-dark-card rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-white/5"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-dark-accent flex-shrink-0">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* File type badge */}
                <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-primary-500/15 text-primary-400 border border-primary-500/20 flex-shrink-0">
                  {note.fileType?.toUpperCase()}
                </span>
                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-gray-100 truncate leading-tight">
                    {note.title}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">{note.subject}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 ml-4 flex-shrink-0">
                <a
                  href={note.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-gray-500 hover:text-gray-200 hover:bg-white/8 transition-all"
                  title="Open in new tab"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-gray-500 hover:text-gray-200 hover:bg-white/8 transition-all"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative bg-[#1a1a1a]" style={{ minHeight: 0 }}>
              {isPDF ? (
                <>
                  {/* Loading overlay */}
                  {iframeLoading && !iframeError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-[#1a1a1a] gap-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-700 border-t-primary-500" />
                      <div className="text-center">
                        <p className="text-gray-300 text-sm font-medium">Loading PDF</p>
                        <p className="text-gray-600 text-xs mt-1">Hang tight...</p>
                      </div>
                    </div>
                  )}

                  {/* Error state */}
                  {iframeError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-[#1a1a1a] gap-4 text-center p-8">
                      <div className="text-5xl">⚠️</div>
                      <div>
                        <p className="text-gray-200 font-semibold">Preview failed to load</p>
                        <p className="text-gray-500 text-sm mt-1">Open in a new tab to view this PDF</p>
                      </div>
                      <a href={note.fileUrl} target="_blank" rel="noopener noreferrer">
                        <Button>Open PDF</Button>
                      </a>
                    </div>
                  )}

                  <iframe
                    key={note.fileUrl}
                    src={note.fileUrl}
                    className="w-full"
                    style={{
                      height: '75vh',
                      border: 'none',
                      display: iframeLoading || iframeError ? 'none' : 'block',
                    }}
                    title={note.title}
                    onLoad={() => setIframeLoading(false)}
                    onError={() => {
                      setIframeLoading(false)
                      setIframeError(true)
                    }}
                  />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-20 space-y-4 text-center px-8">
                  {getFileIcon(note.fileType)}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-200 mt-2">
                      Preview not available
                    </h3>
                    <p className="text-gray-500 text-sm mt-2 max-w-xs">
                      {note.fileType?.toUpperCase()} files can't be previewed directly.
                      Download the file to open it.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-3.5 border-t border-dark-accent flex-shrink-0">
              <p className="text-xs text-gray-600">
                {isPDF ? 'Use browser controls to zoom & navigate' : 'Download to view this file'}
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                <a
                  href={note.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                >
                  <Button>Download File</Button>
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default NotePreviewModal