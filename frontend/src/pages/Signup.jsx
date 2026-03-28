import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import SignupForm from '../components/auth/SignupForm'

const Signup = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Link to="/" className="flex justify-center items-center space-x-2 mb-6">
            <BookOpen className="h-10 w-10 text-primary-500" />
            <span className="text-2xl font-bold gradient-text">NotesHub</span>
          </Link>
        </motion.div>

        {/* Signup Form */}
        <SignupForm />

        {/* Footer Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center space-y-4"
        >
          <div className="text-sm text-gray-400">
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="text-primary-400 hover:text-primary-300">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-primary-400 hover:text-primary-300">
              Privacy Policy
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Signup
