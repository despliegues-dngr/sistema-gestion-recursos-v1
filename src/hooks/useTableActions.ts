/**
 * Hook para gestión de acciones de tabla según permisos de rol
 * 
 * Centraliza la lógica de qué acciones están disponibles para cada rol.
 * 
 * @param rol - Rol del usuario actual (direccion_vi, jefe_unidad, estado_mayor)
 * @returns Array de acciones disponibles para el rol especificado
 */
import type { TableAction } from '@components/Table/Table.vue'
import { ROLES } from '@lib/constants'

export function useTableActions(rol: string): TableAction[] {
  const baseActions: TableAction[] = [
    { name: "view", icon: "view", label: "Ver detalles" },
    { name: "transfer", icon: "transfer", label: "Transferir" }
  ]
  
  // AI-Hint: Solo Dirección VI puede eliminar funcionarios | Control de permisos centralizado | Facilita mantenimiento futuro
  if (rol === ROLES.DIRECCION_VI) {
    baseActions.push({ name: "delete", icon: "delete", label: "Eliminar" })
  }
  
  return baseActions
}

