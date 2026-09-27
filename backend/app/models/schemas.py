"""
Pydantic Schemas for Q-SHIELD API & Domain Models.
Reflects multi-layered defense architecture:
Layer 1: Symmetric Cryptographic Identity Authentication (HMAC-SHA256 Signer Authentication)
Layer 2: Database-Enforced Nonce Ledger (Stateful PENDING -> SETTLED / REJECTED Lifecycle)
Layer 3: Quantum Physical & Statistical Check (QBER & State Fidelity)
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class SignatureGenerationRequest(BaseModel):
    message: str = Field(..., example="Transfer ₹5000 to Bob")
    sender: str = Field(default="Alice", example="Alice")
    recipient: str = Field(default="Bob", example="Bob")
    num_qubits: int = Field(default=24, ge=8, le=64)

class QubitDetail(BaseModel):
    index: int
    basis: str
    prep_val: int
    eigenstate: str

class SignaturePacket(BaseModel):
    signature_id: str
    nonce: Optional[str] = None
    message: str
    sender: str
    recipient: str
    timestamp: str
    num_qubits: int
    basis_sequence: List[str]
    expected_measurement: str
    qubits: List[QubitDetail]
    public_identifier: str
    auth_token: Optional[str] = None  # Symmetric HMAC-SHA256 authentication token

class VerificationRequest(BaseModel):
    signature: SignaturePacket
    channel_noise: Optional[Dict[str, Any]] = None
    override_observed: Optional[str] = None
    baseline_channel_noise: Optional[float] = 0.015  # Realistic 1.5% operational fiber noise
    timestamp_freshness_window_sec: Optional[float] = 300.0  # Configurable freshness window

class TimelineEvent(BaseModel):
    timestamp: str
    stage: str
    status: str  # "PASS", "WARN", "FAIL", "INFO"
    message: str

class ThreatVerdict(BaseModel):
    signature_id: str
    verdict: str  # "ACCEPT", "SUSPICIOUS", "REJECT"
    threat_type: str  # "NONE", "FORGERY_ATTACK", "REPLAY_ATTACK", "IMPERSONATION_ATTACK", "CHANNEL_MANIPULATION", "SUSPICIOUS_NOISE", "STALE_TIMESTAMP"
    detection_layer: str  # "SYMMETRIC_AUTHENTICATION", "SETTLED_NONCE_LEDGER", "QUANTUM_STATISTICAL"
    error_rate: Optional[float] = None
    verification_accuracy: Optional[float] = None
    fidelity: Optional[float] = None
    empirical_forgery_estimate: Optional[float] = None
    forgery_probability: Optional[float] = None  # Backward compatibility
    expected_string: Optional[str] = None
    observed_string: Optional[str] = None
    hamming_distance: Optional[int] = None
    details: str
    timestamp: str
    timeline: List[TimelineEvent] = []
    qubit_telemetry: Optional[List[Dict[str, Any]]] = None

class AttackSimulationRequest(BaseModel):
    attack_type: str = Field(..., example="forgery")  # "forgery", "replay", "impersonation", "channel_manipulation"
    message: Optional[str] = "Authorize Bank Transfer ₹100,000"
    sender: Optional[str] = "Alice"
    recipient: Optional[str] = "Bob"
    channel_noise_type: Optional[str] = "bit_flip"  # "bit_flip", "phase_flip", "depolarizing"
    noise_strength: Optional[float] = 0.35
    forgery_mode: Optional[str] = "random_guess"  # "random_guess", "partial_intercept"

class ThresholdConfig(BaseModel):
    accept_threshold: float = Field(default=0.05, ge=0.0, le=0.5)
    reject_threshold: float = Field(default=0.15, ge=0.05, le=1.0)

class BenchmarkRequest(BaseModel):
    trials_per_attack: int = Field(default=25, ge=10, le=500)
    baseline_noise_range: Optional[List[float]] = [0.0, 0.01, 0.02, 0.03, 0.04]
    random_seed: Optional[int] = 42191

class AttackMetric(BaseModel):
    attack_type: str
    detection_mechanism: str
    total_trials: int
    detected_count: int  # SUSPICIOUS + REJECT
    detection_rate: float  # (SUSPICIOUS + REJECT) / total
    hard_rejected_count: Optional[int] = None  # REJECT only
    hard_rejection_rate: Optional[float] = None  # REJECT / total
    suspicious_count: Optional[int] = None  # SUSPICIOUS only
    ci_95_lower: float  # Wilson score 95% confidence interval lower
    ci_95_upper: float  # Wilson score 95% confidence interval upper
    false_positives: int
    false_negatives: int
    mean_qber: Optional[float] = None
    mean_fidelity: Optional[float] = None
    avg_latency_ms: float

class BenchmarkSummary(BaseModel):
    experiment_id: str
    random_seed: int
    total_runs: int
    total_duration_sec: float
    overall_accuracy: float
    accuracy_ci_95: List[float]  # [lower, upper]
    overall_detection_rate: float  # Threat detection rate (SUSPICIOUS + REJECT)
    detection_rate_ci_95: List[float]  # [lower, upper]
    overall_hard_rejection_rate: Optional[float] = None  # Hard rejection rate (REJECT only)
    hard_rejection_ci_95: Optional[List[float]] = None
    total_attacks_detected: Optional[int] = None
    total_attacks_hard_rejected: Optional[int] = None
    total_attacks_suspicious: Optional[int] = None
    false_positive_rate: float
    false_negative_rate: float
    metrics: List[AttackMetric]
    benchmark_type: str = "Balanced Synthetic Simulation Benchmark (Equal Class Weights)"
    timestamp: str

class RocPoint(BaseModel):
    threshold: float
    tpr: float
    fpr: float
    fnr: float

class RocAnalysisResult(BaseModel):
    threshold_curve: List[RocPoint]
    recommended_accept_threshold: float = 5.0
    recommended_reject_threshold: float = 15.0
    evaluation_trials: int

class NoiseSweepPoint(BaseModel):
    attack_intensity: float
    noise_level: float
    mean_qber: float
    mean_fidelity: float
    detection_rate: float
    verdict_distribution: Dict[str, float]

class NoiseSweepResult(BaseModel):
    sweep_points: List[NoiseSweepPoint]
    trials_per_level: int
