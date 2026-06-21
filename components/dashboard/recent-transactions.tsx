'use client'

interface Transaction {
  id: string
  description?: string
  amount?: number
  date?: string
  category?: string
  type?: 'income' | 'expense' | string
}

interface RecentTransactionsProps {
  transactions?: Transaction[]
  userId?: string
}

export function RecentTransactions({ transactions = [], userId }: RecentTransactionsProps) {
  if (transactions.length === 0) {
    return (
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4">עסקאות אחרונות</h3>
        <p className="text-gray-400 text-sm text-center py-8">אין עסקאות להצגה</p>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-white font-semibold mb-4">עסקאות אחרונות</h3>
      <div className="space-y-3">
        {transactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
            <div>
              <p className="text-white text-sm">{tx.description || ''}</p>
              <p className="text-gray-400 text-xs">{tx.category} · {tx.date ? new Date(tx.date).toLocaleDateString('he-IL') : ''}</p>
            </div>
            <span className={`text-sm font-semibold ${tx.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
              {tx.type === 'income' ? '+' : '-'}₪{Math.abs(tx.amount || 0).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
