/**
 * Datos semilla para demo/desarrollo
 */

import { db } from './index';

export async function seedDatabase(): Promise<boolean> {
  try {
    const rolesCount = await db.roles.count();
    if (rolesCount === 0) {
      
      const rolDireccionId = await db.roles.add({
        nombre: 'direccion_vi',
        descripcion: 'Dirección VI',
        permisos: ['*']
      });

      await db.roles.bulkAdd([
        {
          nombre: 'jefe_unidad',
          descripcion: 'Jefe de Unidad',
          permisos: ['personal:read', 'personal:write', 'horarios:read', 'horarios:write']
        },
        {
          nombre: 'estado_mayor',
          descripcion: 'Estado Mayor',
          permisos: ['dashboard:read', 'reportes:read']
        }
      ]);

      await db.grados.bulkAdd([
        { nombre: 'Comandante General', nivel: 1 },
        { nombre: 'Subcomandante General', nivel: 2 },
        { nombre: 'Inspector General', nivel: 3 },
        { nombre: 'Subinspector General', nivel: 4 },
        { nombre: 'Comisario General', nivel: 5 },
        { nombre: 'Comisario Mayor', nivel: 6 },
        { nombre: 'Comisario', nivel: 7 },
        { nombre: 'Subcomisario', nivel: 8 },
        { nombre: 'Oficial Principal', nivel: 9 },
        { nombre: 'Oficial Ayudante', nivel: 10 },
        { nombre: 'Oficial Subayudante', nivel: 11 }
      ]);

      await db.unidades.bulkAdd([
        { nombre: 'Dirección Nacional', tipo: 'administrativa' },
        { nombre: 'Jefatura de Policía', tipo: 'administrativa' },
        { nombre: 'Unidad Operativa Central', tipo: 'operativa' },
        { nombre: 'Unidad Operativa Norte', tipo: 'operativa' },
        { nombre: 'Unidad Operativa Sur', tipo: 'operativa' }
      ]);

      await db.escalafones.bulkAdd([
        { nombre: 'Ejecutivo', nivel: 1 },
        { nombre: 'Administrativo', nivel: 2 },
        { nombre: 'Técnico', nivel: 3 }
      ]);

      await db.turnos.bulkAdd([
        { nombre: 'Mañana', horaInicio: '06:00', horaFin: '14:00' },
        { nombre: 'Tarde', horaInicio: '14:00', horaFin: '22:00' },
        { nombre: 'Noche', horaInicio: '22:00', horaFin: '06:00' }
      ]);

      await db.tipos_regimen.bulkAdd([
        { nombre: 'Régimen A', descripcion: 'Régimen estándar operativo', activo: true },
        { nombre: 'Régimen B', descripcion: 'Régimen administrativo', activo: true }
      ]);

      await db.tipos_licencia.bulkAdd([
        { nombre: 'Anuales Policiales', descripcion: 'Licencia anual policial', requiereAprobacion: false, activo: true },
        { nombre: 'Extraordinarias', descripcion: 'Licencia extraordinaria', requiereAprobacion: true, activo: true },
        { nombre: 'Por Parte Médico', descripcion: 'Licencia médica', requiereAprobacion: false, activo: true },
        { nombre: 'Maternal', descripcion: 'Licencia maternal', requiereAprobacion: false, activo: true }
      ]);

      await db.usuarios.add({
        username: 'admin',
        password: 'admin123',
        rolId: rolDireccionId,
        estado: 'activo'
      });
    }

    // Seed independiente para TIPOS_CURSO (si está vacío)
    const cursosCount = await db.tipos_curso.count();
    if (cursosCount === 0) {
      await db.tipos_curso.bulkAdd([
        { nombre: 'C.O.E.', descripcion: 'Cuerpo de Operaciones Especiales', activo: true },
        { nombre: 'PUMA', descripcion: 'Programa Unificado de Movilidad Avanzada', activo: true },
        { nombre: 'Antidisturbio', descripcion: 'Control de disturbios civiles', activo: true },
        { nombre: 'Caballería', descripcion: 'Unidad de caballería policial', activo: true }
      ]);
    }

    return true;
  } catch (error) {
    return false;
  }
}
