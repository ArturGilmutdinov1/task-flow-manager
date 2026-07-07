<template>
    <RouterLink to="/create-ticket" > Создать карточку</RouterLink>
    <section>
        <article v-for="ticket of ticketsStore.tickets" :key="ticket.id">
            <RouterLink :to="`/ticket/${ticket.id}`">
              {{ ticket.formData?.itemName }}
            </RouterLink>       
        </article>
    </section>
</template>


<script setup lang="ts">
    import { useTicketsStore } from '@/store/ticket';
    import { ref } from 'vue';
    import { onMounted } from 'vue';

    const ticketsStore = useTicketsStore();

    onMounted(() => {
        ticketsStore.getTickets();
    })
</script>

