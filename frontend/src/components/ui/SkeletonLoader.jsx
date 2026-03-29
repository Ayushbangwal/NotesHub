// frontend/src/components/ui/SkeletonLoader.jsx

const SkeletonCard = () => {
  return (
    <div className="rounded-lg border border-dark-border bg-dark-secondary shadow-sm animate-pulse p-6 flex flex-col h-full">

      {/* Top row - icon + badge + bookmark */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-dark-accent rounded" />
          <div className="w-20 h-5 bg-dark-accent rounded-full" />
        </div>
        <div className="w-6 h-6 bg-dark-accent rounded" />
      </div>

      {/* Title */}
      <div className="w-3/4 h-5 bg-dark-accent rounded mb-2" />
      <div className="w-1/2 h-5 bg-dark-accent rounded mb-4" />

      {/* Description */}
      <div className="w-full h-4 bg-dark-accent rounded mb-1" />
      <div className="w-full h-4 bg-dark-accent rounded mb-1" />
      <div className="w-2/3 h-4 bg-dark-accent rounded mb-4" />

      {/* Tags */}
      <div className="flex gap-2 mb-4">
        <div className="w-16 h-5 bg-dark-accent rounded" />
        <div className="w-16 h-5 bg-dark-accent rounded" />
        <div className="w-10 h-5 bg-dark-accent rounded" />
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-between mb-2">
        <div className="w-24 h-4 bg-dark-accent rounded" />
        <div className="w-16 h-4 bg-dark-accent rounded" />
      </div>

      {/* Author + date */}
      <div className="flex items-center justify-between mb-4">
        <div className="w-20 h-3 bg-dark-accent rounded" />
        <div className="w-24 h-3 bg-dark-accent rounded" />
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-auto">
        <div className="flex-1 h-9 bg-dark-accent rounded-lg" />
        <div className="w-9 h-9 bg-dark-accent rounded-lg" />
      </div>

    </div>
  )
}

const SkeletonGrid = ({ count = 6 }) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export { SkeletonCard, SkeletonGrid }