import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import Button from '../ui/Button'

// ✅ Yahi fix hai — local worker, CDN nahi
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

const NotePreviewModal = ({ isOpen, onClose, note }) => {
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1.0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  if (!isOpen || !note) return null

  const isPDF = note.fileType === 'pdf'

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
    setPageNumber(1)
    setLoading(false)
    setError(false)
  }

  const onDocumentLoadError = (err) => {
    console.error('PDF load error:', err)
    setLoading(false)
    setError(true)
  }

  const goToPrevPage = () => setPageNumber(prev => Math.max(prev - 1, 1))
  const goToNextPage = () => setPageNumber(prev => Math.min(prev + 1, numPages))
  const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 2.5))
  const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5))
  const resetZoom = () => setScale(1.0)

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
              <button
                onClick={onClose}
                className="ml-4 p-2 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-dark-accent transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* PDF Toolbar */}
            {isPDF && !error && (
              <div className="flex items-center justify-between px-6 py-3 border-b border-dark-accent bg-dark-bg flex-shrink-0">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={goToPrevPage}
                    disabled={pageNumber <= 1}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-dark-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <span className="text-sm text-gray-300 min-w-[80px] text-center">
                    {loading ? 'Loading...' : `${pageNumber} / ${numPages}`}
                  </span>
                  <button
                    onClick={goToNextPage}
                    disabled={!numPages || pageNumber >= numPages}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-dark-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={zoomOut}
                    disabled={scale <= 0.5}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-dark-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </button>
                  <button
                    onClick={resetZoom}
                    className="px-3 py-1 text-xs text-gray-300 hover:text-gray-100 hover:bg-dark-accent rounded-lg transition-colors min-w-[52px] text-center"
                  >
                    {Math.round(scale * 100)}%
                  </button>
                  <button
                    onClick={zoomIn}
                    disabled={scale >= 2.5}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-dark-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Content Area */}
            <div className="flex-1 overflow-auto p-4 flex justify-center bg-gray-900">
              {isPDF ? (
                error ? (
                  // ✅ Error state
                  <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
                    <div className="text-5xl">⚠️</div>
                    <h3 className="text-xl font-semibold text-gray-100">
                      PDF load nahi ho saka
                    </h3>
                    <p className="text-gray-400 max-w-sm">
                      File preview available nahi hai. Please download karke dekho.
                    </p>
                  </div>
                ) : (
                  <Document
                    file={note.fileUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={
                      <div className="flex flex-col items-center justify-center py-20 space-y-3">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500" />
                        <p className="text-gray-400 text-sm">Loading PDF...</p>
                      </div>
                    }
                  >
                    <Page
                      pageNumber={pageNumber}
                      scale={scale}
                      className="shadow-2xl"
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                    />
                  </Document>
                )
              ) : (
                // Non-PDF files
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
                onClick={onClose}
              >
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