/**
 * Servicio de Licencias
 * 
 * CRUD para licencias de funcionarios y gestión de tipos de licencia.
 */

import { db } from '@lib/db'
import type { LicenciaFuncionario, TipoLicencia } from '@lib/types'

export interface LicenciaConTipo extends LicenciaFuncionario {
  tipo?: TipoLicencia
}

async function getByFuncionario(funcionarioId: number): Promise<LicenciaConTipo[]> {
  const licencias = await db.licencias_funcionarios
    .where('funcionarioId')
    .equals(funcionarioId)
    .reverse()
    .sortBy('fechaInicio')
  
  const tipos = await db.tipos_licencia.toArray()
  
  return licencias.map(l => ({
    ...l,
    tipo: tipos.find(t => t.id === Number(l.tipoLicenciaId))
  }))
}

async function getTipos(): Promise<TipoLicencia[]> {
  return db.tipos_licencia.filter(t => t.activo).toArray()
}

async function create(data: Omit<LicenciaFuncionario, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
  const now = new Date()
  return db.licencias_funcionarios.add({
    ...data,
    createdAt: now,
    updatedAt: now
  } as LicenciaFuncionario)
}

async function update(id: number, data: Partial<LicenciaFuncionario>): Promise<number> {
  return db.licencias_funcionarios.update(id, {
    ...data,
    updatedAt: new Date()
  })
}

async function remove(id: number): Promise<void> {
  await db.licencias_funcionarios.delete(id)
}

// AI-Hint: Servicio modular para gestión de licencias | CRUD completo sobre IndexedDB | Mapea tipos de licencia automáticamente
export const licenciasService = {
  getByFuncionario,
  getTipos,
  create,
  update,
  remove
}

