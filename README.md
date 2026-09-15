# Spider Training 🕸️

**A 6-week, hands-free gymnastics quest — Spider-Man, Miles Morales, and Ghost-Spider style.**

Spider Training turns daily gymnastics conditioning into a web-slinging quest. Each trial is one
session (about 20 minutes) of three chained phases. Finish a trial, earn XP, climb the ranks from
**Backyard Hero** all the way to **Spider-Verse Legend**, and build a training streak.

It's built to be **hands-free**: prop the phone up nearby and it calls out every drill aloud, beeps
the timers, and counts for you — so a young hero can train on their own without a coach hovering over
a screen.

---

## What a trial looks like

Every trial runs the same three phases, in order. The app walks through each one and chains straight
into the next.

| | Phase | What it is |
|---|---|---|
| 🤸 | **Warm-Up & Shapes** | A cardio blast (bear crawls, crab walks, bunny hops...) followed by two gymnastics shape holds — hollow body, arch, pike sit, and friends — 3 rounds each. |
| 💪 | **Strength & Conditioning** | Three exercises, 2 rounds each. Holds (handstand, plank, L-sit) are scored on how long you can hold — tap **Release!** the instant you let go. Rep moves (push-ups, tuck jumps, candlesticks) give you a timed window, then you type in your count. |
| 🧘 | **Flexibility & Mobility** | Three stretches held for 25 seconds each, back to back — pike, straddle, half-split, cat-cow, and more. |

The three phases are pulled from a fixed rotation of three workouts — **Core & Balance**, **Upper
Body & Power**, and **Total Body Control** — that repeats every 3 days across the 6-week program.

---

## How to use it

1. **Open `index.html`** in a browser (or set up GitHub Pages for it later).
2. **Enter a hero name** and tap **Swing Into Training**.
3. **Make some space**, prop the phone up where you can hear it, and tap **Begin Trial**.
4. **Follow the voice.** It tells you each move, beeps the pace, runs the timers, and asks you to tap
   **Release!** or type in a rep count. Just listen and move.
5. **One trial per day.** If it's a day you're training elsewhere, tap **Skip Today** instead — it
   keeps your streak alive without letting you double up.

Tap the 🔊 button any time to mute or unmute the sound.

---

## Tracking progress

- The **hub** shows your current rank, XP bar, streak, and Spider-Tech Points balance.
- The **streak strip** shows the last 30 days at a glance — trained (teal), skipped (purple), or
  blank.
- **Records** keeps your personal best for every hold (longest time) and every rep move (most reps),
  plus your last few attempts.
- **Codex** shows the full rank ladder and what's still locked.

Progress is saved automatically **on the device** — no account, no internet, no data leaves the
phone.

### Spider-Tech Points 🕸️ — a reward you can spend in real life

Beating a personal record on any logged Strength & Conditioning drill earns Spider-Tech Points (the
first-ever score on a drill just sets the bar — beat it later to earn points). A **streak
multiplier** scales how much each record is worth: 1× for a 1–2 day streak, 1.5× for 3–6 days, 2× for
7 or more. Points are separate from XP: XP raises your rank forever, points are a spendable reward.

This is designed so a parent can run a real-life "store" — agree on what points buy (screen time, a
treat, a trip), and deduct them when they're spent.

**Parent console** — open the browser's developer console (on a computer: right-click → Inspect →
Console) and use:

```js
web.points       // see the current balance
web.spend(5)     // deduct 5 points when they're spent in real life
web.add(3)       // add 3 points by hand
web.reset()      // set points back to 0
web.help()       // print this list
```

---

## Play it

Spider Training runs right in the browser — nothing to install. Open `index.html` directly, or set up
GitHub Pages for this repo to get a shareable link.

On a phone, "Add to Home Screen" makes it feel like a real app.
