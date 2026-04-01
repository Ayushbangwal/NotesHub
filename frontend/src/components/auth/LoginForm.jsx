import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { validateEmail } from '../../utils/validators'

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  // ✅ NEW — OTP verify step
  const [needsVerification, setNeedsVerification] = useState(false)
  const [pendingEmail, setPendingEmail] = useState('')

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.email) newErrors.email = 'Email is required'
    else if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email'
    if (!formData.password) newErrors.password = 'Password is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)

    const result = await login(formData)

    if (result.success) {
      navigate('/dashboard')
    } else if (result.requiresVerification) {
      // ✅ Email verified nahi — OTP page pe bhejo
      setPendingEmail(result.email || formData.email)
      setNeedsVerification(true)
    }

    setIsLoading(false)
  }

  // ✅ NEW — Verification notice screen
  if (needsVerification) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto text-center"
      >
        <div className="card p-8">
          <div className="text-5xl mb-4">📧</div>
          <h2 className="text-2xl font-bold text-gray-100 mb-3">Email Not Verified</h2>
          <p className="text-gray-400 mb-2">
            Your account <span className="text-primary-400">{pendingEmail}</span> is not verified yet.
          </p>
          <p className="text-gray-500 text-sm mb-6">
            Please check your email for the OTP we sent during signup.
          </p>
          <Link
            to="/signup"
            className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Go to Verification
          </Link>
          <p className="text-gray-500 text-sm mt-4">
            Wrong account?{' '}
            <button
              onClick={() => setNeedsVerification(false)}
              className="text-primary-400 hover:underline"
            >
              Go back
            </button>
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">Welcome Back</h1>
        <p className="text-gray-400">Sign in to your NotesHub account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          type="email"
          name="email"
          label="Email Address"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          icon={<Mail className="h-4 w-4" />}
          required
        />

        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            name="password"
            label="Password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            icon={<Lock className="h-4 w-4" />}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-200"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2 text-sm text-gray-300">
            <input
              type="checkbox"
              className="rounded border-dark-border bg-dark-secondary text-primary-500 focus:ring-primary-500"
            />
            <span>Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-sm text-primary-400 hover:text-primary-300">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" loading={isLoading} disabled={isLoading}>
          Sign In
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary-400 hover:text-primary-300 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </motion.div>
  )
}

export default LoginForm