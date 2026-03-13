import { Chord, ScaleType, Scale, Note } from 'tonal';
import { ENHARMONIC_MAP } from './constants';

export interface ChordMatch {
  root: string;
  quality: string;
  symbol: string;
  notes: string[];
  score: number;
}

export interface ScaleMatch {
  root: string;
  name: string;
  type: 'mode' | 'scale';
  notes: string[];
  missing: string[];
  extra: string[];
  score: number;
}

export interface AnalysisResult {
  chords: ChordMatch[];
  scales: ScaleMatch[];
}

const MODES = new Set([
  'ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian',
]);

const ROOTS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function normalizeNote(n: string): string {
  const pc = Note.pitchClass(n);
  return ENHARMONIC_MAP[pc] ?? pc;
}

function toChromatic(notes: Iterable<string>): Set<string> {
  const result = new Set<string>();
  for (const n of notes) {
    const normalized = normalizeNote(n);
    if (normalized) result.add(normalized);
  }
  return result;
}

export function analyzeNotes(inputNotes: Set<string>): AnalysisResult {
  if (inputNotes.size === 0) return { chords: [], scales: [] };

  const normalizedInput = toChromatic(inputNotes);
  const inputArr = Array.from(normalizedInput);

  // --- Chord detection ---
  const chords: ChordMatch[] = [];
  const detectedSymbols = Chord.detect(inputArr);

  for (const symbol of detectedSymbols) {
    const chord = Chord.get(symbol);
    if (!chord || !chord.tonic) continue;
    const chordNotes = chord.notes.map(normalizeNote).filter(Boolean);
    const chordSet = new Set(chordNotes);
    const hits = inputArr.filter(n => chordSet.has(n)).length;
    const score = hits / Math.max(chordSet.size, normalizedInput.size);
    chords.push({
      root: normalizeNote(chord.tonic),
      quality: chord.quality,
      symbol: chord.symbol,
      notes: chordNotes,
      score,
    });
  }

  // Also try all rotations/permutations of input as potential chord roots
  for (const root of inputArr) {
    const rotated = [root, ...inputArr.filter(n => n !== root)];
    const extra = Chord.detect(rotated);
    for (const sym of extra) {
      if (!detectedSymbols.includes(sym)) {
        const chord = Chord.get(sym);
        if (!chord || !chord.tonic) continue;
        const chordNotes = chord.notes.map(normalizeNote).filter(Boolean);
        const chordSet = new Set(chordNotes);
        const hits = inputArr.filter(n => chordSet.has(n)).length;
        const score = hits / Math.max(chordSet.size, normalizedInput.size);
        chords.push({
          root: normalizeNote(chord.tonic),
          quality: chord.quality,
          symbol: chord.symbol,
          notes: chordNotes,
          score,
        });
        detectedSymbols.push(sym);
      }
    }
  }

  chords.sort((a, b) => b.score - a.score);

  // --- Scale/Mode detection ---
  const scales: ScaleMatch[] = [];
  const allScaleTypes = ScaleType.all();

  for (const root of ROOTS) {
    for (const scaleType of allScaleTypes) {
      if (!scaleType.intervals || scaleType.intervals.length === 0) continue;
      const scale = Scale.get(`${root} ${scaleType.name}`);
      if (!scale || scale.empty) continue;

      const scaleNotes = scale.notes.map(normalizeNote).filter(Boolean);
      const scaleSet = new Set(scaleNotes);

      const hits = inputArr.filter(n => scaleSet.has(n));
      const missing = scaleNotes.filter(n => !normalizedInput.has(n));
      const extra = inputArr.filter(n => !scaleSet.has(n));

      const score = hits.length / Math.max(scaleSet.size, normalizedInput.size);
      if (score < 0.6) continue;

      const isMode = MODES.has(scaleType.name.toLowerCase());

      scales.push({
        root: normalizeNote(root),
        name: scaleType.name,
        type: isMode ? 'mode' : 'scale',
        notes: scaleNotes,
        missing,
        extra,
        score,
      });
    }
  }

  scales.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    // Fewer missing/extra = better
    return (a.missing.length + a.extra.length) - (b.missing.length + b.extra.length);
  });

  // Deduplicate by symbol for chords
  const seenChords = new Set<string>();
  const uniqueChords = chords.filter(c => {
    if (seenChords.has(c.symbol)) return false;
    seenChords.add(c.symbol);
    return true;
  });

  // Deduplicate scales
  const seenScales = new Set<string>();
  const uniqueScales = scales.filter(s => {
    const key = `${s.root}|${s.name}`;
    if (seenScales.has(key)) return false;
    seenScales.add(key);
    return true;
  });

  return { chords: uniqueChords, scales: uniqueScales };
}
