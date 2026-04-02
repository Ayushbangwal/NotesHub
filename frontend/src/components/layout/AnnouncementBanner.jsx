import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Info, AlertTriangle, CheckCircle, AlertOctagon } from 'lucide-react'
import { api } from '../../services/api'

const ICONS = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle,
  danger: AlertOctagon,
}

const STYLES = {
  info:    'bg-blue-500/20 border-blue-500/40 text-blue-300',
  warning: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300',
  success: 'bg-green-500/20 border-green-500/40 text-green-300',
  danger:  'bg-red-500/20 border-red-500/40 text-red-300',
}

const AnnouncementBanner = () => {
  const [announcements, setAnnouncements] = useState([])
  const [dismissed, setDismissed] = useState([])

  useEffect(() => {
    // ✅ adminService ke bajaye direct api use karo
    api.get('/admin/announcements/active')
      .then(res => setAnnouncements(res.announcements || []))
      .catch(() => {})
  }, [])

  const visible = announcements.filter(a => !dismissed.includes(a._id))
  if (visible.length === 0) return null

  return (
    <div className="space-y-1">
      <AnimatePresence>
        {visible.map(ann => {
          const Icon = ICONS[ann.type] || Info
          return (
            <motion.div
              key={ann._id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex items-center gap-3 px-4 py-2.5 border-b text-sm ${STYLES[ann.type]}`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <div className="flex-1">
                <span className="font-semibold">{ann.title}: </span>
                <span className="opacity-90">{ann.message}</span>
              </div>
              <button
                onClick={() => setDismissed(p => [...p, ann._id])}
                className="opacity-60 hover:opacity-100 transition-opacity shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

export default AnnouncementBanner