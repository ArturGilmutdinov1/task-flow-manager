<template>
        <label> Причина отпуска <input v-model="formData.itemName" autocomplete="off" /></label>
        <label>Дата начала <input v-model="formData.startDate" type="date" required /></label>
        <label>Дата окончания <input v-model="formData.endDate" type="date" required /></label>
</template>


<script setup lang="ts">
    import { ref, watch } from 'vue';
    
    export type VacationFormData = {
        itemName: string;
        startDate: string;
        endDate: string;
    }

    const formData = ref<VacationFormData>({
        itemName: '',
        startDate:  '',
        endDate: '',
    })

    const emit = defineEmits(['response'])
    // генерация события с параметром
    watch(formData, (newValue) => { emit('response', { ...newValue })}, { deep: true })


</script>
