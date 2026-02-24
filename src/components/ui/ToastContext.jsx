import { createContext, useContext, useState, useEffect } from 'react'
import { ToastContainer, toastStore } from './Toast'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState(toastStore.getState())

  useEffect(() => {
    return toastStore.subscribe(setToasts)
  }, [])

  const toast = (message, options) => toastStore.addToast(message, options)

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={toastStore.removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    return {
      toast: (message) => toastStore.addToast(message),
    }
  }
  return ctx
}
