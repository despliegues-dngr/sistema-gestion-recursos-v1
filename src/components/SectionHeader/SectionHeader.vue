<template>
  <div class="section-header">
    <div class="section-header-title">
      <slot v-if="$slots.default" />
      <span v-else>{{ title }}</span>
    </div>
    <div v-if="showAction || $slots.action" class="section-header-action">
      <slot name="action">
        <Button 
          v-if="showAction" 
          :variant="actionVariant" 
          size="sm" 
          @click="$emit('action-click')"
        >
          {{ actionLabel }}
        </Button>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import './SectionHeader.css'
import { Button } from '@components'

interface Props {
  title?: string
  showAction?: boolean
  actionLabel?: string
  actionVariant?: 'primary' | 'secondary'
}

withDefaults(defineProps<Props>(), {
  showAction: false,
  actionLabel: 'Agregar',
  actionVariant: 'secondary'
})

defineEmits<{
  'action-click': []
}>()
</script>

