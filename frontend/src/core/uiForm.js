/** @param {HTMLElement | null | undefined} el */
export function setFormError(el, message) {
  if (!el) return;
  if (message) {
    el.textContent = message;
    el.hidden = false;
  } else {
    el.textContent = "";
    el.hidden = true;
  }
}

/** @param {HTMLFormElement | null | undefined} form */
export async function withDisabledSubmit(form, fn) {
  const btn = form?.querySelector('button[type="submit"]');
  if (btn) btn.disabled = true;
  try {
    return await fn();
  } finally {
    if (btn) btn.disabled = false;
  }
}
