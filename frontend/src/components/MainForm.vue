<template>
    <RouterLink to="/create-ticket" > Создать карточку</RouterLink>
    <button @click="add">тест</button>
    <section>
        <article>
             
        </article>
    </section>
</template>


<script setup lang="ts">
import { ticketApi } from '@/api';
import { log } from 'node:console';

    async function add(){
        const result = await ticketApi.getTickets()

        console.log(result);
        
    }
</script>

