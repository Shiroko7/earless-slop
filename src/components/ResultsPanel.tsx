import { useNoteStore } from '../store/noteStore';
import type { ChordMatch, ScaleMatch } from '../lib/musicTheory';

function ScoreBar({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div className="score-track">
        <div className="score-fill" style={{ width: `${pct}%` }} />
      </div>
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          fontWeight: 600,
          color: pct === 100 ? 'var(--green)' : 'var(--text-2)',
          width: 32,
          textAlign: 'right',
        }}
      >
        {pct}%
      </span>
    </div>
  );
}

function ChordCard({ chord }: { chord: ChordMatch }) {
  const pct = Math.round(chord.score * 100);
  const isPerfect = pct === 100;
  return (
    <div
      className="chord-card"
      style={isPerfect ? { borderColor: 'var(--accent-border)', background: 'var(--accent-dim)' } : {}}
    >
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 700,
          fontSize: 15,
          color: isPerfect ? 'var(--accent)' : 'var(--text)',
          letterSpacing: '-0.01em',
        }}
      >
        {chord.symbol}
      </span>
      <span style={{ fontSize: 10, color: 'var(--text-3)', fontWeight: 400, letterSpacing: '0.01em' }}>
        {chord.quality}
      </span>
      <div style={{ marginTop: 4 }}>
        <ScoreBar score={chord.score} />
      </div>
    </div>
  );
}

function TypeBadge({ type }: { type: 'scale' | 'mode' }) {
  const isMode = type === 'mode';
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        padding: '2px 6px',
        borderRadius: 4,
        background: isMode ? 'var(--violet-dim)' : 'var(--green-dim)',
        color: isMode ? 'var(--violet)' : 'var(--green)',
        border: `1px solid ${isMode ? 'var(--violet-border)' : 'var(--green-border)'}`,
        flexShrink: 0,
      }}
    >
      {type}
    </span>
  );
}

function ScaleRow({ scale }: { scale: ScaleMatch }) {
  const pct = Math.round(scale.score * 100);
  return (
    <div className="scale-row" style={pct === 100 ? { borderColor: 'var(--accent-border)' } : {}}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              fontSize: 13,
              color: 'var(--text)',
              letterSpacing: '-0.01em',
            }}
          >
            {scale.root}
          </span>
          <span style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 400 }}>
            {scale.name}
          </span>
          <TypeBadge type={scale.type} />
        </div>
        {(scale.missing.length > 0 || scale.extra.length > 0) && (
          <div style={{ display: 'flex', gap: 10, marginTop: 4, flexWrap: 'wrap' }}>
            {scale.missing.length > 0 && (
              <span style={{ fontSize: 10, color: 'var(--amber-warn)', fontFamily: "'JetBrains Mono', monospace" }}>
                −{scale.missing.join(' ')}
              </span>
            )}
            {scale.extra.length > 0 && (
              <span style={{ fontSize: 10, color: 'var(--red)', fontFamily: "'JetBrains Mono', monospace" }}>
                +{scale.extra.join(' ')}
              </span>
            )}
          </div>
        )}
      </div>
      <div style={{ flexShrink: 0 }}>
        <ScoreBar score={scale.score} />
      </div>
    </div>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
      }}
    >
      <span className="section-label">{children}</span>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
    </div>
  );
}

export default function ResultsPanel() {
  const { results, activeNotes, clearNotes } = useNoteStore();
  const { chords, scales } = results;

  const modes = scales.filter(s => s.type === 'mode');
  const otherScales = scales.filter(s => s.type === 'scale');

  const sortedNotes = Array.from(activeNotes).sort();
  const noteOrder = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  sortedNotes.sort((a, b) => noteOrder.indexOf(a) - noteOrder.indexOf(b));

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Panel header */}
      <div
        style={{
          padding: '10px 14px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span
          style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--text-3)',
          }}
        >
          Analysis
        </span>
        <div style={{ flex: 1 }} />
        {activeNotes.size > 0 && (
          <button
            onClick={clearNotes}
            style={{
              fontSize: 11,
              color: 'var(--text-3)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '2px 6px',
              borderRadius: 4,
              transition: 'color 120ms',
              fontWeight: 500,
              outline: 'none',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--red)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}
          >
            Clear all
          </button>
        )}
      </div>

      {/* Active notes */}
      {activeNotes.size > 0 && (
        <div
          style={{
            padding: '10px 14px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 5,
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 10, color: 'var(--text-3)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginRight: 2 }}>
            Active
          </span>
          {sortedNotes.map(n => (
            <span key={n} className="note-badge">{n}</span>
          ))}
        </div>
      )}

      {/* Empty state */}
      {activeNotes.size === 0 && (
        <div
          style={{
            padding: '40px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
          }}
        >
          {/* Musical staff icon */}
          <svg width="40" height="32" viewBox="0 0 40 32" fill="none" style={{ opacity: 0.2 }}>
            {[4, 10, 16, 22, 28].map(y => (
              <line key={y} x1="2" y1={y} x2="38" y2={y} stroke="currentColor" strokeWidth="1.5" />
            ))}
            <ellipse cx="28" cy="26" rx="5" ry="3.5" fill="currentColor" transform="rotate(-15 28 26)" />
            <line x1="32.5" y1="26" x2="32.5" y2="4" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <p style={{ fontSize: 13, color: 'var(--text-3)', fontStyle: 'italic' }}>
            Select notes to identify chords, scales & modes
          </p>
        </div>
      )}

      {/* Results */}
      {activeNotes.size > 0 && (
        <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: 18 }}>

          {chords.length > 0 && (
            <section>
              <SectionHeader>Chords</SectionHeader>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {chords.slice(0, 20).map(c => (
                  <ChordCard key={c.symbol} chord={c} />
                ))}
              </div>
            </section>
          )}

          {modes.length > 0 && (
            <section>
              <SectionHeader>Modes</SectionHeader>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {modes.slice(0, 14).map(s => (
                  <ScaleRow key={`${s.root}-${s.name}`} scale={s} />
                ))}
              </div>
            </section>
          )}

          {otherScales.length > 0 && (
            <section>
              <SectionHeader>Scales</SectionHeader>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {otherScales.slice(0, 20).map(s => (
                  <ScaleRow key={`${s.root}-${s.name}`} scale={s} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
