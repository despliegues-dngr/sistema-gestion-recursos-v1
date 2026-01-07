/**
 * Servicio ESMAPO - Gestión de Órdenes Operativas
 * 
 * Responsabilidad: CRUD de órdenes operativas y planificación de despliegues
 */
import { db } from '@lib/db'
import type { OrdenOperativa, Unidad, HistorialOrdenOperativa } from '@lib/types'

export interface OrdenOperativaConRelaciones extends OrdenOperativa {
  unidad?: Unidad
}

export interface ImportResult {
  total: number
  importados: number
  errores: { fila: number; error: string }[]
}

// ✅ Obtener todas las órdenes operativas
async function getAll(incluirEliminadas = false): Promise<OrdenOperativaConRelaciones[]> {
  let ordenes = await db.ordenes_operativas.toArray()
  
  // Por defecto, excluir eliminadas
  if (!incluirEliminadas) {
    ordenes = ordenes.filter(o => !o.eliminada)
  }

  const unidades = await db.unidades.toArray()
  return ordenes.map(o => ({
    ...o,
    unidad: unidades.find(u => u.id === o.unidadSolicitadaId)
  }))
}

// ✅ Obtener orden por ID
async function getById(id: number): Promise<OrdenOperativaConRelaciones | undefined> {
  const orden = await db.ordenes_operativas.get(id)
  if (!orden) return undefined
  const unidad = orden.unidadSolicitadaId 
    ? await db.unidades.get(orden.unidadSolicitadaId) 
    : undefined
  return { ...orden, unidad }
}

// ✅ Crear orden
async function create(data: Omit<OrdenOperativa, 'id' | 'createdAt' | 'updatedAt' | 'eliminada' | 'versionActual'>): Promise<number> {
  const now = new Date()
  
  // Crear orden con versión inicial
  const ordenId = await db.ordenes_operativas.add({
    ...data,
    eliminada: false,
    versionActual: 1,
    createdAt: now,
    updatedAt: now
  } as OrdenOperativa)
  
  // Registrar en historial
  await db.historial_ordenes_operativas.add({
    ordenId,
    version: 1,
    accion: 'CREATE',
    snapshot: extraerSnapshot({ ...data, estado: data.estado || 'Pendiente' } as OrdenOperativa),
    usuarioId: data.creadoPor || 0,
    fechaHora: now
  })
  
  return ordenId
}

// ✅ Actualizar orden
async function update(id: number, data: Partial<OrdenOperativa>, usuarioId: number, motivoCambio?: string): Promise<number> {
  const ordenActual = await db.ordenes_operativas.get(id)
  if (!ordenActual) throw new Error('Orden no encontrada')
  
  const nuevaVersion = (ordenActual.versionActual || 1) + 1
  const now = new Date()
  
  // Actualizar orden
  await db.ordenes_operativas.update(id, {
    ...data,
    versionActual: nuevaVersion,
    updatedAt: now
  })
  
  // Obtener orden actualizada para snapshot
  const ordenActualizada = await db.ordenes_operativas.get(id)
  
  // Registrar en historial
  await db.historial_ordenes_operativas.add({
    ordenId: id,
    version: nuevaVersion,
    accion: 'UPDATE',
    snapshot: extraerSnapshot(ordenActualizada!),
    usuarioId,
    fechaHora: now,
    motivoCambio
  })
  
  return nuevaVersion
}

// ✅ Eliminar orden (Hard Delete - solo interno)
async function hardDelete(id: number): Promise<void> {
  await db.ordenes_operativas.delete(id)
}

