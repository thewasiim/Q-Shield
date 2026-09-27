import React from 'react';
import { ShieldAlert } from 'lucide-react';

/**
 * Section 2: THE PROBLEM — Attack Surface Minimal Architecture Diagram
 * Fully responsive across mobile, tablet, and desktop.
 */
export default function ProblemAttackSurface() {
  return (
    <section className="section section-white" style={{ borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)', padding: 'clamp(56px, 8vw, 96px) 0' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 'clamp(32px, 5vw, 48px)', alignItems: 'center' }}>
          
          {/* Left: Editorial Explanation */}
          <div>
            <span className="section-eyebrow" style={{ color: 'var(--danger)' }}>The Vulnerability Gap</span>
            <h2 className="t-headline" style={{ color: 'var(--text-primary)', marginBottom: 20 }}>
              Traditional verification<br />isn't enough.
            </h2>
            <p className="t-body-lg" style={{ color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.65 }}>
              Standard public-key cryptographic signatures authenticate message integrity using computational hardness assumptions.
              They are blind to physical channel disturbances, unable to detect eavesdropping during transmission, and susceptible to state replay without synchronized ledger locks.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span style={{ color: 'var(--danger)', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>✕</span>
                <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                  <strong>Zero Physical Sensitivity:</strong> Mathematical signatures cannot detect quantum measurement collapse or MITM intercept-resend.
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span style={{ color: 'var(--danger)', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>✕</span>
                <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                  <strong>Replay Vulnerability:</strong> Captured valid packets can be re-injected if nonces lack strict lifecycle settlement constraints.
                </span>
              </div>
            </div>
          </div>

          {/* Right: Clean Attack Surface Diagram */}
          <div style={{
            background: 'var(--surface-light)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-xl)',
            padding: 'clamp(20px, 4vw, 36px) clamp(16px, 3.5vw, 28px)',
            position: 'relative',
            width: '100%',
            overflow: 'hidden',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Attack Surface Topography
              </span>
              <span className="badge badge-danger" style={{ fontSize: 11 }}>Adversarial Vectors</span>
            </div>

            {/* Diagram Container */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              
              {/* Root: Digital Signature */}
              <div style={{
                width: '100%',
                maxWidth: 320,
                padding: '12px 16px',
                background: 'var(--c-white)',
                border: '1.5px solid var(--c-border)',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: 'clamp(11px, 2.8vw, 13px)',
                letterSpacing: '0.03em',
                color: 'var(--text-primary)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                textAlign: 'center',
              }}>
                <ShieldAlert size={16} style={{ color: 'var(--danger)', flexShrink: 0 }} />
                <span>DIGITAL SIGNATURE ENVELOPE</span>
              </div>

              {/* Connecting Split Lines */}
              <div style={{ width: '100%', maxWidth: 360, height: 36, position: 'relative' }}>
                <svg width="100%" height="100%" viewBox="0 0 360 36" fill="none" preserveAspectRatio="none">
                  {/* Vertical trunk */}
                  <line x1="180" y1="0" x2="180" y2="16" stroke="var(--border-light)" strokeWidth="2" />
                  {/* Horizontal bar */}
                  <line x1="50" y1="16" x2="310" y2="16" stroke="var(--border-light)" strokeWidth="2" />
                  {/* Branch lines down */}
                  <line x1="50" y1="16" x2="50" y2="36" stroke="var(--danger)" strokeWidth="1.5" strokeDasharray="3 3" />
                  <line x1="180" y1="16" x2="180" y2="36" stroke="var(--warning)" strokeWidth="1.5" strokeDasharray="3 3" />
                  <line x1="310" y1="16" x2="310" y2="36" stroke="var(--accent-violet)" strokeWidth="1.5" strokeDasharray="3 3" />
                </svg>
              </div>

              {/* 3 Classical/Identity Vectors */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 'clamp(6px, 2vw, 12px)',
                width: '100%',
              }}>
                <div style={{
                  padding: '10px 4px',
                  background: 'var(--danger-soft)',
                  border: '1px solid var(--danger-border)',
                  borderRadius: 'var(--radius-sm)',
                  textAlign: 'center',
                  overflow: 'hidden',
                }}>
                  <div style={{ fontSize: 'clamp(9.5px, 2.5vw, 11px)', fontWeight: 700, color: 'var(--danger)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>FORGERY</div>
                  <div style={{ fontSize: 'clamp(8px, 2vw, 10px)', color: 'var(--text-muted)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Basis Collapse</div>
                </div>

                <div style={{
                  padding: '10px 4px',
                  background: 'var(--warning-soft)',
                  border: '1px solid var(--warning-border)',
                  borderRadius: 'var(--radius-sm)',
                  textAlign: 'center',
                  overflow: 'hidden',
                }}>
                  <div style={{ fontSize: 'clamp(9.5px, 2.5vw, 11px)', fontWeight: 700, color: 'var(--warning)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>REPLAY</div>
                  <div style={{ fontSize: 'clamp(8px, 2vw, 10px)', color: 'var(--text-muted)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Settled Nonce</div>
                </div>

                <div style={{
                  padding: '10px 4px',
                  background: 'var(--accent-violet-soft)',
                  border: '1px solid var(--accent-violet-border)',
                  borderRadius: 'var(--radius-sm)',
                  textAlign: 'center',
                  overflow: 'hidden',
                }}>
                  <div style={{ fontSize: 'clamp(9.5px, 2.5vw, 11px)', fontWeight: 700, color: 'var(--accent-violet)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>IMPERSONATE</div>
                  <div style={{ fontSize: 'clamp(8px, 2vw, 10px)', color: 'var(--text-muted)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>HMAC Mismatch</div>
                </div>
              </div>

              {/* Connecting Convergence Lines */}
              <div style={{ width: '100%', maxWidth: 360, height: 36, position: 'relative' }}>
                <svg width="100%" height="100%" viewBox="0 0 360 36" fill="none" preserveAspectRatio="none">
                  {/* Branch lines down */}
                  <line x1="50" y1="0" x2="50" y2="18" stroke="var(--danger)" strokeWidth="1.5" strokeDasharray="3 3" />
                  <line x1="180" y1="0" x2="180" y2="18" stroke="var(--warning)" strokeWidth="1.5" strokeDasharray="3 3" />
                  <line x1="310" y1="0" x2="310" y2="18" stroke="var(--accent-violet)" strokeWidth="1.5" strokeDasharray="3 3" />
                  {/* Horizontal bar */}
                  <line x1="50" y1="18" x2="310" y2="18" stroke="var(--border-light)" strokeWidth="2" />
                  {/* Vertical trunk down */}
                  <line x1="180" y1="18" x2="180" y2="36" stroke="var(--accent-teal)" strokeWidth="2" />
                </svg>
              </div>

              {/* Bottom: Channel Manipulation */}
              <div style={{
                width: '100%',
                padding: '12px 14px',
                background: 'rgba(2, 132, 199, 0.08)',
                border: '1px solid var(--accent-teal-border)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 8,
              }}>
                <div>
                  <div style={{ fontSize: 'clamp(11px, 2.8vw, 12px)', fontWeight: 700, color: 'var(--accent-teal)' }}>
                    CHANNEL MANIPULATION (MITM)
                  </div>
                  <div style={{ fontSize: 'clamp(9.5px, 2.2vw, 11px)', color: 'var(--text-muted)', marginTop: 1 }}>
                    Pauli Bit/Phase Flips & Depolarizing Noise
                  </div>
                </div>
                <span className="badge badge-teal" style={{ fontSize: 10 }}>Quantum Layer</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
