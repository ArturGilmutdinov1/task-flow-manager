<template>
        <label>Дата начала <input v-model="formData.startDate" type="date" required /></label>
        <label>Дата окончания <input v-model="formData.endDate" type="date" required /></label>
        <label>Причина / комментарий <textarea v-model="formData.reason" required placeholder="Комментарий к отпуску"></textarea></label>
</template>


<script setup lang="ts">
    import { ref, watch } from 'vue';

    interface FormData {
        startDate: string;
        endDate: string;
        reason: string;
    }

    const formData = ref<FormData>({
        startDate:  '',
        endDate: '',
        reason: '',
    })

    const emit = defineEmits(['response'])
    // генерация события с параметром
    watch(formData, (newValue) => { emit('response', { ...newValue })}, { deep: true })


</script>
