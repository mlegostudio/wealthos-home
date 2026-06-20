'use client'

interface HeaderProps {
  user?: {
    email?: string
    full_name?: string
  }
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="h-16 glass-card border-0 border-b border-white/10 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-white font-semibold">לוח בקרה</h2>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="text-gray-400 hover:text-white transition-colors text-sm">
          + הוסף עסקה
        </button>
        <button className="text-gray-400 hover:text-white transition-colors text-sm">
          📂 ייבוא
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
            {user?.full_name?.[0] || user?.email?.[0] || 'U'}
          </div>
          <span className="text-gray-400 text-sm hidden md:block">
            {user?.full_name || user?.email || 'משתמש'}
          </span>
        </div>
      </div>
    </header>
  )
}
