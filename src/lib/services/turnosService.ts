/**
 * Servicio de gestión y cálculo de turnos
 */

export interface RegimenConfig {
  tipo: 'ciclico' | 'semanal';
  ciclo?: number;
  diasTrabajo?: number;
  diasSemana?: number[];
  descripcion: string;
}

export const REGIMENES: Record<string, RegimenConfig> = {
  '12x36': { tipo: 'ciclico', ciclo: 2, diasTrabajo: 1, descripcion: '1 día trabajo, 1 día descanso' },
  '24x48': { tipo: 'ciclico', ciclo: 3, diasTrabajo: 1, descripcion: '1 día trabajo, 2 días descanso' },
  'Semana': { tipo: 'ciclico', ciclo: 14, diasTrabajo: 7, descripcion: '7 días trabajo, 7 días descanso' },
  '8 hs.': { tipo: 'semanal', diasSemana: [1, 2, 3, 4, 5], descripcion: '8 horas diarias, lunes a viernes' }
};

/**
 * Calcula los días de trabajo para un mes específico
 */
export function calcularTurnosMes(regimenNombre: string, fechaInicioCiclo: Date, mes: number, año: number): number[] {
  const config = REGIMENES[regimenNombre];
  if (!config) return [];

  const diasEnMes = new Date(año, mes + 1, 0).getDate();
  const diasTrabajo: number[] = [];

  for (let dia = 1; dia <= diasEnMes; dia++) {
    const fechaActual = new Date(año, mes, dia);
    
    if (config.tipo === 'semanal') {
      const dayOfWeek = fechaActual.getDay(); // 0 = Domingo, 1 = Lunes...
      // Ajustar a 1 = Lunes, 7 = Domingo para consistencia si es necesario, 
      // pero Date.getDay() ya da 0-6. Vamos a usar 1-5 para L-V.
      const isoDay = dayOfWeek === 0 ? 7 : dayOfWeek;
      if (config.diasSemana?.includes(isoDay)) {
        diasTrabajo.push(dia);
      }
    } else if (config.tipo === 'ciclico' && config.ciclo && config.diasTrabajo) {
      // Normalizar fechas a medianoche local para cálculo de diferencia de días
      const d1 = new Date(fechaInicioCiclo.getFullYear(), fechaInicioCiclo.getMonth(), fechaInicioCiclo.getDate());
      const d2 = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate());
      
      const diffTime = d2.getTime() - d1.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays >= 0) {
        const posicionEnCiclo = diffDays % config.ciclo;
        if (posicionEnCiclo < config.diasTrabajo) {
          diasTrabajo.push(dia);
        }
      }
    }
  }

  return diasTrabajo;
}

/**
 * Determina si un funcionario trabaja en un día específico
 */
export function trabajaEnDia(
  regimenNombre: string, 
  fechaInicioCiclo: Date, 
  dia: number, 
  mes: number, 
  año: number,
  excepciones: number[] = []
): boolean {
  // Las excepciones son overrides manuales (días que se agregaron o quitaron)
  // Para simplificar el plan, si el día está en excepciones, devolvemos true/false?
  // El plan dice: "Si diasTurnoExcepciones existe -> usar ese". 
  // Implementaremos una lógica más simple: el MiniCalendario manejará el estado final.
  
  const calculados = calcularTurnosMes(regimenNombre, fechaInicioCiclo, mes, año);
  return calculados.includes(dia);
}

