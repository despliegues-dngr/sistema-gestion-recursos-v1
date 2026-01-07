<template>
  <div class="select-wrapper">
    <label v-if="label" class="select-label" :for="selectId">
      {{ label }}
      <span v-if="required" class="select-required">*</span>
    </label>
    
    <div 
      class="select-container"
      :class="containerClasses"
    >
      <select
        :id="selectId"
        class="select-field"
        :value="modelValue"
        :disabled="disabled"
        @change="handleChange"
      >
        <option v-if="placeholder" value="" disabled>
          {{ placeholder }}
        </option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      
      <ChevronDown :size="16" class="select-icon" />
    </div>
    
    <span v-if="error" class="select-error">{{ error }}</span>
    <span v-else-if="hint" class="select-hint">{{ hint }}</span>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})
import './Select.css'
import { computed } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

export interface SelectOption {
  value: string | number | boolean
  label: string
}

interface Props {
  modelValue?: string | number | boolean | null
  options?: SelectOption[]
  label?: string
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  options: () => [],
  size: 'md',
  disabled: false,
  required: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | boolean]
}>()

const selectId = computed(() => `select-${Math.random().toString(36).slice(2, 9)}`)

const containerClasses = computed(() => [
  `select-container--${props.size}`,
  {
    'select-container--error': props.error,
    'select-container--disabled': props.disabled
  }
])

function handleChange(event: Event) {
  const target = event.target as HTMLSelectElement
  const val = target.value
  
  // Buscar el valor original en las opciones para mantener el tipo (number o boolean)
  const option = props.options.find(o => String(o.value) === val)
  emit('update:modelValue', option ? option.value : val)
}
</script>
