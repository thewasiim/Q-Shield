"""
Statistical Engine for Q-SHIELD (Strictly Non-AI).
Computes deterministic quantum cryptographic metrics:
- QBER (Quantum Bit Error Rate)
- Verification Accuracy
- Empirical Forgery Success Estimate (Heuristic Threat Metric)
- Quantum State Fidelity

NOTE ON CRYPTOGRAPHIC CLAIMS:
The empirical forgery success estimate is used strictly for experimental threat scoring
and baseline detection validation. It should NOT be interpreted as a formal composable
information-theoretic security bound, which requires a specific mathematical protocol
proof and unconditional security derivation.
"""

from typing import Tuple, Dict, Any, List
import numpy as np

def calculate_hamming_distance(str1: str, str2: str) -> int:
    """Computes bitwise Hamming distance between two bitstrings."""
    if len(str1) != len(str2):
        raise ValueError(f"Bitstrings must have equal length ({len(str1)} vs {len(str2)})")
    return sum(c1 != c2 for c1, c2 in zip(str1, str2))

def calculate_qber(expected_bits: str, observed_bits: str) -> Tuple[float, int]:
    """
    Calculates the Quantum Bit Error Rate (QBER).
    QBER = d_H(S_exp, S_obs) / N
    Returns (QBER, total_errors).
    """
    total = len(expected_bits)
    if total == 0:
        return 0.0, 0
    errors = calculate_hamming_distance(expected_bits, observed_bits)
    qber = errors / total
    return round(float(qber), 4), errors

def calculate_verification_accuracy(qber: float) -> float:
    """Computes quantum verification accuracy (1 - QBER)."""
    return round(max(0.0, min(1.0, 1.0 - qber)), 4)

def estimate_empirical_forgery_success(qber: float, num_qubits: int) -> float:
    """
    Heuristic empirical estimate of adversary's success probability when guessing
    Pauli bases without secret key.
    
    DISCLAIMER: This is an empirical threat scoring estimate derived under the assumption
    of independent random basis selection, used for threat prioritization. It is NOT
    presented as a formal composable QDS information-theoretic security bound.
    """
    # Under random basis guessing across 3 mutually unbiased / conjugate bases,
    # the probability of correctly matching or randomly passing is bounded empirically
    p_guess = (1.0 + qber) / 2.0
    estimate = p_guess ** num_qubits
    return float(np.clip(estimate, 1e-12, 1.0))

# Backward compatibility alias
def calculate_forgery_probability(qber: float, num_qubits: int) -> float:
    return estimate_empirical_forgery_success(qber, num_qubits)

def compute_pauli_distribution(qubit_telemetry: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Analyzes measurement accuracy broken down by Pauli basis (X, Y, Z).
    """
    stats = {"X": {"total": 0, "errors": 0}, "Y": {"total": 0, "errors": 0}, "Z": {"total": 0, "errors": 0}}
    for q in qubit_telemetry:
        basis = q.get("prep_basis", "Z").upper()
        if basis in stats:
            stats[basis]["total"] += 1
            if q.get("is_error", False):
                stats[basis]["errors"] += 1
                
    result = {}
    for basis, data in stats.items():
        tot = data["total"]
        err = data["errors"]
        result[basis] = {
            "total": tot,
            "errors": err,
            "qber": round(err / tot, 4) if tot > 0 else 0.0,
            "accuracy": round(1.0 - (err / tot), 4) if tot > 0 else 1.0
        }
    return result

def compute_wilson_confidence_interval(k: int, n: int, z: float = 1.96) -> Tuple[float, float]:
    """
    Computes Wilson score binomial confidence interval.
    Recommended for small sample sizes (e.g. n=25) where normal approximation fails.
    Returns (lower_bound, upper_bound) clamped to [0.0, 1.0].
    """
    if n <= 0:
        return 0.0, 1.0
    p_hat = k / n
    denominator = 1.0 + (z**2) / n
    center_adj = p_hat + (z**2) / (2.0 * n)
    spread = z * np.sqrt((p_hat * (1.0 - p_hat) / n) + ((z**2) / (4.0 * (n**2))))
    
    lower = max(0.0, (center_adj - spread) / denominator)
    upper = min(1.0, (center_adj + spread) / denominator)
    return round(float(lower), 4), round(float(upper), 4)
