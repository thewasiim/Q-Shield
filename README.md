# Q-SHIELD: Quantum-Inspired Cyber Threat Detection Framework

### Smart India Hackathon (SIH 2026) | Problem Statement ID: 26141
**Theme:** Blockchain & Cybersecurity | **Organization:** Egreen Quanta  
**Problem Title:** Quantum-Inspired Cyber Threat Detection for Digital Signature Security

---

## 🛡️ Architectural Thesis & Core Story

> **The One-Sentence Architectural Story:**  
> **Q-SHIELD uses classical authentication and replay controls to protect the protocol envelope, then uses quantum-state measurement statistics to assess the integrity of signatures that pass those classical checks.**

```
                                  Q-SHIELD
                                      │
            ┌─────────────────────────┴─────────────────────────┐
            │                                                   │
   CLASSICAL SECURITY                                  QUANTUM SECURITY
  (Protocol Envelope)                                (Physical Integrity)
            │                                                   │
            ▼                                                   ▼
Symmetric HMAC-SHA256                               Teleportation Core
  (5-Tuple Token Binding)                           Pauli Carrier Qubits
            │                                                   │
            ▼                                                   ▼
Settled Nonce Ledger                                Projective Measurement
  (DoS-Safe State Machine)                                      │
  (PENDING → SETTLED / REJECTED)                                ▼
            │                                                 QBER
            │                                           (Bit Error Rate)
            │                                                   │
            └─────────────────────────┬─────────────────────────┘
                                      ▼
                           Multi-Stage Decision Engine
                                      │
                      ┌───────────────┼───────────────┐
                      ▼               ▼               ▼
                   ACCEPT        SUSPICIOUS        REJECT
                 (Normal)      (Caution Band)    (Hard Threat)
```

Classical digital signatures (RSA, ECDSA) will be broken once cryptographically relevant quantum computers can execute Shor's algorithm. Quantum Digital Signatures (QDS) provide information-theoretic security grounded in Heisenberg's Uncertainty Principle and the No-Cloning Theorem.

Adhering strictly to Problem Statement 26141, **Q-SHIELD performs threat detection without AI or machine learning**. It implements a defense-in-depth architecture across three distinct layers:
1. **Layer 1: Symmetric Cryptographic Identity Authentication** (HMAC-SHA256 5-Tuple Token Binding & Timestamp Freshness Window; detects Signer Impersonation; QBER reported as N/A).
2. **Layer 2: Settled Nonce Ledger & State Machine** (Database-enforced settled nonce uniqueness constraint; prevents replay attacks without DoS vulnerability; QBER reported as N/A).
3. **Layer 3: Quantum Physical & Statistical Engine** (detects Forgery & Channel Manipulation via Pauli basis projections, QBER, and state fidelity $F$).

---

## 🚀 Key Architectural Highlights

1. **Clean Separation of Classical and Quantum Layers**:
   - Classical envelope checks execute pre-flight; if an impersonation or replay attempt occurs, execution aborts before quantum resource allocation, cleanly reporting QBER / Fidelity as N/A.

2. **DoS-Safe Nonce State Machine**:
   - Eliminates Denial-of-Service attacks where an attacker submits corrupted quantum payloads to permanently burn legitimate signature IDs. Nonces transition: `PENDING` $\to$ `SETTLED` (upon passing verification) or `REJECTED` (released on failure).

3. **5-Tuple HMAC Token Binding**:
   - Tokens cryptographically bind $\text{HMAC}_K(\text{sender} \parallel \text{signature\_id} \parallel \text{nonce} \parallel \text{message} \parallel \text{timestamp})$ with a configurable timestamp freshness window ($\le 300\text{s}$), closing token-rebinding and reuse vectors.

4. **Quantum Protocol Simulator**:
   - Built on Qiskit and Qiskit-Aer.
   - Bell state creation: $|\Phi^+\rangle = \frac{|00\rangle + |11\rangle}{\sqrt{2}}$.
   - Full 3-qubit quantum teleportation protocol with classical feedforward Pauli corrections ($X^{m_2} Z^{m_1}$).
   - Pauli eigenstate preparation and basis rotations across computational ($Z$), Hadamard ($X$), and circular ($Y$) bases.

5. **Operational Threshold Calibration & Dual-Metric Evaluation**:
   - Calibrated for baseline operational fiber noise ($0\% - 3.5\%$):
     - $\text{QBER} \le 5\%$: **ACCEPT** ($\checkmark$ Legitimate).
     - $5\% < \text{QBER} \le 15\%$: **SUSPICIOUS** ($\Delta$ Caution Zone).
     - $\text{QBER} > 15\%$: **REJECT** ($\times$ Threat Neutralized).
   - **Dual Metrics Reported**:
     - **Threat Detection Rate** ($\text{SUSPICIOUS} + \text{REJECT}$): Captures all threats flagged for security intervention.
     - **Hard Rejection Rate** ($\text{REJECT}$ only): Captures immediate deterministic blocking.

6. **Depolarizing Noise Parameterization**:
   - Adversarial intensity $\eta$ maps to expected bit error rate $p_{\text{error}} = \frac{2}{3}\eta$ for single-qubit projective measurements in Q-SHIELD's depolarizing channel.

7. **Attacker Adaptivity & Boundary Analysis**:
   - Automated sweep ($\eta \in [5\%, 50\%]$) evaluates detector response near decision boundaries.

---

## 📂 Repository Structure

