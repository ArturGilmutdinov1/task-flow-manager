<template>
    <div class="purchase-form">  

        <h1>{{ticket.itemName}}</h1>

        <em>Заявка на покупку</em>

        <div>Количество: {{ ticket.quantity }}</div>
        <div>Цена:  {{ ticket.price }}</div>
        <div>Причина покупки: {{ ticket.reason }}</div>
    </div>
</template>

<script setup lang="ts">
    import type { PurchaseFormData } from './CreateTicketPurchase.vue';

    defineProps<{
        ticket: PurchaseFormData
    }>()
</script>