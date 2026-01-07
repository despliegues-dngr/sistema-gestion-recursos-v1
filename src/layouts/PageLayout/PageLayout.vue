<template>
  <div class="page-layout">
    <!-- Contenido Principal -->
    <div class="page-layout-main">
      <slot name="main" />
    </div>

    <!-- Panel Lateral (opcional) -->
    <aside v-if="showSidebar" class="page-layout-sidebar">
      <slot name="sidebar" />
    </aside>
  </div>
</template>

<script setup lang="ts">
import "./PageLayout.css";

interface Props {
  showSidebar?: boolean;
}

withDefaults(defineProps<Props>(), {
  showSidebar: true,
});
</script>

