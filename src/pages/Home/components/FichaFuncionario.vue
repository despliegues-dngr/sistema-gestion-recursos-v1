<template>
  <div class="ficha-funcionario">
    <!-- Tabs para organizar información -->
    <Tabs v-model="activeTab" :tabs="tabs">
      <template #datos>
        <div class="ficha-secciones">
          <!-- Sección Única: Datos del Funcionario -->
          <InlineForm>
            <FichaFormulario :columns="2">
              <div class="ficha-dato">
                <span class="ficha-dato-label">Documento</span>
                <span v-if="!isEditing" class="ficha-dato-valor">{{ funcionario?.ci }}</span>
                <Input
                  v-else
                  v-model="editData.ci"
                  placeholder="Ej: 12345678"
                  size="sm"
                  :error="errors.ci"
                />
              </div>
              <div class="ficha-dato">
                <span class="ficha-dato-label">Nombre Completo</span>
                <span v-if="!isEditing" class="ficha-dato-valor">{{ funcionario?.nombre_completo }}</span>
                <Input
                  v-else
                  v-model="editData.nombre_completo"
                  placeholder="Nombre y Apellido"
                  size="sm"
                  :error="errors.nombre_completo"
                />
              </div>

              <div class="ficha-dato">
                <span class="ficha-dato-label">Grado</span>
                <span v-if="!isEditing" class="ficha-dato-valor">{{ funcionario?.grado?.nombre || '-' }}</span>
                <Select
                  v-else
                  v-model="editData.gradoId"
                  :options="gradoOptions"
                  size="sm"
                  :error="errors.gradoId"
                />
              </div>
              <div class="ficha-dato">
                <span class="ficha-dato-label">Unidad</span>
                <span v-if="!isEditing || mode !== 'create'" class="ficha-dato-valor">{{ funcionario?.unidad?.nombre || '-' }}</span>
                <Select
                  v-else
                  v-model="editData.unidadId"
                  :options="unidadOptions"
                  size="sm"
                  :error="errors.unidadId"
                />
              </div>
              <div class="ficha-dato">
                <span class="ficha-dato-label">Sub-Unidad</span>
                <span v-if="!isEditing" class="ficha-dato-valor">{{ funcionario?.subUnidad?.nombre || '-' }}</span>
                <Select
                  v-else
                  v-model="editData.subUnidadId"
                  :options="subUnidadOptions"
                  size="sm"
                />
              </div>
              <div class="ficha-dato">
                <span class="ficha-dato-label">Escalafón</span>
                <span v-if="!isEditing" class="ficha-dato-valor">{{ funcionario?.escalafon?.nombre || '-' }}</span>
                <Select
                  v-else
                  v-model="editData.escalafonId"
                  :options="escalafonOptions"
                  size="sm"
                />
              </div>

              <div class="ficha-dato">
                <span class="ficha-dato-label">Tarea Asignada</span>
                <span v-if="!isEditing" class="ficha-dato-valor">{{ funcionario?.tarea || '-' }}</span>
                <Select
                  v-else
                  v-model="editData.tarea"
                  :options="tareaOptions"
                  size="sm"
                />
              </div>
              <div class="ficha-dato">
                <span class="ficha-dato-label">Régimen</span>
                <span v-if="!isEditing" class="ficha-dato-valor">{{ funcionario?.regimen?.nombre || '-' }}</span>
                <Select
                  v-else
                  v-model="editData.regimenId"
                  :options="regimenOptions"
                  size="sm"
                />
              </div>
              <div class="ficha-dato">
                <span class="ficha-dato-label">Realiza Art. 222</span>
                <span v-if="!isEditing" class="ficha-dato-valor">
                  <Badge :variant="funcionario?.realiza222 ? 'success' : 'gray'" size="sm">
                    {{ funcionario?.realiza222 ? 'Sí' : 'No' }}
                  </Badge>
                </span>
                <Select
                  v-else
                  v-model="editData.realiza222"
                  :options="booleanOptions"
                  size="sm"
                />
              </div>
            </FichaFormulario>
          </InlineForm>
        </div>
      </template>

      <template #turnos>
        <div class="ficha-turnos-layout">
          <!-- Columna Izquierda: Calendario -->
          <div class="ficha-turnos-calendario">
            <div class="ficha-calendario-container">
              <div class="ficha-calendario-header">
                <div class="ficha-calendario-controles">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    @click="mesActual === 0 ? (mesActual = 11, añoActual--) : mesActual--"
                  >
                    <ChevronLeft :size="16" />
                  </Button>
                  <span class="ficha-calendario-mes">
                    {{ new Intl.DateTimeFormat('es-UY', { month: 'long', year: 'numeric' }).format(new Date(añoActual, mesActual)) }}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    @click="mesActual === 11 ? (mesActual = 0, añoActual++) : mesActual++"
                  >
                    <ChevronRight :size="16" />
                  </Button>
                </div>
              </div>
              
              <MiniCalendario
                :mes="mesActual"
                :año="añoActual"
                :dias-activos="diasTurnoCalculados"
                :excepciones="isEditing ? editData.diasTurnoExcepciones : []"
                :hora-ingreso="isEditing ? editData.horaIngreso : funcionario?.horaIngreso"
                :hora-salida="isEditing ? editData.horaSalida : funcionario?.horaSalida"
                :readonly="!isEditing"
                @update:dias-activos="handleUpdateDiasActivos"
                @dia-click="handleDiaClick"
              />

              <!-- Popover de Edición Inline -->
              <div 
                v-if="diaSeleccionado && isEditing"
                class="ficha-popover-backdrop"
                @click="cancelarExcepcion"
              ></div>
              
              <div 
                v-if="diaSeleccionado && isEditing" 
                class="ficha-turno-popover"
                :style="popoverPosition"
              >
                <div class="ficha-popover-header">
                  <span class="ficha-popover-titulo">
                    <Calendar :size="14" />
                    {{ formatDiaSeleccionado() }}
                  </span>
                  <button 
                    class="ficha-popover-close" 
                    @click="cancelarExcepcion"
                    title="Cerrar"
                  >
                    <X :size="14" />
                  </button>
                </div>
                
                <div class="ficha-popover-body">
                  <div class="ficha-popover-campo">
                    <label class="ficha-popover-label">Hora Ingreso</label>
                    <Input
                      v-model="excepcionTemp.horaIngreso"
                      placeholder="00:00"
                      type="time"
                      size="sm"
                    />
                  </div>
                  
                  <div class="ficha-popover-campo">
                    <label class="ficha-popover-label">Hora Salida</label>
                    <Input
                      v-model="excepcionTemp.horaSalida"
                      placeholder="00:00"
                      type="time"
                      size="sm"
                    />
                  </div>
                </div>
                
                <div class="ficha-popover-footer">
                  <Button 
                    v-if="diaSeleccionado && editData.diasTurno.includes(diaSeleccionado)" 
                    variant="danger" 
                    size="sm" 
                    @click="quitarTurno"
                  >
                    Quitar Turno
                  </Button>
                  <div style="flex: 1"></div>
                  <Button variant="ghost" size="sm" @click="cancelarExcepcion">
                    Cancelar
                  </Button>
                  <Button variant="primary" size="sm" @click="aplicarExcepcion">
                    {{ diaSeleccionado && editData.diasTurno.includes(diaSeleccionado) ? 'Actualizar' : 'Marcar Turno' }}
                  </Button>
                </div>
              </div>
              
              <div class="ficha-calendario-leyenda">
                <div class="leyenda-item">
                  <span class="leyenda-color leyenda-color--activo"></span>
                  <span>Día de Turno</span>
                </div>
                <div class="leyenda-item">
                  <span class="leyenda-color leyenda-color--vacio"></span>
                  <span>Descanso</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Columna Derecha: Configuración -->
          <InlineForm class="ficha-turnos-config-wrapper">
            <FichaFormulario>
              <div class="ficha-dato">
                <span class="ficha-dato-label">Régimen Laboral</span>
                <span v-if="!isEditing" class="ficha-dato-valor">{{ funcionario?.regimen?.nombre || '-' }}</span>
                <Select
                  v-else
                  v-model="editData.regimenId"
                  :options="regimenOptions"
                  size="sm"
                />
              </div>
              
              <div class="ficha-dato">
                <span class="ficha-dato-label">Fecha Inicio Ciclo</span>
                <span v-if="!isEditing" class="ficha-dato-valor">{{ formatDate(funcionario?.fechaInicioTurno) }}</span>
                <Input
                  v-else
                  v-model="editData.fechaInicioTurno"
                  placeholder="DD/MM/AAAA"
                  type="date"
                  size="sm"
                />
              </div>
              
              <div class="ficha-dato">
                <span class="ficha-dato-label">Hora Ingreso</span>
                <span v-if="!isEditing" class="ficha-dato-valor">{{ funcionario?.horaIngreso || '-' }}</span>
                <Input
                  v-else
                  v-model="editData.horaIngreso"
                  placeholder="00:00"
                  type="time"
                  size="sm"
                />
              </div>
              
              <div class="ficha-dato">
                <span class="ficha-dato-label">Hora Salida</span>
                <span v-if="!isEditing" class="ficha-dato-valor">{{ funcionario?.horaSalida || '-' }}</span>
                <Input
                  v-else
                  v-model="editData.horaSalida"
                  placeholder="00:00"
                  type="time"
                  size="sm"
                />
              </div>
              
              <Button 
                v-if="isEditing" 
                variant="secondary" 
                size="sm" 
                class="ficha-btn-recalcular"
                @click="handleRecalcular"
              >
                <RefreshCw :size="14" />
                Recalcular según régimen
              </Button>
            </FichaFormulario>
          </InlineForm>
        </div>
      </template>
      
      <template #licencias>
        <div class="ficha-licencias-container">
          <SectionHeader 
            v-if="!showLicenciaForm"
            title="Licencias Registradas"
            show-action
            action-label="Agregar Licencia"
            @action-click="startAddLicencia"
          />

          <!-- Formulario de Licencia -->
          <InlineForm v-if="showLicenciaForm">
            <FichaFormulario :columns="2">
              <div class="ficha-dato">
                <span class="ficha-dato-label">Tipo de Licencia</span>
                <Select
                  v-model="licenciaEditData.tipoLicenciaId"
                  :options="tipoLicenciaOptions"
                  size="sm"
                />
              </div>
              <div class="ficha-dato">
                <span class="ficha-dato-label">Fecha Inicio</span>
                <Input
                  v-model="licenciaEditData.fechaInicio"
                  placeholder="DD/MM/AAAA"
                  type="date"
                  size="sm"
                />
              </div>
              <div class="ficha-dato">
                <span class="ficha-dato-label">Fecha Fin</span>
                <Input
                  v-model="licenciaEditData.fechaFin"
                  placeholder="DD/MM/AAAA"
                  type="date"
                  size="sm"
                />
              </div>
            </FichaFormulario>
            <template #actions>
              <Button size="sm" variant="ghost" @click="showLicenciaForm = false">Cancelar</Button>
              <Button size="sm" variant="primary" @click="handleSaveLicencia">
                {{ isEditingLicencia ? 'Actualizar' : 'Guardar' }}
              </Button>
            </template>
          </InlineForm>

          <!-- Lista de Licencias -->
          <DataTable
            v-else
            :columns="[
              { field: 'tipo.nombre', label: 'Tipo' },
              { field: 'fechaInicioFormatted', label: 'Desde' },
              { field: 'fechaFinFormatted', label: 'Hasta' },
              { field: 'createdAtFormatted', label: 'Ingresada' }
            ]"
            :data="formattedLicencias"
            :actions="[
              { name: 'edit', icon: Pencil },
              { name: 'delete', icon: Trash, variant: 'danger' }
            ]"
            empty-message="No hay licencias registradas"
            @action="handleLicenciaAction"
          />
        </div>
      </template>

      <template #cursos>
        <div class="ficha-licencias-container">
          <SectionHeader 
            v-if="!showCursoForm"
            title="Cursos y Capacitaciones"
            show-action
            action-label="Registrar Curso"
            @action-click="startAddCurso"
          />

          <!-- Formulario de Curso -->
          <InlineForm v-if="showCursoForm">
            <FichaFormulario :columns="2">
              <div class="ficha-dato">
                <span class="ficha-dato-label">Nombre del Curso</span>
                <Select
                  v-model="cursoEditData.tipoCursoId"
                  :options="tipoCursoOptions"
                  size="sm"
                />
              </div>
              <div class="ficha-dato">
                <span class="ficha-dato-label">Fecha Inicio</span>
                <Input
                  v-model="cursoEditData.fechaInicio"
                  placeholder="DD/MM/AAAA"
                  type="date"
                  size="sm"
                />
              </div>
              <div class="ficha-dato">
                <span class="ficha-dato-label">Fecha Fin</span>
                <Input
                  v-model="cursoEditData.fechaFin"
                  placeholder="DD/MM/AAAA"
                  type="date"
                  size="sm"
                />
              </div>
            </FichaFormulario>
            <template #actions>
              <Button size="sm" variant="ghost" @click="showCursoForm = false">Cancelar</Button>
              <Button size="sm" variant="primary" @click="handleSaveCurso">
                {{ isEditingCurso ? 'Actualizar' : 'Guardar' }}
              </Button>
            </template>
          </InlineForm>

          <!-- Lista de Cursos -->
          <DataTable
            v-else
            :columns="[
              { field: 'tipo.nombre', label: 'Curso' },
              { field: 'fechaInicioFormatted', label: 'Desde' },
              { field: 'fechaFinFormatted', label: 'Hasta' },
              { field: 'createdAtFormatted', label: 'Ingresada' }
            ]"
            :data="formattedCursos"
            :actions="[
              { name: 'edit', icon: Pencil },
              { name: 'delete', icon: Trash, variant: 'danger' }
            ]"
            empty-message="No hay cursos registrados"
            @action="handleCursoAction"
          />
        </div>
      </template>

      <template #historial>
        <div class="ficha-historial-container">
          <div v-if="historial.length === 0" class="ficha-sin-datos">
            <p>No hay movimientos registrados</p>
          </div>
          <div v-else class="ficha-historial-lista">
            <table class="ficha-tabla-historial">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Unidad Origen</th>
                  <th>Unidad Destino</th>
                  <th>Motivo</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="movimiento in historial" :key="movimiento.id">
                  <td class="w-32">{{ formatDate(movimiento.fechaCambio) }}</td>
                  <td>{{ movimiento.unidadOrigen?.nombre || '-' }}</td>
                  <td>{{ movimiento.unidadDestino?.nombre || '-' }}</td>
                  <td class="ficha-movimiento-motivo-td">{{ movimiento.motivo || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import './FichaFuncionario.css'
import { ref, computed, onMounted, watch } from 'vue'
import { 
  Badge, Input, Select, Button, Tabs, Accordion, MiniCalendario, FichaFormulario,
  InlineForm, DataTable, SectionHeader
} from '@components'
import { RefreshCw, Trash, X, GraduationCap } from 'lucide-vue-next'
import { useToast, useTiposTarea } from '@hooks'
import { personalService, licenciasService, cursosService } from '@services'
import { calcularTurnosMes } from '@lib/services/turnosService'
import type { FuncionarioConRelaciones } from '@services/personalService'
import type { LicenciaConTipo } from '@services/licenciasService'
import type { CursoConTipo } from '@services/cursosService'
import type { HistorialMovimiento, Funcionario, DiasTurnoDetalle, LicenciaFuncionario, Curso } from '@lib/types'

interface Props {
  funcionario?: FuncionarioConRelaciones
  mode?: 'view' | 'create'
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'view'
})

const emit = defineEmits<{
  edit: []
  updated: []
  created: [funcionario: FuncionarioConRelaciones]
  'temp-data-change': [data: any]
}>()

const toast = useToast()
const historial = ref<(HistorialMovimiento & { unidadOrigen?: { nombre: string }, unidadDestino?: { nombre: string } })[]>([])
const isEditing = ref(false)
const saving = ref(false)
const errors = ref<Record<string, string>>({})
const activeTab = ref('datos')

const booleanOptions = [
  { value: true, label: 'Sí' },
  { value: false, label: 'No' }
]

// Estado para calendario de turnos
const hoy = new Date()
const mesActual = ref(hoy.getMonth())
const añoActual = ref(hoy.getFullYear())

// AI-Hint: Estado para gestión de excepciones puntuales por día | diaSeleccionado dispara el panel contextual
const diaSeleccionado = ref<number | null>(null)
const excepcionTemp = ref({
  horaIngreso: '08:00',
  horaSalida: '16:00'
})

// AI-Hint: Snapshot para revertir cambios en diasTurno si se cancela la edición de un día
const diasTurnoSnapshot = ref<number[]>([])

// AI-Hint: Posicionamiento centralizado sobre el contenedor relativo del calendario | Evita cálculos complejos de coordenadas por día
const popoverPosition = computed(() => {
  if (!diaSeleccionado.value) return {}
  return {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  }
})

// Configuración de tabs
const tabs = computed(() => {
  const baseTabs = [
    { id: 'datos', label: 'Datos', icon: FileText },
    { id: 'turnos', label: 'Turnos', icon: Clock },
    { id: 'licencias', label: 'Licencias', icon: Calendar },
    { id: 'cursos', label: 'Cursos', icon: GraduationCap }
  ]
  
  // Solo mostrar historial en modo view
  if (props.mode === 'view') {
    baseTabs.push({ id: 'historial', label: 'Historial', icon: History })
  }
  
  return baseTabs
})

// Opciones de selects
const grados = ref<any[]>([])
const unidades = ref<any[]>([])
const subUnidades = ref<any[]>([])
const escalafones = ref<any[]>([])
const regimenes = ref<any[]>([])

// Datos de edición
const editData = ref({
  ci: '' as string,
  nombre_completo: '',
  gradoId: null as string | number | null,
  unidadId: null as string | number | null,
  subUnidadId: null as string | number | null,
  escalafonId: null as string | number | null,
  fechaIngreso: '',
    // AI-Hint: Campos laborales agregados en version(4)
    tarea: '' as string,
  regimenId: null as string | number | null,
  horaIngreso: undefined as string | undefined,
  horaSalida: undefined as string | undefined,
  realiza222: undefined as boolean | undefined,
  fechaInicioTurno: '' as string,
  diasTurno: [] as number[],
  diasTurnoExcepciones: [] as DiasTurnoDetalle[]
})

// Computed options
const gradoOptions = computed(() => 
  grados.value.map(g => ({ value: g.id, label: g.nombre }))
)

const unidadOptions = computed(() => 
  unidades.value.map(u => ({ value: u.id, label: u.nombre }))
)

// AI-Hint: Filtrar subUnidades por unidad actual del funcionario | Solo muestra subUnidades de la unidad del funcionario | Evita selecciones inválidas
const subUnidadOptions = computed(() => {
  const unidadId = isEditing.value ? editData.value.unidadId : props.funcionario?.unidadId
  if (!unidadId) return [{ value: '', label: 'A designar' }]
  
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

const regimenOptions = computed(() => [
  { value: '', label: 'Sin régimen' },
  ...regimenes.value.map(r => ({ value: r.id, label: r.nombre }))
])

// AI-Hint: Cálculo automático de turnos basado en régimen y fecha de inicio | Combina cálculo base con excepciones manuales
const diasTurnoCalculados = computed(() => {
  const regimenId = isEditing.value ? editData.value.regimenId : props.funcionario?.regimenId
  const fechaInicio = isEditing.value ? editData.value.fechaInicioTurno : props.funcionario?.fechaInicioTurno
  
  if (!regimenId || !fechaInicio) return []

  const regimen = regimenes.value.find(r => r.id === Number(regimenId))
  if (!regimen) return []

  // Parsear fecha inicio asegurando hora local (evitar desfase UTC)
  const parts = String(fechaInicio).split('-')
  const dateInicio = parts.length === 3 
    ? new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
    : new Date(fechaInicio)

  // Calcular base según régimen
  const calculados = calcularTurnosMes(
    regimen.nombre,
    dateInicio,
    mesActual.value,
    añoActual.value
  )

  // Aplicar excepciones (esto se manejará más adelante si es necesario, 
  // por ahora el MiniCalendario recibe los días activos finales)
  // Pero si el usuario está editando, editData.value.diasTurno es lo que manda
  if (isEditing.value) {
    return editData.value.diasTurno
  }

  // Si no está editando, intentar parsear lo que viene de la BD
  if (props.funcionario?.diasTurno) {
    try {
      return JSON.parse(props.funcionario.diasTurno)
    } catch (e) {
      return calculados
    }
  }

  return calculados
})

// AI-Hint: Opciones predefinidas para Tarea Asignada | Mejora UX con valores consistentes | Evita errores de tipeo
const { opciones: tareaOptionsFromDB } = useTiposTarea()
const tareaOptions = computed(() => [
  { value: '', label: 'Sin tarea asignada' },
  ...tareaOptionsFromDB.value
])

// AI-Hint: Cargar opciones de selects para modo edición | Reutiliza personalService.getFormData() | Necesario para selects editables
async function loadFormData() {
  try {
    const data = await personalService.getFormData()
    grados.value = data.grados
    unidades.value = data.unidades
    
    const currentUnidadId = isEditing.value ? editData.value.unidadId : props.funcionario?.unidadId
    if (currentUnidadId) {
      subUnidades.value = data.subUnidades.filter(su => su.unidadId === Number(currentUnidadId))
    } else {
      subUnidades.value = data.subUnidades
    }
    
    escalafones.value = data.escalafones
    regimenes.value = data.regimenes
  } catch (error) {
    // Error silencioso
  }
}

async function loadHistorial() {
  // Guard: solo cargar historial en modo view con funcionario válido
  if (props.mode === 'create' || !props.funcionario?.id) return
  
  try {
    historial.value = await personalService.getHistorialMovimientos(props.funcionario.id)
  } catch (error) {
    // Error silencioso
  }
}

// --- Lógica de Licencias ---
const licencias = ref<LicenciaConTipo[]>([])
const tiposLicencia = ref<any[]>([])
const showLicenciaForm = ref(false)
const isEditingLicencia = ref(false)
const licenciaEditData = ref<Partial<LicenciaFuncionario>>({
  tipoLicenciaId: undefined,
  fechaInicio: new Date(),
  fechaFin: new Date()
})

const tipoLicenciaOptions = computed(() => 
  tiposLicencia.value.map(t => ({ value: t.id, label: t.nombre }))
)

async function loadLicencias() {
  if (!props.funcionario?.id) return
  try {
    licencias.value = await licenciasService.getByFuncionario(props.funcionario.id)
    tiposLicencia.value = await licenciasService.getTipos()
  } catch (error) {
    // Error silencioso
  }
}

const formattedLicencias = computed(() => 
  licencias.value.map(l => ({
    ...l,
    fechaInicioFormatted: formatDate(l.fechaInicio),
    fechaFinFormatted: formatDate(l.fechaFin),
    createdAtFormatted: formatDate(l.createdAt)
  }))
)

function handleLicenciaAction({ action, row }: { action: string, row: any }) {
  if (action === 'edit') startEditLicencia(row)
  if (action === 'delete') handleDeleteLicencia(row.id)
}

function startAddLicencia() {
  licenciaEditData.value = {
    tipoLicenciaId: undefined,
    fechaInicio: new Date(),
    fechaFin: new Date()
  }
  isEditingLicencia.value = false
  showLicenciaForm.value = true
}

function startEditLicencia(licencia: LicenciaConTipo) {
  licenciaEditData.value = { ...licencia }
  isEditingLicencia.value = true
  showLicenciaForm.value = true
}

async function handleSaveLicencia() {
  if (!props.funcionario?.id || !licenciaEditData.value.tipoLicenciaId) {
    toast.error('Complete los datos requeridos')
    return
  }

  try {
    const data: LicenciaFuncionario = {
      funcionarioId: props.funcionario.id,
      tipoLicenciaId: Number(licenciaEditData.value.tipoLicenciaId),
      fechaInicio: new Date(licenciaEditData.value.fechaInicio!),
      fechaFin: new Date(licenciaEditData.value.fechaFin!),
      estado: 'Aprobada' // Estado por defecto para licencias directas
    }

    if (isEditingLicencia.value && licenciaEditData.value.id) {
      await licenciasService.update(licenciaEditData.value.id, data)
      toast.success('Licencia actualizada')
    } else {
      await licenciasService.create(data)
      toast.success('Licencia creada')
    }
    
    showLicenciaForm.value = false
    await loadLicencias()
  } catch (error) {
    toast.error('Error al guardar licencia')
  }
}

async function handleDeleteLicencia(id: number) {
  if (!confirm('¿Está seguro de eliminar esta licencia?')) return
  try {
    await licenciasService.remove(id)
    toast.success('Licencia eliminada')
    await loadLicencias()
  } catch (error) {
    toast.error('Error al eliminar licencia')
  }
}

// --- Lógica de Cursos ---
const cursos = ref<CursoConTipo[]>([])
const tiposCurso = ref<any[]>([])
const showCursoForm = ref(false)
const isEditingCurso = ref(false)
const cursoEditData = ref<any>({
  tipoCursoId: undefined,
  fechaInicio: '',
  fechaFin: ''
})

const tipoCursoOptions = computed(() => 
  tiposCurso.value.map(t => ({ value: t.id, label: t.nombre }))
)

async function loadCursos() {
  if (!props.funcionario?.id) return
  try {
    cursos.value = await cursosService.getByFuncionario(props.funcionario.id)
    tiposCurso.value = await cursosService.getTipos()
  } catch (error) {
    // Error silencioso
  }
}

const formattedCursos = computed(() => 
  cursos.value.map(c => ({
    ...c,
    fechaInicioFormatted: formatDate(c.fechaInicio),
    fechaFinFormatted: formatDate(c.fechaFin),
    createdAtFormatted: formatDate(c.createdAt)
  }))
)

function handleCursoAction({ action, row }: { action: string, row: any }) {
  if (action === 'edit') startEditCurso(row)
  if (action === 'delete') handleDeleteCurso(row.id)
}

function startAddCurso() {
  cursoEditData.value = {
    tipoCursoId: undefined,
    fechaInicio: '',
    fechaFin: ''
  }
  isEditingCurso.value = false
  showCursoForm.value = true
}

function startEditCurso(curso: CursoConTipo) {
  cursoEditData.value = { 
    ...curso,
    fechaInicio: curso.fechaInicio ? new Date(curso.fechaInicio).toISOString().split('T')[0] : '',
    fechaFin: curso.fechaFin ? new Date(curso.fechaFin).toISOString().split('T')[0] : ''
  }
  isEditingCurso.value = true
  showCursoForm.value = true
}

async function handleSaveCurso() {
  if (!props.funcionario?.id || !cursoEditData.value.tipoCursoId) {
    toast.error('Complete los datos requeridos')
    return
  }

  try {
    const parseDate = (dateStr: string) => {
      if (!dateStr) return undefined
      const p = dateStr.split('-')
      return p.length === 3 ? new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2])) : new Date(dateStr)
    }

    const data: Curso = {
      funcionarioId: props.funcionario.id,
      tipoCursoId: Number(cursoEditData.value.tipoCursoId),
      fechaInicio: parseDate(cursoEditData.value.fechaInicio),
      fechaFin: parseDate(cursoEditData.value.fechaFin)
    }

    if (isEditingCurso.value && cursoEditData.value.id) {
      await cursosService.update(cursoEditData.value.id, data)
      toast.success('Curso actualizado')
    } else {
      await cursosService.create(data)
      toast.success('Curso registrado')
    }
    
    showCursoForm.value = false
    await loadCursos()
  } catch (error) {
    toast.error('Error al guardar curso')
  }
}

