/**
 * Servicio de Cursos
 * 
 * CRUD para cursos de capacitación de funcionarios.
 */

import { db } from '@lib/db'
import type { Curso, TipoCurso } from '@lib/types'

export interface CursoConTipo extends Curso {
  tipo?: TipoCurso
}

async function getByFuncionario(funcionarioId: number): Promise<CursoConTipo[]> {
  const cursos = await db.cursos
    .where('funcionarioId')
    .equals(funcionarioId)
    .reverse()
    .sortBy('fechaInicio')
  
  const tipos = await db.tipos_curso.toArray()
  
  return cursos.map(c => ({
    ...c,
    tipo: tipos.find(t => t.id === Number(c.tipoCursoId))
  }))
}

async function getTipos(): Promise<TipoCurso[]> {
  return db.tipos_curso.filter(t => t.activo).toArray()
}

async function create(data: Omit<Curso, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
  const now = new Date()
  return db.cursos.add({
    ...data,
    createdAt: now,
    updatedAt: now
  } as Curso)
}

async function update(id: number, data: Partial<Curso>): Promise<number> {
  return db.cursos.update(id, {
    ...data,
    updatedAt: new Date()
  })
}

async function remove(id: number): Promise<void> {
  await db.cursos.delete(id)
}

// AI-Hint: Servicio modular para gestión de cursos | CRUD completo sobre IndexedDB | Reclica patrón de licenciasService
export const cursosService = {
  getByFuncionario,
  getTipos,
  create,
  update,
  remove
}

