import { useNoteStore } from '../store/noteStore';

// Piano-style layout: naturals on bottom row, sharps on top row
const NATURAL_NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

// Each sharp sits between two naturals: after index = natural it sits after
const SHARP_SLOTS = [
  { note: 'C#', after: 0 },
  { note: 'D#', after: 1 },
  // gap at E (no E#)
  { note: 'F#', after: 3 },
  { note: 'G#', after: 4 },
  { note: 'A#', after: 5 },
  // gap at B (no B#)
];

const NAT_W = 56;
const NAT_H = 52;
const NAT_GAP = 5;
const SHP_W = 38;
const SHP_H = 40;

const totalW = 7 * (NAT_W + NAT_GAP) - NAT_GAP;

function getNatX(i: number) {
  return i * (NAT_W + NAT_GAP);
}

function getSharpX(after: number) {
  // Center the sharp between the natural at `after` and the one at `after+1`
  const leftEdge = after * (NAT_W + NAT_GAP) + NAT_W;
  const rightEdge = (after + 1) * (NAT_W + NAT_GAP);
  return (leftEdge + rightEdge) / 2 - SHP_W / 2;
}

export default function NoteSelector() {
  const { activeNotes, toggleNote } = useNoteStore();

  return (
    <div
      style={{
        padding: '20px 16px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
      }}
    >
      {/* Piano-style note layout */}
      <div
        style={{
          position: 'relative',
          width: totalW,
          height: NAT_H + SHP_H + 6,
          maxWidth: '100%',
        }}
      >
        {/* Sharp (black) keys — top row */}
        {SHARP_SLOTS.map(({ note, after }) => {
          const active = activeNotes.has(note);
          return (
            <button
              key={note}
              onClick={() => toggleNote(note)}
              style={{
                position: 'absolute',
                left: getSharpX(after),
                top: 0,
                width: SHP_W,
                height: SHP_H,
                zIndex: 2,
                borderRadius: 6,
                border: active
                  ? '1px solid var(--accent)'
                  : '1px solid var(--border)',
                background: active
                  ? 'var(--accent)'
                  : 'var(--surface)',
                color: active ? 'var(--accent-fg)' : 'var(--text-2)',
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: '0.02em',
                cursor: 'pointer',
                transition: 'all 100ms ease',
                boxShadow: active ? 'var(--accent-glow)' : 'var(--shadow-sm)',
                outline: 'none',
              }}
            >
              {note}
            </button>
          );
        })}

        {/* Natural (white) keys — bottom row */}
        {NATURAL_NOTES.map((note, i) => {
          const active = activeNotes.has(note);
          return (
            <button
              key={note}
              onClick={() => toggleNote(note)}
              style={{
                position: 'absolute',
                left: getNatX(i),
                bottom: 0,
                width: NAT_W,
                height: NAT_H,
                zIndex: 1,
                borderRadius: 7,
                border: active
                  ? '1px solid var(--accent)'
                  : '1px solid var(--border)',
                background: active
                  ? 'var(--accent)'
                  : 'var(--panel-raised)',
                color: active ? 'var(--accent-fg)' : 'var(--text)',
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
                transition: 'all 100ms ease',
                boxShadow: active ? 'var(--accent-glow)' : 'var(--shadow-sm)',
                outline: 'none',
              }}
            >
              {note}
            </button>
          );
        })}
      </div>

      {/* Active count hint */}
      <p style={{ fontSize: 11, color: 'var(--text-3)', letterSpacing: '0.04em' }}>
        {activeNotes.size === 0
          ? 'Click notes to select — sharps on top, naturals below'
          : `${activeNotes.size} note${activeNotes.size === 1 ? '' : 's'} selected`}
      </p>
    </div>
  );
}
