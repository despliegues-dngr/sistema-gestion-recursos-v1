<template>
  <div class="pagination">
    <div class="pagination-info">
      <span class="pagination-text">
        Mostrando {{ startItem }}-{{ endItem }} de {{ totalItems }}
      </span>
    </div>
    
    <div class="pagination-controls">
      <button
        type="button"
        class="pagination-btn"
        :disabled="currentPage === 1"
        title="Primera página"
        @click="$emit('first')"
      >
        <ChevronsLeft :size="16" />
      </button>
      
      <button
        type="button"
        class="pagination-btn"
        :disabled="currentPage === 1"
        title="Página anterior"
        @click="$emit('previous')"
      >
        <ChevronLeft :size="16" />
      </button>
      
      <span class="pagination-current">
        Página {{ currentPage }} de {{ totalPages }}
      </span>
      
      <button
        type="button"
        class="pagination-btn"
        :disabled="currentPage === totalPages"
        title="Página siguiente"
        @click="$emit('next')"
      >
        <ChevronRight :size="16" />
      </button>
      
      <button
        type="button"
        class="pagination-btn"
        :disabled="currentPage === totalPages"
        title="Última página"
        @click="$emit('last')"
      >
        <ChevronsRight :size="16" />
      </button>
    </div>
    
    <div class="pagination-size">
      <label class="pagination-size-label">
        Filas:
        <select
          class="pagination-size-select"
          :value="pageSize"
          @change="handlePageSizeChange"
        >
          <option v-for="size in pageSizeOptions" :key="size" :value="size">
            {{ size }}
          </option>
        </select>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import './Pagination.css'
import { computed } from 'vue'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-vue-next'

interface Props {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  pageSizeOptions?: number[]
}

const props = withDefaults(defineProps<Props>(), {
  pageSizeOptions: () => [10, 20, 50, 100]
})

const emit = defineEmits<{
  first: []
  previous: []
  next: []
  last: []
  'update:pageSize': [size: number]
}>()

const startItem = computed(() => {
  if (props.totalItems === 0) return 0
  return (props.currentPage - 1) * props.pageSize + 1
})

const endItem = computed(() => {
  return Math.min(props.currentPage * props.pageSize, props.totalItems)
})

function handlePageSizeChange(event: Event) {
  const target = event.target as HTMLSelectElement
  emit('update:pageSize', Number(target.value))
}
</script>
