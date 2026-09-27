import React, { useState } from 'react';
import { RefreshCw, UserX, Radio, Zap, CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react';

const ATTACK_VECTORS = [
  {
    id: 'forgery',
    layer: '03',
    layerLabel: 'Layer 3',
    title: 'Signature Forgery',
    description:
      'Eve modifies the message payload and synthesizes carrier states in guessed Pauli bases, causing conjugate basis collapse with ~35–50% QBER.',
    detector: 'Quantum Statistics — Conjugate basis collapse',
    icon: Zap,
    controlType: 'slider',
    controlLabel: 'Tamper fraction',
    controlKey: 'tamperFraction',
    min: 0.20, max: 1.0, step: 0.05, default: 0.75,
    btnVariant: 'btn-danger',
    accentColor: 'var(--danger)',
    accentBg: 'var(--danger-soft)',
    accentBorder: 'var(--danger-border)',
  },
  {
    id: 'replay',
    layer: '02',
    layerLabel: 'Layer 2',
    title: 'Replay Attack',
    description:
      'Adversary intercepts a valid historical signature packet and attempts duplicate re-broadcast using a previously settled nonce.',
    detector: 'Database-Enforced Nonce Ledger — Settled state constraint',
    icon: RefreshCw,
    controlType: null,
    btnVariant: 'btn-warning',
    accentColor: 'var(--warning)',
    accentBg: 'var(--warning-soft)',
    accentBorder: 'var(--warning-border)',
  },
  {
    id: 'impersonation',
    layer: '01',
    layerLabel: 'Layer 1',
    title: 'Signer Impersonation',
    description:
      'Rogue entity claims to be Alice using forged or unregistered credentials. The HMAC 5-tuple binding immediately exposes the mismatch.',
    detector: 'Symmetric Identity Authentication — HMAC 5-tuple binding',
    icon: UserX,
    controlType: null,
    btnVariant: 'btn-primary',
    accentColor: 'var(--accent-violet)',
    accentBg: 'var(--accent-violet-soft)',
    accentBorder: 'var(--accent-violet-border)',
  },
  {
    id: 'channel_manipulation',
    layer: '03',
    layerLabel: 'Layer 3',
    title: 'Channel Manipulation',
    description:
      'Man-in-the-middle injects Pauli noise into the quantum channel, raising QBER above threshold and degrading state fidelity.',
    detector: 'Quantum Statistics — Pauli noise & fidelity drop',
    icon: Radio,
    controlType: 'select+slider',
    controlKey: 'noiseStrength',
    min: 0.10, max: 0.80, step: 0.05, default: 0.40,
    btnVariant: 'btn-accent',
    accentColor: 'var(--accent-teal)',
    accentBg: 'var(--accent-teal-soft)',
    accentBorder: 'var(--accent-teal-border)',
  },
];

export default function AttackLab({ onSimulateAttack, attackResult, loading }) {
  const [controls, setControls] = useState({
    tamperFraction: 0.75,
    noiseStrength: 0.40,
    channelNoiseType: 'bit_flip',
  });

  const runAttack = (type) => {
    const attackMsg = 'Transfer ₹100,000 to Eve';
    onSimulateAttack({
      attack_type: type,
      message: attackMsg,
      sender: 'Alice',
      recipient: 'Bob',
      channel_noise_type: controls.channelNoiseType,
      noise_strength: type === 'forgery' ? controls.tamperFraction : controls.noiseStrength,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

      {/* Section header */}
      <div>
        <span className="section-eyebrow">Red Team Lab</span>
        <h2 className="t-title" style={{ color: 'var(--text-primary)', marginBottom: 8 }}>
          Cyber Threat Simulation
        </h2>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)', maxWidth: 600 }}>
          Q-SHIELD uses classical authentication and replay controls to protect the protocol
          envelope, then uses quantum-state measurement statistics to assess the integrity
          of signatures that pass those classical checks.
        </p>
      </div>

      {/* Attack vector cards */}
      <div className="grid-2" style={{ gap: 20 }}>
        {ATTACK_VECTORS.map(vec => {
          const Icon = vec.icon;
          return (
            <div key={vec.id} className="card card-interactive" style={{ padding: 24 }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 9,
                    background: vec.accentBg,
                    border: `1px solid ${vec.accentBorder}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={17} style={{ color: vec.accentColor }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>{vec.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{vec.layerLabel}</div>
                  </div>
                </div>
                <span className="badge badge-neutral">{`Vector ${vec.layer}`}</span>
              </div>

              {/* Description */}
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
                {vec.description}
              </p>

              {/* Detector tag */}
              <div style={{
                fontSize: 11, color: 'var(--text-muted)',
                padding: '7px 11px',
                background: 'var(--surface-light)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-light)',
                marginBottom: 16,
                fontWeight: 500,
              }}>
                Detector: {vec.detector}
              </div>

              {/* Controls */}
              {vec.controlType === 'slider' && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>
                    <span>{vec.controlLabel}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: vec.accentColor }}>
                      {(controls[vec.controlKey] * 100).toFixed(0)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    className="slider slider-danger"
                    min={vec.min} max={vec.max} step={vec.step}
                    value={controls[vec.controlKey]}
                    onChange={e => setControls(c => ({ ...c, [vec.controlKey]: parseFloat(e.target.value) }))}
                  />
                </div>
              )}

              {vec.controlType === 'select+slider' && (
                <div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div className="field">
                    <label className="label">Noise operator</label>
                    <select
                      className="select"
                      value={controls.channelNoiseType}
                      onChange={e => setControls(c => ({ ...c, channelNoiseType: e.target.value }))}
                    >
                      <option value="bit_flip">Bit Flip (Pauli X)</option>
                      <option value="phase_flip">Phase Flip (Pauli Z)</option>
                      <option value="bit_phase_flip">Bit-Phase Flip (Pauli Y)</option>
                      <option value="depolarizing">Depolarizing Channel</option>
                    </select>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>
                      <span>Noise strength</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: vec.accentColor }}>
                        {(controls.noiseStrength * 100).toFixed(0)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      className="slider slider-teal"
                      min={vec.min} max={vec.max} step={vec.step}
                      value={controls.noiseStrength}
                      onChange={e => setControls(c => ({ ...c, noiseStrength: parseFloat(e.target.value) }))}
                    />
                  </div>
                </div>
              )}

              {/* Launch button */}
              <button
                className={`btn ${vec.btnVariant}`}
                style={{ width: '100%', justifyContent: 'center' }}
                disabled={loading}
                onClick={() => runAttack(vec.id)}
              >
                {loading ? 'Simulating…' : `Launch ${vec.title}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* ── FORENSIC RESULT ──────────────────────────────── */}
      {attackResult && (
        <div className="card" style={{ padding: 28 }}>
          <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)', marginBottom: 4 }}>
            Cause → Effect Forensic Analysis
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>
            Before injection (normal channel) versus after adversarial perturbation.
          </div>

          {/* Before / After */}
          <div className="grid-2" style={{ gap: 16, marginBottom: 24 }}>
            {/* Before */}
            <div style={{
              padding: '20px 20px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--success-border)',
              background: 'var(--success-soft)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--success)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Normal channel
                </span>
                <span className="badge badge-success">Baseline</span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 14 }}>
                {attackResult.before_state?.topology}
              </div>
              <div style={{ display: 'flex', gap: 20, fontSize: 13 }}>
                <div>
                  QBER: <strong style={{ color: 'var(--success)', fontFamily: 'var(--font-mono)' }}>
                    {attackResult.before_state?.qber}%
                  </strong>
                </div>
                <div>
                  Fidelity: <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                    {attackResult.before_state?.fidelity}%
                  </strong>
                </div>
              </div>
            </div>

            {/* After */}
            <div style={{
              padding: '20px 20px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--danger-border)',
              background: 'var(--danger-soft)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--danger)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Adversarial perturbation
                </span>
                <span className="badge badge-danger">Intercepted</span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--danger)', marginBottom: 14 }}>
                {attackResult.after_state?.topology}
              </div>
              <div style={{ display: 'flex', gap: 20, fontSize: 13 }}>
                <div>
                  QBER: <strong style={{ color: 'var(--danger)', fontFamily: 'var(--font-mono)' }}>
                    {typeof attackResult.after_state?.qber === 'number'
                      ? `${attackResult.after_state.qber}%`
                      : attackResult.after_state?.qber}
                  </strong>
                </div>
                <div>
                  Verdict: <strong style={{ color: 'var(--danger)' }}>
                    {attackResult.verdict?.verdict}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Detector detail */}
          <div style={{
            padding: '12px 16px',
            background: 'var(--surface-light)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-light)',
            fontSize: 13,
            color: 'var(--text-secondary)',
            marginBottom: 20,
          }}>
            <strong style={{ color: 'var(--text-primary)' }}>Primary detector:</strong>{' '}
            {attackResult.detection_mechanism}
            {attackResult.verdict?.details && (
              <>
                <br />
                <span style={{ color: 'var(--danger)', marginTop: 4, display: 'inline-block' }}>
                  {attackResult.verdict.details}
                </span>
              </>
            )}
          </div>

          {/* SOC Timeline */}
          {attackResult.verdict?.timeline && (
            <div>
              <div style={{
                fontSize: 11, fontWeight: 600, letterSpacing: '0.06em',
                textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <Clock size={13} />
                SOC Incident Timeline
              </div>
              <div className="timeline">
                {attackResult.verdict.timeline.map((ev, idx) => (
                  <div key={idx} className="timeline-item" style={{ fontSize: 12 }}>
                    <div className={`timeline-dot ${
                      ev.status === 'PASS' ? 'timeline-dot-success' :
                      ev.status === 'WARN' ? 'timeline-dot-warning' :
                      ev.status === 'FAIL' ? 'timeline-dot-danger' : ''
                    }`} />
                    <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', minWidth: 60 }}>
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
  );
}
