<template>
    <header>
        <RouterLink to="/">Домой</RouterLink>
        <a href="#" @click.prevent="removeLocalStorage">Выход</a>
    </header>
</template>


<script setup lang="ts">
    import { useRoute, useRouter } from 'vue-router';
    const router = useRouter();

    function removeLocalStorage() {
        localStorage.removeItem('tfm_current_user')
        router.push('/login');
    }
</script>

