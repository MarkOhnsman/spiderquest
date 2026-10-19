import { STORAGE_PREFIX } from "../data/config.js";

const SOUND_KEY = `${STORAGE_PREFIX}_sound`;

let ctx = null;

function readSoundPref() {
  try {
    const raw = localStorage.getItem(SOUND_KEY);
    return raw === null ? true : raw === "1";
  } catch {
    return true;
  }
}

export const sound = {
  on: readSoundPref(),
  toggle() {
    this.on = !this.on;
    try {
      localStorage.setItem(SOUND_KEY, this.on ? "1" : "0");
    } catch {
      // ignore storage failures (private mode, quota, etc.)
    }
    return this.on;
  },
  unlock() {
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume();
  },
};

function getCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
}

export function beep(freq, ms) {
  if (!sound.on) return;
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.2, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + ms / 1000);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + ms / 1000);
}

export function buzz(ms) {
  if (!sound.on) return;
  if (navigator.vibrate) navigator.vibrate(ms);
}

// Coach's-whistle trill: a high tone wobbled fast by a second oscillator.
export function whistle(ms = 550) {
  if (!sound.on) return;
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  const end = t + ms / 1000;
  const osc = c.createOscillator();
  const trill = c.createOscillator();
  const trillDepth = c.createGain();
  const gain = c.createGain();
  osc.type = "sine";
  osc.frequency.value = 2600;
  trill.frequency.value = 28;
  trillDepth.gain.value = 180;
  trill.connect(trillDepth);
  trillDepth.connect(osc.frequency);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.25, t + 0.03);
  gain.gain.setValueAtTime(0.25, end - 0.08);
  gain.gain.exponentialRampToValueAtTime(0.0001, end);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(t);
  trill.start(t);
  osc.stop(end);
  trill.stop(end);
}
