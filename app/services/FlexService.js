import { $ } from "../ui/screens.js";
import { runLeadIn } from "../utils/leadIn.js";
import { endCue } from "../utils/endCue.js";
import { countdown } from "../utils/timer.js";
import { STRETCH_HOLD_MS } from "../data/config.js";

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

    $("drill-name").textContent = ex.name;
    $("drill-detail").textContent = ex.cue;
    $("drill-round-note").textContent = `Stretch ${this._index + 1} of ${this._items.length}`;
    runLeadIn({
      announce: `Get into position: ${ex.name}. ${ex.cue}`,
      onGo: () => this._countdown(STRETCH_HOLD_MS, () => this._advance()),
    });
  }

  _countdown(totalMs, onDone) {
    const cue = endCue();
    setRing(0);
    $("drill-timer").textContent = fmt(totalMs);
    countdown(
      totalMs,
      (remaining) => {
        $("drill-timer").textContent = fmt(remaining);
        setRing(((totalMs - remaining) / totalMs) * 100);
        cue.onTick(remaining);
      },
      () => {
        setRing(100);
        $("drill-timer").textContent = fmt(0);
        cue.end(onDone);
      }
    );
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
