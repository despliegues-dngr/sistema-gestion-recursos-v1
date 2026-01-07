/**
 * Composable para paginación de datos
 */

import { ref, computed, watch, type Ref } from 'vue'
import { PAGINATION } from '@lib/constants'

export function usePagination<T>(
  data: Ref<T[]>,
  initialPageSize = PAGINATION.DEFAULT_PAGE_SIZE
) {
  const currentPage = ref(1)
  const pageSize = ref(initialPageSize)

  const totalItems = computed(() => data.value.length)
  
  const totalPages = computed(() => {
    if (totalItems.value === 0) return 1
    return Math.ceil(totalItems.value / pageSize.value)
  })

  const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return data.value.slice(start, end)
  })

  const paginationInfo = computed(() => ({
    currentPage: currentPage.value,
    totalPages: totalPages.value,
    totalItems: totalItems.value,
    pageSize: pageSize.value,
    startItem: totalItems.value === 0 ? 0 : (currentPage.value - 1) * pageSize.value + 1,
    endItem: Math.min(currentPage.value * pageSize.value, totalItems.value)
  }))

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  function nextPage() {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
    }
  }

  function previousPage() {
    if (currentPage.value > 1) {
      currentPage.value--
    }
  }

  function firstPage() {
    currentPage.value = 1
  }

  function lastPage() {
    currentPage.value = totalPages.value
  }

  function changePageSize(size: number) {
    pageSize.value = size as typeof pageSize.value
    currentPage.value = 1
  }

  function reset() {
    currentPage.value = 1
  }

  watch(data, () => {
    if (currentPage.value > totalPages.value) {
      currentPage.value = Math.max(1, totalPages.value)
    }
  })

  return {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    paginatedData,
    paginationInfo,
    goToPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    changePageSize,
    reset
  }
}
