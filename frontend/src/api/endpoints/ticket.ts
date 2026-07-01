import { apiClient } from "../client";

type TicketPurchase = {
        type: 'purchase',
        formData: {
                itemName:  string,
                quantity: number  | null,
                price: number  | null,
                reason: string| null
        }
        createdBy: number
}
type TicketVacation = {
        type: 'vacation',
        formData: {
                itemName: string,
                startDate: string,
                endDate: string,
                reason: string| null
        },
        createdBy: number
}
export type CreateTicket = TicketPurchase | TicketVacation 

export const ticketApi = {
    getTickets:() => apiClient.get('/api/tickets'),
    getTicket:(id:string) => apiClient.get(`/api/tickets/${id}`),
    createTicket:(data:CreateTicket) => apiClient.post('/api/tickets', data)
}