async function handleDeleteCurso(id: number) {
  if (!confirm('¿Está seguro de eliminar este curso?')) return
  try {
    await cursosService.remove(id)
    toast.success('Curso eliminado')
    await loadCursos()
  } catch (error) {
    toast.error('Error al eliminar curso')
  }
}

function startEditing() {
  if (props.mode === 'create') {
    editData.value = {
      ci: '',
      nombre_completo: '',
      gradoId: null,
      unidadId: null,
      subUnidadId: null,
      escalafonId: null,
      fechaIngreso: new Date().toISOString().split('T')[0],
      tarea: '',
      regimenId: null,
      horaIngreso: undefined,
      horaSalida: undefined,
      realiza222: false,
      fechaInicioTurno: new Date().toISOString().split('T')[0],
      diasTurno: [],
      diasTurnoExcepciones: []
    }
  } else if (props.funcionario) {
    editData.value = {
      ci: props.funcionario.ci || '',
      nombre_completo: props.funcionario.nombre_completo || '',
      gradoId: props.funcionario.gradoId || null,
      unidadId: props.funcionario.unidadId || null,
      subUnidadId: props.funcionario.subUnidadId || null,
      escalafonId: props.funcionario.escalafonId || null,
      fechaIngreso: props.funcionario.fechaIngreso 
        ? new Date(props.funcionario.fechaIngreso).toISOString().split('T')[0]
        : '',
      tarea: props.funcionario.tarea || '',
      regimenId: props.funcionario.regimenId || null,
      horaIngreso: props.funcionario.horaIngreso,
      horaSalida: props.funcionario.horaSalida,
      realiza222: props.funcionario.realiza222,
      fechaInicioTurno: props.funcionario.fechaInicioTurno
        ? new Date(props.funcionario.fechaInicioTurno).toISOString().split('T')[0]
        : '',
      diasTurno: props.funcionario.diasTurno ? JSON.parse(props.funcionario.diasTurno) : [],
      diasTurnoExcepciones: props.funcionario.diasTurnoExcepciones ? JSON.parse(props.funcionario.diasTurnoExcepciones) : []
    }

    // AI-Hint: Si diasTurno está vacío al iniciar edición, recalcular automáticamente según régimen base
    if (editData.value.diasTurno.length === 0) {
      const regimenId = editData.value.regimenId
      const fechaInicio = editData.value.fechaInicioTurno
      
      if (regimenId && fechaInicio) {
        const regimen = regimenes.value.find(r => r.id === Number(regimenId))
        if (regimen) {
          const parts = String(fechaInicio).split('-')
          const dateInicio = parts.length === 3 
            ? new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
            : new Date(fechaInicio)
          
          editData.value.diasTurno = calcularTurnosMes(
            regimen.nombre,
            dateInicio,
            mesActual.value,
            añoActual.value
          )
        }
      }
    }
  }
  errors.value = {}
  isEditing.value = true
}

