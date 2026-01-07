<template>
  <ModalFormularioOrden
    :model-value="modelValue"
    :title="esEditable ? 'Reporte de Despliegue Real' : 'Detalle de Reporte'"
    :subtitle="`${displayData.unidad} - ${displayData.orden}`"
    :tabs="esEditable ? reporteTabs : []"
    :submit-text="esEditable ? 'Guardar Reporte' : 'Cerrar'"
    :submit-disabled="false"
    :hide-cancel="!esEditable"
    default-tab="recursos"
    @update:model-value="$emit('update:modelValue', $event)"
    @submit="handleGuardar"
  >
    <!-- Contenido Directo (Modo Lectura) -->
    <template #content v-if="!esEditable">
      <ReporteDocumento
        :orden="displayData.orden"
        :operativo="displayData.nombreServicio"
        :unidad="displayData.unidad"
        :fecha="displayData.fechaReporte"
        :horario="displayData.horario"
        :tipo="formData.tipoDespliegue"
        :motivo="formData.motivoSinEfecto"
        :recursos="{
          moviles: formData.realMoviles,
          motos: formData.realMotos,
          motosBiTri: formData.realMotosBiTripuladas,
          hidro: formData.realHidro,
          hipos: formData.realHipos,
          ssoo: formData.realSsoo,
          ppssMovil: formData.realPpssMovil,
          pieTierra: formData.realPieTierra,
          choqueApost: formData.realChoqueApost,
          choqueAlerta: formData.realChoqueAlerta,
          totalEfectivos: totalEfectivosCalculado
        }"
        :plan-total-personal="refPlanTotalPersonal"
        :fecha-carga="formatearFechaHora(reporteFechaHoraCarga)"
      />
    </template>

    <!-- Tab: Recursos Desplegados (Modo Edición) -->
    <template #recursos v-if="esEditable">
      <div class="info-banner">
        <p class="info-banner-text">
          Complete la información referente al despliegue del 
          <strong>"{{ displayData.nombreServicio }}"</strong> 
          en el horario de <strong>{{ displayData.horaInicio }}</strong> a 
          <strong>{{ displayData.horaFin }}</strong> 
          del día <strong>{{ displayData.fechaReporte }}</strong>.
        </p>
      </div>

      <!-- Selectores en línea: Tipo + Motivo condicional -->
      <div style="margin-bottom: var(--space-3);">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3);">
          <!-- Tipo de Despliegue -->
          <div class="ficha-dato">
            <span class="ficha-dato-label ficha-dato-label--required">Tipo de Despliegue</span>
            <Select
              v-model="formData.tipoDespliegue"
              :options="tipoDespliegueOptions"
              size="sm"
            />
          </div>
          
          <!-- Motivo (condicional) -->
          <div v-if="formData.tipoDespliegue === 'Sin efecto'" class="ficha-dato">
            <span class="ficha-dato-label ficha-dato-label--required">Motivo</span>
            <Select
              v-model="formData.motivoSinEfecto"
              :options="motivoSinEfectoOptions"
              size="sm"
            />
          </div>
        </div>
      </div>

      <!-- Formulario de recursos -->
      <template v-if="formData.tipoDespliegue === 'Despliegue'">
        <InlineForm>
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
              <Input 
                :model-value="totalEfectivosCalculado" 
                type="text"
                size="sm"
                disabled
                class="input-cantidad input-total-efectivos"
              >
                <template #icon>
                  <img src="@/assets/images/ppssTotal.svg" alt="Total Efectivos" style="width: 16px; height: 16px;" />
                </template>
              </Input>
            </div>
          </FichaFormulario>
        </InlineForm>
      </template>

      <!-- Mensaje informativo para otros tipos (Franco/Sin Efecto) -->
      <div v-else class="info-message">
        <p>{{ mensajeInformativo }}</p>
      </div>
    </template>

    <!-- Footer: Responsable -->
    <template #footer-info>
      <span style="font-size: var(--font-size-sm); color: var(--color-gray-600);">
        <strong>Responsable:</strong> Tte. Juan Pérez
      </span>
    </template>
  </ModalFormularioOrden>

  <!-- Modal de Confirmación -->
  <ConfirmacionReporteModal
    :visible="showConfirmacionModal"
    :orden-nombre="displayData.nombreServicio"
    :fecha-despliegue="displayData.fechaReporte"
    :hora-inicio="displayData.horaInicio"
    :hora-fin="displayData.horaFin"
    :recursos="{ ...formData, realTotalPersonal: totalEfectivosCalculado }"
    :plan-total-personal="planTotalPersonal"
    :tipo-despliegue="formData.tipoDespliegue"
    :motivo-sin-efecto="formData.motivoSinEfecto"
    @confirm="handleConfirmarReporte"
    @cancel="showConfirmacionModal = false"
  />
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { 
  ModalFormularioOrden, 
  Select, 
  FichaFormulario, 
  Input, 
  InlineForm, 
  ConfirmacionReporteModal,
  ReporteDocumento
} from '@components'
import { db } from '@lib/db'
import { desplieguesService } from '@services'
import { useToast } from '@hooks'

