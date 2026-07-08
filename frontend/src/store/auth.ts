import { defineStore } from 'pinia';
import { ref } from 'vue';
import { userApi } from '@/api';


export interface User {
  id: string
  name: string
  role: string
}


export const useAuthStore = defineStore('authStore', () => {  
  const name = ref<string | null>(null)  
  const role = ref<string | null>(null)   
  

  //Войти или создать
  async function createUser(name:string, role:string) {
    const response = await userApi.createUser({name, role})
    const user = response.data;

    setUser(user);
  }

  // Запись
  function setUser(user: User): void {
    localStorage.setItem('tfm_current_user', JSON.stringify(user))
    name.value = user.name;
    role.value = user.role;
}
  
  // Удаление (выход)
  function removeUser(): void {
    localStorage.removeItem('tfm_current_user')
  }

  return { name, role, setUser, removeUser, createUser }     
})

