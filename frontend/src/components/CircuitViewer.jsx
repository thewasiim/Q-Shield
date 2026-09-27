import React from 'react';

export default function CircuitViewer({ signature, selectedQubitIdx = 0 }) {
  const qubit = signature?.qubits?.[selectedQubitIdx];
  const basis   = qubit?.basis   ?? 'X';
  const prepVal = qubit?.prep_val ?? 0;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: 8 }}>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
          Selected q[{selectedQubitIdx}] · Prep val: {prepVal} · Projection basis: <strong>{basis}</strong>
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span className="badge badge-neutral">Qiskit simulator</span>
          <span className="badge badge-teal">Basis: {basis}</span>
        </div>
      </div>

      {/* SVG Circuit Diagram Container */}
      <div style={{ 
        background: '#070A12', 
        borderRadius: 'var(--radius-lg)', 
        padding: 'clamp(14px, 3vw, 24px) clamp(10px, 2.5vw, 20px)', 
        border: '1px solid #1E293B',
        boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}>
        <svg viewBox="0 0 760 210" style={{ width: '100%', minWidth: '680px', height: 'auto', display: 'block' }}>
          {/* Qubit Rail Lines */}
          <line x1="100" y1="40" x2="720" y2="40" stroke="#1E293B" strokeWidth="2" />
          <line x1="100" y1="100" x2="720" y2="100" stroke="#1E293B" strokeWidth="2" />
          <line x1="100" y1="160" x2="720" y2="160" stroke="#1E293B" strokeWidth="2" />

          {/* Qubit Labels */}
          <text x="20" y="44" fill="#38BDF8" fontFamily="JetBrains Mono" fontSize="13" fontWeight="bold">q0: |ψ⟩</text>
          <text x="20" y="104" fill="#A78BFA" fontFamily="JetBrains Mono" fontSize="13" fontWeight="600">q1: |Φ_A⟩</text>
          <text x="20" y="164" fill="#34D399" fontFamily="JetBrains Mono" fontSize="13" fontWeight="600">q2: |Φ_B⟩</text>

          {/* Phase 1: State Prep */}
          <rect x="110" y="24" width="48" height="32" rx="6" fill="#0C2338" stroke="#0284C7" strokeWidth="1.5" />
          <text x="134" y="44" fill="#38BDF8" fontFamily="Inter" fontSize="12" textAnchor="middle" fontWeight="700">Prep</text>

          {/* Entanglement Bell Pair: H on q1, CNOT q1->q2 */}
          <rect x="180" y="84" width="36" height="32" rx="6" fill="#1E1B4B" stroke="#7C3AED" strokeWidth="1.5" />
          <text x="198" y="104" fill="#C4B5FD" fontFamily="Inter" fontSize="13" textAnchor="middle" fontWeight="700">H</text>

          {/* CNOT q1 -> q2 */}
          <line x1="250" y1="100" x2="250" y2="160" stroke="#7C3AED" strokeWidth="2" />
          <circle cx="250" cy="100" r="5" fill="#A78BFA" />
          <circle cx="250" cy="160" r="12" fill="#1E1B4B" stroke="#A78BFA" strokeWidth="2" />
          <line x1="238" y1="160" x2="262" y2="160" stroke="#A78BFA" strokeWidth="2" />
          <line x1="250" y1="148" x2="250" y2="172" stroke="#A78BFA" strokeWidth="2" />

          {/* Barrier 1 */}
          <line x1="280" y1="20" x2="280" y2="180" stroke="#334155" strokeDasharray="4" strokeWidth="1.5" />

          {/* Alice's Bell Measurement: CNOT q0 -> q1, then H on q0 */}
          <line x1="310" y1="40" x2="310" y2="100" stroke="#0284C7" strokeWidth="2" />
          <circle cx="310" cy="40" r="5" fill="#38BDF8" />
          <circle cx="310" cy="100" r="12" fill="#0C2338" stroke="#38BDF8" strokeWidth="2" />
          <line x1="298" y1="100" x2="322" y2="100" stroke="#38BDF8" strokeWidth="2" />
          <line x1="310" y1="88" x2="310" y2="112" stroke="#38BDF8" strokeWidth="2" />

          <rect x="345" y="24" width="36" height="32" rx="6" fill="#0C2338" stroke="#0284C7" strokeWidth="1.5" />
          <text x="363" y="44" fill="#38BDF8" fontFamily="Inter" fontSize="13" textAnchor="middle" fontWeight="700">H</text>

          {/* Measurement meters on q0 and q1 */}
          <rect x="405" y="24" width="36" height="32" rx="6" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
          <text x="423" y="44" fill="#94A3B8" fontFamily="JetBrains Mono" fontSize="11" textAnchor="middle" fontWeight="700">M1</text>

          <rect x="405" y="84" width="36" height="32" rx="6" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
          <text x="423" y="104" fill="#94A3B8" fontFamily="JetBrains Mono" fontSize="11" textAnchor="middle" fontWeight="700">M2</text>

          {/* Classical feedforward */}
          <line x1="441" y1="100" x2="495" y2="100" stroke="#64748B" strokeWidth="1.5" strokeDasharray="3" />
          <line x1="495" y1="100" x2="495" y2="148" stroke="#64748B" strokeWidth="1.5" strokeDasharray="3" />

          {/* Bob's Feedforward Pauli Corrections */}
          <rect x="480" y="144" width="34" height="32" rx="6" fill="#064E3B" stroke="#10B981" strokeWidth="1.5" />
          <text x="497" y="164" fill="#6EE7B7" fontFamily="Inter" fontSize="12" textAnchor="middle" fontWeight="700">X^m2</text>

          <rect x="525" y="144" width="34" height="32" rx="6" fill="#064E3B" stroke="#10B981" strokeWidth="1.5" />
          <text x="542" y="164" fill="#6EE7B7" fontFamily="Inter" fontSize="12" textAnchor="middle" fontWeight="700">Z^m1</text>

          {/* Basis Rotation */}
          <rect x="580" y="144" width="48" height="32" rx="6" fill="#1E1B4B" stroke="#7C3AED" strokeWidth="1.5" />
          <text x="604" y="164" fill="#C4B5FD" fontFamily="Inter" fontSize="11" textAnchor="middle" fontWeight="700">Rot_{basis}</text>

          {/* Bob's Final Measurement Detector */}
          <rect x="645" y="140" width="56" height="40" rx="8" fill="#0C2338" stroke="#38BDF8" strokeWidth="2" />
          <text x="673" y="165" fill="#38BDF8" fontFamily="JetBrains Mono" fontSize="11" textAnchor="middle" fontWeight="800">DETECT</text>
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: 12, marginTop: 16 }}>
        <div style={{ padding: '12px 14px', background: 'rgba(2,132,199,0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(2,132,199,0.25)' }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>1. Alice's Entanglement</div>
          <div style={{ fontSize: 12.5, color: 'var(--accent-teal)', marginTop: 4, fontWeight: 700 }}>Bell State |Φ+⟩ = (|00⟩ + |11⟩)/√2</div>
        </div>
        <div style={{ padding: '12px 14px', background: 'rgba(16,185,129,0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16,185,129,0.25)' }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>2. Feedforward Correction</div>
          <div style={{ fontSize: 12.5, color: 'var(--success)', marginTop: 4, fontWeight: 700 }}>Bob applies X^m2 · Z^m1</div>
        </div>
        <div style={{ padding: '12px 14px', background: 'rgba(124,58,237,0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(124,58,237,0.25)' }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>3. Projective Observable</div>
          <div style={{ fontSize: 12.5, color: 'var(--accent-violet)', marginTop: 4, fontWeight: 700 }}>Eigenstate: {basis} Basis Projection</div>
        </div>
      </div>
    </div>
  );
}
