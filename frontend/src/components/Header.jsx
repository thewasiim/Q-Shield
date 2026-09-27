import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const TABS = [
  { id: 'home',      label: 'Overview' },
  { id: 'studio',    label: 'QDS Studio' },
  { id: 'attacks',   label: 'Threat Lab' },
  { id: 'telemetry', label: 'Telemetry' },
  { id: 'ledger',    label: 'Audit Ledger' },
];

export default function Header({ activeTab, setActiveTab, summary, onOpenBenchmark }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setMobileOpen(false);
    window.location.hash = tabId;
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const totalVerif = summary?.total_verifications ?? 0;
  const threats    = (summary?.rejected ?? 0) + (summary?.suspicious ?? 0);

  return (
    <>
      <header className={`nav ${scrolled ? 'scrolled' : ''}`} role="banner">
        <div className="nav-inner">

          {/* Brand */}
          <div className="nav-brand" style={{ cursor: 'pointer' }} onClick={() => handleTabClick('home')}>
            <div className="nav-brand-name" style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
              Q-SHIELD
            </div>
          </div>

          {/* Center tabs */}
          <nav className="nav-links" aria-label="Main Navigation">
            {TABS.map(t => (
              <button
                key={t.id}
                className={`nav-link ${activeTab === t.id ? 'active' : ''}`}
                onClick={() => handleTabClick(t.id)}
              >
                {t.label}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="nav-right">
            {/* Live status badge */}
            {totalVerif > 0 && (
              <div className="nav-status">
                <span className="dot dot-success" style={{ width: 6, height: 6 }} />
                <span>{totalVerif} verified</span>
                {threats > 0 && (
                  <>
                    <span style={{ color: 'var(--c-border)', fontWeight: 300 }}>·</span>
                    <span style={{ color: 'var(--c-danger)', fontWeight: 600 }}>{threats} threats</span>
                  </>
                )}
              </div>
            )}

            <button
              className="btn btn-primary btn-sm"
              onClick={onOpenBenchmark}
              style={{ fontSize: 13, whiteSpace: 'nowrap' }}
            >
              Benchmark
            </button>

            {/* Mobile menu toggle */}
            <button
              className="nav-hamburger"
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="mobile-nav">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => handleTabClick(t.id)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '12px 16px',
                  fontSize: 15,
                  fontWeight: activeTab === t.id ? 600 : 400,
                  color: activeTab === t.id ? 'var(--c-text-primary)' : 'var(--c-text-secondary)',
                  background: activeTab === t.id ? 'var(--c-bg)' : 'transparent',
                  border: 'none',
                  borderRadius: 'var(--r-sm)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  transition: 'background var(--t1)',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div style={{ height: 1, background: 'var(--c-border)', margin: '14px 0' }} />
          <button
            className="btn btn-primary"
            onClick={() => { onOpenBenchmark(); setMobileOpen(false); }}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Run Benchmark
          </button>
        </div>
      )}
    </>
  );
}
