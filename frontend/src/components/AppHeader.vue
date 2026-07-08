<template>
  <header class="app-header">
    <div class="app-header__inner">
      <RouterLink to="/" class="app-header__brand">
        <span class="app-header__logo">TF</span>
        <span class="app-header__title">Task Flow</span>
      </RouterLink>

      <div class="app-header__actions">
        <div v-if="user" class="app-header__user">
          <span class="app-header__user-name">{{ user.name }}</span>
          <span class="badge badge--type">{{ roleLabel }}</span>
        </div>
        <button type="button" class="btn btn--ghost" @click="logout">Выход</button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { getUser } from '@/utils/storage'

const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => getUser())

const roleLabels: Record<string, string> = {
  requester: 'Заявитель',
  operator: 'Оператор',
  manager: 'Руководитель',
}

const roleLabel = computed(() => {
  const role = user.value?.role
  return role ? (roleLabels[role] ?? role) : ''
})

function logout() {
  authStore.removeUser()
  router.push('/login')
}
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--color-border);
}

.app-header__inner {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--space-6);
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
}

.app-header__brand {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  text-decoration: none;
  color: inherit;
}

.app-header__logo {
  width: 2.25rem;
  height: 2.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius);
  background: var(--color-primary);
  color: #fff;
  font-size: 0.8125rem;
  font-weight: 700;
}

.app-header__title {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.app-header__actions {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.app-header__user {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.app-header__user-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-muted);
}

@media (max-width: 720px) {
  .app-header__inner {
    padding: 0 var(--space-4);
  }

  .app-header__user-name {
    display: none;
  }
}
</style>
