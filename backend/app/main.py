"""
FastAPI Server for Q-SHIELD.
Quantum-Inspired Security & Threat Detection Framework for Quantum Digital Signatures.
SIH Problem Statement ID: 26141
"""

import uuid
import hashlib
from datetime import datetime
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.models.schemas import (
    SignatureGenerationRequest,
    SignaturePacket,
    QubitDetail,
    VerificationRequest,
    ThreatVerdict,
    AttackSimulationRequest,
    ThresholdConfig,
    BenchmarkRequest,
    BenchmarkSummary,
    RocAnalysisResult,
    NoiseSweepResult
)
from app.models.database import (
    init_db,
    get_ledger_records,
    get_threat_summary,
    get_registered_identity,
    generate_signer_auth_token
)
from app.quantum.pauli import PAULI_BASES, get_eigenstate_label
from app.quantum.bell_state import get_bell_statevector
from app.security.verifier import verify_signature_packet
from app.security.thresholds import threshold_engine
from app.attacks.forgery import generate_forged_signature_packet
from app.attacks.replay import create_replayed_signature
from app.attacks.impersonation import create_impersonated_signature
from app.attacks.channel_attack import get_channel_attack_config
from app.benchmark.test_runner import (
    run_evaluation_benchmark,
    run_roc_threshold_analysis,
    run_noise_sensitivity_sweep
)

# Initialize database tables
init_db()

app = FastAPI(
    title="Q-SHIELD Threat Detection API",
    description="Quantum-Inspired Cybersecurity Framework for Quantum Digital Signatures (SIH 26141)",
    version="2.0.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "framework": "Q-SHIELD",
        "description": "Quantum-Inspired Threat Detection for Quantum Digital Signatures",
        "sih_ps_id": "26141",
        "theme": "Blockchain & Cybersecurity",
        "status": "ONLINE",
        "defense_architecture": "3-Stage Layered Defense (Identity -> Replay -> Quantum Statistical)",
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }

@app.post("/api/signature/generate", response_model=SignaturePacket)
def generate_signature(req: SignatureGenerationRequest):
    """
    Alice generates a quantum digital signature bound to a payload message.
    Generates Pauli eigenstate sequence and expected measurement bitstring.
    """
    msg_hash = hashlib.sha256(req.message.encode()).hexdigest()
    
    identity = get_registered_identity(req.sender)
    public_id = identity["public_identifier"] if identity else f"{req.sender.upper()}-PUBKEY-TEMP"
    
    qubits: List[QubitDetail] = []
    basis_sequence: List[str] = []
    expected_bits: List[str] = []
    
    for i in range(req.num_qubits):
        basis_idx = int(msg_hash[(i * 2) % len(msg_hash)], 16) % len(PAULI_BASES)
        basis = PAULI_BASES[basis_idx]
        val = int(msg_hash[(i * 2 + 1) % len(msg_hash)], 16) % 2
        
        basis_sequence.append(basis)
        expected_bits.append(str(val))
        qubits.append(QubitDetail(
            index=i,
            basis=basis,
            prep_val=val,
            eigenstate=get_eigenstate_label(basis, val)
        ))
        
    sig_id = f"QDS-2026-{uuid.uuid4().hex[:6].upper()}"
    nonce = f"NONCE-{uuid.uuid4().hex[:8].upper()}"
    ts = datetime.utcnow().isoformat() + "Z"
    auth_token = generate_signer_auth_token(req.sender, sig_id, nonce, req.message, ts)
    
    return SignaturePacket(
        signature_id=sig_id,
        nonce=nonce,
        message=req.message,
        sender=req.sender,
        recipient=req.recipient,
        timestamp=ts,
        num_qubits=req.num_qubits,
        basis_sequence=basis_sequence,
        expected_measurement="".join(expected_bits),
        qubits=qubits,
        public_identifier=public_id,
        auth_token=auth_token
    )

