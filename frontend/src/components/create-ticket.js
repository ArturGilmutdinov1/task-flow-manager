import { setFormError, withDisabledSubmit } from "../core/uiForm.js";

const CREATE_TICKET_HTML = `
<h1>Создание заявки</h1>
<form id="ticket-form" class="card form">
  <label>Тип
    <select name="type" id="ticket-type" required>
      <option value="purchase">Закупка</option>
      <option value="vacation">Отпуск</option>
    </select>
  </label>

  <div id="fields-purchase" class="field-group">
    <label>Наименование товара <input name="itemName" autocomplete="off" /></label>
    <label>Количество <input name="quantity" inputmode="numeric" autocomplete="off" /></label>
    <label>Цена <input name="price" inputmode="decimal" autocomplete="off" /></label>
    <label>Причина / обоснование <textarea name="reasonPurchase" required placeholder="Зачем нужна закупка"></textarea></label>
  </div>

  <div id="fields-vacation" class="field-group" hidden>
    <label>Дата начала <input name="startDate" type="date" /></label>
    <label>Дата окончания <input name="endDate" type="date" /></label>
    <label>Причина / комментарий <textarea name="reasonVacation" placeholder="Комментарий к отпуску"></textarea></label>
  </div>

  <button type="submit">Создать</button>
  <p id="create-error" class="error" hidden></p>
</form>
<p><a href="#/tickets">Назад к списку</a></p>
`;

function syncTypeFields(root) {
  const typeSelect = root.querySelector("#ticket-type");
  const purchase = root.querySelector("#fields-purchase");
  const vacation = root.querySelector("#fields-vacation");
  const type = typeSelect?.value;
  if (type === "vacation") {
    purchase?.setAttribute("hidden", "");
    vacation?.removeAttribute("hidden");
    purchase?.querySelectorAll("input, textarea").forEach((el) => {
      if (el.name === "itemName" || el.name === "quantity" || el.name === "price") {
        el.required = false;
      }
    });
    vacation?.querySelector('[name="startDate"]')?.setAttribute("required", "");
    vacation?.querySelector('[name="endDate"]')?.setAttribute("required", "");
    vacation?.querySelector('[name="reasonVacation"]')?.setAttribute("required", "");
    purchase?.querySelector('[name="reasonPurchase"]')?.removeAttribute("required");
  } else {
    vacation?.setAttribute("hidden", "");
    purchase?.removeAttribute("hidden");
    purchase?.querySelector('[name="itemName"]')?.setAttribute("required", "");
    purchase?.querySelector('[name="quantity"]')?.setAttribute("required", "");
    purchase?.querySelector('[name="price"]')?.setAttribute("required", "");
    purchase?.querySelector('[name="reasonPurchase"]')?.setAttribute("required", "");
    vacation?.querySelectorAll("input, textarea").forEach((el) => el.removeAttribute("required"));
  }
}

export function renderCreateTicket({ target, onCreateTicket }) {
  target.innerHTML = CREATE_TICKET_HTML;
  syncTypeFields(target);

  const typeSelect = target.querySelector("#ticket-type");
  typeSelect?.addEventListener("change", () => syncTypeFields(target));

  const form = target.querySelector("#ticket-form");
  const errEl = target.querySelector("#create-error");

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    setFormError(errEl, "");
    const fd = new FormData(form);
    const type = String(fd.get("type"));
    const formData =
      type === "purchase"
        ? {
            itemName: String(fd.get("itemName") || "").trim(),
            quantity: String(fd.get("quantity") || "").trim(),
            price: String(fd.get("price") || "").trim(),
            reason: String(fd.get("reasonPurchase") || "").trim()
          }
        : {
            startDate: String(fd.get("startDate") || "").trim(),
            endDate: String(fd.get("endDate") || "").trim(),
            reason: String(fd.get("reasonVacation") || "").trim()
          };

    await withDisabledSubmit(form, async () => {
      try {
        await onCreateTicket({ type, formData });
      } catch (e) {
        setFormError(errEl, e.message || "Не удалось создать заявку");
      }
    });
  });
}
