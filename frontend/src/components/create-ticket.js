import { setFormError, withDisabledSubmit } from "../core/uiForm.js";

const COMPONENT_TAG = "create-ticket-form";

function getInitialState() {
  return {
    type: "purchase"
  };
}

function renderFieldsByType(type) {
  if (type === "vacation") {
    return `
      <label>Дата начала <input name="startDate" type="date" required /></label>
      <label>Дата окончания <input name="endDate" type="date" required /></label>
      <label>Причина / комментарий <textarea name="reason" required placeholder="Комментарий к отпуску"></textarea></label>
    `;
  }

  return `
    <label>Наименование товара <input name="itemName" autocomplete="off" required /></label>
    <label>Количество <input name="quantity" inputmode="numeric" autocomplete="off" required /></label>
    <label>Цена <input name="price" inputmode="decimal" autocomplete="off" required /></label>
    <label>Причина / обоснование <textarea name="reason" required placeholder="Зачем нужна закупка"></textarea></label>
  `;
}

function buildFormData(type, form) {
  const fd = new FormData(form);

  if (type === "vacation") {
    return {
      startDate: String(fd.get("startDate") || "").trim(),
      endDate: String(fd.get("endDate") || "").trim(),
      reason: String(fd.get("reason") || "").trim()
    };
  }

  return {
    itemName: String(fd.get("itemName") || "").trim(),
    quantity: String(fd.get("quantity") || "").trim(),
    price: String(fd.get("price") || "").trim(),
    reason: String(fd.get("reason") || "").trim()
  };
}

class CreateTicketFormElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.state = getInitialState();
    this.onCreateTicket = null;
  }

  connectedCallback() {
    this.render();
  }

  render() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }

        .form {
          display: grid;
          gap: 10px;
          max-width: 520px;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 10px;
          padding: 14px;
        }

        label {
          display: grid;
          gap: 6px;
        }

        input,
        textarea,
        select,
        button {
          font: inherit;
        }

        input,
        textarea,
        select {
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 8px 10px;
        }

        button {
          border: 1px solid #222;
          border-radius: 8px;
          background: #222;
          color: #fff;
          padding: 8px 12px;
          cursor: pointer;
          width: fit-content;
        }

        .field-group {
          display: grid;
          gap: 10px;
        }

        .error {
          color: #b00020;
          margin: 0 0 8px;
        }
      </style>

      <h1>Создание заявки</h1>
      <form id="ticket-form" class="form">
        <label>Тип
          <select name="type" id="ticket-type" required>
            <option value="purchase" ${this.state.type === "purchase" ? "selected" : ""}>Закупка</option>
            <option value="vacation" ${this.state.type === "vacation" ? "selected" : ""}>Отпуск</option>
          </select>
        </label>

        <div class="field-group" id="dynamic-fields">
          ${renderFieldsByType(this.state.type)}
        </div>

        <button type="submit">Создать</button>
        <p id="create-error" class="error" hidden></p>
      </form>
      <p><a href="#/tickets">Назад к списку</a></p>
    `;

    const typeSelect = this.shadowRoot.querySelector("#ticket-type");
    const form = this.shadowRoot.querySelector("#ticket-form");
    const errEl = this.shadowRoot.querySelector("#create-error");

    typeSelect?.addEventListener("change", (event) => {
      this.state = {
        ...this.state,
        type: String(event.target.value || "purchase")
      };
      this.render();
    });

    form?.addEventListener("submit", async (event) => {
      event.preventDefault();
      setFormError(errEl, "");

      const type = this.state.type;
      const formData = buildFormData(type, form);

      await withDisabledSubmit(form, async () => {
        try {
          await this.onCreateTicket?.({ type, formData });
        } catch (e) {
          setFormError(errEl, e.message || "Не удалось создать заявку");
        }
      });
    });
  }
}

if (!customElements.get(COMPONENT_TAG)) {
  customElements.define(COMPONENT_TAG, CreateTicketFormElement);
}

export function renderCreateTicket({ target, onCreateTicket }) {
  target.innerHTML = `<${COMPONENT_TAG}></${COMPONENT_TAG}>`;
  const element = target.querySelector(COMPONENT_TAG);
  if (element) {
    element.onCreateTicket = onCreateTicket;
  }
}
