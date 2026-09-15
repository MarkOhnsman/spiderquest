# Spider Training — TODO (resume later)

Feedback from first look at the app, not yet implemented.

## 1. Text is too small
Bump base font sizes across `style.css`, especially the training screen
(`.drill-name`, `.drill-detail`, `.drill-timer`, `.drill-round-note`) and the
hub header — needs to be readable at a distance by a kid, not just on a phone
held close. Check the `clamp()` minimums throughout, not just the max.

## 2. Need a pause button
There's currently no way to pause mid-drill. Every phase service
(`WarmupService`, `PowerService`, `FlexService`) drives its own
`setInterval`/`setTimeout` chain with no pause/resume hook. Needs:
- a `#drill-pause-btn` on the shared training screen
- each service to expose a `pause()`/`resume()` that stops/restarts its
  active interval without losing the remaining time or the current
  exercise/round position
- probably a shared tiny timer helper at this point instead of each service
  hand-rolling `setInterval` — worth factoring out once pause exists in all
  three services, to avoid three slightly-different implementations.

## 3. Pose images per exercise
Right now every drill is text + cue only (no visual). A younger kid needs a
picture to know what "Hollow Body Hold" or "Candlestick Roll to Stand" means.
- Add an `image` field to each exercise entry in `app/data/exercises.js`
  (mirrors kicks' `left-kick.png`/`right-kick.png` approach, but for every
  pool item, not just two).
- Need to actually source/create the images (one per drill across
  CARDIO_POOL, SHAPE_POOL, STRENGTH_POOL, FLEXIBILITY_POOL — ~29 total).
- Wire a `#drill-image` element into the shared training screen, shown above
  or instead of `#drill-ring` during the "get into position" moment.

## 4. Beeps between cycles/rounds
Audio cues need to be clearer/more consistent between reps and rounds — right
now beeps mark hold start/end and lead-in, but the transitions between
rounds within Warm-Up shapes and Power sets could use their own distinct
beep so a kid without the voice cue still knows "new rep/round starting."

## 5. Manual start per position, auto-loop within a set
Biggest behavior change: right now everything chains automatically
(`WarmupService`, `FlexService`, and `PowerService`'s rest → next-exercise
step all auto-advance with no user input). Instead:
- **Manual start when moving to a NEW position/exercise** — give the kid
  time to actually get into place before the hold/rep window starts, instead
  of the lead-in countdown just firing on a timer. Probably a "Ready" button
  shown at each `_startExercise`/new-shape/new-stretch transition, replacing
  the automatic `runLeadIn()` kickoff.
- **Auto-loop between reps/rounds within that same set** once it's running —
  so the manual gate is only at the start of a new exercise/position, not
  before every single round of the same one.
- Touches `WarmupService._advance` (shape round boundaries), `PowerService`
  (`_startExercise` vs. the round loop within the same exercise — note:
  currently each round of Strength re-picks the SAME 3 exercises, so "new
  position" there really means "new exercise slot," round 2 of the same
  exercise should probably NOT re-require a manual start), and
  `FlexService._advance` (each stretch is already a distinct position, so
  every stretch transition would get the manual gate).

---
Everything above lives in the same file/class boundaries called out in each
item — no architecture change needed, just behavior changes within the
existing `WarmupService` / `PowerService` / `FlexService` / `style.css`.
