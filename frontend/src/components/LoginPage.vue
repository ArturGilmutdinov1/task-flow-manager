<template>
    <section>
        <h1>
            Вход по роли
        </h1>
        <form>
            <label for="name">Логин <input v-model="name" placeholder="Например, артур" /></label>
            <label>Роль
                <select v-model="role" required>
                    <option value="requester">Заявитель</option>
                    <option value="operator">Оператор</option>
                    <option value="manager">Руководитель</option>
                </select>
           </label>
        </form>
    </section>
</template>


<script setup lang="ts">
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';

    const router = useRouter();
    const name = ref('');
    const role = ref('');


</script>