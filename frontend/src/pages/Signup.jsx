import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, ShieldCheck, RefreshCw } from 'lucide-react'
import { api } from '../services/api'
import toast from 'react-hot-toast'
import Button from '../components/ui/Button'
import { validateEmail, validatePassword, validateUsername } from '../utils/validators'

const Signup = () => {
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [pendingEmail, setPendingEmail] = useState('')

  const [formData, setFormData] = useState({ username: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const [otp, setOtp] = useState('')
  const [otpLoading, setOtpLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  // ✅ Frontend validation
  const validateForm = () => {
    const newErrors = {}

    const usernameValidation = validateUsername(formData.username)
    if (!formData.username) {
      newErrors.username = 'Username is required'
    } else if (!usernameValidation.isValid) {
      newErrors.username = Object.values(usernameValidation.errors).find(err => err) || 'Invalid username'
    }

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else {
      const passwordValidation = validatePassword(formData.password)
      if (!passwordValidation.isValid) {
        newErrors.password = Object.values(passwordValidation.errors).find(err => err) || 'Invalid password'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Step 1 — Signup
  const handleSignup = async (e) => {
    e.preventDefault()
    if (!validateForm()) return   // ✅ Validation pehle

    setLoading(true)
    try {
      const res = await api.post('/auth/signup', formData)
      if (res.requiresVerification) {
        setPendingEmail(res.email)
        setStep(2)
        toast.success('OTP sent to your email!')
      }
    } catch (err) {
      const backendMsg = err.response?.data?.message
      const backendErrors = err.response?.data?.errors

      // ✅ Backend field errors handle karo
      if (backendErrors && Array.isArray(backendErrors)) {
        const fieldErrors = {}
        backendErrors.forEach(e => {
          if (e.path) fieldErrors[e.path] = e.msg
        })
        setErrors(fieldErrors)
      } else {
        toast.error(backendMsg || 'Signup failed')
      }
    } finally {
      setLoading(false)
    }
  }

  // Step 2 — Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    if (otp.length !== 6) return toast.error('Enter 6-digit OTP')
    setOtpLoading(true)
    try {
      const res = await api.post('/auth/verify-otp', { email: pendingEmail, otp })
      localStorage.setItem('token', res.token)
      toast.success('Email verified! Welcome to NotesHub 🎉')
      navigate('/')
      window.location.reload()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP')
    } finally {
      setOtpLoading(false)
    }
  }

  // Resend OTP
  const handleResend = async () => {
    setResendLoading(true)
    try {
      await api.post('/auth/resend-otp', { email: pendingEmail })
      toast.success('New OTP sent!')
    } catch (err) {
      toast.error('Failed to resend OTP')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="card p-8">
          {step === 1 ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-100 mb-2">Create Account</h1>
                <p className="text-gray-400">Join NotesHub today</p>
              </div>

              <form onSubmit={handleSignup} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      placeholder="your_username"
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-dark-accent border border-white/10 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-primary-400"
                    />
                  </div>
                  {/* ✅ Error display */}
                  {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-dark-accent border border-white/10 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-primary-400"
                    />
                  </div>
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Min 6 chars, upper+lower+number"
                      className="w-full pl-10 pr-10 py-3 rounded-lg bg-dark-accent border border-white/10 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-primary-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                  {/* ✅ Password hints */}
                  <ul className="text-xs text-gray-500 mt-2 space-y-0.5">
                    <li>• At least 6 characters</li>
                    <li>• One uppercase letter</li>
                    <li>• One lowercase letter</li>
                    <li>• One number</li>
                  </ul>
                </div>

                <Button type="submit" className="w-full" loading={loading}>
                  Create Account
                </Button>
              </form>

              <p className="text-center text-gray-400 text-sm mt-6">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-400 hover:underline">Login</Link>
              </p>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500/20 rounded-full mb-4">
                  <ShieldCheck className="h-8 w-8 text-primary-400" />
                </div>
                <h1 className="text-2xl font-bold text-gray-100 mb-2">Verify Your Email</h1>
                <p className="text-gray-400 text-sm">
                  OTP sent to <span className="text-primary-400 font-medium">{pendingEmail}</span>
                </p>
              </div>

              <form onSubmit={handleVerifyOTP} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Enter 6-digit OTP</label>
                  <input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    placeholder="______"
                    className="w-full text-center text-3xl font-bold tracking-[16px] py-4 rounded-lg bg-dark-accent border border-white/10 text-primary-400 placeholder-gray-600 focus:outline-none focus:border-primary-400"
                  />
                  <p className="text-xs text-gray-500 mt-1 text-center">⏰ Expires in 10 minutes</p>
                </div>

                <Button type="submit" className="w-full" loading={otpLoading}>
                  Verify & Continue
                </Button>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="w-full flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-primary-400 transition-colors"
                >
                  <RefreshCw className={`h-4 w-4 ${resendLoading ? 'animate-spin' : ''}`} />
                  {resendLoading ? 'Sending...' : 'Resend OTP'}
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default Signup