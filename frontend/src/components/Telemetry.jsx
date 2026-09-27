import React, { useState, useEffect } from 'react';
import { Check, AlertCircle, Info } from 'lucide-react';
import { fetchThresholds, updateThresholds } from '../api/client';

export default function Telemetry({ summary, lastVerdict }) {
  const [acceptThresh, setAcceptThresh] = useState(0.05);
  const [rejectThresh, setRejectThresh] = useState(0.15);
  const [saving,       setSaving]       = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetchThresholds().then(res => {
      if (res) {
        setAcceptThresh(res.accept_threshold);
        setRejectThresh(res.reject_threshold);
      }
    }).catch(err => console.error(err));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateThresholds({ accept_threshold: acceptThresh, reject_threshold: rejectThresh });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (e) {
      alert('Error saving thresholds: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const isClassicalReject = lastVerdict && lastVerdict.error_rate === null;
  const currentQber = (lastVerdict && lastVerdict.error_rate !== null)
    ? lastVerdict.error_rate * 100
    : 1.4;

  const qberColor =
    currentQber <= acceptThresh * 100  ? 'var(--success)'  :
    currentQber <= rejectThresh * 100  ? 'var(--warning)'  :
    'var(--danger)';

  const qberZone =
    currentQber <= acceptThresh * 100  ? 'ACCEPT'      :
    currentQber <= rejectThresh * 100  ? 'SUSPICIOUS'  :
    'REJECT';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* Section header */}
      <div>
        <span className="section-eyebrow">Quantum Telemetry</span>
        <h2 className="t-title" style={{ color: 'var(--text-primary)', marginBottom: 8 }}>
          Statistical QBER Monitoring
        </h2>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)', maxWidth: 520 }}>
          Live quantum bit error rate, operational threshold calibration, and system-wide
          SOC summary metrics.
        </p>
      </div>

      {/* Top 2-col grid */}
      <div className="grid-2" style={{ gap: 24 }}>

        {/* ── QBER GAUGE ─────────────────────────────────── */}
        <div className="card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--border-light)' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>QBER Threat Meter</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Quantum layer — Layer 3</div>
            </div>
            <span className={`badge ${
              qberZone === 'ACCEPT' ? 'badge-success' :
              qberZone === 'SUSPICIOUS' ? 'badge-warning' : 'badge-danger'
            }`}>{qberZone}</span>
          </div>

          {/* Main QBER number */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            {isClassicalReject ? (
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--warning)' }}>
                  N/A — Classical abort
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                  Rejected at {lastVerdict?.detection_layer} before quantum measurement
                </div>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 64, fontWeight: 800, letterSpacing: '-0.05em', color: qberColor, lineHeight: 1, fontFamily: 'var(--font-sans)' }}>
                  {currentQber.toFixed(1)}
                </div>
                <div style={{ fontSize: 20, fontWeight: 500, color: qberColor, marginTop: -4, marginBottom: 8 }}>%</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Active Quantum Bit Error Rate</div>
              </>
            )}
          </div>

          {/* Gauge bar */}
          <div>
            <div style={{
              position: 'relative',
              height: 8,
              borderRadius: 99,
              overflow: 'visible',
              background: 'var(--border-lighter)',
              marginBottom: 12,
            }}>
              {/* Zone fills */}
              <div style={{
                position: 'absolute', left: 0, width: `${acceptThresh * 100}%`, height: '100%',
                background: 'var(--success)', borderRadius: '99px 0 0 99px', opacity: 0.35,
              }} />
              <div style={{
                position: 'absolute',
                left: `${acceptThresh * 100}%`,
                width: `${(rejectThresh - acceptThresh) * 100}%`,
                height: '100%',
                background: 'var(--warning)', opacity: 0.35,
              }} />
              <div style={{
                position: 'absolute',
                left: `${rejectThresh * 100}%`,
                width: `${(1.0 - rejectThresh) * 100}%`,
                height: '100%',
                background: 'var(--danger)', borderRadius: '0 99px 99px 0', opacity: 0.35,
              }} />
              {/* Needle */}
              {!isClassicalReject && (
                <div style={{
                  position: 'absolute',
                  left: `${Math.min(100, currentQber)}%`,
                  top: -3, bottom: -3, width: 3,
                  background: qberColor,
                  borderRadius: 2,
                  transform: 'translateX(-50%)',
                  transition: 'left 0.4s ease',
                  boxShadow: `0 0 6px ${qberColor}`,
                }} />
              )}
              {/* Threshold markers */}
              <div style={{
                position: 'absolute',
                left: `${acceptThresh * 100}%`,
                top: -6, bottom: -6, width: 1,
                background: 'rgba(0,0,0,0.15)',
              }} />
              <div style={{
                position: 'absolute',
                left: `${rejectThresh * 100}%`,
                top: -6, bottom: -6, width: 1,
                background: 'rgba(0,0,0,0.15)',
              }} />
            </div>

            {/* Zone labels */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
              <span style={{ color: 'var(--success)' }}>Accept ≤ {(acceptThresh * 100).toFixed(0)}%</span>
              <span style={{ color: 'var(--warning)' }}>Suspicious ≤ {(rejectThresh * 100).toFixed(0)}%</span>
              <span style={{ color: 'var(--danger)' }}>Reject &gt; {(rejectThresh * 100).toFixed(0)}%</span>
            </div>
          </div>

          {/* Last verdict details */}
          {lastVerdict && (
            <div className="grid-3" style={{
              marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border-light)', gap: 10,
            }}>
              {[
                { label: 'Verdict', value: lastVerdict.verdict, color:
                  lastVerdict.verdict === 'ACCEPT' ? 'var(--success)' :
                  lastVerdict.verdict === 'SUSPICIOUS' ? 'var(--warning)' : 'var(--danger)' },
                { label: 'Fidelity', value: lastVerdict.fidelity != null
                  ? `${(lastVerdict.fidelity * 100).toFixed(1)}%` : 'N/A', color: 'var(--text-primary)' },
                { label: 'Threat', value: lastVerdict.threat_type, color:
                  lastVerdict.threat_type === 'NONE' ? 'var(--text-muted)' : 'var(--danger)' },
              ].map((m, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: m.color, letterSpacing: '-0.01em' }}>{m.value}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{m.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── THRESHOLD CALIBRATION ──────────────────────── */}
        <div className="card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--border-light)' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>Threshold Calibration</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Operational prototype limits</div>
            </div>
            <span className="badge badge-neutral">Configurable</span>
          </div>

          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 24 }}>
            Empirically calibrated for baseline fiber noise (0%–3.5%). These are prototype
            operational limits, not universal quantum constants.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 24 }}>
            {/* Accept threshold */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                    Acceptance threshold (τ<sub>accept</sub>)
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                    QBER ≤ threshold → ACCEPT
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color: 'var(--success)' }}>
                  {(acceptThresh * 100).toFixed(1)}%
                </div>
              </div>
              <input
                type="range"
                className="slider slider-success"
                min="0.01" max="0.10" step="0.005"
                value={acceptThresh}
                onChange={e => setAcceptThresh(parseFloat(e.target.value))}
              />
            </div>

            {/* Reject threshold */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                    Rejection threshold (τ<sub>reject</sub>)
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                    QBER &gt; threshold → REJECT
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color: 'var(--danger)' }}>
                  {(rejectThresh * 100).toFixed(1)}%
                </div>
              </div>
              <input
                type="range"
                className="slider slider-danger"
                min="0.05" max="0.30" step="0.005"
                value={rejectThresh}
                onChange={e => setRejectThresh(parseFloat(e.target.value))}
              />
            </div>
          </div>

          {/* Caution band label */}
          <div style={{
            padding: '10px 14px',
            background: 'var(--warning-soft)',
            border: '1px solid var(--warning-border)',
            borderRadius: 'var(--radius-md)',
            fontSize: 12,
            color: 'var(--warning)',
            display: 'flex', gap: 8, alignItems: 'flex-start',
            marginBottom: 20,
          }}>
            <Info size={14} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>
              Caution band: {(acceptThresh * 100).toFixed(0)}%–{(rejectThresh * 100).toFixed(0)}% → SUSPICIOUS.
              Elevated noise flagged for re-keying or arbitration.
            </span>
          </div>

          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
            style={{ justifyContent: 'center', width: '100%' }}
          >
            {savedSuccess ? (
              <><Check size={14} /> Thresholds saved</>
            ) : saving ? (
              'Saving…'
            ) : (
              'Apply thresholds'
            )}
          </button>
        </div>
      </div>

      {/* ── SOC SUMMARY METRICS ──────────────────────────── */}
      {summary && (
        <div className="card" style={{ padding: 28 }}>
          <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border-light)' }}>
            System-Wide SOC Summary
          </div>
          <div className="grid-4" style={{ gap: 20 }}>
            {[
              { label: 'Total verifications', value: summary.total_verifications ?? 0, color: 'var(--text-primary)' },
              { label: 'Accepted',             value: summary.accepted ?? 0,             color: 'var(--success)' },
              { label: 'Suspicious',           value: summary.suspicious ?? 0,           color: 'var(--warning)' },
              { label: 'Rejected',             value: summary.rejected ?? 0,             color: 'var(--danger)' },
            ].map((m, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '16px 12px', background: 'var(--surface-light)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.04em', color: m.color, lineHeight: 1 }}>
                  {m.value}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>{m.label}</div>
              </div>
            ))}
          </div>

          {/* Threat type breakdown */}
          {summary.threat_breakdown && (
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>
                Threat type breakdown
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {Object.entries(summary.threat_breakdown)
                  .filter(([k]) => k !== 'NONE')
                  .map(([type, count]) => (
                    <div key={type} style={{
                      padding: '6px 12px',
                      background: 'var(--surface-light)',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex', alignItems: 'center', gap: 8,
                    }}>
                      <span className="dot dot-danger" />
                      <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                        {type}
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--danger)' }}>{count}</span>
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
