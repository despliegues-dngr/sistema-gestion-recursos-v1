/**
 * Tipos TypeScript del sistema
 */

export interface Funcionario {
  id?: number;
  ci: string;
  nombre_completo: string;
  gradoId: number;
  unidadId: number;
  subUnidadId?: number;
  turnoId?: number;
  regimenId?: number;
  escalafonId?: number;
  fechaIngreso: Date;
  // AI-Hint: Campos laborales agregados en version(4) | Mapeo desde CSV: tarea, horaIngreso, horaSalida, realiza222
  tarea?: string;
  horaIngreso?: string;
  horaSalida?: string;
  realiza222?: boolean;
  fechaInicioTurno?: Date;
  diasTurno?: string; // JSON: number[]
  diasTurnoExcepciones?: string; // JSON: DiasTurnoDetalle[]
  modificadoPor?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DiasTurnoDetalle {
  dia: number;
  entradaCustom?: string;
  salidaCustom?: string;
}

export interface Grado {
  id?: number;
  nombre: string;
  nivel: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Unidad {
  id?: number;
  nombre: string;
  codigo?: string;
  tipo: string;
  activa?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SubUnidad {
  id?: number;
  nombre: string;
  unidadId: number;
  activa?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Escalafon {
  id?: number;
  nombre: string;
  nivel: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Asignacion {
  id?: number;
  funcionarioId: number;
  servicioId: number;
  fecha: Date;
  estado: 'pendiente' | 'asignado' | 'completado' | 'cancelado';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Usuario {
  id?: number;
  username: string;
  password: string;
  rolId: number;
  unidadId?: number;
  funcionarioId?: number;
  nombreCompleto?: string;
  grado?: string;
  ci?: string;
  estado: 'activo' | 'inactivo';
  ultimoAcceso?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Rol {
  id?: number;
  nombre: 'direccion_vi' | 'jefe_unidad' | 'estado_mayor';
  descripcion: string;
  permisos: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Horario {
  id?: number;
  funcionarioId: number;
  fecha: Date;
  turno: 'mañana' | 'tarde' | 'noche';
  observaciones?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Asistencia {
  id?: number;
  funcionarioId: number;
  fecha: Date;
  estado: 'presente' | 'ausente' | 'justificado' | 'licencia';
  observaciones?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Módulo Personal - Nuevas tablas
export interface Turno {
  id?: number;
  nombre: string;
  horaInicio?: string;
  horaFin?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TipoRegimen {
  id?: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  creadoPor?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TipoLicencia {
  id?: number;
  nombre: string;
  descripcion?: string;
  requiereAprobacion: boolean;
  activo: boolean;
  creadoPor?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TipoCurso {
  id?: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  creadoPor?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LicenciaFuncionario {
  id?: number;
  funcionarioId: number;
  tipoLicenciaId: number;
  fechaInicio: Date;
  fechaFin: Date;
  motivo?: string;
  estado: 'Pendiente' | 'Aprobada' | 'Rechazada' | 'Finalizada';
  creadoPor?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Curso {
  id?: number;
  funcionarioId: number;
  tipoCursoId: number;
  fechaInicio?: Date;
  fechaFin?: Date;
  observaciones?: string;
  creadoPor?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface HistorialMovimiento {
  id?: number;
  funcionarioId: number;
  unidadOrigenId: number;
  unidadDestinoId: number;
  fechaCambio: Date;
  motivo?: string;
  creadoPor?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Módulo Operativos
export interface OrdenOperativa {
  id?: number;
  nroDocumento: string;
  tipoDocumento: 'Orden de Servicio' | 'Circular' | 'Orden de Operaciones';
  tipoServicio?: string;
  nombreDocumento?: string;
  nombreServicio?: string;
  unidadSolicitadaId: number;
  fechaInicioPlan: Date;
  fechaFinPlan?: Date | null;
  horaInicioPlan?: string;
  horaFinPlan?: string;
  lugarObjetivo?: string;
  planMoviles: number;
  planMotos: number;
  planSsoo: number;
  planPpssMovil: number;
  planPieTierra: number;
  planMotosBiTripuladas: number;
  planHidro?: number;
  planHipos: number;
  planChoqueApost: number;
  planChoqueAlerta: number;
  planTotalPersonal: number;
  estado: 'Pendiente' | 'En Proceso' | 'Cumplida Parcial' | 'Cerrada';
  departamento?: string;
  seccional?: string;
  tiempoServicio?: string;
  observaciones?: string;
  creadoPor?: number;
  modificadoPor?: number;
  createdAt?: Date;
  updatedAt?: Date;

  // ✅ NUEVOS CAMPOS SOFT DELETE & VERSIONADO
  eliminada?: boolean;                 // Soft delete flag
  eliminadaAt?: Date;                 // Timestamp de eliminación
  eliminadaPor?: number;              // Usuario que eliminó
  versionActual?: number;              // Versión actual (1, 2, 3...)
}

export interface HistorialOrdenOperativa {
  id?: number;
  ordenId: number;                    // FK a OrdenOperativa
  version: number;                    // 1, 2, 3... (autoincremental por ordenId)
  accion: 'CREATE' | 'UPDATE' | 'DELETE';
  
  // Snapshot completo del estado al momento de la acción
  snapshot: {
    nroDocumento: string;
    tipoDocumento: string;
    tipoServicio?: string;
    nombreDocumento?: string;
    nombreServicio?: string;
    unidadSolicitadaId: number;
    fechaInicioPlan: Date;
    fechaFinPlan?: Date | null;
    horaInicioPlan?: string;
    horaFinPlan?: string;
    planMoviles: number;
    planMotos: number;
    planSsoo: number;
    planPpssMovil: number;
    planPieTierra: number;
    planMotosBiTripuladas: number;
    planHidro?: number;
    planHipos: number;
    planChoqueApost: number;
    planChoqueAlerta: number;
    planTotalPersonal: number;
    estado: string;
    departamento?: string;
    seccional?: string;
    tiempoServicio?: string;
    observaciones?: string;
  };
  
  // Auditoría
  usuarioId: number;
  fechaHora: Date;
  motivoCambio?: string;              // Opcional: razón del cambio
}

export interface ReporteDespliegue {
  id?: number;
  ordenId: number;
  unidadReportanteId: number;
  
  // ✅ NUEVOS CAMPOS CRÍTICOS
  fechaDespliegue: Date;           // Fecha del día que se está reportando
  usuarioReportaId: number;        // Usuario que crea el reporte
  
  fechaHoraCarga: Date;            // Timestamp de cuándo se reportó
  realHoraInicio?: string;      // ✅ MODIFICADO v16
  realHoraFin?: string;         // ✅ MODIFICADO v16
  realMoviles: number;
  realMotos: number;
  realSsoo: number;
  realPpssMovil: number;
  realPieTierra: number;
  realMotosBiTripuladas: number;
  realHidro?: number;
  realHipos: number;
  realChoqueApost: number;
  realChoqueAlerta: number;
  realTotalPersonal: number;
  estadoReal: 'Completo' | 'Reducido' | 'Ampliado' | 'Cancelado';
  motivoCambios?: string;
  observaciones?: string;
  departamento?: string;
  seccional?: string;
  tiempoDespliegue?: string;
  reportadoPor?: number;           // Mantener para compatibilidad
  modificadoPor?: number;
  createdAt?: Date;
  updatedAt?: Date;

  // ✅ NUEVOS CAMPOS: SNAPSHOT DE PLANIFICACIÓN (v14)
  refPlanMoviles?: number;
  refPlanMotos?: number;
  refPlanSsoo?: number;
  refPlanPpssMovil?: number;
  refPlanPieTierra?: number;
  refPlanMotosBiTripuladas?: number;
  refPlanHidro?: number;
  refPlanHipos?: number;
  refPlanChoqueApost?: number;
  refPlanChoqueAlerta?: number;
  refPlanTotalPersonal?: number;

  // ✅ NUEVOS CAMPOS v15: Tipo de Despliegue
  tipoDespliegue?: 'Despliegue' | 'Franco' | 'Sin efecto';
  motivoSinEfecto?: string;  // Requerido solo si tipoDespliegue === 'Sin efecto'
  cruzaMedianoche?: boolean;    // ✅ NUEVO v16: true si horaFin < horaInicio (ej: 18:00 a 06:00)
}

export interface RecursosReporte {
  realMoviles: number
  realMotos: number
  realSsoo: number
  realPpssMovil: number
  realPieTierra: number
  realMotosBiTripuladas: number
  realHipos: number
  realChoqueApost: number
  realChoqueAlerta: number
  realHidro: number
  realTotalPersonal: number
}

// Módulo Seguridad
export interface LogAuditoria {
  id?: number;
  usuarioId: number;
  accion: 'CREATE' | 'UPDATE' | 'DELETE';
  tablaAfectada: string;
  registroId?: number;
  datosAnteriores?: Record<string, unknown>;
  datosNuevos?: Record<string, unknown>;
  fechaHora: Date;
  ipAddress?: string;
}
