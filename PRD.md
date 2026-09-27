# Product Requirements Document (PRD)
## Project: Q-SHIELD (Quantum-Inspired Security & Threat Detection Framework for Quantum Digital Signatures)
### SIH Problem Statement ID: 26141
**Organization:** Egreen Quanta  
**Category:** Software | **Theme:** Blockchain & Cybersecurity  

---

## 1. Executive Summary & Defensible Pitch
The advent of fault-tolerant quantum computing poses an existential threat to classical asymmetric cryptography (e.g., RSA, ECDSA, Diffie-Hellman) via Shor's algorithm. Quantum Digital Signature (QDS) protocols exploit quantum mechanics (Heisenberg's Uncertainty Principle and the No-Cloning Theorem) to protect digital communications.

**Defensible Project Formulation**:
> **Q-SHIELD** is a quantum-inspired cybersecurity and threat detection framework that simulates teleportation-based quantum-signature verification and combines quantum measurement statistics with deterministic cybersecurity controls to detect forgery, replay, impersonation, and channel manipulation without AI/ML.

Critically adhering to Problem Statement 26141, **Q-SHIELD achieves threat detection without relying on machine learning or black-box artificial intelligence**. Instead, it uses a multi-stage defense-in-depth architecture:
1. **Layer 1: Identity Registry Authentication** (Cryptographic public identifier binding)
2. **Layer 2: Atomic Nonce & Replay Ledger** (Deterministic duplicate state prevention)
3. **Layer 3: Quantum Physical & Statistical Engine** (Pauli eigenstate projections, QBER, state fidelity $F$)

---

## 2. Problem Statement & Mathematical Framing
### 2.1 Classical Cryptographic Obsolescence
Classical digital signatures rely on computational hardness assumptions (integer factorization, discrete logarithms). A cryptographically relevant quantum computer (CRQC) running Shor's algorithm factorizes keys in polynomial time $\mathcal{O}((\log N)^3)$, breaking ECDSA in TLS, blockchain transactions, and financial networks.

### 2.2 Quantum Digital Signatures (QDS)
- Teleportation-based QDS protocols use pre-shared entangled Bell pairs $|\Phi^+\rangle$ and quantum teleportation to transmit signature states between Alice (Signer) and Bob (Verifier).
- Any attempt by an eavesdropper or forger to measure unknown quantum states collapses the wavefunction across conjugate Pauli bases, inducing detectable disturbance.

### 2.3 Strict Separation of Detection Mechanisms
To prevent metric conflation, Q-SHIELD strictly segregates classical vs. quantum rejection reasons:
- **Impersonation**: Handled at Layer 1 (Identity Registry). Reported as **Quantum QBER: N/A, Fidelity: N/A, Reason: Identity Verification Failed**.
- **Replay Attacks**: Handled at Layer 2 (Atomic Ledger). Reported as **Quantum QBER: N/A, Fidelity: N/A, Reason: Duplicate Nonce Settled**.
- **Forgery & Channel Perturbation**: Handled at Layer 3 (Quantum Statistics). Evaluated via QBER and quantum state fidelity ($F$).

---

## 3. Product Goals & Objectives
1. **Hierarchical Defense-in-Depth Pipeline**: Enforce strict pre-flight validation (Identity $\to$ Replay $\to$ Quantum Measurement).
2. **Quantum Protocol Simulator**: Simulate quantum teleportation, Bell-state entanglement, Pauli operations ($X, Y, Z$), and projective measurements via Qiskit.
3. **Statistical Physics Engine (Zero AI/ML)**:
   - Compute Quantum Bit Error Rate: $\text{QBER} = \frac{d_H(S_{\text{exp}}, S_{\text{obs}})}{N}$.
   - Compute Quantum Verification Accuracy: $\text{Acc} = 1 - \text{QBER}$.
   - Evaluate Quantum State Fidelity: $F(\rho, \sigma)$.
   - Evaluate Empirical Forgery Success Estimate: $P_{\text{forgery\_est}}$.
     > **Mathematical Clarification**: *The empirical estimate is used for experimental threat scoring and baseline detection validation, and should not be interpreted as a formal composable information-theoretic security bound.*
4. **Calibrated Operational Thresholds**:
   - Provide empirical ROC threshold analysis justifying operational parameters ($\tau_{\text{accept}} = 5\%$, $\tau_{\text{reject}} = 15\%$).
   - Tolerate realistic operational fiber channel noise ($0\% - 3.5\%$) without false rejection.
5. **Mission-Control Cyber-Quantum SOC Dashboard**:
   - Real-time QDS Studio with Dirac ket visualization.
   - Red Team Threat Simulation Lab with before-and-after channel topology.
   - Incident response audit timeline tracking verification stages.
   - Comprehensive multi-vector benchmark runner with ROC curve analysis.

