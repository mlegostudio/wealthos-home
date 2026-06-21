'use client'

interface MonthData {
  month: string
  income: number
  expenses: number
}

interface MonthlyChartProps {
  data?: MonthData[]
  userId?: string
}

export function MonthlyChart({ data = [], userId }: MonthlyChartProps) {
  const maxValue = Math.max(...data.flatMap(d => [d.income, d.expenses]), 1)

  if (data.length === 0) {
    return (
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4">הכנסות vs הוצאות</h3>
        <p className="text-gray-400 text-sm text-center py-8">אין נתונים</p>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-white font-semibold mb-6">הכנסות vs הוצאות</h3>
      <div className="flex items-end gap-3 h-48">
        {data.map((item) => (
          <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex gap-1 items-end" style={{ height: '160px' }}>
              <div className="flex-1 bg-green-500/60 rounded-t" style={{ height: `${(item.income / maxValue) * 100}%` }} />
              <div className="flex-1 bg-red-500/60 rounded-t" style={{ height: `${(item.expenses / maxValue) * 100}%` }} />
            </div>
            <span className="text-gray-400 text-xs">{item.month}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
