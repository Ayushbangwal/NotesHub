import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink } from 'lucide-react'
import Button from '../ui/Button'

const getPreviewUrl = (url) => {
  if (!url) return url
  return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
}

const NotePreviewModal = ({ isOpen, onClose, note }) => {
  const [iframeLoading, setIframeLoading] = useState(true)

  if (!isOpen || !note) return null

  const isPDF = note.fileType === 'pdf'

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-dark-card rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-dark-accent flex-shrink-0">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-gray-100 truncate">
                  {note.title}
                </h2>
                <p className="text-sm text-gray-400">
                  {note.subject} • {note.fileType?.toUpperCase()}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                {/* Open in new tab button */}
                <a
                  href={note.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-dark-accent transition-colors"
                  title="New tab mein kholo"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-dark-accent transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative bg-gray-900">
              {isPDF ? (
                <>
                  {/* Loading overlay */}
                  {iframeLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-gray-900">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500 mb-3" />
                      <p className="text-gray-400 text-sm">Loading PDF...</p>
                    </div>
                  )}
                  <iframe
                    key={note.fileUrl}
                    src={getPreviewUrl(note.fileUrl)}
                    className="w-full h-full"
                    style={{ minHeight: '70vh', border: 'none' }}
                    title={note.title}
                    onLoad={() => setIframeLoading(false)}
                  />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
                  <div className="text-6xl">
                    {note.fileType === 'docx' ? '📄'
                      : note.fileType === 'pptx' ? '📊'
                      : '📁'}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-100">
                    Preview not available for {note.fileType?.toUpperCase()} files
                  </h3>
                  <p className="text-gray-400 max-w-sm">
                    Direct preview sirf PDF files ke liye supported hai.
                    Please download karo file dekhne ke liye.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end px-6 py-4 border-t border-dark-accent flex-shrink-0 gap-3">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <a
                href={note.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}>
                <Button>Download File</Button>
              </a>
            </div>
          </motion.div>
       </motion.div>
      )}
    </AnimatePresence>
  )
}

export default NotePreviewModal