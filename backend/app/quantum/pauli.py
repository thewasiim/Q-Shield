"""
Pauli Operators & Eigenstate Module for Q-SHIELD.
Implements X, Y, Z basis state preparations and projective rotation gates.
"""

from typing import Tuple, Dict, Any
import numpy as np
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector

# Pauli Eigenstates definitions
# X basis: |+>, |->
# Y basis: |+i>, |-i>
# Z basis: |0>, |1>

PAULI_BASES = ["X", "Y", "Z"]

def prepare_pauli_eigenstate(qc: QuantumCircuit, qubit_idx: int, basis: str, value: int):
    """
    Prepares a qubit in an eigenstate of the specified Pauli basis:
    - basis='Z', value=0 -> |0>
    - basis='Z', value=1 -> |1> (X gate)
    - basis='X', value=0 -> |+> (H gate)
    - basis='X', value=1 -> |-> (X then H gate)
    - basis='Y', value=0 -> |+i> (H then S gate)
    - basis='Y', value=1 -> |-i> (X then H then S gate)
    """
    basis = basis.upper()
    if basis == "Z":
        if value == 1:
            qc.x(qubit_idx)
    elif basis == "X":
        if value == 1:
            qc.x(qubit_idx)
        qc.h(qubit_idx)
    elif basis == "Y":
        if value == 1:
            qc.x(qubit_idx)
        qc.h(qubit_idx)
        qc.s(qubit_idx)
    else:
        raise ValueError(f"Unsupported Pauli basis: {basis}")

def apply_measurement_basis_rotation(qc: QuantumCircuit, qubit_idx: int, basis: str):
    """
    Rotates the measurement basis into the computational Z basis:
    - Z: no rotation needed
    - X: apply H gate
    - Y: apply S dagger (sdg) followed by H gate
    """
    basis = basis.upper()
    if basis == "X":
        qc.h(qubit_idx)
    elif basis == "Y":
        qc.sdg(qubit_idx)
        qc.h(qubit_idx)
    elif basis == "Z":
        pass  # Standard measurement in computational basis
    else:
        raise ValueError(f"Unsupported measurement basis: {basis}")

def get_eigenstate_label(basis: str, value: int) -> str:
    """Returns the Dirac ket representation."""
    basis = basis.upper()
    if basis == "Z":
        return "|0⟩" if value == 0 else "|1⟩"
    elif basis == "X":
        return "|+⟩" if value == 0 else "|-⟩"
    elif basis == "Y":
        return "|+i⟩" if value == 0 else "|-i⟩"
    return f"|?_{basis}{value}⟩"
