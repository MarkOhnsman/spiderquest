import { STREAK_MULTIPLIER_TIERS, MAX_GAP_WALK, STORAGE_PREFIX } from "../data/config.js";

const DAY_OFFSET_KEY = `${STORAGE_PREFIX}_dev_dayOffset`;

function pad(n) {
  return String(n).padStart(2, "0");
}

// Test cheat (web.nextDay in console.js): shifts "today" forward by n days.
// Persisted so a reload doesn't jump back behind already-saved dates.
export function getDayOffset() {
  try {
    return parseInt(localStorage.getItem(DAY_OFFSET_KEY), 10) || 0;
  } catch {
    return 0;
  }
}

export function setDayOffset(n) {
  try {
    if (n) localStorage.setItem(DAY_OFFSET_KEY, String(n));
    else localStorage.removeItem(DAY_OFFSET_KEY);
  } catch {
    // ignore storage failures
  }
}

// Local (not UTC) date string, so a streak day always matches the kid's own calendar day.
export function todayStr() {
  const d = new Date();
  d.setDate(d.getDate() + getDayOffset());
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function addDaysStr(dateStr, n) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + n);
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
}

export function daysBetweenStr(a, b) {
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  const da = new Date(ay, am - 1, ad);
  const db = new Date(by, bm - 1, bd);
  return Math.round((db - da) / 86400000);
}

export function nextStreak(prevStreak, lastCompletedDate, skippedDates, today) {
  if (!lastCompletedDate) return 1;
  const gap = daysBetweenStr(lastCompletedDate, today);
  if (gap <= 0) return prevStreak;
  if (gap === 1) return prevStreak + 1;
  if (gap > MAX_GAP_WALK) return 1;
  for (let i = 1; i < gap; i++) {
    const day = addDaysStr(lastCompletedDate, i);
    if (!skippedDates.includes(day)) return 1;
  }
  return prevStreak + 1;
}

export function multiplierForStreak(streak) {
  for (const tier of STREAK_MULTIPLIER_TIERS) {
    if (streak >= tier.minStreak) return tier.mult;
  }
  return 1;
}
