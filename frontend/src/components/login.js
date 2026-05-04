import { setFormError, withDisabledSubmit } from "../core/uiForm.js";

const LOGIN_HTML = `
<h1>Вход по роли</h1>
<p class="muted">Один логин и роль на сервере — одна учётная запись; при повторном входе те же заявки. Backend на порту 3000.</p>
<p id="login-error" class="error" hidden></p>
<form id="login-form" class="card form">
  <label>Логин <input name="name" required placeholder="Например, артур" autocomplete="username" /></label>
  <label>Роль
    <select name="role" required>
      <option value="requester">Заявитель</option>
      <option value="operator">Оператор</option>
      <option value="manager">Руководитель</option>
    </select>
  </label>
  <button type="submit">Войти</button>
</form>
`;

export function renderLogin({ target, onLogin }) {
  target.innerHTML = LOGIN_HTML;
  const form = target.querySelector("#login-form");
  const errEl = target.querySelector("#login-error");

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    setFormError(errEl, "");
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name")),
      role: String(fd.get("role"))
    };
    await withDisabledSubmit(form, async () => {
      try {
        await onLogin(payload);
      } catch (e) {
        setFormError(errEl, e.message || "Не удалось войти");
      }
    });
  });
}
