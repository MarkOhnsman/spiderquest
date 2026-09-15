// Section 1a: cardio warm-ups — one auto-run timed blast to open a session.
export const CARDIO_POOL = {
  BEAR_CRAWLS: { name: "Bear Crawls", cue: "Hands and feet down — crawl across the room!", xp: 10 },
  CRAB_WALKS: { name: "Crab Walks", cue: "Hips up, crab-walk across the room!", xp: 10 },
  BUNNY_HOPS: { name: "Bunny Hops", cue: "Feet together — hop forward, then back!", xp: 10 },
  JUMPING_JACKS: { name: "Jumping Jacks & High Knees", cue: "Jacks, then drive those knees high!", xp: 10 },
  BUTT_KICKS: { name: "Butt Kicks & Side Shuffles", cue: "Kick your heels back, then shuffle side to side!", xp: 10 },
};

// Section 1b: gymnastics shape holds — 3 sets of 15-20s per shape.
export const SHAPE_POOL = {
  HOLLOW: { name: "Hollow Body Hold", cue: "Arms overhead, lower back glued to the floor.", xp: 8 },
  ARCH: { name: "Arch Hold (Superman)", cue: "Belly down, squeeze your glutes, lift arms and legs.", xp: 8 },
  PIKE_SIT: { name: "Pike Sit Hold", cue: "Sit tall, legs straight together, toes pointed.", xp: 8 },
  STRADDLE_SIT: { name: "Straddle Sit Hold", cue: "Wide V, knees locked, arms out to the sides.", xp: 8 },
  TUCK_SIT: { name: "Tuck Sit Hold", cue: "Sit tall, knees pulled tight to your chest, feet off the floor.", xp: 8 },
  TABLETOP: { name: "Bridge Prep (Tabletop Hold)", cue: "Hands and feet down, push your belly up to the sky.", xp: 8 },
};

// Section 2: strength & conditioning. mode "hold" = hold as long as possible, tap Release,
// longer beats a prior best. mode "reps" = timed window then type in the count, more beats a prior best.
export const STRENGTH_POOL = {
  WALL_HANDSTAND: {
    name: "Wall-Facing Handstand Hold",
    detail: "Belly to the wall, hands close, stack up straight like a pencil.",
    mode: "hold",
    targetSec: 25,
    xp: 30,
  },
  CANDLESTICK: {
    name: "Candlestick Roll to Stand",
    detail: "Roll back, feet to the ceiling, roll up to standing — no hands!",
    mode: "reps",
    targetReps: 7,
    xp: 25,
  },
  PLANK: {
    name: "Plank Hold",
    detail: "Flat back, tight core, squeeze those glutes.",
    mode: "hold",
    targetSec: 37,
    xp: 25,
  },
  SIDE_PLANK: {
    name: "Side Planks",
    detail: "Stack your feet, lift your hips, reach the top arm to the sky.",
    mode: "hold",
    targetSec: 20,
    xp: 20,
  },
  PUSH_UPS: {
    name: "Strict Push-Ups",
    detail: "Elbows tucked in close — knees or toes, your call.",
    mode: "reps",
    targetReps: 8,
    xp: 25,
  },
  TUCK_JUMPS: {
    name: "Tuck Jumps",
    detail: "Jump high, knees to your chest, land silent on your toes.",
    mode: "reps",
    targetReps: 9,
    xp: 25,
  },
  L_SIT: {
    name: "L-Sit Hold",
    detail: "Hands by your hips, press down, lift your bottom off the ground.",
    mode: "hold",
    targetSec: 12,
    xp: 30,
  },
  SINGLE_LEG_TOUCH: {
    name: "Single-Leg Balance Touches",
    detail: "Stand tall on one leg, tap the floor, rise back up with no wobble.",
    mode: "reps",
    targetReps: 8,
    xp: 20,
  },
  HOLLOW_ROCKS: {
    name: "Hollow Body Rocks",
    detail: "Hold your hollow shape and gently rock front to back.",
    mode: "reps",
    targetReps: 11,
    xp: 20,
  },
  SUPERMAN_PULLS: {
    name: "Supermans with Arm Pulldowns",
    detail: "Hold your arch, pull your elbows to your ribs, reach back out.",
    mode: "reps",
    targetReps: 10,
    xp: 20,
  },
};

// Section 3: flexibility & mobility — sequential 20-30s holds, no rounds, no PR tracking.
export const FLEXIBILITY_POOL = {
  PIKE_STRETCH: { name: "Pike Stretch", cue: "Sit tall, straight knees, reach for your toes.", xp: 6 },
  STRADDLE_STRETCH: { name: "Straddle Stretch", cue: "Reach to center, then left, then right.", xp: 6 },
  LUNGES: { name: "Forward Lunges", cue: "Push your hips forward, feel the stretch up front.", xp: 6 },
  HALF_SPLIT: {
    name: "Half-Split Stretch",
    cue: "Front leg straight, back knee down, reach your chest toward your shin.",
    xp: 6,
  },
  SEAL_STRETCH: { name: "Seal Stretch (Cobra)", cue: "Belly down, press your chest up, hips stay grounded.", xp: 6 },
  CAT_COW: { name: "Cat-Cow Stretch", cue: "Hands and knees — arch, then round your back.", xp: 6 },
  SHOULDER_OPENERS: {
    name: "Shoulder Openers",
    cue: "Elbows on a couch or chair edge, press your chest down gently.",
    xp: 6,
  },
  WRIST_ANKLE_CIRCLES: { name: "Wrist & Ankle Circles", cue: "Roll both directions — wake up those joints.", xp: 6 },
};
