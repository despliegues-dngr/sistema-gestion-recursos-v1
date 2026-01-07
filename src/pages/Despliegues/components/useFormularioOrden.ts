/**
 * Composable para gestión de estado y lógica de Formulario de Orden Operativa
 * Compartido entre FormularioOrdenGeneral y FormularioOrdenRecursos
 * 
 * AI-Hint: Se mantiene el uso de esmapoService para consistencia con la capa de servicios.
 */
import { ref, watch, onMounted } from 'vue'
import { esmapoService } from '@services'
import type { OrdenOperativaConRelaciones } from '@services/esmapoService'
import { useToast } from '@hooks'

// Estado global dentro del módulo para que sea compartido entre los componentes que usen el hook
// si se invoca en el mismo contexto de ciclo de vida (el modal)
const formData = ref<any>({
  nroDocumento: '',
  tipoDocumento: 'Orden de Servicio',
  tipoServicio: '',
  nombreDocumento: '',
  nombreServicio: '',
  unidadSolicitadaId: '',
  departamento: [],
  seccional: [],
  tiempoServicio: '',
  fechaInicio: '',
  fechaFin: '',
  horaInicio: '',
  horaFin: '',
  planMoviles: '0',
  planMotos: '0',
  planSsoo: '0',
  planPpssMovil: '0',
  planPieTierra: '0',
  planMotosBiTripuladas: '0',
  planHidro: '0',
  planHipos: '0',
  planChoqueApost: '0',
  planChoqueAlerta: '0',
  planTotalPersonal: '0',
  estado: 'Pendiente',
  tipoDespliegue: 'Despliegue',
  motivoSinEfecto: undefined
})

const errors = ref<Record<string, string>>({})
const isSaving = ref(false)
const ordenOriginal = ref<OrdenOperativaConRelaciones | null>(null)

