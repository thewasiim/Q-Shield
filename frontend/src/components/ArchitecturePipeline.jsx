import React, { useState } from 'react';

const STAGES = [
  {
    id: 'input',
    num: '00',
    title: 'PROTOCOL INPUT',
    subtitle: 'Payload & Ingress Envelope',
    description: 'Alice packages message M, fresh nonce N_A, Alice identity token, and the carrier qubit register into a 5-tuple signature structure.',
    spec: 'Signature 5-Tuple: (M, N_A, ID_A, Qubits_Reg, HMAC_Token)',
    badge: 'Ingress Stage',
    badgeColor: 'var(--c-text-light-muted)',
    accent: '#94A3B8',
  },
  {
    id: 'classical',
    num: '01',
    title: 'CLASSICAL PRE-FLIGHT',
    subtitle: 'HMAC-SHA256 & Identity Binding',
    description: 'Validates symmetric authentication token bound over the 5-tuple. Checks timestamp freshness window. Forged or unregistered identities are terminated before quantum resources are allocated.',
    spec: 'HMAC-SHA256(K_shared, sender || sig_id || nonce || message || timestamp)',
    badge: 'Layer 1 Defense',
    badgeColor: '#7C3AED',
    accent: '#A78BFA',
  },
  {
    id: 'replay',
    num: '02',
    title: 'REPLAY / NONCE CHECK',
    subtitle: 'Single-Use Settled Nonce DB',
    description: 'Enforces DoS-safe state machine (PENDING → SETTLED). Database-level uniqueness constraints strictly prohibit re-verification of previously settled nonces.',
    spec: 'State transition: UNKNOWN → PENDING → SETTLED / REJECTED',
    badge: 'Layer 2 Defense',
    badgeColor: '#D97706',
    accent: '#FBBF24',
  },
  {
    id: 'quantum',
    num: '03',
    title: 'QUANTUM VERIFICATION',
    subtitle: 'Teleportation & Pauli Projection',
    description: 'Bob generates Bell pairs |Φ+⟩, performs Bell state measurement, executes classical feedforward Pauli corrections (X^m2 · Z^m1), and projects onto secret basis.',
    spec: 'Density Matrix Fidelity: F(ρ, σ) = (Tr √(√ρ σ √ρ))²',
    badge: 'Layer 3 Defense',
    badgeColor: '#0284C7',
    accent: '#38BDF8',
  },
  {
    id: 'qber',
    num: '04',
    title: 'QBER ANALYSIS',
    subtitle: 'Quantum Bit Error Rate Computation',
    description: 'Calculates observed error rate δ across conjugate bases. Compares against operational prototype thresholds τ_accept (5.0%) and τ_reject (15.0%).',
    spec: 'QBER δ = (N_mismatch / N_total) · 100%',
    badge: 'Statistical Engine',
    badgeColor: '#10B981',
    accent: '#34D399',
  },
  {
    id: 'decision',
    num: '05',
    title: 'THREAT CLASSIFICATION',
    subtitle: 'Multi-Branch Decision Outcome',
    description: 'Non-AI deterministic categorization produces immediate operational verdict with full cryptographic audit logging.',
    spec: 'δ ≤ 5% → ACCEPT | 5% < δ < 15% → SUSPICIOUS | δ ≥ 15% → REJECT',
    badge: 'Final Verdict',
    badgeColor: '#EF4444',
    accent: '#F87171',
  },
];

