'use client'

interface NeedsReviewBannerProps {
  count?: number
  onReview?: () => void
}

export function NeedsReviewBanner({ count = 0, onReview }: NeedsReviewBannerProps) {
  if (count === 0) return null

  return (
    <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-2xl">⚠️</span>
        <div>
          <p className="text-white font-semibold">
            {count} עסקאות ממתינות לסיווג
          </p>
          <p className="text-gray-400 text-sm">
            סווג עסקאות אלו כדי שהמערכת תלמד את ההרגלים שלך
          </p>
        </div>
      </div>
      <button
        onClick={onReview}
        className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
      >
        סקור עכשיו
      </button>
    </div>
  )
}
