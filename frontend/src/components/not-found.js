export function renderNotFound({ target }) {
  target.innerHTML = `
    <h1>404</h1>
    <p>Страница не найдена</p>
    <a href="#/login">На главную</a>
  `;
}
