<template>
  <div class="reporte-documento">
    <!-- Texto Narrativo -->
    <div class="reporte-narrativo">
      <p v-html="mensajeNarrativo"></p>
    </div>

    <!-- Tabla Compacta de Recursos (solo si tipo === 'Despliegue') -->
    <div v-if="tipo === 'Despliegue'" class="reporte-recursos-container">
      <table class="reporte-tabla-compacta">
        <thead>
          <tr>
            <th>Recurso</th>
            <th class="text-right">Cantidad</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="recurso in recursosActivos" :key="recurso.label">
            <td>{{ recurso.label }}</td>
            <td class="text-right">{{ recurso.valor }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="reporte-tabla-total">
            <td>TOTAL EFECTIVOS</td>
            <td class="text-right">{{ recursos.totalEfectivos }}</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- Sección: Cumplimiento (solo si tipo === 'Despliegue' y hay plan) -->
    <div v-if="tipo === 'Despliegue' && planTotalPersonal > 0" class="reporte-cumplimiento">
      <ProgressBar
        :current="recursos.totalEfectivos"
        :total="planTotalPersonal"
        label="efectivos planificados"
        :show-percentage="true"
        :show-values="true"
      />
    </div>

    <!-- Footer: Metadatos -->
    <div class="reporte-footer">
      <div class="reporte-metadatos">
        <span><strong>Cargado:</strong> {{ fechaCarga }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import './ReporteDocumento.css'
import { ProgressBar } from '@components'

interface Recursos {
  moviles: number
  motos: number
  motosBiTri: number
  hidro: number
  hipos: number
  ssoo: number
  ppssMovil: number
  pieTierra: number
  choqueApost: number
  choqueAlerta: number
  totalEfectivos: number
}

interface Props {
  orden: string
  operativo: string
  unidad: string
  fecha: string
  horario: string
  tipo: 'Despliegue' | 'Franco' | 'Sin efecto'
  motivo?: string
  recursos: Recursos
  planTotalPersonal: number
  fechaCarga: string
}

const props = defineProps<Props>()

const mensajeNarrativo = computed(() => {
  const base = `Se informa que el Servicio <strong>"${props.operativo}"</strong> del día <strong>${props.fecha}</strong> en el horario de <strong>${props.horario}</strong>`
  
  if (props.tipo === 'Sin efecto') {
    return `${base} ha quedado <strong>sin efecto</strong>, motivo: <strong>${props.motivo || 'no especificado'}</strong>.`
  }
  
  if (props.tipo === 'Franco') {
    return `${base} efectuó el día <strong>franco</strong>.`
  }
  
  return `${base} se ha desplegado con los siguientes recursos:`
})

const recursosActivos = computed(() => {
  const mapeo: Record<string, string> = {
    moviles: 'Móviles',
    motos: 'Motos',
    motosBiTri: 'Motos Bi/Tripuladas',
    hidro: 'Hidrantes',
    hipos: 'Hipos',
    ssoo: 'SSOO',
    ppssMovil: 'P.P.S.S. en Móvil',
    pieTierra: 'Pie a Tierra',
    choqueApost: 'Choque Apostado',
    choqueAlerta: 'Choque en Alerta'
  }

  return Object.entries(mapeo)
    .map(([key, label]) => ({
      label,
      valor: props.recursos[key as keyof Omit<Recursos, 'totalEfectivos'>]
    }))
    .filter(r => r.valor > 0)
})
</script>
