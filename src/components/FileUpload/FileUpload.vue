<template>
  <div class="file-upload">
    <input
      ref="fileInput"
      type="file"
      :accept="accept"
      class="file-upload-input"
      @change="handleFileChange"
    />
    <Button
      :variant="variant"
      :size="size"
      :loading="loading"
      :disabled="disabled || loading"
      @click="triggerFileInput"
    >
      <Upload :size="16" />
      <span>{{ label }}</span>
    </Button>
  </div>
</template>

<script setup lang="ts">
import './FileUpload.css'
import { ref } from 'vue'
import { Button } from '@components'
import { Upload } from 'lucide-vue-next'

interface Props {
  label?: string
  accept?: string
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  label: 'Cargar archivo',
  accept: '.csv',
  variant: 'secondary',
  size: 'md',
  loading: false,
  disabled: false
})

const emit = defineEmits<{
  (e: 'file-selected', file: File): void
}>()

const fileInput = ref<HTMLInputElement | null>(null)

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    emit('file-selected', file)
    target.value = ''
  }
}
</script>
