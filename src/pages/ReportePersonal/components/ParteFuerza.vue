<template>
  <div class="parte-fuerza">
    <!-- Selector de Direcciones -->
    <div class="direcciones-selector">
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

    <!-- Tabla SS.OO. -->
    <div class="categoria-section">
      <h3 class="categoria-titulo">SS.OO.</h3>
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
      <h3 class="categoria-titulo">Personal Subalterno</h3>
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
import { ref, computed } from 'vue'
import { Table } from '@components'

// Estados del personal
const estadosPersonal = [
  { key: 'trabajando', label: 'Trabajando' },
  { key: 'francos', label: 'Francos' },
  { key: 'licenciaAnual', label: 'Licencia anual' },
  { key: 'licenciaMedica', label: 'Licencia médica' },
  { key: 'curso', label: 'Curso' }
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
      curso: 1
    },
    subalterno: {
      trabajando: 45,
      francos: 8,
      licenciaAnual: 5,
      licenciaMedica: 3,
      curso: 2
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
      curso: 0
    },
    subalterno: {
      trabajando: 40,
      francos: 7,
      licenciaAnual: 4,
      licenciaMedica: 2,
      curso: 1
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
      curso: 1
    },
    subalterno: {
      trabajando: 35,
      francos: 6,
      licenciaAnual: 3,
      licenciaMedica: 2,
      curso: 1
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
      curso: 0
    },
    subalterno: {
      trabajando: 38,
      francos: 5,
      licenciaAnual: 3,
      licenciaMedica: 1,
      curso: 1
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
      curso: 0
    },
    subalterno: {
      trabajando: 25,
      francos: 4,
      licenciaAnual: 2,
      licenciaMedica: 1,
      curso: 0
    }
  }
]

// Direcciones seleccionadas (por defecto: Dir I y Dir II)
const direccionesSeleccionadas = ref(['dir-i', 'dir-ii'])

// Direcciones a mostrar en la tabla
const direccionesMostradas = computed(() => {
  return direccionesDisponibles.filter(d => 
    direccionesSeleccionadas.value.includes(d.id)
  )
})

// Todas seleccionadas
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

// Calcular "Se deduce" para una categoría
function calcularDeduce(categoria: any) {
  return categoria.francos + categoria.licenciaAnual + categoria.licenciaMedica + categoria.curso
}

// Calcular "Fuerza Efectiva" para una categoría
function calcularEfectiva(categoria: any) {
  return categoria.trabajando - calcularDeduce(categoria)
}

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
  estadosPersonal.forEach(estado => {
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
  estadosPersonal.forEach(estado => {
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
   SELECTOR DE DIRECCIONES
   ======================================== */
.direcciones-selector {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  background-color: var(--color-gray-50);
  border: 2px solid var(--border-color-strong);
  border-radius: var(--radius-md);
}

.direccion-checkbox {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
  user-select: none;
}

.direccion-checkbox input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--color-primary);
}

.direccion-checkbox span {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-900);
}

.direccion-checkbox:hover span {
  color: var(--color-primary);
}

.btn-seleccionar-todas {
  margin-left: auto;
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-primary);
  background-color: var(--color-white);
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-seleccionar-todas:hover {
  background-color: var(--color-primary);
  color: var(--color-white);
}

/* ========================================
   SECCIONES DE CATEGORÍA
   ======================================== */
.categoria-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.categoria-titulo {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
  margin: 0;
  padding-bottom: var(--space-2);
  border-bottom: 2px solid var(--border-color-strong);
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
  .direcciones-selector {
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-2);
  }
  
  .btn-seleccionar-todas {
    margin-left: 0;
    width: 100%;
  }
}
</style>
