import InputTabs from './components/InputTabs';
import ResultsPanel from './components/ResultsPanel';
import { useTheme } from './hooks/useTheme';

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="4" />
      <line x1="12" y1="20" x2="12" y2="22" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="2" y1="12" x2="4" y2="12" />
      <line x1="20" y1="12" x2="22" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function App() {
  const { theme, toggle } = useTheme();

  return (
    <div style={{ minHeight: '100svh', background: 'var(--bg)' }}>
      {/* Header */}
      <header
        style={{
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          className="max-w-[1680px] mx-auto px-5"
          style={{ display: 'flex', alignItems: 'center', gap: 12, height: 52 }}
        >
          {/* Logo mark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--accent)', flexShrink: 0 }}>
              <circle cx="12" cy="12" r="3" fill="currentColor" />
              <path d="M12 3C12 3 19 6.5 19 12C19 17.5 12 21 12 21C12 21 5 17.5 5 12C5 6.5 12 3Z" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4" />
              <path d="M12 6C12 6 16.5 8.5 16.5 12C16.5 15.5 12 18 12 18C12 18 7.5 15.5 7.5 12C7.5 8.5 12 6Z" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.65" />
            </svg>
            <span
              style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 800,
                fontSize: 15,
                letterSpacing: '-0.01em',
                color: 'var(--text)',
              }}
            >
              Theory<span style={{ color: 'var(--accent)' }}>ID</span>
            </span>
          </div>

          <div style={{ flex: 1 }} />

          {/* Descriptor */}
          <span
            style={{
              fontSize: 12,
              color: 'var(--text-3)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              fontWeight: 500,
              display: 'none',
            }}
            className="sm:block"
          >
            Music Theory Identifier
          </span>

          <div style={{ flex: 1 }} />

          {/* Theme toggle */}
          <button
            className="theme-toggle"
            onClick={toggle}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </header>

      {/* Main layout: two-column on lg+ */}
      <main className="max-w-[1680px] mx-auto px-4 py-5 lg:grid lg:gap-5" style={{ gridTemplateColumns: '1fr 340px' }}>
        {/* Left: Input */}
        <div className="flex flex-col gap-4">
          <div
            style={{
              background: 'var(--panel)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            <InputTabs />
          </div>

          {/* Mobile: results below input */}
          <div className="lg:hidden">
            <div
              style={{
                background: 'var(--panel)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                overflow: 'hidden',
              }}
            >
              <ResultsPanel />
            </div>
          </div>
        </div>

        {/* Right: Results (sticky on desktop) */}
        <div className="hidden lg:block">
          <div
            style={{
              position: 'sticky',
              top: 68,
              background: 'var(--panel)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              overflow: 'hidden',
              maxHeight: 'calc(100svh - 84px)',
              overflowY: 'auto',
            }}
          >
            <ResultsPanel />
          </div>
        </div>
      </main>
    </div>
  );
}
