export const CHROMATIC_NOTES = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
] as const;

export const FLAT_NOTES = [
  'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B',
] as const;

export type NoteName = typeof CHROMATIC_NOTES[number] | typeof FLAT_NOTES[number];

export const ENHARMONIC_MAP: Record<string, string> = {
  'Db': 'C#', 'Eb': 'D#', 'Fb': 'E', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#', 'Cb': 'B',
  'E#': 'F', 'B#': 'C',
};

export const PIANO_SIZES = [25, 49, 61, 88] as const;
export type PianoSize = typeof PIANO_SIZES[number];

export const PIANO_SIZE_LABELS: Record<PianoSize, string> = {
  25: '25 keys (2 oct)',
  49: '49 keys (4 oct)',
  61: '61 keys (5 oct)',
  88: '88 keys (7 oct)',
};

// MIDI note for C4 = 60
export const PIANO_START_OCTAVE: Record<PianoSize, number> = {
  25: 4, // C4–C6
  49: 2, // C2–C6
  61: 2, // C2–C7
  88: 0, // A0–C8
};

export const PIANO_START_NOTE: Record<PianoSize, { note: string; octave: number }> = {
  25: { note: 'C', octave: 4 },
  49: { note: 'C', octave: 2 },
  61: { note: 'C', octave: 2 },
  88: { note: 'A', octave: 0 },
};

// Guitar tuning presets
export interface TuningPreset {
  label: string;
  notes: string[]; // low to high, with octave e.g. "E2"
}

export const GUITAR_6_TUNINGS: TuningPreset[] = [
  { label: 'Standard (EADGBe)',        notes: ['E2','A2','D3','G3','B3','E4'] },
  { label: 'Half-step down (EbAbDbGbBbeb)', notes: ['Eb2','Ab2','Db3','Gb3','Bb3','Eb4'] },
  { label: 'Whole-step down / D standard', notes: ['D2','G2','C3','F3','A3','D4'] },
  { label: 'Drop D',                   notes: ['D2','A2','D3','G3','B3','E4'] },
  { label: 'Drop C#',                  notes: ['C#2','G#2','C#3','F#3','A#3','D#4'] },
  { label: 'Drop C',                   notes: ['C2','G2','C3','F3','A3','D4'] },
  { label: 'Drop B',                   notes: ['B1','F#2','B2','E3','G#3','C#4'] },
  { label: 'Open G',                   notes: ['D2','G2','D3','G3','B3','D4'] },
  { label: 'Open D',                   notes: ['D2','A2','D3','F#3','A3','D4'] },
  { label: 'DADGAD',                   notes: ['D2','A2','D3','G3','A3','D4'] },
  { label: 'CGDGBD (Midwest Emo)',     notes: ['C2','G2','D3','G3','B3','D4'] },
  { label: 'CGCGCE (Midwest Emo)',     notes: ['C2','G2','C3','G3','C4','E4'] },
  { label: 'CGCFAD (Cap\'n Jazz)',     notes: ['C2','G2','C3','F3','A3','D4'] },
  { label: 'DAEAC#E',                  notes: ['D2','A2','E3','A3','C#4','E4'] },
  { label: 'DADF#AD (Open D variant)', notes: ['D2','A2','D3','F#3','A3','D4'] },
  { label: 'EBEG#BE (Open E)',         notes: ['E2','B2','E3','G#3','B3','E4'] },
];

export const GUITAR_7_TUNINGS: TuningPreset[] = [
  { label: 'Standard (BEADGBe)',       notes: ['B1','E2','A2','D3','G3','B3','E4'] },
  { label: 'Drop A',                   notes: ['A1','E2','A2','D3','G3','B3','E4'] },
  { label: 'Whole-step down',          notes: ['A1','D2','G2','C3','F3','A3','D4'] },
];

export const GUITAR_8_TUNINGS: TuningPreset[] = [
  { label: 'Standard (F#BEADGBe)',     notes: ['F#1','B1','E2','A2','D3','G3','B3','E4'] },
  { label: 'Drop E',                   notes: ['E1','B1','E2','A2','D3','G3','B3','E4'] },
];

export const BASS_4_TUNINGS: TuningPreset[] = [
  { label: 'Standard (EADG)',          notes: ['E1','A1','D2','G2'] },
  { label: 'Half-step down',           notes: ['Eb1','Ab1','Db2','Gb2'] },
  { label: 'Whole-step down / D standard', notes: ['D1','G1','C2','F2'] },
  { label: 'Drop D',                   notes: ['D1','A1','D2','G2'] },
  { label: 'Drop C',                   notes: ['C1','G1','C2','F2'] },
  { label: 'Drop B',                   notes: ['B0','F#1','B1','E2'] },
];

export const BASS_5_TUNINGS: TuningPreset[] = [
  { label: 'Standard (BEADG)',         notes: ['B0','E1','A1','D2','G2'] },
  { label: 'Drop A',                   notes: ['A0','E1','A1','D2','G2'] },
  { label: 'Whole-step down',          notes: ['A0','D1','G1','C2','F2'] },
  { label: 'High C (EADGC)',           notes: ['E1','A1','D2','G2','C3'] },
];

export const BASS_6_TUNINGS: TuningPreset[] = [
  { label: 'Standard (BEADGC)',        notes: ['B0','E1','A1','D2','G2','C3'] },
  { label: 'Drop A',                   notes: ['A0','E1','A1','D2','G2','C3'] },
  { label: 'Whole-step down',          notes: ['A0','D1','G1','C2','F2','Bb2'] },
];

export const BASS_7_TUNINGS: TuningPreset[] = [
  { label: 'Standard (F#BEADGC)',      notes: ['F#0','B0','E1','A1','D2','G2','C3'] },
];
