import { STREAK_MULTIPLIER_TIERS, MAX_GAP_WALK } from "../data/config.js";

function pad(n) {
  return String(n).padStart(2, "0");
}

// Local (not UTC) date string, so a streak day always matches the kid's own calendar day.
export function todayStr() {
  const d = new Date();
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
