import React from 'react'
import { cn } from '../../utils/helpers'

const Textarea = React.forwardRef(({
  className,
  error,
  label,
  rows = 4,
  ...props
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-gray-200">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-dark-border bg-dark-secondary px-3 py-2 text-sm ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-red-500 focus-visible:ring-red-500',
          className
        )}
        ref={ref}
        rows={rows}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  )
})

Textarea.displayName = 'Textarea'

export default Textarea
