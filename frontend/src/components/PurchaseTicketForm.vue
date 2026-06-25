<template>
    <div class="vacation-form">  

        <h1>{{ticket.itemName}}</h1>

        <em> Заявки на покупку </em>

        <div>Количество: {{ ticket.quantity }}</div>
        <div>Цена:  {{ ticket.price }}</div>
        <div>Причина покупки: {{ ticket.reason }}</div>
    </div>
</template>

<script setup>
const props = defineProps({
        ticket: {
            type: Object,
            required: true
        }
    })
console.log(props)
</script>