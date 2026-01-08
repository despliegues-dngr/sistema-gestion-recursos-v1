<template>
  <MainLayout>
    <PageLayout>
      <template #main>
        <Card class="dashboard-card">
          <template #header>
            <div class="dashboard-header">
              <span>📊 Dashboard de Cumplimiento</span>
              <span class="dashboard-fecha">{{ fechaSeleccionadaFormateada }}</span>
            </div>
          </template>
          
          <div v-if="isLoading" class="loading-state">
            <p>Cargando métricas...</p>
          </div>
          
          <Table 
            v-else
            :columns="columnas"
            :data="metricasFiltradas"
            :actions="[]"
          >
            <!-- Slot para columna Atrasados -->
            <template #cell-atrasados="{ row }">
              <Badge 
                :variant="row.atrasados > 0 ? 'danger' : 'success'"
                size="sm"
              >
                {{ row.atrasados > 0 ? `🔴 ${row.atrasados}` : '✅ 0' }}
              </Badge>
            </template>
            
            <!-- Slot para columna Por Enviar -->
            <template #cell-porEnviar="{ row }">
              <Badge variant="warning" size="sm">
                🟡 {{ row.reportadosHoy }}/{{ row.totalEsperadoHoy }}
              </Badge>
            </template>
            
            <!-- Slot para columna Cumplimiento -->
            <template #cell-cumplimiento="{ row }">
              <div class="cumplimiento-cell">
                <ProgressBar 
                  :current="row.cumplimiento"
                  :total="100"
                  label="%"
                  :show-values="false"
                  :show-label="false"
                />
              </div>
            </template>
          </Table>
        </Card>
      </template>
      
      <template #sidebar>
        <FilterPanel>
          <Accordion title="FILTROS DE FECHA" default-open>
            <div class="filter-group">
              <Input 
                label="Fecha de Consulta" 
                type="date" 
                size="sm"
                v-model="fechaSeleccionada"
                @change="cargarMetricas"
              />
              <p class="text-muted">
                Selecciona una fecha para ver las métricas históricas
              </p>
            </div>
          </Accordion>
          
          <Accordion title="FILTROS DE UNIDAD" default-open>
            <div class="filter-group">
              <label 
                v-for="dir in direccionesDisponibles" 
                :key="dir.id"
                class="checkbox-label"
              >
                <input 
                  type="checkbox" 
                  :value="dir.id"
                  v-model="direccionesSeleccionadas"
                />
                <span>{{ dir.nombre }}</span>
              </label>
            </div>
          </Accordion>
        </FilterPanel>
      </template>
    </PageLayout>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { MainLayout, PageLayout } from '@layouts'
import { Card, FilterPanel, Accordion, Input, Table, Badge, ProgressBar } from '@components'
import { desplieguesService } from '@services'
import { db } from '@lib/db'
import './ReporteOperativoPage.css'

interface MetricaDireccion {
  id: number
  nombre: string
  atrasados: number
  porEnviar: number
  reportadosHoy: number
  totalEsperadoHoy: number
  cumplimiento: number
}

// Estado reactivo
const isLoading = ref(true)
const metricas = ref<MetricaDireccion[]>([])
const fechaSeleccionada = ref(formatearFechaInput(new Date()))
const direccionesDisponibles = ref<{ id: number; nombre: string }[]>([])
const direccionesSeleccionadas = ref<number[]>([])

// Columnas de la tabla
const columnas = [
  { field: 'nombre', label: 'Dirección', width: '200px' },
  { field: 'atrasados', label: 'Reportes Vencidos', width: '150px', align: 'center' },
  { field: 'porEnviar', label: 'Pendientes del Día', width: '160px', align: 'center' },
  { field: 'cumplimiento', label: 'Cumplimiento', width: '300px', align: 'left' }
]

// Computed
const fechaSeleccionadaFormateada = computed(() => {
  const fecha = new Date(fechaSeleccionada.value)
  // Añadir un offset para evitar problemas de zona horaria al convertir string de input date
  fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset())
  return fecha.toLocaleDateString('es-UY', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
})

const metricasFiltradas = computed(() => {
  if (direccionesSeleccionadas.value.length === 0) {
    return []
  }
  return metricas.value.filter(m => 
    direccionesSeleccionadas.value.includes(m.id)
  )
})

// Funciones
function formatearFechaInput(fecha: Date): string {
  const year = fecha.getFullYear()
  const month = String(fecha.getMonth() + 1).padStart(2, '0')
  const day = String(fecha.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

async function cargarDirecciones() {
  // AI-Hint: Se filtran unidades que tienen órdenes operativas activas para asegurar datos reales
  // Obtener IDs de unidades que tienen órdenes operativas asignadas
  const ordenes = await db.ordenes_operativas.toArray()
  const unidadesConOrdenes = new Set(
    ordenes
      .filter(o => !o.eliminada)
      .map(o => o.unidadSolicitadaId)
  )
  
  // Cargar solo esas unidades
  const unidades = await db.unidades.toArray()
  direccionesDisponibles.value = unidades
    .filter(u => u.id && unidadesConOrdenes.has(u.id))
    .map(u => ({ id: u.id!, nombre: u.nombre }))
  
  // Seleccionar todas por defecto
  direccionesSeleccionadas.value = direccionesDisponibles.value.map(d => d.id)
}

async function cargarMetricas() {
  isLoading.value = true
  try {
    const metricasTemp: MetricaDireccion[] = []
    
    for (const dir of direccionesDisponibles.value) {
      // AI-Hint: Por ahora los servicios están hardcodeados para HOY. 
      // TODO: Integrar con servicios cuando soporten fecha parametrizada.
      
      // 1. Atrasados
      const atrasados = await desplieguesService.getSinCargar(dir.id)
      
      // 2. Pendientes y reportados del día
      const porEnviar = await desplieguesService.getParaHoy(dir.id)
      const cargadosHoy = await desplieguesService.getCargadosHoy(dir.id)
      
      const reportadosHoy = cargadosHoy.length
      const totalEsperadoHoy = porEnviar.length + cargadosHoy.length
      
      // 3. Cumplimiento
      const cumplimientos = cargadosHoy
        .filter(r => r.refPlanTotalPersonal && r.refPlanTotalPersonal > 0)
        .map(reporte => {
          return Math.round((reporte.realTotalPersonal / reporte.refPlanTotalPersonal!) * 100)
        })
      
      const cumplimientoPromedio = cumplimientos.length > 0
        ? Math.round(cumplimientos.reduce((a, b) => a + b, 0) / cumplimientos.length)
        : 0
      
      metricasTemp.push({
        id: dir.id,
        nombre: dir.nombre,
        atrasados: atrasados.length,
        porEnviar: porEnviar.length,
        reportadosHoy,
        totalEsperadoHoy,
        cumplimiento: cumplimientoPromedio
      })
    }
    
    metricas.value = metricasTemp
  } catch (error) {
    console.error('Error al cargar métricas:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await cargarDirecciones()
  await cargarMetricas()
})
</script>
