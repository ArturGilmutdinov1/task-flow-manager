import { escapeHtml } from "../core/template.js";
import { labelType, labelStatus, labelRole } from "../constants/labels.js";

export function renderTickets({ target, user, tickets }) {
  const items = tickets
    .map((ticket) => {
      const id = escapeHtml(ticket.id);
      const type = escapeHtml(labelType(ticket.type));
      const status = escapeHtml(labelStatus(ticket.status));
      return `
        <li class="card ticket-row">
          <div>
            <b>${id}</b> · ${type}
            <div class="muted">Статус: ${status}</div>
          </div>
          <a href="#/ticket?id=${encodeURIComponent(ticket.id)}">Открыть</a>
        </li>
      `;
    })
    .join("");

  const userName = escapeHtml(user.name);
  const userRole = escapeHtml(labelRole(user.role));
  const ticketItems = items || '<li class="muted">Пока нет заявок</li>';

  target.innerHTML = `
    <h1>Заявки</h1>
    <p class="muted">Текущий пользователь: ${userName} (${userRole})</p>
    <div class="actions">
      <a class="button-link" href="#/tickets/new">Создать новую</a>
    </div>
    <ul class="list">${ticketItems}</ul>
  `;
}