export function useFormularioOrden(props: { mode?: 'create' | 'edit', ordenId?: number }) {
  const toast = useToast()

  // Opciones (se pueden mover a constantes si no cambian)
  const tipoDocumentoOptions = [
    { value: 'Orden de Operaciones', label: 'Orden de Operaciones' },
    { value: 'Circular', label: 'Circular' },
    { value: 'Orden de Servicio', label: 'Orden de Servicio' },
    { value: 'Comunicado', label: 'Comunicado' },
    { value: 'Otro', label: 'Otro' }
  ]

  const tipoServicioOptions = [
    { value: 'Operativo', label: 'Operativo' },
    { value: 'Patrullaje', label: 'Patrullaje' },
    { value: 'Apoyo', label: 'Apoyo' },
    { value: 'Incursión', label: 'Incursión' },
    { value: 'Allanamiento perimetral', label: 'Allanamiento perimetral' }
  ]

  const tiempoServicioOptions = [
    { value: 'Permanente', label: 'Permanente' },
    { value: 'Transitorio', label: 'Transitorio' },
    { value: 'Estático', label: 'Estático' }
  ]

  const departamentoOptions = [
    { value: 'Artigas', label: 'Artigas' },
    { value: 'Canelones', label: 'Canelones' },
    { value: 'Cerro Largo', label: 'Cerro Largo' },
    { value: 'Colonia', label: 'Colonia' },
    { value: 'Durazno', label: 'Durazno' },
    { value: 'Flores', label: 'Flores' },
    { value: 'Florida', label: 'Florida' },
    { value: 'Lavalleja', label: 'Lavalleja' },
    { value: 'Maldonado', label: 'Maldonado' },
    { value: 'Montevideo', label: 'Montevideo' },
    { value: 'Paysandú', label: 'Paysandú' },
    { value: 'Río Negro', label: 'Río Negro' },
    { value: 'Rivera', label: 'Rivera' },
    { value: 'Rocha', label: 'Rocha' },
    { value: 'Salto', label: 'Salto' },
    { value: 'San José', label: 'San José' },
    { value: 'Soriano', label: 'Soriano' },
    { value: 'Tacuarembó', label: 'Tacuarembó' },
    { value: 'Treinta y Tres', label: 'Treinta y Tres' }
  ]

  const seccionalOptions = [
    { value: '1ra', label: '1ra' }, { value: '2da', label: '2da' }, { value: '3ra', label: '3ra' },
    { value: '4ta', label: '4ta' }, { value: '5ta', label: '5ta' }, { value: '6ta', label: '6ta' },
    { value: '7ma', label: '7ma' }, { value: '8va', label: '8va' }, { value: '9na', label: '9na' },
    { value: '10ma', label: '10ma' }, { value: '11ra', label: '11ra' }, { value: '12da', label: '12da' },
    { value: '13ra', label: '13ra' }, { value: '14ta', label: '14ta' }, { value: '15ta', label: '15ta' },
    { value: '16ta', label: '16ta' }, { value: '17ma', label: '17ma' }, { value: '18va', label: '18va' },
    { value: '19na', label: '19na' }, { value: '20ma', label: '20ma' }
  ]

  const tipoDespliegueOptions = [
    { value: 'Despliegue', label: 'Despliegue' },
    { value: 'Franco', label: 'Franco' },
    { value: 'Sin efecto', label: 'Sin efecto' }
  ]

  const motivoSinEfectoOptions = [
    { value: 'Por orden de superior', label: 'Por orden de superior' },
    { value: 'Por falta de personal', label: 'Por falta de personal' },
    { value: 'Por cubrir otro Operativo', label: 'Por cubrir otro Operativo' },
    { value: 'Por cubrir espectaculo publico', label: 'Por cubrir espectáculo público' },
    { value: 'Por inclemencias del tiempo', label: 'Por inclemencias del tiempo' },
    { value: 'Otro motivo', label: 'Otro motivo' }
  ]

  const unidadOptions = [
    { value: 'Dirección I', label: 'Dirección I' },
    { value: 'Dirección II', label: 'Dirección II' },
    { value: 'Regional Este', label: 'Regional Este' },
    { value: 'Regional Norte', label: 'Regional Norte' },
    { value: 'GEO', label: 'GEO' },
    { value: 'Dirección IV', label: 'Dirección IV' },
    { value: 'Dirección V', label: 'Dirección V' }
  ]

  function resetForm() {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')

    formData.value = {
      nroDocumento: '',
      tipoDocumento: 'Orden de Servicio',
      tipoServicio: '',
      nombreDocumento: '',
      nombreServicio: '',
      unidadSolicitadaId: '',
      departamento: [],
      seccional: [],
      tiempoServicio: '',
      fechaInicio: `${year}-${month}-${day}`,
      fechaFin: `${year}-${month}-${day}`,
      horaInicio: `${hours}:${minutes}`,
      horaFin: `${hours}:${minutes}`,
      planMoviles: '0',
      planMotos: '0',
      planSsoo: '0',
      planPpssMovil: '0',
      planPieTierra: '0',
      planMotosBiTripuladas: '0',
      planHidro: '0',
      planHipos: '0',
      planChoqueApost: '0',
      planChoqueAlerta: '0',
      planTotalPersonal: '0',
      estado: 'Pendiente',
      tipoDespliegue: 'Despliegue',
      motivoSinEfecto: undefined
    }
    errors.value = {}
    ordenOriginal.value = null
  }

  function formatDateForInput(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  function formatTimeForInput(date: Date): string {
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
  }

  async function cargarOrdenParaEditar(id: number) {
    try {
      const orden = await esmapoService.getById(id)
      if (!orden) {
        toast.error('Orden no encontrada')
        return
      }
      
      ordenOriginal.value = orden
      
      formData.value = {
        nroDocumento: orden.nroDocumento || '',
        tipoDocumento: orden.tipoDocumento || 'Orden de Servicio',
        tipoServicio: orden.tipoServicio || '',
        nombreDocumento: orden.nombreDocumento || '',
        nombreServicio: orden.nombreServicio || '',
        unidadSolicitadaId: orden.unidad?.nombre || '',
        departamento: orden.departamento ? orden.departamento.split(', ') : [],
        seccional: orden.seccional ? orden.seccional.split(', ') : [],
        tiempoServicio: orden.tiempoServicio || '',
        fechaInicio: orden.fechaInicioPlan ? formatDateForInput(new Date(orden.fechaInicioPlan)) : '',
        fechaFin: orden.fechaFinPlan ? formatDateForInput(new Date(orden.fechaFinPlan)) : '',
        horaInicio: orden.fechaInicioPlan ? formatTimeForInput(new Date(orden.fechaInicioPlan)) : '',
        horaFin: orden.fechaFinPlan ? formatTimeForInput(new Date(orden.fechaFinPlan)) : '',
        planMoviles: String(orden.planMoviles || 0),
        planMotos: String(orden.planMotos || 0),
        planSsoo: String(orden.planSsoo || 0),
        planPpssMovil: String(orden.planPpssMovil || 0),
        planPieTierra: String(orden.planPieTierra || 0),
        planMotosBiTripuladas: String(orden.planMotosBiTripuladas || 0),
        planHidro: String(orden.planHidro || 0),
        planHipos: String(orden.planHipos || 0),
        planChoqueApost: String(orden.planChoqueApost || 0),
        planChoqueAlerta: String(orden.planChoqueAlerta || 0),
        planTotalPersonal: String(orden.planTotalPersonal || 0),
        estado: orden.estado || 'Pendiente',
        tipoDespliegue: 'Despliegue',
        motivoSinEfecto: undefined
      }
    } catch (error) {
      console.error('Error al cargar orden:', error)
      toast.error('Error al cargar la orden')
    }
  }

  function validate(): boolean {
    errors.value = {}
    
    if (!formData.value.nroDocumento?.trim()) errors.value.nroDocumento = 'Requerido'
    if (!formData.value.tipoDocumento) errors.value.tipoDocumento = 'Requerido'
    if (!formData.value.unidadSolicitadaId) errors.value.unidadSolicitadaId = 'Requerido'
    if (!formData.value.fechaInicio) errors.value.fechaInicio = 'Requerido'
    if (!formData.value.fechaFin) errors.value.fechaFin = 'Requerido'
    if (!formData.value.horaInicio) errors.value.horaInicio = 'Requerido'
    if (!formData.value.horaFin) errors.value.horaFin = 'Requerido'

    if (formData.value.tipoDespliegue === 'Sin efecto' && !formData.value.motivoSinEfecto) {
      errors.value.motivoSinEfecto = 'Requerido'
    }
    
    return Object.keys(errors.value).length === 0
  }

  async function handleSubmit() {
    if (!validate()) {
      toast.error('Por favor complete los campos requeridos')
      return false
    }
    
    isSaving.value = true
    
    try {
      const unidadId = await esmapoService.buscarOCrearUnidad(formData.value.unidadSolicitadaId)

      const parseDate = (f: string, h: string) => {
        const [y, m, d] = f.split('-').map(Number)
        const [hh, mm] = h.split(':').map(Number)
        return new Date(y, m - 1, d, hh, mm)
      }

      const fechaInicioPlan = parseDate(formData.value.fechaInicio, formData.value.horaInicio)
      const fechaFinPlan = parseDate(formData.value.fechaFin, formData.value.horaFin)
      
      const dataToSave = {
        nroDocumento: formData.value.nroDocumento,
        tipoDocumento: formData.value.tipoDocumento,
        tipoServicio: formData.value.tipoServicio,
        nombreDocumento: formData.value.nombreDocumento,
        nombreServicio: formData.value.nombreServicio,
        unidadSolicitadaId: unidadId,
        fechaInicioPlan,
        fechaFinPlan,
        departamento: formData.value.departamento.join(', '),
        seccional: formData.value.seccional.join(', '),
        tiempoServicio: formData.value.tiempoServicio,
        planMoviles: Number(formData.value.planMoviles) || 0,
        planMotos: Number(formData.value.planMotos) || 0,
        planSsoo: Number(formData.value.planSsoo) || 0,
        planPpssMovil: Number(formData.value.planPpssMovil) || 0,
        planPieTierra: Number(formData.value.planPieTierra) || 0,
        planMotosBiTripuladas: Number(formData.value.planMotosBiTripuladas) || 0,
        planHidro: Number(formData.value.planHidro) || 0,
        planHipos: Number(formData.value.planHipos) || 0,
        planChoqueApost: Number(formData.value.planChoqueApost) || 0,
        planChoqueAlerta: Number(formData.value.planChoqueAlerta) || 0,
        planTotalPersonal: Number(formData.value.planTotalPersonal) || 0,
        estado: formData.value.estado || 'Pendiente'
      }
      
      if (props.mode === 'edit' && props.ordenId) {
        await esmapoService.update(props.ordenId, dataToSave as any)
        toast.success('Orden actualizada exitosamente')
      } else {
        await esmapoService.create(dataToSave as any)
        toast.success('Orden creada exitosamente')
      }
      
      return true
    } catch (error) {
      console.error('Error al guardar orden:', error)
      toast.error('Error al guardar la orden')
      return false
    } finally {
      isSaving.value = false
    }
  }

  // Inicialización o reactivación ante cambio de ID
  watch(() => props.ordenId, (newId) => {
    if (props.mode === 'edit' && newId) {
      cargarOrdenParaEditar(newId)
    } else {
      resetForm()
    }
  }, { immediate: true })

  return {
    formData,
    errors,
    isSaving,
    tipoDocumentoOptions,
    tipoServicioOptions,
    tiempoServicioOptions,
    departamentoOptions,
    seccionalOptions,
    tipoDespliegueOptions,
    motivoSinEfectoOptions,
    unidadOptions,
    handleSubmit,
    resetForm
  }
}