export default function ArchitecturePipeline() {
  const [activeStageIdx, setActiveStageIdx] = useState(3);
  const activeStage = STAGES[activeStageIdx];

  return (
    <section className="section section-dark" style={{ position: 'relative', overflow: 'hidden', padding: 'clamp(56px, 8vw, 96px) 0' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ maxWidth: 760, marginBottom: 48 }}>
          <span className="section-eyebrow" style={{ color: 'var(--text-on-dark-muted)' }}>
            THE Q-SHIELD APPROACH
          </span>
          <h2 className="t-headline" style={{ color: 'var(--text-on-dark)', marginBottom: 16 }}>
            Multi-layered defense.<br />
            Deterministic verification pipeline.
          </h2>
          <p className="t-body-lg" style={{ color: 'var(--text-on-dark-sec)', lineHeight: 1.6 }}>
            Classical attacks are rejected before quantum simulation resources are consumed.
            Only packets passing both identity and replay settlement undergo quantum state measurement.
          </p>
        </div>

        {/* Responsive Architecture Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 290px), 1fr))',
          gap: 'clamp(24px, 4vw, 40px)',
          alignItems: 'start',
        }}>
          
          {/* Left: Pipeline Stage Track */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            paddingLeft: 'clamp(16px, 3vw, 24px)',
          }}>
            {/* Vertical Guide Line */}
            <div style={{
              position: 'absolute',
              left: 7,
              top: 16,
              bottom: 24,
              width: 2,
              background: 'rgba(255, 255, 255, 0.12)',
            }} />

            {STAGES.map((stage, idx) => {
              const isActive = activeStageIdx === idx;
              return (
                <div
                  key={stage.id}
                  onClick={() => setActiveStageIdx(idx)}
                  style={{
                    position: 'relative',
                    padding: 'clamp(12px, 2.5vw, 16px) clamp(12px, 2.5vw, 20px)',
                    marginBottom: 8,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    background: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                    border: isActive ? `1px solid ${stage.accent}40` : '1px solid transparent',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={() => !isActive && setActiveStageIdx(idx)}
                >
                  {/* Active dot on vertical line */}
                  <div style={{
                    position: 'absolute',
                    left: -17,
                    top: 24,
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: isActive ? stage.accent : '#334155',
                    border: '2px solid #07090E',
                    boxShadow: isActive ? `0 0 10px ${stage.accent}` : 'none',
                    transition: 'all 0.2s ease',
                  }} />

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 12,
                        fontWeight: 700,
                        color: isActive ? stage.accent : 'rgba(255, 255, 255, 0.4)',
                      }}>
                        {stage.num}
                      </span>
                      <span style={{
                        fontSize: 'clamp(13px, 2vw, 15px)',
                        fontWeight: 700,
                        letterSpacing: '-0.01em',
                        color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.65)',
                      }}>
                        {stage.title}
                      </span>
                    </div>

                    <span style={{
                      fontSize: 11,
                      fontFamily: 'var(--font-mono)',
                      color: isActive ? stage.accent : 'rgba(255, 255, 255, 0.35)',
                    }}>
                      {stage.subtitle}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Active Stage Focus Panel */}
          <div style={{
            background: 'var(--c-dark-surface)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 'var(--radius-xl)',
            padding: 'clamp(20px, 4vw, 32px) clamp(16px, 3.5vw, 28px)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
              <span className="badge" style={{
                background: `${activeStage.badgeColor}20`,
                color: activeStage.accent,
                border: `1px solid ${activeStage.accent}40`,
                fontSize: 11,
              }}>
                {activeStage.badge}
              </span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                color: 'rgba(255, 255, 255, 0.4)',
              }}>
                Stage {activeStage.num} / 05
              </span>
            </div>

            <h3 style={{
              fontSize: 'clamp(18px, 3vw, 22px)',
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              marginBottom: 6,
            }}>
              {activeStage.title}
            </h3>

            <div style={{
              fontSize: 13.5,
              color: activeStage.accent,
              fontWeight: 600,
              marginBottom: 16,
            }}>
              {activeStage.subtitle}
            </div>

            <p style={{
              fontSize: 14,
              lineHeight: 1.65,
              color: 'var(--text-on-dark-sec)',
              marginBottom: 20,
            }}>
              {activeStage.description}
            </p>

            {/* Technical Specification Box */}
            <div style={{
              background: 'var(--surface-terminal)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              marginBottom: 20,
            }}>
              <div style={{
                fontSize: 10,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'rgba(255, 255, 255, 0.4)',
                marginBottom: 4,
                fontWeight: 700,
              }}>
                Protocol Invariant / Specification
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(10.5px, 2.2vw, 12px)',
                color: '#38BDF8',
                wordBreak: 'break-all',
              }}>
                {activeStage.spec}
              </div>
            </div>

            {/* Decision Outcomes at the bottom */}
            <div style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 11.5,
              color: 'rgba(255, 255, 255, 0.6)',
              flexWrap: 'wrap',
              gap: 8,
            }}>
              <span style={{ color: '#10B981', fontWeight: 600 }}>● ACCEPT (δ ≤ 5%)</span>
              <span style={{ color: '#F59E0B', fontWeight: 600 }}>● SUSPICIOUS (5–15%)</span>
              <span style={{ color: '#EF4444', fontWeight: 600 }}>● REJECT (≥ 15%)</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