// AI-Hint: Optimizar recarga de sub-unidades solo cuando cambia la unidad
watch(
  () => editData.value.unidadId,
  (newUnidadId, oldUnidadId) => {
    if (props.mode === 'create' && newUnidadId !== oldUnidadId && newUnidadId) {
      loadFormData()
    }
  }
)

// AI-Hint: Sincronizar header en tiempo real durante creación (watch específico para evitar deep: true)
watch(
  () => ({
    nombre_completo: editData.value.nombre_completo,
    gradoId: editData.value.gradoId,
    unidadId: editData.value.unidadId
  }),
  (newValue) => {
    if (props.mode === 'create') {
      const selectedGrado = grados.value.find(g => g.id === Number(newValue.gradoId))
      const selectedUnidad = unidades.value.find(u => u.id === Number(newValue.unidadId))
      
      emit('temp-data-change', {
        nombre_completo: newValue.nombre_completo,
        grado: selectedGrado ? { nombre: selectedGrado.nombre } : undefined,
        unidad: selectedUnidad ? { nombre: selectedUnidad.nombre } : undefined
      })
    }
  }
)

function cancelEditing() {
  isEditing.value = false
  errors.value = {}
  diaSeleccionado.value = null
  editData.value = {
    ci: '',
    nombre_completo: '',
    gradoId: null,
    unidadId: null,
    subUnidadId: null,
    escalafonId: null,
    fechaIngreso: '',
    tarea: '',
    regimenId: null,
    horaIngreso: undefined,
    horaSalida: undefined,
    realiza222: undefined,
    fechaInicioTurno: '',
    diasTurno: [],
    diasTurnoExcepciones: []
  }
}

