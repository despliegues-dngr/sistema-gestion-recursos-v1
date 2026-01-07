<template>
  <div class="accordion" :class="{ 'accordion--open': isOpen }">
    <button 
      type="button" 
      class="accordion-header" 
      @click="toggle"
      :aria-expanded="isOpen"
    >
      <span class="accordion-icon">
        <slot name="icon">
          <ChevronRight :size="16" />
        </slot>
      </span>
      <span class="accordion-title">{{ title }}</span>
      <ChevronDown :size="16" class="accordion-chevron" />
    </button>
    
    <div v-show="isOpen" class="accordion-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import './Accordion.css'
import { ref } from 'vue'
import { ChevronRight, ChevronDown } from 'lucide-vue-next'

interface Props {
  title: string
  defaultOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  defaultOpen: false
})

const isOpen = ref(props.defaultOpen)

function toggle() {
  isOpen.value = !isOpen.value
}
</script>
