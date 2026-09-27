"""
Multi-Qubit Projective Measurement Module for Q-SHIELD.
Executes Pauli measurements across an entire signature qubit stream.
"""

from typing import List, Dict, Any, Optional
import numpy as np
from app.quantum.teleportation import simulate_single_qubit_teleportation

def execute_signature_measurements(
    prep_bases: List[str],
    prep_values: List[int],
    measure_bases: List[str],
    channel_noise: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Executes quantum teleportation and projective measurements for all N qubits in a signature.
    channel_noise: optional parameters for injecting channel disturbance
    """
    assert len(prep_bases) == len(prep_values) == len(measure_bases), "Basis and value sequences must have equal length"
    
    n_qubits = len(prep_bases)
    observed_bits = []
    qubit_telemetry = []
    matched_basis_count = 0
    errors = 0
    fidelities = []
    
    for i in range(n_qubits):
        res = simulate_single_qubit_teleportation(
            prep_basis=prep_bases[i],
            prep_val=prep_values[i],
            measure_basis=measure_bases[i],
            channel_noise=channel_noise
        )
        
        observed_bit = res["bob_bit"]
        observed_bits.append(observed_bit)
        fidelities.append(res["fidelity"])
        
        is_matched = res["basis_matched"]
        if is_matched:
            matched_basis_count += 1
            if observed_bit != prep_values[i]:
                errors += 1
        else:
            # If basis mismatched (e.g. Forgery guess), measurement error rate is ~50%
            if observed_bit != prep_values[i]:
                errors += 1
                
        qubit_telemetry.append({
            "index": i,
            "prep_basis": prep_bases[i],
            "prep_val": prep_values[i],
            "measure_basis": measure_bases[i],
            "observed_bit": observed_bit,
            "basis_matched": is_matched,
            "is_error": observed_bit != prep_values[i],
            "fidelity": res["fidelity"]
        })
        
    observed_string = "".join(str(b) for b in observed_bits)
    expected_string = "".join(str(b) for b in prep_values)
    
    return {
        "n_qubits": n_qubits,
        "expected_string": expected_string,
        "observed_string": observed_string,
        "errors": errors,
        "matched_basis_count": matched_basis_count,
        "mean_fidelity": float(np.mean(fidelities)),
        "qubit_telemetry": qubit_telemetry
    }
