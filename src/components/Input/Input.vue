<template>
  <div class="input-wrapper">
    <label v-if="label" :class="labelClasses">
      {{ label }}
    </label>
    
    <div :class="containerClasses">
      <span v-if="$slots.icon" class="input-icon">
        <slot name="icon" />
      </span>
      
      <input
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        class="input-field"
        @input="handleInput"
      />
      
      <slot name="suffix" />
    </div>
    
    <p v-if="error" class="input-error-message">{{ error }}</p>
    <p v-else-if="hint" class="input-hint">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import './Input.css'
import { computed } from 'vue'

interface Props {
  modelValue?: string | number
  label?: string
  placeholder?: string
  type?: string
  size?: 'sm' | 'md' | 'lg'
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  size: 'md',
  disabled: false,
  required: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = target.value
  
  if (props.type === 'number') {
    emit('update:modelValue', value === '' ? '' : Number(value))
  } else {
    emit('update:modelValue', value)
  }
}

const labelClasses = computed(() => [
  'input-label',
  { 'input-label--required': props.required }
])

const containerClasses = computed(() => [
  'input-container',
  `input-container--${props.size}`,
  {
    'input-container--error': props.error,
    'input-container--disabled': props.disabled
  }
])
</script>
