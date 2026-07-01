<template>
    <RouterLink to="/create-ticket" > Создать карточку</RouterLink>
    <section>
        <article v-for="ticket of tickets" :key="ticket.id">
            <RouterLink :to="`/ticket/${ticket.id}`">
              {{ ticket.formData?.itemName }}
            </RouterLink>       
        </article>
    </section>
</template>


<script setup lang="ts">
import { ticketApi } from '@/api';
import { ref } from 'vue';
import { onMounted } from 'vue';

const tickets = ref([])

onMounted(() => {
    ticketApi.getTickets().then((responce) => {
        tickets.value = responce.data.items
    })
})
</script>

