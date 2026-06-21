'use client'

interface Insight {
  id?: string
  category?: string
  insight_text?: string
  recommendation?: string
  priority?: number
  is_dismissed?: boolean
}

interface AIInsightsProps {
  insights?: Insight[] | any[]
}

export function AIInsights({ insights = [] }: AIInsightsProps) {
  if (!insights || insights.length === 0) {
    return (
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4">תובנות AI</h3>
        <p className="text-gray-400 text-sm text-center py-4">אין תובנות זמינות</p>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-white font-semibold mb-4">תובנות AI</h3>
      <div className="space-y-3">
        {insights.slice(0, 3).map((insight: any, i: number) => (
          <div key={insight.id || i} className="bg-white/5 rounded-lg p-3">
            <p className="text-white text-sm">{insight.insight_text || insight.recommendation || ''}</p>
            {insight.category && (
              <span className="text-xs text-blue-400 mt-1 block">{insight.category}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
