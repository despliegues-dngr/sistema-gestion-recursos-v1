<template>
  <ModalFormularioOrden
    :model-value="modelValue"
    title="Reporte de Despliegue Real"
    :subtitle="`${displayData.unidad} - ${displayData.orden}`"
    :tabs="reporteTabs"
    submit-text="Guardar Reporte"
    default-tab="recursos"
    @update:model-value="$emit('update:modelValue', $event)"
    @submit="handleGuardar"
  >
    <!-- Tab: Recursos Desplegados (Formulario) -->
    <template #recursos>
      <!-- Banner Informativo Estilo Badge -->
      <div class="info-banner">
        <p class="info-banner-text">
          Complete la información referente al despliegue del 
          <strong>"{{ displayData.nombreServicio }}"</strong> 
          en el horario de <strong>{{ displayData.horaInicio }}</strong> a 
          <strong>{{ displayData.horaFin }}</strong> 
          del día <strong>{{ displayData.fechaReporte }}</strong>.
        </p>
      </div>

      <!-- Selector de Tipo -->
      <div style="margin-bottom: var(--space-3);">
        <div class="ficha-dato">
          <span class="ficha-dato-label ficha-dato-label--required">Tipo de Despliegue</span>
          <Select
            v-model="formData.tipoDespliegue"
            :options="tipoDespliegueOptions"
            size="sm"
          />
        </div>
      </div>

      <!-- Formulario de recursos -->
      <InlineForm v-if="formData.tipoDespliegue === 'Despliegue'">
        <FichaFormulario :columns="3">
          <div class="ficha-dato">
            <span class="ficha-dato-label">Móviles</span>
            <Input 
              v-model="formData.realMoviles" 
              type="number" 
              :min="0" 
              size="sm"
              class="input-cantidad"
            >
              <template #icon>
                <img src="@/assets/images/movil.svg" alt="Móviles" style="width: 16px; height: 16px;" />
              </template>
            </Input>
          </div>
          
          <div class="ficha-dato">
            <span class="ficha-dato-label">Motos</span>
            <Input 
              v-model="formData.realMotos" 
              type="number" 
              :min="0" 
              size="sm"
              class="input-cantidad"
            >
              <template #icon>
                <img src="@/assets/images/motos.svg" alt="Motos" style="width: 16px; height: 16px;" />
              </template>
            </Input>
          </div>
          
          <div class="ficha-dato">
            <span class="ficha-dato-label">Motos Bi/Tripuladas</span>
            <Input 
              v-model="formData.realMotosBiTripuladas" 
              type="number" 
              :min="0" 
              size="sm"
              class="input-cantidad"
            >
              <template #icon>
                <img src="@/assets/images/motosBitripuladas.svg" alt="Motos Bi/Tripuladas" style="width: 16px; height: 16px;" />
              </template>
            </Input>
          </div>
          
          <div class="ficha-dato">
            <span class="ficha-dato-label">Hidrantes</span>
            <Input 
              v-model="formData.realHidro" 
              type="number" 
              :min="0" 
              size="sm"
              class="input-cantidad"
            >
              <template #icon>
                <img src="@/assets/images/hidro.png" alt="Hidrantes" style="width: 16px; height: 16px;" />
              </template>
            </Input>
          </div>
          
          <div class="ficha-dato">
            <span class="ficha-dato-label">Hipos</span>
            <Input 
              v-model="formData.realHipos" 
              type="number" 
              :min="0" 
              size="sm"
              class="input-cantidad"
            >
              <template #icon>
                <img src="@/assets/images/hipos.svg" alt="Hipos" style="width: 16px; height: 16px;" />
              </template>
            </Input>
          </div>
          
          <div class="ficha-dato">
            <span class="ficha-dato-label">SSOO</span>
            <Input 
              v-model="formData.realSsoo" 
              type="number" 
              :min="0" 
              size="sm"
              class="input-cantidad"
            >
              <template #icon>
                <img src="@/assets/images/ssoo.svg" alt="SSOO" style="width: 16px; height: 16px;" />
              </template>
            </Input>
          </div>
          
          <div class="ficha-dato">
            <span class="ficha-dato-label">P.P.S.S. en Móvil</span>
            <Input 
              v-model="formData.realPpssMovil" 
              type="number" 
              :min="0" 
              size="sm"
              class="input-cantidad"
            >
              <template #icon>
                <img src="@/assets/images/ppssEnMovil.svg" alt="P.P.S.S. en Móvil" style="width: 16px; height: 16px;" />
              </template>
            </Input>
          </div>
          
          <div class="ficha-dato">
            <span class="ficha-dato-label">Pie a Tierra</span>
            <Input 
              v-model="formData.realPieTierra" 
              type="number" 
              :min="0" 
              size="sm"
              class="input-cantidad"
            >
              <template #icon>
                <img src="@/assets/images/pieTierra.svg" alt="Pie a Tierra" style="width: 16px; height: 16px;" />
              </template>
            </Input>
          </div>
          
          <div class="ficha-dato">
            <span class="ficha-dato-label">Choque Apostado</span>
            <Input 
              v-model="formData.realChoqueApost" 
              type="number" 
              :min="0" 
              size="sm"
              class="input-cantidad"
            >
              <template #icon>
                <img src="@/assets/images/choqueApostado.svg" alt="Choque Apostado" style="width: 16px; height: 16px;" />
              </template>
            </Input>
          </div>
          
          <div class="ficha-dato">
            <span class="ficha-dato-label">Choque en Alerta</span>
            <Input 
              v-model="formData.realChoqueAlerta" 
              type="number" 
              :min="0" 
              size="sm"
              class="input-cantidad"
            >
              <template #icon>
                <img src="@/assets/images/choqueEnAlerta.svg" alt="Choque en Alerta" style="width: 16px; height: 16px;" />
              </template>
            </Input>
          </div>
          
          <div class="ficha-dato">
            <span class="ficha-dato-label">Total Efectivos</span>
            <div class="campo-calculado">
              <div class="campo-calculado-icon">
                <img src="@/assets/images/ppssTotal.svg" alt="Total Efectivos" style="width: 16px; height: 16px;" />
              </div>
              <div class="campo-calculado-valor">{{ totalEfectivosCalculado }}</div>
            </div>
          </div>
        </FichaFormulario>
      </InlineForm>

      <!-- Mensaje informativo -->
      <div v-else class="info-message">
        <p>{{ mensajeInformativo }}</p>
      </div>
    </template>
  </ModalFormularioOrden>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { ModalFormularioOrden, Select, FichaFormulario, Input, InlineForm } from '@components'
