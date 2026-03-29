import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/helpers'

const Card = React.forwardRef(({
  className,
  children,
  hover = false,
  animate = false,
  ...props
}, ref) => {
  const MotionComponent = animate ? motion.div : 'div'
  
  return (
    <MotionComponent
      ref={ref}
      className={cn(
        'rounded-lg border border-dark-border bg-dark-secondary text-gray-100 shadow-sm',
        hover && 'transition-all duration-300 hover:shadow-xl hover:border-primary-500/50 hover:scale-[1.02] hover:-translate-y-1 cursor-pointer', // ✅ UPDATED
        className
      )}
      {...(animate && {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3 }
      })}
      {...props}
    >
      {children}
    </MotionComponent>
  )
})

Card.displayName = 'Card'

const CardHeader = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  >
    {children}
  </div>
))

CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => (
  <h3
    ref={ref}
    className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
    {...props}
  >
    {children}
  </h3>
))

CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-gray-400', className)}
    {...props}
  >
    {children}
  </p>
))

CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn('p-6 pt-0', className)}
    {...props}
  >
    {children}
  </div>
))

CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  >
    {children}
  </div>
))

CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }