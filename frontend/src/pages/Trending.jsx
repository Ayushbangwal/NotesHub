import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Calendar, Trophy } from 'lucide-react'
import { useTrendingNotes } from '../hooks/useNotes'
import NoteCard from '../components/notes/NoteCard'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'

const Trending = () => {
  const { data: trendingData, isLoading } = useTrendingNotes()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center items-center space-x-2 mb-4">
          <TrendingUp className="h-8 w-8 text-primary-500" />
          <h1 className="text-3xl font-bold text-gray-100">Trending Notes</h1>
        </div>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Discover the most popular notes this week based on downloads and ratings
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0 }}
        >
          <Card>
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-100 mb-1">Top Rated</h3>
              <p className="text-sm text-gray-400">
                Highest rated notes by the community
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-100 mb-1">Most Downloaded</h3>
              <p className="text-sm text-gray-400">
                Popular notes with highest engagement
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-blue-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-100 mb-1">This Week</h3>
              <p className="text-sm text-gray-400">
                Fresh content from the past 7 days
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Trending Notes */}
      <div>
        <h2 className="text-2xl font-bold text-gray-100 mb-6">🔥 Hot This Week</h2>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : trendingData?.notes?.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingData.notes.map((note, index) => (
              <motion.div
                key={note._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="relative">
                  {/* Ranking Badge */}
                  <div className="absolute -top-2 -left-2 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shadow-lg">
                    {index + 1}
                  </div>
                  <NoteCard note={note} />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <TrendingUp className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-100 mb-2">No Trending Notes Yet</h3>
              <p className="text-gray-400">
                Check back later for the most popular notes!
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-2xl font-bold text-gray-100 mb-6">Browse by Subject</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
            'Engineering', 'Medicine', 'Business', 'Economics', 'History'
          ].map((subject, index) => (
            <motion.div
              key={subject}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="hover-lift cursor-pointer">
                <CardContent className="p-4 text-center">
                  <h3 className="font-medium text-gray-100">{subject}</h3>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Trending
