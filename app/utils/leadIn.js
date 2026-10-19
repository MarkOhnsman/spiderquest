import { TONES } from "../data/config.js";
import { $ } from "../ui/screens.js";
import { beep, buzz, sound } from "./audio.js";
import { speak } from "./speech.js";
import { after } from "./timer.js";

// Silent read-the-screen time when sound is off, and a cap in case the
// browser never reports the spoken line as finished.
const READ_MS = 2500;
const MAX_ANNOUNCE_MS = 10000;

// Shared lead-in before any timed drill: say the move (if given), then a
// spoken 3-2-1-GO with a beep and the number shown on each second.
export function runLeadIn({ announce, onGo }) {
  if (!announce) return countIn(onGo);

  let started = false;
  let fallback = null;
  const start = () => {
    if (started) return;
    started = true;
    if (fallback) fallback.cancel();
    countIn(onGo);
  };
  beep(TONES.cue, 150);
  // Routed through the clock so a pause mid-announcement holds the countdown back.
  if (sound.on) speak(announce, () => after(400, start));
  fallback = after(sound.on ? MAX_ANNOUNCE_MS : READ_MS, start);
}

function countIn(onGo) {
  let n = 3;
  const step = () => {
    if (n > 0) {
      $("drill-timer").textContent = String(n);
      beep(TONES.leadIn, 120);
      speak(String(n));
      n -= 1;
      after(1000, step);
    } else {
      $("drill-timer").textContent = "GO!";
      beep(TONES.go, 200);
      buzz(80);
      speak("Go!");
      after(450, onGo);
    }
  };
  step();
}
