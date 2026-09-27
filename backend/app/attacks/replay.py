"""
Replay Attack Simulator for Q-SHIELD.
Re-submits a previously verified and settled signature packet to induce replay threat.
"""

from app.models.schemas import SignaturePacket

def create_replayed_signature(original_packet: SignaturePacket) -> SignaturePacket:
    """
    Simulates an attacker recording Alice's legitimate signature and re-broadcasting it
    with the exact same signature_id and cryptographic parameters.
    """
    return original_packet.model_copy()
