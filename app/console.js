export function installConsole({ state, refreshHub }) {
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
    help() {
      console.log(
        "%cSpider-Tech Points console",
        "font-weight:bold",
        "\n web.points   — current balance" +
          "\n web.add(n)   — add n points" +
          "\n web.spend(n) — spend n points" +
          "\n web.reset()  — reset to 0"
      );
      return "see console output above";
    },
  };
}
