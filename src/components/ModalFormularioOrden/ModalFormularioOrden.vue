<template>
  <Modal
    :model-value="modelValue"
    size="xl"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <!-- Header compacto y formal -->
    <template #header>
      <div class="modal-form-header">
        <div class="modal-form-header-info">
          <div class="modal-form-avatar">
            <component :is="safeHeaderIcon" :size="20" />
          </div>
          <div class="modal-form-content">
            <h2 class="modal-form-title">{{ title }}</h2>
            <div class="modal-form-meta">
              <span class="modal-form-subtitle">{{ subtitle }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
    <!-- Cuerpo del Modal -->
    <div class="modal-form-body">
      <slot>
        <Tabs v-if="tabs && tabs.length > 0" v-model="activeTab" :tabs="tabs">
          <template v-for="tab in tabs" :key="tab.id" #[tab.id]>
            <div class="modal-form-section">
              <slot :name="tab.id" />
            </div>
          </template>
        </Tabs>
        <div v-else class="modal-form-section">
          <!-- Fallback si no hay tabs y no se usa el slot default directamente -->
          <slot name="content" />
        </div>
      </slot>
    </div>
    <!-- Footer compacto -->
    <template #footer>
      <Button variant="secondary" size="sm" @click="$emit('update:modelValue', false)">
        {{ cancelText }}
      </Button>
      <Button 
        variant="primary" 
        size="sm"
        @click="$emit('submit')"
        :loading="loading"
        :disabled="submitDisabled"
      >
        {{ submitText }}
      </Button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import './ModalFormularioOrden.css'
import { ref, watch, computed } from 'vue'
import { Modal } from '../Modal'
import { Tabs } from '../Tabs'
import { Button } from '../Button'
import { FileText as FileTextIcon } from 'lucide-vue-next'

interface Tab {
  id: string
  label: string
  icon?: any
}

interface Props {
  modelValue: boolean
  title: string
  subtitle: string
  tabs?: Tab[]
  headerIcon?: any
  submitText?: string
  cancelText?: string
  loading?: boolean
  submitDisabled?: boolean
  defaultTab?: string
}

const props = withDefaults(defineProps<Props>(), {
  tabs: () => [],
  submitText: 'Guardar',
  cancelText: 'Cancelar',
  loading: false,
  submitDisabled: false,
  defaultTab: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'submit': []
}>()

// Computed seguro para el icono del header (evita problemas de timing con Lucide)
const safeHeaderIcon = computed(() => {
  if (props.headerIcon && (typeof props.headerIcon === 'object' || typeof props.headerIcon === 'function')) {
    return props.headerIcon
  }
  return FileTextIcon
})

const activeTab = ref(props.defaultTab || (props.tabs[0]?.id || ''))

watch(() => props.modelValue, (isOpen) => {
  if (isOpen && props.defaultTab) {
    activeTab.value = props.defaultTab
  } else if (isOpen) {
    activeTab.value = props.tabs[0]?.id || ''
  }
})
</script>

