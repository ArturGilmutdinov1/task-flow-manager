<template>
  <div class="page not-found">
    <div class="not-found__code">404</div>
    <h1>Страница не найдена</h1>
    <p class="page-header__subtitle">
      Запрошенный адрес не существует или был перемещён.
    </p>
    <RouterLink to="/" class="btn btn--primary">На главную</RouterLink>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  padding-top: var(--space-10);
}
</style>
