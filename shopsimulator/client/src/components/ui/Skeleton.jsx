export default function Skeleton({ className = '' }) {
  return (
    <div className={`bg-border-color rounded animate-skeleton ${className}`} />
  )
}

export function SkeletonLine({ width = '100%' }) {
  return <Skeleton className="h-4" style={{ width }} />
}

export function SkeletonCard() {
  return (
    <div className="bg-bg-card border border-border-color rounded p-3">
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-1/2 mb-3" />
      <Skeleton className="h-4 w-1/4" />
    </div>
  )
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="space-y-1">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-3 py-2">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} className="h-3 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}