```
q-shield/
├── PRD.md                         # Product Requirements Document
├── TRD.md                         # Technical Requirements Document
├── DESIGN.md                      # System Architecture & State Machine Details
├── README.md                      # Setup and Pitch Guide
│
├── backend/
│   ├── app/
│   │   ├── main.py                # FastAPI Application & Endpoints
│   │   ├── quantum/
│   │   │   ├── bell_state.py      # Bell State Generation
│   │   │   ├── teleportation.py   # Quantum Teleportation Protocol
│   │   │   ├── pauli.py           # Pauli X/Y/Z Bases & Eigenstates
│   │   │   └── measurement.py     # Projective Quantum Measurements
│   │   ├── security/
│   │   │   ├── verifier.py        # QDS Verification Core & State Machine
│   │   │   ├── threat_detector.py # Multi-Layer Threat Detector
│   │   │   ├── thresholds.py      # Calibrated Operational Thresholds
│   │   │   └── statistics.py      # QBER, Fidelity & Dual-Metric Calculators
│   │   ├── attacks/
│   │   │   ├── forgery.py         # Signature Forgery Attack Simulator
│   │   │   ├── replay.py          # Replay Attack Simulator
│   │   │   ├── impersonation.py   # Impersonation Attack Simulator
│   │   │   └── channel_attack.py  # Quantum Channel Noise Injection
│   │   ├── models/
│   │   │   ├── schemas.py         # Pydantic Schemas (Dual Metrics & Nonces)
│   │   │   └── database.py        # SQLite Database (3-State Nonce Ledger & HMAC)
│   │   └── benchmark/
│   │       └── test_runner.py     # Balanced Synthetic Benchmark Runner & Sweep
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── App.jsx                # Main Application Shell
    │   ├── components/
    │   │   ├── Header.jsx         # Status Badges & Navigation
    │   │   ├── QdsStudio.jsx      # Alice (Sign) & Bob (Verify)
    │   │   ├── AttackLab.jsx      # Before/After Topology & SOC Timeline
    │   │   ├── Telemetry.jsx      # Calibrated QBER Gauge & Thresholds
    │   │   ├── CircuitViewer.jsx  # Interactive Quantum Circuit Visualizer
    │   │   ├── AuditLedger.jsx    # Verification History Table
    │   │   └── BenchmarkModal.jsx # Balanced Benchmark, Dual-Metrics & Sweep
    │   ├── api/
    │   │   └── client.js          # REST Client for Backend
    │   └── index.css              # Cyber-Quantum SOC Styling
    ├── package.json
    └── vite.config.js
```

---

## 🛠️ Quickstart Guide

### 1. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 📊 Experimental Evaluation — Balanced Synthetic Benchmark (Seed: 42191)

Tested with realistic operational fiber noise ($0 - 3.5\%$) and randomized attack parameters across 125 balanced trials ($n = 25$ per class):

| Test Vector | Primary Detection Layer | Detection Mechanism | Trials | Threat Detection (SUSPICIOUS + REJECT) | Hard Rejection (REJECT only) | Mean QBER | Mean Fidelity |
|:---|:---:|:---|:---:|:---:|:---:|:---:|:---:|
| **Legitimate Traffic** | Layer 3 | Operational Tolerance | 25 | **100.0%** [86.7% – 100%] | **0.0%** (Clean Pass) | 0.4% | 99.5% |
| **Signature Forgery** | Layer 3 | Conjugate Basis Collapse | 25 | **100.0%** [86.7% – 100%] | **100.0%** [86.7% – 100%] | 39.3% | 73.9% |
| **Replay Attack** | Layer 2 | Settled Nonce Ledger | 25 | **88.0%** [70.0% – 95.8%] | **88.0%** [70.0% – 95.8%] | N/A | N/A |
| **Signer Impersonation** | Layer 1 | Symmetric HMAC Auth | 25 | **100.0%** [86.7% – 100%] | **100.0%** [86.7% – 100%] | N/A | N/A |
| **Channel Manipulation** | Layer 3 | Pauli Noise & Fidelity Drop | 25 | **96.0%** [80.5% – 99.3%] | **76.0%** [56.6% – 88.5%] | 24.9% | 71.7% |
| **Overall (Macro)** | **Multi-Layer** | **Unified Architecture** | **125** | **96.8%** [92.1% – 98.8%] | **91.0%** [83.8% – 95.2%] | — | — |

### Summary Statistics & Interpretation
- **Threat Detection Rate** ($\text{SUSPICIOUS} + \text{REJECT}$): **96.0%** ($96/100$ attack trials caught).
- **Hard Rejection Rate** ($\text{REJECT}$ only): **91.0%** ($91/100$ attack trials immediately terminated).
- **Caution Band Allocation**: 5 channel attacks safely routed to `SUSPICIOUS` caution band for re-keying/arbitration.
- **Observed False-Positive Rate**: **0.0%** ($0/25$ false alarms on legitimate traffic).
- **Observed False-Negative Rate**: **4.0%** across attack trials.
- **Wilson Score 95% Confidence Intervals**: Quantify statistical uncertainty around observed binomial proportions within the synthetic experiment.
- **Balanced Benchmark Disclaimer**: Metrics represent macro-style performance over equally weighted synthetic classes ($20\%$ each), not an unconditioned real-world traffic distribution.

> **Formal Security Disclaimer**: Results are simulation-based and do not constitute a formal composable QDS information-theoretic security proof. Operational thresholds ($\tau_{\text{accept}} = 5.0\%$, $\tau_{\text{reject}} = 15.0\%$) are calibrated empirically through randomized simulation experiments rather than asserted as universal physical constants.
