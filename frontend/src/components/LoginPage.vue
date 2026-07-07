<template>
    <section>
        <h1>
            Вход по роли
        </h1>
        <form>
            <label for="name">Логин <input v-model="form.name" placeholder="Например, артур" /></label>
            <label>Роль
                <select v-model="form.role" required>
                    <option value="requester">Заявитель</option>
                    <option value="operator">Оператор</option>
                    <option value="manager">Руководитель</option>
                </select>
           </label>
        <button type="button" @click="createUser">Войти</button>
        </form>
    </section>
</template>


<script setup lang="ts">
    import { useAuthStore } from '@/store/auth';
    import { ref } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
     
    const router = useRouter();
    const route = useRoute();
    
    const authStore = useAuthStore()

    const form = ref({
        name: '',
        role: 'requester' as 'requester' | 'operator' | 'manager'
    });

    async function createUser() {
        await authStore.createUser( form.value.name, form.value.role)

        const redirect = route.query.redirect?.toString() || '/'
        router.push(redirect);
    }

</script>