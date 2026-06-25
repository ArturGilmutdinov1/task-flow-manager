<template>
    <section>
        <component 
            v-if="ticketData && ticketComponent" 
            :is="ticketComponent" 
            :ticket="ticketData"
        />
    </section>
</template>


<script setup lang="ts">
import { ticketApi } from '@/api';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import PurchaseTicketForm from './PurchaseTicketForm.vue';
import VacationTicketForm from './VacationTicketForm.vue';

    const route = useRoute();

    const ticketId = String(route.params.id);
    const typeTicket = ref<string | null>(null);
    const ticketData = ref(null);

    const ticketComponent = computed(() => { 
               return typeTicket.value === 'purchase'? PurchaseTicketForm: VacationTicketForm;
            })

    onMounted(() =>{
        ticketApi.getTicket(ticketId).then((responce) => {
            typeTicket.value = responce.data.type;
            ticketData.value = responce.data.formData;
            console.log(ticketData.value);
            
        })
    })
</script>

