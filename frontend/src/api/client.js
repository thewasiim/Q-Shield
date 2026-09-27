const API_ROOT = import.meta.env.VITE_API_URL || "http://localhost:8000";
const API_BASE = `${API_ROOT}/api`;

export async function fetchHealth() {
  const res = await fetch(`${API_ROOT}/`);
  return res.json();
}

export async function generateSignature(payload) {
  const res = await fetch(`${API_BASE}/signature/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Failed to generate signature");
  return res.json();
}

export async function verifySignature(payload) {
  const res = await fetch(`${API_BASE}/signature/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Failed to verify signature");
  return res.json();
}

export async function simulateAttack(payload) {
  const res = await fetch(`${API_BASE}/attack/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Failed to simulate attack");
  return res.json();
}

export async function fetchLedger(limit = 50) {
  const res = await fetch(`${API_BASE}/ledger/signatures?limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch ledger");
  return res.json();
}

export async function fetchThreatSummary() {
  const res = await fetch(`${API_BASE}/threats/summary`);
  if (!res.ok) throw new Error("Failed to fetch threat summary");
  return res.json();
}

export async function fetchBellState(bellType = "phi_plus") {
  const res = await fetch(`${API_BASE}/quantum/bell?bell_type=${bellType}`);
  if (!res.ok) throw new Error("Failed to fetch Bell state");
  return res.json();
}

export async function fetchThresholds() {
  const res = await fetch(`${API_BASE}/config/thresholds`);
  if (!res.ok) throw new Error("Failed to fetch thresholds");
  return res.json();
}

export async function updateThresholds(thresholds) {
  const res = await fetch(`${API_BASE}/config/thresholds`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(thresholds)
  });
  if (!res.ok) throw new Error("Failed to update thresholds");
  return res.json();
}

export async function runBenchmark(trials = 25) {
  const res = await fetch(`${API_BASE}/benchmark/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ trials_per_attack: trials })
  });
  if (!res.ok) throw new Error("Failed to run benchmark");
  return res.json();
}

export async function fetchRocAnalysis(trials = 30) {
  const res = await fetch(`${API_BASE}/benchmark/roc?trials=${trials}`);
  if (!res.ok) throw new Error("Failed to fetch ROC analysis");
  return res.json();
}

export async function fetchNoiseSweep(trials = 20) {
  const res = await fetch(`${API_BASE}/benchmark/sweep?trials=${trials}`);
  if (!res.ok) throw new Error("Failed to fetch noise sweep");
  return res.json();
}
