<template>
    <form>
        <label>Дата начала <input v-modele="startDate" type="date" required /></label>
        <label>Дата окончания <input v-modele="endDate" type="date" required /></label>
        <label>Причина / комментарий <textarea v-modele="reason" required placeholder="Комментарий к отпуску"></textarea></label>
    </form>
</template>


<script setup lang="ts">
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';

    const router = useRouter();
    const startDate = ref('');
    const endDate = ref('');
    const reason = ref('');

</script>
