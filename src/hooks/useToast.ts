/**
 * Composable para notificaciones Toast
 */

import { ref, readonly } from 'vue'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

const toasts = ref<Toast[]>([])

function generateId(): string {
  return Math.random().toString(36).slice(2, 9)
}

function addToast(message: string, type: Toast['type'], duration = 4000) {
  const id = generateId()
  const toast: Toast = { id, message, type, duration }
  
  toasts.value.push(toast)
  
  if (duration > 0) {
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }
  
  return id
}

function removeToast(id: string) {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

function clearAll() {
  toasts.value = []
}

export function useToast() {
  return {
    toasts: readonly(toasts),
    
    success(message: string, duration?: number) {
      return addToast(message, 'success', duration)
    },
    
    error(message: string, duration?: number) {
      return addToast(message, 'error', duration)
    },
    
    warning(message: string, duration?: number) {
      return addToast(message, 'warning', duration)
    },
    
    info(message: string, duration?: number) {
      return addToast(message, 'info', duration)
    },
    
    remove: removeToast,
    clearAll
  }
}
