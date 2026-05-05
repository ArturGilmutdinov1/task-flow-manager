const DEFAULT_BASE = "";

async function parseJsonResponse(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

export class TaskFlowApi {
  /**
   * @param {string} [baseUrl] — пустая строка: те же origin + прокси Vite (`/api` → backend)
   */
  constructor(baseUrl = DEFAULT_BASE) {
    this.baseUrl = String(baseUrl || "").replace(/\/$/, "");
  }

  _url(path) {
    const p = path.startsWith("/") ? path : `/${path}`;
    return `${this.baseUrl}${p}`;
  }

  async _request(path, { method = "GET", body } = {}) {
    const init = {
      method,
      headers: { Accept: "application/json" }
    };
    if (body !== undefined) {
      init.headers["Content-Type"] = "application/json";
      init.body = JSON.stringify(body);
    }
    const res = await fetch(this._url(path), init);
    const data = await parseJsonResponse(res);
    if (!res.ok) {
      const message = data?.message || data?.error || res.statusText || "Request failed";
      const err = new Error(message);
      err.status = res.status;
      err.body = data;
      throw err;
    }
    return data;
  }

  health() {
    return this._request("/health");
  }

  /** Вход по логину (имя) и роли: одна учётка на имя; другая роль обновляет текущую роль (тот же id). */
  signIn({ name, role }) {
    return this._request("/api/users", { method: "POST", body: { name, role } });
  }

  listUsers() {
    return this._request("/api/users");
  }

  getUser(id) {
    return this._request(`/api/users/${encodeURIComponent(id)}`);
  }

  listTickets({ userId, role } = {}) {
    const q = new URLSearchParams();
    if (userId) q.set("userId", userId);
    if (role) q.set("role", role);
    const qs = q.toString();
    return this._request(`/api/tickets${qs ? `?${qs}` : ""}`);
  }

  getTicket(id) {
    return this._request(`/api/tickets/${encodeURIComponent(id)}`);
  }

  createTicket({ type, formData, createdBy }) {
    return this._request("/api/tickets", { method: "POST", body: { type, formData, createdBy } });
  }

  submitTicket(ticketId, body) {
    return this._request(`/api/tickets/${encodeURIComponent(ticketId)}/submit`, {
      method: "POST",
      body
    });
  }

  forwardTicket(ticketId, body) {
    return this._request(`/api/tickets/${encodeURIComponent(ticketId)}/forward`, {
      method: "POST",
      body
    });
  }

  reworkTicket(ticketId, body) {
    return this._request(`/api/tickets/${encodeURIComponent(ticketId)}/rework`, {
      method: "POST",
      body
    });
  }

  approveTicket(ticketId, body) {
    return this._request(`/api/tickets/${encodeURIComponent(ticketId)}/approve`, {
      method: "POST",
      body
    });
  }

  rejectTicket(ticketId, body) {
    return this._request(`/api/tickets/${encodeURIComponent(ticketId)}/reject`, {
      method: "POST",
      body
    });
  }
}
