import { useEffect } from 'react'
import './Toast.css'

function ToastItem({ id, message, variant = 'default', duration = 5000, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(id), duration)
    return () => clearTimeout(t)
  }, [id, duration, onDismiss])

  const variantClass = variant === 'success' ? 'ds-toast--success' : variant === 'error' ? 'ds-toast--error' : variant === 'warning' ? 'ds-toast--warning' : ''
  const classes = ['ds-toast', variantClass].filter(Boolean).join(' ')
  const isAlert = variant === 'error' || variant === 'warning'

  return (
    <div
      role={isAlert ? 'alert' : 'status'}
      aria-live={isAlert ? 'assertive' : 'polite'}
      className={classes}
    >
      <span className="ds-toast__message">{message}</span>
      <button
        type="button"
        className="ds-toast__close"
        aria-label="닫기"
        onClick={() => onDismiss(id)}
      >
        ×
      </button>
    </div>
  )
}

export function ToastContainer({ toasts, onDismiss }) {
  if (toasts.length === 0) return null
  return (
    <div className="ds-toast-container" aria-label="알림">
      {toasts.map((t) => (
        <ToastItem
          key={t.id}
          id={t.id}
          message={t.message}
          variant={t.variant}
          duration={t.duration}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  )
}

let id = 0
function nextId() {
  return (id += 1)
}

export function createToastStore() {
  let listeners = []
  let toasts = []

  function subscribe(listener) {
    listeners.push(listener)
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }

  function getState() {
    return toasts
  }

  function addToast(message, options = {}) {
    const { variant = 'default', duration = 4500 } = options
    const toast = { id: nextId(), message, variant, duration }
    toasts = [...toasts, toast]
    listeners.forEach((l) => l(toasts))
  }

  function removeToast(id) {
    toasts = toasts.filter((t) => t.id !== id)
    listeners.forEach((l) => l(toasts))
  }

  return { subscribe, getState, addToast, removeToast }
}

export const toastStore = createToastStore()
