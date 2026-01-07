<template>
  <div class="table-wrapper">
    <table class="table">
      <thead class="table-head">
        <tr>
          <th
            v-for="column in columns"
            :key="column.field"
            class="table-th"
            :style="{ width: column.width, minWidth: column.width }"
            :class="{ 
              'table-th--sortable': column.sortable,
              [`table-th--${column.align}`]: column.align
            }"
            @click="column.sortable && handleSort(column.field)"
          >
            <div class="table-th-content">
              <template v-if="column.icon">
                <img 
                  :src="`/src/assets/images/${column.icon}.${column.icon === 'hidro' ? 'png' : 'svg'}`" 
                  :alt="column.label || column.field"
                  :title="column.label || column.field"
                  class="table-th-icon"
                />
              </template>
              <span v-else>{{ column.label }}</span>
              <template v-if="column.sortable">
                <ChevronUpIcon 
                  v-if="sortField === column.field && sortDirection === 'asc'" 
                  :size="14" 
                  class="table-sort-icon"
                />
                <ChevronDownIcon 
                  v-else-if="sortField === column.field && sortDirection === 'desc'" 
                  :size="14" 
                  class="table-sort-icon"
                />
                <ChevronsUpDownIcon 
                  v-else 
                  :size="14" 
                  class="table-sort-icon table-sort-icon--inactive"
                />
              </template>
            </div>
          </th>
          <th v-if="actions.length > 0" class="table-th table-th--actions">
            Acciones
          </th>
        </tr>
      </thead>
      
      <tbody class="table-body">
        <tr v-if="data.length === 0" class="table-row table-row--empty">
          <td :colspan="columns.length + (actions.length > 0 ? 1 : 0)" class="table-td table-td--empty">
            <slot name="empty">
              <div class="table-empty">
                <FileXIcon :size="48" class="table-empty-icon" />
                <p class="table-empty-text">{{ emptyMessage }}</p>
              </div>
            </slot>
          </td>
        </tr>
        
        <tr 
          v-for="(row, index) in data" 
          :key="(row.id as string | number) ?? index"
          class="table-row"
        >
          <td
            v-for="column in columns"
            :key="column.field"
            class="table-td"
            :class="{ [`table-td--${column.align}`]: column.align }"
          >
            <slot :name="`cell-${column.field}`" :value="getNestedValue(row, column.field)" :row="row">
              {{ getNestedValue(row, column.field) ?? '-' }}
            </slot>
          </td>
          
          <td v-if="actions.length > 0" class="table-td table-td--actions">
            <div class="table-actions">
              <button
                v-for="action in actions"
                :key="action.name"
                type="button"
                class="table-action-btn"
                :class="{ 'table-action-btn--danger': action.name === 'delete' }"
                :title="action.label"
                @click="$emit('action', { action: action.name, row })"
              >
                <component :is="getActionIcon(action.icon)" :size="16" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import './Table.css'
import { ref } from 'vue'
import { 
  ChevronUp as ChevronUpIcon, 
  ChevronDown as ChevronDownIcon, 
  ChevronsUpDown as ChevronsUpDownIcon, 
  FileX as FileXIcon, 
  Pencil as PencilIcon, 
  Trash2 as Trash2Icon, 
  Eye as EyeIcon, 
  ArrowRightLeft as ArrowRightLeftIcon 
} from 'lucide-vue-next'

export interface TableColumn {
  field: string
  label: string
  width?: string
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  icon?: string
}

export interface TableAction {
  name: string
  icon: string
  label: string
}

interface Props {
  columns: TableColumn[]
  data: Record<string, unknown>[]
  actions?: TableAction[]
  emptyMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  actions: () => [],
  emptyMessage: 'No hay datos para mostrar'
})

defineEmits<{
  action: [payload: { action: string; row: Record<string, unknown> }]
}>()

const sortField = ref<string | null>(null)
const sortDirection = ref<'asc' | 'desc'>('asc')

function handleSort(field: string) {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce((acc: unknown, part: string) => {
    if (acc && typeof acc === 'object') {
      return (acc as Record<string, unknown>)[part]
    }
    return undefined
  }, obj)
}

function getActionIcon(iconName: string) {
  const icons: Record<string, unknown> = {
    'edit': PencilIcon,
    'delete': Trash2Icon,
    'view': EyeIcon,
    'transfer': ArrowRightLeftIcon
  }
  return icons[iconName] || PencilIcon
}
</script>
