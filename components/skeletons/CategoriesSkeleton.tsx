function Bone({ className }: { className?: string }) {
  return <div className={`bg-muted rounded-xl animate-pulse ${className ?? ''}`} />
}

export default function CategoriesSkeleton({ contentOnly = false }: { contentOnly?: boolean }) {
  return (
    <div>
      {!contentOnly && (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div className="space-y-2">
              <Bone className="h-10 w-44 rounded-2xl" />
              <Bone className="h-4 w-56" />
            </div>
            <Bone className="h-12 w-44 rounded-full" />
          </div>

          {/* PageNav bar */}
          <div className="flex items-center gap-3 mb-6">
            <Bone className="h-11 w-28 rounded-full" />
            <Bone className="h-11 w-28 rounded-full" />
            <Bone className="h-11 w-28 rounded-full" />
            <Bone className="h-11 w-11 rounded-2xl" />
            <Bone className="h-11 flex-1 rounded-full ml-auto" />
          </div>
        </>
      )}

      {/* Categories grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <Bone className="w-14 h-14 rounded-full" />
              <div className="flex gap-1">
                <Bone className="w-8 h-8 rounded-full" />
                <Bone className="w-8 h-8 rounded-full" />
              </div>
            </div>
            <Bone className="h-6 w-3/4 mb-2" />
            <Bone className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}
