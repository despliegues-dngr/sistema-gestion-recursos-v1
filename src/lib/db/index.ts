/**
 * Configuración de Dexie.js - Base de datos IndexedDB
 */

import Dexie, { Table } from 'dexie';
import type {
  Funcionario,
  Grado,
  Unidad,
  SubUnidad,
  Escalafon,
  Asignacion,
  Usuario,
  Rol,
  Horario,
  Asistencia,
  Turno,
  TipoRegimen,
  TipoLicencia,
  TipoCurso,
  LicenciaFuncionario,
  Curso,
  HistorialMovimiento,
  OrdenOperativa,
  ReporteDespliegue,
  LogAuditoria
} from '@lib/types';

class SistemaGestionDB extends Dexie {
  funcionarios!: Table<Funcionario, number>;
  grados!: Table<Grado, number>;
  unidades!: Table<Unidad, number>;
  sub_unidades!: Table<SubUnidad, number>;
  escalafones!: Table<Escalafon, number>;
  asignaciones!: Table<Asignacion, number>;
  usuarios!: Table<Usuario, number>;
  roles!: Table<Rol, number>;
  horarios!: Table<Horario, number>;
  asistencias!: Table<Asistencia, number>;
  turnos!: Table<Turno, number>;
  tipos_regimen!: Table<TipoRegimen, number>;
  tipos_licencia!: Table<TipoLicencia, number>;
  tipos_curso!: Table<TipoCurso, number>;
  licencias_funcionarios!: Table<LicenciaFuncionario, number>;
  cursos!: Table<Curso, number>;
  historial_movimientos!: Table<HistorialMovimiento, number>;
  ordenes_operativas!: Table<OrdenOperativa, number>;
  reportes_despliegue!: Table<ReporteDespliegue, number>;
  log_auditoria!: Table<LogAuditoria, number>;

