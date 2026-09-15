import { sound } from "./audio.js";

export function speak(text) {
  if (!sound.on) return;
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 1.05;
  u.pitch = 1.0;
  window.speechSynthesis.speak(u);
}

export function stopSpeech() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
}
