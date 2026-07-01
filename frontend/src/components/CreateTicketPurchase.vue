<template>
        <label>Наименование товара <input v-model="formData.itemName" autocomplete="off" /></label>
        <label>Количество <input v-model="formData.quantity" inputmode="numeric" autocomplete="off" /></label>
        <label>Цена <input v-model="formData.price" inputmode="decimal" autocomplete="off" /></label>
        <label>Причина / обоснование <textarea v-model="formData.reason" placeholder="Зачем нужна закупка"></textarea></label>
</template>


<script setup lang="ts">
    import { ref, watch } from 'vue';

    export type PurchaseFormData  = {
        itemName:  string;
        quantity: number  | null;
        price: number  | null;
        reason: string| null;
    }

    const formData = ref<PurchaseFormData>({
        itemName: '',
        quantity: null,
        price: null,
        reason: ''
    })

    const emit  = defineEmits(['response'])
    watch(formData, (newValue) => { emit('response', { ...newValue })}, { deep: true })


</script>
