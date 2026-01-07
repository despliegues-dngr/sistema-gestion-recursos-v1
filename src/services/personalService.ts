/**
 * Servicio de Personal
 * 
 * CRUD y operaciones de importación CSV para funcionarios.
 */

import { db } from '@lib/db'
import type { Funcionario, Grado, Unidad, SubUnidad, Escalafon, TipoRegimen } from '@lib/types'

export interface FuncionarioConRelaciones extends Funcionario {
  grado?: Grado
  unidad?: Unidad
  subUnidad?: SubUnidad
  escalafon?: Escalafon
  regimen?: TipoRegimen
}

export interface ImportResult {
  total: number
  importados: number
  errores: { fila: number; error: string }[]
}

async function getAll(): Promise<FuncionarioConRelaciones[]> {
  const funcionarios = await db.funcionarios.toArray()
  const grados = await db.grados.toArray()
  const unidades = await db.unidades.toArray()
  const subUnidades = await db.sub_unidades.toArray()
  const escalafones = await db.escalafones.toArray()
  const regimenes = await db.tipos_regimen.toArray()

  return funcionarios.map(f => ({
    ...f,
    grado: grados.find(g => g.id === f.gradoId),
    unidad: unidades.find(u => u.id === f.unidadId),
    subUnidad: subUnidades.find(su => su.id === f.subUnidadId),
    escalafon: escalafones.find(e => e.id === f.escalafonId),
    regimen: regimenes.find(r => r.id === f.regimenId)
  }))
}

async function getById(id: number): Promise<FuncionarioConRelaciones | undefined> {
  const funcionario = await db.funcionarios.get(id)
  if (!funcionario) return undefined

  const grado = funcionario.gradoId ? await db.grados.get(funcionario.gradoId) : undefined
  const unidad = funcionario.unidadId ? await db.unidades.get(funcionario.unidadId) : undefined
  const subUnidad = funcionario.subUnidadId ? await db.sub_unidades.get(funcionario.subUnidadId) : undefined
  const escalafon = funcionario.escalafonId ? await db.escalafones.get(funcionario.escalafonId) : undefined
  const regimen = funcionario.regimenId ? await db.tipos_regimen.get(funcionario.regimenId) : undefined

  return { ...funcionario, grado, unidad, subUnidad, escalafon, regimen }
}

async function getByCedula(ci: string): Promise<Funcionario | undefined> {
  return db.funcionarios.where('ci').equals(ci).first()
}

// AI-Hint: Filtrar funcionarios por unidad | unidadSlug se mapea a nombre de unidad | Busca unidad por nombre y filtra funcionarios
async function getByUnidad(unidadSlug: string): Promise<FuncionarioConRelaciones[]> {
  // Importar mapeo de unidades
  const { unitDisplayNames } = await import('@config')
  
  const unidadNombre = unitDisplayNames[unidadSlug]
  if (!unidadNombre) {
    // Si no se encuentra la unidad, retornar array vacío
    return []
  }

  // Buscar unidad por nombre
  const unidad = await db.unidades
    .filter(u => u.nombre.toLowerCase() === unidadNombre.toLowerCase())
    .first()

  if (!unidad?.id) {
    return []
  }

  // Filtrar funcionarios por unidadId
  const funcionarios = await db.funcionarios
    .where('unidadId')
    .equals(unidad.id)
    .toArray()

  const grados = await db.grados.toArray()
  const unidades = await db.unidades.toArray()
  const subUnidades = await db.sub_unidades.toArray()
  const escalafones = await db.escalafones.toArray()
  const regimenes = await db.tipos_regimen.toArray()

  return funcionarios.map(f => ({
    ...f,
    grado: grados.find(g => g.id === f.gradoId),
    unidad: unidades.find(u => u.id === f.unidadId),
    subUnidad: subUnidades.find(su => su.id === f.subUnidadId),
    escalafon: escalafones.find(e => e.id === f.escalafonId),
    regimen: regimenes.find(r => r.id === f.regimenId)
  }))
}

async function create(data: Omit<Funcionario, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
  const now = new Date()
  return db.funcionarios.add({
    ...data,
    createdAt: now,
    updatedAt: now
  } as Funcionario)
}

async function update(id: number, data: Partial<Funcionario>): Promise<number> {
  return db.funcionarios.update(id, {
    ...data,
    updatedAt: new Date()
  })
}

async function remove(id: number): Promise<void> {
  await db.funcionarios.delete(id)
}

async function buscarOCrearGrado(nombre: string): Promise<number> {
  const existente = await db.grados
    .filter(g => g.nombre.toLowerCase() === nombre.toLowerCase())
    .first()

  if (existente?.id) return existente.id

  const grados = await db.grados.toArray()
  const maxNivel = Math.max(...grados.map(g => g.nivel), 0)

  return db.grados.add({
    nombre,
    nivel: maxNivel + 1,
    createdAt: new Date(),
    updatedAt: new Date()
  } as Grado)
}

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

