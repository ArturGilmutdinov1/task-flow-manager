import ticketDetailsTemplate from "./ticket-details.html?raw";
import { fillTemplate } from "../core/template.js";

export function renderTicketDetails({ target, ticket }) {
  target.innerHTML = fillTemplate(ticketDetailsTemplate, {
    id: ticket.id,
    type: ticket.type,
    status: ticket.status,
    createdBy: ticket.createdBy,
    reason: ticket.formData.reason || "-"
  });
}

export function renderTicketNotFound({ target }) {
  target.innerHTML = `<h1>Заявка не найдена</h1><a href="#/tickets">Назад к списку</a>`;
}
