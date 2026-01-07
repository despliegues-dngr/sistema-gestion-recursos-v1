<template>
  <div class="input-wrapper">
    <label v-if="label" :class="labelClasses">
      {{ label }}
    </label>
    
    <div :class="containerClasses">
      <input
        :type="showPassword ? 'text' : 'password'"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        class="input-field"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      
      <button
        type="button"
        class="input-toggle"
        :title="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
        @click="showPassword = !showPassword"
      >
        <Eye v-if="!showPassword" :size="16" />
        <EyeOff v-else :size="16" />
      </button>
    </div>
    
    <p v-if="error" class="input-error-message">{{ error }}</p>
    <p v-else-if="hint" class="input-hint">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import './Input.css'
import { ref, computed } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'

interface Props {
  modelValue?: string
  label?: string
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  size: 'md',
  disabled: false,
  required: false
})

defineEmits<{
  'update:modelValue': [value: string]
}>()

const showPassword = ref(false)

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