// ✅ Soft Delete orden (Principal)
async function softDelete(id: number, usuarioId: number, motivoCambio?: string): Promise<void> {
  const ordenActual = await db.ordenes_operativas.get(id)
  if (!ordenActual) throw new Error('Orden no encontrada')
  
  const nuevaVersion = (ordenActual.versionActual || 1) + 1
  const now = new Date()
  
  // Marcar como eliminada
  await db.ordenes_operativas.update(id, {
    eliminada: true,
    eliminadaAt: now,
    eliminadaPor: usuarioId,
    versionActual: nuevaVersion,
    updatedAt: now
  })
  
  // Registrar en historial
  await db.historial_ordenes_operativas.add({
    ordenId: id,
    version: nuevaVersion,
    accion: 'DELETE',
    snapshot: extraerSnapshot(ordenActual),
    usuarioId,
    fechaHora: now,
    motivoCambio
  })
}

// ✅ Obtener historial de una orden
async function getHistorial(ordenId: number): Promise<HistorialOrdenOperativa[]> {
  return db.historial_ordenes_operativas
    .where('ordenId')
    .equals(ordenId)
    .reverse()
    .sortBy('version')
}

// ✅ Obtener versión específica de una orden
async function getVersionEspecifica(ordenId: number, version: number): Promise<HistorialOrdenOperativa | undefined> {
  return db.historial_ordenes_operativas
    .where(['ordenId', 'version'])
    .equals([ordenId, version])
    .first()
}

// ✅ Auxiliar: Extraer snapshot de una orden
function extraerSnapshot(orden: OrdenOperativa): HistorialOrdenOperativa['snapshot'] {
  return {
    nroDocumento: orden.nroDocumento,
    tipoDocumento: orden.tipoDocumento,
    tipoServicio: orden.tipoServicio,
    nombreDocumento: orden.nombreDocumento,
    nombreServicio: orden.nombreServicio,
    unidadSolicitadaId: orden.unidadSolicitadaId,
    fechaInicioPlan: orden.fechaInicioPlan,
    fechaFinPlan: orden.fechaFinPlan,
    horaInicioPlan: orden.horaInicioPlan,
    horaFinPlan: orden.horaFinPlan,
    planMoviles: orden.planMoviles,
    planMotos: orden.planMotos,
    planSsoo: orden.planSsoo,
    planPpssMovil: orden.planPpssMovil,
    planPieTierra: orden.planPieTierra,
    planMotosBiTripuladas: orden.planMotosBiTripuladas,
    planHidro: orden.planHidro,
    planHipos: orden.planHipos,
    planChoqueApost: orden.planChoqueApost,
    planChoqueAlerta: orden.planChoqueAlerta,
    planTotalPersonal: orden.planTotalPersonal,
    estado: orden.estado || 'Pendiente',
    departamento: orden.departamento,
    seccional: orden.seccional,
    tiempoServicio: orden.tiempoServicio,
    observaciones: orden.observaciones
  }
}

// ✅ Buscar o crear unidad
async function buscarOCrearUnidad(nombre: string): Promise<number> {
  const existente = await db.unidades
    .filter(u => u.nombre.toLowerCase() === nombre.toLowerCase())
    .first()
  if (existente?.id) return existente.id
  return db.unidades.add({
    nombre,
    tipo: 'general',
    createdAt: new Date(),
    updatedAt: new Date()
  } as Unidad)
}

