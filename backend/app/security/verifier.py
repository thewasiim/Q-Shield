"""
Signature Verification Orchestrator for Q-SHIELD.

Coordinates hierarchical multi-stage verification:
Layer 1: Symmetric Cryptographic Identity Authentication (HMAC-SHA256 Signer Authentication)
Layer 2: Database-Enforced Nonce Ledger (Stateful PENDING -> SETTLED / REJECTED Lifecycle)
Layer 3: Quantum Teleportation & Projective Measurement Analysis

Q-SHIELD uses classical authentication and replay controls to protect the protocol envelope,
then uses quantum-state measurement statistics to assess the integrity of signatures that pass those classical checks.
"""

from typing import Dict, Any, Optional
from datetime import datetime
import numpy as np

from app.models.schemas import SignaturePacket, ThreatVerdict, TimelineEvent
from app.quantum.measurement import execute_signature_measurements
from app.security.threat_detector import evaluate_multi_layer_threats
from app.models.database import (
    record_signature_verification,
    is_signature_replayed,
    get_registered_identity,
    reserve_nonce_pending,
    settle_nonce_passed,
    release_or_reject_nonce,
    verify_signer_auth_token
)

def verify_signature_packet(
    signature: SignaturePacket,
    channel_noise: Optional[Dict[str, Any]] = None,
    override_observed: Optional[str] = None,
    baseline_noise: float = 0.015,  # 1.5% realistic baseline fiber noise
    timestamp_freshness_window_sec: float = 300.0
) -> ThreatVerdict:
    """
    Verifies a QDS signature packet through defense-in-depth pipeline.
    Classical checks execute first; if failed, quantum circuit execution is aborted.
    State machine:
    1. Checks if already SETTLED (database-enforced uniqueness constraint).
    2. Enters PENDING state.
    3. Runs quantum verification.
    4. Settles on PASS (ACCEPT); releases/marks REJECTED on failure so failed packets
       do not create a Denial-of-Service vulnerability for legitimate signers.
    """
    timestamp = datetime.utcnow().isoformat() + "Z"
    nonce = signature.nonce or f"NONCE-{signature.signature_id}"
    
    # -------------------------------------------------------------
    # PRE-FLIGHT: Layer 1 (Symmetric Identity) & Layer 2 (Settled Nonce)
    # -------------------------------------------------------------
    identity_record = get_registered_identity(signature.sender)
    identity_failed = (
        not identity_record or 
        identity_record["public_identifier"] != signature.public_identifier
    )
    
    # Check if this signature_id was already settled in previous transaction
    replayed_record = is_signature_replayed(signature.signature_id)
    replay_failed = bool(replayed_record)
    
    # Check HMAC token if presented
    token_valid, token_msg = verify_signer_auth_token(
        sender_id=signature.sender,
        signature_id=signature.signature_id,
        nonce=nonce,
        message=signature.message,
        timestamp=signature.timestamp,
        token=signature.auth_token,
        public_identifier=signature.public_identifier,
        allowed_window_sec=timestamp_freshness_window_sec
    )
    
    # If classical layer fails, short-circuit before quantum simulation
    if identity_failed or replay_failed or (signature.auth_token and not token_valid):
        threat_eval = evaluate_multi_layer_threats(
            signature_id=signature.signature_id,
            sender=signature.sender,
            public_identifier=signature.public_identifier
        )
        
        # If token was specifically tampered/stale
        if signature.auth_token and not token_valid and not identity_failed and not replay_failed:
            threat_eval["threat_type"] = "IMPERSONATION_ATTACK"
            threat_eval["details"] = f"Layer 1 [Symmetric HMAC Auth FAILED]: {token_msg}"
        
        # Record classical rejection event in ledger
        record_signature_verification(
            signature_id=signature.signature_id,
            sender=signature.sender,
            recipient=signature.recipient,
            message=signature.message,
            expected_measurement=signature.expected_measurement,
            observed_measurement=None,
            qber=None,
            fidelity=None,
            verdict=threat_eval["verdict"],
            threat_type=threat_eval["threat_type"],
            timestamp=timestamp
        )
        
        # Ensure nonce is marked rejected (not settled), avoiding DoS
        release_or_reject_nonce(signature.signature_id, reason="CLASSICAL_PREFLIGHT_FAIL")
        
        timeline_events = [TimelineEvent(**ev) for ev in threat_eval["timeline"]]
        
        return ThreatVerdict(
            signature_id=signature.signature_id,
            verdict=threat_eval["verdict"],
            threat_type=threat_eval["threat_type"],
            detection_layer=threat_eval["detection_layer"],
            error_rate=None,
            verification_accuracy=None,
            fidelity=None,
            empirical_forgery_estimate=None,
            forgery_probability=None,
            expected_string=signature.expected_measurement,
            observed_string=None,
            hamming_distance=None,
            details=threat_eval["details"],
            timestamp=timestamp,
            timeline=timeline_events,
            qubit_telemetry=None
        )

    # Atomically reserve pending nonce in database
    can_proceed, reserve_err = reserve_nonce_pending(signature.signature_id, nonce, timestamp)
    if not can_proceed:
        threat_eval = evaluate_multi_layer_threats(
            signature_id=signature.signature_id,
            sender=signature.sender,
            public_identifier=signature.public_identifier
        )
        threat_eval["details"] = f"Stage 2 [Settled Nonce Ledger FAILED]: {reserve_err}"
        timeline_events = [TimelineEvent(**ev) for ev in threat_eval["timeline"]]
        return ThreatVerdict(
            signature_id=signature.signature_id,
            verdict="REJECT",
            threat_type="REPLAY_ATTACK",
            detection_layer="SETTLED_NONCE_LEDGER",
            error_rate=None,
            verification_accuracy=None,
            fidelity=None,
            empirical_forgery_estimate=None,
            forgery_probability=None,
            expected_string=signature.expected_measurement,
            observed_string=None,
            hamming_distance=None,
            details=threat_eval["details"],
            timestamp=timestamp,
            timeline=timeline_events,
            qubit_telemetry=None
        )

    # -------------------------------------------------------------
    # STAGE 3: Quantum Simulation & Projective Measurements
    # -------------------------------------------------------------
    effective_channel_noise = channel_noise
    
    # If no explicit adversarial attack injected, apply realistic physical channel baseline noise
    if not effective_channel_noise and baseline_noise > 0.0:
        effective_channel_noise = {
            "enabled": True,
            "type": "depolarizing",
            "strength": baseline_noise
        }
        
    if override_observed is not None:
        observed_string = override_observed
        qubit_telemetry = []
        mean_fidelity = 0.98
    else:
        if signature.qubits and len(signature.qubits) == len(signature.basis_sequence):
            prep_bases = [q.basis for q in signature.qubits]
            prep_values = [q.prep_val for q in signature.qubits]
        else:
            prep_bases = signature.basis_sequence
            prep_values = [int(b) for b in signature.expected_measurement]
            
        measure_bases = signature.basis_sequence  # Verifier measures along designated protocol bases
        
        sim_res = execute_signature_measurements(
            prep_bases=prep_bases,
            prep_values=prep_values,
            measure_bases=measure_bases,
            channel_noise=effective_channel_noise
        )
        observed_string = sim_res["observed_string"]
        mean_fidelity = sim_res["mean_fidelity"]
        qubit_telemetry = sim_res["qubit_telemetry"]
        
    is_channel_attack = bool(channel_noise and channel_noise.get("enabled", False) and channel_noise.get("strength", 0) > 0.05)
    
    threat_eval = evaluate_multi_layer_threats(
        signature_id=signature.signature_id,
        sender=signature.sender,
        public_identifier=signature.public_identifier,
        expected_bits=signature.expected_measurement,
        observed_bits=observed_string,
        mean_fidelity=mean_fidelity,
        is_channel_attack_simulation=is_channel_attack
    )
    
    verdict = threat_eval["verdict"]
    threat_type = threat_eval["threat_type"]
    qber = threat_eval["error_rate"]
    accuracy = threat_eval["accuracy"]
    fidelity = threat_eval["fidelity"]
    empirical_forgery = threat_eval["empirical_forgery_estimate"]
    details = threat_eval["details"]
    
    # State Machine Transition:
    # PASS -> SETTLE nonce; FAIL -> REJECT nonce so identifier is not permanently consumed
    if verdict == "ACCEPT":
        settle_nonce_passed(signature.signature_id, timestamp)
    else:
        release_or_reject_nonce(signature.signature_id, reason=f"FAILED_QUANTUM_CHECK_{verdict}")
        
    # Record verified transaction in ledger
    record_signature_verification(
        signature_id=signature.signature_id,
        sender=signature.sender,
        recipient=signature.recipient,
        message=signature.message,
        expected_measurement=signature.expected_measurement,
        observed_measurement=observed_string,
        qber=qber,
        fidelity=fidelity,
        verdict=verdict,
        threat_type=threat_type,
        timestamp=timestamp
    )
    
    timeline_events = [TimelineEvent(**ev) for ev in threat_eval["timeline"]]
    
    return ThreatVerdict(
        signature_id=signature.signature_id,
        verdict=verdict,
        threat_type=threat_type,
        detection_layer=threat_eval["detection_layer"],
        error_rate=qber,
        verification_accuracy=accuracy,
        fidelity=fidelity,
        empirical_forgery_estimate=empirical_forgery,
        forgery_probability=empirical_forgery,
        expected_string=signature.expected_measurement,
        observed_string=observed_string,
        hamming_distance=int(qber * len(signature.expected_measurement)) if qber is not None else 0,
        details=details,
        timestamp=timestamp,
        timeline=timeline_events,
        qubit_telemetry=qubit_telemetry
    )
