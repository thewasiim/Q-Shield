import React, { useState } from 'react';
import CircuitViewer from './CircuitViewer';

export default function QuantumVerificationSection({ currentSignature }) {
  const [selectedQubitIdx, setSelectedQubitIdx] = useState(0);

  // Mock qubit register if currentSignature is null
  const sampleSignature = currentSignature || {
    qubits: Array.from({ length: 16 }, (_, i) => ({
      basis: i % 2 === 0 ? 'X' : 'Z',
      prep_val: (i * 3) % 2,
    })),
  };

  const steps = [
    { num: '01', title: 'Alice State Preparation', desc: 'Alice encodes secret bit into qubit |ψ⟩ = α|0⟩ + β|1⟩.' },
    { num: '02', title: 'EPR Entanglement', desc: 'Hadamard + CNOT creates maximally entangled Bell state |Φ+⟩ on (q1, q2).' },
    { num: '03', title: 'Bell Measurement', desc: 'Alice executes Bell projection on (q0, q1), producing classical bits (m1, m2).' },
    { num: '04', title: 'Feedforward Correction', desc: 'Bob applies unitary Pauli operation X^m2 · Z^m1 to recover state |ψ⟩.' },
    { num: '05', title: 'Observable Measurement', desc: 'Bob projects onto Alice’s secret basis to verify state fidelity and QBER.' },
  ];

  return (
    <section className="section section-dark" style={{
      background: 'linear-gradient(180deg, #07090E 0%, #0B111E 100%)',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      position: 'relative',
      padding: 'clamp(56px, 8vw, 96px) 0',
    }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ maxWidth: 800, marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
            <span className="badge badge-teal" style={{ background: 'rgba(2, 132, 199, 0.2)', border: '1px solid rgba(2, 132, 199, 0.4)', color: '#38BDF8' }}>
              PHYSICAL LAYER VERIFICATION
            </span>
            <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'rgba(255, 255, 255, 0.6)' }}>
              Non-AI · Information-Theoretic
            </span>
          </div>
          <h2 className="t-headline" style={{ color: '#FFFFFF', marginBottom: 16 }}>
            Quantum teleportation protocol &<br />
            projective measurement.
          </h2>
          <p className="t-body-lg" style={{ color: 'var(--text-on-dark-sec)', lineHeight: 1.65 }}>
            State transfer is achieved through quantum teleportation. Bob applies feedforward Pauli corrections based on Alice's classical measurement feed. Any eavesdropper measuring the carrier induces irrevocable wave-function collapse, manifesting as detectable QBER.
          </p>
        </div>

        {/* Step Flow Ribbon */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))',
          gap: 12,
          marginBottom: 36,
        }}>
          {steps.map((s, idx) => (
            <div key={idx} style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 14px',
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: '#38BDF8',
                fontWeight: 700,
                marginBottom: 4,
              }}>
                STEP {s.num}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF', marginBottom: 4 }}>
                {s.title}
              </div>
              <div style={{ fontSize: 11.5, color: 'rgba(255, 255, 255, 0.55)', lineHeight: 1.4 }}>
                {s.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Qubit Selector Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 16,
          padding: '12px clamp(12px, 2.5vw, 18px)',
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.6)', fontWeight: 600 }}>
              Inspect Qubit Carrier State:
            </span>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedQubitIdx(idx)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-xs)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    background: selectedQubitIdx === idx ? '#0284C7' : 'rgba(255, 255, 255, 0.08)',
                    color: selectedQubitIdx === idx ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  q[{idx}]
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'rgba(255, 255, 255, 0.6)', flexWrap: 'wrap' }}>
            <span>Basis: <strong style={{ color: '#38BDF8' }}>{sampleSignature.qubits?.[selectedQubitIdx]?.basis || 'X'}</strong></span>
            <span>Target: <strong style={{ color: '#34D399' }}>q2 (|Φ_B⟩)</strong></span>
          </div>
        </div>

        {/* Centerpiece: Circuit Viewer Component */}
        <div style={{
          background: 'var(--c-dark)',
          borderRadius: 'var(--radius-xl)',
          padding: 'clamp(14px, 3vw, 24px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        }}>
          <CircuitViewer
            signature={sampleSignature}
            selectedQubitIdx={selectedQubitIdx}
          />
        </div>

      </div>
    </section>
  );
}
