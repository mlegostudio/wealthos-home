'use client'

interface Insight {
  id: string
  title: string
  description: string
  type: 'saving' | 'warning' | 'info'
  amount?: number
}

interface AIInsightsProps {
  insights?: Insight[]
  monthlyLeft?: number
}

export function AIInsights({ insights = [], monthlyLeft }: AIInsightsProps) {
  const typeStyles = {
    saving: 'bg-green-500/10 border-green-500/30 text-green-400',
    warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
  }

  const typeIcons = {
    saving: '💰',
    warning: '⚠️',
    info: '💡',
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🤖</span>
        <h3 className="text-lg font-semibold text-white">תובנות AI</h3>
      </div>
      
      {typeof monthlyLeft === 'number' && (
        <div className="mb-4 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
          <p className="text-blue-400 text-sm">נותר החודש</p>
          <p className="text-2xl font-bold text-white">₪{monthlyLeft.toLocaleString()}</p>
        </div>
      )}
      
      {insights.length === 0 ? (
        <p className="text-gray-400 text-center py-4">אין תובנות זמינות. הוסף עסקאות לקבל המלצות</p>
      ) : (
        <div className="space-y-3">
          {insights.map((insight) => (
            <div key={insight.id} className={`p-3 rounded-lg border ${typeStyles[insight.type]}`}>
              <div className="flex items-start gap-2">
                <span>{typeIcons[insight.type]}</span>
                <div>
                  <p className="font-medium text-sm">{insight.title}</p>
                  <p className="text-xs opacity-80 mt-0.5">{insight.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
