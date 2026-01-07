<template>
  <div class="formulario-secciones">
    <!-- Selector de Tipo de Operativo -->
    <div class="tipo-operativo-selector" style="margin-bottom: var(--space-4);">
      <div class="ficha-dato">
        <span class="ficha-dato-label ficha-dato-label--required">Tipo de Operativo</span>
        <Select
          v-model="formData.tipoDespliegue"
          :options="tipoDespliegueOptions"
          size="sm"
        />
      </div>
      
      <!-- Selector secundario solo si es "Sin efecto" -->
      <div v-if="formData.tipoDespliegue === 'Sin efecto'" class="ficha-dato" style="margin-top: var(--space-3);">
        <span class="ficha-dato-label ficha-dato-label--required">Motivo</span>
        <Select
          v-model="formData.motivoSinEfecto"
          :options="motivoSinEfectoOptions"
          :error="errors.motivoSinEfecto"
          size="sm"
        />
      </div>
    </div>

    <!-- Sección Única: Recursos del Operativo -->
    <InlineForm v-if="formData.tipoDespliegue === 'Despliegue'">
      <FichaFormulario :columns="3">
        <!-- Recursos Móviles -->
        <div class="ficha-dato">
          <span class="ficha-dato-label">Móviles</span>
          <Input
            v-model="formData.planMoviles"
            type="number"
            :min="0"
            size="sm"
            class="input-cantidad"
          >
            <template #icon>
              <img src="@/assets/images/movil.svg" alt="Móviles" style="width: 16px; height: 16px;" />
            </template>
          </Input>
        </div>
        
        <div class="ficha-dato">
          <span class="ficha-dato-label">Motos</span>
          <Input
            v-model="formData.planMotos"
            type="number"
            :min="0"
            size="sm"
            class="input-cantidad"
          >
            <template #icon>
              <img src="@/assets/images/motos.svg" alt="Motos" style="width: 16px; height: 16px;" />
            </template>
          </Input>
        </div>
        
        <div class="ficha-dato">
          <span class="ficha-dato-label">Motos Bi/Tripuladas</span>
          <Input
            v-model="formData.planMotosBiTripuladas"
            type="number"
            :min="0"
            size="sm"
            class="input-cantidad"
          >
            <template #icon>
              <img src="@/assets/images/motosBitripuladas.svg" alt="Motos Bi/Tripuladas" style="width: 16px; height: 16px;" />
            </template>
          </Input>
        </div>
        
        <div class="ficha-dato">
          <span class="ficha-dato-label">Hidrantes</span>
          <Input
            v-model="formData.planHidro"
            type="number"
            :min="0"
            size="sm"
            class="input-cantidad"
          >
            <template #icon>
              <img src="@/assets/images/hidro.png" alt="Hidrantes" style="width: 16px; height: 16px;" />
            </template>
          </Input>
        </div>
        
        <div class="ficha-dato">
          <span class="ficha-dato-label">Hipos</span>
          <Input
            v-model="formData.planHipos"
            type="number"
            :min="0"
            size="sm"
            class="input-cantidad"
          >
            <template #icon>
              <img src="@/assets/images/hipos.svg" alt="Hipos" style="width: 16px; height: 16px;" />
            </template>
          </Input>
        </div>
        
        <!-- Personal -->
        <div class="ficha-dato">
          <span class="ficha-dato-label">SSOO</span>
          <Input
            v-model="formData.planSsoo"
            type="number"
            :min="0"
            size="sm"
            class="input-cantidad"
          >
            <template #icon>
              <img src="@/assets/images/ssoo.svg" alt="SSOO" style="width: 16px; height: 16px;" />
            </template>
          </Input>
        </div>
        
        <div class="ficha-dato">
          <span class="ficha-dato-label">P.P.S.S. en Móvil</span>
          <Input
            v-model="formData.planPpssMovil"
            type="number"
            :min="0"
            size="sm"
            class="input-cantidad"
          >
            <template #icon>
              <img src="@/assets/images/ppssEnMovil.svg" alt="P.P.S.S. en Móvil" style="width: 16px; height: 16px;" />
            </template>
          </Input>
        </div>
        
        <div class="ficha-dato">
          <span class="ficha-dato-label">Pie a Tierra</span>
          <Input
            v-model="formData.planPieTierra"
            type="number"
            :min="0"
            size="sm"
            class="input-cantidad"
          >
            <template #icon>
              <img src="@/assets/images/pieTierra.svg" alt="Pie a Tierra" style="width: 16px; height: 16px;" />
            </template>
          </Input>
        </div>
        
        <div class="ficha-dato">
          <span class="ficha-dato-label">Choque Apostado</span>
          <Input
            v-model="formData.planChoqueApost"
            type="number"
            :min="0"
            size="sm"
            class="input-cantidad"
          >
            <template #icon>
              <img src="@/assets/images/choqueApostado.svg" alt="Choque Apostado" style="width: 16px; height: 16px;" />
            </template>
          </Input>
        </div>
        
        <div class="ficha-dato">
          <span class="ficha-dato-label">Choque en Alerta</span>
          <Input
            v-model="formData.planChoqueAlerta"
            type="number"
            :min="0"
            size="sm"
            class="input-cantidad"
          >
            <template #icon>
              <img src="@/assets/images/choqueEnAlerta.svg" alt="Choque en Alerta" style="width: 16px; height: 16px;" />
            </template>
          </Input>
        </div>
        
        <div class="ficha-dato">
          <span class="ficha-dato-label">Total Efectivos</span>
          <div class="campo-calculado">
            <div class="campo-calculado-icon">
              <img src="@/assets/images/ppssTotal.svg" alt="Total Efectivos" style="width: 16px; height: 16px;" />
            </div>
            <div class="campo-calculado-valor">{{ totalEfectivosCalculado }}</div>
          </div>
        </div>
      </FichaFormulario>
    </InlineForm>

    <!-- Mensaje informativo para Franco/Sin efecto -->
    <div v-else class="info-message" style="padding: var(--space-4); background-color: var(--color-gray-50); border: 2px solid var(--border-color-strong); border-radius: var(--radius-md);">
      <p style="margin: 0; color: var(--color-text-secondary);">
        {{ formData.tipoDespliegue === 'Franco' ? 'Personal en franco. No se requiere registro de recursos.' : 'Operativo sin efecto. No se requiere registro de recursos.' }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { Input, Select, FichaFormulario, InlineForm } from '@components'
import { useFormularioOrden } from './useFormularioOrden'

interface Props {
  mode?: 'create' | 'edit'
  ordenId?: number
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'create'
})

