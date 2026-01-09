<template>
  <MainLayout>
    <PageLayout>
      <template #main>
        <div class="reportes-grid">
          <Card>
            <template #header>
              <span>Reporte de Personal</span>
            </template>
            <div class="page-placeholder">
              <p>Métricas de personal - En desarrollo</p>
            </div>
          </Card>

          <Card>
            <template #header>
              <span>Reporte de Operatividad</span>
            </template>
            <div class="page-placeholder">
              <p>Métricas de operatividad - En desarrollo</p>
            </div>
          </Card>

          <Card>
            <template #header>
              <span>Reporte de Asistencia</span>
            </template>
            <div class="page-placeholder">
              <p>Métricas de asistencia - En desarrollo</p>
            </div>
          </Card>

          <Card>
            <template #header>
              <span>Reporte de Despliegues</span>
            </template>
            <div class="page-placeholder">
              <p>Métricas de despliegues - En desarrollo</p>
            </div>
          </Card>
        </div>
      </template>

      <template #sidebar>
        <FilterPanel>
          <Accordion title="UNIDAD ACTUAL">
            <div class="filter-group">
              <UnitSelector />
            </div>
          </Accordion>
          <Accordion title="FILTROS DE REPORTE">
            <div class="filter-group">
              <Select label="Tipo de Reporte" placeholder="Seleccionar reporte" size="sm" />
              <Input label="Período Desde" placeholder="Fecha inicio" size="sm" />
              <Input label="Período Hasta" placeholder="Fecha fin" size="sm" />
              <Select label="Unidad" placeholder="Todas las unidades" size="sm" />
            </div>
          </Accordion>
        </FilterPanel>
      </template>
    </PageLayout>
  </MainLayout>
</template>

<script setup lang="ts">
import { MainLayout, PageLayout } from "@layouts";
import { Card, Input, Select, Accordion, FilterPanel, UnitSelector } from "@components";
</script>

<style scoped>
.reportes-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
  height: 100%;
  overflow-y: auto;
}

.page-placeholder {
  padding: var(--space-8);
  text-align: center;
  color: var(--color-gray-500);
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

@media (max-width: 768px) {
  .reportes-grid {
    grid-template-columns: 1fr;
  }
}
</style>