interface Props {
  modelValue: boolean
  diaDespliegueId?: string | number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'success': []
}>()

const toast = useToast()

// Estado reactivo
const showConfirmacionModal = ref(false)
const esEditable = ref(true)
const reporteExistenteId = ref<number | null>(null)
const reporteFechaHoraCarga = ref<Date | null>(null)
const refPlanTotalPersonal = ref<number>(0)

const planTotalPersonal = computed(() => refPlanTotalPersonal.value)

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
  motivoSinEfecto: '',
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

const motivoSinEfectoOptions = [
  { value: 'Por falta de personal', label: 'Por falta de personal' },
  { value: 'Por orden de superior', label: 'Por orden de superior' },
  { value: 'Por cubrir otro Operativo', label: 'Por cubrir otro Operativo' },
  { value: 'Por cubrir Espectáculo público', label: 'Por cubrir Espectáculo público' },
  { value: 'Por inclemencias de tiempo', label: 'Por inclemencias de tiempo' },
  { value: 'Otro motivo', label: 'Otro motivo' }
]

const mensajeInformativo = computed(() => {
  return formData.value.tipoDespliegue === 'Franco'
    ? 'Personal en franco. No se requiere registro de recursos.'
    : 'Operativo sin efecto. No se requiere registro de recursos.'
})

