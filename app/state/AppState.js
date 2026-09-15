import { STORAGE_PREFIX, POINTS_PER_RECORD, RECORD_BONUS_XP } from "../data/config.js";
import { todayStr, nextStreak, multiplierForStreak } from "./streak.js";

const ACTIVE_KEY = `${STORAGE_PREFIX}-active`;

function freshState() {
  return {
    heroName: "",
    sessionsCompleted: 0,
    totalXP: 0,
    points: 0,
    holdBests: {},
    holdHistory: [],
    repBests: {},
    repHistory: [],
    lastCompletedDate: null,
    currentStreak: 0,
    skippedDates: [],
    history: [],
  };
}

class AppState {
  constructor() {
    Object.assign(this, freshState());
    this._sessionPointsEarned = 0; // transient, never persisted
  }

  _bucketKey(name) {
    return `${STORAGE_PREFIX}-${name.toLowerCase()}`;
  }

  loadHero(name) {
    const defaults = freshState();
    let saved = {};
    try {
      const raw = localStorage.getItem(this._bucketKey(name));
      if (raw) saved = JSON.parse(raw);
    } catch {
      saved = {};
    }
    Object.assign(this, defaults, saved);
    this.heroName = name;
    try {
      localStorage.setItem(ACTIVE_KEY, name);
    } catch {
      // ignore
    }
    this.save();
  }

  hasActiveHero() {
    try {
      return !!localStorage.getItem(ACTIVE_KEY);
    } catch {
      return false;
    }
  }

  // Loads whichever hero the active-pointer key names, if any, into this
  // singleton. Returns true if a hero was loaded, false otherwise.
  loadActiveHero() {
    let name = null;
    try {
      name = localStorage.getItem(ACTIVE_KEY);
    } catch {
      name = null;
    }
    if (!name) return false;
    this.loadHero(name);
    return true;
  }

  save() {
    if (!this.heroName) return;
    const snapshot = {};
    for (const key of Object.keys(freshState())) {
      snapshot[key] = this[key];
    }
    try {
      localStorage.setItem(this._bucketKey(this.heroName), JSON.stringify(snapshot));
    } catch {
      // ignore storage failures
    }
  }

  completedToday() {
    return this.lastCompletedDate === todayStr();
  }

  skippedToday() {
    return this.skippedDates.includes(todayStr());
  }

  isLockedToday() {
    return this.completedToday() || this.skippedToday();
  }

  skipToday() {
    if (this.isLockedToday()) return false;
    this.skippedDates.push(todayStr());
    this.save();
    return true;
  }

  pointsMultiplierForToday() {
    const projected = nextStreak(this.currentStreak, this.lastCompletedDate, this.skippedDates, todayStr());
    return multiplierForStreak(projected);
  }

  recordHold(name, seconds) {
    const prevBest = this.holdBests[name] || 0;
    const beat = prevBest > 0 && seconds > prevBest;
    const isFirst = prevBest === 0;
    if (seconds > prevBest) this.holdBests[name] = seconds;
    this.holdHistory.push({ day: this.sessionsCompleted + 1, name, seconds });

    let pointsAwarded = 0;
    let xpAwarded = 0;
    if (beat) {
      pointsAwarded = Math.round(POINTS_PER_RECORD * this.pointsMultiplierForToday());
      this.points += pointsAwarded;
      xpAwarded = RECORD_BONUS_XP;
      this.totalXP += xpAwarded;
      this._sessionPointsEarned += pointsAwarded;
    }
    this.save();
    return { beat, isFirst, pointsAwarded, xpAwarded };
  }

  recordReps(name, reps) {
    const prevBest = this.repBests[name] || 0;
    const beat = prevBest > 0 && reps > prevBest;
    const isFirst = prevBest === 0;
    if (reps > prevBest) this.repBests[name] = reps;
    this.repHistory.push({ day: this.sessionsCompleted + 1, name, reps });

    let pointsAwarded = 0;
    let xpAwarded = 0;
    if (beat) {
      pointsAwarded = Math.round(POINTS_PER_RECORD * this.pointsMultiplierForToday());
      this.points += pointsAwarded;
      xpAwarded = RECORD_BONUS_XP;
      this.totalXP += xpAwarded;
      this._sessionPointsEarned += pointsAwarded;
    }
    this.save();
    return { beat, isFirst, pointsAwarded, xpAwarded };
  }

  addFlatXp(amount) {
    this.totalXP += amount;
    this.save();
  }

  completeSession(sessionXpEarned) {
    const pointsEarned = this._sessionPointsEarned || 0;
    this._sessionPointsEarned = 0;
    this.currentStreak = nextStreak(this.currentStreak, this.lastCompletedDate, this.skippedDates, todayStr());
    this.lastCompletedDate = todayStr();
    this.sessionsCompleted += 1;
    this.history.push({
      day: this.sessionsCompleted,
      date: this.lastCompletedDate,
      xpEarned: sessionXpEarned,
      pointsEarned,
    });
    this.save();
    return pointsEarned;
  }

  addPoints(n) {
    this.points += n;
    this.save();
  }

  spendPoints(n) {
    this.points = Math.max(0, this.points - n);
    this.save();
  }

  resetPoints() {
    this.points = 0;
    this.save();
  }
}

export const state = new AppState();
