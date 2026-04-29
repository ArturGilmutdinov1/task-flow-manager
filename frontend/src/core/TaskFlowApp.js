import layoutTemplate from "../components/layout.html?raw";
import { AppState } from "../state/appState.js";
import { MockApi } from "../api/mockApi.js";
import { getRouteFromHash, navigateTo } from "./router.js";
import { renderLogin } from "../components/login.js";
import { renderTickets } from "../components/tickets.js";
import { renderCreateTicket } from "../components/create-ticket.js";
import { renderTicketDetails, renderTicketNotFound } from "../components/ticket-details.js";
import { renderNotFound } from "../components/not-found.js";

export class TaskFlowApp {
  constructor(rootElement) {
    this.root = rootElement;
    this.state = new AppState();
    this.api = new MockApi(this.state);
  }

  init() {
    window.addEventListener("hashchange", () => this.render());
    this.render();
  }

  render() {
    if (!this.root) return;

    const { path, query } = getRouteFromHash();
    this.root.innerHTML = layoutTemplate;
    const view = document.getElementById("view");

    if (path === "/login") {
      renderLogin({
        target: view,
        onLogin: (payload) => {
          this.api.login(payload);
          navigateTo("#/tickets");
        }
      });
      return;
    }

    if (path === "/tickets") {
      if (!this.state.currentUser) {
        navigateTo("#/login");
        return;
      }

      renderTickets({
        target: view,
        user: this.state.currentUser,
        tickets: this.api.listTickets(),
        onCreateDemoTicket: () => {
          this.api.createDemoTicket();
          this.render();
        }
      });
      return;
    }

    if (path === "/tickets/new") {
      if (!this.state.currentUser) {
        navigateTo("#/login");
        return;
      }

      renderCreateTicket({
        target: view,
        onCreateTicket: (payload) => {
          this.api.createTicket(payload);
          navigateTo("#/tickets");
        }
      });
      return;
    }

    if (path === "/ticket") {
      const ticket = this.state.tickets.find((item) => item.id === query.get("id"));
      if (!ticket) {
        renderTicketNotFound({ target: view });
        return;
      }
      renderTicketDetails({ target: view, ticket });
      return;
    }

    renderNotFound({ target: view });
  }
}
