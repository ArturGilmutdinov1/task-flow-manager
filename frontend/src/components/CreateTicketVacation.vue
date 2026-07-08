<template>
  <div class="form-grid">
    <div class="field field--full">
      <label class="field-label">Причина / название отпуска</label>
      <input v-model="formData.itemName" autocomplete="off" placeholder="Ежегодный отпуск" />
    </div>

    <div class="field">
      <label class="field-label">Дата начала</label>
      <input v-model="formData.startDate" type="date" required />
    </div>

    <div class="field">
      <label class="field-label">Дата окончания</label>
      <input v-model="formData.endDate" type="date" required />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

export type VacationFormData = {
  itemName: string
  startDate: string
  endDate: string
  reason: string | null
}

const formData = ref<VacationFormData>({
  itemName: '',
  startDate: '',
  endDate: '',
  reason: ' ',
})

const emit = defineEmits(['response'])
watch(formData, (newValue) => emit('response', { ...newValue }), { deep: true })
</script>
