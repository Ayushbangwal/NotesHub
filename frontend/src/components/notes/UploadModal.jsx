import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { Upload, X, FileText } from 'lucide-react'
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
  const [uploadProgress, setUploadProgress] = useState(0) // ✅ NEW
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
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors: ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b']
    })
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors: ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b']
    })
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 100,
        origin: { x: 0.5, y: 0.5 },
        colors: ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b']
      })
    }, 200)
  }

  const onDrop = (acceptedFiles, fileRejections) => {
    if (fileRejections.length > 0) {
      const rejection = fileRejections[0]
      if (rejection.errors.some(err => err.code === 'file-too-large')) {
        toast.error('File size must be less than 10MB')
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
    setErrors({})
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.ppt']
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.subject) newErrors.subject = 'Subject is required'
    if (!file) newErrors.file = 'Please select a file'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ✅ NEW - XHR se upload taaki progress track ho sake
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

      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'))
      })

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
    setUploadProgress(0) // ✅ Reset progress

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

      // Notes list refresh karo
      queryClient.invalidateQueries({ queryKey: ['notes'] })

      fireConfetti()
      toast.success('🎉 Note uploaded successfully!')
      onClose()
      resetForm()
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
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Select File (PDF, DOCX, PPT - Max 10MB)
          </label>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary-500 bg-primary-500/10'
                : 'border-dark-border hover:border-primary-500/50'
            } ${errors.file ? 'border-red-500' : ''}`}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <Upload className="h-12 w-12 text-gray-400 mx-auto" />
              <div>
                {isDragActive ? (
                  <p className="text-primary-400">Drop the file here...</p>
                ) : (
                  <div>
                    <p className="text-gray-300">
                      Drag & drop a file here, or click to select
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      PDF, DOCX, PPT files up to 10MB
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          {errors.file && (
            <p className="text-red-400 text-sm mt-2">{errors.file}</p>
          )}

          {file && (
            <div className="mt-4 p-3 bg-dark-accent rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-primary-400" />
                <div>
                  <p className="text-sm font-medium text-gray-100">{file.name}</p>
                  <p className="text-xs text-gray-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="text-red-400 hover:text-red-300"
                disabled={uploading}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* ✅ NEW - Progress Bar — sirf uploading ke waqt dikhega */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">
                {uploadProgress < 100 ? 'Uploading...' : 'Processing...'}
              </span>
              <span className="text-sm font-medium text-primary-400">
                {uploadProgress}%
              </span>
            </div>
            <div className="w-full bg-dark-border rounded-full h-2.5 overflow-hidden">
              <motion.div
                className="h-2.5 rounded-full bg-gradient-to-r from-primary-600 to-primary-400"
                initial={{ width: '0%' }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>
            {uploadProgress === 100 && (
              <p className="text-xs text-gray-500 text-center">
                Almost done — saving to server...
              </p>
            )}
          </div>
        )}

        {/* Note Details */}
        <div className="grid grid-cols-1 gap-4">
          <Input
            name="title"
            label="Note Title"
            placeholder="Enter a descriptive title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            required
          />
          <Textarea
            name="description"
            label="Description"
            placeholder="Describe what this note contains..."
            value={formData.description}
            onChange={handleChange}
            error={errors.description}
            rows={4}
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
          <Input
            name="tags"
            label="Tags (Optional)"
            placeholder="calculus, mathematics, study-guide"
            value={formData.tags}
            onChange={handleChange}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={handleClose} disabled={uploading}>
            Cancel
          </Button>
          <Button type="submit" loading={uploading} disabled={uploading}>
            {uploading ? `Uploading ${uploadProgress}%` : 'Upload Note'}
          </Button>
        </div>

      </form>
    </Modal>
  )
}

export default UploadModal

//VITE_API_URL=http://localhost:5000