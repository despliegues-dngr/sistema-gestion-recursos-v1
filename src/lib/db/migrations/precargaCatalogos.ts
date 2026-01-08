/**
 * Script de precarga de catálogos desde valores hardcodeados
 * Ejecutar una sola vez al inicializar el sistema
 */
import { db } from '../index';
import type { CatalogoValor } from '@lib/types';

export async function precargaCatalogosDesdeHardcode(): Promise<void> {
  const catalogos: Record<string, string[]> = {
    tipo_documento: [
      'Orden de Operaciones',
      'Circular',
      'Orden de Servicio',
      'Comunicado',
      'Otro'
    ],
    tipo_servicio: [
      'Operativo',
      'Patrullaje',
      'Apoyo',
      'Incursión',
      'Allanamiento perimetral'
    ],
    tiempo_servicio: [
      'Permanente',
      'Transitorio',
      'Estático'
    ],
    departamento: [
      'Artigas', 'Canelones', 'Cerro Largo', 'Colonia', 'Durazno',
      'Flores', 'Florida', 'Lavalleja', 'Maldonado', 'Montevideo',
      'Paysandú', 'Río Negro', 'Rivera', 'Rocha', 'Salto',
      'San José', 'Soriano', 'Tacuarembó', 'Treinta y Tres'
    ],
    seccional: [
      '1ra', '2da', '3ra', '4ta', '5ta', '6ta', '7ma', '8va', '9na', '10ma',
      '11ra', '12da', '13ra', '14ta', '15ta', '16ta', '17ma', '18va', '19na', '20ma'
    ],
    motivo_sin_efecto: [
      'Por falta de personal',
      'Por orden de superior',
      'Por cubrir otro Operativo'
    ],
    tipo_tarea: [
      'Administrativa',
      'Operativa',
      'Supervisión',
      'Coordinación',
      'Técnica',
      'Logística'
    ]
  };

  let totalPrecargados = 0;

  for (const [catalogo, valores] of Object.entries(catalogos)) {
    try {
      const existentes = await db.catalogos_valores
        .where('catalogo')
        .equals(catalogo)
        .count();

      if (existentes === 0) {
        const registros: Omit<CatalogoValor, 'id'>[] = valores.map((nombre, index) => ({
          catalogo: catalogo as any,
          nombre,
          activo: true,
          orden: index + 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }));

        await db.catalogos_valores.bulkAdd(registros as any);
        totalPrecargados += valores.length;
      }
    } catch (error) {
      // Error silencioso en migración
    }
  }
}
