import { useState } from 'react';
import NoteSelector from './NoteSelector';
import PianoKeyboard from './PianoKeyboard';
import Fretboard from './Fretboard';
import {
  GUITAR_6_TUNINGS, GUITAR_7_TUNINGS, GUITAR_8_TUNINGS,
  BASS_4_TUNINGS, BASS_5_TUNINGS, BASS_6_TUNINGS, BASS_7_TUNINGS,
} from '../lib/constants';

type TabId = 'notes' | 'piano' | 'guitar6' | 'guitar7' | 'guitar8' | 'bass4' | 'bass5' | 'bass6' | 'bass7';

const GROUPS = [
  {
    label: 'Input',
    tabs: [
      { id: 'notes' as TabId, label: 'Notes' },
      { id: 'piano' as TabId, label: 'Piano' },
    ],
  },
  {
    label: 'Guitar',
    tabs: [
      { id: 'guitar6' as TabId, label: '6-str' },
      { id: 'guitar7' as TabId, label: '7-str' },
      { id: 'guitar8' as TabId, label: '8-str' },
    ],
  },
  {
    label: 'Bass',
    tabs: [
      { id: 'bass4' as TabId, label: '4-str' },
      { id: 'bass5' as TabId, label: '5-str' },
      { id: 'bass6' as TabId, label: '6-str' },
      { id: 'bass7' as TabId, label: '7-str' },
    ],
  },
];

function loadTab(): TabId {
  try {
    return (localStorage.getItem('earless:tab') as TabId) || 'notes';
  } catch {
    return 'notes';
  }
}

export default function InputTabs() {
  const [activeTab, setActiveTab] = useState<TabId>(loadTab);

  function setTab(id: TabId) {
    setActiveTab(id);
    try { localStorage.setItem('earless:tab', id); } catch {}
  }

  return (
    <div className="flex flex-col">
      {/* Tab bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          padding: '8px 12px',
          borderBottom: '1px solid var(--border)',
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}
      >
        {GROUPS.map((group, gi) => (
          <div key={group.label} style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Group divider */}
            {gi > 0 && (
              <div
                style={{
                  width: 1,
                  height: 18,
                  background: 'var(--border)',
                  margin: '0 6px',
                  flexShrink: 0,
                }}
              />
            )}
            {/* Group label on large screens */}
            <span
              className="hidden sm:block"
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--text-3)',
                marginRight: 4,
                flexShrink: 0,
              }}
            >
              {group.label}
            </span>
            {group.tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setTab(tab.id)}
                className={`tab-pill ${activeTab === tab.id ? 'active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'notes'   && <NoteSelector />}
        {activeTab === 'piano'   && <PianoKeyboard />}
        {activeTab === 'guitar6' && <Fretboard tunings={GUITAR_6_TUNINGS} />}
        {activeTab === 'guitar7' && <Fretboard tunings={GUITAR_7_TUNINGS} />}
        {activeTab === 'guitar8' && <Fretboard tunings={GUITAR_8_TUNINGS} />}
        {activeTab === 'bass4'   && <Fretboard tunings={BASS_4_TUNINGS} defaultFrets={24} />}
        {activeTab === 'bass5'   && <Fretboard tunings={BASS_5_TUNINGS} defaultFrets={24} />}
        {activeTab === 'bass6'   && <Fretboard tunings={BASS_6_TUNINGS} defaultFrets={24} />}
        {activeTab === 'bass7'   && <Fretboard tunings={BASS_7_TUNINGS} defaultFrets={24} />}
      </div>
    </div>
  );
}
