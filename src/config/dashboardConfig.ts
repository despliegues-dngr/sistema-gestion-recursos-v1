/**
 * Configuración de Dashboards por Rol
 *
 * Define los KPIs, acordeones y contenido específico para cada rol.
 */

import { ROLES } from "@lib/constants";

export interface KPIConfig {
  id: string;
  title: string;
  value: string | number;
  label: string;
  variant?: "default" | "success" | "warning" | "error";
}

export interface AccordionConfig {
  id: string;
  title: string;
  icon: string;
  defaultOpen?: boolean;
  filters: FilterConfig[];
}

export interface FilterConfig {
  id: string;
  type: "input" | "select";
  label: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

export interface DashboardConfig {
  title: string;
  subtitle: string;
  kpis: KPIConfig[];
  accordions: AccordionConfig[];
}

export const dashboardConfigs: Record<string, DashboardConfig> = {
  [ROLES.DIRECCION_VI]: {
    title: "Dashboard Dirección",
    subtitle: "Vista general del sistema",
    kpis: [
      {
        id: "funcionarios",
        title: "Funcionarios Activos",
        value: 0,
        label: "Total registrados",
      },
      {
        id: "asistencia",
        title: "Asistencia",
        value: "0%",
        label: "Presente hoy",
        variant: "success",
      },
      {
        id: "alertas",
        title: "Alertas",
        value: 0,
        label: "Pendientes",
        variant: "warning",
      },
    ],
    accordions: [
      {
        id: "personal",
        title: "DATOS PERSONALES",
        icon: "User",
        filters: [
          {
            id: "nombre",
            type: "input",
            label: "Nombre",
            placeholder: "Buscar por nombre...",
          },
          {
            id: "ci",
            type: "input",
            label: "CI",
            placeholder: "Cédula de identidad",
          },
        ],
      },
      {
        id: "organizacional",
        title: "DATOS ORGANIZACIONALES",
        icon: "Building",
        filters: [
          {
            id: "unidad",
            type: "select",
            label: "Unidad",
            placeholder: "Seleccionar unidad",
          },
          {
            id: "grado",
            type: "select",
            label: "Grado",
            placeholder: "Seleccionar grado",
          },
        ],
      },
      {
        id: "horario",
        title: "RÉGIMEN Y HORARIO",
        icon: "Clock",
        filters: [
          {
            id: "turno",
            type: "select",
            label: "Turno",
            placeholder: "Seleccionar turno",
          },
        ],
      },
      {
        id: "licencias",
        title: "LICENCIAS",
        icon: "FileText",
        filters: [
          {
            id: "tipo",
            type: "select",
            label: "Tipo",
            placeholder: "Tipo de licencia",
          },
        ],
      },
      {
        id: "cursos",
        title: "CURSOS",
        icon: "GraduationCap",
        filters: [
          {
            id: "curso",
            type: "input",
            label: "Curso",
            placeholder: "Buscar curso",
          },
        ],
      },
    ],
  },

  [ROLES.JEFE_UNIDAD]: {
    title: "Dashboard Jefe de Unidad",
    subtitle: "Gestión de personal de la unidad",
    kpis: [
      {
        id: "personal_unidad",
        title: "Personal Unidad",
        value: 0,
        label: "Asignados",
      },
      {
        id: "presentes",
        title: "Presentes Hoy",
        value: 0,
        label: "En servicio",
      },
      {
        id: "licencias",
        title: "En Licencia",
        value: 0,
        label: "Funcionarios",
        variant: "warning",
      },
      { id: "pendientes", title: "Pendientes", value: 0, label: "Solicitudes" },
    ],
    accordions: [
      {
        id: "personal",
        title: "PERSONAL",
        icon: "Users",
        filters: [
          {
            id: "nombre",
            type: "input",
            label: "Nombre",
            placeholder: "Buscar funcionario...",
          },
          {
            id: "estado",
            type: "select",
            label: "Estado",
            placeholder: "Todos los estados",
          },
        ],
      },
      {
        id: "horarios",
        title: "HORARIOS",
        icon: "Calendar",
        filters: [
          {
            id: "fecha",
            type: "input",
            label: "Fecha",
            placeholder: "Seleccionar fecha",
          },
          {
            id: "turno",
            type: "select",
            label: "Turno",
            placeholder: "Todos los turnos",
          },
        ],
      },
      {
        id: "asistencia",
        title: "ASISTENCIA",
        icon: "ClipboardCheck",
        filters: [
          {
            id: "periodo",
            type: "select",
            label: "Período",
            placeholder: "Seleccionar período",
          },
        ],
      },
    ],
  },

  [ROLES.ESTADO_MAYOR]: {
    title: "Dashboard Estado Mayor",
    subtitle: "Supervisión y reportes",
    kpis: [
      {
        id: "total_personal",
        title: "Total Personal",
        value: 0,
        label: "En el sistema",
      },
      {
        id: "operatividad",
        title: "Operatividad",
        value: "0%",
        label: "General",
        variant: "success",
      },
      {
        id: "servicios_mes",
        title: "Servicios Mes",
        value: 0,
        label: "Realizados",
      },
      {
        id: "incidencias",
        title: "Incidencias",
        value: 0,
        label: "Reportadas",
        variant: "error",
      },
    ],
    accordions: [
      {
        id: "reportes",
        title: "REPORTES",
        icon: "BarChart3",
        filters: [
          {
            id: "tipo_reporte",
            type: "select",
            label: "Tipo",
            placeholder: "Seleccionar reporte",
          },
          {
            id: "periodo",
            type: "select",
            label: "Período",
            placeholder: "Seleccionar período",
          },
        ],
      },
      {
        id: "estadisticas",
        title: "ESTADÍSTICAS",
        icon: "TrendingUp",
        filters: [
          {
            id: "metrica",
            type: "select",
            label: "Métrica",
            placeholder: "Seleccionar métrica",
          },
        ],
      },
      {
        id: "auditoria",
        title: "AUDITORÍA",
        icon: "FileSearch",
        filters: [
          {
            id: "fecha_desde",
            type: "input",
            label: "Desde",
            placeholder: "Fecha inicio",
          },
          {
            id: "fecha_hasta",
            type: "input",
            label: "Hasta",
            placeholder: "Fecha fin",
          },
        ],
      },
    ],
  },
};

export function getDashboardConfig(rol: string): DashboardConfig {
  return dashboardConfigs[rol] || dashboardConfigs[ROLES.DIRECCION_VI];
}

export const roleOptions = [
  { value: ROLES.DIRECCION_VI, label: "Dirección VI" },
  { value: ROLES.JEFE_UNIDAD, label: "Jefe de Unidad" },
  { value: ROLES.ESTADO_MAYOR, label: "Estado Mayor" },
];

export const unitOptions = [
  { value: "direccion", label: "Dirección" },
  { value: "sub-direccion", label: "Sub Dirección" },
  { value: "esmapo", label: "ESMAPO" },
  { value: "direccion-i", label: "Dirección I" },
  { value: "direccion-ii", label: "Dirección II" },
  { value: "regional-norte", label: "Regional Norte" },
  { value: "regional-este", label: "Regional Este" },
  { value: "geo", label: "GEO" },
  { value: "direccion-iv", label: "Dirección IV" },
  { value: "direccion-vi", label: "Dirección VI" },
  { value: "direccion-vii", label: "Dirección VII" },
];

export const rolUrlMap: Record<string, string> = {
  [ROLES.DIRECCION_VI]: "direccion",
  [ROLES.JEFE_UNIDAD]: "jefe-unidad",
  [ROLES.ESTADO_MAYOR]: "estado-mayor",
};

export const urlRolMap: Record<string, string> = {
  direccion: ROLES.DIRECCION_VI,
  "sub-direccion": ROLES.DIRECCION_VI,
  esmapo: ROLES.ESTADO_MAYOR,
  "direccion-i": ROLES.JEFE_UNIDAD,
  "direccion-ii": ROLES.JEFE_UNIDAD,
  "regional-norte": ROLES.JEFE_UNIDAD,
  "regional-este": ROLES.JEFE_UNIDAD,
  geo: ROLES.JEFE_UNIDAD,
  "direccion-iv": ROLES.JEFE_UNIDAD,
  "direccion-vi": ROLES.DIRECCION_VI,
  "direccion-vii": ROLES.JEFE_UNIDAD,
  "jefe-unidad": ROLES.JEFE_UNIDAD,
  "estado-mayor": ROLES.ESTADO_MAYOR,
};

export const unitDisplayNames: Record<string, string> = {
  direccion: "Dirección",
  "sub-direccion": "Sub Dirección",
  esmapo: "ESMAPO",
  "direccion-i": "Dirección I",
  "direccion-ii": "Dirección II",
  "regional-norte": "Regional Norte",
  "regional-este": "Regional Este",
  geo: "GEO",
  "direccion-iv": "Dirección IV",
  "direccion-vi": "Dirección VI",
  "direccion-vii": "Dirección VII",
  "jefe-unidad": "Jefe de Unidad",
  "estado-mayor": "Estado Mayor",
};

export function getUnitDisplayName(urlSlug: string): string {
  return unitDisplayNames[urlSlug] || "Dirección VI";
}
