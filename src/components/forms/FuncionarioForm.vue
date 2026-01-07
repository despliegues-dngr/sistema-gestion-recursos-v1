<template>
  <form @submit.prevent="handleSubmit" class="funcionario-form">
    <!-- CI (requerido, único) -->
    <Input
      v-model="formData.ci"
      label="Cédula de Identidad"
      placeholder="1234567-8"
      required
      :error="errors.ci"
      @blur="validateCI"
    />
    
    <!-- Nombre Completo (requerido) -->
    <Input
      v-model="formData.nombre_completo"
      label="Nombre Completo"
      placeholder="Juan Pérez González"
      required
      :error="errors.nombre_completo"
    />
    
    <!-- Grado (requerido) -->
    <Select
      v-model="formData.gradoId"
      label="Grado"
      :options="gradoOptions"
      placeholder="Seleccionar grado"
      required
      :error="errors.gradoId"
    />
    
    <!-- Unidad (requerido) -->
    <Select
      v-model="formData.unidadId"
      label="Unidad"
      :options="unidadOptions"
      placeholder="Seleccionar unidad"
      required
      :error="errors.unidadId"
    />
    
    <!-- Sub-Unidad (opcional) -->
    <Select
      v-model="formData.subUnidadId"
      label="Sub-Unidad"
      :options="subUnidadOptions"
      placeholder="A designar"
    />
    
    <!-- Turno (opcional) -->
    <Select
      v-model="formData.turnoId"
      label="Turno"
      :options="turnoOptions"
      placeholder="Sin turno asignado"
    />
    
    <!-- Régimen (opcional) -->
    <Select
      v-model="formData.regimenId"
      label="Régimen"
      :options="regimenOptions"
      placeholder="Sin régimen asignado"
    />
    
    <!-- Escalafón (opcional) -->
    <Select
      v-model="formData.escalafonId"
      label="Escalafón"
      :options="escalafonOptions"
      placeholder="Sin escalafón"
    />
    
    <!-- Fecha de Ingreso (requerido) -->
    <Input
      v-model="formData.fechaIngreso"
      label="Fecha de Ingreso"
      type="date"
      required
      :error="errors.fechaIngreso"
    />
    
    <!-- Tarea Asignada (opcional) -->
    <Input
      v-model="formData.tarea"
      label="Tarea Asignada"
      placeholder="Ej: Administrativo"
    />
    
    <!-- Hora Ingreso (opcional) -->
    <Input
      v-model="formData.horaIngreso"
      label="Hora Ingreso"
      type="time"
    />
    
    <!-- Hora Salida (opcional) -->
    <Input
      v-model="formData.horaSalida"
      label="Hora Salida"
      type="time"
    />
    
    <!-- Realiza Art. 222 (opcional) -->
    <Select
      v-model="formData.realiza222"
      label="Realiza Art. 222"
      :options="[
        { value: '', label: 'Sin especificar' },
        { value: true, label: 'Sí' },
        { value: false, label: 'No' }
      ]"
    />
    
    <!-- Botones -->
    <FormActions bordered>
      <Button type="button" variant="secondary" @click="$emit('cancel')">
        Cancelar
      </Button>
      <Button type="submit" variant="primary" :loading="loading">
        {{ isEdit ? 'Actualizar' : 'Crear' }} Funcionario
      </Button>
    </FormActions>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Input, Select, Button, FormActions } from '@components'
import { personalService } from '@services'
import type { Funcionario } from '@lib/types'
import './FuncionarioForm.css'

interface Props {
  initialData?: Partial<Funcionario>
  isEdit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isEdit: false
})

const emit = defineEmits<{
  submit: [data: Omit<Funcionario, 'id' | 'createdAt' | 'updatedAt'>]
  cancel: []
}>()

const loading = ref(false)
const errors = ref<Record<string, string>>({})