// AI-Hint: Manejo de tecla Escape para cerrar popover inline
function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && diaSeleccionado.value) {
    cancelarExcepcion()
  }
}

function handleUpdateDiasActivos(dias: number[]) {
  editData.value.diasTurno = dias
}

// AI-Hint: Selecciona un día para edición puntual de horario | No modifica datos hasta presionar 'Aplicar'
function handleDiaClick(dia: number) {
  if (!isEditing.value) return
  
  // Guardar snapshot para revertir si se cancela
  diasTurnoSnapshot.value = [...editData.value.diasTurno]
  
  // Seleccionar día y cargar horarios
  diaSeleccionado.value = dia
  
  // Buscar si ya existe excepción para este día en el estado de edición
  const excepcionExistente = editData.value.diasTurnoExcepciones.find(
    e => e.dia === dia
  )
  
  if (excepcionExistente) {
    // Cargar horarios de excepción existente
    excepcionTemp.value = {
      horaIngreso: excepcionExistente.entradaCustom || editData.value.horaIngreso || '08:00',
      horaSalida: excepcionExistente.salidaCustom || editData.value.horaSalida || '16:00'
    }
  } else {
    // Usar horarios por defecto de configuración actual
    excepcionTemp.value = {
      horaIngreso: editData.value.horaIngreso || '08:00',
      horaSalida: editData.value.horaSalida || '16:00'
    }
  }
}

