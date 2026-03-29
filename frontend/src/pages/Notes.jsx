import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Filter, Grid, List, SlidersHorizontal } from 'lucide-react'
import { useNotes } from '../hooks/useNotes'
import { useDebounce } from '../hooks/useDebounce'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import NoteCard from '../components/notes/NoteCard'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { SkeletonGrid } from '../components/ui/SkeletonLoader' // ✅ NEW
import { Card, CardContent } from '../components/ui/Card'

const Notes = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)

  const search = searchParams.get('search') || ''
  const subject = searchParams.get('subject') || ''
  const fileType = searchParams.get('fileType') || ''
  const sortBy = searchParams.get('sortBy') || 'createdAt'
  const order = searchParams.get('order') || 'desc'
  const page = parseInt(searchParams.get('page')) || 1

  const debouncedSearch = useDebounce(search, 300)

  const queryParams = {
    search: debouncedSearch,
    subject,
    fileType,
    sortBy,
    order,
    page,
    limit: 12
  }

  const { data, isLoading, error } = useNotes(queryParams)

  const handleSearch = (value) => {
    const newParams = new URLSearchParams(searchParams)
    if (value) {
      newParams.set('search', value)
    } else {
      newParams.delete('search')
    }
    newParams.set('page', '1')
    setSearchParams(newParams)
  }

  const handleFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams)
    if (value) {
      newParams.set(key, value)
    } else {
      newParams.delete(key)
    }
    newParams.set('page', '1')
    setSearchParams(newParams)
  }

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('page', newPage.toString())
    setSearchParams(newParams)
  }

  const clearFilters = () => {
    setSearchParams(new URLSearchParams())
  }

  const subjects = [
    { value: '', label: 'All Subjects' },
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'Physics', label: 'Physics' },
    { value: 'Chemistry', label: 'Chemistry' },
    { value: 'Biology', label: 'Biology' },
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Medicine', label: 'Medicine' },
    { value: 'Business', label: 'Business' },
    { value: 'Economics', label: 'Economics' },
    { value: 'History', label: 'History' },
    { value: 'Literature', label: 'Literature' },
    { value: 'Other', label: 'Other' }
  ]

  const fileTypes = [
    { value: '', label: 'All Types' },
    { value: 'pdf', label: 'PDF' },
    { value: 'docx', label: 'DOCX' },
    { value: 'ppt', label: 'PPT' }
  ]

  const sortOptions = [
    { value: 'createdAt', label: 'Newest First' },
    { value: 'downloads', label: 'Most Downloaded' },
    { value: 'averageRating', label: 'Highest Rated' },
    { value: 'title', label: 'Alphabetical' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Browse Notes</h1>
        <p className="text-gray-400">Discover and download notes shared by the community</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search notes by title, description, or tags..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  icon={<Search className="h-4 w-4" />}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  icon={<SlidersHorizontal className="h-4 w-4" />}
                >
                  Filters
                </Button>
                <div className="flex items-center bg-dark-secondary rounded-lg border border-dark-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'text-primary-400' : 'text-gray-400'}`}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'text-primary-400' : 'text-gray-400'}`}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-dark-border"
              >
                <Select
                  value={subject}
                  onChange={(e) => handleFilter('subject', e.target.value)}
                  options={subjects}
                />
                <Select
                  value={fileType}
                  onChange={(e) => handleFilter('fileType', e.target.value)}
                  options={fileTypes}
                />
                <Select
                  value={sortBy}
                  onChange={(e) => handleFilter('sortBy', e.target.value)}
                  options={sortOptions}
                />
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  disabled={!search && !subject && !fileType}
                >
                  Clear Filters
                </Button>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div>
        {isLoading ? (
          // ✅ UPDATED - Skeleton instead of spinner
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="h-5 w-40 bg-dark-accent rounded animate-pulse" />
              <div className="h-5 w-24 bg-dark-accent rounded animate-pulse" />
            </div>
            <SkeletonGrid count={6} />
          </div>
        ) : error ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-red-400">Failed to load notes. Please try again.</p>
            </CardContent>
          </Card>
        ) : data?.notes?.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-400">
                Showing {data.notes.length} of {data.pagination.total} notes
              </p>
              <div className="text-sm text-gray-400">
                Page {data.pagination.current} of {data.pagination.pages}
              </div>
            </div>

            <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {data.notes.map((note) => (
                <NoteCard key={note._id} note={note} />
              ))}
            </div>

            {data.pagination.pages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, data.pagination.pages) }, (_, i) => {
                    const pageNum = i + 1
                    const isActive = pageNum === page
                    return (
                      <Button
                        key={pageNum}
                        variant={isActive ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === data.pagination.pages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-100 mb-2">No notes found</h3>
              <p className="text-gray-400 mb-4">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default Notes
