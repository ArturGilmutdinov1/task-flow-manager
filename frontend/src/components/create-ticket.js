import createTicketTemplate from "./create-ticket.html?raw";

export function renderCreateTicket({ target, onCreateTicket }) {
  target.innerHTML = createTicketTemplate;
  target.querySelector("#ticket-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onCreateTicket({
      type: String(formData.get("type")),
      reason: String(formData.get("reason"))
    });
  });
}
