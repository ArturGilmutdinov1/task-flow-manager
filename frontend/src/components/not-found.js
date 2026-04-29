import notFoundTemplate from "./not-found.html?raw";

export function renderNotFound({ target }) {
  target.innerHTML = notFoundTemplate;
}
