<template>
  <div class="data-table-container">
    <table class="data-table">
      <thead>
        <tr>
          <th 
            v-for="col in columns" 
            :key="col.field"
            :style="col.width ? { width: col.width } : {}"
          >
            {{ col.label }}
          </th>
          <th v-if="actions && actions.length > 0" class="data-table-th-actions">
            Acciones
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="data.length === 0">
          <td :colspan="columns.length + (actions?.length ? 1 : 0)" class="data-table-empty">
            {{ emptyMessage }}
          </td>
        </tr>
        <tr v-for="(row, rowIndex) in data" :key="rowIndex">
          <td v-for="col in columns" :key="col.field">
            {{ getNestedValue(row, col.field) }}
          </td>
          <td v-if="actions && actions.length > 0" class="data-table-td-actions">
            <div class="data-table-actions">
              <button
                v-for="action in actions"
                :key="action.name"
                type="button"
                :class="['data-table-action-btn', action.variant && `data-table-action-btn--${action.variant}`]"
                :title="action.name"
                @click="$emit('action', { action: action.name, row })"
              >
                <component :is="action.icon" :size="14" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import './DataTable.css'
import type { Component } from 'vue'

interface Column {
  field: string
  label: string
  width?: string
}

interface Action {
  name: string
  icon: Component
  variant?: 'default' | 'danger'
}

interface Props {
  columns: Column[]
  data: any[]
  actions?: Action[]
  emptyMessage?: string
}

withDefaults(defineProps<Props>(), {
  actions: () => [],
  emptyMessage: 'No hay datos disponibles'
})

defineEmits<{
  action: [payload: { action: string, row: any }]
}>()

function getNestedValue(obj: any, path: string) {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj) || '-'
}
</script>

