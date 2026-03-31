import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flag, AlertTriangle } from 'lucide-react';
import { api } from '../../services/api';
import Button from '../ui/Button';

const REASONS = [
  { value: 'spam', label: '🚫 Spam' },
  { value: 'inappropriate_content', label: '⚠️ Inappropriate' },
  { value: 'copyright_violation', label: '©️ Copyright' },
  { value: 'misinformation', label: '❌ Misinformation' },
  { value: 'harassment', label: '😡 Harassment' },
  { value: 'other', label: '🔖 Other' },
];

const ReportModal = ({ noteId, noteTitle, onClose }) => {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!reason) return setError('Please select a reason');
    setLoading(true);
    setError('');
    try {
      await api.post('/reports', { noteId, reason, description });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-dark-secondary rounded-2xl shadow-2xl w-full max-w-md p-6 relative border border-white/10"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors"
          >
            <X size={20} />
          </button>

          {submitted ? (
            <div className="text-center py-6">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-gray-100 mb-2">Report Submitted!</h3>
              <p className="text-gray-400 mb-6">Our team will review this note shortly.</p>
              <Button onClick={onClose}>Close</Button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <Flag className="text-red-400" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-100">Report Note</h3>
                  <p className="text-sm text-gray-400 truncate max-w-[260px]">{noteTitle}</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Reason <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {REASONS.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => setReason(r.value)}
                      className={`text-left px-3 py-2 rounded-lg text-sm border transition-all ${
                        reason === r.value
                          ? 'border-red-500 bg-red-500/10 text-red-400'
                          : 'border-white/10 text-gray-400 hover:border-white/30 hover:text-gray-200'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Details <span className="text-gray-500">(optional)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={500}
                  rows={3}
                  placeholder="Describe the issue..."
                  className="w-full px-3 py-2 rounded-lg border border-white/10 bg-dark-accent text-gray-200 text-sm resize-none focus:outline-none focus:border-red-400 placeholder-gray-600"
                />
                <p className="text-xs text-gray-500 text-right">{description.length}/500</p>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm mb-4 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                  <AlertTriangle size={16} />
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={loading || !reason}
                  className="flex-1 !bg-red-500 hover:!bg-red-600 text-white border-0"
                >
                  {loading ? 'Submitting...' : 'Submit Report'}
                </Button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReportModal;