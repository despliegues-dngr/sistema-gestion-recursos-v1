<template>
  <div class="parte-fuerza">
    <!-- Tabla SS.OO. -->
    <div class="categoria-section">
      <div class="categoria-header">
        <h3 class="categoria-titulo">SS.OO.</h3>
        <button 
          type="button" 
          class="btn-export-csv"
          @click="exportarCSV('ssoo')"
          title="Exportar a CSV"
        >
          <Download :size="16" />
          Exportar CSV
        </button>
      </div>
      <Table 
        :columns="columnasTabla" 
        :data="datosTablaSSOO"
        :actions="[]"
      >
        <!-- Slot para estilizar columna "Concepto" -->
        <template #cell-concepto="{ row }">
          <span 
            :class="{
              'concepto-normal': !row.esResumen && !row.esDestacado,
              'concepto-resumen': row.esResumen,
              'concepto-destacado': row.esDestacado
            }"
          >
            {{ row.concepto }}
          </span>
        </template>

        <!-- Slot para estilizar columnas de direcciones -->
        <template 
          v-for="dir in direccionesMostradas" 
          :key="dir.id"
          #[`cell-${dir.id}`]="{ row }"
        >
          <span 
            :class="{
              'valor-normal': !row.esResumen && !row.esDestacado,
              'valor-resumen': row.esResumen,
              'valor-destacado': row.esDestacado
            }"
          >
            {{ row[dir.id] }}
          </span>
        </template>

        <!-- Slot para columna TOTAL -->
        <template #cell-total="{ row }">
          <span 
            :class="{
              'total-normal': !row.esResumen && !row.esDestacado,
              'total-resumen': row.esResumen,
              'total-destacado': row.esDestacado
            }"
          >
            {{ row.total }}
          </span>
        </template>
      </Table>
    </div>

    <!-- Tabla Personal Subalterno -->
    <div class="categoria-section">
      <div class="categoria-header">
        <h3 class="categoria-titulo">Personal Subalterno</h3>
        <button 
          type="button" 
          class="btn-export-csv"
          @click="exportarCSV('subalterno')"
          title="Exportar a CSV"
        >
          <Download :size="16" />
          Exportar CSV
        </button>
      </div>
      <Table 
        :columns="columnasTabla" 
        :data="datosTablaSubalterno"
        :actions="[]"
      >
        <!-- Mismos slots que SS.OO. -->
        <template #cell-concepto="{ row }">
          <span 
            :class="{
              'concepto-normal': !row.esResumen && !row.esDestacado,
              'concepto-resumen': row.esResumen,
              'concepto-destacado': row.esDestacado
            }"
          >
            {{ row.concepto }}
          </span>
        </template>
        <template 
          v-for="dir in direccionesMostradas" 
          :key="dir.id"
          #[`cell-${dir.id}`]="{ row }"
        >
          <span 
            :class="{
              'valor-normal': !row.esResumen && !row.esDestacado,
              'valor-resumen': row.esResumen,
              'valor-destacado': row.esDestacado
            }"
          >
            {{ row[dir.id] }}
          </span>
        </template>
        <template #cell-total="{ row }">
          <span 
            :class="{
              'total-normal': !row.esResumen && !row.esDestacado,
              'total-resumen': row.esResumen,
              'total-destacado': row.esDestacado
            }"
          >
            {{ row.total }}
          </span>
        </template>
      </Table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Table } from '@components'
import { Download } from 'lucide-vue-next'

interface Props {
  direccionesSeleccionadas: string[]
  conceptosSeleccionados: string[]
}

const props = defineProps<Props>()

// Estados del personal
const estadosPersonal = [
  { key: 'trabajando', label: 'Trabajando' },
  { key: 'francos', label: 'Francos' },
  { key: 'licenciaAnual', label: 'Licencia anual' },
  { key: 'licenciaMedica', label: 'Licencia médica' },
  { key: 'curso', label: 'Curso' },
  { key: 'serv222', label: 'Realiza Serv. 222' }
]

// Datos mockeados de direcciones
const direccionesDisponibles = [
  {
    id: 'dir-i',
    nombre: 'Dir I',
    ssoo: {
      trabajando: 20,
      francos: 5,
      licenciaAnual: 3,
      licenciaMedica: 2,
      curso: 1,
      serv222: 2
    },
    subalterno: {
      trabajando: 45,
      francos: 8,
      licenciaAnual: 5,
      licenciaMedica: 3,
      curso: 2,
      serv222: 4
    }
  },
  {
    id: 'dir-ii',
    nombre: 'Dir II',
    ssoo: {
      trabajando: 18,
      francos: 4,
      licenciaAnual: 2,
      licenciaMedica: 1,
      curso: 0,
      serv222: 1
    },
    subalterno: {
      trabajando: 40,
      francos: 7,
      licenciaAnual: 4,
      licenciaMedica: 2,
      curso: 1,
      serv222: 3
    }
  },
  {
    id: 'reg-norte',
    nombre: 'Reg Norte',
    ssoo: {
      trabajando: 15,
      francos: 3,
      licenciaAnual: 2,
      licenciaMedica: 1,
      curso: 1,
      serv222: 1
    },
    subalterno: {
      trabajando: 35,
      francos: 6,
      licenciaAnual: 3,
      licenciaMedica: 2,
      curso: 1,
      serv222: 2
    }
  },
  {
    id: 'reg-este',
    nombre: 'Reg Este',
    ssoo: {
      trabajando: 16,
      francos: 3,
      licenciaAnual: 1,
      licenciaMedica: 1,
      curso: 0,
      serv222: 0
    },
    subalterno: {
      trabajando: 38,
      francos: 5,
      licenciaAnual: 3,
      licenciaMedica: 1,
      curso: 1,
      serv222: 2
    }
  },
  {
    id: 'geo',
    nombre: 'GEO',
    ssoo: {
      trabajando: 12,
      francos: 2,
      licenciaAnual: 1,
      licenciaMedica: 0,
      curso: 0,
      serv222: 0
    },
    subalterno: {
      trabajando: 25,
      francos: 4,
      licenciaAnual: 2,
      licenciaMedica: 1,
      curso: 0,
      serv222: 1
    }
  }
]

// Direcciones a mostrar en la tabla
const direccionesMostradas = computed(() => {
  return direccionesDisponibles.filter(d => 
    props.direccionesSeleccionadas.includes(d.id)
  )
})

// Calcular "Se deduce" para una categoría
function calcularDeduce(categoria: any) {
  return (
    categoria.francos +
    categoria.licenciaAnual +
    categoria.licenciaMedica +
    categoria.curso +
    (categoria.serv222 || 0)
  )
}

// Calcular "Fuerza Efectiva" para una categoría
function calcularEfectiva(categoria: any) {
  return categoria.trabajando - calcularDeduce(categoria)
}

// Computed para estados a mostrar según filtro
const estadosFiltrados = computed(() => {
  // Si no hay filtros seleccionados, mostrar todos
  if (props.conceptosSeleccionados.length === 0) {
    return estadosPersonal
  }
  // Filtrar según selección
  return estadosPersonal.filter(estado => 
    props.conceptosSeleccionados.includes(estado.key)
  )
})

// Generar columnas dinámicas según direcciones seleccionadas
const columnasTabla = computed(() => {
  const cols: any[] = [
    { field: 'concepto', label: 'Concepto', width: '200px' }
  ]
  
  // Agregar columna por cada dirección seleccionada
  direccionesMostradas.value.forEach(dir => {
    cols.push({
      field: dir.id,
      label: dir.nombre,
      width: '100px',
      align: 'center'
    })
  })
  
  // Columna TOTAL
  cols.push({
    field: 'total',
    label: 'TOTAL',
    width: '100px',
    align: 'center'
  })
  
  return cols
})

// Generar datos para tabla SS.OO.
const datosTablaSSOO = computed(() => {
  const filas: any[] = []
  
  // Filas de estados normales
  estadosFiltrados.value.forEach(estado => {
    const fila: any = {
      concepto: estado.label,
      esResumen: false,
      esDestacado: false
    }
    
    // Agregar valor por cada dirección
    direccionesMostradas.value.forEach(dir => {
      fila[dir.id] = (dir.ssoo as any)[estado.key]
    })
    
    // Calcular total
    fila.total = direccionesMostradas.value.reduce((sum, dir) => {
      return sum + (dir.ssoo as any)[estado.key]
    }, 0)
    
    filas.push(fila)
  })
  
  // Fila "Se deduce"
  const filaDeduce: any = {
    concepto: 'Se deduce',
    esResumen: true,
    esDestacado: false
  }
  direccionesMostradas.value.forEach(dir => {
    filaDeduce[dir.id] = calcularDeduce(dir.ssoo)
  })
  filaDeduce.total = direccionesMostradas.value.reduce((sum, dir) => {
    return sum + calcularDeduce(dir.ssoo)
  }, 0)
  filas.push(filaDeduce)
  
  // Fila "FUERZA EFECTIVA"
  const filaEfectiva: any = {
    concepto: 'FUERZA EFECTIVA',
    esResumen: false,
    esDestacado: true
  }
  direccionesMostradas.value.forEach(dir => {
    filaEfectiva[dir.id] = calcularEfectiva(dir.ssoo)
  })
  filaEfectiva.total = direccionesMostradas.value.reduce((sum, dir) => {
    return sum + calcularEfectiva(dir.ssoo)
  }, 0)
  filas.push(filaEfectiva)
  
  return filas
})