function aplicarExcepcion() {
  if (!diaSeleccionado.value) return
  
  const dia = diaSeleccionado.value
  const index = editData.value.diasTurnoExcepciones.findIndex(e => e.dia === dia)
  
  const nuevaExcepcion: DiasTurnoDetalle = {
    dia,
    entradaCustom: excepcionTemp.value.horaIngreso,
    salidaCustom: excepcionTemp.value.horaSalida
  }
  
  // Asegurar que el día esté en diasTurno si se está aplicando un horario manual
  if (!editData.value.diasTurno.includes(dia)) {
    editData.value.diasTurno.push(dia)
    editData.value.diasTurno.sort((a, b) => a - b)
  }
  
  // Actualizar o agregar excepción en el array de edición
  if (index > -1) {
    editData.value.diasTurnoExcepciones[index] = nuevaExcepcion
  } else {
    editData.value.diasTurnoExcepciones.push(nuevaExcepcion)
  }
  
  toast.success(`Turno manual aplicado para el día ${dia}`)
  diasTurnoSnapshot.value = []
  diaSeleccionado.value = null
}

// AI-Hint: Permite marcar un día como descanso directamente desde el popover | Remueve día de diasTurno y excepciones
function quitarTurno() {
  if (!diaSeleccionado.value) return
  
  const dia = diaSeleccionado.value
  
  // Remover de diasTurno
  const indexTurno = editData.value.diasTurno.indexOf(dia)
  if (indexTurno > -1) {
    editData.value.diasTurno.splice(indexTurno, 1)
  }
  
  // Remover de excepciones si existiera
  const indexExcepcion = editData.value.diasTurnoExcepciones.findIndex(e => e.dia === dia)
  if (indexExcepcion > -1) {
    editData.value.diasTurnoExcepciones.splice(indexExcepcion, 1)
  }
  
  toast.success(`Día ${dia} marcado como descanso`)
  diasTurnoSnapshot.value = []
  diaSeleccionado.value = null
}

