import { escapeHtml } from "../core/template.js";
import { labelType, labelStatus, labelAction } from "../constants/labels.js";
import { FORM_FIELD_KEYS_BY_TYPE, labelFormField } from "../constants/formFields.js";
import { setFormError } from "../core/uiForm.js";

const TERMINAL = new Set(["approved", "rejected"]);

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString();
}

function buildFormRows(formData, ticketType) {
  const data = formData || {};
  const keys =
    ticketType && FORM_FIELD_KEYS_BY_TYPE[ticketType]
      ? FORM_FIELD_KEYS_BY_TYPE[ticketType]
      : Object.keys(data);
  const rows = keys
    .map((key) => {
      const val = data[key];
      if (val === undefined || val === null || val === "") {
        return null;
      }
      return `<tr><th scope="row">${escapeHtml(labelFormField(key))}</th><td>${escapeHtml(String(val))}</td></tr>`;
    })
    .filter(Boolean);

  if (!rows.length) {
    return '<tr><td colspan="2" class="muted">Нет данных формы</td></tr>';
  }
  return rows.join("");
}

function buildHistory(history) {
  const items = Array.isArray(history) ? history : [];
  if (!items.length) {
    return '<p class="muted">История пуста</p>';
  }
  return `<ul class="history-list">${items
    .map((h) => {
      const actionLabel = labelAction(h.action);
      const at = formatDate(h.at);
      const comment = h.comment ? escapeHtml(h.comment) : "—";
      const to = h.toStatus ? labelStatus(h.toStatus) : "—";
      return `<li class="card history-item"><b>${escapeHtml(actionLabel)}</b> · ${escapeHtml(at)}<br/>
        <span class="muted">Актор:</span> ${escapeHtml(h.actorId || "—")}<br/>
        <span class="muted">Комментарий:</span> ${comment}<br/>
        <span class="muted">Статус:</span> ${escapeHtml(to)}</li>`;
    })
    .join("")}</ul>`;
}

function getAvailableActions(ticket, user) {
  const { status } = ticket;
  const { role } = user;
  const actions = [];
  if (TERMINAL.has(status)) return actions;

  if ((status === "draft" || status === "rework") && role === "requester") {
    actions.push({ key: "submit", label: "Подать на рассмотрение", requiresComment: false });
  }
  if (status === "pending_operator" && role === "operator") {
    actions.push({ key: "forward", label: "Передать руководителю", requiresComment: false });
    actions.push({ key: "rework", label: "Вернуть на доработку", requiresComment: true });
  }
  if (status === "pending_manager" && role === "manager") {
    actions.push({ key: "approve", label: "Согласовать", requiresComment: false });
    actions.push({ key: "reject", label: "Отклонить", requiresComment: true });
  }
  return actions;
}

function runTicketTransition(api, key, ticketId, body) {
  const handlers = {
    submit: () => api.submitTicket(ticketId, body),
    forward: () => api.forwardTicket(ticketId, body),
    rework: () => api.reworkTicket(ticketId, body),
    approve: () => api.approveTicket(ticketId, body),
    reject: () => api.rejectTicket(ticketId, body)
  };
  const run = handlers[key];
  if (!run) return Promise.reject(new Error("Неизвестное действие"));
  return run();
}

export function renderTicketDetails({ target, ticket, currentUser, api, onUpdated }) {
  const actions = getAvailableActions(ticket, currentUser);
  const anyActionRequiresComment = actions.some((a) => a.requiresComment);
  const actionsHtml =
    actions.length === 0
      ? '<p class="muted">Нет доступных действий для этой роли и статуса.</p>'
      : `<div class="actions-row">${actions
          .map(
            (a) =>
              `<button type="button" class="action-btn" data-action="${escapeHtml(a.key)}">${escapeHtml(
                a.label
              )}</button>`
          )
          .join("")}</div>`;

  const commentBlock =
    actions.length > 0 && anyActionRequiresComment
      ? `<label>Комментарий (обязателен для «Вернуть на доработку» и «Отклонить»)
        <textarea id="ticket-action-comment" rows="3" placeholder="Комментарий"></textarea>
      </label>`
      : "";

  target.innerHTML = `
    <h1>Заявка ${escapeHtml(ticket.id)}</h1>
    <div class="card ticket-meta">
      <p><b>Тип:</b> ${escapeHtml(labelType(ticket.type))}</p>
      <p><b>Статус:</b> ${escapeHtml(labelStatus(ticket.status))}</p>
      <p><b>Автор (id):</b> ${escapeHtml(ticket.createdBy)}</p>
      <p><b>Создана:</b> ${escapeHtml(formatDate(ticket.createdAt))}</p>
      <p><b>Обновлена:</b> ${escapeHtml(formatDate(ticket.updatedAt))}</p>
    </div>
    <h2>Данные формы</h2>
    <div class="card">
      <table>
        <tbody>${buildFormRows(ticket.formData, ticket.type)}</tbody>
      </table>
    </div>
    <h2>История</h2>
    ${buildHistory(ticket.history)}
    <h2>Действия</h2>
    <div class="card actions-panel">
      ${actionsHtml}
      ${commentBlock}
      <p id="ticket-action-error" class="error" hidden></p>
    </div>
    <p><a href="#/tickets">Назад к списку</a></p>
  `;

  const errEl = target.querySelector("#ticket-action-error");
  const commentEl = target.querySelector("#ticket-action-comment");

  target.querySelectorAll(".action-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const key = btn.getAttribute("data-action");
      const def = actions.find((a) => a.key === key);
      const comment = (commentEl?.value || "").trim();
      if (def?.requiresComment && !comment) {
        setFormError(errEl, "Для этого действия нужен комментарий.");
        return;
      }
      setFormError(errEl, "");
      const body = { actorId: currentUser.id, actorRole: currentUser.role };
      if (comment) body.comment = comment;
      btn.disabled = true;
      try {
        await runTicketTransition(api, key, ticket.id, body);
        await onUpdated();
      } catch (e) {
        setFormError(errEl, e.message || "Ошибка");
      } finally {
        btn.disabled = false;
      }
    });
  });
}

export function renderTicketNotFound({ target }) {
  target.innerHTML = `<h1>Заявка не найдена</h1><p><a href="#/tickets">Назад к списку</a></p>`;
}
