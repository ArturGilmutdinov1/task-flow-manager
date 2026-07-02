<template>
    <header>
        <RouterLink to="/">Домой</RouterLink>
        <a href="#" @click.prevent="logout">Выход</a>
    </header>
</template>


<script setup lang="ts">
    import { useRouter } from 'vue-router';
    import { removeUser } from '@/utils/storage';

    const router = useRouter();

    function logout() {
        removeUser()
        router.push('/login');
    }
</script>

<style scoped>
header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-4);
    background: var(--color-gray-100);
    border-bottom: 1px solid var(--color-gray-300);
}

header a {
    color: var(--color-primary);
    text-decoration: none;
}

header a:hover {
    text-decoration: underline;
}
</style>

