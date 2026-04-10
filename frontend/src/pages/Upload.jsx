import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Upload as UploadIcon, ArrowLeft, BookOpen, Star, BarChart2, ShieldCheck, AlertTriangle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import UploadModal from '../components/notes/UploadModal'
import Button from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: 'easeOut' }
})

const Upload = () => {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [showModal, setShowModal] = React.useState(false)

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-dark-accent border border-dark-border flex items-center justify-center">
          <UploadIcon className="h-7 w-7 text-gray-500" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-100">Login Required</h2>
          <p className="text-gray-400 mt-1 text-sm">Please login to upload and share your notes</p>
        </div>
        <Button onClick={() => navigate('/login')} className="mt-2">Login to Continue</Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">

      {/* ── Header ── */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          icon={<ArrowLeft className="h-4 w-4" />}
          className="text-gray-400 hover:text-gray-200"
        >
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Upload Note</h1>
          <p className="text-sm text-gray-500 mt-0.5">Share your knowledge with the community</p>
        </div>
      </div>

      {/* ── Hero Upload Card ── */}
      <motion.div {...fadeUp(0)}>
        <Card className="overflow-hidden border border-dark-border">
          {/* Subtle top accent stripe */}
          <div className="h-1 w-full bg-gradient-to-r from-primary-700 via-primary-500 to-cyan-500" />
          <CardContent className="p-8 md:p-10">
            <div className="text-center space-y-6">

              {/* Icon */}
              <div className="relative inline-flex">
                <div className="w-20 h-20 rounded-2xl bg-primary-500/15 border border-primary-500/25 flex items-center justify-center">
                  <UploadIcon className="h-9 w-9 text-primary-400" />
                </div>
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-dark-card flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-100">
                  Ready to Share Your Knowledge?
                </h2>
                <p className="text-gray-400 mt-2 max-w-xl mx-auto text-sm leading-relaxed">
                  Upload your study notes and help fellow students learn and grow.
                  Every contribution makes the community stronger.
                </p>
              </div>

              {/* Feature cards */}
              <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                {[
                  {
                    icon: <BookOpen className="h-5 w-5" />,
                    color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
                    title: 'Upload Files',
                    desc: 'PDF, DOCX, PPT up to 10MB'
                  },
                  {
                    icon: <Star className="h-5 w-5" />,
                    color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
                    title: 'Get Ratings',
                    desc: 'Receive feedback from peers'
                  },
                  {
                    icon: <BarChart2 className="h-5 w-5" />,
                    color: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
                    title: 'Track Impact',
                    desc: 'Monitor views & downloads'
                  }
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.08, duration: 0.35 }}
                    className="rounded-xl bg-dark-accent border border-dark-border p-4 text-left space-y-2"
                  >
                    <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${item.color}`}>
                      {item.icon}
                    </div>
                    <p className="text-sm font-semibold text-gray-100">{item.title}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>

              <Button
                size="lg"
                onClick={() => setShowModal(true)}
                icon={<UploadIcon className="h-4 w-4" />}
                className="px-8 py-3 text-sm font-semibold shadow-lg shadow-primary-900/30"
              >
                Upload Your Note
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Guidelines ── */}
      <motion.div {...fadeUp(0.1)}>
        <Card className="border border-dark-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-5">
              <ShieldCheck className="h-4 w-4 text-primary-400" />
              <h3 className="text-sm font-semibold text-gray-100 uppercase tracking-wider">Upload Guidelines</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Do's */}
              <div className="rounded-xl bg-green-500/5 border border-green-500/15 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                    <span className="text-green-400 text-[11px] font-bold">✓</span>
                  </div>
                  <h4 className="text-xs font-bold text-green-400 uppercase tracking-wider">Do's</h4>
                </div>
                <ul className="space-y-2">
                  {[
                    'Ensure content is accurate and well-organized',
                    'Use clear, descriptive titles',
                    'Add relevant tags for better discoverability',
                    'Include helpful descriptions',
                    'Check for quality before uploading'
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-gray-300">
                      <span className="text-green-500 mt-0.5 flex-shrink-0">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Don'ts */}
              <div className="rounded-xl bg-red-500/5 border border-red-500/15 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center">
                    <AlertTriangle className="h-2.5 w-2.5 text-red-400" />
                  </div>
                  <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider">Don'ts</h4>
                </div>
                <ul className="space-y-2">
                  {[
                    'Upload copyrighted material',
                    'Share inappropriate or offensive content',
                    'Use misleading titles or descriptions',
                    'Upload corrupted or unreadable files',
                    'Spam the platform with duplicate content'
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-gray-300">
                      <span className="text-red-500 mt-0.5 flex-shrink-0">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Stats / Motivation Banner ── */}
      <motion.div {...fadeUp(0.18)}>
        <div className="rounded-xl border border-dark-border bg-dark-accent px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-500/15 border border-primary-500/25 flex items-center justify-center">
              <Star className="h-4 w-4 text-primary-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-100">Join top contributors</p>
              <p className="text-xs text-gray-500">Earn badges and get featured on the leaderboard</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/leaderboard')}
            className="text-xs flex-shrink-0"
          >
            View Leaderboard →
          </Button>
        </div>
      </motion.div>

      {/* ── Upload Modal ── */}
      <UploadModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  )
}

export default Upload
