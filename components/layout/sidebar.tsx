'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/dashboard', label: 'לוח בקרה', icon: '📊' },
  { href: '/transactions', label: 'עסקאות', icon: '💳' },
  { href: '/accounts', label: 'חשבונות', icon: '🏦' },
  { href: '/properties', label: 'נכסים', icon: '🏠' },
  { href: '/loans', label: 'הלוואות', icon: '💰' },
  { href: '/business', label: 'עסקים', icon: '🏢' },
  { href: '/settings', label: 'הגדרות', icon: '⚙️' },
]

export function Sidebar() {
  const pathname = usePathname()
  
  return (
    <aside className="w-64 h-full glass-card border-0 border-r border-white/10 flex flex-col">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-bold text-white">💎 WealthOS</h1>
        <p className="text-xs text-gray-400 mt-1">ניהול פיננסי חכם</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-white/20 text-white font-medium' 
                  : 'text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </Link>
          )
        })}
      </nav>
      
      <div className="p-4 border-t border-white/10">
        <p className="text-xs text-gray-500 text-center">WealthOS v1.0</p>
      </div>
    </aside>
  )
}
