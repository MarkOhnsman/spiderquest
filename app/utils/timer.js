// Shared drill clock. Every timed step in the services schedules through here
// instead of raw setTimeout/setInterval, so one place controls the pace.
// Pausing freezes drill time, so every countdown, hold stopwatch and lead-in
// stops together. `speed` and `skip()` are test cheats (see console.js).

const TICK_MS = 25;

let speed = 1;
let paused = false;
let baseReal = performance.now();
let baseVirtual = 0;

let tasks = [];
let loopId = null;

export const clock = {
  now() {
    if (paused) return baseVirtual;
    return baseVirtual + (performance.now() - baseReal) * speed;
  },
  get speed() {
    return speed;
  },
  setSpeed(x) {
    baseVirtual = this.now();
    baseReal = performance.now();
    speed = x;
  },
  get paused() {
    return paused;
  },
  pause() {
    if (paused) return;
    baseVirtual = this.now();
    paused = true;
  },
  resume() {
    if (!paused) return;
    baseReal = performance.now();
    paused = false;
  },
};

function tick() {
  if (paused) return;
  const t = clock.now();
  for (const task of [...tasks]) {
    if (task.cancelled) continue;
    if (t >= task.at) fire(task);
    else if (task.onTick) task.onTick(task.at - t, t);
  }
  if (!tasks.length) {
    clearInterval(loopId);
    loopId = null;
  }
}

function fire(task) {
  task.cancel();
  task.fn();
}

function schedule(task) {
  task.cancelled = false;
  task.cancel = () => {
    task.cancelled = true;
    tasks = tasks.filter((x) => x !== task);
  };
  tasks.push(task);
  if (!loopId) loopId = setInterval(tick, TICK_MS);
  return task;
}

// Run fn after ms of drill time.
export function after(ms, fn) {
  return schedule({ at: clock.now() + ms, fn });
}

// Tick onTick(remainingMs) until ms of drill time has passed, then onDone().
export function countdown(ms, onTick, onDone) {
  return schedule({ at: clock.now() + ms, fn: onDone, onTick, countdown: true });
}

// Tick onTick(elapsedMs) until cancelled — for open-ended holds.
export function stopwatch(onTick) {
  const start = clock.now();
  return schedule({ at: Infinity, fn: () => {}, onTick: (_r, t) => onTick(t - start) });
}

// Fast-forward to the end of the current countdown, firing any short waits
// (lead-in beeps, pauses between drills) on the way. Returns false if nothing
// was waiting on the clock — e.g. the drill is waiting for a tap.
export function skip() {
  let fired = false;
  for (let i = 0; i < 20; i++) {
    const next = tasks.filter((x) => Number.isFinite(x.at)).sort((a, b) => a.at - b.at)[0];
    if (!next) break;
    fire(next);
    fired = true;
    if (next.countdown) break;
  }
  return fired;
}
