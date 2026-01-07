<template>
  <div class="mini-calendario" :class="{ 'mini-calendario--readonly': readonly }">
    <div class="mini-calendario__header">
      {{ nombreMes }} {{ año }}
    </div>
    <div class="mini-calendario__weekdays">
      <span v-for="letra in ['L', 'M', 'M', 'J', 'V', 'S', 'D']" :key="letra">{{ letra }}</span>
    </div>
    <div class="mini-calendario__days">
      <span v-for="n in offsetInicial" :key="`empty-${n}`" class="mini-calendario__day empty" />
      <span
        v-for="dia in diasDelMes"
        :key="dia"
        class="mini-calendario__day"
        :class="{
          'mini-calendario__day--active': diasActivos.includes(dia),
          'mini-calendario__day--weekend': esFinDeSemana(dia)
        }"
        :title="getDiaTooltip(dia)"
        @click="handleDiaClick(dia)"
      >
        {{ dia }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import './MiniCalendario.css';
import type { DiasTurnoDetalle } from '@lib/types';

interface Props {
  mes: number; // 0-11
  año: number;
  diasActivos: number[];
  excepciones?: DiasTurnoDetalle[];
  horaIngreso?: string;
  horaSalida?: string;
  readonly?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  excepciones: () => [],
  horaIngreso: '08:00',
  horaSalida: '16:00',
  readonly: false
});

const emit = defineEmits<{
  'update:diasActivos': [dias: number[]];
  'dia-click': [dia: number];
}>();

const nombreMes = computed(() => {
  return new Intl.DateTimeFormat('es-UY', { month: 'long' }).format(new Date(props.año, props.mes));
});

const offsetInicial = computed(() => {
  // Ajustar para que Lunes sea el primer día (0)
  const firstDay = new Date(props.año, props.mes, 1).getDay();
  return (firstDay + 6) % 7;
});

const diasDelMes = computed(() => {
  return new Date(props.año, props.mes + 1, 0).getDate();
});

function esFinDeSemana(dia: number) {
  const day = new Date(props.año, props.mes, dia).getDay();
  return day === 0 || day === 6;
}

function getDiaTooltip(dia: number) {
  if (!props.diasActivos.includes(dia)) return 'Descanso';
  
  const excepcion = props.excepciones.find(e => e.dia === dia);
  if (excepcion) {
    return `Horario: ${excepcion.entradaCustom || props.horaIngreso} - ${excepcion.salidaCustom || props.horaSalida} (Manual)`;
  }
  
  return `Horario: ${props.horaIngreso} - ${props.horaSalida}`;
}

function handleDiaClick(dia: number) {
  if (props.readonly) return;
  
  // AI-Hint: Solo emitir el click. La lógica de negocio (toggle/excepciones) 
  // la maneja el padre para permitir cancelación.
  emit('dia-click', dia);
}
</script>

