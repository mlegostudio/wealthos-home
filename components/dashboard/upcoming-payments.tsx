'use client'

interface Payment {
  id: string
  name: string
  amount: number
  due_date: string
  category?: string
}

interface UpcomingPaymentsProps {
  payments?: Payment[]
}

export function UpcomingPayments({ payments = [] }: UpcomingPaymentsProps) {
  if (payments.length === 0) {
    return (
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4">תשלומים קרובים</h3>
        <p className="text-gray-400 text-sm text-center py-8">אין תשלומים קרובים</p>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-white font-semibold mb-4">תשלומים קרובים</h3>
      <div className="space-y-3">
        {payments.map((payment) => {
          const dueDate = new Date(payment.due_date)
          const today = new Date()
          const daysUntil = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
          const isUrgent = daysUntil <= 3

          return (
            <div key={payment.id} className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
              <div>
                <p className="text-white text-sm">{payment.name}</p>
                <p className={`text-xs ${isUrgent ? 'text-red-400' : 'text-gray-400'}`}>
                  {daysUntil === 0 ? 'היום' : daysUntil === 1 ? 'מחר' : `בעוד ${daysUntil} ימים`}
                </p>
              </div>
              <span className="text-white text-sm font-semibold">
                ₪{payment.amount.toLocaleString()}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
