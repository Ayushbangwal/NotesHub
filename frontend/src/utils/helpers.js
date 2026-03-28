import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function getFileIcon(fileType) {
  switch (fileType) {
    case 'pdf':
      return '📄'
    case 'docx':
      return '📝'
    case 'ppt':
      return '📊'
    default:
      return '📄'
  }
}

export function getSubjectColor(subject) {
  const colors = {
    'Mathematics': 'bg-blue-500',
    'Physics': 'bg-purple-500',
    'Chemistry': 'bg-green-500',
    'Biology': 'bg-emerald-500',
    'Computer Science': 'bg-indigo-500',
    'Engineering': 'bg-orange-500',
    'Medicine': 'bg-red-500',
    'Business': 'bg-yellow-500',
    'Economics': 'bg-amber-500',
    'History': 'bg-stone-500',
    'Literature': 'bg-pink-500',
    'Psychology': 'bg-violet-500',
    'Sociology': 'bg-teal-500',
    'Philosophy': 'bg-cyan-500',
    'Other': 'bg-gray-500'
  }
  return colors[subject] || 'bg-gray-500'
}

export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export function generateAvatarUrl(name) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=128`
}

export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    console.log('Text copied to clipboard')
  }).catch(err => {
    console.error('Failed to copy text: ', err)
  })
}
