import { buildSession } from "./data/sessions.js";

export default class SessionController {
  constructor(state, { warmup, power, flex }, { onPhaseChange, onFinish }) {
    this.state = state;
    this.warmup = warmup;
    this.power = power;
    this.flex = flex;
    this.onPhaseChange = onPhaseChange;
    this.onFinish = onFinish;
    this._current = null;
  }

  begin() {
    if (this.state.isLockedToday()) return false;

    const session = buildSession(this.state.sessionsCompleted + 1);
    let earnedXp = 0;

    this.onPhaseChange("warmup", session);
    this._current = this.warmup;
    this.warmup.start({
      session,
      onComplete: (xp) => {
        earnedXp += xp;
        this.onPhaseChange("power", session);
        this._current = this.power;
        this.power.start({
          session,
          onComplete: (xp2) => {
            earnedXp += xp2;
            this.onPhaseChange("flex", session);
            this._current = this.flex;
            this.flex.start({
              session,
              onComplete: (xp3) => {
                earnedXp += xp3;
                this._finish(session, earnedXp);
              },
            });
          },
        });
      },
    });

    return true;
  }

  _finish(session, earnedXp) {
    const pointsEarned = this.state.completeSession(earnedXp);
    this._current = null;
    this.onFinish({
      day: this.state.sessionsCompleted,
      xpEarned: earnedXp,
      pointsEarned,
      workoutLabel: session.workoutLabel,
    });
  }

  activeService() {
    return this._current;
  }
}