// ✅ Crear orden desde CSV (siempre crea un nuevo registro con versión inicial)
async function crearOrden(
  nroDocumento: string, 
  unidadId: number,
  tipoDocumento?: string,
  tipoServicio?: string,
  nombreDocumento?: string,
  nombreServicio?: string,
  fechaInicioPlan?: Date,
  fechaFinPlan?: Date,
  horaInicioPlan?: string,
  horaFinPlan?: string,
  planMoviles?: number,
  planMotos?: number,
  planSsoo?: number,
  planPpssMovil?: number,
  planPieTierra?: number,
  planMotosBiTripuladas?: number,
  planHipos?: number,
  planChoqueApost?: number,
  planChoqueAlerta?: number,
  planTotalPersonal?: number,
  planHidro?: number,
  departamento?: string,
  seccional?: string,
  tiempoServicio?: string,
  creadoPor?: number
): Promise<number> {
  const now = new Date()
  const tipo = tipoDocumento || 'Orden de Servicio'
  const nuevaOrden: Omit<OrdenOperativa, 'id' | 'createdAt' | 'updatedAt' | 'eliminada' | 'versionActual'> = {
    nroDocumento,
    tipoDocumento: tipo as any,
    tipoServicio,
    nombreDocumento,
    nombreServicio,
    unidadSolicitadaId: unidadId,
    fechaInicioPlan: fechaInicioPlan || now,
    fechaFinPlan: fechaFinPlan || null,
    horaInicioPlan: horaInicioPlan || null,
    horaFinPlan: horaFinPlan || null,
    planMoviles: planMoviles || 0,
    planMotos: planMotos || 0,
    planSsoo: planSsoo || 0,
    planPpssMovil: planPpssMovil || 0,
    planPieTierra: planPieTierra || 0,
    planMotosBiTripuladas: planMotosBiTripuladas || 0,
    planHipos: planHipos || 0,
    planHidro: planHidro || 0,
    planChoqueApost: planChoqueApost || 0,
    planChoqueAlerta: planChoqueAlerta || 0,
    planTotalPersonal: planTotalPersonal || 0,
    departamento,
    seccional,
    tiempoServicio,
    estado: 'Pendiente',
    creadoPor
  }

  return create(nuevaOrden)
}

// ✅ Parsear fecha/hora desde CSV
function parseDateTimeFromCSV(fechaStr: string, horaStr: string): Date | undefined {
  if (!fechaStr) return undefined
  
  try {
    let dia, mes, anio
    if (fechaStr.includes('/')) {
      [dia, mes, anio] = fechaStr.split('/').map(n => parseInt(n))
    } else {
      [anio, mes, dia] = fechaStr.split('-').map(n => parseInt(n))
    }
    const [hora, minuto] = (horaStr || '00:00').split(':').map(n => parseInt(n))
    
    if (isNaN(dia) || isNaN(mes) || isNaN(anio)) return undefined
    
    return new Date(anio, mes - 1, dia, hora || 0, minuto || 0)
  } catch {
    return undefined
  }
}

// ✅ Mapeo de headers CSV
const HEADER_ALIASES: Record<string, string[]> = {
  nrodocumento: ['nrodocumento', 'nro_documento', 'documento', 'orden'],
  tipodocumento: ['tipodocumento', 'tipo_documento', 'tipo'],
  tiposervicio: ['tiposervicio', 'tipo_servicio'],
  nombredocumento: ['nombredocumento', 'nombre_documento'],
  nombreservicio: ['nombreservicio', 'nombre_servicio'],
  departamento: ['departamento', 'depto', 'departamento_id'],
  tiemposervicio: ['tiemposervicio', 'tiempo_servicio'],
  seccional: ['seccional', 'secc', 'seccional_id'],
  unidad: ['unidad', 'unidad_reportante', 'unidad_id', 'destino'],
  moviles: ['moviles', 'movil', 'patrulleros', 'autos'],
  motos: ['motos', 'motocicletas'],
  ssoo: ['ssoo', 'oficiales'],
  ppss: ['ppss', 'ppssmovil', 'ppssenmovil', 'personal_subalterno'],
  pietierra: ['pietierra', 'pie_tierra', 'personal_pie'],
  motosbitripuladas: ['motosbitripuladas', 'motos_bitripuladas', 'motos_bi_tripuladas', 'bitripuladas'],
  hipos: ['hipos', 'caballos', 'caballeria'],
  choqueapostado: ['choqueapostado', 'choque_apostado'],
  choquealerta: ['choquealerta', 'choque_alerta', 'choqueenalerta'],
  hidro: ['hidro', 'hidrante', 'hidrantes', 'agua', 'camion_agua'],
  totalefectivos: ['totalefectivos', 'total_efectivos', 'total', 'total_personal'],
  fechainicioplan: ['fechainicioplan', 'fecha_inicio_plan', 'fechainicio', 'fecha_inicio', 'fecha'],
  horainicioplan: ['horainicioplan', 'hora_inicio_plan', 'horainicio', 'hora_inicio'],
  fechafinplan: ['fechafinplan', 'fecha_fin_plan', 'fechafin', 'fecha_fin'],
  horafinplan: ['horafinplan', 'hora_fin_plan', 'horafin', 'hora_fin'],
  estado: ['estado', 'estado_real', 'status']
}

