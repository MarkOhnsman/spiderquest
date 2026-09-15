import { $ } from "../ui/screens.js";
import { beep } from "../utils/audio.js";
import { speak } from "../utils/speech.js";
import { runLeadIn } from "../utils/leadIn.js";
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

    runLeadIn(() => {
      if (ex.mode === "hold") this._armHold(ex);
      else this._armReps(ex);
    });
  }

  _armHold(ex) {
    this._armed = { mode: "hold", ex };
    const btn = $("drill-action-btn");
    btn.textContent = "Release!";
    btn.classList.remove("hidden");
    this._holdStart = Date.now();
    setRing(0, "--primary");
    $("drill-timer").textContent = fmtSeconds(0);
    this._holdInterval = setInterval(() => {
      const elapsed = (Date.now() - this._holdStart) / 1000;
      $("drill-timer").textContent = fmtSeconds(elapsed);
      setRing((elapsed / ex.targetSec) * 100, "--primary");
    }, 100);
  }

  _armReps(ex) {
    this._armed = { mode: "reps", ex };
    $("drill-detail").textContent = `${ex.detail} Get ready to count your reps!`;
    let lastWholeSecond = null;
    const start = REP_WINDOW_MS;
    let remaining = REP_WINDOW_MS;
    setRing(0, "--blue");
    this._repInterval = setInterval(() => {
      remaining -= 100;
      const secondsLeft = Math.ceil(remaining / 1000);
      if (remaining <= 0) {
        clearInterval(this._repInterval);
        beep(TONES.timeUp, 200);
        $("drill-timer").textContent = "0.0s";
        setRing(100, "--blue");
        this._revealRepInput(ex);
        return;
      }
      if (secondsLeft <= 3 && secondsLeft !== lastWholeSecond) {
        lastWholeSecond = secondsLeft;
        beep(TONES.timeUp, 150);
      }
      $("drill-timer").textContent = fmtSeconds(remaining / 1000);
      setRing(((start - remaining) / start) * 100, "--blue");
    }, 100);
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
      clearInterval(this._holdInterval);
      const elapsedSeconds = (Date.now() - this._holdStart) / 1000;
      result = this.state.recordHold(ex.name, elapsedSeconds);
    } else {
      clearInterval(this._repInterval);
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

    setTimeout(() => this._afterExercise(), 1200);
  }

  _afterExercise() {
    const next = this._seqIndex + 1;
    if (next >= this._sequence.length) return this._finish();

    const nextEx = this._sequence[next];
    speak(`Rest. Next up: ${nextEx.name}`);
    $("drill-name").textContent = "Rest";
    $("drill-detail").textContent = `Next up: ${nextEx.name}`;
    $("drill-round-note").textContent = "";
    let remaining = REST_BETWEEN_MS;
    const start = REST_BETWEEN_MS;
    setRing(0, "--teal");
    const iv = setInterval(() => {
      remaining -= 100;
      if (remaining <= 0) {
        clearInterval(iv);
        this._startExercise(next);
        return;
      }
      $("drill-timer").textContent = fmtSeconds(remaining / 1000);
      setRing(((start - remaining) / start) * 100, "--teal");
    }, 100);
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
