# Technical Requirements Document (TRD)
## Project: Q-SHIELD (Quantum-Inspired Security & Threat Detection Framework)
### SIH Problem Statement ID: 26141

---

## 1. Architectural Foundation & Multi-Stage Pipeline

> **Core Architectural Story:**  
> **Q-SHIELD uses classical authentication and replay controls to protect the protocol envelope, then uses quantum-state measurement statistics to assess the integrity of signatures that pass those classical checks.**

```
                               Verification Request
                                       │
                                       ▼
                   ┌──────────────────────────────────────────┐
                   │ STAGE 1: Symmetric HMAC-SHA256 Auth      │
                   │ (5-Tuple Token & Freshness Window)       │
                   └───────────────────┬──────────────────────┘
                                       │
                            Pass ┌─────┴─────┐ Fail
                                 │           │
                                 ▼           ▼
                   ┌──────────────────────┐  REJECT: IMPERSONATION_ATTACK
                   │ STAGE 2: Settled     │  [Quantum QBER: N/A, Fid: N/A]
                   │ Nonce Ledger Check   │
                   └─────────────┬────────┘
                                 │
                            Pass ┌─────┴─────┐ Fail (status == 'SETTLED')
                                 │           │
                                 ▼           ▼
                     status = 'PENDING'    REJECT: REPLAY_ATTACK
                                 │         [Quantum QBER: N/A, Fid: N/A]
                                 ▼
                   ┌──────────────────────┐
                   │ STAGE 3: Quantum     │
                   │ Teleportation & Meas │
                   └─────────────┬────────┘
                                 │
                                 ▼
                     QBER & State Fidelity (F)
                                 │
                                 ▼
                   ┌──────────────────────────┐
                   │ Multi-Threshold Engine   │
                   │ τ_accept = 5%, τ_rej=15% │
                   └─────────────┬────────────┘
                                 │
                   ┌─────────────┼─────────────┐
                   ▼             ▼             ▼
                ACCEPT       SUSPICIOUS      REJECT
             (Legitimate)   (Caution Band)  (Threat Neutralized)
                   │             │             │
                   ▼             └──────┬──────┘
           status = 'SETTLED'           ▼
                               status = 'REJECTED'
```

---

## 2. Classical Envelope Security Specifications

### 2.1 Symmetric Cryptographic Identity Authentication (HMAC-SHA256)
- **Shared Secret Model**: Alice and the verification server share a symmetric 256-bit secret key $K$.
- **5-Tuple Token Binding**: To prevent transaction-rebinding and token-reuse attacks, the authentication token cryptographically binds all transaction parameters:
  $$\tau_{\text{auth}} = \text{HMAC}_K(\text{sender} \parallel \text{signature\_id} \parallel \text{nonce} \parallel \text{message} \parallel \text{timestamp})$$
- **Timestamp Freshness Window**:
  $$|t_{\text{current}} - t_{\text{packet}}| \le \Delta t_{\text{window}} \quad (\text{default: } 300\text{ seconds})$$
  Packets with expired timestamps are terminated classically before quantum resource allocation.
- **Architectural Scope**: Provides symmetric message authentication. Does not claim public-key non-repudiation.

### 2.2 DoS-Safe Settled Nonce Ledger & State Machine
- **Vulnerability Solved**: Naive atomic reservation before quantum verification allows an attacker to inject corrupted packets with valid-looking IDs to permanently consume identifiers belonging to legitimate signers (Denial-of-Service).
- **Three-State Lifecycle**:
  1. `PENDING`: Atomically set when packet passes Stage 1, reserving the nonce during quantum circuit execution.
  2. `SETTLED`: Committed when Stage 3 quantum verification succeeds (`verdict == 'ACCEPT'`).
  3. `REJECTED`: Marked when Stage 3 verification fails (`SUSPICIOUS` or `REJECT`), logging failed attempts without blocking legitimate signers from retry.
- **Uniqueness Constraint**: A database-enforced uniqueness constraint `UNIQUE(signature_id, nonce)` prevents reuse of a previously settled signature identifier.

---

## 3. Quantum Mechanics Formulations

