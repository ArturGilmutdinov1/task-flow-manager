import { apiClient } from '../client.ts'

export type CreateUserData = {
    name: string,
    role: string
}

export const userApi = {
    getAllUsers: () => apiClient.get('/api/users'),
    getById: (id:Number) => apiClient.get(`/api/users/${id}`),
    createUser:(data:CreateUserData) => apiClient.post(`/api/users`, data),
} 
