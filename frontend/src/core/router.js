export function getRouteFromHash() {
  const hash = window.location.hash || "#/login";
  const [path, query] = hash.slice(1).split("?");
  return { path: path || "/login", query: new URLSearchParams(query || "") };
}

export function navigateTo(hash) {
  window.location.hash = hash;
}
