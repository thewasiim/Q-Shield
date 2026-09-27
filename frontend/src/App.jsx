import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import HeroVisual from './components/HeroVisual';
import ProblemAttackSurface from './components/ProblemAttackSurface';
import ArchitecturePipeline from './components/ArchitecturePipeline';
import QuantumVerificationSection from './components/QuantumVerificationSection';
import ThreatDetectionCharts from './components/ThreatDetectionCharts';
import PerformanceBenchmarkSection from './components/PerformanceBenchmarkSection';
import AuditLedgerPreview from './components/AuditLedgerPreview';
import SystemLaunchpad from './components/SystemLaunchpad';
import QdsStudio from './components/QdsStudio';
import AttackLab from './components/AttackLab';
import Telemetry from './components/Telemetry';
import AuditLedger from './components/AuditLedger';
import BenchmarkModal from './components/BenchmarkModal';
import {
  generateSignature,
  verifySignature,
  simulateAttack,
  fetchLedger,
  fetchThreatSummary,
} from './api/client';
import { ArrowRight } from 'lucide-react';
import './App.css';

function PageHeader({ eyebrow, title, description, badgeText, badgeVariant = 'teal', actions }) {
  return (
    <div style={{
      background: 'var(--c-white)',
      borderBottom: '1px solid var(--c-border)',
      padding: 'clamp(24px, 4vw, 36px) 0 clamp(20px, 3vw, 28px) 0',
      marginBottom: '32px',
    }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ maxWidth: 760 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
              <span className={`badge badge-${badgeVariant}`}>{badgeText}</span>
              <span style={{ fontSize: 13, color: 'var(--c-text-muted)', fontWeight: 500 }}>{eyebrow}</span>
            </div>
            <h1 style={{ fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--c-text-primary)', marginBottom: 8, lineHeight: 1.2 }}>
              {title}
            </h1>
            <p style={{ fontSize: 'clamp(13.5px, 2vw, 14.5px)', color: 'var(--c-text-secondary)', lineHeight: 1.6, margin: 0 }}>
              {description}
            </p>
          </div>
          {actions && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return ['home', 'studio', 'attacks', 'telemetry', 'ledger'].includes(hash) ? hash : 'home';
  });
  const [currentSignature, setCurrentSignature] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [attackResult, setAttackResult] = useState(null);
  const [ledger, setLedger] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isBenchmarkOpen, setIsBenchmarkOpen] = useState(false);

  const appRef = useRef(null);

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['home', 'studio', 'attacks', 'telemetry', 'ledger'].includes(hash)) {
        setActiveTab(hash);
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigateTo = (tab) => {
    setActiveTab(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const refreshData = async () => {
    try {
      const [sumRes, ledRes] = await Promise.all([
        fetchThreatSummary(),
        fetchLedger(50),
      ]);
      setSummary(sumRes);
      setLedger(ledRes);
    } catch (err) {
      console.warn('Could not reach backend:', err);
    }
  };

  useEffect(() => {
    refreshData();
    handleGenerate({
      message: 'Authorize Inter-Bank Wire ₹50,000 to Bob',
      sender: 'Alice',
      recipient: 'Bob',
      num_qubits: 24,
    });
  }, []);

  const handleGenerate = async (params) => {
    setLoading(true);
    try {
      const sig = await generateSignature(params);
      setCurrentSignature(sig);
      setVerificationResult(null);
    } catch (err) {
      console.warn('Backend generate fallback:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (overrideObserved = null) => {
    if (!currentSignature) return;
    setLoading(true);
    try {
      const res = await verifySignature({ signature: currentSignature, override_observed: overrideObserved });
      setVerificationResult(res);
      await refreshData();
    } catch (err) {
      console.warn('Backend verify fallback:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateAttack = async (attackParams) => {
    setLoading(true);
    try {
      const res = await simulateAttack(attackParams);
      setAttackResult(res);
      setVerificationResult(res.verdict);
      if (res.packet) setCurrentSignature(res.packet);
      await refreshData();
    } catch (err) {
      console.warn('Backend attack simulation fallback:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell" ref={appRef}>
      <Header
        activeTab={activeTab}
        setActiveTab={navigateTo}
        summary={summary}
        onOpenBenchmark={() => setIsBenchmarkOpen(true)}
      />

      <div className="page-body">

        {/* ── TAB 1: OVERVIEW (RECOMMENDED VISUAL STRUCTURE) ── */}
        {activeTab === 'home' && (
          <div className="tab-panel">
            
            {/* ── 1. HERO (LIGHT) — Custom Scientific Visual (No Chart) ── */}
            <section className="hero-section section-light" style={{ padding: 'clamp(48px, 6vw, 80px) 0 clamp(40px, 5vw, 60px)' }}>
              <div className="container">
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                  gap: 'clamp(32px, 5vw, 48px)',
                  alignItems: 'center',
                }}>
                  
                  {/* Hero Copy */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
                      <span className="badge badge-teal">SIH 2026 · PS-26141</span>
                      <span className="badge badge-neutral">Non-AI · Information-Theoretic</span>
                    </div>

                    <h1 className="t-hero" style={{
                      color: 'var(--text-primary)',
                      marginBottom: 20,
                      lineHeight: 1.15,
                    }}>
                      Security designed<br />
                      for the<br />
                      <span style={{ color: 'var(--accent-teal)' }}>quantum era.</span>
                    </h1>

                    <p className="t-body-lg" style={{
                      color: 'var(--text-secondary)',
                      maxWidth: 520,
                      marginBottom: 32,
                      lineHeight: 1.65,
                    }}>
                      Q-SHIELD combines classical pre-flight authentication and single-use nonce settlement
                      with quantum measurement statistics to assess signature integrity without artificial intelligence.
                    </p>

                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                      <button
                        className="btn btn-primary btn-lg"
                        onClick={() => navigateTo('studio')}
                      >
                        Explore System
                        <ArrowRight size={16} />
                      </button>
                      <button
                        className="btn btn-secondary btn-lg"
                        onClick={() => setIsBenchmarkOpen(true)}
                      >
                        Run Benchmark
                      </button>
                      <button
                        className="btn btn-secondary btn-lg"
                        onClick={() => navigateTo('attacks')}
                      >
                        Threat Lab
                      </button>
                    </div>

                    {/* Stats Strip */}
                    <div className="stat-row" style={{ marginTop: 40, paddingTop: 28, borderTop: '1px solid var(--border-light)', gap: 'clamp(16px, 3vw, 36px)' }}>
                      <div className="metric">
                        <div style={{ fontSize: 'clamp(20px, 3vw, 24px)', fontWeight: 800, color: 'var(--text-primary)' }}>
                          {summary?.total_verifications ?? 127}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Signatures verified</div>
                      </div>
                      <div className="sep" />
                      <div className="metric">
                        <div style={{ fontSize: 'clamp(20px, 3vw, 24px)', fontWeight: 800, color: 'var(--success)' }}>
                          {summary?.accepted ?? 84}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Accepted legitimate</div>
                      </div>
                      <div className="sep" />
                      <div className="metric">
                        <div style={{ fontSize: 'clamp(20px, 3vw, 24px)', fontWeight: 800, color: 'var(--danger)' }}>
                          {((summary?.rejected ?? 19) + (summary?.suspicious ?? 24))}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Threats intercepted</div>
                      </div>
                    </div>
                  </div>

                  {/* Hero Scientific Orbital Visual */}
                  <div style={{ width: '100%', overflow: 'hidden' }}>
                    <HeroVisual />
                  </div>

                </div>
              </div>
            </section>

            {/* ── 2. THE PROBLEM (LIGHT) — One Clean Attack Surface Diagram ── */}
            <ProblemAttackSurface />

            {/* ── 3. Q-SHIELD APPROACH (DARK) — Main Interactive Architecture ── */}
            <ArchitecturePipeline />

            {/* ── 4. QUANTUM VERIFICATION (DARK) — Visual Centerpiece & Circuit ── */}
            <QuantumVerificationSection currentSignature={currentSignature} />

            {/* ── 5. THREAT DETECTION (LIGHT) — Storytelling Charts 1, 2, 3 ── */}
            <ThreatDetectionCharts />

            {/* ── 6. VERIFICATION PERFORMANCE (LIGHT) — Charts 4 & 5 ── */}
            <PerformanceBenchmarkSection
              onOpenBenchmarkModal={() => setIsBenchmarkOpen(true)}
            />

            {/* ── 7. AUDIT LEDGER (LIGHT) — Clean Data Table (No Charts) ── */}
            <AuditLedgerPreview
              ledger={ledger}
              onNavigateToLedger={() => navigateTo('ledger')}
              onRefresh={refreshData}
              loading={loading}
            />

            {/* ── 8. RUN THE SYSTEM (DARK) — Launchpad CTA ── */}
            <SystemLaunchpad
              onNavigateTo={navigateTo}
              onOpenBenchmark={() => setIsBenchmarkOpen(true)}
            />

          </div>
        )}

        {/* ── TAB 2: QDS STUDIO ───────────────────────────── */}
        {activeTab === 'studio' && (
          <div className="tab-panel" style={{ background: 'var(--surface-light)', minHeight: '80vh' }}>
            <PageHeader
              eyebrow="Protocol Signing & Quantum Verification"
              badgeText="Quantum Teleportation"
              badgeVariant="teal"
              title="Quantum Digital Signature Studio"
              description="Generate authenticated 5-tuple quantum signature packets, simulate quantum teleportation channels, and execute multi-layer non-AI verification."
            />
            <div className="container" style={{ paddingBottom: 64 }}>
              <QdsStudio
                onGenerate={handleGenerate}
                onVerify={handleVerify}
                currentSignature={currentSignature}
                verificationResult={verificationResult}
                loading={loading}
              />
            </div>
          </div>
        )}

        {/* ── TAB 3: THREAT LAB ───────────────────────────── */}
        {activeTab === 'attacks' && (
          <div className="tab-panel" style={{ background: 'var(--surface-light)', minHeight: '80vh' }}>
            <PageHeader
              eyebrow="Adversarial Simulation & Stress Testing"
              badgeText="Defense Engine"
              badgeVariant="danger"
              title="Threat Lab & Adversarial Simulator"
              description="Stress-test quantum defenses with intercept-resend, basis mismatch forgery, replay tampering, and MITM attacks in real-time."
            />
            <div className="container" style={{ paddingBottom: 64 }}>
              <AttackLab
                onSimulateAttack={handleSimulateAttack}
                attackResult={attackResult}
                loading={loading}
              />
            </div>
          </div>
        )}

        {/* ── TAB 4: TELEMETRY ────────────────────────────── */}
        {activeTab === 'telemetry' && (
          <div className="tab-panel" style={{ background: 'var(--surface-light)', minHeight: '80vh' }}>
            <PageHeader
              eyebrow="Real-Time Security Intelligence"
              badgeText="Live Channel Metrics"
              badgeVariant="neutral"
              title="System Telemetry & Security KPIs"
              description="Inspect real-time projective measurement distributions, quantum bit error rates (QBER), state fidelity, and Wilson score 95% confidence intervals."
            />
            <div className="container" style={{ paddingBottom: 64 }}>
              <Telemetry
                summary={summary}
                lastVerdict={verificationResult}
              />
            </div>
          </div>
        )}

        {/* ── TAB 5: AUDIT LEDGER ─────────────────────────── */}
        {activeTab === 'ledger' && (
          <div className="tab-panel" style={{ background: 'var(--surface-light)', minHeight: '80vh' }}>
            <PageHeader
              eyebrow="Cryptographic Provenance"
              badgeText="Immutable Nonce DB"
              badgeVariant="neutral"
              title="Immutable Nonce & Audit Ledger"
              description="Enforce single-use nonce settlement rules across transactions to eliminate replay attacks and maintain a cryptographically sound verification history."
              actions={
                <button className="btn btn-secondary btn-sm" onClick={refreshData} disabled={loading}>
                  Refresh Ledger
                </button>
              }
            />
            <div className="container" style={{ paddingBottom: 64 }}>
              <AuditLedger
                ledger={ledger}
                onRefresh={refreshData}
                loading={loading}
              />
            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <footer className="app-footer">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>
            Q-SHIELD
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Quantum-Inspired Cyber Threat Detection · Smart India Hackathon 2026 · PS-26141
          </div>
        </div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Egreen Quanta · Blockchain & Cybersecurity
          </span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Non-AI · Information-Theoretic Verification
          </span>
        </div>
      </footer>

      {/* Benchmark Modal */}
      <BenchmarkModal
        isOpen={isBenchmarkOpen}
        onClose={() => { setIsBenchmarkOpen(false); refreshData(); }}
      />
    </div>
  );
}
