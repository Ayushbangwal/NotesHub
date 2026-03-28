import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Upload, 
  Search, 
  TrendingUp, 
  Users, 
  Star,
  ArrowRight,
  Download,
  Shield
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useTrendingNotes } from '../hooks/useNotes'
import Button from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import NoteCard from '../components/notes/NoteCard'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { getSubjectColor, getFileIcon } from '../utils/helpers'

const Home = () => {
  const { user, isAuthenticated } = useAuth()
  const { data: trendingData, isLoading } = useTrendingNotes()

  const features = [
    {
      icon: <Upload className="h-8 w-8" />,
      title: 'Upload Notes',
      description: 'Share your knowledge with students worldwide',
      color: 'text-blue-500'
    },
    {
      icon: <Search className="h-8 w-8" />,
      title: 'Discover Content',
      description: 'Find notes on any subject with smart search',
      color: 'text-green-500'
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: 'Track Progress',
      description: 'Monitor downloads and ratings of your notes',
      color: 'text-purple-500'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Join Community',
      description: 'Connect with students from around the world',
      color: 'text-orange-500'
    }
  ]

  const stats = [
    { label: 'Total Notes', value: '10,000+', icon: <BookOpen className="h-5 w-5" /> },
    { label: 'Active Users', value: '5,000+', icon: <Users className="h-5 w-5" /> },
    { label: 'Downloads', value: '50,000+', icon: <Download className="h-5 w-5" /> },
    { label: 'Subjects', value: '15+', icon: <Star className="h-5 w-5" /> }
  ]

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Share Knowledge,</span>
            <br />
            <span className="text-gray-100">Shape Futures</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Join the ultimate platform for students to share, discover, and collaborate on educational notes. 
            Elevate your learning experience with NotesHub.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <>
                <Link to="/notes">
                  <Button size="lg" icon={<Search className="h-5 w-5" />}>
                    Browse Notes
                  </Button>
                </Link>
                <Link to="/upload">
                  <Button variant="outline" size="lg" icon={<Upload className="h-5 w-5" />}>
                    Upload Notes
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/signup">
                  <Button size="lg" icon={<ArrowRight className="h-5 w-5" />}>
                    Get Started
                  </Button>
                </Link>
                <Link to="/notes">
                  <Button variant="outline" size="lg">
                    Explore Notes
                  </Button>
                </Link>
              </>
            )}
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="flex justify-center text-primary-500 mb-2">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-gray-100 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-100 mb-4">
            Why Choose NotesHub?
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover the features that make NotesHub the preferred choice for students worldwide
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="text-center hover-lift">
                <CardContent className="pt-6">
                  <div className={`${feature.color} mb-4 flex justify-center`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-100 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trending Notes Section */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-100 mb-2">
              Trending Notes
            </h2>
            <p className="text-gray-400">
              Discover the most popular notes this week
            </p>
          </div>
          <Link to="/notes">
            <Button variant="outline">
              View All
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : trendingData?.notes?.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingData.notes.slice(0, 6).map((note) => (
              <NoteCard key={note._id} note={note} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No trending notes available yet</p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* CTA Section */}
      <section className="text-center py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="glass-effect">
            <CardContent className="pt-8 pb-8">
              <Shield className="h-12 w-12 text-primary-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-100 mb-4">
                Ready to Start Learning?
              </h2>
              <p className="text-gray-400 mb-6">
                Join thousands of students who are already sharing and discovering amazing notes.
              </p>
              {isAuthenticated ? (
                <Link to="/upload">
                  <Button size="lg" icon={<Upload className="h-5 w-5" />}>
                    Upload Your First Note
                  </Button>
                </Link>
              ) : (
                <Link to="/signup">
                  <Button size="lg" icon={<ArrowRight className="h-5 w-5" />}>
                    Join NotesHub Today
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </div>
  )
}

export default Home
