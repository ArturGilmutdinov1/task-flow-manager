import ticketsTemplate from "./tickets.html?raw";
import { fillTemplate } from "../core/template.js";

export function renderTickets({ target, user, tickets, onCreateDemoTicket }) {
  const items = tickets
    .map((ticket) => {
      return `
        <li class="card ticket-row">
          <div>
            <b>${ticket.id}</b> · ${ticket.type}
            <div class="muted">Статус: ${ticket.status}</div>
          </div>
          <a href="#/ticket?id=${ticket.id}">Открыть</a>
        </li>
      `;
    })
    .join("");

  target.innerHTML = fillTemplate(ticketsTemplate, {
    userName: user.name,
    userRole: user.role,
    ticketItems: items || '<li class="muted">Пока нет заявок</li>'
  });

  target.querySelector("#seed-btn")?.addEventListener("click", onCreateDemoTicket);
}
