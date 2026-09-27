import React, { useState } from 'react';
import { Search, RefreshCw, ChevronDown } from 'lucide-react';

function VerdictDot({ verdict }) {
  const color =
    verdict === 'ACCEPT'     ? 'var(--success)' :
    verdict === 'SUSPICIOUS' ? 'var(--warning)' :
    'var(--danger)';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span className="dot" style={{ background: color, width: 7, height: 7 }} />
      <span style={{ fontSize: 12, fontWeight: 600, color }}>{verdict}</span>
    </span>
  );
}

export default function AuditLedger({ ledger, onRefresh, loading }) {
  const [searchTerm,    setSearchTerm]    = useState('');
  const [filterVerdict, setFilterVerdict] = useState('ALL');

  const filtered = (ledger || []).filter(item => {
    const sId = item.signature_id || '';
    const msg = item.message || '';
    const snd = item.sender || '';
    const matchesSearch =
      sId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snd.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVerdict = filterVerdict === 'ALL' || item.verdict === filterVerdict;
    return matchesSearch && matchesVerdict;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Section header */}
      <div>
        <span className="section-eyebrow">Audit Ledger</span>
        <h2 className="t-title" style={{ color: 'var(--text-primary)', marginBottom: 8 }}>
          Verification History
        </h2>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)', maxWidth: 480 }}>
          Tamper-evident audit trail of all signature verifications and replay attack prevention records.
        </p>
      </div>

      {/* Controls bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        padding: '14px 18px',
        background: 'var(--surface-white)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-lg)',
      }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flex: 1, minWidth: 200 }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, maxWidth: 300 }}>
            <Search size={14} style={{
              position: 'absolute', left: 11, top: '50%',
              transform: 'translateY(-50%)', color: 'var(--text-muted)',
              pointerEvents: 'none',
            }} />
            <input
              type="text"
              className="input"
              style={{ paddingLeft: 34, fontSize: 13, height: 36 }}
              placeholder="Search signature ID, payload…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter */}
          <div style={{ position: 'relative' }}>
            <select
              className="select"
              style={{ height: 36, fontSize: 13, minWidth: 140 }}
              value={filterVerdict}
              onChange={e => setFilterVerdict(e.target.value)}
            >
              <option value="ALL">All verdicts</option>
              <option value="ACCEPT">Accepted only</option>
              <option value="SUSPICIOUS">Suspicious only</option>
              <option value="REJECT">Rejected threats</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {filtered.length} record{filtered.length !== 1 ? 's' : ''}
          </span>
          <button
            className="btn btn-secondary btn-sm"
            onClick={onRefresh}
            disabled={loading}
            style={{ height: 36 }}
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive" style={{ margin: 0, border: 'none', borderRadius: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Signature ID</th>
                <th>Payload</th>
                <th>Parties</th>
                <th>Verdict</th>
                <th>Threat type</th>
                <th>QBER</th>
                <th>Fidelity</th>
                <th>Attempts</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)' }}>
                    No records match the current filter.
                  </td>
                </tr>
              ) : (
                filtered.map(item => (
                  <tr key={item.signature_id} style={{
                    background: item.verification_count > 1 ? 'rgba(200,135,25,0.04)' : 'transparent',
                  }}>
                    {/* Signature ID */}
                    <td>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 12,
                        fontWeight: 600,
                        color: 'var(--accent-teal)',
                      }}>
                        {item.signature_id}
                      </span>
                    </td>

                    {/* Payload */}
                    <td style={{
                      maxWidth: 220,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      color: 'var(--text-primary)',
                      fontSize: 13,
                    }}>
                      {item.message}
                    </td>

                    {/* Parties */}
                    <td style={{ fontSize: 13 }}>
                      <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{item.sender}</span>
                      <span style={{ color: 'var(--text-muted)', margin: '0 5px', fontSize: 11 }}>→</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{item.recipient}</span>
                    </td>

                    {/* Verdict */}
                    <td>
                      <VerdictDot verdict={item.verdict} />
                    </td>

                    {/* Threat type */}
                    <td>
                      <span style={{
                        fontSize: 11,
                        fontFamily: 'var(--font-mono)',
                        color: item.threat_type === 'NONE' ? 'var(--text-muted)' : 'var(--danger)',
                        fontWeight: item.threat_type === 'NONE' ? 400 : 600,
                      }}>
                        {item.threat_type}
                      </span>
                    </td>

                    {/* QBER */}
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                      {(item.qber !== undefined && item.qber !== null) || (item.error_rate !== undefined && item.error_rate !== null) ? (
                        (() => {
                          const val = item.qber ?? item.error_rate;
                          return (
                            <span style={{ color: val <= 0.05 ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
                              {(val * 100).toFixed(1)}%
                            </span>
                          );
                        })()
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>N/A</span>
                      )}
                    </td>

                    {/* Fidelity */}
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                      {item.fidelity !== undefined && item.fidelity !== null ? (
                        <span style={{ color: 'var(--text-primary)' }}>
                          {(item.fidelity * 100).toFixed(1)}%
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>N/A</span>
                      )}
                    </td>

                    {/* Attempts */}
                    <td>
                      {item.verification_count > 1 ? (
                        <span className="badge badge-warning" style={{ fontSize: 10 }}>
                          {item.verification_count}× Replay
                        </span>
                      ) : (
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>1× Unique</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex', gap: 20, flexWrap: 'wrap',
        fontSize: 11, color: 'var(--text-muted)',
        padding: '12px 0',
      }}>
        {[
          { label: 'Accepted — legitimate signature', color: 'var(--success)' },
          { label: 'Suspicious — caution band, arbitration required', color: 'var(--warning)' },
          { label: 'Rejected — threat neutralized', color: 'var(--danger)' },
        ].map((l, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="dot" style={{ background: l.color, width: 6, height: 6 }} />
            <span>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
