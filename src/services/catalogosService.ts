/**
 * Servicio para gestión de catálogos del sistema
 */
import { db } from '@lib/db';
import type { CatalogoValor, TipoCatalogo } from '@lib/types';

async function getAll(catalogo: TipoCatalogo, soloActivos = true): Promise<CatalogoValor[]> {
  // Manejo especial para catálogos que ya tienen sus propias tablas
  if (catalogo === 'grado') {
    const records = await db.grados.toArray();
    return records.map(r => ({ catalogo: 'grado', nombre: r.nombre, activo: true, id: r.id }));
  }
  if (catalogo === 'unidad') {
    const records = await db.unidades.toArray();
    return records.map(r => ({ catalogo: 'unidad', nombre: r.nombre, activo: true, id: r.id }));
  }
  if (catalogo === 'escalafon') {
    const records = await db.escalafones.toArray();
    return records.map(r => ({ catalogo: 'escalafon', nombre: r.nombre, activo: true, id: r.id }));
  }
  if (catalogo === 'tipo_licencia') {
    const records = await db.tipos_licencia.toArray();
    return records.map(r => ({ catalogo: 'tipo_licencia', nombre: r.nombre, activo: r.activo, id: r.id }));
  }
  if (catalogo === 'tipo_curso') {
    const records = await db.tipos_curso.toArray();
    return records.map(r => ({ catalogo: 'tipo_curso', nombre: r.nombre, activo: r.activo, id: r.id }));
  }
  if (catalogo === 'turno') {
    const records = await db.turnos.toArray();
    return records.map(r => ({ catalogo: 'turno', nombre: r.nombre, activo: true, id: r.id }));
  }
  if (catalogo === 'regimen') {
    const records = await db.tipos_regimen.toArray();
    return records.map(r => ({ catalogo: 'regimen', nombre: r.nombre, activo: r.activo, id: r.id }));
  }

  // Catálogos en la nueva tabla catalogos_valores
  let query = db.catalogos_valores.where('catalogo').equals(catalogo);
  
  if (soloActivos) {
    const todos = await query.toArray();
    return todos.filter(c => c.activo).sort((a, b) => (a.orden || 0) - (b.orden || 0));
  }
  
  return query.sortBy('orden');
}

async function getById(id: number): Promise<CatalogoValor | undefined> {
  return db.catalogos_valores.get(id);
}

async function crear(data: Omit<CatalogoValor, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
  // Validar duplicados (case-insensitive)
  const existe = await db.catalogos_valores
    .where('catalogo')
    .equals(data.catalogo)
    .filter(c => c.nombre.toLowerCase() === data.nombre.toLowerCase())
    .first();

  if (existe) {
    throw new Error(`El valor "${data.nombre}" ya existe en ${data.catalogo}`);
  }

  // Obtener siguiente orden
  const maxOrden = await db.catalogos_valores
    .where('catalogo')
    .equals(data.catalogo)
    .toArray()
    .then(items => Math.max(...items.map(i => i.orden || 0), 0));

  const now = new Date();
  return db.catalogos_valores.add({
    ...data,
    orden: data.orden || maxOrden + 1,
    createdAt: now,
    updatedAt: now
  } as CatalogoValor);
}

async function actualizar(id: number, data: Partial<CatalogoValor>): Promise<void> {
  const actual = await db.catalogos_valores.get(id);
  if (!actual) {
    throw new Error('Catálogo no encontrado');
  }

  // Validar duplicados si se cambia el nombre
  if (data.nombre && data.nombre !== actual.nombre) {
    const existe = await db.catalogos_valores
      .where('catalogo')
      .equals(actual.catalogo)
      .filter(c => c.id !== id && c.nombre.toLowerCase() === data.nombre.toLowerCase())
      .first();

    if (existe) {
      throw new Error(`El valor "${data.nombre}" ya existe`);
    }
  }

  await db.catalogos_valores.update(id, {
    ...data,
    updatedAt: new Date()
  });
}

async function desactivar(id: number): Promise<void> {
  await db.catalogos_valores.update(id, {
    activo: false,
    updatedAt: new Date()
  });
}

async function activar(id: number): Promise<void> {
  await db.catalogos_valores.update(id, {
    activo: true,
    updatedAt: new Date()
  });
}

async function eliminar(id: number): Promise<void> {
  await db.catalogos_valores.delete(id);
}

async function reordenar(catalogo: TipoCatalogo, idsOrdenados: number[]): Promise<void> {
  const updates = idsOrdenados.map((id, index) => 
    db.catalogos_valores.update(id, { orden: index + 1 })
  );
  await Promise.all(updates);
}

// Función auxiliar para obtener opciones formateadas para Select
async function getOptions(catalogo: TipoCatalogo): Promise<Array<{ value: string; label: string }>> {
  const valores = await getAll(catalogo, true);
  return valores.map(v => ({ value: v.nombre, label: v.nombre }));
}

export const catalogosService = {
  getAll,
  getById,
  crear,
  actualizar,
  desactivar,
  activar,
  reordenar,
  getOptions,
  eliminar
};
