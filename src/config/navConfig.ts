/**
 * Configuración de Navegación por Unidad
 *
 * Define los items de menú disponibles para cada unidad específica del sistema.
 * Cada unidad tiene sus propios items según la especificación técnica.
 */

export interface NavItem {
  id: string;
  label: string;
  icon: string; // Nombre del icono de lucide-vue-next
  route: string; // Ruta relativa (se completará con unidad)
  exact?: boolean;
}

export interface NavConfig {
  items: NavItem[];
}

// AI-Hint: Configuración por unidad específica | Permite control granular | Cada unidad tiene items diferentes según especificación
export const navConfigs: Record<string, NavConfig> = {
  // Unidades de Comando
  direccion: {
    items: [
      {
        id: "personal",
        label: "Personal",
        icon: "Users",
        route: "personal",
        exact: true,
      },
      {
        id: "reportes",
        label: "Reportes",
        icon: "BarChart3",
        route: "reportes",
        exact: true,
      },
    ],
  },
  "sub-direccion": {
    items: [
      {
        id: "personal",
        label: "Personal",
        icon: "Users",
        route: "personal",
        exact: true,
      },
      {
        id: "reportes",
        label: "Reportes",
        icon: "BarChart3",
        route: "reportes",
        exact: true,
      },
    ],
  },
  esmapo: {
    items: [
      {
        id: "personal",
        label: "Personal",
        icon: "Users",
        route: "personal",
        exact: true,
      },
      {
        id: "despliegues",
        label: "Despliegues",
        icon: "ClipboardList",
        route: "despliegues",
        exact: true,
      },
      {
        id: "reporte-personal",
        label: "Reporte Personal",
        icon: "BarChart3",
        route: "reporte-personal",
        exact: true,
      },
      {
        id: "reporte-operativo",
        label: "Reporte Operativo",
        icon: "FileBarChart",
        route: "reporte-operativo",
        exact: true,
      },
    ],
  },

  // Unidades Ejecutoras
  "direccion-i": {
    items: [
      {
        id: "personal",
        label: "Personal",
        icon: "Users",
        route: "personal",
        exact: true,
      },
      {
        id: "despliegues",
        label: "Despliegues",
        icon: "ClipboardList",
        route: "despliegues",
        exact: true,
      },
    ],
  },
  "direccion-ii": {
    items: [
      {
        id: "personal",
        label: "Personal",
        icon: "Users",
        route: "personal",
        exact: true,
      },
      {
        id: "despliegues",
        label: "Despliegues",
        icon: "ClipboardList",
        route: "despliegues",
        exact: true,
      },
    ],
  },
  "regional-norte": {
    items: [
      {
        id: "personal",
        label: "Personal",
        icon: "Users",
        route: "personal",
        exact: true,
      },
      {
        id: "despliegues",
        label: "Despliegues",
        icon: "ClipboardList",
        route: "despliegues",
        exact: true,
      },
    ],
  },
  "regional-este": {
    items: [
      {
        id: "personal",
        label: "Personal",
        icon: "Users",
        route: "personal",
        exact: true,
      },
      {
        id: "despliegues",
        label: "Despliegues",
        icon: "ClipboardList",
        route: "despliegues",
        exact: true,
      },
    ],
  },
  geo: {
    items: [
      {
        id: "personal",
        label: "Personal",
        icon: "Users",
        route: "personal",
        exact: true,
      },
      {
        id: "despliegues",
        label: "Despliegues",
        icon: "ClipboardList",
        route: "despliegues",
        exact: true,
      },
    ],
  },

  // Unidades de Soporte
  "direccion-iv": {
    items: [
      {
        id: "personal",
        label: "Personal",
        icon: "Users",
        route: "personal",
        exact: true,
      },
    ],
  },
  "direccion-vi": {
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: "LayoutDashboard",
        route: "dashboard",
        exact: false,
      },
      {
        id: "personal",
        label: "Personal",
        icon: "Users",
        route: "personal",
        exact: true,
      },
      {
        id: "admin",
        label: "Administración",
        icon: "Settings",
        route: "admin",
        exact: true,
      },
    ],
  },
  "direccion-vii": {
    items: [
      {
        id: "personal",
        label: "Personal",
        icon: "Users",
        route: "personal",
        exact: true,
      },
    ],
  },
};

/**
 * Obtiene la configuración de navegación para una unidad específica
 * @param unidad - Slug de la unidad (ej: "direccion", "esmapo", "direccion-i")
 * @returns Configuración de navegación con rutas completas
 */
export function getNavConfig(unidad: string): NavConfig {
  const config = navConfigs[unidad] || navConfigs["direccion"];

  // AI-Hint: Generar rutas dinámicas con unidad | Rutas relativas se completan aquí | Rutas absolutas (empiezan con /) se mantienen
  return {
    items: config.items.map((item) => ({
      ...item,
      route: item.route.startsWith('/') ? item.route : `/${unidad}/${item.route}`,
    })),
  };
}