### 3.1 Bell State Generation (EPR Entanglement)
Maximally entangled Bell state $|\Phi^+\rangle$ prepared across qubits $q_A$ and $q_B$:
$$|\Phi^+\rangle = \frac{|00\rangle + |11\rangle}{\sqrt{2}}$$
Circuit sequence: $H(q_A) \to \text{CNOT}(q_A \to q_B)$.

### 3.2 Quantum Teleportation Protocol
To transmit signature carrier state $|\psi\rangle = \alpha|0\rangle + \beta|1\rangle$ from Alice to Bob:
1. Alice holds message qubit $q_S$ and half of entangled pair $q_{A1}$; Bob holds $q_B$.
2. Alice applies $\text{CNOT}(q_S \to q_{A1})$ followed by $H(q_S)$.
3. Alice performs projective Bell-basis measurement, obtaining classical bits $m_1, m_2 \in \{0, 1\}$.
4. Bob applies conditional Pauli corrections:
$$|\psi_{\text{out}}\rangle = X^{m_2} Z^{m_1} |\psi\rangle$$
Reconstructs $|\psi\rangle$ at Bob's side while preserving the No-Cloning Theorem.

### 3.3 Pauli Operators & Conjugate Basis Incompatibility
Signature states are encoded using eigenstates of the three Pauli operators:
$$\sigma_x = \begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}, \quad \sigma_y = \begin{pmatrix} 0 & -i \\ i & 0 \end{pmatrix}, \quad \sigma_z = \begin{pmatrix} 1 & 0 \\ 0 & -1 \end{pmatrix}$$

#### Eigenstates:
- **$Z$-basis (Computational)**: $|0\rangle \to +1, \quad |1\rangle \to -1$
- **$X$-basis (Hadamard)**: $|+\rangle = \frac{|0\rangle + |1\rangle}{\sqrt{2}} \to +1, \quad |-\rangle = \frac{|0\rangle - |1\rangle}{\sqrt{2}} \to -1$
- **$Y$-basis (Circular)**: $|+i\rangle = \frac{|0\rangle + i|1\rangle}{\sqrt{2}} \to +1, \quad |-i\rangle = \frac{|0\rangle - i|1\rangle}{\sqrt{2}} \to -1$

Measurement along basis $B \in \{X, Y, Z\}$ is performed by rotating into the computational basis prior to $Z$-measurement:
- $X$-basis: Apply $H$ gate before measurement.
- $Y$-basis: Apply $S^\dagger = R_z(-\pi/2)$ followed by $H$ gate before measurement.
- $Z$-basis: Measure directly.

When an adversary measures or prepares in conjugate basis $B_i \ne B_j$ (e.g., $X$ vs $Z$), Heisenberg's uncertainty principle forces wavefunction collapse:
$$\mathbb{P}(\text{error} \mid B_i \ne B_j) = 0.5$$

---

## 4. Threat Detection Formulations & Evaluation Metrics

### 4.1 Quantum Bit Error Rate (QBER)
Let $S_{\text{exp}} = (s_1, \dots, s_N)$ and $S_{\text{obs}} = (o_1, \dots, o_N)$ where $s_i, o_i \in \{0, 1\}$.
Hamming distance:
$$d_H(S_{\text{exp}}, S_{\text{obs}}) = \sum_{i=1}^N (s_i \oplus o_i)$$
Quantum Bit Error Rate:
$$\text{QBER} = \frac{d_H(S_{\text{exp}}, S_{\text{obs}})}{N}$$

### 4.2 Quantum State Fidelity
For received state $\rho$ and ideal state $\sigma$:
$$F(\rho, \sigma) = \left(\text{Tr}\sqrt{\sqrt{\rho}\sigma\sqrt{\rho}}\right)^2$$
Under environmental decoherence and unitary perturbation, $F < 0.75$ indicates channel manipulation.

### 4.3 Depolarizing Channel Parameterization
In Q-SHIELD's depolarizing channel model with parameterization $p$:
$$\mathcal{E}(\rho) = (1 - p)\rho + \frac{p}{3}(X\rho X + Y\rho Y + Z\rho Z)$$
For single-qubit projective measurements along designated bases, orthogonal bit-flip disturbance occurs with probability $\frac{2}{3}p$. Setting configured adversarial intensity $\eta \equiv p$ yields:
$$p_{\text{error}} = \frac{2}{3}\eta$$
*Note:* This relationship is derived specifically from Q-SHIELD's channel parameterization and is not claimed as a universal physical law.

