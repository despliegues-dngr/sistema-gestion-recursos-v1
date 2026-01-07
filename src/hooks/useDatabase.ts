/**
 * Hook de Base de Datos
 */

import { db } from '@lib/db'
import { seedDatabase } from '@lib/db/seed'

export function useDatabase() {
  const initialize = async (): Promise<boolean> => {
    try {
      await seedDatabase()
      return true
    } catch (error) {
      return false
    }
  }

  return {
    db,
    initialize
  }
}
