import { state } from "../state/AppState.js";
import { addDaysStr, todayStr } from "../state/streak.js";
import { RANKS, getRank, getNextRank } from "../data/ranks.js";
import { buildSession } from "../data/sessions.js";
import { STREAK_STRIP_DAYS, TOTAL_DAYS } from "../data/config.js";
import { $ } from "./screens.js";

export function renderHeader() {
  const rank = getRank(state.totalXP);
  const next = getNextRank(rank.level);
  const range = next ? next.minXP - rank.minXP : 500;
  const pct = Math.max(0, Math.min(100, ((state.totalXP - rank.minXP) / range) * 100));

  const badge = $("rank-badge");
  if (badge) badge.textContent = rank.name;

  const fill = $("xp-bar-fill");
  if (fill) fill.style.width = `${pct}%`;

  const streak = $("streak-count");
  if (streak) streak.textContent = `🔥 ${state.currentStreak}`;

  const points = $("points-balance");
  if (points) points.textContent = `🕸️ ${state.points}`;
}

export function renderStreakStrip() {
  const strip = $("streak-strip");
  if (!strip) return;
  strip.innerHTML = "";
  const today = todayStr();
  const trainedDates = new Set(state.history.map((h) => h.date));
  for (let offset = STREAK_STRIP_DAYS - 1; offset >= 0; offset--) {
    const dateStr = addDaysStr(today, -offset);
    const cell = document.createElement("div");
    cell.className = "streak-cell";
    if (trainedDates.has(dateStr)) cell.classList.add("trained");
    else if (state.skippedDates.includes(dateStr)) cell.classList.add("skipped");
    else cell.classList.add("blank");
    if (offset === 0) cell.classList.add("today");
    strip.appendChild(cell);
  }
}

export function renderSessionPreview() {
  const preview = $("session-preview");
  const beginBtn = $("begin-trial-btn");
  const skipBtn = $("skip-today-btn");
  if (!preview) return;

  if (state.isLockedToday()) {
    preview.textContent = state.completedToday()
      ? "Trained today! 🕷️ Come back tomorrow for your next mission."
      : "Skipped today — see you tomorrow, hero.";
    if (beginBtn) beginBtn.disabled = true;
    if (skipBtn) skipBtn.disabled = true;
    return;
  }

  const session = buildSession(state.sessionsCompleted + 1);
  const drillNames = [
    session.cardio.name,
    ...session.shapes.map((s) => s.name),
    ...session.strength.map((s) => s.name),
    ...session.flexibility.map((s) => s.name),
  ];
  preview.innerHTML =
    `<div class="session-label">Day ${state.sessionsCompleted + 1} of ${TOTAL_DAYS}: ${session.workoutLabel}</div>` +
    `<ul class="session-drill-list">${drillNames.map((n) => `<li>${n}</li>`).join("")}</ul>`;

  if (beginBtn) beginBtn.disabled = false;
  if (skipBtn) skipBtn.disabled = false;
}

function buildRecordCard(name, best, unit, history) {
  const attempts = history
    .filter((h) => h.name === name)
    .slice(-6)
    .reverse();
  const chips = attempts.map((a) => `<span class="record-chip">${a.seconds ?? a.reps}${unit}</span>`).join("");
  return `<div class="record-card"><div class="record-name">${name}</div><div class="record-best">Best: ${best}${unit}</div><div class="record-chips">${chips}</div></div>`;
}

export function renderRecords() {
  const list = $("records-list");
  if (!list) return;
  const holdCards = Object.keys(state.holdBests).map((name) =>
    buildRecordCard(name, state.holdBests[name], "s", state.holdHistory)
  );
  const repCards = Object.keys(state.repBests).map((name) =>
    buildRecordCard(name, state.repBests[name], " reps", state.repHistory)
  );
  const all = [...holdCards, ...repCards];
  list.innerHTML = all.length ? all.join("") : `<div class="empty-note">No records yet — finish a trial to start one!</div>`;
}

export function renderCodex() {
  const list = $("codex-list");
  if (!list) return;
  const rank = getRank(state.totalXP);
  list.innerHTML = RANKS.map((r) => {
    const unlocked = r.level <= rank.level;
    return `<div class="codex-row ${unlocked ? "unlocked" : "locked"}"><span class="codex-icon">${unlocked ? "🕸️" : "🔒"}</span><span class="codex-name">${r.name}</span><span class="codex-xp">${r.minXP} XP</span></div>`;
  }).join("");
}

export function showComplete(result) {
  const overlay = $("complete-overlay");
  if (!overlay) return;
  const day = $("complete-day");
  const workout = $("complete-workout");
  const xp = $("complete-xp");
  const points = $("complete-points");
  if (day) day.textContent = `Day ${result.day}`;
  if (workout) workout.textContent = result.workoutLabel;
  if (xp) xp.textContent = `+${result.xpEarned} XP`;
  if (points) points.textContent = `+${result.pointsEarned} 🕸️`;
  overlay.classList.remove("hidden");
}

export function hideComplete() {
  const overlay = $("complete-overlay");
  if (overlay) overlay.classList.add("hidden");
}

export function refreshHub() {
  renderHeader();
  renderStreakStrip();
  renderSessionPreview();
}
