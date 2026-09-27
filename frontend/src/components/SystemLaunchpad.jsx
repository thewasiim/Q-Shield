import React from 'react';
import { ArrowRight, Cpu, Zap, Activity, ShieldCheck } from 'lucide-react';

export default function SystemLaunchpad({ onNavigateTo, onOpenBenchmark }) {
  return (
    <section className="section section-dark" style={{
      background: 'linear-gradient(180deg, #07090E 0%, #04060A 100%)',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      position: 'relative',
      padding: 'clamp(56px, 8vw, 96px) 0',
    }}>
      <div className="container">
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 'var(--radius-pill)', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.12)', marginBottom: 20 }}>
            <ShieldCheck size={14} style={{ color: '#38BDF8' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255, 255, 255, 0.8)' }}>
              Interactive Testbed Ready
            </span>
          </div>

          <h2 className="t-headline" style={{ color: '#FFFFFF', marginBottom: 16 }}>
            Run the Q-SHIELD System.
          </h2>

          <p className="t-body-lg" style={{ color: 'var(--text-on-dark-sec)', marginBottom: 40, lineHeight: 1.65 }}>
            Experiment with interactive signature packet generation, simulate live quantum eavesdropping attacks, or trigger full multi-vector automated simulation benchmarks.
          </p>

          {/* Action Modules */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
            gap: 16,
            marginBottom: 48,
          }}>
            <div
              onClick={() => onNavigateTo('studio')}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.10)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px 20px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#0284C7'; e.currentTarget.style.background = 'rgba(2, 132, 199, 0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.10)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'; }}
            >
              <Cpu size={22} style={{ color: '#38BDF8', marginBottom: 12 }} />
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF', marginBottom: 6 }}>QDS Studio</h3>
              <p style={{ fontSize: 12.5, color: 'rgba(255, 255, 255, 0.55)', margin: 0 }}>
                Generate 5-tuple signature packets and perform quantum teleportation.
              </p>
            </div>

            <div
              onClick={() => onNavigateTo('attacks')}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.10)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px 20px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#EF4444'; e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.10)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'; }}
            >
              <Zap size={22} style={{ color: '#F87171', marginBottom: 12 }} />
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF', marginBottom: 6 }}>Threat Lab</h3>
              <p style={{ fontSize: 12.5, color: 'rgba(255, 255, 255, 0.55)', margin: 0 }}>
                Simulate forgery, replay, impersonation, and quantum Pauli noise.
              </p>
            </div>

            <div
              onClick={onOpenBenchmark}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.10)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px 20px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#7C3AED'; e.currentTarget.style.background = 'rgba(124, 58, 237, 0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.10)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'; }}
            >
              <Activity size={22} style={{ color: '#A78BFA', marginBottom: 12 }} />
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF', marginBottom: 6 }}>Benchmark Suite</h3>
              <p style={{ fontSize: 12.5, color: 'rgba(255, 255, 255, 0.55)', margin: 0 }}>
                Run 125 balanced trials and Wilson score confidence calibration.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => onNavigateTo('studio')}
            >
              Launch QDS Studio
              <ArrowRight size={16} />
            </button>
            <button
              className="btn btn-secondary btn-lg"
              onClick={onOpenBenchmark}
              style={{ background: 'rgba(255,255,255,0.08)', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.2)' }}
            >
              Run Benchmark Suite
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