const formatearFechaHora = (fecha: Date | null) => {
  if (!fecha) return '-'
  return new Date(fecha).toLocaleString('es-UY', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Limpiar motivo si se cambia a otro tipo que no sea "Sin efecto"
watch(() => formData.value.tipoDespliegue, (newValue) => {
  if (newValue !== 'Sin efecto') {
    formData.value.motivoSinEfecto = ''
  }
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
    esEditable.value = true
    reporteExistenteId.value = null
    refPlanTotalPersonal.value = 0

    if (typeof props.diaDespliegueId === 'string' && props.diaDespliegueId.includes('-')) {
      const parts = props.diaDespliegueId.split('-')
      ordenId = parseInt(parts[0])
      fechaUnix = parseInt(parts[1])
    } else {
      const reporte = await db.reportes_despliegue.get(Number(props.diaDespliegueId))
      if (reporte) {
        ordenId = reporte.ordenId
        fechaUnix = new Date(reporte.fechaDespliegue).getTime()
        reporteExistenteId.value = reporte.id || null
        reporteFechaHoraCarga.value = reporte.fechaHoraCarga || null
        refPlanTotalPersonal.value = reporte.refPlanTotalPersonal || 0
        
        // AI-Hint: Lógica de seguridad según plan ARCH-20260107
        const usuarioActualId = 1 // TODO: Obtener de sistema de autenticación real
        const usuarioTieneRolEspecial = (id: number) => false // TODO: Implementar check de roles
        
        const esDuenio = reporte.usuarioReportaId === usuarioActualId
        const esAdmin = usuarioTieneRolEspecial(usuarioActualId)
        const estaEnPeriodoGracia = desplieguesService.puedeEditarReporte(reporte)

        // ✅ FIX ARCH-20260107-012: Reportes históricos (fechaDespliegue < hoy) SIEMPRE en modo solo lectura
        const hoy = new Date()
        hoy.setHours(0, 0, 0, 0)
        const fechaDespliegue = new Date(reporte.fechaDespliegue)
        fechaDespliegue.setHours(0, 0, 0, 0)
        const esHistorico = fechaDespliegue.getTime() < hoy.getTime()

        esEditable.value = (esDuenio || esAdmin) && estaEnPeriodoGracia && !esHistorico
        
        formData.value = {
          tipoDespliegue: reporte.tipoDespliegue || 'Despliegue',
          motivoSinEfecto: reporte.motivoSinEfecto || '',
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
      
      // Si es un reporte nuevo, tomamos el plan de la orden actual
      if (!reporteExistenteId.value) {
        refPlanTotalPersonal.value = orden.planTotalPersonal || 0
      }

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
    motivoSinEfecto: '',
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
  if (!esEditable.value) {
    emit('update:modelValue', false)
    return
  }
  
  if (formData.value.tipoDespliegue === 'Sin efecto' && !formData.value.motivoSinEfecto) {
    toast.error('Debe seleccionar un motivo para "Sin efecto"')
    return
  }
  
  showConfirmacionModal.value = true
}

async function handleConfirmarReporte() {
  showConfirmacionModal.value = false
  
  try {
    let ordenId: number
    let fechaDespliegue: Date

    if (typeof props.diaDespliegueId === 'string' && props.diaDespliegueId.includes('-')) {
      const parts = props.diaDespliegueId.split('-')
      ordenId = parseInt(parts[0])
      fechaDespliegue = new Date(parseInt(parts[1]))
    } else {
      const reporte = await db.reportes_despliegue.get(Number(props.diaDespliegueId))
      if (!reporte) throw new Error('Reporte no encontrado')
      ordenId = reporte.ordenId
      fechaDespliegue = reporte.fechaDespliegue
    }

    const orden = await db.ordenes_operativas.get(ordenId)
    if (!orden) throw new Error('Orden no encontrada')

    const data = {
      ordenId,
      unidadReportanteId: orden.unidadSolicitadaId,
      fechaDespliegue,
      usuarioReportaId: 1, // AI-Hint: Usar ID de usuario logueado en producción
      ...formData.value,
      realTotalPersonal: totalEfectivosCalculado.value,
      estadoReal: 'Completo' as const // Simplificación inicial
    }

    if (reporteExistenteId.value) {
      await desplieguesService.update(reporteExistenteId.value, data)
      toast.success('Reporte actualizado exitosamente')
    } else {
      await desplieguesService.create(data)
      toast.success('Reporte creado exitosamente')
    }

    emit('success')
  } catch (error) {
    console.error('Error al guardar reporte:', error)
    toast.error('Error al guardar el reporte')
  }
}
</script>

<style scoped>
/* Banner Informativo */
.info-banner {
  background-color: var(--color-warning-light);
  border: 2px solid var(--color-warning);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  margin-bottom: var(--space-4);
}

/* Inputs de Cantidad - Ancho Limitado */
.input-cantidad {
  max-width: 5rem; /* Suficiente para 2 dígitos + padding + icono */
}

/* Eliminar padding izquierdo del contenedor de ícono */
.input-cantidad :deep(.input-icon) {
  padding-left: 0;
}

/* ✅ ÉNFASIS SUTIL PARA CAMPO CALCULADO (v14 - ARCH-20260107-011) */
.input-total-efectivos :deep(.input-container) {
  border-color: var(--color-primary);
  background-color: var(--color-gray-100);
}

.input-total-efectivos :deep(.input-field) {
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}
</style>
