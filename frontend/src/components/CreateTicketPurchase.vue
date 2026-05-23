<template>
    <form>
        <label>Наименование товара <input v-model="itemName" autocomplete="off" /></label>
        <label>Количество <input v-model="quantity" inputmode="numeric" autocomplete="off" /></label>
        <label>Цена <input v-model="price" inputmode="decimal" autocomplete="off" /></label>
        <label>Причина / обоснование <textarea v-model="reason" placeholder="Зачем нужна закупка"></textarea></label>
    </form>
</template>


<script setup lang="ts">
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';

    const router = useRouter();
    const itemName = ref('');
    const quantity = ref('');
    const price = ref('');
    const reason = ref('');

</script>
