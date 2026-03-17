import { Note, Interval } from 'tonal';
import { ENHARMONIC_MAP } from './constants';

/**
 * Given an open string note (e.g. "E2") and a fret number, returns the pitch class (no octave).
 */
export function fretToNote(openNote: string, fret: number): string {
  const transposed = Note.transpose(openNote, Interval.fromSemitones(fret));
  if (!transposed) return '';
  const pc = Note.pitchClass(transposed);
  // Normalize to sharp form
  return ENHARMONIC_MAP[pc] ?? pc;
}

/**
 * Compute all notes for a fretboard configuration.
 * Returns a 2D array: [stringIndex][fret] = pitch class string
 */
export function buildFretboard(tuning: string[], frets: number): string[][] {
  return tuning.map((openNote) =>
    Array.from({ length: frets + 1 }, (_, fret) => fretToNote(openNote, fret))
  );
}
