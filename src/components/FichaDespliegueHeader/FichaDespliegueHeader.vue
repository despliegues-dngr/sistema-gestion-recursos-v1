<template>
  <div class="ficha-modal-header">
    <div class="ficha-modal-info">
      <div class="ficha-avatar">
        <Target :size="24" />
      </div>
      <div class="ficha-modal-content">
        <span v-if="displayData?.orden?.tipoServicio" class="ficha-modal-grado-label">
          {{ displayData.orden.tipoServicio.toUpperCase() }}
        </span>
        <h2 class="ficha-modal-title">
          {{ displayTitle }}
        </h2>
        <div class="ficha-modal-meta" v-if="displayData">
          <!-- Tipo de Documento + Nro. Documento -->
          <span v-if="displayData.orden?.tipoDocumento || displayData.orden?.nroDocumento" class="ficha-modal-documento">
            <template v-if="displayData.orden?.tipoDocumento">
              {{ displayData.orden.tipoDocumento }}
            </template>
            <template v-if="displayData.orden?.nroDocumento">
              {{ displayData.orden?.tipoDocumento ? ' - ' : '' }}Nro. {{ displayData.orden.nroDocumento }}
            </template>
          </span>
          
          <!-- Separador si hay documento y unidad -->
          <span v-if="(displayData.orden?.tipoDocumento || displayData.orden?.nroDocumento) && displayData.unidad?.nombre" class="ficha-modal-separator">
            •
          </span>

          <span class="ficha-modal-unidad" v-if="displayData.unidad?.nombre">
            {{ displayData.unidad.nombre }}
          </span>
        </div>
      </div>
    </div>
    <!-- Botón de edición -->
    <Button 
      v-if="reporte && mode !== 'create'" 
      variant="ghost" 
      size="sm" 
      @click="$emit('edit')"
      class="ficha-modal-edit-btn"
    >
      <Pencil :size="16" />
    </Button>
  </div>
</template>

<script setup lang="ts">
import './FichaDespliegueHeader.css'
import { computed } from 'vue'
import { Target, Pencil } from 'lucide-vue-next'
import { Button } from '@components'
import type { ReporteDespliegueConRelaciones } from '@services/desplieguesService'

interface Props {
  reporte?: ReporteDespliegueConRelaciones | null
  tempData?: {
    orden?: {
      nombreDocumento?: string
      nombreServicio?: string
      tipoServicio?: string
      nroDocumento?: string
      tipoDocumento?: string
    }
    unidad?: { nombre: string }
  }
  mode?: 'view' | 'create'
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'view'
})

defineEmits<{
  edit: []
}>()

const displayData = computed(() => props.tempData || props.reporte)

const displayTitle = computed(() => {
  if (props.mode === 'create') {
    return displayData.value?.orden?.nombreDocumento || 
           displayData.value?.orden?.nombreServicio || 
           'Nuevo Despliegue'
  }
  
  if (!displayData.value?.orden) return 'Detalle del Despliegue'
  
  const nombreDoc = displayData.value.orden.nombreDocumento
  const nombreOp = displayData.value.orden.nombreServicio
  const nroDoc = displayData.value.orden.nroDocumento
  
  return nombreDoc || nombreOp || (nroDoc ? `Orden ${nroDoc}` : '') || 'Detalle del Despliegue'
})
</script>
