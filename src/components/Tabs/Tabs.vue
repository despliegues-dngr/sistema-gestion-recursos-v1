<template>
  <div class="tabs">
    <div class="tabs-header" role="tablist">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['tabs-tab', { 'tabs-tab--active': activeTab === tab.id }]"
        :aria-selected="activeTab === tab.id"
        role="tab"
        @click="selectTab(tab.id)"
      >
        <!-- Renderizar icono solo si existe y es válido -->
        <template v-if="isValidIcon(tab.icon)">
          <component :is="tab.icon" :size="16" class="tabs-tab-icon" />
        </template>
        <span>{{ tab.label }}</span>
      </button>
    </div>
    <div class="tabs-content" role="tabpanel">
      <slot :name="activeTab" />
    </div>
  </div>
</template>

<script setup lang="ts">
import './Tabs.css'
import { computed } from 'vue'

interface Tab {
  id: string
  label: string
  icon?: any
}

interface Props {
  tabs: Tab[]
  modelValue: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const activeTab = computed({
  get: () => props.modelValue || props.tabs[0]?.id,
  set: (value) => emit('update:modelValue', value)
})

function selectTab(tabId: string) {
  activeTab.value = tabId
}

// Función helper para validar que el icono es un componente válido
function isValidIcon(icon: any): boolean {
  return icon !== undefined && icon !== null && (typeof icon === 'object' || typeof icon === 'function')
}
</script>

