<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="modal-overlay"
        @click.self="handleOverlayClick"
      >
        <div
          class="modal"
          :class="[`modal--${size}`]"
          role="dialog"
          aria-modal="true"
        >
          <div class="modal-header">
            <slot name="header">
              <!-- AI-Hint: Fallback a título por defecto si no se proporciona slot header | Mantiene compatibilidad con uso existente -->
              <h2 class="modal-title">{{ title }}</h2>
            </slot>
            <button
              type="button"
              class="modal-close"
              aria-label="Cerrar"
              @click="close"
            >
              <X :size="20" />
            </button>
          </div>

          <div class="modal-body">
            <slot />
          </div>

          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import "./Modal.css";
import { watch } from "vue";
import { X } from "lucide-vue-next";

interface Props {
  modelValue: boolean;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl";
  closeOnOverlay?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: "md",
  closeOnOverlay: true,
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

function close() {
  emit("update:modelValue", false);
}

function handleOverlayClick() {
  if (props.closeOnOverlay) {
    close();
  }
}

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }
);
</script>
