<template>
  <div :class="['form-actions', { 'form-actions--bordered': bordered }]">
    <slot />
  </div>
</template>

<script setup lang="ts">
import './FormActions.css'

interface Props {
  bordered?: boolean
}

withDefaults(defineProps<Props>(), {
  bordered: false
})
</script>