const {
  formData,
  errors,
  tipoDespliegueOptions,
  motivoSinEfectoOptions
} = useFormularioOrden(props)

// Computed property para calcular total de efectivos automáticamente
const totalEfectivosCalculado = computed(() => {
  const ppssMovil = Number(formData.value.planPpssMovil) || 0
  const motos = Number(formData.value.planMotos) || 0
  const hipos = Number(formData.value.planHipos) || 0
  const pieTierra = Number(formData.value.planPieTierra) || 0
  const motosBiTri = Number(formData.value.planMotosBiTripuladas) || 0
  
  return ppssMovil + motos + hipos + pieTierra + (motosBiTri * 2)
})

// Sincronizar el valor calculado con el formData para la persistencia
watch(totalEfectivosCalculado, (newValue) => {
  formData.value.planTotalPersonal = newValue
}, { immediate: true })
</script>

<style scoped>
/* Inputs de Cantidad - Ancho Limitado */
.input-cantidad {
  max-width: 5rem; /* ~80px - Suficiente para 2 dígitos + padding */
}

/* Eliminar padding izquierdo del contenedor de ícono */
.input-cantidad :deep(.input-icon) {
  padding-left: 0;
}

/* Campo calculado (solo lectura) */
.campo-calculado {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: 0 var(--space-3);
  background-color: var(--color-gray-100);
  border: 2px solid var(--border-color-strong);
  border-radius: var(--radius-md);
  min-height: 32px;
  width: 100%;
  flex: 1;
}

.campo-calculado-icon {
  display: flex;
  align-items: center;
  opacity: 0.7;
}

.campo-calculado-valor {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}
</style>