### 4.4 Dual-Metric System & Decision Rules
Operational decision rules:
$$\text{Decision} = \begin{cases}
\textbf{ACCEPT} & \text{if } \text{QBER} \le \tau_{\text{accept}} \quad (5.0\%) \\
\textbf{SUSPICIOUS} & \text{if } \tau_{\text{accept}} < \text{QBER} \le \tau_{\text{reject}} \quad (5.0\% - 15.0\%) \\
\textbf{REJECT} & \text{if } \text{QBER} > \tau_{\text{reject}} \quad (> 15.0\%)
\end{cases}$$

Q-SHIELD reports **two distinct metrics**:
1. **Threat Detection Rate** ($\text{SUSPICIOUS} + \text{REJECT}$):
   $$\text{Detection} = \begin{cases} 1 & \text{if verdict} \in \{\text{SUSPICIOUS}, \text{REJECT}\} \\ 0 & \text{if verdict} = \text{ACCEPT} \end{cases}$$
2. **Hard Rejection Rate** ($\text{REJECT}$ only):
   $$\text{Hard Rejection} = \begin{cases} 1 & \text{if verdict} = \text{REJECT} \\ 0 & \text{if verdict} \in \{\text{ACCEPT}, \text{SUSPICIOUS}\} \end{cases}$$

### 4.5 Balanced Synthetic Benchmark & Wilson Confidence Intervals
- Benchmark comprises $N = 125$ balanced trials across 5 equally sized test classes ($n = 25$ each).
- Proportions are qualified using 95% Wilson score confidence intervals:
  $$\hat{p} \pm \frac{z \sqrt{\frac{\hat{p}(1-\hat{p})}{n} + \frac{z^2}{4n^2}}}{1 + \frac{z^2}{n}} \quad (z = 1.96)$$
- *Methodological Disclaimer:* Results represent macro-style performance over equal synthetic test classes, not unconditioned real-world network traffic.

---

## 5. Attacker Adaptivity & Boundary Behavior Analysis

To evaluate adversaries attempting to bypass thresholds by choosing $\eta \in [5\%, 20\%]$:

```
                  Observed Detection Probability vs Attack Intensity
100% ┤                                                  ███████████████
 80% ┤                                       ███████████
 60% ┤                            ███████████
 40% ┤                 ███████████
 20% ┤      ███████████
  0% ┼─────────────────────────────────────────────────────────────────
       5%       8%        10%         12%        15%       18%     >= 25%
                         Adversarial Intensity (η)
```

At low intensities ($\eta \le 12\%$), threats that escape hard rejection are routed to the `SUSPICIOUS` caution band for re-keying and arbitration, preventing silent compromise. At $\eta \ge 18\%$, hard rejection dominates ($> 90\%$).

---

## 6. REST API Specification

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/signature/generate` | Generates signature packet with nonce, 5-tuple HMAC token, and Pauli states |
| `POST` | `/api/signature/verify` | Multi-stage verification with DoS-safe state machine (PENDING $\to$ SETTLED / REJECTED) |
| `POST` | `/api/attack/simulate` | Simulates 4 red-team vectors with before/after topology and SOC timeline |
| `GET` | `/api/benchmark/roc` | Computes ROC curve across operational thresholds (1% to 30%) |
| `GET` | `/api/benchmark/sweep` | Evaluates boundary detection behavior across disturbance levels (5% to 50%) |
| `POST` | `/api/benchmark/run` | Balanced synthetic benchmark ($N=125$) reporting dual metrics and Wilson CIs |
| `GET` | `/api/ledger/signatures` | Verification ledger history and settled nonce status |
| `GET` | `/api/threats/summary` | Aggregated SOC security metrics |
| `GET` | `/api/config/thresholds` | Gets current operational acceptance/rejection thresholds |
| `POST` | `/api/config/thresholds` | Updates operational thresholds dynamically |
