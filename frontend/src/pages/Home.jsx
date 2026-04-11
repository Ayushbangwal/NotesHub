import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BookOpen, Upload, Search, TrendingUp, Users, Star,
  ArrowRight, Download, Shield, Sparkles, Zap
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useTrendingNotes } from '../hooks/useNotes'
import { useQuery } from '@tanstack/react-query'
import Button from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'
import NoteCard from '../components/notes/NoteCard'
import LoadingSpinner from '../components/ui/LoadingSpinner'

// ✅ Real stats fetch function
const fetchPublicStats = async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/public-stats`)
  if (!res.ok) throw new Error('Failed to fetch stats')
  return res.json()
}

const formatNumber = (num) => {
  if (!num && num !== 0) return '...'
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M+`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K+`
  return `${num}+`
}

const Home = () => {
  const { user, isAuthenticated } = useAuth()
  const { data: trendingData, isLoading } = useTrendingNotes()

  // ✅ Real stats from backend
  const { data: publicStats } = useQuery({
    queryKey: ['public-stats'],
    queryFn: fetchPublicStats,
    staleTime: 5 * 60 * 1000, // 5 min cache
    retry: 1
  })

  const features = [
    {
      icon: <Upload className="h-7 w-7" />,
      title: 'Upload Notes',
      description: 'Share your knowledge with students worldwide',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20 hover:border-blue-500/50'
    },
    {
      icon: <Search className="h-7 w-7" />,
      title: 'Discover Content',
      description: 'Find notes on any subject with smart search',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20 hover:border-emerald-500/50'
    },
    {
      icon: <TrendingUp className="h-7 w-7" />,
      title: 'Track Progress',
      description: 'Monitor downloads and ratings of your notes',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20 hover:border-purple-500/50'
    },
    {
      icon: <Users className="h-7 w-7" />,
      title: 'Join Community',
      description: 'Connect with students from around the world',
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20 hover:border-orange-500/50'
    }
  ]

  // ✅ Real data use ho raha hai
  const stats = [
    {
      label: 'Total Notes',
      value: formatNumber(publicStats?.totalNotes),
      icon: <BookOpen className="h-5 w-5" />,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10'
    },
    {
      label: 'Active Users',
      value: formatNumber(publicStats?.totalUsers),
      icon: <Users className="h-5 w-5" />,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10'
    },
    {
      label: 'Downloads',
      value: formatNumber(publicStats?.totalDownloads),
      icon: <Download className="h-5 w-5" />,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10'
    },
    {
      label: 'Subjects',
      value: formatNumber(publicStats?.totalSubjects),
      icon: <Star className="h-5 w-5" />,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10'
    }
  ]

  return (
    <div className="space-y-20">

      {/* Hero Section */}
      <section className="text-center py-16 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary-500/5 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Free for all students</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="gradient-text">Share Knowledge,</span>
            <br />
            <span className="text-gray-100">Shape Futures</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join the ultimate platform for students to share, discover, and collaborate on educational notes.
            Elevate your learning experience with NotesHub.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <>
                <Link to="/notes">
                  <Button size="lg" icon={<Search className="h-5 w-5" />}>Browse Notes</Button>
                </Link>
                <Link to="/upload">
                  <Button variant="outline" size="lg" icon={<Upload className="h-5 w-5" />}>Upload Notes</Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/signup">
                  <Button size="lg" icon={<ArrowRight className="h-5 w-5" />}>Get Started Free</Button>
                </Link>
                <Link to="/notes">
                  <Button variant="outline" size="lg" icon={<Search className="h-5 w-5" />}>Explore Notes</Button>
                </Link>
              </>
            )}
          </div>
        </motion.div>
      </section>

      {/* ✅ Real Stats Section */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="text-center border border-dark-border hover:border-primary-500/30 transition-all duration-300 hover:-translate-y-1">
                <CardContent className="pt-6 pb-6">
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${stat.bg} ${stat.color} mb-3`}>
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-gray-100 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">Why Choose NotesHub?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover the features that make NotesHub the preferred choice for students worldwide
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={`text-center border ${feature.border} transition-all duration-300 hover:-translate-y-1 h-full`}>
                <CardContent className="pt-8 pb-6">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${feature.bg} ${feature.color} mb-4`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-base font-semibold text-gray-100 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trending Notes */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-100 mb-2 flex items-center gap-3">
              <Zap className="h-7 w-7 text-yellow-400" />
              Trending Notes
            </h2>
            <p className="text-gray-400">Discover the most popular notes this week</p>
          </div>
          <Link to="/notes">
            <Button variant="outline" icon={<ArrowRight className="h-4 w-4" />}>View All</Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
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
      <section className="text-center py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <div className="relative rounded-2xl border border-primary-500/20 bg-gradient-to-br from-primary-500/10 via-dark-secondary to-purple-500/10 p-10 overflow-hidden">
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
            </div>
            <Shield className="h-12 w-12 text-primary-400 mx-auto mb-5" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-100 mb-3">Ready to Start Learning?</h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Join thousands of students who are already sharing and discovering amazing notes.
            </p>
            {isAuthenticated ? (
              <Link to="/upload">
                <Button size="lg" icon={<Upload className="h-5 w-5" />}>Upload Your First Note</Button>
              </Link>
            ) : (
              <Link to="/signup">
                <Button size="lg" icon={<ArrowRight className="h-5 w-5" />}>Join NotesHub Today</Button>
              </Link>
            )}
          </div>
        </motion.div>
      </section>

    </div>
  )
}

export default Home