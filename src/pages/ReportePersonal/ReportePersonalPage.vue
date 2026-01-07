<template>
  <MainLayout>
    <PageLayout>
      <template #main>
        <!-- Card única de altura completa -->
        <Card class="dashboard-card">
          <template #header>
            <span>📊 Parte de Fuerza</span>
          </template>
          <ParteFuerza />
        </Card>
      </template>
      <template #sidebar>
        <FilterPanel>
          <Accordion title="FILTROS DE FECHA" default-open>
            <div class="filter-group">
              <Input label="Fecha" type="date" size="sm" />
              <p class="text-muted">Selecciona una fecha para ver el parte histórico</p>
            </div>
          </Accordion>
        </FilterPanel>
      </template>
    </PageLayout>
  </MainLayout>
</template>

<script setup lang="ts">
import { MainLayout, PageLayout } from '@layouts'
import { Card, FilterPanel, Accordion, Input } from '@components'
import { ParteFuerza } from './components'
import './ReportePersonalPage.css'
</script>
