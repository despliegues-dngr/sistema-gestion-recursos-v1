<template>
  <MainLayout>
    <PageLayout>
      <template #main>
        <!-- Card única de altura completa -->
        <Card class="dashboard-card">
          <template #header>
            <div class="dashboard-header">
              <span>📊 Parte de Fuerza</span>
              <span class="dashboard-fecha">{{ fechaSeleccionadaFormateada }}</span>
            </div>
          </template>
          <ParteFuerza 
            :direcciones-seleccionadas="direccionesSeleccionadas"
            :conceptos-seleccionados="conceptosSeleccionados"
          />
        </Card>
      </template>
      <template #sidebar>
        <FilterPanel>
          <Accordion title="UNIDAD ACTUAL">
            <div class="filter-group">
              <UnitSelector />
            </div>
          </Accordion>
          <Accordion title="FILTROS DE FECHA">
            <div class="filter-group">
              <Input 
                label="Fecha" 
                type="date" 
                size="sm"
                v-model="fechaSeleccionada"
              />
              <p class="text-muted">Selecciona una fecha para ver el parte histórico</p>
            </div>
          </Accordion>

          <Accordion title="PARTES DE UNIDADES">
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

          <Accordion title="FILTROS DE CONCEPTO">
            <div class="direcciones-selector-panel">
              <label
                v-for="concepto in conceptosDisponibles"
                :key="concepto.key"
                class="direccion-checkbox"
              >
                <input
                  type="checkbox"
                  :value="concepto.key"
                  v-model="conceptosSeleccionados"
                />
                <span>{{ concepto.label }}</span>
              </label>
                      
              <button 
                class="btn-seleccionar-todas"
                @click="toggleTodosConceptos"
              >
                {{ todosConceptosSeleccionados ? 'Deseleccionar Todos' : 'Seleccionar Todos' }}
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
import { Card, FilterPanel, Accordion, Input, UnitSelector } from '@components'
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

// Direcciones seleccionadas (todas por defecto)
const direccionesSeleccionadas = ref(direccionesDisponibles.map(d => d.id))

// Conceptos disponibles
const conceptosDisponibles = [
  { key: 'trabajando', label: 'Trabajando' },
  { key: 'francos', label: 'Francos' },
  { key: 'licenciaAnual', label: 'Licencia anual' },
  { key: 'licenciaMedica', label: 'Licencia médica' },
  { key: 'curso', label: 'Curso' },
  { key: 'serv222', label: 'Realiza Serv. 222' }
]

// Conceptos seleccionados (todos por defecto)
const conceptosSeleccionados = ref(conceptosDisponibles.map(c => c.key))

// Estado reactivo para fecha
const fechaSeleccionada = ref(formatearFechaInput(new Date()))

// Computed para formato largo
const fechaSeleccionadaFormateada = computed(() => {
  const fecha = new Date(fechaSeleccionada.value)
  fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset())
  return fecha.toLocaleDateString('es-UY', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
})

// Función helper
function formatearFechaInput(fecha: Date): string {
  const year = fecha.getFullYear()
  const month = String(fecha.getMonth() + 1).padStart(2, '0')
  const day = String(fecha.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

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

// Lógica para conceptos
const todosConceptosSeleccionados = computed(() => {
  return conceptosSeleccionados.value.length === conceptosDisponibles.length
})

function toggleTodosConceptos() {
  if (todosConceptosSeleccionados.value) {
    conceptosSeleccionados.value = []
  } else {
    conceptosSeleccionados.value = conceptosDisponibles.map(c => c.key)
  }
}
</script>
