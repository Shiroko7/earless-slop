import { useState, useMemo } from 'react';
import { useNoteStore } from '../store/noteStore';
import { buildFretboard } from '../lib/fretboard';
import type { TuningPreset } from '../lib/constants';
import { useTheme } from '../hooks/useTheme';

interface FretboardProps {
  tunings: TuningPreset[];
  defaultFrets?: number;
}

const FRET_W = 42;
const STR_H = 34;
const LABEL_W = 36;
const HEAD_W = 40;
const DOT_FRETS = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];
const DOUBLE_DOT = [12, 24];

// String thickness by index (0 = lowest = thickest)
function strThickness(si: number, total: number): number {
  const ratio = (total - 1 - si) / Math.max(total - 1, 1);
  return 0.8 + ratio * 1.6;
}

type ColorSet = {
  neck: string;
  neckSide: string;
  fretBar: string;
  str: string;
  dot: string;
  nut: string;
  noteAct: string;
  noteActFg: string;
  fretNum: string;
  strLabel: string;
  strLabelAct: string;
};

const DARK: ColorSet = {
  neck: '#16120e',
  neckSide: '#0e0a08',
  fretBar: '#2e2924',
  str: '#524e48',
  dot: '#231f1b',
  nut: '#706050',
  noteAct: '#e8a020',
  noteActFg: '#0b0b0d',
  fretNum: '#38342e',
  strLabel: '#585450',
  strLabelAct: '#e8a020',
};

const LIGHT: ColorSet = {
  neck: '#c4a06c',
  neckSide: '#a8885a',
  fretBar: '#8a7050',
  str: '#786040',
  dot: '#b49870',
  nut: '#d0b888',
  noteAct: '#9e6608',
  noteActFg: '#ffffff',
  fretNum: '#9c8e78',
  strLabel: '#8a7a68',
  strLabelAct: '#9e6608',
};

