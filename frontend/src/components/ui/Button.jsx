import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/helpers'
import { Loader2 } from 'lucide-react'

const Button = React.forwardRef(({
  children,
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  ...props
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
  
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl',
    secondary: 'bg-dark-secondary text-gray-100 hover:bg-dark-accent border border-dark-border',
    outline: 'border border-dark-border text-gray-100 hover:bg-dark-accent',
    ghost: 'text-gray-100 hover:bg-dark-accent',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <motion.button
      ref={ref}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      {...props}
    >
      {loading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      )}
      {!loading && icon && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
    </motion.button>
  )
})

Button.displayName = 'Button'

export default Button
