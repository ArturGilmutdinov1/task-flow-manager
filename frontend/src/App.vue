<template>
  <div class="app-shell">
    <AppHeader v-if="showHeader" />
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import { computed } from 'vue'

const route = useRoute()

const showHeader = computed(() => {
  const hiddenRoutes = ['/login']
  return !hiddenRoutes.includes(route.path)
})
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
