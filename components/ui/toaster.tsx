'use client'

import { useState, useCallback } from 'react'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

let toastListeners: ((toast: Toast) => void)[] = []

export function showToast(message: string, type: Toast['type'] = 'info') {
  const toast: Toast = { id: Date.now().toString(), message, type }
  toastListeners.forEach(listener => listener(toast))
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const colorMap = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  }

  return (
    <div className="fixed top-4 left-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${colorMap[toast.type]} text-white px-4 py-3 rounded-lg shadow-lg text-sm`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}
