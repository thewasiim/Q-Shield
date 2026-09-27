"""
Quantum Channel Manipulation Simulator for Q-SHIELD.
Injects physical noise or eavesdropping disturbance into the quantum channel.
"""

from typing import Dict, Any

def get_channel_attack_config(noise_type: str = "bit_flip", strength: float = 0.35) -> Dict[str, Any]:
    """
    Returns channel disturbance configuration:
    - noise_type: 'bit_flip' (X operator), 'phase_flip' (Z operator),
                  'bit_phase_flip' (Y operator), 'depolarizing' (random Pauli)
    - strength: error probability / noise rate (0.0 to 1.0)
    """
    return {
        "enabled": True,
        "type": noise_type,
        "strength": max(0.0, min(1.0, strength))
    }