// Opciones de selects
const turnos = ref<any[]>([])
const regimenes = ref<any[]>([])
const grados = ref<any[]>([])
const unidades = ref<any[]>([])
const subUnidades = ref<any[]>([])
const escalafones = ref<any[]>([])

// Form data
const formData = ref({
  ci: '',
  nombre_completo: '',
  gradoId: null as string | number | null,
  unidadId: null as string | number | null,
  subUnidadId: null as string | number | null,
  turnoId: null as string | number | null,
  regimenId: null as string | number | null,
  escalafonId: null as string | number | null,
  fechaIngreso: '',
  // AI-Hint: Campos laborales agregados en version(4)
  tarea: '' as string,
  horaIngreso: '' as string,
  horaSalida: '' as string,
  realiza222: null as boolean | string | null
})

// Computed options para selects
const turnoOptions = computed(() => [
  { value: '', label: 'Sin turno asignado' },
  ...turnos.value.map(t => ({ value: t.id, label: t.nombre }))
])

const regimenOptions = computed(() => [
  { value: '', label: 'Sin régimen asignado' },
  ...regimenes.value.map(r => ({ value: r.id, label: r.nombre }))
])

const gradoOptions = computed(() => 
  grados.value.map(g => ({ value: g.id, label: g.nombre }))
)

const unidadOptions = computed(() => 
  unidades.value.map(u => ({ value: u.id, label: u.nombre }))
)

// AI-Hint: Filtrar subUnidades por unidad seleccionada | Solo muestra subUnidades de la unidad seleccionada | Evita selecciones inválidas
const subUnidadOptions = computed(() => {
  const unidadId = formData.value.unidadId
  if (!unidadId || unidadId === '') return [{ value: '', label: 'A designar' }]
  
  const filtradas = subUnidades.value.filter(su => su.unidadId === Number(unidadId))
  return [
    { value: '', label: 'A designar' },
    ...filtradas.map(su => ({ value: su.id, label: su.nombre }))
  ]
})

const escalafonOptions = computed(() => [
  { value: '', label: 'Sin escalafón' },
  ...escalafones.value.map(e => ({ value: e.id, label: e.nombre }))
])

// Cargar datos del formulario
async function loadFormData() {
  try {
    const data = await personalService.getFormData()
    turnos.value = data.turnos
    regimenes.value = data.regimenes
    grados.value = data.grados
    unidades.value = data.unidades
    subUnidades.value = data.subUnidades
    escalafones.value = data.escalafones
  } catch (error) {
    // Error silencioso
  }
}

// Validar CI (async para verificar unicidad)
async function validateCI() {
  if (!formData.value.ci) {
    errors.value.ci = 'La cédula de identidad es requerida'
    return false
  }

  // Validar formato básico (puede tener guión)
  const ciRegex = /^\d{6,8}-?\d$/
  if (!ciRegex.test(formData.value.ci)) {
    errors.value.ci = 'Formato de CI inválido (ej: 1234567-8)'
    return false
  }

  // Validar unicidad solo si es creación o si cambió el CI
  if (!props.isEdit || (props.initialData?.ci !== formData.value.ci)) {
    const existente = await personalService.getByCedula(formData.value.ci)
    if (existente) {
      errors.value.ci = 'Esta cédula de identidad ya está registrada'
      return false
    }
  }

  delete errors.value.ci
  return true
}

