import { TONES } from "../data/config.js";
import { beep, buzz } from "./audio.js";
import { speak } from "./speech.js";

// Shared 3-2-1-GO countdown used before any timed drill.
export function runLeadIn(onGo) {
  speak("Ready... three, two, one...");
  let n = 3;
  beep(TONES.leadIn, 120);
  const iv = setInterval(() => {
    n -= 1;
    if (n > 0) {
      beep(TONES.leadIn, 120);
    } else {
      clearInterval(iv);
      beep(TONES.go, 200);
      buzz(80);
      speak("Go!");
      setTimeout(onGo, 450);
    }
  }, 1000);
}
