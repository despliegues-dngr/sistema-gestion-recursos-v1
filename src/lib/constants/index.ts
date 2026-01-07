/**
 * Constantes globales del sistema DNGR
 */

export const APP_NAME = 'Sistema de Gestión DNGR';
export const APP_VERSION = '2.0.0';

export const ROLES = {
  DIRECCION_VI: 'direccion_vi',
  JEFE_UNIDAD: 'jefe_unidad',
  ESTADO_MAYOR: 'estado_mayor'
} as const;

export const ESTADOS = {
  ACTIVO: 'activo',
  INACTIVO: 'inactivo'
} as const;

export const ESTADOS_SERVICIO = {
  PLANIFICADO: 'planificado',
  EN_CURSO: 'en_curso',
  FINALIZADO: 'finalizado',
  CANCELADO: 'cancelado'
} as const;

export const ESTADOS_ASIGNACION = {
  PENDIENTE: 'pendiente',
  ASIGNADO: 'asignado',
  COMPLETADO: 'completado',
  CANCELADO: 'cancelado'
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
} as const;

export const MESSAGES = {
  SUCCESS: {
    CREATED: 'Registro creado correctamente',
    UPDATED: 'Registro actualizado correctamente',
    DELETED: 'Registro eliminado correctamente'
  },
  ERROR: {
    GENERIC: 'Ha ocurrido un error. Intente nuevamente.',
    NOT_FOUND: 'Registro no encontrado',
    VALIDATION: 'Por favor, complete todos los campos requeridos'
  },
  CONFIRM: {
    DELETE: '¿Está seguro que desea eliminar este registro?'
  }
} as const;
