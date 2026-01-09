<template>
  <MainLayout>
    <PageLayout>
      <template #main>
        <Card class="dashboard-card">
          <template #header>
            <span>Administración del Sistema</span>
          </template>
          <div class="admin-tabs">
            <div class="admin-tab-section">
              <h3>Usuarios</h3>
              <div class="page-placeholder">
                <p>Gestión de usuarios - En desarrollo</p>
              </div>
            </div>
            <div class="admin-tab-section">
              <h3>Roles y Permisos</h3>
              <div class="page-placeholder">
                <p>Gestión de roles y permisos - En desarrollo</p>
              </div>
            </div>
            <div class="admin-tab-section">
              <h3>Configuración</h3>
              <div class="page-placeholder">
                <p>Configuración del sistema - En desarrollo</p>
              </div>
            </div>
            <div class="admin-tab-section">
              <h3>Auditoría</h3>
              <div class="page-placeholder">
                <p>Logs de auditoría - En desarrollo</p>
              </div>
            </div>
          </div>
        </Card>
      </template>

      <template #sidebar>
        <FilterPanel>
          <Accordion title="UNIDAD ACTUAL">
            <div class="filter-group">
              <UnitSelector />
            </div>
          </Accordion>
          <Accordion title="OPCIONES">
            <div class="filter-group">
              <p class="sidebar-info">Seleccione una sección de administración para gestionar.</p>
            </div>
          </Accordion>
        </FilterPanel>
      </template>
    </PageLayout>
  </MainLayout>
</template>

<script setup lang="ts">
import { MainLayout, PageLayout } from "@layouts";
import { Card, Accordion, FilterPanel, UnitSelector } from "@components";
</script>

<style scoped>
.dashboard-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.dashboard-card :deep(.card-body) {
  flex: 1;
  overflow-y: auto;
}

.admin-tabs {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.admin-tab-section {
  padding: var(--space-4);
  border-bottom: 1px solid var(--border-color);
}

.admin-tab-section:last-child {
  border-bottom: none;
}

.admin-tab-section h3 {
  margin: 0 0 var(--space-3) 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
}

.page-placeholder {
  padding: var(--space-6);
  text-align: center;
  color: var(--color-gray-500);
  min-height: 100px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.sidebar-info {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
  line-height: 1.5;
}
</style>