function cancelarExcepcion() {
  // Restaurar snapshot si existe
  if (diasTurnoSnapshot.value.length > 0) {
    editData.value.diasTurno = [...diasTurnoSnapshot.value]
    diasTurnoSnapshot.value = []
  }
  diaSeleccionado.value = null
}

function formatDiaSeleccionado(): string {
  if (!diaSeleccionado.value) return ''
  const fecha = new Date(añoActual.value, mesActual.value, diaSeleccionado.value)
  return new Intl.DateTimeFormat('es-UY', { 
    day: 'numeric', 
    month: 'long' 
  }).format(fecha)
}

function handleRecalcular() {
  const regimenId = editData.value.regimenId
  const fechaInicio = editData.value.fechaInicioTurno
  
  if (!regimenId || !fechaInicio) {
    toast.error('Seleccione un régimen y fecha de inicio')
    return
  }

  const regimen = regimenes.value.find(r => r.id === Number(regimenId))
  if (!regimen) return

  // Parsear fecha inicio asegurando hora local
  const parts = String(fechaInicio).split('-')
  const dateInicio = parts.length === 3 
    ? new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
    : new Date(fechaInicio)

  const calculados = calcularTurnosMes(
    regimen.nombre,
    dateInicio,
    mesActual.value,
    añoActual.value
  )
  
  editData.value.diasTurno = calculados
  editData.value.diasTurnoExcepciones = []
  toast.success('Calendario recalculado')
}

