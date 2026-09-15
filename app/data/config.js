// Central tuning knobs for spider-training. Change numbers here, not in the services.

export const STORAGE_PREFIX = "spiderquest_v1";
export const TOTAL_DAYS = 42; // 6 weeks, 14 full A/B/C cycles

export const PARENT_PASSWORD = "websling"; // not real security, just a speed bump

// Warm-Up & Shapes
export const CARDIO_DURATION_MS = 75000;
export const SHAPE_ROUNDS = 3;
export const SHAPE_HOLD_MS = 18000;
export const SHAPE_REST_MS = 8000;

// Strength & Conditioning
export const STRENGTH_ROUNDS = 2;
export const REP_WINDOW_MS = 45000;
export const REST_BETWEEN_MS = 15000;

// Flexibility & Mobility
export const STRETCH_HOLD_MS = 25000;

// Rewards
export const POINTS_PER_RECORD = 2;
export const RECORD_BONUS_XP = 20;
export const STREAK_MULTIPLIER_TIERS = [
  { minStreak: 7, mult: 2 },
  { minStreak: 3, mult: 1.5 },
  { minStreak: 1, mult: 1 },
];
export const MAX_GAP_WALK = 60;
export const STREAK_STRIP_DAYS = 30;

export const TONES = { cue: 660, leadIn: 523, go: 784, timeUp: 440, record: 880 };
