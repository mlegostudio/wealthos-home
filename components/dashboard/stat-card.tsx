'use client'

interface StatCardProps {
  title: string
  value?: any
  type?: string
  icon?: string
  currency?: string
  subtitle?: string
  trend?: number
  color?: 'blue' | 'green' | 'red' | 'purple' | 'orange'
  suffix?: string
  href?: string
}

export function StatCard({ title, value, type, icon, currency, subtitle, trend, color = 'blue', suffix, href }: StatCardProps) {
  const colorMap: Record<string, string> = {
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
    green: 'from-green-500/20 to-green-600/10 border-green-500/30',
    red: 'from-red-500/20 to-red-600/10 border-red-500/30',
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
    orange: 'from-orange-500/20 to-orange-600/10 border-orange-500/30',
    income: 'from-green-500/20 to-green-600/10 border-green-500/30',
    expense: 'from-red-500/20 to-red-600/10 border-red-500/30',
    neutral: 'from-gray-500/20 to-gray-600/10 border-gray-500/30',
  }

  const cardColor = type ? (colorMap[type] || colorMap[color]) : colorMap[color]

  const formatValue = (val: any) => {
    if (val === null || val === undefined) return '0'
    if (typeof val === 'number') {
      const formatted = Math.abs(val).toLocaleString('he-IL')
      return currency ? `${formatted} ${currency}` : formatted
    }
    return String(val)
  }

  const content = (
    <div className={`bg-gradient-to-br ${cardColor} border rounded-xl p-6 backdrop-blur-sm`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-400 text-sm">{title}</span>
        {icon && <span className="text-xl opacity-70">{icon}</span>}
      </div>
      <div className="text-2xl font-bold text-white mb-1">
        {formatValue(value)}{suffix && <span className="text-sm font-normal text-gray-400 mr-1">{suffix}</span>}
      </div>
      {subtitle && <div className="text-gray-400 text-sm">{subtitle}</div>}
      {trend !== undefined && (
        <div className={`text-sm mt-2 ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}%
        </div>
      )}
    </div>
  )

  if (href) {
    return <a href={href} className="block hover:opacity-80 transition-opacity">{content}</a>
  }

  return content
}
