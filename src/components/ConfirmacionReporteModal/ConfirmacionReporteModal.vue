<template>
  <Modal
    :model-value="visible"
    title="Confirmar Envío de Reporte"
    @update:model-value="$emit('cancel')"
  >
    <div class="confirmacion-reporte">
      <p class="confirmacion-text">
        Se informará que el Servicio <strong>"{{ ordenNombre }}"</strong> 
        del día <strong>{{ fechaFormateada }}</strong>
        en el horario de <strong>{{ horaInicio }}</strong> a <strong>{{ horaFin }}</strong> 
        se ha desplegado con los siguientes recursos:
      </p>
      
      <p class="recursos-texto">
        {{ textoRecursos }}
      </p>
      
      <p class="total-texto">
        Sumando un total de <strong>{{ recursos.realTotalPersonal }}</strong> efectivos.
      </p>

      <div class="cumplimiento-section">
        <ProgressBar
          :current="recursos.realTotalPersonal"
          :total="planTotalPersonal"
          label="efectivos"
          :show-percentage="true"
          :show-values="true"
        />
      </div>

      <div class="confirmacion-actions">
        <Button variant="secondary" @click="$emit('cancel')">
          Cancelar
        </Button>
        <Button variant="primary" @click="$emit('confirm')">
          Confirmar y Guardar
        </Button>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Modal, Button, ProgressBar } from '@components'
import type { RecursosReporte } from '@lib/types'
import './ConfirmacionReporteModal.css'

interface Props {
  visible: boolean
  ordenNombre: string
  horaInicio: string
  horaFin: string
  fechaDespliegue: Date | string
  recursos: RecursosReporte
  planTotalPersonal: number
}

const props = defineProps<Props>()

defineEmits<{
  'confirm': []
  'cancel': []
}>()

const fechaFormateada = computed(() => {
  if (typeof props.fechaDespliegue === 'string') return props.fechaDespliegue
  return props.fechaDespliegue.toLocaleDateString('es-UY', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
})

const textoRecursos = computed(() => {
  return generarTextoRecursos(props.recursos)
})

function generarTextoRecursos(recursos: RecursosReporte): string {
  const items: string[] = []
  
  const mapeo: Record<string, string> = {
    realMoviles: 'móvil',
    realMotos: 'moto',
    realSsoo: 'SSOO',
    realPpssMovil: 'PPSS Móvil',
    realPieTierra: 'Pie a Tierra',
    realMotosBiTripuladas: 'Moto BiTripulada',
    realHipos: 'Hipo',
    realChoqueApost: 'Choque Apostado',
    realChoqueAlerta: 'Choque en Alerta',
    realHidro: 'Hidro'
  }
  
  for (const [key, label] of Object.entries(mapeo)) {
    const valor = recursos[key as keyof RecursosReporte]
    if (valor > 0) {
      const plural = valor === 1 ? label : pluralizar(label)
      items.push(`${valor} ${plural}`)
    }
  }
  
  // ✅ NUEVO: Fallback cuando no hay recursos
  if (items.length === 0) {
    return 'sin recursos desplegados'
  }
  
  return items.join(', ')
}

function pluralizar(palabra: string): string {
  // Reglas simples de pluralización en español según el plan
  if (palabra === 'SSOO') return 'SSOO'
  if (palabra === 'PPSS Móvil') return 'PPSS Móviles'
  if (palabra === 'Choque en Alerta') return 'Choques en Alerta'
  
  if (palabra.endsWith('l')) return palabra + 'es'
  if (palabra.endsWith('o')) return palabra.slice(0, -1) + 'os'
  if (palabra.endsWith('a')) return palabra.slice(0, -1) + 'as'
  return palabra + 's'
}
</script>

