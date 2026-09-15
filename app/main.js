import { state } from "./state/AppState.js";
import { $, showScreen, showTab } from "./ui/screens.js";
import {
  refreshHub,
  renderRecords,
  renderCodex,
  renderSessionPreview,
  showComplete,
  hideComplete,
} from "./ui/hub.js";
import SessionController from "./SessionController.js";
import WarmupService from "./services/WarmupService.js";
import PowerService from "./services/PowerService.js";
import FlexService from "./services/FlexService.js";
import { installConsole } from "./console.js";
import { sound } from "./utils/audio.js";

const warmup = new WarmupService(state);
const power = new PowerService(state);
const flex = new FlexService(state);

function onPhaseChange(_phaseName, _session) {
  // Each service paints its own drill-* elements; nothing extra needed here yet.
}

function onFinish(result) {
  showScreen("screen-hub");
  refreshHub();
  showComplete(result);
}

const controller = new SessionController(state, { warmup, power, flex }, { onPhaseChange, onFinish });

function updateSoundButton() {
  const btn = $("sound-toggle-btn");
  if (btn) btn.textContent = sound.on ? "🔊" : "🔇";
}

$("start-btn").addEventListener("click", () => {
  const name = $("hero-name-input").value.trim();
  if (!name) return;
  state.loadHero(name);
  refreshHub();
  showScreen("screen-hub");
});

$("begin-trial-btn").addEventListener("click", () => {
  if (state.isLockedToday()) return;
  showScreen("screen-training");
  controller.begin();
});

$("skip-today-btn").addEventListener("click", () => {
  state.skipToday();
  refreshHub();
});

$("tab-today-btn").addEventListener("click", () => {
  showTab("today", { today: renderSessionPreview, records: renderRecords, codex: renderCodex });
});
$("tab-records-btn").addEventListener("click", () => {
  showTab("records", { today: renderSessionPreview, records: renderRecords, codex: renderCodex });
});
$("tab-codex-btn").addEventListener("click", () => {
  showTab("codex", { today: renderSessionPreview, records: renderRecords, codex: renderCodex });
});

$("sound-toggle-btn").addEventListener("click", () => {
  sound.unlock();
  sound.toggle();
  updateSoundButton();
});

$("drill-action-btn").addEventListener("click", () => {
  const active = controller.activeService();
  if (active && typeof active.handleAction === "function") active.handleAction();
});

$("complete-close-btn").addEventListener("click", () => {
  hideComplete();
});

installConsole({ state, refreshHub });
updateSoundButton();

if (state.loadActiveHero()) {
  showScreen("screen-hub");
  refreshHub();
} else {
  showScreen("screen-title");
}