function validateForm(): boolean {
  errors.value = {}
  
  if (!editData.value.nombre_completo) {
    errors.value.nombre_completo = 'El nombre completo es requerido'
  } else if (editData.value.nombre_completo.length < 3) {
    errors.value.nombre_completo = 'El nombre debe tener al menos 3 caracteres'
  }
  
  if (!editData.value.gradoId || editData.value.gradoId === '') {
    errors.value.gradoId = 'El grado es requerido'
  }
  
  if (props.mode === 'create' && (!editData.value.unidadId || editData.value.unidadId === '')) {
    errors.value.unidadId = 'La unidad es requerida'
  }
  
  if (!editData.value.fechaIngreso) {
    errors.value.fechaIngreso = 'La fecha de ingreso es requerida'
  } else {
    const fecha = new Date(editData.value.fechaIngreso)
    const hoy = new Date()
    hoy.setHours(23, 59, 59, 999)
    if (fecha > hoy) {
      errors.value.fechaIngreso = 'La fecha de ingreso no puede ser futura'
    }
  }
  
  return Object.keys(errors.value).length === 0
}

// AI-Hint: Actualizar funcionario sin permitir cambio de unidad desde ficha | Unidad es readonly, solo se puede cambiar desde TransferirModal | SubUnidad es editable
async function saveChanges() {
  if (!validateForm()) {
    return
  }
  
  saving.value = true
  
  try {
    const data = {
      ci: editData.value.ci,
      nombre_completo: editData.value.nombre_completo,
      gradoId: Number(editData.value.gradoId),
      unidadId: props.mode === 'create' ? Number(editData.value.unidadId) : props.funcionario?.unidadId,
      subUnidadId: editData.value.subUnidadId && editData.value.subUnidadId !== '' 
        ? Number(editData.value.subUnidadId) 
        : undefined,
      escalafonId: editData.value.escalafonId && editData.value.escalafonId !== '' 
        ? Number(editData.value.escalafonId) 
        : undefined,
      fechaIngreso: new Date(editData.value.fechaIngreso),
      tarea: editData.value.tarea || undefined,
      regimenId: editData.value.regimenId && editData.value.regimenId !== '' 
        ? Number(editData.value.regimenId) 
        : undefined,
      horaIngreso: editData.value.horaIngreso || undefined,
      horaSalida: editData.value.horaSalida || undefined,
      realiza222: editData.value.realiza222,
      fechaInicioTurno: editData.value.fechaInicioTurno ? (() => {
        const p = editData.value.fechaInicioTurno.split('-')
        return p.length === 3 ? new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2])) : new Date(editData.value.fechaInicioTurno)
      })() : undefined,
      diasTurno: JSON.stringify(editData.value.diasTurno),
      diasTurnoExcepciones: JSON.stringify(editData.value.diasTurnoExcepciones)
    }

    if (props.mode === 'create') {
      const id = await personalService.create(data as any)
      const newFuncionario = await personalService.getById(id)
      toast.success('Funcionario creado correctamente')
      isEditing.value = false
      if (newFuncionario) emit('created', newFuncionario)
    } else if (props.funcionario?.id) {
      await personalService.update(props.funcionario.id, data)
      toast.success('Funcionario actualizado correctamente')
      isEditing.value = false
      emit('updated')
      await loadHistorial()
    }
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message)
    } else {
      toast.error('Error al guardar funcionario')
    }
  } finally {
    saving.value = false
  }
}


function formatDate(date: Date | string | undefined): string {
  if (!date) return '-'
  
  let d: Date
  if (typeof date === 'string' && date.includes('-')) {
    const parts = date.split('-')
    if (parts.length === 3) {
      d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
    } else {
      d = new Date(date)
    }
  } else {
    d = new Date(date)
  }

  return d.toLocaleDateString('es-UY', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// AI-Hint: Exponer métodos y estado para uso desde componente padre | Permite iniciar edición desde header y controlar footer del Modal
defineExpose({
  startEditing,
  cancelEditing,
  saveChanges,
  isEditing,
  saving
})

onMounted(async () => {
  if (props.mode === 'create') {
    startEditing()
  }
  await loadFormData()
  window.addEventListener('keydown', handleKeyDown)
})

// AI-Hint: Limpiar listener al desmontar para evitar fugas de memoria
import { onUnmounted } from 'vue'
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

// AI-Hint: Carga reactiva de datos al cambiar el funcionario | immediate: true asegura carga inicial si ya existe prop
watch(() => props.funcionario, (newFuncionario) => {
  if (newFuncionario?.id && props.mode === 'view') {
    loadHistorial()
    loadLicencias()
    loadCursos()
  }
}, { immediate: true })
</script>