import { db } from '@lib/db'

interface Props {
  modelValue: boolean
  diaDespliegueId?: string | number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'success': []
}>()

// Estado reactivo
const displayData = ref({
  orden: '-',
  nombreServicio: '-',
  departamento: [] as string[],
  unidad: '-',
  fechaReporte: '-',
  horaInicio: '00:00',
  horaFin: 'fin',
  horario: '-',
  seccional: [] as string[]
})

const formData = ref({
  tipoDespliegue: 'Despliegue' as 'Despliegue' | 'Franco' | 'Sin efecto',
  realMoviles: 0,
  realMotos: 0,
  realMotosBiTripuladas: 0,
  realHidro: 0,
  realHipos: 0,
  realSsoo: 0,
  realPpssMovil: 0,
  realPieTierra: 0,
  realChoqueApost: 0,
  realChoqueAlerta: 0,
  realTotalPersonal: 0
})

// Computed property para calcular total de efectivos automáticamente
const totalEfectivosCalculado = computed(() => {
  const ppssMovil = Number(formData.value.realPpssMovil) || 0
  const motos = Number(formData.value.realMotos) || 0
  const hipos = Number(formData.value.realHipos) || 0
  const pieTierra = Number(formData.value.realPieTierra) || 0
  const motosBiTri = Number(formData.value.realMotosBiTripuladas) || 0
  
  return ppssMovil + motos + hipos + pieTierra + (motosBiTri * 2)
})

const reporteTabs = [
  { id: 'recursos', label: 'Recursos Desplegados' }
]

const tipoDespliegueOptions = [
  { value: 'Despliegue', label: 'Despliegue' },
  { value: 'Franco', label: 'Franco' },
  { value: 'Sin efecto', label: 'Sin efecto' }
]

const mensajeInformativo = computed(() => {
  return formData.value.tipoDespliegue === 'Franco'
    ? 'Personal en franco. No se requiere registro de recursos.'
    : 'Operativo sin efecto. No se requiere registro de recursos.'
})

// Cargar datos al abrir
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    cargarDatos()
  } else {
    resetForm()
  }
})

