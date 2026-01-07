<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast"
          :class="`toast--${toast.type}`"
        >
          <component :is="getIcon(toast.type)" :size="18" class="toast-icon" />
          <span class="toast-message">{{ toast.message }}</span>
          <button
            type="button"
            class="toast-close"
            @click="remove(toast.id)"
          >
            <X :size="16" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import './Toast.css'
import { useToast } from '@hooks'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-vue-next'

const { toasts, remove } = useToast()

function getIcon(type: string) {
  const icons: Record<string, unknown> = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info
  }
  return icons[type] || Info
}
</script>