// Validar formulario completo
function validateForm(): boolean {
  errors.value = {}

  // CI
  if (!formData.value.ci) {
    errors.value.ci = 'La cédula de identidad es requerida'
  }

  // Nombre completo
  if (!formData.value.nombre_completo) {
    errors.value.nombre_completo = 'El nombre completo es requerido'
  } else if (formData.value.nombre_completo.length < 3) {
    errors.value.nombre_completo = 'El nombre debe tener al menos 3 caracteres'
  }

  // Grado
  if (!formData.value.gradoId || formData.value.gradoId === '') {
    errors.value.gradoId = 'El grado es requerido'
  }

  // Unidad
  if (!formData.value.unidadId || formData.value.unidadId === '') {
    errors.value.unidadId = 'La unidad es requerida'
  }

  // Fecha ingreso
  if (!formData.value.fechaIngreso) {
    errors.value.fechaIngreso = 'La fecha de ingreso es requerida'
  } else {
    const fecha = new Date(formData.value.fechaIngreso)
    const hoy = new Date()
    hoy.setHours(23, 59, 59, 999)
    if (fecha > hoy) {
      errors.value.fechaIngreso = 'La fecha de ingreso no puede ser futura'
    }
  }

  return Object.keys(errors.value).length === 0
}

// Manejar submit
async function handleSubmit() {
  // Validar CI async primero
  const ciValid = await validateCI()
  if (!ciValid) {
    return
  }

  // Validar resto del formulario
  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    // Convertir datos para enviar
    // AI-Hint: Convertir valores vacíos a undefined | Los selects opcionales retornan '' cuando no hay selección | Necesario para campos opcionales
    const data: Omit<Funcionario, 'id' | 'createdAt' | 'updatedAt'> = {
      ci: formData.value.ci,
      nombre_completo: formData.value.nombre_completo,
      gradoId: Number(formData.value.gradoId!),
      unidadId: Number(formData.value.unidadId!),
      subUnidadId: (formData.value.subUnidadId && formData.value.subUnidadId !== '') ? Number(formData.value.subUnidadId) : undefined,
      turnoId: (formData.value.turnoId && formData.value.turnoId !== '') ? Number(formData.value.turnoId) : undefined,
      regimenId: (formData.value.regimenId && formData.value.regimenId !== '') ? Number(formData.value.regimenId) : undefined,
      escalafonId: (formData.value.escalafonId && formData.value.escalafonId !== '') ? Number(formData.value.escalafonId) : undefined,
      fechaIngreso: new Date(formData.value.fechaIngreso),
      // AI-Hint: Campos laborales agregados en version(4)
      tarea: formData.value.tarea || undefined,
      horaIngreso: formData.value.horaIngreso || undefined,
      horaSalida: formData.value.horaSalida || undefined,
      realiza222: (formData.value.realiza222 !== '' && formData.value.realiza222 !== null) 
        ? (formData.value.realiza222 === true || formData.value.realiza222 === 'true') 
        : undefined
    }

    emit('submit', data)
  } catch (error) {
    // Error silencioso
  } finally {
    loading.value = false
  }
}

// Inicializar con datos si es edición
watch(() => props.initialData, (data) => {
  if (data) {
    formData.value = {
      ci: data.ci || '',
      nombre_completo: data.nombre_completo || '',
      gradoId: data.gradoId || null,
      unidadId: data.unidadId || null,
      subUnidadId: data.subUnidadId || null,
      turnoId: data.turnoId || null,
      regimenId: data.regimenId || null,
      escalafonId: data.escalafonId || null,
      fechaIngreso: data.fechaIngreso 
        ? new Date(data.fechaIngreso).toISOString().split('T')[0]
        : '',
      // AI-Hint: Campos laborales agregados en version(4)
      tarea: data.tarea || '',
      horaIngreso: data.horaIngreso || '',
      horaSalida: data.horaSalida || '',
      realiza222: data.realiza222 !== undefined ? data.realiza222 : null
    }
  } else {
    // Resetear formulario para modo creación
    formData.value = {
      ci: '',
      nombre_completo: '',
      gradoId: null,
      unidadId: null,
      subUnidadId: null,
      turnoId: null,
      regimenId: null,
      escalafonId: null,
      fechaIngreso: '',
      tarea: '',
      horaIngreso: '',
      horaSalida: '',
      realiza222: null
    }
  }
}, { immediate: true })

onMounted(() => {
  loadFormData()
})
</script>

