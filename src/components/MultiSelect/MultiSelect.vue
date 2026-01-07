<template>
  <div class="multiselect-wrapper">
    <label v-if="label" class="multiselect-label" :for="selectId">
      {{ label }}
      <span v-if="required" class="multiselect-required">*</span>
    </label>
    
    <div 
      class="multiselect-container"
      :class="containerClasses"
      @click="toggleDropdown"
    >
      <!-- Área de visualización: Chips o Placeholder -->
      <div class="multiselect-display">
        <!-- Chips de items seleccionados -->
        <div v-if="selectedItems.length > 0" class="multiselect-chips">
          <span
            v-for="item in selectedItems"
            :key="item.value"
            class="multiselect-chip"
          >
            {{ item.label }}
            <button
              type="button"
              class="multiselect-chip-remove"
              @click.stop="removeItem(item.value)"
              :disabled="disabled"
            >
              ×
            </button>
          </span>
        </div>
        
        <!-- Placeholder cuando no hay selección -->
        <span v-else class="multiselect-placeholder">
          {{ placeholder || 'Seleccione opciones' }}
        </span>
      </div>
      
      <!-- Icono -->
      <ChevronDown 
        :size="16" 
        class="multiselect-icon"
        :class="{ 'multiselect-icon--open': isOpen }"
      />
      
      <!-- Dropdown con opciones -->
      <div v-if="isOpen" class="multiselect-dropdown">
        <label
          v-for="option in options"
          :key="option.value"
          class="multiselect-option"
          :class="{ 'multiselect-option--selected': isSelected(option.value) }"
          @click.stop
        >
          <input
            type="checkbox"
            :value="option.value"
            :checked="isSelected(option.value)"
            @change="toggleOption(option.value)"
            class="multiselect-checkbox"
          />
          <span class="multiselect-option-label">{{ option.label }}</span>
        </label>
        
        <div v-if="options.length === 0" class="multiselect-empty">
          No hay opciones disponibles
        </div>
      </div>
    </div>
    
    <span v-if="error" class="multiselect-error">{{ error }}</span>
    <span v-else-if="hint" class="multiselect-hint">{{ hint }}</span>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})
import './MultiSelect.css'
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

export interface MultiSelectOption {
  value: string | number
  label: string
}

interface Props {
  modelValue?: (string | number)[]
  options?: MultiSelectOption[]
  label?: string
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  options: () => [],
  size: 'md',
  disabled: false,
  required: false
})

const emit = defineEmits<{
  'update:modelValue': [value: (string | number)[]]
}>()

const selectId = computed(() => `multiselect-${Math.random().toString(36).slice(2, 9)}`)
const isOpen = ref(false)

const containerClasses = computed(() => [
  `multiselect-container--${props.size}`,
  {
    'multiselect-container--error': props.error,
    'multiselect-container--disabled': props.disabled,
    'multiselect-container--open': isOpen.value
  }
])

const selectedItems = computed(() => {
  return props.options.filter(opt => props.modelValue.includes(opt.value))
})

function isSelected(value: string | number): boolean {
  return props.modelValue.includes(value)
}

function toggleDropdown() {
  if (!props.disabled) {
    isOpen.value = !isOpen.value
  }
}

function toggleOption(value: string | number) {
  const currentValues = [...props.modelValue]
  const index = currentValues.indexOf(value)
  
  if (index > -1) {
    // Remover si ya está seleccionado
    currentValues.splice(index, 1)
  } else {
    // Agregar si no está seleccionado
    currentValues.push(value)
  }
  
  emit('update:modelValue', currentValues)
}

function removeItem(value: string | number) {
  const newValue = props.modelValue.filter(v => v !== value)
  emit('update:modelValue', newValue)
}

// Cerrar dropdown al hacer clic fuera
function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target.closest('.multiselect-wrapper')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