@app.post("/api/signature/verify", response_model=ThreatVerdict)
def verify_signature(req: VerificationRequest):
    """
    Bob verifies Alice's signature via multi-stage defense pipeline:
    Layer 1: Identity Registry Authentication
    Layer 2: Atomic Nonce / Replay Ledger Verification
    Layer 3: Quantum Teleportation & Projective Measurements
    """
    verdict = verify_signature_packet(
        signature=req.signature,
        channel_noise=req.channel_noise,
        override_observed=req.override_observed,
        baseline_noise=req.baseline_channel_noise if req.baseline_channel_noise is not None else 0.015
    )
    return verdict

@app.post("/api/attack/simulate")
def simulate_attack(req: AttackSimulationRequest):
    """
    Simulates one of the 4 cyber attacks against QDS:
    - 'forgery'
    - 'replay'
    - 'impersonation'
    - 'channel_manipulation'
    Returns before-and-after channel telemetry, timeline events, and verdict.
    """
    # 1. Generate base legitimate signature
    gen_req = SignatureGenerationRequest(
        message=req.message or "Default Secure Command",
        sender=req.sender or "Alice",
        recipient=req.recipient or "Bob",
        num_qubits=24
    )
    base_sig = generate_signature(gen_req)
    
    before_state = {
        "channel_status": "NORMAL",
        "qber": 1.2,
        "fidelity": 98.8,
        "topology": "Alice ═══════════════════════════════► Bob",
        "description": "Baseline operational optical fiber link with standard thermal and phase drift."
    }
    
    attack_type = req.attack_type.lower()
    
    if attack_type == "forgery":
        tamper_frac = req.noise_strength if req.noise_strength is not None else 0.75
        attack_packet = generate_forged_signature_packet(
            base_sig,
            tampered_message=f"TAMPERED: Unauthorized withdrawal of ₹500,000 from {req.sender}",
            tamper_fraction=tamper_frac
        )
        verdict = verify_signature_packet(attack_packet)
        return {
            "attack_type": "FORGERY_ATTACK",
            "detection_mechanism": "Layer 3: Quantum Measurement Statistics (Conjugate Basis Collapse)",
            "attack_description": f"Attacker (Eve) altered message payload and synthesized carrier states across {int(tamper_frac*100)}% of qubits in random Pauli bases. Mismatched bases collapse states via Heisenberg uncertainty.",
            "before_state": before_state,
            "after_state": {
                "channel_status": "FORGERY_COLLAPSE",
                "qber": round((verdict.error_rate or 0) * 100, 1),
                "fidelity": round((verdict.fidelity or 0) * 100, 1),
                "topology": "Alice ───► [Eve: Guessed Basis State] ───► Bob",
                "verdict": verdict.verdict
            },
            "packet": attack_packet,
            "verdict": verdict
        }
        
    elif attack_type == "replay":
        # Pre-verify the original signature so it settles into the ledger
        _ = verify_signature_packet(base_sig)
        
        # Attacker re-broadcasts exact same signature
        replayed_packet = create_replayed_signature(base_sig)
        verdict = verify_signature_packet(replayed_packet)
        return {
            "attack_type": "REPLAY_ATTACK",
            "detection_mechanism": "Layer 2: Atomic Signature Ledger (Nonce Lookup)",
            "attack_description": "Attacker recorded Alice's valid signature packet and re-broadcast it. Deterministic signature ledger blocked duplicate execution without invoking quantum simulation.",
            "before_state": before_state,
            "after_state": {
                "channel_status": "REPLAY_INTERCEPTED",
                "qber": "N/A (Classical Rejection)",
                "fidelity": "N/A (Classical Rejection)",
                "topology": "Eve [Cached Packet: " + base_sig.signature_id + "] ───► Bob [Ledger Blocked]",
                "verdict": verdict.verdict
            },
            "packet": replayed_packet,
            "verdict": verdict
        }
        
    elif attack_type == "impersonation":
        impersonated_packet = create_impersonated_signature(
            base_sig,
            spoofed_sender=req.sender or "Alice",
            rogue_identifier="ROGUE-EVE-KEY-X9827"
        )
        verdict = verify_signature_packet(impersonated_packet)
        return {
            "attack_type": "IMPERSONATION_ATTACK",
            "detection_mechanism": "Layer 1: Cryptographic Identity Registry Validation",
            "attack_description": "Attacker forged sender field as 'Alice' but used an unregistered/rogue public identity key. Rejected immediately at Layer 1.",
            "before_state": before_state,
            "after_state": {
                "channel_status": "IDENTITY_SPOOFED",
                "qber": "N/A (Classical Rejection)",
                "fidelity": "N/A (Classical Rejection)",
                "topology": "Eve [Claiming 'Alice' with Key ROGUE-EVE] ───► Bob [Registry Rejected]",
                "verdict": verdict.verdict
            },
            "packet": impersonated_packet,
            "verdict": verdict
        }
        
    elif attack_type == "channel_manipulation":
        noise_cfg = get_channel_attack_config(
            noise_type=req.channel_noise_type or "bit_flip",
            strength=req.noise_strength or 0.35
        )
        verdict = verify_signature_packet(base_sig, channel_noise=noise_cfg)
        return {
            "attack_type": "CHANNEL_MANIPULATION",
            "detection_mechanism": "Layer 3: Quantum Statistics (QBER Spike & State Fidelity Degradation)",
            "attack_description": f"Active Man-in-the-Middle eavesdropper or noisy medium introduced {req.channel_noise_type} ({int((req.noise_strength or 0.35)*100)}% perturbation) into the quantum channel.",
            "before_state": before_state,
            "after_state": {
                "channel_status": "NOISE_PERTURBATION",
                "qber": round((verdict.error_rate or 0) * 100, 1),
                "fidelity": round((verdict.fidelity or 0) * 100, 1),
                "topology": f"Alice ────[MIM Noise: {req.channel_noise_type}]────► Bob",
                "verdict": verdict.verdict
            },
            "packet": base_sig,
            "verdict": verdict
        }
        
    else:
        raise HTTPException(status_code=400, detail=f"Unknown attack type: {req.attack_type}")

