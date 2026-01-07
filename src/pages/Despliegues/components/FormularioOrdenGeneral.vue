<template>
  <div class="formulario-secciones">
    <InlineForm>
      <FichaFormulario :columns="2">
        <!-- FILA 1: Departamento | Unidad -->
        <div class="ficha-dato">
          <span class="ficha-dato-label">Departamento</span>
          <MultiSelect
            v-model="formData.departamento"
            :options="departamentoOptions"
            size="sm"
            placeholder="Seleccione departamentos"
          />
        </div>
        
        <div class="ficha-dato">
          <span class="ficha-dato-label ficha-dato-label--required">Unidad</span>
          <Select
            v-model="formData.unidadSolicitadaId"
            :options="unidadOptions"
            :error="errors.unidadSolicitadaId"
            size="sm"
            placeholder="Seleccione unidad"
          />
        </div>
        
        <!-- FILA 2: Tipo Servicio | Tiempo Servicio -->
        <div class="ficha-dato">
          <span class="ficha-dato-label">Tipo de Servicio</span>
          <Select
            v-model="formData.tipoServicio"
            :options="tipoServicioOptions"
            size="sm"
            placeholder="Seleccione tipo"
          />
        </div>
        
        <div class="ficha-dato">
          <span class="ficha-dato-label">Tiempo de Servicio</span>
          <Select
            v-model="formData.tiempoServicio"
            :options="tiempoServicioOptions"
            size="sm"
            placeholder="Seleccione tiempo"
          />
        </div>
        
        <!-- FILA 3: Tipo Documento | Nro Documento -->
        <div class="ficha-dato">
          <span class="ficha-dato-label ficha-dato-label--required">Tipo de Documento</span>
          <Select
            v-model="formData.tipoDocumento"
            :options="tipoDocumentoOptions"
            :error="errors.tipoDocumento"
            size="sm"
          />
        </div>
        
        <div class="ficha-dato">
          <span class="ficha-dato-label ficha-dato-label--required">Nro. Documento</span>
          <Input
            v-model="formData.nroDocumento"
            placeholder="Ej: 123/2025"
            :error="errors.nroDocumento"
            size="sm"
          />
        </div>
        
        <!-- FILA 4: Nombre Documento (2 columnas) -->
        <div class="ficha-dato ficha-dato--full">
          <span class="ficha-dato-label">Nombre del Documento</span>
          <Input
            v-model="formData.nombreDocumento"
            placeholder="Nombre descriptivo del documento"
            size="sm"
          />
        </div>
        
        <!-- FILA 5: Nombre Servicio (2 columnas) -->
        <div class="ficha-dato ficha-dato--full">
          <span class="ficha-dato-label">Nombre del Servicio</span>
          <Input
            v-model="formData.nombreServicio"
            placeholder="Nombre completo del servicio"
            size="sm"
          />
        </div>
        
        <!-- FILA 6: Seccional (2 columnas) -->
        <div class="ficha-dato ficha-dato--full">
          <span class="ficha-dato-label">Seccional</span>
          <MultiSelect
            v-model="formData.seccional"
            :options="seccionalOptions"
            size="sm"
            placeholder="Seleccione seccionales"
          />
        </div>
        
        <!-- FILA 7: Fecha Inicio | Fecha Fin -->
        <div class="ficha-dato">
          <span class="ficha-dato-label ficha-dato-label--required">Fecha Inicio</span>
          <Input
            v-model="formData.fechaInicio"
            type="date"
            :error="errors.fechaInicio"
            size="sm"
          />
        </div>
        
        <div class="ficha-dato">
          <span class="ficha-dato-label ficha-dato-label--required">Fecha Fin</span>
          <Input
            v-model="formData.fechaFin"
            type="date"
            :error="errors.fechaFin"
            size="sm"
          />
        </div>
        
        <!-- FILA 8: Hora Inicio | Hora Fin -->
        <div class="ficha-dato">
          <span class="ficha-dato-label ficha-dato-label--required">Hora Inicio</span>
          <Input
            v-model="formData.horaInicio"
            type="time"
            :error="errors.horaInicio"
            size="sm"
          />
        </div>
        
        <div class="ficha-dato">
          <span class="ficha-dato-label ficha-dato-label--required">Hora Fin</span>
          <Input
            v-model="formData.horaFin"
            type="time"
            :error="errors.horaFin"
            size="sm"
          />
        </div>
      </FichaFormulario>
    </InlineForm>
  </div>
</template>

<script setup lang="ts">
import { Input, Select, MultiSelect, FichaFormulario, InlineForm } from '@components'
import { useFormularioOrden } from './useFormularioOrden'

interface Props {
  mode?: 'create' | 'edit'
  ordenId?: number
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'create'
})

const emit = defineEmits<{
  success: []
}>()

const {
  formData,
  errors,
  isSaving,
  tipoDocumentoOptions,
  tipoServicioOptions,
  tiempoServicioOptions,
  departamentoOptions,
  seccionalOptions,
  unidadOptions,
  handleSubmit: submitForm
} = useFormularioOrden(props)

async function handleSubmit() {
  const success = await submitForm()
  if (success) {
    emit('success')
  }
}

defineExpose({
  handleSubmit,
  isSaving
})
</script>

