import { useState, useMemo } from 'react';
import { Note } from 'tonal';
import { useNoteStore } from '../store/noteStore';
import { PIANO_SIZES, PIANO_SIZE_LABELS, PIANO_START_NOTE, ENHARMONIC_MAP } from '../lib/constants';
import type { PianoSize } from '../lib/constants';
import { useTheme } from '../hooks/useTheme';

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function normalize(pc: string): string {
  return ENHARMONIC_MAP[pc] ?? pc;
}

function midiToNote(midi: number): string {
  return normalize(NOTE_NAMES[midi % 12]);
}

function buildKeys(size: PianoSize) {
  const { note: startNote, octave: startOctave } = PIANO_START_NOTE[size];
  const startMidi = Note.midi(`${startNote}${startOctave}`) ?? 60;
  return Array.from({ length: size }, (_, i) => {
    const midi = startMidi + i;
    const pc = midiToNote(midi);
    return { midi, note: pc, isBlack: NOTE_NAMES[midi % 12].includes('#') };
  });
}

const WW = 34;
const WH = 130;
const BW = 21;
const BH = 82;


export default function PianoKeyboard() {
  const [size, setSize] = useState<PianoSize>(49);
  const { activeNotes, toggleNote } = useNoteStore();
  const { theme } = useTheme();

  const keys = useMemo(() => buildKeys(size), [size]);

  const { positions, totalWidth } = useMemo(() => {
    let whiteX = 0;
    const positions: Array<{ x: number; isBlack: boolean; note: string; midi: number }> = [];
    const whitePositions: number[] = [];

    for (const key of keys) {
      if (!key.isBlack) {
        whitePositions.push(whiteX);
        positions.push({ x: whiteX, isBlack: false, note: key.note, midi: key.midi });
        whiteX += WW;
      }
    }

    let whiteIdx = 0;
    for (const key of keys) {
      if (key.isBlack) {
        const prevWhiteX = whitePositions[whiteIdx - 1] ?? 0;
        const x = prevWhiteX + WW - BW / 2;
        positions.push({ x, isBlack: true, note: key.note, midi: key.midi });
      } else {
        whiteIdx++;
      }
    }

    return { positions, totalWidth: whiteX };
  }, [keys]);

  const whites = positions.filter(p => !p.isBlack);
  const blacks = positions.filter(p => p.isBlack);

  // We need actual color values for SVG since CSS vars don't work in SVG fill on all browsers
  // Use inline style with currentColor trick: set fill as SVG style attribute
  const darkColors = {
    keyWhite: '#cdc9c0',
    keyWhiteAct: '#e8a020',
    keyBlack: '#0c0c0f',
    keyBlackAct: '#c88010',
    keyStroke: '#06060a',
    keyLabel: '#e8a020',
    keyActFg: '#0b0b0d',
    keyWhiteLabel: '#444040',
  };
  const lightColors = {
    keyWhite: '#f0ece4',
    keyWhiteAct: '#9e6608',
    keyBlack: '#1a1510',
    keyBlackAct: '#7c5006',
    keyStroke: '#c4c0b8',
    keyLabel: '#9e6608',
    keyActFg: '#ffffff',
    keyWhiteLabel: '#908880',
  };

  const col = theme === 'dark' ? darkColors : lightColors;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}>
      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 500 }}>Size</span>
        <select
          value={size}
          onChange={e => setSize(Number(e.target.value) as PianoSize)}
          className="ctrl-select"
        >
          {PIANO_SIZES.map(s => (
            <option key={s} value={s}>{PIANO_SIZE_LABELS[s]}</option>
          ))}
        </select>
        <span style={{ fontSize: 11, color: 'var(--text-3)', marginLeft: 8 }}>
          {activeNotes.size > 0
            ? `${activeNotes.size} note${activeNotes.size === 1 ? '' : 's'} active`
            : 'Click keys to select notes'}
        </span>
      </div>

      {/* Piano SVG */}
      <div style={{ overflowX: 'auto', paddingBottom: 4 }}>
        <svg
          width={totalWidth}
          height={WH + 2}
          style={{ display: 'block', minWidth: '100%' }}
        >
          {/* Background shadow strip */}
          <rect x={0} y={0} width={totalWidth} height={WH + 2}
            fill={theme === 'dark' ? '#0a0a0c' : '#e0dcd4'} rx={3} />

          {/* White keys */}
          {whites.map(({ x, note, midi }) => {
            const active = activeNotes.has(note);
            return (
              <g key={midi} style={{ cursor: 'pointer' }} onClick={() => toggleNote(note)}>
                <rect
                  x={x + 1}
                  y={1}
                  width={WW - 2}
                  height={WH - 1}
                  rx={3}
                  fill={active ? col.keyWhiteAct : col.keyWhite}
                  stroke={col.keyStroke}
                  strokeWidth={0.5}
                />
                {/* Bottom notch decoration */}
                {!active && (
                  <rect
                    x={x + WW * 0.3}
                    y={WH - 18}
                    width={WW * 0.4}
                    height={3}
                    rx={1.5}
                    fill={theme === 'dark' ? '#a09898' : '#c8c4bc'}
                    opacity={0.4}
                  />
                )}
                {/* Note label */}
                <text
                  x={x + WW / 2}
                  y={WH - 6}
                  textAnchor="middle"
                  fontSize={9}
                  fontFamily="'JetBrains Mono', monospace"
                  fontWeight="700"
                  fill={active ? col.keyActFg : col.keyWhiteLabel}
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {note}
                </text>
              </g>
            );
          })}

          {/* Black keys */}
          {blacks.map(({ x, note, midi }) => {
            const active = activeNotes.has(note);
            return (
              <g key={midi} style={{ cursor: 'pointer' }} onClick={() => toggleNote(note)}>
                <rect
                  x={x}
                  y={1}
                  width={BW}
                  height={BH}
                  rx={3}
                  fill={active ? col.keyBlackAct : col.keyBlack}
                  stroke={theme === 'dark' ? '#000' : '#a0a09a'}
                  strokeWidth={0.5}
                />
                {/* Highlight edge on black key */}
                <rect
                  x={x + 1}
                  y={1}
                  width={3}
                  height={BH - 4}
                  rx={1}
                  fill={theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.15)'}
                />
                {active && (
                  <text
                    x={x + BW / 2}
                    y={BH - 7}
                    textAnchor="middle"
                    fontSize={8}
                    fontFamily="'JetBrains Mono', monospace"
                    fontWeight="700"
                    fill={col.keyActFg}
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    {note}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
