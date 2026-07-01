<template>
    <div class="vacation-form">  
        <h1>{{ ticket.itemName }}</h1>

        <em> Заявка на отпуск </em>
        с <time datetime="startDate">{{ ticket.startDate }}</time> по <time datetime="endDate">{{ ticket.endDate }}</time>
    </div>
</template>

<script setup>
    const props = defineProps({
        ticket: {
            type: Object,
            required: true
        }
    })

</script>