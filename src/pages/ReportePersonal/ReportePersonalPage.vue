<template>
  <MainLayout>
    <PageLayout>
      <template #main>
        <!-- Card única de altura completa -->
        <Card class="dashboard-card">
          <template #header>
            <span>📊 Parte de Fuerza</span>
          </template>
          <ParteFuerza :direcciones-seleccionadas="direccionesSeleccionadas" />
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

          <Accordion title="UNIDADES A COMPARAR" default-open>
            <div class="direcciones-selector-panel">
              <label
                v-for="dir in direccionesDisponibles"
                :key="dir.id"
                class="direccion-checkbox"
              >
                <input
                  type="checkbox"
                  :value="dir.id"
                  v-model="direccionesSeleccionadas"
                />
                <span>{{ dir.nombre }}</span>
              </label>
              
              <button 
                class="btn-seleccionar-todas"
                @click="toggleTodas"
              >
                {{ todasSeleccionadas ? 'Deseleccionar Todas' : 'Seleccionar Todas' }}
              </button>
            </div>
          </Accordion>
        </FilterPanel>
      </template>
    </PageLayout>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { MainLayout, PageLayout } from '@layouts'
import { Card, FilterPanel, Accordion, Input } from '@components'
import { ParteFuerza } from './components'
import './ReportePersonalPage.css'

// IDs y nombres de direcciones para el filtro
const direccionesDisponibles = [
  { id: 'dir-i', nombre: 'Dir I' },
  { id: 'dir-ii', nombre: 'Dir II' },
  { id: 'reg-norte', nombre: 'Reg Norte' },
  { id: 'reg-este', nombre: 'Reg Este' },
  { id: 'geo', nombre: 'GEO' }
]

// Direcciones seleccionadas (por defecto: Dir I y Dir II)
const direccionesSeleccionadas = ref(['dir-i', 'dir-ii'])

// Lógica de selección masiva
const todasSeleccionadas = computed(() => {
  return direccionesSeleccionadas.value.length === direccionesDisponibles.length
})

function toggleTodas() {
  if (todasSeleccionadas.value) {
    direccionesSeleccionadas.value = []
  } else {
    direccionesSeleccionadas.value = direccionesDisponibles.map(d => d.id)
  }
}
</script>