function detectSeparator(line: string): string {
  const tabCount = (line.match(/\t/g) || []).length
  const commaCount = (line.match(/,/g) || []).length
  const semicolonCount = (line.match(/;/g) || []).length
  
  if (tabCount > commaCount && tabCount > semicolonCount) return '\t'
  if (semicolonCount > commaCount) return ';'
  return ','
}

function normalizeHeader(header: string): string {
  const normalized = header.trim().toLowerCase().replace(/[\s-]/g, '')
  for (const [canonical, aliases] of Object.entries(HEADER_ALIASES)) {
    if (aliases.includes(normalized)) return canonical
  }
  return normalized
}

// ✅ Importar CSV
async function importFromCSV(csvText: string): Promise<ImportResult> {
  const errores: { fila: number; error: string }[] = []
  let importados = 0
  const lineas = csvText.trim().split('\n')
  if (lineas.length < 2) {
    return { total: 0, importados: 0, errores: [{ fila: 1, error: 'Archivo vacío o sin datos' }] }
  }
  const separator = detectSeparator(lineas[0])
  const headers = lineas[0].split(separator).map(h => normalizeHeader(h.trim()))
  for (let i = 1; i < lineas.length; i++) {
    const linea = lineas[i].trim()
    if (!linea) continue
    try {
      const valores = linea.split(separator).map(v => v.trim())
      const fila: Record<string, string> = {}
      headers.forEach((h, idx) => { fila[h] = valores[idx] || '' })
      const nroDoc = fila.nrodocumento
      if (!nroDoc) {
        errores.push({ fila: i + 1, error: 'Nro de Orden/Documento es requerido' })
        continue
      }
      const unidadId = await buscarOCrearUnidad(fila.unidad || 'Sin Unidad')
      
      const fechaInicio = parseDateTimeFromCSV(fila.fechainicioplan, fila.horainicioplan)
      const fechaFin = parseDateTimeFromCSV(fila.fechafinplan, fila.horafinplan)

      await crearOrden(
        nroDoc, 
        unidadId, 
        fila.tipodocumento,
        fila.tiposervicio,
        fila.nombredocumento,
        fila.nombreservicio,
        fechaInicio,
        fechaFin,
        fila.horainicioplan || null,
        fila.horafinplan || null,
        parseInt(fila.moviles) || 0,
        parseInt(fila.motos) || 0,
        parseInt(fila.ssoo) || 0,
        parseInt(fila.ppss) || 0,
        parseInt(fila.pietierra) || 0,
        parseInt(fila.motosbitripuladas) || 0,
        parseInt(fila.hipos) || 0,
        parseInt(fila.choqueapostado) || 0,
        parseInt(fila.choquealerta) || 0,
        parseInt(fila.totalefectivos) || 0,
        parseInt(fila.hidro) || 0,
        fila.departamento,
        fila.seccional,
        fila.tiemposervicio
      )
      importados++
    } catch (error) {
      errores.push({ fila: i + 1, error: error instanceof Error ? error.message : 'Error desconocido' })
    }
  }
  return { total: lineas.length - 1, importados, errores }
}

export const esmapoService = {
  getAll,
  getById,
  create,
  update,
  softDelete,
  hardDelete,
  getHistorial,
  getVersionEspecifica,
  importFromCSV,
  buscarOCrearUnidad,
  crearOrden
}

