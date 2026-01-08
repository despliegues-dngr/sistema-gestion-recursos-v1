/**
 * Servicio de Reportes de Despliegue
 * Gestiona los reportes diarios de ejecución de órdenes operativas
 */
import { db } from '@lib/db'
import type { ReporteDespliegue, OrdenOperativa, Unidad } from '@lib/types'

export interface ReporteDespliegueConRelaciones extends ReporteDespliegue {
  orden?: OrdenOperativa
  unidad?: Unidad
}

export interface DiaDespliegue {
  ordenId: number
  fecha: Date
  orden?: OrdenOperativa
  reporte?: ReporteDespliegue
}

// ✅ Generar días de despliegue para una orden operativa (Lógica KISS v7.0)
function generarDiasDespliegue(orden: OrdenOperativa, fechaHasta: Date): Date[] {
  const dias: Date[] = []
  
  // Normalizar fechas (solo fecha, sin hora)
  const inicio = new Date(orden.fechaInicioPlan)
  inicio.setHours(0, 0, 0, 0)
  
  const limite = new Date(fechaHasta)
  limite.setHours(0, 0, 0, 0)
  
  // Determinar hasta qué día generar
  let hasta: Date
  if (orden.fechaFinPlan) {
    const fin = new Date(orden.fechaFinPlan)
    fin.setHours(0, 0, 0, 0)
    // Usar el menor entre fechaFin y límite (ayer)
    hasta = fin < limite ? fin : limite
  } else {
    // Sin fecha fin = operativo vigente, generar hasta límite (ayer)
    hasta = limite
  }
  
  // Generar días desde inicio hasta "hasta" (inclusivo)
  const actual = new Date(inicio)
  while (actual <= hasta) {
    dias.push(new Date(actual))
    actual.setDate(actual.getDate() + 1)
  }
  
  return dias
}

// ✅ Obtener despliegues SIN CARGAR para una unidad
async function getSinCargar(unidadId: number): Promise<DiaDespliegue[]> {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  
  const ayer = new Date(hoy)
  ayer.setDate(ayer.getDate() - 1)
  
  // Obtener todas las órdenes activas de la unidad
  const ordenes = (await db.ordenes_operativas
    .where('unidadSolicitadaId')
    .equals(unidadId)
    .toArray()).filter(o => !o.eliminada)
  
  // Obtener todos los reportes de la unidad
  const reportes = await db.reportes_despliegue
    .where('unidadReportanteId')
    .equals(unidadId)
    .toArray()
  
  const resultado: DiaDespliegue[] = []
  
  for (const orden of ordenes) {
    const dias = generarDiasDespliegue(orden, ayer)
    
    for (const dia of dias) {
      // Verificar si existe reporte para este día
      const tieneReporte = reportes.some(r => {
        const fechaReporte = new Date(r.fechaDespliegue)
        fechaReporte.setHours(0, 0, 0, 0)
        return r.ordenId === orden.id && fechaReporte.getTime() === dia.getTime()
      })
      
      if (!tieneReporte) {
        resultado.push({
          ordenId: orden.id!,
          fecha: dia,
          orden
        })
      }
    }
  }
  
  // Ordenar por fecha ascendente (más antiguos primero)
  return resultado.sort((a, b) => a.fecha.getTime() - b.fecha.getTime())
}

// ✅ Obtener despliegues PARA HOY para una unidad
async function getParaHoy(unidadId: number): Promise<DiaDespliegue[]> {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  
  const ordenes = (await db.ordenes_operativas
    .where('unidadSolicitadaId')
    .equals(unidadId)
    .toArray()).filter(o => !o.eliminada)
  
  const reportes = await db.reportes_despliegue
    .where('unidadReportanteId')
    .equals(unidadId)
    .toArray()
  
  const resultado: DiaDespliegue[] = []
  
  for (const orden of ordenes) {
    const inicio = new Date(orden.fechaInicioPlan)
    inicio.setHours(0, 0, 0, 0)
    
    // ✅ CORRECCIÓN: Manejar fechaFinPlan null/undefined correctamente
    let fin: Date
    if (orden.fechaFinPlan) {
      fin = new Date(orden.fechaFinPlan)
      fin.setHours(0, 0, 0, 0)
    } else {
      // Operativos sin fecha fin están vigentes indefinidamente
      fin = new Date('2099-12-31')
      fin.setHours(0, 0, 0, 0)
    }
    
    // Verificar si hoy está en el rango
    if (hoy >= inicio && hoy <= fin) {
      // Verificar si ya tiene reporte para hoy
      const tieneReporte = reportes.some(r => {
        const fechaReporte = new Date(r.fechaDespliegue)
        fechaReporte.setHours(0, 0, 0, 0)
        return r.ordenId === orden.id && fechaReporte.getTime() === hoy.getTime()
      })
      
      if (!tieneReporte) {
        resultado.push({
          ordenId: orden.id!,
          fecha: hoy,
          orden
        })
      }
    }
  }
  
  return resultado
}

