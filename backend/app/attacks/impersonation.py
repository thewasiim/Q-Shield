"""
Signer Impersonation Attack Simulator for Q-SHIELD.
Attacker claims to be Alice but presents rogue public identity credentials.
"""

from app.models.schemas import SignaturePacket

def create_impersonated_signature(
    original_packet: SignaturePacket,
    spoofed_sender: str = "Alice",
    rogue_identifier: str = "ROGUE-ATTACKER-KEY-666"
) -> SignaturePacket:
    """
    Simulates an identity spoofing attack where the claimed sender does not match
    the registered public identity certificate.
    """
    packet_copy = original_packet.model_copy()
    packet_copy.sender = spoofed_sender
    packet_copy.public_identifier = rogue_identifier
    return packet_copy
