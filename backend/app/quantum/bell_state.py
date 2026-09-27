"""
Bell State (EPR Pair) Generator for Q-SHIELD.
Prepares maximally entangled states:
|Phi+> = (|00> + |11>) / sqrt(2)
|Phi-> = (|00> - |11>) / sqrt(2)
|Psi+> = (|01> + |10>) / sqrt(2)
|Psi-> = (|01> - |10>) / sqrt(2)
"""

from typing import Dict, Any, Tuple
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector

def create_bell_circuit(bell_type: str = "phi_plus") -> QuantumCircuit:
    """
    Creates a 2-qubit circuit producing one of the 4 Bell states.
    bell_type: 'phi_plus', 'phi_minus', 'psi_plus', 'psi_minus'
    """
    qc = QuantumCircuit(2, name=f"Bell_{bell_type}")
    
    # Base: H on q0, CX q0 -> q1 gives |Phi+>
    qc.h(0)
    qc.cx(0, 1)
    
    if bell_type == "phi_minus":
        qc.z(0)
    elif bell_type == "psi_plus":
        qc.x(1)
    elif bell_type == "psi_minus":
        qc.z(0)
        qc.x(1)
        
    return qc

def get_bell_statevector(bell_type: str = "phi_plus") -> Dict[str, Any]:
    """Returns the statevector and density matrix properties of the Bell state."""
    qc = create_bell_circuit(bell_type)
    sv = Statevector.from_instruction(qc)
    probs = sv.probabilities_dict()
    
    return {
        "bell_type": bell_type,
        "statevector": [f"{amp.real:+.3f}{amp.imag:+.3f}j" for amp in sv.data],
        "probabilities": {k: float(v) for k, v in probs.items()},
        "entanglement_measure": 1.0,  # Max entanglement (von Neumann entropy = 1 ebit)
        "circuit_qasm": qc.qasm() if hasattr(qc, 'qasm') else str(qc.draw(output='text'))
    }