// ✅ Obtener despliegues CARGADOS HOY para una unidad
async function getCargadosHoy(unidadId: number): Promise<ReporteDespliegueConRelaciones[]> {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  
  const reportes = await db.reportes_despliegue
    .where('unidadReportanteId')
    .equals(unidadId)
    .toArray()
  
  const reportesHoy = reportes.filter(r => {
    const fechaReporte = new Date(r.fechaDespliegue)
    fechaReporte.setHours(0, 0, 0, 0)
    return fechaReporte.getTime() === hoy.getTime()
  })
  
  // Enriquecer con relaciones
  const resultado: ReporteDespliegueConRelaciones[] = []
  for (const reporte of reportesHoy) {
    const orden = await db.ordenes_operativas.get(reporte.ordenId)
    const unidad = await db.unidades.get(reporte.unidadReportanteId)
    resultado.push({ ...reporte, orden, unidad })
  }
  
  return resultado
}

// ✅ Obtener HISTORIAL de despliegues para una unidad
async function getHistorial(unidadId: number): Promise<ReporteDespliegueConRelaciones[]> {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  
  const reportes = await db.reportes_despliegue
    .where('unidadReportanteId')
    .equals(unidadId)
    .toArray()
  
  const reportesAnteriores = reportes.filter(r => {
    const fechaReporte = new Date(r.fechaDespliegue)
    fechaReporte.setHours(0, 0, 0, 0)
    return fechaReporte.getTime() < hoy.getTime()
  })
  
  // Enriquecer con relaciones
  const resultado: ReporteDespliegueConRelaciones[] = []
  for (const reporte of reportesAnteriores) {
    const orden = await db.ordenes_operativas.get(reporte.ordenId)
    const unidad = await db.unidades.get(reporte.unidadReportanteId)
    resultado.push({ ...reporte, orden, unidad })
  }
  
  // Ordenar por fecha descendente (más recientes primero)
  return resultado.sort((a, b) => 
    new Date(b.fechaDespliegue).getTime() - new Date(a.fechaDespliegue).getTime()
  )
}

// ✅ Crear reporte de despliegue
async function create(data: Omit<ReporteDespliegue, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
  const now = new Date()
  
  // 1. Obtener la orden operativa para capturar snapshot
  const orden = await db.ordenes_operativas.get(data.ordenId)
  
  if (!orden) {
    throw new Error('Orden operativa no encontrada')
  }

  return db.reportes_despliegue.add({
    ...data,
    // Snapshot de planificación (congelado v14)
    refPlanMoviles: orden.planMoviles,
    refPlanMotos: orden.planMotos,
    refPlanSsoo: orden.planSsoo,
    refPlanPpssMovil: orden.planPpssMovil,
    refPlanPieTierra: orden.planPieTierra,
    refPlanMotosBiTripuladas: orden.planMotosBiTripuladas,
    refPlanHidro: orden.planHidro,
    refPlanHipos: orden.planHipos,
    refPlanChoqueApost: orden.planChoqueApost,
    refPlanChoqueAlerta: orden.planChoqueAlerta,
    refPlanTotalPersonal: orden.planTotalPersonal,
    fechaHoraCarga: now,
    createdAt: now,
    updatedAt: now
  } as ReporteDespliegue)
}

// ✅ Actualizar reporte
async function update(id: number, data: Partial<ReporteDespliegue>): Promise<number> {
  // Excluir campos refPlan* de la actualización para proteger el snapshot original
  const { 
    refPlanMoviles, 
    refPlanMotos, 
    refPlanSsoo,
    refPlanPpssMovil,
    refPlanPieTierra,
    refPlanMotosBiTripuladas,
    refPlanHidro,
    refPlanHipos,
    refPlanChoqueApost,
    refPlanChoqueAlerta,
    refPlanTotalPersonal,
    ...datosActualizables 
  } = data

  return db.reportes_despliegue.update(id, {
    ...datosActualizables,
    updatedAt: new Date()
  })
}

// ✅ Obtener reporte por ID
async function getById(id: number): Promise<ReporteDespliegueConRelaciones | undefined> {
  const reporte = await db.reportes_despliegue.get(id)
  if (!reporte) return undefined
  const orden = reporte.ordenId ? await db.ordenes_operativas.get(reporte.ordenId) : undefined
  const unidad = reporte.unidadReportanteId ? await db.unidades.get(reporte.unidadReportanteId) : undefined
  return { ...reporte, orden, unidad }
}

// ✅ Eliminar reporte
async function remove(id: number): Promise<void> {
  await db.reportes_despliegue.delete(id)
}

// ✅ Verificar si un reporte se puede editar (Período de gracia: mismo día de carga)
function puedeEditarReporte(reporte: ReporteDespliegue): boolean {
  if (!reporte.fechaHoraCarga) return false
  
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  
  const fechaCarga = new Date(reporte.fechaHoraCarga)
  fechaCarga.setHours(0, 0, 0, 0)
  
  // Solo editable el mismo día de creación
  return fechaCarga.getTime() === hoy.getTime()
}

export const desplieguesService = {
  getSinCargar,
  getParaHoy,
  getCargadosHoy,
  getHistorial,
  create,
  update,
  getById,
  remove,
  puedeEditarReporte
}
