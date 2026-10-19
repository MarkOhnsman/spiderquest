import { sound } from "./audio.js";

// onEnd (optional) runs once when the line finishes, or right away if there's
// nothing to say it with. Callers needing a guaranteed wake-up add their own fallback.
export function speak(text, onEnd) {
  let done = false;
  const finish = () => {
    if (done || !onEnd) return;
    done = true;
    onEnd();
  };
  if (!sound.on || !window.speechSynthesis) return finish();
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 1.05;
  u.pitch = 1.0;
  u.onend = finish;
  u.onerror = finish;
  window.speechSynthesis.speak(u);
}

export function stopSpeech() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
}
