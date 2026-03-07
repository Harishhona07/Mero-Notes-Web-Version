function Bone({ className }: { className?: string }) {
  return <div className={`bg-muted rounded-xl animate-pulse ${className ?? ''}`} />
}

export default function SettingsSkeleton({ contentOnly = false }: { contentOnly?: boolean }) {
  return (
    <div>
      {!contentOnly && (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div className="space-y-2">
              <Bone className="h-10 w-36 rounded-2xl" />
              <Bone className="h-4 w-64" />
            </div>
          </div>

          {/* PageNav bar */}
          <div className="flex items-center gap-3 mb-6">
            <Bone className="h-11 w-28 rounded-full" />
            <Bone className="h-11 w-28 rounded-full" />
            <Bone className="h-11 w-28 rounded-full" />
          </div>
        </>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Account card */}
        <div className="bg-card border border-border rounded-3xl p-8">
          <Bone className="h-7 w-48 mb-6" />
          <div className="flex items-center gap-6 mb-8">
            <Bone className="w-24 h-24 rounded-full shrink-0" />
            <div className="space-y-2 flex-1">
              <Bone className="h-6 w-40" />
              <Bone className="h-5 w-56" />
            </div>
          </div>
          <div className="pt-6 border-t border-border">
            <Bone className="h-12 w-36 rounded-full" />
          </div>
        </div>

        {/* Appearance card */}
        <div className="bg-card border border-border rounded-3xl p-8">
          <Bone className="h-7 w-40 mb-2" />
          <Bone className="h-4 w-64 mb-6" />
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Bone key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>

      {/* About card — full width */}
      <div className="bg-card border border-border border-dashed rounded-3xl py-6 flex flex-col items-center gap-3">
        <Bone className="h-5 w-36" />
        <Bone className="h-4 w-56" />
        <div className="flex gap-4 mt-2">
          <Bone className="h-4 w-28" />
          <Bone className="h-4 w-24" />
        </div>
      </div>
    </div>
  )
}
