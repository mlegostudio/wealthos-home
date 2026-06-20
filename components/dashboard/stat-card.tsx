'use client'

interface StatCardProps {
  title: string
  value: string
  subtitle?: string
  trend?: number
  icon?: string
  color?: 'blue' | 'green' | 'red' | 'purple' | 'orange'
}

export function StatCard({ title, value, subtitle, trend, icon, color = 'blue' }: StatCardProps) {
  const colorMap = {
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
    green: 'from-green-500/20 to-green-600/10 border-green-500/30',
    red: 'from-red-500/20 to-red-600/10 border-red-500/30',
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
    orange: 'from-orange-500/20 to-orange-600/10 border-orange-500/30',
  }

  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} border rounded-xl p-6 backdrop-blur-sm`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-400 text-sm">{title}</span>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      {subtitle && <div className="text-gray-400 text-sm">{subtitle}</div>}
      {trend !== undefined && (
        <div className={`text-sm mt-2 ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}%
        </div>
      )}
    </div>
  )
}
