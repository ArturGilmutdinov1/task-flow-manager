<template>
    <section>
        <form>
            <label>
                Тип заявки
                <select v-model="ticketType">
                    <option v-for="ticket of ticketsType" :value="ticket.value">
                        {{ticket.text}}
                    </option>
                </select>
            </label>

            <CreateTicketPurchase v-if="ticketType==='purchase'" @response="(childFormData) => formData = childFormData"/>
            <CreateTicketVacation v-if="ticketType==='vacation'" @response="(childFormData) => formData = childFormData"/>

            <button @click="createTicket()">Отправить</button>
        </form>
    </section>
</template>


<script setup lang="ts">
    import { ref } from 'vue';
    import CreateTicketPurchase from './CreateTicketPurchase.vue';
    import CreateTicketVacation from './CreateTicketVacation.vue';
    import type { CreateTicket } from '@/api'

    const ticketsType = ref([
        { text: 'Покупка', value: 'purchase' },
        { text: 'Отпуск', value: 'vacation' },
        ])
    
    const formData = ref({})
    const ticketType = ref('')

    function createTicket() {
        const params = {
            ticketType: ticketType.value,
            ...formData.value
        }

        console.log(params);
        
    }

</script>

