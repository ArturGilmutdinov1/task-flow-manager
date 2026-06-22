// src/utils/storage.ts

export interface User {
  id: number
  name: string
}

export function getUser(): User | null {
  const raw = localStorage.getItem('tfm_current_user')
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

// Запись
export function setUser(user: User): void {
  localStorage.setItem('tfm_current_user', JSON.stringify(user))
}

// Удаление (выход)
export function removeUser(): void {
  localStorage.removeItem('tfm_current_user')
}

// При необходимости – универсальные функции для любых ключей
export function getStorageItem<T>(key: string): T | null {
  const raw = localStorage.getItem(key)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export function removeStorageItem(key: string): void {
  localStorage.removeItem(key)
}