async function buscarOCrearEscalafon(nombre: string): Promise<number> {
  const existente = await db.escalafones
    .filter(e => e.nombre.toLowerCase() === nombre.toLowerCase())
    .first()

  if (existente?.id) return existente.id

  const escalafones = await db.escalafones.toArray()
  const maxNivel = Math.max(...escalafones.map(e => e.nivel), 0)

  return db.escalafones.add({
    nombre,
    nivel: maxNivel + 1,
    createdAt: new Date(),
    updatedAt: new Date()
  } as Escalafon)
}

// AI-Hint: Buscar o crear SubUnidad asociada a una Unidad | Si no existe, la crea dinámicamente | Relación foreign key lógica con unidadId
async function buscarOCrearSubUnidad(nombre: string, unidadId: number): Promise<number> {
  const existente = await db.sub_unidades
    .filter(su => su.nombre.toLowerCase() === nombre.toLowerCase() && su.unidadId === unidadId)
    .first()

  if (existente?.id) return existente.id

  return db.sub_unidades.add({
    nombre,
    unidadId,
    activa: true,
    createdAt: new Date(),
    updatedAt: new Date()
  } as SubUnidad)
}

// AI-Hint: Buscar o crear Régimen | Si no existe, la crea dinámicamente | Necesario para mapeo desde CSV
async function buscarOCrearRegimen(nombre: string): Promise<number> {
  const existente = await db.tipos_regimen
    .filter(r => r.nombre.toLowerCase() === nombre.toLowerCase())
    .first()
  
  if (existente?.id) return existente.id
  
  return db.tipos_regimen.add({
    nombre,
    activo: true,
    createdAt: new Date(),
    updatedAt: new Date()
  } as TipoRegimen)
}

function parseDate(dateStr: string): Date {
  if (!dateStr) return new Date()
  
  const parts = dateStr.split('-')
  if (parts.length === 3) {
    return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]))
  }
  
  return new Date(dateStr)
}

const HEADER_ALIASES: Record<string, string[]> = {
  ci: ['ci', 'documento', 'cedula', 'cedula_identidad', 'doc'],
  nombre: ['nombre', 'primernombre', 'primer_nombre', 'nombres', 'name'],
  apellido: ['apellido', 'primerapellido', 'primer_apellido', 'apellidos', 'lastname'],
  grado: ['grado', 'rango', 'rank'],
  unidad: ['unidad', 'unidad_destino', 'destino', 'unit'],
  subunidad: ['subunidad', 'sub_unidad', 'subUnidad'],
  escalafon: ['escalafon', 'subescalafon', 'sub_escalafon', 'categoria'],
  fechaingreso: ['fechaingreso', 'fecha_ingreso'],
  estado: ['estado', 'status', 'activo'],
  segundonombre: ['segundonombre', 'segundo_nombre'],
  segundoapellido: ['segundoapellido', 'segundo_apellido'],
  // AI-Hint: Nuevos aliases para campos laborales agregados en version(4)
  tarea: ['tarea', 'funcion', 'cargo_funcional'],
  regimen: ['regimen', 'tipo_regimen', 'tiporegimen'],
  horaingreso: ['horaingreso', 'hora_ingreso', 'ingreso', 'entrada'],
  horasalida: ['horasalida', 'hora_salida', 'salida'],
  realiza222: ['realiza222', 'art222', 'articulo222'],
  fechainicioturno: ['fechainicioturno', 'fecha_inicio_turno', 'fechainicio', 'fecha_inicio', 'iniciociclo', 'inicio_ciclo']
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
    if (aliases.includes(normalized)) {
      return canonical
    }
  }
  return normalized
}

