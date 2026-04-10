# earless-slop

Click notes on a guitar fretboard or a piano keyboard. It tells you what chord
and what scales you just played.

Named for its target user: someone with no ear, who can find the notes but
cannot name the thing they add up to. That someone was me.

## The problem it solves

Music theory tools are overwhelmingly **forward**: you pick "C minor 7", and it
shows you the notes. That is the easy direction, and it is the direction you
almost never need. What actually happens is you stumble onto a shape that sounds
good and have no idea what it is or what else fits over it.

So this runs backwards. Notes in, names out.

## How the matching works

`src/lib/musicTheory.ts`, built on [tonal](https://github.com/tonaljs/tonal).

**Chords.** Input is normalised to pitch classes first (an enharmonic map folds
`Db` and `C#` together, so the fretboard and the keyboard can disagree about
spelling without producing two different answers). `Chord.detect` gets first
pass. Because detection is sensitive to which note is treated as the root, every
input note is then rotated into root position and re-detected — this is what
surfaces inversions that a single pass misses. Each candidate is scored:

```
score = matched notes / max(chord size, input size)
```

Dividing by the max in both directions is the important detail. It penalises a
chord that needs notes you did not play *and* a chord that ignores notes you
did, so a triad does not score a perfect 1.0 against a four-note voicing just by
being a subset of it.

**Scales and modes** are matched across all twelve roots, reporting `missing`
and `extra` notes per candidate rather than only exact hits — because the useful
answer to "what scale is this" is usually "these three, and here's the one note
that would decide it." The seven diatonic modes are tagged separately from the
wider scale set so they can be shown first.

## Input methods

- **Fretboard** — configurable tuning, click any fret. Geometry in `src/lib/fretboard.ts`.
- **Piano keyboard** — click keys directly.
- **Note selector** — plain chromatic buttons when you already know the note names.

All three write to one Zustand store (`src/store/noteStore.ts`), so the results
panel does not care which one you used and you can mix them.

## Running it

```bash
bun install
bun run dev
```

## Stack

React 19 + TypeScript, Vite, [tonal](https://github.com/tonaljs/tonal) for the
theory primitives, Zustand for state. Light/dark theme via `useTheme`. No
backend — everything is computed in the browser.

## Honest limitations

- **No audio.** It will not play the chord back at you, which for an ear-training
  adjacent tool is a genuinely funny omission. It is the obvious next feature.
- No tests.
- Chord scoring is a heuristic, not a voicing-aware analysis. It works on pitch
  classes, so it cannot tell a root-position triad from its second inversion —
  they are the same set of notes. Real inversion detection needs octave
  information, which the input methods do not currently carry.
- Slash chords and extended jazz voicings will often produce several plausible
  answers ranked close together. This is arguably correct behaviour, since so
  will a human.