// Generar datos para tabla Personal Subalterno
const datosTablaSubalterno = computed(() => {
  const filas: any[] = []
  
  // Filas de estados normales
  estadosFiltrados.value.forEach(estado => {
    const fila: any = {
      concepto: estado.label,
      esResumen: false,
      esDestacado: false
    }
    
    direccionesMostradas.value.forEach(dir => {
      fila[dir.id] = (dir.subalterno as any)[estado.key]
    })
    
    fila.total = direccionesMostradas.value.reduce((sum, dir) => {
      return sum + (dir.subalterno as any)[estado.key]
    }, 0)
    
    filas.push(fila)
  })
  
  // Fila "Se deduce"
  const filaDeduce: any = {
    concepto: 'Se deduce',
    esResumen: true,
    esDestacado: false
  }
  direccionesMostradas.value.forEach(dir => {
    filaDeduce[dir.id] = calcularDeduce(dir.subalterno)
  })
  filaDeduce.total = direccionesMostradas.value.reduce((sum, dir) => {
    return sum + calcularDeduce(dir.subalterno)
  }, 0)
  filas.push(filaDeduce)
  
  // Fila "FUERZA EFECTIVA"
  const filaEfectiva: any = {
    concepto: 'FUERZA EFECTIVA',
    esResumen: false,
    esDestacado: true
  }
  direccionesMostradas.value.forEach(dir => {
    filaEfectiva[dir.id] = calcularEfectiva(dir.subalterno)
  })
  filaEfectiva.total = direccionesMostradas.value.reduce((sum, dir) => {
    return sum + calcularEfectiva(dir.subalterno)
  }, 0)
  filas.push(filaEfectiva)
  
  return filas
})

// Función placeholder para exportación CSV
function exportarCSV(tipo: 'ssoo' | 'subalterno') {
  console.log(`Exportar CSV: ${tipo}`)
  // TODO: Implementar lógica de exportación
}
</script>

<style scoped>
.parte-fuerza {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  padding: var(--space-4);
  height: 100%;
  overflow-y: auto;
  min-height: 0;
}

/* ========================================
   SECCIONES DE CATEGORÍA
   ======================================== */
.categoria-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

/* ========================================
   HEADER DE CATEGORÍA CON BOTÓN EXPORT
   ======================================== */
.categoria-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding-bottom: var(--space-2);
  border-bottom: 2px solid var(--border-color-strong);
}

.categoria-titulo {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
  margin: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.btn-export-csv {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background-color: var(--color-white);
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-md);
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.btn-export-csv:hover {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.btn-export-csv:active {
  transform: scale(0.98);
}

/* ========================================
   ESTILOS PARA SLOTS DE TABLE
   ======================================== */

/* Conceptos */
.concepto-normal {
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-700);
}

.concepto-resumen {
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
}

.concepto-destacado {
  font-weight: var(--font-weight-bold);
  color: var(--color-white);
}

/* Valores de direcciones */
.valor-normal {
  color: var(--color-gray-900);
  font-variant-numeric: tabular-nums;
  text-align: center;
  display: block;
}

.valor-resumen {
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
  font-variant-numeric: tabular-nums;
  text-align: center;
  display: block;
}

.valor-destacado {
  font-weight: var(--font-weight-bold);
  color: var(--color-white);
  font-variant-numeric: tabular-nums;
  text-align: center;
  display: block;
}

/* Totales */
.total-normal {
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  font-variant-numeric: tabular-nums;
  text-align: center;
  display: block;
}

.total-resumen {
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  font-variant-numeric: tabular-nums;
  text-align: center;
  display: block;
}

.total-destacado {
  font-weight: var(--font-weight-bold);
  color: var(--color-white);
  font-variant-numeric: tabular-nums;
  text-align: center;
  display: block;
}

/* Estilos para filas destacadas (aplicados via :deep) */
.parte-fuerza :deep(.table-row:has(.concepto-destacado)) {
  background-color: var(--color-primary) !important;
}

.parte-fuerza :deep(.table-row:has(.concepto-destacado) .table-td) {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.parte-fuerza :deep(.table-row:has(.concepto-resumen)) {
  background-color: var(--color-gray-50);
}

.parte-fuerza :deep(.table-row:has(.concepto-resumen) .table-td) {
  background-color: var(--color-gray-50);
}

/* ========================================
   RESPONSIVE
   ======================================== */
@media (max-width: 768px) {
  .categoria-titulo {
    font-size: var(--font-size-md);
  }
}
</style>