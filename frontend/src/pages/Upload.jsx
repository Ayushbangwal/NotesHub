import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Upload as UploadIcon, ArrowLeft } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import UploadModal from '../components/notes/UploadModal'
import Button from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'

const Upload = () => {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [showModal, setShowModal] = React.useState(false)

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <UploadIcon className="h-12 w-12 text-gray-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-100 mb-2">Login Required</h2>
        <p className="text-gray-400 mb-4">Please login to upload notes</p>
        <Button onClick={() => navigate('/login')}>Login</Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          icon={<ArrowLeft className="h-4 w-4" />}
        >
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Upload Note</h1>
          <p className="text-gray-400">Share your knowledge with the community</p>
        </div>
      </div>

      {/* Upload Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <UploadIcon className="h-16 w-16 text-primary-500 mx-auto" />
              <div>
                <h2 className="text-2xl font-semibold text-gray-100 mb-2">
                  Ready to Share Your Knowledge?
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  Upload your study notes to help other students learn and grow. 
                  Your contributions make a difference in the academic community.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <div className="text-center">
                  <div className="bg-blue-500/20 rounded-lg p-4 mb-3">
                    <UploadIcon className="h-8 w-8 text-blue-500 mx-auto" />
                  </div>
                  <h3 className="font-medium text-gray-100 mb-2">Upload Files</h3>
                  <p className="text-sm text-gray-400">
                    PDF, DOCX, PPT files up to 10MB
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-green-500/20 rounded-lg p-4 mb-3">
                    <div className="text-green-500 text-2xl font-bold">★</div>
                  </div>
                  <h3 className="font-medium text-gray-100 mb-2">Get Ratings</h3>
                  <p className="text-sm text-gray-400">
                    Receive feedback from the community
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-500/20 rounded-lg p-4 mb-3">
                    <div className="text-purple-500 text-2xl font-bold">📈</div>
                  </div>
                  <h3 className="font-medium text-gray-100 mb-2">Track Impact</h3>
                  <p className="text-sm text-gray-400">
                    Monitor downloads and engagement
                  </p>
                </div>
              </div>

              <Button
                size="lg"
                onClick={() => setShowModal(true)}
                icon={<UploadIcon className="h-5 w-5" />}
              >
                Upload Your First Note
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Guidelines */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Upload Guidelines</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-primary-400">✅ Do's</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Ensure content is accurate and well-organized</li>
                  <li>• Use clear, descriptive titles</li>
                  <li>• Add relevant tags for better discoverability</li>
                  <li>• Include helpful descriptions</li>
                  <li>• Check for quality before uploading</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-red-400">❌ Don'ts</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Upload copyrighted material</li>
                  <li>• Share inappropriate or offensive content</li>
                  <li>• Use misleading titles or descriptions</li>
                  <li>• Upload corrupted or unreadable files</li>
                  <li>• Spam the platform with duplicate content</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  )
}

export default Upload
