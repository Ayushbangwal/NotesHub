import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { Upload, X, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import Button from '../ui/Button'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import Select from '../ui/Select'
import { validateFile } from '../../utils/validators'
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'
import { useQueryClient } from '@tanstack/react-query'

const UploadModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    tags: ''
  })
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadDone, setUploadDone] = useState(false)
  const [errors, setErrors] = useState({})

  const queryClient = useQueryClient()

  const subjects = [
    { value: '', label: 'Select a subject' },
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'Physics', label: 'Physics' },
    { value: 'Chemistry', label: 'Chemistry' },
    { value: 'Biology', label: 'Biology' },
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Medicine', label: 'Medicine' },
    { value: 'Business', label: 'Business' },
    { value: 'Economics', label: 'Economics' },
    { value: 'History', label: 'History' },
    { value: 'Literature', label: 'Literature' },
    { value: 'Psychology', label: 'Psychology' },
    { value: 'Sociology', label: 'Sociology' },
    { value: 'Philosophy', label: 'Philosophy' },
    { value: 'Other', label: 'Other' }
  ]

  const fireConfetti = () => {
    confetti({ particleCount: 80, angle: 60, spread: 55, origin: { x: 0, y: 0.6 }, colors: ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'] })
    confetti({ particleCount: 80, angle: 120, spread: 55, origin: { x: 1, y: 0.6 }, colors: ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'] })
    setTimeout(() => {
      confetti({ particleCount: 50, spread: 100, origin: { x: 0.5, y: 0.5 }, colors: ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'] })
    }, 200)
  }

  const getFileIcon = (fileName) => {
    const ext = fileName?.split('.').pop()?.toLowerCase()
    const icons = { pdf: '📄', docx: '📝', ppt: '📊', pptx: '📊' }
    return icons[ext] || '📁'
  }

  const getFileTypeLabel = (fileName) => {
    const ext = fileName?.split('.').pop()?.toUpperCase()
    return ext || 'FILE'
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`
  }

  const onDrop = (acceptedFiles, fileRejections) => {
    if (fileRejections.length > 0) {
      const rejection = fileRejections[0]
      if (rejection.errors.some(err => err.code === 'file-too-large')) {
        toast.error('File size must be less than 50MB') // ✅ updated
      } else if (rejection.errors.some(err => err.code === 'file-invalid-type')) {
        toast.error('Only PDF, DOCX, and PPT files are allowed')
      }
      return
    }
    const selectedFile = acceptedFiles[0]
    const validation = validateFile(selectedFile)
    if (!validation.isValid) {
      const errorMessages = Object.values(validation.errors).filter(err => err)
      toast.error(errorMessages[0] || 'Invalid file')
      return
    }
    setFile(selectedFile)
    setErrors(prev => ({ ...prev, file: '' }))
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.ppt', '.pptx']
    },
    maxSize: 50 * 1024 * 1024, 
    
    multiple: false
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.subject) newErrors.subject = 'Please select a subject'
    if (!file) newErrors.file = 'Please select a file to upload'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const uploadWithProgress = (formDataToSend) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100)
          setUploadProgress(percent)
        }
      })
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText))
        } else {
          const errorData = JSON.parse(xhr.responseText)
          reject(new Error(errorData.message || 'Upload failed'))
        }
      })
      xhr.addEventListener('error', () => reject(new Error('Network error during upload')))
      const token = localStorage.getItem('token')
      xhr.open('POST', `${import.meta.env.VITE_API_URL}/notes`)
      xhr.setRequestHeader('Authorization', `Bearer ${token}`)
      xhr.send(formDataToSend)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setUploading(true)
    setUploadProgress(0)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('subject', formData.subject)
      formDataToSend.append('tags', formData.tags)
      formDataToSend.append('file', file)
      formDataToSend.append('fileName', file.name)
      formDataToSend.append('fileType', file.name.split('.').pop().toLowerCase())
      formDataToSend.append('fileSize', file.size)

      await uploadWithProgress(formDataToSend)

      setUploadDone(true)
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      fireConfetti()
      toast.success('🎉 Note uploaded successfully!')

      setTimeout(() => {
        onClose()
        resetForm()
      }, 1200)
    } catch (error) {
      toast.error(error.message || 'Upload failed. Please try again.')
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const resetForm = () => {
    setFormData({ title: '', description: '', subject: '', tags: '' })
    setFile(null)
    setErrors({})
    setUploadProgress(0)
    setUploadDone(false)
  }

  const handleClose = () => {
    if (!uploading) {
      onClose()
      resetForm()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Upload New Note" size="lg"
      className="max-h-[90vh] overflow-y-auto">
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* ── File Drop Zone ── */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
            Select File
          </label>

          <AnimatePresence mode="wait">
            {!file ? (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                {...getRootProps()}
                className={`relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200
                  ${isDragActive
                    ? 'border-primary-500 bg-primary-500/10 scale-[1.01]'
                    : 'border-dark-border hover:border-primary-500/60 hover:bg-primary-500/5'
                  }
                  ${errors.file ? 'border-red-500/70 bg-red-500/5' : ''}
                `}
              >
                <input {...getInputProps()} />
                <motion.div
                  animate={isDragActive ? { y: -4 } : { y: 0 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="flex flex-col items-center gap-3"
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors
                    ${isDragActive ? 'bg-primary-500/20' : 'bg-dark-accent'}`}>
                    <Upload className={`h-6 w-6 transition-colors ${isDragActive ? 'text-primary-400' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <p className={`text-sm font-medium transition-colors ${isDragActive ? 'text-primary-300' : 'text-gray-200'}`}>
                      {isDragActive ? 'Drop it here!' : 'Drag & drop your file'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">or <span className="text-primary-400 underline underline-offset-2">browse to upload</span></p>
                  </div>
                  <div className="flex gap-2 mt-1">
                    {['PDF', 'DOCX', 'PPT'].map(type => (
                      <span key={type} className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-dark-accent text-gray-400 border border-dark-border">
                        {type}
                      </span>
                    ))}
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-dark-accent text-gray-500 border border-dark-border">
                      Max 50MB  {/* ✅ updated */}
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="file-preview"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="rounded-xl border border-dark-border bg-dark-accent p-4 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-lg bg-primary-500/15 border border-primary-500/30 flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-base leading-none">{getFileIcon(file.name)}</span>
                  <span className="text-[9px] font-bold text-primary-400 mt-0.5">{getFileTypeLabel(file.name)}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-100 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{formatFileSize(file.size)}</p>
                  {uploading && (
                    <div className="mt-2 h-1 bg-dark-border rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                      />
                    </div>
                  )}
                </div>

                {!uploading && (
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="flex-shrink-0 w-7 h-7 rounded-full bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}

                {uploadDone && (
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {errors.file && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-1.5 text-red-400 text-xs mt-2"
            >
              <AlertCircle className="h-3 w-3" />
              {errors.file}
            </motion.p>
          )}
        </div>

        {/* ── Upload Progress Bar ── */}
        <AnimatePresence>
          {uploading && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="rounded-xl bg-dark-accent border border-dark-border p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">
                    {uploadProgress < 100 ? '⚡ Uploading your note...' : '✨ Processing...'}
                  </span>
                  <span className="text-xs font-semibold text-primary-400">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-dark-border rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-2 rounded-full bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400"
                    initial={{ width: '0%' }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  />
                </div>
                {uploadProgress === 100 && (
                  <p className="text-[11px] text-gray-500 text-center">Saving to server — almost there!</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Divider ── */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-dark-border" />
          <span className="text-[10px] uppercase tracking-widest text-gray-600 font-semibold">Note Details</span>
          <div className="flex-1 h-px bg-dark-border" />
        </div>

        {/* ── Form Fields ── */}
        <div className="grid grid-cols-1 gap-4">
          <Input
            name="title"
            label="Note Title"
            placeholder="e.g. Calculus Chapter 3 — Integration"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            required
          />
          <Textarea
            name="description"
            label="Description"
            placeholder="What topics does this note cover? Who is it useful for?"
            value={formData.description}
            onChange={handleChange}
            error={errors.description}
            rows={3}
            required
          />
          <Select
            name="subject"
            label="Subject"
            value={formData.subject}
            onChange={handleChange}
            options={subjects}
            error={errors.subject}
            required
          />
          <div>
            <Input
              name="tags"
              label="Tags"
              placeholder="calculus, integration, maths (comma separated)"
              value={formData.tags}
              onChange={handleChange}
            />
            <p className="text-[11px] text-gray-600 mt-1 ml-0.5">Optional — helps others discover your note</p>
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex justify-end items-center gap-3 pt-1">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={uploading}
            className="px-5"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={uploading}
            disabled={uploading}
            className="px-6 min-w-[140px]"
          >
            {uploading
              ? `Uploading ${uploadProgress}%`
              : uploadDone
              ? '✓ Uploaded!'
              : 'Upload Note'}
          </Button>
        </div>

      </form>
    </Modal>
  )
}

export default UploadModal