@app.get("/api/benchmark/roc", response_model=RocAnalysisResult)
def get_roc_analysis(trials: int = 30):
    """
    Computes empirical ROC threshold curve (TPR vs FPR vs FNR) across 1% to 30% thresholds.
    """
    return run_roc_threshold_analysis(evaluation_trials=min(60, max(15, trials)))

@app.get("/api/benchmark/sweep", response_model=NoiseSweepResult)
def get_noise_sweep(trials: int = 20):
    """
    Measures detection threshold curve across varying disturbance intensities (5% to 50%).
    """
    return run_noise_sensitivity_sweep(trials_per_level=min(40, max(10, trials)))

@app.get("/api/ledger/signatures")
def get_ledger(limit: int = 50):
    """Returns verification ledger history."""
    return get_ledger_records(limit)

@app.get("/api/threats/summary")
def get_threats_summary():
    """Returns aggregated SOC security telemetry."""
    return get_threat_summary()

@app.get("/api/quantum/bell")
def get_bell_state(bell_type: str = "phi_plus"):
    """Returns Bell state properties and density matrix."""
    return get_bell_statevector(bell_type)

@app.get("/api/config/thresholds")
def get_thresholds():
    """Returns current operational QBER acceptance and rejection thresholds."""
    acc, rej = threshold_engine.get_thresholds()
    return {
        "accept_threshold": acc,
        "reject_threshold": rej,
        "status": "OPERATIONAL_CALIBRATED"
    }

@app.post("/api/config/thresholds")
def set_thresholds(cfg: ThresholdConfig):
    """Updates operational QBER thresholds."""
    try:
        threshold_engine.update_thresholds(cfg.accept_threshold, cfg.reject_threshold)
        return {"status": "SUCCESS", "accept": cfg.accept_threshold, "reject": cfg.reject_threshold}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/benchmark/run", response_model=BenchmarkSummary)
def run_benchmark(req: BenchmarkRequest):
    """
    Executes automated benchmark evaluation with realistic noise and randomized attack parameters.
    """
    trials = max(10, min(100, req.trials_per_attack))
    seed = req.random_seed if req.random_seed is not None else 42191
    summary = run_evaluation_benchmark(trials_per_vector=trials, random_seed=seed)
    return summary
