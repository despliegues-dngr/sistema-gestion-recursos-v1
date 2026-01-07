<template>
  <div class="transferir-form">
    <div class="transferir-info">
      <p class="transferir-texto">
        <strong>Funcionario:</strong> {{ funcionario?.nombre_completo }}
      </p>
      <p class="transferir-texto">
        <strong>Unidad actual:</strong> {{ funcionario?.unidad?.nombre || '-' }}
      </p>
    </div>
    
    <Select
      v-model="unidadDestinoId"
      label="Nueva Unidad"
      :options="unidadOptions"
      placeholder="Seleccionar unidad destino"
      required
      :error="errors.unidadDestinoId"
    />
    
    <Select
      v-model="motivo"
      label="Motivo del pase"
      :options="motivoOptions"
      placeholder="Seleccionar motivo"
      :error="errors.motivo"
    />
    
    <FormActions>
      <Button variant="secondary" @click="$emit('cancel')">Cancelar</Button>
      <Button variant="primary" @click="handleTransfer" :loading="loading">
        Confirmar Transferencia
      </Button>
    </FormActions>
  </div>
</template>

<script setup lang="ts">
import './TransferirModal.css'
import { ref, computed, onMounted } from 'vue'
import { Select, Input, Button, FormActions } from '@components'
import { personalService } from '@services'
import type { FuncionarioConRelaciones } from '@services/personalService'

interface Props {
  funcionario: FuncionarioConRelaciones | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  cancel: []
  success: []
}>()

const loading = ref(false)
const unidadDestinoId = ref<string | number | null>(null)
const motivo = ref<string | number | null>(null)
const errors = ref<Record<string, string>>({})
const unidades = ref<any[]>([])

// AI-Hint: Opciones estandarizadas de motivo de traslado | Estandariza datos para reportes y análisis | Contexto policial/gubernamental
const motivoOptions = [
  { value: 'Por solicitud del funcionario', label: 'Por solicitud del funcionario' },
  { value: 'Por orden del Superior', label: 'Por orden del Superior' },
  { value: 'Pase administrativo', label: 'Pase administrativo' },
  { value: 'Otro motivo', label: 'Otro motivo' }
]

const unidadOptions = computed(() => 
  unidades.value
    .filter(u => u.id !== props.funcionario?.unidadId)
    .map(u => ({ value: u.id, label: u.nombre }))
)

async function loadUnidades() {
  try {
    const formData = await personalService.getFormData()
    unidades.value = formData.unidades
  } catch (error) {
    // Error silencioso
  }
}

function validateForm(): boolean {
  errors.value = {}
  
  if (!unidadDestinoId.value || unidadDestinoId.value === '') {
    errors.value.unidadDestinoId = 'La unidad destino es requerida'
  }
  
  return Object.keys(errors.value).length === 0
}

async function handleTransfer() {
  if (!validateForm()) {
    return
  }
  
  if (!props.funcionario?.id) {
    return
  }
  
  loading.value = true
  
  try {
    await personalService.transferirUnidad(
      props.funcionario.id,
      Number(unidadDestinoId.value),
      motivo.value ? String(motivo.value) : undefined
    )
    
    emit('success')
  } catch (error) {
    if (error instanceof Error) {
      errors.value.unidadDestinoId = error.message
    } else {
      errors.value.unidadDestinoId = 'Error al transferir funcionario'
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadUnidades()
})
</script>

