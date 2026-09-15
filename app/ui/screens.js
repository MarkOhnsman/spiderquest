export function $(id) {
  return document.getElementById(id);
}

const SCREENS = ["screen-title", "screen-hub", "screen-training"];

export function showScreen(id) {
  for (const s of SCREENS) {
    const el = $(s);
    if (el) el.classList.toggle("active", s === id);
  }
}

const TABS = ["today", "records", "codex"];

export function showTab(tab, hooks = {}) {
  for (const t of TABS) {
    const panel = $(`tab-${t}`);
    if (panel) panel.classList.toggle("active", t === tab);
    const btn = $(`tab-${t}-btn`);
    if (btn) btn.classList.toggle("active", t === tab);
  }
  if (typeof hooks[tab] === "function") hooks[tab]();
}
