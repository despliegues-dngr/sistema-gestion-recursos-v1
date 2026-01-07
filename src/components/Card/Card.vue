<template>
  <div :class="classes">
    <div v-if="$slots.header" class="card-header">
      <slot name="header" />
    </div>
    
    <div class="card-body">
      <slot />
    </div>
    
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import './Card.css'
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'elevated' | 'flat'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default'
})

const classes = computed(() => [
  'card',
  props.variant !== 'default' && `card--${props.variant}`
])
</script>
