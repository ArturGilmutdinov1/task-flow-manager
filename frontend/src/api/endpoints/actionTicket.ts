import { apiClient } from "../client";

export type ActionData = {
        actorId: string,
        actorRole: string,
        comment: string
}

export const actionTicketApi = {
        submit: (id:string, data:ActionData) => apiClient.post(`/api/tickets/${id}/submit`, data),
        forward: (id:string, data:ActionData) => apiClient.post(`/api/tickets/${id}/forward`, data),
        rework: (id:string, data:ActionData) => apiClient.post(`/api/tickets/${id}/rework`, data),
        approve: (id:string, data:ActionData) => apiClient.post(`/api/tickets/${id}/approve`, data),
        reject: (id:string, data:ActionData) => apiClient.post(`/api/tickets/${id}/reject`, data),
}