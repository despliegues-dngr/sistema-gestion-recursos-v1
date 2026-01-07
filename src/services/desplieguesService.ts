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
  
  // Obtener todas las órdenes de la unidad
  const ordenes = await db.ordenes_operativas
    .where('unidadSolicitadaId')
    .equals(unidadId)
    .toArray()
  
  // Obtener todos los reportes de la unidad
  const reportes = await db.reportes_despliegue
    .where('unidadReportanteId')
    .equals(unidadId)
    .toArray()
  
  // 🔍 LOG 1
  console.log('🔍 [getSinCargar] Inicio', {
    unidadId,
    hoy: hoy.toISOString(),
    ayer: ayer.toISOString(),
    totalOrdenes: ordenes.length,
    totalReportes: reportes.length
  })
  
  const resultado: DiaDespliegue[] = []
  
  for (const orden of ordenes) {
    const dias = generarDiasDespliegue(orden, ayer)
    
    // 🔍 LOG 2
    console.log(`📅 [Orden ${orden.id}] Generando días`, {
      ordenId: orden.id,
      nombreServicio: orden.nombreServicio,
      fechaInicioPlan: orden.fechaInicioPlan,
      fechaFinPlan: orden.fechaFinPlan,
      diasGenerados: dias.length,
      primeraFecha: dias[0]?.toISOString(),
      ultimaFecha: dias[dias.length - 1]?.toISOString()
    })
    
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

    // 🔍 LOG 4
    console.log(`✅ [Orden ${orden.id}] Días sin reporte`, {
      ordenId: orden.id,
      diasProcesados: dias.length,
      diasSinReporte: resultado.filter(r => r.ordenId === orden.id).length
    })
  }
  
  // 🔍 LOG 5
  console.log('✨ [getSinCargar] Resultado final', {
    totalRegistros: resultado.length,
    primeraFecha: resultado[0]?.fecha.toISOString(),
    ultimaFecha: resultado[resultado.length - 1]?.fecha.toISOString(),
    ordenesUnicas: new Set(resultado.map(r => r.ordenId)).size
  })
  
  // Ordenar por fecha ascendente (más antiguos primero)
  return resultado.sort((a, b) => a.fecha.getTime() - b.fecha.getTime())
}

// ✅ Obtener despliegues PARA HOY para una unidad
async function getParaHoy(unidadId: number): Promise<DiaDespliegue[]> {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  
  const ordenes = await db.ordenes_operativas
    .where('unidadSolicitadaId')
    .equals(unidadId)
    .toArray()
  
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
  return db.reportes_despliegue.add({
    ...data,
    fechaHoraCarga: now,
    createdAt: now,
    updatedAt: now
  } as ReporteDespliegue)
}

// ✅ Actualizar reporte
async function update(id: number, data: Partial<ReporteDespliegue>): Promise<number> {
  return db.reportes_despliegue.update(id, {
    ...data,
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

export const desplieguesService = {
  getSinCargar,
  getParaHoy,
  getCargadosHoy,
  getHistorial,
  create,
  update,
  getById,
  remove
}
