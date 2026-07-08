<template>
  <div class="auth-page">
    <section class="auth-card">
      <div class="auth-card__brand">
        <div class="auth-card__logo">TF</div>
        <h1>Вход в систему</h1>
        <p>Выберите роль и введите имя, чтобы продолжить работу с заявками.</p>
      </div>

      <form class="card card--padded form" @submit.prevent="createUser">
        <div class="field">
          <label class="field-label" for="name">Имя пользователя</label>
          <input
            id="name"
            v-model="form.name"
            placeholder="Например, Артур"
            autocomplete="username"
            required
          />
        </div>

        <div class="field">
          <label class="field-label" for="role">Роль</label>
          <select id="role" v-model="form.role" required>
            <option value="requester">Заявитель</option>
            <option value="operator">Оператор</option>
            <option value="manager">Руководитель</option>
          </select>
        </div>

        <button type="submit" class="btn btn--primary">Войти</button>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = ref({
  name: '',
  role: 'requester' as 'requester' | 'operator' | 'manager',
})

async function createUser() {
  await authStore.createUser(form.value.name, form.value.role)

  const redirect = route.query.redirect?.toString() || '/'
  router.push(redirect)
}
</script>

<style scoped>
.auth-card__brand p {
  margin-top: var(--space-2);
}
</style>
