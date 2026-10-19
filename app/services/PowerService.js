import { $ } from "../ui/screens.js";
import { beep } from "../utils/audio.js";
import { speak } from "../utils/speech.js";
import { runLeadIn } from "../utils/leadIn.js";
import { endCue } from "../utils/endCue.js";
import { after, countdown, stopwatch } from "../utils/timer.js";
import { STRENGTH_ROUNDS, REP_WINDOW_MS, REST_BETWEEN_MS, TONES } from "../data/config.js";

function fmtSeconds(sec) {
  return `${sec.toFixed(1)}s`;
}

function setRing(pct, colorVar) {
  const ring = $("drill-ring");
  if (ring) ring.style.background = `conic-gradient(var(${colorVar}) ${Math.min(100, pct)}%, var(--bg-raised) 0)`;
}

export default class PowerService {
  constructor(state) {
    this.state = state;
    this._earnedXp = 0;
    this._armed = null;
  }

  start({ session, onComplete }) {
    this._onComplete = onComplete;
    this._earnedXp = 0;
    this._exercisesPerRound = session.strength.length;

    const label = $("drill-phase-label");
    if (label) label.textContent = "STRENGTH & CONDITIONING";
    const dot = $("phase-dot-power");
    if (dot) dot.classList.add("active");

    this._sequence = [];
    for (let round = 0; round < STRENGTH_ROUNDS; round++) {
      for (const ex of session.strength) this._sequence.push(ex);
    }
    this._startExercise(0);
  }

  _startExercise(index) {
    this._seqIndex = index;
    const ex = this._sequence[index];
    const round = Math.floor(index / this._exercisesPerRound) + 1;
    const posInRound = (index % this._exercisesPerRound) + 1;
    $("drill-round-note").textContent = `Exercise ${posInRound} of ${this._exercisesPerRound} — Round ${round} of ${STRENGTH_ROUNDS}`;
    $("drill-name").textContent = ex.name;
    $("drill-detail").textContent = ex.detail;
    $("drill-action-btn").classList.add("hidden");
    $("drill-rep-input").classList.add("hidden");

    runLeadIn({
      announce: round === 1 ? `${ex.name}. ${ex.detail}` : `Round ${round}. ${ex.name}`,
      onGo: () => {
        if (ex.mode === "hold") this._armHold(ex);
        else this._armReps(ex);
      },
    });
  }

  _armHold(ex) {
    this._armed = { mode: "hold", ex };
    const btn = $("drill-action-btn");
    btn.textContent = "Release!";
    btn.classList.remove("hidden");
    this._holdElapsedMs = 0;
    setRing(0, "--primary");
    $("drill-timer").textContent = fmtSeconds(0);
    this._holdTimer = stopwatch((elapsedMs) => {
      this._holdElapsedMs = elapsedMs;
      const elapsed = elapsedMs / 1000;
      $("drill-timer").textContent = fmtSeconds(elapsed);
      setRing((elapsed / ex.targetSec) * 100, "--primary");
    });
  }

  _armReps(ex) {
    this._armed = { mode: "reps", ex };
    $("drill-detail").textContent = `${ex.detail} Get ready to count your reps!`;
    const cue = endCue();
    const start = REP_WINDOW_MS;
    setRing(0, "--blue");
    this._repTimer = countdown(
      REP_WINDOW_MS,
      (remaining) => {
        cue.onTick(remaining);
        $("drill-timer").textContent = fmtSeconds(remaining / 1000);
        setRing(((start - remaining) / start) * 100, "--blue");
      },
      () => {
        $("drill-timer").textContent = "0.0s";
        setRing(100, "--blue");
        cue.end(() => this._revealRepInput(ex));
      }
    );
  }

  _revealRepInput(ex) {
    $("drill-detail").textContent = `Time! How many ${ex.name} did you land?`;
    const input = $("drill-rep-input");
    input.value = "";
    input.classList.remove("hidden");
    input.focus();
    const btn = $("drill-action-btn");
    btn.textContent = "Log Reps";
    btn.classList.remove("hidden");
  }

  handleAction() {
    if (!this._armed) return;
    const { mode, ex } = this._armed;
    let result;

    if (mode === "hold") {
      this._holdTimer.cancel();
      const elapsedSeconds = this._holdElapsedMs / 1000;
      result = this.state.recordHold(ex.name, elapsedSeconds);
    } else {
      this._repTimer.cancel();
      const raw = parseInt($("drill-rep-input").value, 10);
      const reps = Number.isFinite(raw) ? Math.max(0, raw) : 0;
      result = this.state.recordReps(ex.name, reps);
    }

    this._earnedXp += ex.xp + result.xpAwarded;

    if (result.beat) {
      beep(TONES.record, 250);
      $("drill-detail").textContent = `New record! +${result.pointsAwarded} pts`;
    } else if (result.isFirst) {
      $("drill-detail").textContent = "First one logged — beat it next time for points!";
    } else {
      $("drill-detail").textContent = "Nice work — logged.";
    }

    $("drill-action-btn").classList.add("hidden");
    $("drill-rep-input").classList.add("hidden");
    this._armed = null;

    after(1200, () => this._afterExercise());
  }

  _afterExercise() {
    const next = this._seqIndex + 1;
    if (next >= this._sequence.length) return this._finish();

    const nextEx = this._sequence[next];
    speak(`Rest. Next up: ${nextEx.name}`);
    $("drill-name").textContent = "Rest";
    $("drill-detail").textContent = `Next up: ${nextEx.name}`;
    $("drill-round-note").textContent = "";
    const start = REST_BETWEEN_MS;
    setRing(0, "--muted");
    countdown(
      REST_BETWEEN_MS,
      (remaining) => {
        $("drill-timer").textContent = fmtSeconds(remaining / 1000);
        setRing(((start - remaining) / start) * 100, "--muted");
      },
      () => this._startExercise(next)
    );
  }

  _finish() {
    const dot = $("phase-dot-power");
    if (dot) {
      dot.classList.remove("active");
      dot.classList.add("done");
    }
    this._onComplete(this._earnedXp);
  }
}
