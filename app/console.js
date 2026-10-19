import { clock, skip } from "./utils/timer.js";
import { todayStr, getDayOffset, setDayOffset } from "./state/streak.js";

export function installConsole({ state, refreshHub }) {
  // ?speed=10 in the URL — for testing on a phone, where there's no console.
  const urlSpeed = parseFloat(new URLSearchParams(location.search).get("speed"));
  if (urlSpeed > 0) clock.setSpeed(urlSpeed);

  window.web = {
    get points() {
      return state.points;
    },
    add(n = 1) {
      state.addPoints(n);
      refreshHub();
      return `+${n} pts → ${state.points} total`;
    },
    spend(n = 1) {
      state.spendPoints(n);
      refreshHub();
      return `-${n} pts → ${state.points} total`;
    },
    reset() {
      state.resetPoints();
      refreshHub();
      return "points reset to 0";
    },
    speed(x) {
      if (x === undefined) return `speed ${clock.speed}×`;
      if (!(x > 0)) return "speed must be > 0";
      clock.setSpeed(x);
      return `speed ${x}× — timed holds will log ${x}× longer than real`;
    },
    skip() {
      return skip() ? "skipped ahead" : "nothing on the clock — waiting for a tap";
    },
    nextDay(n = 1) {
      setDayOffset(getDayOffset() + n);
      refreshHub();
      return `today is now ${todayStr()} (+${getDayOffset()} days)`;
    },
    realDay() {
      setDayOffset(0);
      refreshHub();
      return `back to the real date, ${todayStr()} — saved dates ahead of it may look odd until you wipe()`;
    },
    wipe() {
      state.wipe();
      setDayOffset(0);
      location.reload();
      return "progress wiped";
    },
    help() {
      console.log(
        "%cSpider Training console",
        "font-weight:bold",
        "\n web.points     — current balance" +
          "\n web.add(n)     — add n points" +
          "\n web.spend(n)   — spend n points" +
          "\n web.reset()    — reset points to 0" +
          "\n web.speed(x)   — run drill timers x× faster (1 = normal; also ?speed=x in the URL)" +
          "\n web.skip()     — jump to the end of the current timer" +
          "\n web.nextDay(n) — pretend n days have passed (unlocks another trial, tests streaks)" +
          "\n web.realDay()  — go back to the real date" +
          "\n web.wipe()     — delete this hero's progress and start over"
      );
      return "see console output above";
    },
  };
}