async function cargarDatos() {
  if (!props.diaDespliegueId) return
  
  try {
    let ordenId: number
    let fechaUnix: number | null = null

    if (typeof props.diaDespliegueId === 'string' && props.diaDespliegueId.includes('-')) {
      const parts = props.diaDespliegueId.split('-')
      ordenId = parseInt(parts[0])
      fechaUnix = parseInt(parts[1])
    } else {
      const reporte = await db.reportes_despliegue.get(Number(props.diaDespliegueId))
      if (reporte) {
        ordenId = reporte.ordenId
        fechaUnix = new Date(reporte.fechaDespliegue).getTime()
        
        formData.value = {
          tipoDespliegue: 'Despliegue',
          realMoviles: reporte.realMoviles || 0,
          realMotos: reporte.realMotos || 0,
          realMotosBiTripuladas: reporte.realMotosBiTripuladas || 0,
          realHidro: reporte.realHidro || 0,
          realHipos: reporte.realHipos || 0,
          realSsoo: reporte.realSsoo || 0,
          realPpssMovil: reporte.realPpssMovil || 0,
          realPieTierra: reporte.realPieTierra || 0,
          realChoqueApost: reporte.realChoqueApost || 0,
          realChoqueAlerta: reporte.realChoqueAlerta || 0,
          realTotalPersonal: reporte.realTotalPersonal || 0
        }
      } else {
        throw new Error('Reporte no encontrado')
      }
    }

    const orden = await db.ordenes_operativas.get(ordenId)
    if (orden) {
      const unidad = await db.unidades.get(orden.unidadSolicitadaId)
      
      displayData.value = {
        orden: `${orden.tipoDocumento} ${orden.nroDocumento}`,
        nombreServicio: [
          `${orden.tipoServicio || ''} ${orden.nombreDocumento || ''}`.trim(),
          orden.nombreServicio
        ].filter(Boolean).join(' - ') || '-',
        departamento: orden.departamento ? orden.departamento.split(', ') : [],
        unidad: unidad?.nombre || 'Sin Unidad',
        fechaReporte: fechaUnix 
          ? new Date(fechaUnix).toLocaleDateString('es-UY', { day: '2-digit', month: '2-digit', year: 'numeric' })
          : '-',
        horaInicio: orden.horaInicioPlan || '00:00',
        horaFin: orden.horaFinPlan || 'fin',
        horario: `${orden.horaInicioPlan || '00:00'} a ${orden.horaFinPlan || 'Fin'}`,
        seccional: orden.seccional ? orden.seccional.split(', ') : []
      }
    }
  } catch (error) {
    console.error('Error al cargar datos para el reporte:', error)
  }
}

function resetForm() {
  formData.value = {
    tipoDespliegue: 'Despliegue',
    realMoviles: 0,
    realMotos: 0,
    realMotosBiTripuladas: 0,
    realHidro: 0,
    realHipos: 0,
    realSsoo: 0,
    realPpssMovil: 0,
    realPieTierra: 0,
    realChoqueApost: 0,
    realChoqueAlerta: 0,
    realTotalPersonal: 0
  }
}

function handleGuardar() {
  console.log('Datos del reporte a guardar (Fase 1):', {
    diaDespliegueId: props.diaDespliegueId,
    ...formData.value,
    realTotalPersonal: totalEfectivosCalculado.value
  })
  
  emit('success')
}
</script>

<style scoped>
/* Banner Informativo - Estilo Badge Warning */
.info-banner {
  background-color: var(--color-warning-light);
  border: 1px solid var(--color-warning);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  margin-bottom: var(--space-4);
}

.info-banner-text {
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-normal);
  color: var(--color-gray-900); /* Color de texto estándar de la app */
}

.info-banner-text strong {
  font-weight: var(--font-weight-bold);
  color: var(--color-gray-900);
}

/* Inputs de Cantidad - Ancho Limitado */
.input-cantidad {
  max-width: 5rem; /* Suficiente para 2 dígitos + padding + icono */
}

/* Eliminar padding izquierdo del contenedor de ícono */
.input-cantidad :deep(.input-icon) {
  padding-left: 0;
}

/* Campo calculado (solo lectura) */
.campo-calculado {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: 0 var(--space-3);
  background-color: var(--color-gray-100);
  border: 2px solid var(--border-color-strong);
  border-radius: var(--radius-md);
  min-height: 32px;
  width: 100%;
  flex: 1;
}

.campo-calculado-icon {
  display: flex;
  align-items: center;
  opacity: 0.7;
}

.campo-calculado-valor {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}
</style>
