<template>
  <div class="form-grid form-grid--single">
    <div class="field">
      <label class="field-label">Наименование товара</label>
      <input v-model="formData.itemName" autocomplete="off" placeholder="Например, ноутбук" />
    </div>

    <div class="field">
      <label class="field-label">Количество</label>
      <input
        v-model.number="formData.quantity"
        inputmode="numeric"
        autocomplete="off"
        placeholder="1"
      />
    </div>

    <div class="field">
      <label class="field-label">Цена, ₽</label>
      <input
        v-model.number="formData.price"
        inputmode="decimal"
        autocomplete="off"
        placeholder="50000"
      />
    </div>

    <div class="field field--full">
      <label class="field-label">Причина / обоснование</label>
      <textarea
        v-model="formData.reason"
        placeholder="Опишите, зачем нужна закупка"
      ></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

export type PurchaseFormData = {
  itemName: string
  quantity: number | null
  price: number | null
  reason: string | null
}

const formData = ref<PurchaseFormData>({
  itemName: '',
  quantity: null,
  price: null,
  reason: '',
})

const emit = defineEmits(['response'])
watch(formData, (newValue) => emit('response', { ...newValue }), { deep: true })
</script>