async function importFromCSV(csvText: string): Promise<ImportResult> {
  const errores: { fila: number; error: string }[] = []
  let importados = 0

  const lineas = csvText.trim().split('\n')
  if (lineas.length < 2) {
    return { total: 0, importados: 0, errores: [{ fila: 1, error: 'Archivo vacío o sin datos' }] }
  }

  const separator = detectSeparator(lineas[0])
  const rawHeaders = lineas[0].split(separator).map(h => h.trim())
  const headers = rawHeaders.map(normalizeHeader)

  const headersRequeridos = ['ci', 'nombre', 'apellido', 'grado', 'unidad']
  const faltantes = headersRequeridos.filter(req => !headers.includes(req))
  
  if (faltantes.length > 0) {
    return {
      total: 0,
      importados: 0,
      errores: [{ fila: 1, error: `Headers faltantes: ${faltantes.join(', ')}. Headers detectados: ${headers.join(', ')}` }]
    }
  }

  for (let i = 1; i < lineas.length; i++) {
    const linea = lineas[i].trim()
    if (!linea) continue

    try {
      const valores = linea.split(separator).map(v => v.trim())
      const fila: Record<string, string> = {}
      
      headers.forEach((header, index) => {
        fila[header] = valores[index] || ''
      })

      if (!fila.ci) {
        errores.push({ fila: i + 1, error: 'CI/Documento es requerido' })
        continue
      }

      const existente = await getByCedula(fila.ci)
      if (existente) {
        errores.push({ fila: i + 1, error: `CI ${fila.ci} ya existe` })
        continue
      }

      const gradoId = await buscarOCrearGrado(fila.grado || 'Sin Grado')
      const unidadId = await buscarOCrearUnidad(fila.unidad || 'Sin Unidad')
      const subUnidadId = fila.subunidad 
        ? await buscarOCrearSubUnidad(fila.subunidad, unidadId)
        : undefined
      const escalafonId = fila.escalafon 
        ? await buscarOCrearEscalafon(fila.escalafon)
        : undefined
      const regimenId = fila.regimen 
        ? await buscarOCrearRegimen(fila.regimen)
        : undefined

      // AI-Hint: Combinar nombre y apellido en nombre_completo según nueva estructura
      const nombreCompleto = [
        fila.nombre,
        fila.segundonombre,
        fila.apellido,
        fila.segundoapellido
      ].filter(Boolean).join(' ') || 'Sin Nombre'

      await create({
        ci: fila.ci,
        nombre_completo: nombreCompleto,
        gradoId,
        unidadId,
        subUnidadId,
        escalafonId,
        regimenId,
        fechaIngreso: parseDate(fila.fechaingreso || ''),
        // AI-Hint: Campos laborales agregados en version(4) | Mapeo desde CSV con valores opcionales
        tarea: fila.tarea || undefined,
        horaIngreso: fila.horaingreso || undefined,
        horaSalida: fila.horasalida || undefined,
        realiza222: fila.realiza222?.toLowerCase() === 'si' || fila.realiza222?.toLowerCase() === 'sí',
        fechaInicioTurno: fila.fechainicioturno ? parseDate(fila.fechainicioturno) : undefined
      })

      importados++
    } catch (error) {
      errores.push({ 
        fila: i + 1, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      })
    }
  }

  return {
    total: lineas.length - 1,
    importados,
    errores
  }
}

async function getStats() {
  const total = await db.funcionarios.count()
  return { total }
}

// AI-Hint: Obtener datos para formulario | Carga todas las opciones de selects necesarias | Reutilizable para crear/editar
async function getFormData() {
  const turnos = await db.turnos.toArray()
  const regimenes = await db.tipos_regimen.filter(r => r.activo).toArray()
  const grados = await db.grados.orderBy('nivel').toArray()
  const unidades = await db.unidades.toArray()
  const subUnidades = await db.sub_unidades.toArray()
  const escalafones = await db.escalafones.orderBy('nivel').toArray()
  
  return { turnos, regimenes, grados, unidades, subUnidades, escalafones }
}

// AI-Hint: Transferir funcionario a otra unidad con registro de historial | Registra movimiento antes de actualizar unidad | Permite trazabilidad completa
async function transferirUnidad(
  funcionarioId: number,
  unidadDestinoId: number,
  motivo?: string,
  creadoPor?: number
): Promise<void> {
  const funcionario = await db.funcionarios.get(funcionarioId)
  if (!funcionario) {
    throw new Error('Funcionario no encontrado')
  }
  
  const unidadOrigenId = funcionario.unidadId
  
  // Validar que no sea la misma unidad
  if (unidadOrigenId === unidadDestinoId) {
    throw new Error('La unidad destino debe ser diferente a la unidad actual')
  }
  
  // Registrar en historial
  await db.historial_movimientos.add({
    funcionarioId,
    unidadOrigenId,
    unidadDestinoId,
    fechaCambio: new Date(),
    motivo,
    creadoPor,
    createdAt: new Date(),
    updatedAt: new Date()
  })
  
  // Actualizar funcionario
  await db.funcionarios.update(funcionarioId, {
    unidadId: unidadDestinoId,
    subUnidadId: null, // AI-Hint: Resetear subUnidad al transferir ya que es específica de la unidad
    updatedAt: new Date()
  })
}

// AI-Hint: Obtener historial de movimientos de un funcionario | Incluye datos de unidades origen y destino | Ordenado por fecha descendente
async function getHistorialMovimientos(funcionarioId: number) {
  const movimientos = await db.historial_movimientos
    .where('funcionarioId')
    .equals(funcionarioId)
    .reverse()
    .sortBy('fechaCambio')
  
  const unidades = await db.unidades.toArray()
  
  return movimientos.map(m => ({
    ...m,
    unidadOrigen: unidades.find(u => u.id === m.unidadOrigenId),
    unidadDestino: unidades.find(u => u.id === m.unidadDestinoId)
  }))
}

export const personalService = {
  getAll,
  getById,
  getByCedula,
  getByUnidad,
  create,
  update,
  remove,
  importFromCSV,
  getStats,
  getFormData,
  transferirUnidad,
  getHistorialMovimientos
}
