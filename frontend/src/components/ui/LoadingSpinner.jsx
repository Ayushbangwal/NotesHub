import React from 'react'
import { cn } from '../../utils/helpers'

const LoadingSpinner = ({ size = 'md', className }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  }

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-gray-600 border-t-primary-500',
          sizes[size]
        )}
      />
    </div>
  )
}

export default LoadingSpinner
