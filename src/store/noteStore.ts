import { create } from 'zustand';
import { analyzeNotes } from '../lib/musicTheory';
import type { AnalysisResult } from '../lib/musicTheory';
import { ENHARMONIC_MAP } from '../lib/constants';
import { Note } from 'tonal';

function normalize(note: string): string {
  const pc = Note.pitchClass(note);
  return ENHARMONIC_MAP[pc] ?? pc;
}

function loadNotes(): Set<string> {
  try {
    const raw = localStorage.getItem('earless:notes');
    if (raw) return new Set(JSON.parse(raw) as string[]);
  } catch {}
  return new Set();
}

function saveNotes(notes: Set<string>) {
  try {
    localStorage.setItem('earless:notes', JSON.stringify([...notes]));
  } catch {}
}

interface NoteStore {
  activeNotes: Set<string>;
  results: AnalysisResult;
  toggleNote: (note: string) => void;
  clearNotes: () => void;
  setNotes: (notes: Set<string>) => void;
}

const initialNotes = loadNotes();

export const useNoteStore = create<NoteStore>((set, get) => ({
  activeNotes: initialNotes,
  results: analyzeNotes(initialNotes),

  toggleNote: (note: string) => {
    const normalized = normalize(note);
    const current = new Set(get().activeNotes);
    if (current.has(normalized)) {
      current.delete(normalized);
    } else {
      current.add(normalized);
    }
    saveNotes(current);
    set({ activeNotes: current, results: analyzeNotes(current) });
  },

  clearNotes: () => {
    saveNotes(new Set());
    set({ activeNotes: new Set(), results: { chords: [], scales: [] } });
  },

  setNotes: (notes: Set<string>) => {
    const normalized = new Set(Array.from(notes).map(normalize).filter(Boolean));
    saveNotes(normalized);
    set({ activeNotes: normalized, results: analyzeNotes(normalized) });
  },
}));
