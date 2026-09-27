import React, { useState } from 'react';
import { Send, CheckCircle, AlertTriangle, XCircle, Key, ShieldCheck, Activity, Cpu, Layers } from 'lucide-react';
import CircuitViewer from './CircuitViewer';

export default function QdsStudio({ onGenerate, onVerify, currentSignature, verificationResult, loading }) {
  const [message,          setMessage]          = useState('Authorize Bank Wire ₹25,000 to Bob');
  const [sender,           setSender]           = useState('Alice');
  const [numQubits,        setNumQubits]        = useState(24);
  const [selectedQubitIdx, setSelectedQubitIdx] = useState(0);

  const handleGenerate = (e) => {
    e.preventDefault();
    onGenerate({ message, sender, recipient: 'Bob', num_qubits: numQubits });
  };

  const selectedQubit = currentSignature?.qubits?.[selectedQubitIdx] || null;

  const verdictColor = v =>
    v === 'ACCEPT' ? 'var(--success)'  :
    v === 'SUSPICIOUS' ? 'var(--warning)' :
    'var(--danger)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* Section header */}
      <div>
        <span className="section-eyebrow">QDS Studio</span>
        <h2 className="t-title" style={{ color: 'var(--text-primary)', marginBottom: 8 }}>
          Sign & Verify Quantum Signatures
        </h2>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)', maxWidth: 560 }}>
          Generate a quantum digital signature packet, then pass it through
          the three-stage verification pipeline.
        </p>
      </div>

      {/* 2-col grid */}
      <div className="grid-2" style={{ gap: 24 }}>

        {/* ── SIGNER PANEL ─────────────────────────────── */}
        <div className="card" style={{ padding: 28 }}>
          {/* Card header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--border-light)' }}>
            <div style={{
              width: 34, height: 34,
              borderRadius: 9, background: 'rgba(0,168,198,0.08)',
              border: '1px solid var(--accent-teal-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Key size={16} style={{ color: 'var(--accent-teal)' }} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>Signer Terminal</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Alice · ALICE-QDS-001</div>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <span className="badge badge-teal">EPR Source</span>
            </div>
          </div>

          <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="field">
              <label className="label">Transaction payload</label>
              <input
                type="text"
                className="input"
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="e.g. Authorize Bank Wire ₹50,000 to Bob"
                required
              />
            </div>

            <div className="form-row-2">
              <div className="field">
                <label className="label">Signer identity</label>
                <select className="select" value={sender} onChange={e => setSender(e.target.value)}>
                  <option value="Alice">Alice (Registered)</option>
                  <option value="Charlie">Charlie (Arbitrator)</option>
                </select>
              </div>
              <div className="field">
                <label className="label">Carrier qubits</label>
                <select className="select" value={numQubits} onChange={e => setNumQubits(Number(e.target.value))}>
                  <option value={12}>12 (Fast demo)</option>
                  <option value={16}>16 (Standard)</option>
                  <option value={24}>24 (SIH spec)</option>
                  <option value={32}>32 (High assurance)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ marginTop: 4, justifyContent: 'center' }}
            >
              <Send size={14} />
              {loading ? 'Generating…' : 'Generate quantum signature'}
            </button>
          </form>

          {/* Generated packet summary */}
          {currentSignature && (
            <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 12 }}>
                Generated packet
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Signature ID', value: currentSignature.signature_id },
                  { label: 'Nonce', value: currentSignature.nonce },
                  { label: 'Auth token', value: currentSignature.auth_token?.slice(0, 20) + '…' },
                ].map((r, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                    <span style={{ color: 'var(--text-muted)' }}>{r.label}</span>
                    <span className="t-mono" style={{ color: 'var(--accent-teal)', fontWeight: 500 }}>{r.value}</span>
                  </div>
                ))}
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                  <span className="t-mono" style={{ wordBreak: 'break-all', color: 'var(--text-dim)' }}>
                    Basis: {currentSignature.expected_measurement}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── VERIFIER PANEL ────────────────────────────── */}
        <div className="card" style={{ padding: 28 }}>
          {/* Card header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--border-light)' }}>
            <div style={{
              width: 34, height: 34,
              borderRadius: 9, background: 'rgba(29,154,104,0.07)',
              border: '1px solid var(--success-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <ShieldCheck size={16} style={{ color: 'var(--success)' }} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>Verifier Terminal</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Bob · 3-Stage Gate</div>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <span className="badge badge-neutral">Defense-in-depth</span>
            </div>
          </div>

          {/* Stage pipeline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 24 }}>
            {[
              { label: 'Symmetric Auth',        sub: 'HMAC 5-tuple' },
              { label: 'Settled Nonce',          sub: 'State machine' },
              { label: 'Quantum Core',            sub: 'QBER & Fidelity' },
            ].map((stage, i) => (
              <React.Fragment key={i}>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', margin: '0 auto 6px',
                    background: verificationResult ? (
                      (verificationResult.verdict === 'ACCEPT' || (i < 2))
                        ? 'var(--success)' : 'var(--danger)'
                    ) : 'var(--border-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, color: verificationResult ? '#fff' : 'var(--text-muted)',
                    transition: 'all 0.3s ease',
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.02em' }}>
                    {stage.label}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{stage.sub}</div>
                </div>
                {i < 2 && (
                  <div style={{ width: 24, height: 1, background: 'var(--border-light)', flexShrink: 0, marginBottom: 26 }} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Verify button */}
          <button
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginBottom: 20 }}
            disabled={!currentSignature || loading}
            onClick={() => onVerify()}
          >
            <Activity size={14} />
            {loading ? 'Running verification…' : 'Verify quantum signature'}
          </button>

          {/* Verdict */}
          {verificationResult && (
            <div className={`verdict-display ${
              verificationResult.verdict === 'ACCEPT' ? 'accept' :
              verificationResult.verdict === 'SUSPICIOUS' ? 'suspicious' : 'reject'
            }`}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {verificationResult.verdict === 'ACCEPT'     && <CheckCircle  size={22} style={{ color: 'var(--success)' }} />}
                  {verificationResult.verdict === 'SUSPICIOUS'  && <AlertTriangle size={22} style={{ color: 'var(--warning)' }} />}
                  {verificationResult.verdict === 'REJECT'      && <XCircle      size={22} style={{ color: 'var(--danger)'  }} />}
                  <span style={{
                    fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em',
                    color: verdictColor(verificationResult.verdict),
                  }}>
                    {verificationResult.verdict}
                  </span>
                </div>
                <span className={`badge ${
                  verificationResult.verdict === 'ACCEPT' ? 'badge-success' :
                  verificationResult.verdict === 'SUSPICIOUS' ? 'badge-warning' : 'badge-danger'
                }`}>
                  {verificationResult.threat_type}
                </span>
              </div>

              {/* Metrics grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 14 }}>
                {[
                  {
                    label: 'QBER',
                    value: verificationResult.error_rate !== null
                      ? `${(verificationResult.error_rate * 100).toFixed(1)}%`
                      : 'N/A',
                    color: verificationResult.error_rate !== null && verificationResult.error_rate > 0.05
                      ? 'var(--danger)' : 'var(--text-primary)',
                  },
                  {
                    label: 'Fidelity',
                    value: verificationResult.fidelity !== null
                      ? `${(verificationResult.fidelity * 100).toFixed(1)}%`
                      : 'N/A',
                    color: 'var(--text-primary)',
                  },
                  {
                    label: 'Layer',
                    value: verificationResult.detection_layer?.replace('_', ' ') ?? '—',
                    color: 'var(--text-secondary)',
                  },
                ].map((m, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: m.color, letterSpacing: '-0.02em' }}>
                      {m.value}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{m.label}</div>
                  </div>
                ))}
              </div>

              {/* Details */}
              <div style={{
                fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5,
                background: 'rgba(0,0,0,0.03)', padding: '10px 12px',
                borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,0,0,0.06)',
              }}>
                {verificationResult.details}
              </div>

              {/* Timeline */}
              {verificationResult.timeline && verificationResult.timeline.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
                    Verification timeline
                  </div>
                  <div className="timeline">
                    {verificationResult.timeline.map((ev, idx) => (
                      <div key={idx} className="timeline-item" style={{ fontSize: 12 }}>
                        <div className={`timeline-dot ${
                          ev.status === 'PASS' ? 'timeline-dot-success' :
                          ev.status === 'WARN' ? 'timeline-dot-warning' :
                          ev.status === 'FAIL' ? 'timeline-dot-danger' : ''
                        }`} />
                        <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', minWidth: 56 }}>
                          {ev.timestamp}
                        </span>
                        <span className={`badge badge-${
                          ev.status === 'PASS' ? 'success' :
                          ev.status === 'WARN' ? 'warning' :
                          ev.status === 'FAIL' ? 'danger' : 'neutral'
                        }`} style={{ fontSize: 9 }}>
                          {ev.stage}
                        </span>
                        <span style={{ color: 'var(--text-secondary)', flex: 1 }}>{ev.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── QUBIT TELEMETRY ──────────────────────────────── */}
      {currentSignature?.qubits && (
        <div className="card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)', marginBottom: 4 }}>
                Carrier Qubit State Map
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                {currentSignature.num_qubits} qubits across Pauli {'{X, Y, Z}'} eigenstates.
                Click any chip to inspect.
              </div>
            </div>
            <span className="badge badge-neutral">{currentSignature.num_qubits} qubits</span>
          </div>

          {/* Qubit chips */}
          <div className="qubit-grid" style={{ marginBottom: 20 }}>
            {currentSignature.qubits.map((q, i) => (
              <div
                key={i}
                className={`qubit-chip ${selectedQubitIdx === i ? 'selected' : ''}`}
                onClick={() => setSelectedQubitIdx(i)}
                title={`Q${i}: ${q.basis} ${q.eigenstate}`}
              >
                {q.basis}
              </div>
            ))}
          </div>

          {/* Selected qubit detail */}
          {selectedQubit && (
            <div style={{
              padding: '16px 20px',
              background: 'var(--surface-light)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: 16,
            }}>
              {[
                { label: 'Index',     value: `Q[${selectedQubit.index}]` },
                { label: 'Basis',     value: selectedQubit.basis },
                { label: 'Prep val',  value: selectedQubit.prep_val },
                { label: 'Eigenstate',value: selectedQubit.eigenstate },
                ...(verificationResult?.qubit_telemetry?.[selectedQubitIdx] ? [
                  { label: 'Observed', value: verificationResult.qubit_telemetry[selectedQubitIdx].observed_bit },
                  { label: 'Error',    value: verificationResult.qubit_telemetry[selectedQubitIdx].is_error ? '⚠ Yes' : '✓ No' },
                ] : []),
              ].map((d, i) => (
                <div key={i}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 4 }}>
                    {d.label}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {d.value}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── CIRCUIT VIEWER ────────────────────────────────── */}
      {currentSignature && (
        <div className="card" style={{ padding: 28 }}>
          <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)', marginBottom: 4 }}>
            Quantum Circuit — Teleportation Protocol
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
            3-qubit teleportation with Bell state creation and classical Pauli feedforward corrections.
          </div>
          <CircuitViewer signature={currentSignature} selectedQubitIdx={selectedQubitIdx} />
        </div>
      )}
    </div>
  );
}
