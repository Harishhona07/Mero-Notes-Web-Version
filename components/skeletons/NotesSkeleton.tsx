function Bone({ className }: { className?: string }) {
  return <div className={`bg-muted rounded-xl animate-pulse ${className ?? ''}`} />
}

export default function NotesSkeleton({ contentOnly = false }: { contentOnly?: boolean }) {
  return (
    <div>
      {!contentOnly && (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div className="space-y-2">
              <Bone className="h-10 w-56 rounded-2xl" />
              <Bone className="h-4 w-32" />
            </div>
            <Bone className="h-12 w-36 rounded-full" />
          </div>

          {/* PageNav bar */}
          <div className="flex items-center gap-3 mb-6">
            <Bone className="h-11 w-28 rounded-full" />
            <Bone className="h-11 w-28 rounded-full" />
            <Bone className="h-11 w-28 rounded-full" />
            <Bone className="h-11 flex-1 rounded-full ml-auto" />
          </div>
        </>
      )}

      {/* Category filter chips */}
      <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-thin pb-1">
        {[80, 96, 72, 88, 104, 76].map((w, i) => (
          <div key={i} className="h-10 rounded-full bg-muted animate-pulse shrink-0" style={{ width: w }} />
        ))}
      </div>

      {/* Notes grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-3xl p-6 h-[220px] flex flex-col">
            <Bone className="h-6 w-3/4 mb-3" />
            <Bone className="h-4 w-full mb-2" />
            <Bone className="h-4 w-5/6 mb-2" />
            <Bone className="h-4 w-2/3 mb-auto" />
            <div className="flex justify-between mt-4 pt-4 border-t border-border/50">
              <Bone className="h-4 w-24" />
              <Bone className="h-6 w-20 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
