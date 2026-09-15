import * as EX from "./exercises.js";

// A fixed 3-workout rotation (not randomized) — the user's own hand-picked
// "Sample Workout Mixes", cycled A -> B -> C -> A ... for the life of the program.
const WORKOUTS = [
  {
    label: "Core & Balance",
    cardio: EX.CARDIO_POOL.BEAR_CRAWLS,
    shapes: [EX.SHAPE_POOL.HOLLOW, EX.SHAPE_POOL.PIKE_SIT],
    strength: [EX.STRENGTH_POOL.WALL_HANDSTAND, EX.STRENGTH_POOL.CANDLESTICK, EX.STRENGTH_POOL.SINGLE_LEG_TOUCH],
    flexibility: [EX.FLEXIBILITY_POOL.PIKE_STRETCH, EX.FLEXIBILITY_POOL.SEAL_STRETCH, EX.FLEXIBILITY_POOL.WRIST_ANKLE_CIRCLES],
  },
  {
    label: "Upper Body & Power",
    cardio: EX.CARDIO_POOL.BUNNY_HOPS,
    shapes: [EX.SHAPE_POOL.ARCH, EX.SHAPE_POOL.TUCK_SIT],
    strength: [EX.STRENGTH_POOL.PUSH_UPS, EX.STRENGTH_POOL.TUCK_JUMPS, EX.STRENGTH_POOL.PLANK],
    flexibility: [EX.FLEXIBILITY_POOL.STRADDLE_STRETCH, EX.FLEXIBILITY_POOL.SHOULDER_OPENERS, EX.FLEXIBILITY_POOL.LUNGES],
  },
  {
    label: "Total Body Control",
    cardio: EX.CARDIO_POOL.CRAB_WALKS,
    shapes: [EX.SHAPE_POOL.HOLLOW, EX.SHAPE_POOL.TABLETOP],
    strength: [EX.STRENGTH_POOL.HOLLOW_ROCKS, EX.STRENGTH_POOL.L_SIT, EX.STRENGTH_POOL.SIDE_PLANK],
    flexibility: [EX.FLEXIBILITY_POOL.HALF_SPLIT, EX.FLEXIBILITY_POOL.CAT_COW, EX.FLEXIBILITY_POOL.WRIST_ANKLE_CIRCLES],
  },
];

export function buildSession(dayNumber) {
  const w = WORKOUTS[(dayNumber - 1) % WORKOUTS.length];
  return {
    dayNumber,
    workoutLabel: w.label,
    cardio: w.cardio,
    shapes: w.shapes,
    strength: w.strength,
    flexibility: w.flexibility,
  };
}
