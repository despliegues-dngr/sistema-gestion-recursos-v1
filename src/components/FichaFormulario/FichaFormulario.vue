<template>
  <div class="ficha-formulario">
    <div 
      class="ficha-datos-grid" 
      :class="{ 
        'ficha-datos-grid--two-columns': columns === 2,
        'ficha-datos-grid--three-columns': columns === 3,
        'ficha-datos-grid--compact': compact 
      }"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import './FichaFormulario.css'

interface Props {
  columns?: 1 | 2 | 3
  compact?: boolean
}

withDefaults(defineProps<Props>(), {
  columns: 1,
  compact: false
})
</script>
