import loginTemplate from "./login.html?raw";

export function renderLogin({ target, onLogin }) {
  target.innerHTML = loginTemplate;
  target.querySelector("#login-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onLogin({
      name: String(formData.get("name")),
      role: String(formData.get("role"))
    });
  });
}
