import { apiClient } from "../client";

type TicketPurchase = {
        ticketType: 'purchase',
        itemName:  string,
        quantity: number  | null,
        price: number  | null,
        reason: string| null,
}
type TicketVacation = {
        ticketType: 'vacation',
        startDate: string,
        endDate: string,
        reason: string,
}
export type CreateTicket = TicketPurchase | TicketVacation

export const ticketApi = {
    getTickets:() => apiClient.get('/api/tickets'),
    getTicket:(id:number) => apiClient.get(`/api/tickets/${id}`),
    createTicket:(data:CreateTicket) => apiClient.post('/api/tickets', data)
} 