<template>
  <span class="badge" :class="badgeClasses">
    <slot />
  </span>
</template>

<script setup lang="ts">
import './Badge.css'
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'gray'
  size?: 'sm' | 'md'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'gray',
  size: 'md'
})

const badgeClasses = computed(() => [
  `badge--${props.variant}`,
  `badge--${props.size}`
])
</script>
