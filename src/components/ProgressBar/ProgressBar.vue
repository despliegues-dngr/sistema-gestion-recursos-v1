<template>
  <div class="progress-bar-container">
    <div class="progress-bar-header">
      <span class="progress-bar-label">Cumplimiento:</span>
      <span v-if="showPercentage" :class="percentageClass">
        {{ percentage }}%
      </span>
    </div>
    
    <div class="progress-bar-track">
      <div 
        class="progress-bar-fill"
        :class="fillClass"
        :style="{ width: `${Math.min(percentage, 100)}%` }"
      />
    </div>
    
    <div v-if="showValues" class="progress-bar-values">
      <span>{{ current }} de {{ total }} {{ label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import './ProgressBar.css'

interface Props {
  current: number
  total: number
  label?: string
  showPercentage?: boolean
  showValues?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: 'ítems',
  showPercentage: true,
  showValues: true
})

const percentage = computed(() => {
  if (props.total <= 0) return 0
  return Math.round((props.current / props.total) * 100)
})

const fillClass = computed(() => {
  const pct = percentage.value
  if (pct <= 50) return 'progress-bar-fill--critical'
  if (pct <= 80) return 'progress-bar-fill--reduced'
  if (pct <= 100) return 'progress-bar-fill--complete'
  return 'progress-bar-fill--exceeded'
})

const percentageClass = computed(() => {
  return ['progress-bar-percentage', fillClass.value.replace('fill', 'percentage')]
})
</script>

