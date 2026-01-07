<template>
  <aside
    class="filter-panel"
    :class="{ 'filter-panel--collapsed': isCollapsed }"
  >
    <!-- Toggle Button Row (solo visible cuando está colapsado) -->
    <div class="filter-panel-toggle-row">
      <button
        type="button"
        class="filter-panel-toggle"
        title="Expandir filtros"
        @click="togglePanel"
      >
        <ChevronLeft :size="16" />
      </button>
    </div>

    <!-- Panel Content -->
    <div v-show="!isCollapsed" class="filter-panel-content">
      <div class="filter-panel-header">
        <span class="filter-panel-title">
          <Filter :size="16" />
          FILTROS
        </span>
        <button
          type="button"
          class="filter-panel-toggle"
          title="Colapsar filtros"
          @click="togglePanel"
        >
          <ChevronRight :size="16" />
        </button>
      </div>

      <div class="filter-panel-body">
        <slot />
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import "./FilterPanel.css";
import { ref } from "vue";
import { ChevronRight, ChevronLeft, Filter } from "lucide-vue-next";

interface Props {
  defaultCollapsed?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  defaultCollapsed: false,
});

const isCollapsed = ref(props.defaultCollapsed);

function togglePanel() {
  isCollapsed.value = !isCollapsed.value;
}
</script>
