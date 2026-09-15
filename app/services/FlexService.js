import { $ } from "../ui/screens.js";
import { beep } from "../utils/audio.js";
import { speak } from "../utils/speech.js";
import { STRETCH_HOLD_MS, TONES } from "../data/config.js";

function fmt(ms) {
  const s = Math.max(0, ms / 1000);
  return `${s.toFixed(1)}s`;
}

function setRing(pct) {
  const ring = $("drill-ring");
  if (ring) ring.style.background = `conic-gradient(var(--teal) ${pct}%, var(--bg-raised) 0)`;
}

export default class FlexService {
  constructor(state) {
    this.state = state;
    this._earnedXp = 0;
  }

  handleAction() {
    // Flexibility is fully automatic — nothing to delegate.
  }

  start({ session, onComplete }) {
    this._onComplete = onComplete;
    this._earnedXp = session.flexibility.reduce((sum, ex) => sum + ex.xp, 0);

    const label = $("drill-phase-label");
    if (label) label.textContent = "FLEXIBILITY & MOBILITY";
    const dot = $("phase-dot-flex");
    if (dot) dot.classList.add("active");

    this._items = session.flexibility;
    this._index = -1;
    this._advance();
  }

  _advance() {
    this._index += 1;
    const ex = this._items[this._index];
    if (!ex) return this._finish();

    speak(`Get into position: ${ex.name}. ${ex.cue}`);
    $("drill-name").textContent = ex.name;
    $("drill-detail").textContent = ex.cue;
    $("drill-round-note").textContent = `Stretch ${this._index + 1} of ${this._items.length}`;
    beep(TONES.cue, 150);
    this._countdown(STRETCH_HOLD_MS, () => {
      beep(TONES.timeUp, 200);
      setTimeout(() => this._advance(), 600);
    });
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
    const dot = $("phase-dot-flex");
    if (dot) {
      dot.classList.remove("active");
      dot.classList.add("done");
    }
    this.state.addFlatXp(this._earnedXp);
    this._onComplete(this._earnedXp);
  }
}
