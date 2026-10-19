import { TONES } from "../data/config.js";
import { beep, buzz, whistle } from "./audio.js";
import { speak } from "./speech.js";
import { after } from "./timer.js";

// Cap on waiting for "Rest" to finish, in case the browser never reports it.
const MAX_REST_SPEECH_MS = 1500;

// Shared end-of-drill cue: beep, beep, beep on the last three seconds, then a
// whistle and "Rest". Feed onTick every remaining-ms tick; call end(onDone) at
// zero — onDone runs once "Rest" has been said, so the next announcement
// doesn't talk over it.
export function endCue() {
  let lastBeeped = null;
  return {
    onTick(remainingMs) {
      const secondsLeft = Math.ceil(remainingMs / 1000);
      if (secondsLeft <= 3 && secondsLeft !== lastBeeped) {
        lastBeeped = secondsLeft;
        beep(TONES.timeUp, 150);
      }
    },
    end(onDone) {
      whistle();
      buzz(120);
      let done = false;
      const next = () => {
        if (done) return;
        done = true;
        fallback.cancel();
        onDone();
      };
      const fallback = after(MAX_REST_SPEECH_MS, next);
      speak("Rest", () => after(0, next));
    },
  };
}
