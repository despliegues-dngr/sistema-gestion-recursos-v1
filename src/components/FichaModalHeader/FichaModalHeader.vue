<template>
  <div class="ficha-modal-header">
    <div class="ficha-modal-info">
      <div class="ficha-avatar">
        <User :size="24" />
      </div>
      <div class="ficha-modal-content">
        <span v-if="displayData?.grado?.nombre" class="ficha-modal-grado-label">
          {{ displayData.grado.nombre.toUpperCase() }}
        </span>
        <h2 class="ficha-modal-title">
          {{ displayData?.nombre_completo || (mode === 'create' ? 'Nuevo Funcionario' : 'Ficha del Funcionario') }}
        </h2>
        <div class="ficha-modal-meta">
          <span class="ficha-modal-unidad" v-if="displayData?.unidad?.nombre">
            {{ displayData.unidad.nombre }}
          </span>
          <span v-else-if="mode === 'create'" class="ficha-modal-unidad">
            Personal - Gestión de Recursos
          </span>
        </div>
      </div>
    </div>
    <Button 
      v-if="funcionario && mode !== 'create'" 
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
import './FichaModalHeader.css'
import { computed } from 'vue'
import { User, Pencil } from 'lucide-vue-next'
import { Button } from '@components'
import type { FuncionarioConRelaciones } from '@services/personalService'

interface Props {
  funcionario?: FuncionarioConRelaciones | null
  tempData?: {
    nombre_completo?: string
    grado?: { nombre: string }
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

// AI-Hint: Priorizar tempData sobre funcionario para actualización en tiempo real durante creación
const displayData = computed(() => props.tempData || props.funcionario)
</script>

