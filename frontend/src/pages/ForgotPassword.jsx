import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft } from 'lucide-react'
import { api } from '../services/api'
import toast from 'react-hot-toast'
import Button from '../components/ui/Button'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/auth/forgot-password', { email })
      setSent(true)
      toast.success('Reset link sent if email exists!')
    } catch (err) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
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
          {sent ? (
            <div className="text-center py-4">
              <div className="text-5xl mb-4">📧</div>
              <h2 className="text-2xl font-bold text-gray-100 mb-3">Check your email!</h2>
              <p className="text-gray-400 mb-6">
                If <span className="text-primary-400">{email}</span> is registered, a password reset link has been sent.
              </p>
              <p className="text-gray-500 text-sm mb-6">⏰ Link expires in 15 minutes</p>
              <Link to="/login" className="text-primary-400 hover:underline text-sm">
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-100 mb-2">Forgot Password?</h1>
                <p className="text-gray-400 text-sm">Enter your email and we'll send a reset link</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-dark-accent border border-white/10 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-primary-400"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" loading={loading}>
                  Send Reset Link
                </Button>
              </form>

              <div className="text-center mt-6">
                <Link to="/login" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary-400 text-sm transition-colors">
                  <ArrowLeft className="h-4 w-4" /> Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default ForgotPassword