import { $ } from "../ui/screens.js";
import { beep, buzz } from "../utils/audio.js";
import { speak } from "../utils/speech.js";
import { CARDIO_DURATION_MS, SHAPE_ROUNDS, SHAPE_HOLD_MS, SHAPE_REST_MS, TONES } from "../data/config.js";

function fmt(ms) {
  const s = Math.max(0, ms / 1000);
  return `${s.toFixed(1)}s`;
}

function setRing(pct) {
  const ring = $("drill-ring");
  if (ring) ring.style.background = `conic-gradient(var(--primary) ${pct}%, var(--bg-raised) 0)`;
}

export default class WarmupService {
  constructor(state) {
    this.state = state;
    this._earnedXp = 0;
  }

  handleAction() {
    // Warm-Up is fully automatic — nothing to delegate.
  }

  start({ session, onComplete }) {
    this._onComplete = onComplete;
    this._earnedXp = session.cardio.xp;
    for (const shape of session.shapes) this._earnedXp += shape.xp * SHAPE_ROUNDS;

    const label = $("drill-phase-label");
    if (label) label.textContent = "WARM-UP & SHAPES";
    const dot = $("phase-dot-warmup");
    if (dot) dot.classList.add("active");

    this._steps = this._buildSteps(session);
    this._stepIndex = -1;
    this._advance();
  }

  _buildSteps(session) {
    const steps = [{ type: "cardio", ex: session.cardio }];
    session.shapes.forEach((shape, shapeIdx) => {
      for (let round = 1; round <= SHAPE_ROUNDS; round++) {
        steps.push({ type: "hold", ex: shape, round, announce: round === 1 });
        const isLastHold = shapeIdx === session.shapes.length - 1 && round === SHAPE_ROUNDS;
        if (!isLastHold) steps.push({ type: "rest" });
      }
    });
    return steps;
  }

  _advance() {
    this._stepIndex += 1;
    const step = this._steps[this._stepIndex];
    if (!step) return this._finish();

    if (step.type === "cardio") return this._runCardio(step);
    if (step.type === "hold") return this._runHold(step);
    if (step.type === "rest") return this._runRest();
  }

  _runCardio(step) {
    speak(`${step.ex.name}. ${step.ex.cue}`);
    beep(TONES.cue, 150);
    $("drill-name").textContent = step.ex.name;
    $("drill-detail").textContent = step.ex.cue;
    $("drill-round-note").textContent = "Warm-up blast";
    this._countdown(CARDIO_DURATION_MS, () => {
      beep(TONES.timeUp, 200);
      buzz(120);
      this._advance();
    });
  }

  _runHold(step) {
    if (step.announce) speak(`${step.ex.name}. ${step.ex.cue}`);
    $("drill-name").textContent = step.ex.name;
    $("drill-detail").textContent = step.ex.cue;
    $("drill-round-note").textContent = `Round ${step.round} of ${SHAPE_ROUNDS}`;
    beep(TONES.cue, 150);
    this._countdown(SHAPE_HOLD_MS, () => {
      beep(TONES.timeUp, 200);
      this._advance();
    });
  }

  _runRest() {
    $("drill-detail").textContent = "Rest...";
    this._countdown(SHAPE_REST_MS, () => this._advance());
  }

  _countdown(totalMs, onDone) {
    const start = totalMs;
    let remaining = totalMs;
    setRing(0);
    $("drill-timer").textContent = fmt(remaining);
    const iv = setInterval(() => {
      remaining -= 100;
      if (remaining <= 0) {
        clearInterval(iv);
        setRing(100);
        $("drill-timer").textContent = fmt(0);
        onDone();
        return;
      }
      $("drill-timer").textContent = fmt(remaining);
      setRing(((start - remaining) / start) * 100);
    }, 100);
  }

  _finish() {
    const dot = $("phase-dot-warmup");
    if (dot) {
      dot.classList.remove("active");
      dot.classList.add("done");
    }
    this.state.addFlatXp(this._earnedXp);
    this._onComplete(this._earnedXp);
  }
}
