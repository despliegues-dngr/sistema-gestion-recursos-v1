<template>
  <div class="inline-form">
    <div class="inline-form-content">
      <slot />
    </div>
    <div v-if="$slots.actions" class="inline-form-actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import './InlineForm.css'

interface Props {
  columns?: 1 | 2
}

withDefaults(defineProps<Props>(), {
  columns: 1
})
</script>