---

## 4. User Personas
- **SOC Security Analyst**: Audits quantum communication links, investigates QBER alerts, and reviews replay attempts.
- **Cryptographic Engineer**: Calibrates operational acceptance/rejection thresholds, performs sensitivity sweeps, and evaluates ROC curves.
- **Enterprise Security Architect**: Evaluates quantum-resistant digital signature frameworks for SWIFT banking and critical infrastructure.

---

## 5. Functional Requirements (FR)

### FR-1: Quantum Core & Key Distribution
- **FR-1.1**: The system shall generate maximally entangled Bell states $|\Phi^+\rangle = \frac{|00\rangle + |11\rangle}{\sqrt{2}}$.
- **FR-1.2**: Carrier qubits shall be prepared in Pauli eigenstates: $\{|0\rangle, |1\rangle\}$ ($Z$), $\{|+\rangle, |-\rangle\}$ ($X$), and $\{|+i\rangle, |-i\rangle\}$ ($Y$).
- **FR-1.3**: The system shall execute 3-qubit teleportation with classical feedforward Pauli corrections ($X^{m_2} Z^{m_1}$).

### FR-2: Digital Signature Generation & Exchange
- **FR-2.1**: Alice shall bind an arbitrary payload to a quantum signature packet containing:
  - `signature_id`: Unique cryptographic identifier.
  - `message`: Text payload.
  - `sender`: Registered identity.
  - `public_identifier`: Registered public identity key token.
  - `timestamp`: ISO-8601 UTC timestamp.
  - `qubits`: Physical carrier states prepared in Pauli eigenstates.
  - `expected_measurement`: The reference projective measurement string.

### FR-3: Hierarchical Threat Detection Engine
- **FR-3.1 (Layer 1 - Impersonation)**: Validate `(sender, public_identifier)` against Identity Registry. On mismatch, abort with `REJECT: IMPERSONATION_ATTACK` and record `QBER: N/A`.
- **FR-3.2 (Layer 2 - Replay)**: Query atomic verification ledger. If `signature_id` previously verified, abort with `REJECT: REPLAY_ATTACK` and record `QBER: N/A`.
- **FR-3.3 (Layer 3 - Quantum Physical Measurement)**: Teleport and project carrier qubits along designated bases. Compare with expected pattern.
- **FR-3.4 (Layer 3 - Forgery Detection)**: High QBER resulting from conjugate basis collapse triggers `REJECT: FORGERY_ATTACK`.
- **FR-3.5 (Layer 3 - Channel Manipulation)**: Detect bit-flip ($X$), phase-flip ($Z$), or depolarizing noise. Degraded fidelity triggers `REJECT: CHANNEL_MANIPULATION`.

### FR-4: Calibrated Multi-Threshold Decision Engine
- **FR-4.1 Decision Rules**:
  - If $\text{QBER} \le \tau_{\text{accept}}$ (default: $5.0\%$): **ACCEPT** ($\checkmark$ Legitimate).
  - If $\tau_{\text{accept}} < \text{QBER} \le \tau_{\text{reject}}$ (default: $5.0\% - 15.0\%$): **SUSPICIOUS** ($\Delta$ Caution).
  - If $\text{QBER} > \tau_{\text{reject}}$ (default: $> 15.0\%$): **REJECT** ($\times$ Security Alert).
- **FR-4.2**: Thresholds dynamically configurable via API and SOC dashboard.

### FR-5: Evaluation & Benchmark Suite
- **FR-5.1**: Multi-vector evaluation harness testing legitimate traffic (with $0-3.5\%$ realistic noise) alongside all 4 attack vectors.
- **FR-5.2 Disturbance Sensitivity Sweep**: Measures detection probability across disturbance levels ($5\%, 10\%, 15\%, 20\%, 30\%, 40\%, 50\%$).
- **FR-5.3 ROC Threshold Analysis**: Computes True Positive Rate (TPR), False Positive Rate (FPR), and False Negative Rate (FNR) across candidate rejection thresholds ($1\%$ to $30\%$).

---

## 6. Non-Functional Requirements (NFR)
- **NFR-1 Auditability**: Pure non-AI, rule-based and quantum-mechanical evaluation ensures transparent, deterministic forensics.
- **NFR-2 Latency**: Verification of an $N=24$ qubit signature packet completes in $< 20\text{ ms}$.
- **NFR-3 Resilience**: Tolerates up to $3.5\%$ baseline environmental fiber noise without triggering false alarms.
- **NFR-4 UX Excellence**: Sci-Fi Cyber SOC dark theme with real-time before/after topology diagrams, live incident timelines, and exportable reports.