export default function Fretboard({ tunings, defaultFrets = 24 }: FretboardProps) {
  const [presetIdx, setPresetIdx] = useState(0);
  const [customTuning, setCustomTuning] = useState<string[]>(tunings[0].notes);
  const [frets, setFrets] = useState(defaultFrets);
  const [showTuning, setShowTuning] = useState(false);
  const { activeNotes, toggleNote } = useNoteStore();
  const { theme } = useTheme();

  const C = theme === 'dark' ? DARK : LIGHT;

  const handlePresetChange = (idx: number) => {
    setPresetIdx(idx);
    setCustomTuning([...tunings[idx].notes]);
  };

  const handleStringTune = (si: number, val: string) => {
    const next = [...customTuning];
    next[si] = val;
    setCustomTuning(next);
  };

  const noteGrid = useMemo(() => buildFretboard(customTuning, frets), [customTuning, frets]);

  const numStrings = customTuning.length;
  const totalW = LABEL_W + HEAD_W + (frets + 1) * FRET_W;
  const totalH = numStrings * STR_H + 28;

  // Highest string index at top (low string at bottom)
  const strRows = Array.from({ length: numStrings }, (_, i) => numStrings - 1 - i);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}>
      {/* Controls row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 500 }}>Tuning</span>
          <select
            value={presetIdx}
            onChange={e => handlePresetChange(Number(e.target.value))}
            className="ctrl-select"
          >
            {tunings.map((t, i) => (
              <option key={i} value={i}>{t.label}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 500 }}>Frets</span>
          <select
            value={frets}
            onChange={e => setFrets(Number(e.target.value))}
            className="ctrl-select"
          >
            {[12, 17, 21, 24].map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        <button
          onClick={() => setShowTuning(v => !v)}
          style={{
            fontSize: 12,
            color: showTuning ? 'var(--accent)' : 'var(--text-2)',
            background: showTuning ? 'var(--accent-dim)' : 'transparent',
            border: `1px solid ${showTuning ? 'var(--accent-border)' : 'var(--border)'}`,
            borderRadius: 6,
            padding: '4px 10px',
            cursor: 'pointer',
            transition: 'all 120ms',
            fontWeight: 500,
            outline: 'none',
          }}
        >
          {showTuning ? 'Hide tuning' : 'Edit tuning'}
        </button>
      </div>

      {/* Per-string tuning editors (collapsible) */}
      {showTuning && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '10px 12px',
          }}
        >
          {strRows.map(si => (
            <div key={si} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 11, color: 'var(--text-3)', width: 48, textAlign: 'right' }}>
                Str {si + 1}
              </span>
              <input
                type="text"
                value={customTuning[si] ?? ''}
                onChange={e => handleStringTune(si, e.target.value)}
                className="ctrl-input"
                placeholder="e.g. E2"
              />
            </div>
          ))}
        </div>
      )}

      {/* Fretboard SVG */}
      <div style={{ overflowX: 'auto', paddingBottom: 4 }}>
        <svg width={totalW} height={totalH} style={{ display: 'block' }}>
          {/* Neck background */}
          <rect
            x={LABEL_W + HEAD_W - 4}
            y={0}
            width={totalW - LABEL_W - HEAD_W + 4}
            height={numStrings * STR_H}
            fill={C.neck}
          />
          {/* Headstock area */}
          <rect
            x={LABEL_W}
            y={0}
            width={HEAD_W - 4}
            height={numStrings * STR_H}
            fill={C.neckSide}
          />

          {/* Fret lines */}
          {Array.from({ length: frets + 1 }, (_, f) => (
            <rect
              key={f}
              x={LABEL_W + HEAD_W + f * FRET_W - (f === 0 ? 0 : 1)}
              y={0}
              width={f === 0 ? 0 : 2}
              height={numStrings * STR_H}
              fill={C.fretBar}
              rx={0.5}
            />
          ))}

          {/* Nut */}
          <rect
            x={LABEL_W + HEAD_W - 5}
            y={0}
            width={5}
            height={numStrings * STR_H}
            fill={C.nut}
            rx={1}
          />

          {/* String lines */}
          {strRows.map((si, row) => (
            <line
              key={si}
              x1={LABEL_W}
              y1={row * STR_H + STR_H / 2}
              x2={totalW}
              y2={row * STR_H + STR_H / 2}
              stroke={C.str}
              strokeWidth={strThickness(si, numStrings)}
            />
          ))}

          {/* Fret position dots */}
          {DOT_FRETS.filter(f => f <= frets).map(f => {
            const x = LABEL_W + HEAD_W + (f - 0.5) * FRET_W;
            const midY = (numStrings * STR_H) / 2;
            const isDouble = DOUBLE_DOT.includes(f);
            return (
              <g key={f}>
                {isDouble ? (
                  <>
                    <circle cx={x} cy={midY - STR_H * 0.75} r={4.5} fill={C.dot} />
                    <circle cx={x} cy={midY + STR_H * 0.75} r={4.5} fill={C.dot} />
                  </>
                ) : (
                  <circle cx={x} cy={midY} r={4.5} fill={C.dot} />
                )}
              </g>
            );
          })}

          {/* Fret numbers */}
          {Array.from({ length: frets }, (_, i) => i + 1).map(f => (
            <text
              key={f}
              x={LABEL_W + HEAD_W + (f - 0.5) * FRET_W}
              y={numStrings * STR_H + 18}
              textAnchor="middle"
              fontSize={9}
              fontFamily="'JetBrains Mono', monospace"
              fontWeight="500"
              fill={C.fretNum}
              style={{ userSelect: 'none' }}
            >
              {f}
            </text>
          ))}

          {/* Note circles */}
          {strRows.map((si, row) =>
            Array.from({ length: frets + 1 }, (_, fret) => {
              const note = noteGrid[si]?.[fret];
              if (!note) return null;
              const isActive = activeNotes.has(note);
              const isOpen = fret === 0;
              const cy = row * STR_H + STR_H / 2;
              const x = isOpen
                ? LABEL_W + HEAD_W / 2
                : LABEL_W + HEAD_W + (fret - 0.5) * FRET_W;

              if (!isActive) {
                // Invisible click target only
                return (
                  <rect
                    key={`${si}-${fret}`}
                    x={x - 15}
                    y={cy - 15}
                    width={30}
                    height={30}
                    fill="transparent"
                    style={{ cursor: 'pointer' }}
                    onClick={() => toggleNote(note)}
                  />
                );
              }

              return (
                <g key={`${si}-${fret}`} style={{ cursor: 'pointer' }} onClick={() => toggleNote(note)}>
                  {/* Outer glow ring */}
                  <circle cx={x} cy={cy} r={14} fill={C.noteAct} opacity={0.2} />
                  {/* Main circle */}
                  <circle cx={x} cy={cy} r={11} fill={C.noteAct} />
                  <text
                    x={x}
                    y={cy + 4}
                    textAnchor="middle"
                    fontSize={9}
                    fontFamily="'JetBrains Mono', monospace"
                    fontWeight="700"
                    fill={C.noteActFg}
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    {note}
                  </text>
                </g>
              );
            })
          )}

          {/* Open string labels */}
          {strRows.map((si, row) => {
            const openNote = noteGrid[si]?.[0];
            if (!openNote) return null;
            const active = activeNotes.has(openNote);
            return (
              <text
                key={`lbl-${si}`}
                x={LABEL_W - 5}
                y={row * STR_H + STR_H / 2 + 4}
                textAnchor="end"
                fontSize={10}
                fontFamily="'JetBrains Mono', monospace"
                fontWeight="600"
                fill={active ? C.strLabelAct : C.strLabel}
                style={{ userSelect: 'none' }}
              >
                {openNote}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
