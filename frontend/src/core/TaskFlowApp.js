import { AppState } from "../state/appState.ts";
import { TaskFlowApi } from "../api/taskFlowApi.js";
import { renderLogin } from "../components/login.js";
import { renderTickets } from "../components/tickets.js";
import { renderCreateTicket } from "../components/create-ticket.js";
import { renderTicketDetails, renderTicketNotFound } from "../components/ticket-details.js";
import { renderNotFound } from "../components/not-found.js";
import { escapeHtml } from "./template.js";

const SESSION_KEY = "tfm_current_user";

const LAYOUT_HTML = `
<header class="topbar">
  <div class="brand">Task Flow Manager</div>
  <nav class="nav">
    <a href="#/login">Вход</a>
    <a href="#/tickets">Заявки</a>
    <a href="#/tickets/new">Создать</a>
    <a href="#/logout">Выйти</a>
  </nav>
</header>
<section class="container" id="view"></section>
`;

function getRouteFromHash() {
  const hash = window.location.hash || "#/login";
  const [path, query] = hash.slice(1).split("?");
  return { path: path || "/login", query: new URLSearchParams(query || "") };
}

function navigateTo(hash) {
  window.location.hash = hash;
}

export class TaskFlowApp {
  constructor(rootElement) {
    this.root = rootElement;
    this.state = new AppState();
    const base = import.meta.env.VITE_API_URL || "";
    this.api = new TaskFlowApi(base);
    this._restoreSession();
  }

  _restoreSession() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return;
      const user = JSON.parse(raw);
      if (user?.id && user?.role) {
        this.state.currentUser = user;
      }
    } catch {
      sessionStorage.removeItem(SESSION_KEY);
    }
  }

  _persistUser(user) {
    this.state.currentUser = user;
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }

  _clearSession() {
    this.state.currentUser = null;
    sessionStorage.removeItem(SESSION_KEY);
  }

  init() {
    window.addEventListener("hashchange", () => this.render());
    this.render();
  }

  render() {
    if (!this.root) return;

    const { path, query } = getRouteFromHash();

    if (path === "/logout") {
      this._clearSession();
      navigateTo("#/login");
      return;
    }

    this.root.innerHTML = LAYOUT_HTML;
    const view = document.getElementById("view");

    if (path === "/login") {
      renderLogin({
        target: view,
        onLogin: async (payload) => {
          const user = await this.api.signIn(payload);
          this._persistUser(user);
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
      this._renderTicketsLoading(view);
      return;
    }

    if (path === "/tickets/new") {
      if (!this.state.currentUser) {
        navigateTo("#/login");
        return;
      }
      renderCreateTicket({
        target: view,
        onCreateTicket: async ({ type, formData }) => {
          await this.api.createTicket({
            type,
            formData,
            createdBy: this.state.currentUser.id
          });
          navigateTo("#/tickets");
        }
      });
      return;
    }

    if (path === "/ticket") {
      const id = query.get("id");
      if (!id) {
        renderTicketNotFound({ target: view });
        return;
      }
      if (!this.state.currentUser) {
        navigateTo("#/login");
        return;
      }
      this._renderTicketDetailsLoading(view, id);
      return;
    }

    renderNotFound({ target: view });
  }

  _renderTicketsLoading(view) {
    view.innerHTML = `<p class="muted">Загрузка…</p>`;
    this.api
      .listTickets({
        userId: this.state.currentUser.id,
        role: this.state.currentUser.role
      })
      .then(({ items }) => {
        renderTickets({
          target: view,
          user: this.state.currentUser,
          tickets: items
        });
      })
      .catch((err) => {
        view.innerHTML = `<p class="error">${escapeHtml(err.message)}</p><p><a href="#/tickets">Обновить</a></p>`;
      });
  }

  _renderTicketDetailsLoading(view, ticketId) {
    const refreshDetails = async () => {
      view.innerHTML = `<p class="muted">Загрузка…</p>`;
      try {
        const fresh = await this.api.getTicket(ticketId);
        renderTicketDetails({
          target: view,
          ticket: fresh,
          currentUser: this.state.currentUser,
          api: this.api,
          onUpdated: refreshDetails
        });
      } catch {
        renderTicketNotFound({ target: view });
      }
    };

    view.innerHTML = `<p class="muted">Загрузка…</p>`;
    this.api
      .getTicket(ticketId)
      .then((ticket) => {
        renderTicketDetails({
          target: view,
          ticket,
          currentUser: this.state.currentUser,
          api: this.api,
          onUpdated: refreshDetails
        });
      })
      .catch(() => {
        renderTicketNotFound({ target: view });
      });
  }
}
