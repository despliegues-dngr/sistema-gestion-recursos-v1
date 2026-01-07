<template>
  <MainLayout>
    <PageLayout>
      <template #main>
        <div class="reporte-operativo-grid">
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
          <Accordion title="FILTROS DE REPORTE" default-open>
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
import { MainLayout, PageLayout } from '@layouts'
import { Card, FilterPanel, Accordion, Select, Input } from '@components'
import './ReporteOperativoPage.css'
</script>