  constructor() {
    super('SistemaGestionDB');
    
    // AI-Hint: Migración a version(2) para agregar nuevas tablas y actualizar índices de FUNCIONARIOS
    // Mantiene compatibilidad con datos existentes mediante migración automática de Dexie
    this.version(1).stores({
      funcionarios: '++id, ci, gradoId, unidadId, estado',
      grados: '++id, nivel',
      unidades: '++id, tipo',
      escalafones: '++id, nivel',
      asignaciones: '++id, funcionarioId, servicioId, fecha, estado',
      usuarios: '++id, username, rolId, estado',
      roles: '++id, nombre',
      horarios: '++id, funcionarioId, fecha',
      asistencias: '++id, funcionarioId, fecha'
    });

    this.version(2).stores({
      funcionarios: '++id, ci, nombre_completo, gradoId, unidadId, turnoId, regimenId, estado',
      grados: '++id, nivel',
      unidades: '++id, tipo, codigo',
      escalafones: '++id, nivel',
      asignaciones: '++id, funcionarioId, servicioId, fecha, estado',
      usuarios: '++id, username, rolId, unidadId, estado',
      roles: '++id, nombre',
      horarios: '++id, funcionarioId, fecha',
      asistencias: '++id, funcionarioId, fecha',
      turnos: '++id, nombre',
      tipos_regimen: '++id, nombre, activo',
      tipos_licencia: '++id, nombre, activo',
      licencias_funcionarios: '++id, funcionarioId, tipoLicenciaId, fechaInicio, fechaFin, estado',
      cursos: '++id, funcionarioId, nombreCurso, estado',
      historial_movimientos: '++id, funcionarioId, unidadOrigenId, unidadDestinoId, fechaCambio',
      ordenes_operativas: '++id, nroDocumento, unidadSolicitadaId, fechaInicioPlan, estado',
      reportes_despliegue: '++id, ordenId, unidadReportanteId, fechaHoraCarga',
      log_auditoria: '++id, usuarioId, accion, tablaAfectada, fechaHora'
    });

    // AI-Hint: Migración a version(3) para agregar tabla sub_unidades y campo subUnidadId en funcionarios
    // Mantiene compatibilidad con datos existentes mediante migración automática de Dexie
    this.version(3).stores({
      funcionarios: '++id, ci, nombre_completo, gradoId, unidadId, subUnidadId, turnoId, regimenId, estado',
      grados: '++id, nivel',
      unidades: '++id, tipo, codigo',
      sub_unidades: '++id, nombre, unidadId, activa',
      escalafones: '++id, nivel',
      asignaciones: '++id, funcionarioId, servicioId, fecha, estado',
      usuarios: '++id, username, rolId, unidadId, estado',
      roles: '++id, nombre',
      horarios: '++id, funcionarioId, fecha',
      asistencias: '++id, funcionarioId, fecha',
      turnos: '++id, nombre',
      tipos_regimen: '++id, nombre, activo',
      tipos_licencia: '++id, nombre, activo',
      licencias_funcionarios: '++id, funcionarioId, tipoLicenciaId, fechaInicio, fechaFin, estado',
      cursos: '++id, funcionarioId, nombreCurso, estado',
      historial_movimientos: '++id, funcionarioId, unidadOrigenId, unidadDestinoId, fechaCambio',
      ordenes_operativas: '++id, nroDocumento, unidadSolicitadaId, fechaInicioPlan, estado',
      reportes_despliegue: '++id, ordenId, unidadReportanteId, fechaHoraCarga',
      log_auditoria: '++id, usuarioId, accion, tablaAfectada, fechaHora'
    });

    // AI-Hint: Migración a version(4) para agregar campos laborales: tarea, horaIngreso, horaSalida, realiza222
    this.version(4).stores({
      funcionarios: '++id, ci, nombre_completo, gradoId, unidadId, subUnidadId, turnoId, regimenId, estado, tarea',
      grados: '++id, nivel',
      unidades: '++id, tipo, codigo',
      sub_unidades: '++id, nombre, unidadId, activa',
      escalafones: '++id, nivel',
      asignaciones: '++id, funcionarioId, servicioId, fecha, estado',
      usuarios: '++id, username, rolId, unidadId, estado',
      roles: '++id, nombre',
      horarios: '++id, funcionarioId, fecha',
      asistencias: '++id, funcionarioId, fecha',
      turnos: '++id, nombre',
      tipos_regimen: '++id, nombre, activo',
      tipos_licencia: '++id, nombre, activo',
      licencias_funcionarios: '++id, funcionarioId, tipoLicenciaId, fechaInicio, fechaFin, estado',
      cursos: '++id, funcionarioId, nombreCurso, estado',
      historial_movimientos: '++id, funcionarioId, unidadOrigenId, unidadDestinoId, fechaCambio',
      ordenes_operativas: '++id, nroDocumento, unidadSolicitadaId, fechaInicioPlan, estado',
      reportes_despliegue: '++id, ordenId, unidadReportanteId, fechaHoraCarga',
      log_auditoria: '++id, usuarioId, accion, tablaAfectada, fechaHora'
    });

    // AI-Hint: Migración a version(5) para agregar campos de turnos: fechaInicioTurno, diasTurno, diasTurnoExcepciones
    this.version(5).stores({
      funcionarios: '++id, ci, nombre_completo, gradoId, unidadId, subUnidadId, turnoId, regimenId, estado, tarea, fechaInicioTurno',
      grados: '++id, nivel',
      unidades: '++id, tipo, codigo',
      sub_unidades: '++id, nombre, unidadId, activa',
      escalafones: '++id, nivel',
      asignaciones: '++id, funcionarioId, servicioId, fecha, estado',
      usuarios: '++id, username, rolId, unidadId, estado',
      roles: '++id, nombre',
      horarios: '++id, funcionarioId, fecha',
      asistencias: '++id, funcionarioId, fecha',
      turnos: '++id, nombre',
      tipos_regimen: '++id, nombre, activo',
      tipos_licencia: '++id, nombre, activo',
      licencias_funcionarios: '++id, funcionarioId, tipoLicenciaId, fechaInicio, fechaFin, estado',
      cursos: '++id, funcionarioId, nombreCurso, estado',
      historial_movimientos: '++id, funcionarioId, unidadOrigenId, unidadDestinoId, fechaCambio',
      ordenes_operativas: '++id, nroDocumento, unidadSolicitadaId, fechaInicioPlan, estado',
      reportes_despliegue: '++id, ordenId, unidadReportanteId, fechaHoraCarga',
      log_auditoria: '++id, usuarioId, accion, tablaAfectada, fechaHora'
    });

    // AI-Hint: Migración a version(6) para agregar tabla tipos_curso y actualizar cursos para usar tipoCursoId
    this.version(6).stores({
      funcionarios: '++id, ci, nombre_completo, gradoId, unidadId, subUnidadId, turnoId, regimenId, estado, tarea, fechaInicioTurno',
      grados: '++id, nivel',
      unidades: '++id, tipo, codigo',
      sub_unidades: '++id, nombre, unidadId, activa',
      escalafones: '++id, nivel',
      asignaciones: '++id, funcionarioId, servicioId, fecha, estado',
      usuarios: '++id, username, rolId, unidadId, estado',
      roles: '++id, nombre',
      horarios: '++id, funcionarioId, fecha',
      asistencias: '++id, funcionarioId, fecha',
      turnos: '++id, nombre',
      tipos_regimen: '++id, nombre, activo',
      tipos_licencia: '++id, nombre, activo',
      tipos_curso: '++id, nombre, activo',
      licencias_funcionarios: '++id, funcionarioId, tipoLicenciaId, fechaInicio, fechaFin, estado',
      cursos: '++id, funcionarioId, tipoCursoId, estado',
      historial_movimientos: '++id, funcionarioId, unidadOrigenId, unidadDestinoId, fechaCambio',
      ordenes_operativas: '++id, nroDocumento, unidadSolicitadaId, fechaInicioPlan, estado',
      reportes_despliegue: '++id, ordenId, unidadReportanteId, fechaHoraCarga',
      log_auditoria: '++id, usuarioId, accion, tablaAfectada, fechaHora'
    });

    // AI-Hint: Migración a version(8) para campos adicionales en OrdenOperativa: departamento, seccional, tiempoDespliegue
    this.version(8).stores({
      funcionarios: '++id, ci, nombre_completo, gradoId, unidadId, subUnidadId, turnoId, regimenId, estado, tarea, fechaInicioTurno',
      grados: '++id, nivel',
      unidades: '++id, tipo, codigo',
      sub_unidades: '++id, nombre, unidadId, activa',
      escalafones: '++id, nivel',
      asignaciones: '++id, funcionarioId, servicioId, fecha, estado',
      usuarios: '++id, username, rolId, unidadId, estado',
      roles: '++id, nombre',
      horarios: '++id, funcionarioId, fecha',
      asistencias: '++id, funcionarioId, fecha',
      turnos: '++id, nombre',
      tipos_regimen: '++id, nombre, activo',
      tipos_licencia: '++id, nombre, activo',
      tipos_curso: '++id, nombre, activo',
      licencias_funcionarios: '++id, funcionarioId, tipoLicenciaId, fechaInicio, fechaFin, estado',
      cursos: '++id, funcionarioId, tipoCursoId, estado',
      historial_movimientos: '++id, funcionarioId, unidadOrigenId, unidadDestinoId, fechaCambio',
      ordenes_operativas: '++id, nroDocumento, unidadSolicitadaId, fechaInicioPlan, estado, tipoOperativo, departamento, seccional',
      reportes_despliegue: '++id, ordenId, unidadReportanteId, fechaHoraCarga, departamento, seccional',
      log_auditoria: '++id, usuarioId, accion, tablaAfectada, fechaHora'
    });

    // AI-Hint: Migración a version(9) para agregar campos planMotosBiTripuladas y realMotosBiTripuladas
    this.version(9).stores({
      funcionarios: '++id, ci, nombre_completo, gradoId, unidadId, subUnidadId, turnoId, regimenId, estado, tarea, fechaInicioTurno',
      grados: '++id, nivel',
      unidades: '++id, tipo, codigo',
      sub_unidades: '++id, nombre, unidadId, activa',
      escalafones: '++id, nivel',
      asignaciones: '++id, funcionarioId, servicioId, fecha, estado',
      usuarios: '++id, username, rolId, unidadId, estado',
      roles: '++id, nombre',
      horarios: '++id, funcionarioId, fecha',
      asistencias: '++id, funcionarioId, fecha',
      turnos: '++id, nombre',
      tipos_regimen: '++id, nombre, activo',
      tipos_licencia: '++id, nombre, activo',
      tipos_curso: '++id, nombre, activo',
      licencias_funcionarios: '++id, funcionarioId, tipoLicenciaId, fechaInicio, fechaFin, estado',
      cursos: '++id, funcionarioId, tipoCursoId, estado',
      historial_movimientos: '++id, funcionarioId, unidadOrigenId, unidadDestinoId, fechaCambio',
      ordenes_operativas: '++id, nroDocumento, unidadSolicitadaId, fechaInicioPlan, estado, tipoOperativo, departamento, seccional',
      reportes_despliegue: '++id, ordenId, unidadReportanteId, fechaHoraCarga, departamento, seccional',
      log_auditoria: '++id, usuarioId, accion, tablaAfectada, fechaHora'
    });

    // AI-Hint: Migración a version(10) para agregar campos planHidro y realHidro
    this.version(10).stores({
      funcionarios: '++id, ci, nombre_completo, gradoId, unidadId, subUnidadId, turnoId, regimenId, estado, tarea, fechaInicioTurno',
      grados: '++id, nivel',
      unidades: '++id, tipo, codigo',
      sub_unidades: '++id, nombre, unidadId, activa',
      escalafones: '++id, nivel',
      asignaciones: '++id, funcionarioId, servicioId, fecha, estado',
      usuarios: '++id, username, rolId, unidadId, estado',
      roles: '++id, nombre',
      horarios: '++id, funcionarioId, fecha',
      asistencias: '++id, funcionarioId, fecha',
      turnos: '++id, nombre',
      tipos_regimen: '++id, nombre, activo',
      tipos_licencia: '++id, nombre, activo',
      tipos_curso: '++id, nombre, activo',
      licencias_funcionarios: '++id, funcionarioId, tipoLicenciaId, fechaInicio, fechaFin, estado',
      cursos: '++id, funcionarioId, tipoCursoId, estado',
      historial_movimientos: '++id, funcionarioId, unidadOrigenId, unidadDestinoId, fechaCambio',
      ordenes_operativas: '++id, nroDocumento, unidadSolicitadaId, fechaInicioPlan, estado, tipoOperativo, departamento, seccional',
      reportes_despliegue: '++id, ordenId, unidadReportanteId, fechaHoraCarga, departamento, seccional',
      log_auditoria: '++id, usuarioId, accion, tablaAfectada, fechaHora'
    });
    
    // AI-Hint: Migración a version(11) para eliminar el campo 'estado' de funcionarios (simplificación del modelo)
    this.version(11).stores({
      funcionarios: '++id, ci, nombre_completo, gradoId, unidadId, subUnidadId, turnoId, regimenId, tarea, fechaInicioTurno',
      grados: '++id, nivel',
      unidades: '++id, tipo, codigo',
      sub_unidades: '++id, nombre, unidadId, activa',
      escalafones: '++id, nivel',
      asignaciones: '++id, funcionarioId, servicioId, fecha, estado',
      usuarios: '++id, username, rolId, unidadId, estado',
      roles: '++id, nombre',
      horarios: '++id, funcionarioId, fecha',
      asistencias: '++id, funcionarioId, fecha',
      turnos: '++id, nombre',
      tipos_regimen: '++id, nombre, activo',
      tipos_licencia: '++id, nombre, activo',
      tipos_curso: '++id, nombre, activo',
      licencias_funcionarios: '++id, funcionarioId, tipoLicenciaId, fechaInicio, fechaFin, estado',
      cursos: '++id, funcionarioId, tipoCursoId, estado',
      historial_movimientos: '++id, funcionarioId, unidadOrigenId, unidadDestinoId, fechaCambio',
      ordenes_operativas: '++id, nroDocumento, unidadSolicitadaId, fechaInicioPlan, estado, tipoOperativo, departamento, seccional',
      reportes_despliegue: '++id, ordenId, unidadReportanteId, fechaHoraCarga, departamento, seccional',
      log_auditoria: '++id, usuarioId, accion, tablaAfectada, fechaHora'
    });

    // AI-Hint: Migración a version(12) para agregar campos de fecha y usuario a reportes_despliegue
    // Permite reportes diarios independientes y auditoría completa
    this.version(12).stores({
      funcionarios: '++id, ci, nombre_completo, gradoId, unidadId, subUnidadId, turnoId, regimenId, tarea, fechaInicioTurno',
      grados: '++id, nivel',
      unidades: '++id, tipo, codigo',
      sub_unidades: '++id, nombre, unidadId, activa',
      escalafones: '++id, nivel',
      asignaciones: '++id, funcionarioId, servicioId, fecha, estado',
      usuarios: '++id, username, rolId, unidadId, estado',
      roles: '++id, nombre',
      turnos: '++id, nombre, horaInicio, horaFin',
      regimenes: '++id, nombre',
      tipos_licencia: '++id, nombre, activo',
      tipos_curso: '++id, nombre, activo',
      licencias_funcionarios: '++id, funcionarioId, tipoLicenciaId, fechaInicio, fechaFin, estado',
      cursos: '++id, funcionarioId, tipoCursoId, estado',
      historial_movimientos: '++id, funcionarioId, unidadOrigenId, unidadDestinoId, fechaCambio',
      ordenes_operativas: '++id, nroDocumento, unidadSolicitadaId, fechaInicioPlan, estado, tipoOperativo, departamento, seccional',
      reportes_despliegue: '++id, ordenId, unidadReportanteId, fechaDespliegue, fechaHoraCarga, usuarioReportaId, departamento, seccional',
      log_auditoria: '++id, usuarioId, accion, tablaAfectada, fechaHora'
    }).upgrade(tx => {
      // Migración de datos existentes
      return tx.table('reportes_despliegue').toCollection().modify(reporte => {
        // Si no tiene fechaDespliegue, usar fechaHoraCarga como fallback
        if (!reporte.fechaDespliegue && reporte.fechaHoraCarga) {
          reporte.fechaDespliegue = new Date(reporte.fechaHoraCarga);
          reporte.fechaDespliegue.setHours(0, 0, 0, 0);
        }
        // Si no tiene usuarioReportaId, usar reportadoPor como fallback
        if (!reporte.usuarioReportaId && reporte.reportadoPor) {
          reporte.usuarioReportaId = reporte.reportadoPor;
        }
      });
    });
  }
}

export const db = new SistemaGestionDB();
