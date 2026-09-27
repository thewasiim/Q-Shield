"""
Signature Forgery Attack Simulator for Q-SHIELD.
Eve forges a quantum signature packet without knowing Alice's secret basis assignment.
Supports variable attack intensity (tamper_fraction from 0.05 to 1.0) to model
partial intercept-resend and varying attacker capabilities.
"""

import uuid
from datetime import datetime
import numpy as np
from app.models.schemas import SignaturePacket, QubitDetail
from app.quantum.pauli import PAULI_BASES, get_eigenstate_label

def generate_forged_signature_packet(
    original_packet: SignaturePacket,
    tampered_message: str = "Fraudulent Transfer ₹500,000 to Eve",
    tamper_fraction: float = 1.0
) -> SignaturePacket:
    """
    Creates a forged signature packet where Eve alters the message and prepares
    quantum carrier states across a parameterized fraction of qubits:
    - tamper_fraction = 1.0: Full forgery (Eve guesses all carrier qubits blindly -> ~35-50% QBER)
    - tamper_fraction < 1.0: Partial forgery / intercept-resend with tunable attack intensity
    """
    num_qubits = original_packet.num_qubits
    qubits = []
    
    tamper_fraction = max(0.05, min(1.0, tamper_fraction))
    
    for i in range(num_qubits):
        orig_q = original_packet.qubits[i] if original_packet.qubits else None
        
        # Decide if this qubit is tampered / guessed by Eve based on tamper_fraction
        if np.random.rand() < tamper_fraction or orig_q is None:
            # Guessed randomly by Eve
            eve_basis = str(np.random.choice(PAULI_BASES))
            eve_bit = int(np.random.choice([0, 1]))
            qubits.append(QubitDetail(
                index=i,
                basis=eve_basis,
                prep_val=eve_bit,
                eigenstate=get_eigenstate_label(eve_basis, eve_bit)
            ))
        else:
            # Undisturbed carrier qubit
            qubits.append(QubitDetail(
                index=i,
                basis=orig_q.basis,
                prep_val=orig_q.prep_val,
                eigenstate=orig_q.eigenstate
            ))
            
    forged_packet = SignaturePacket(
        signature_id=f"FORGED-{uuid.uuid4().hex[:6].upper()}",
        message=tampered_message,
        sender=original_packet.sender,
        recipient=original_packet.recipient,
        timestamp=datetime.utcnow().isoformat() + "Z",
        num_qubits=num_qubits,
        basis_sequence=original_packet.basis_sequence,
        expected_measurement=original_packet.expected_measurement,
        qubits=qubits,
        public_identifier=original_packet.public_identifier
    )
    
    return forged_packet
