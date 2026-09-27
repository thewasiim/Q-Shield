"""
Configurable Security Thresholds for Q-SHIELD.
Manages QBER acceptance, suspicion, and rejection limits.
"""

from typing import Tuple

class ThresholdManager:
    def __init__(self, accept_threshold: float = 0.05, reject_threshold: float = 0.15):
        self.accept_threshold = accept_threshold
        self.reject_threshold = reject_threshold

    def get_thresholds(self) -> Tuple[float, float]:
        return self.accept_threshold, self.reject_threshold

    def update_thresholds(self, accept: float, reject: float):
        if accept < 0.0 or reject > 1.0 or accept >= reject:
            raise ValueError("Invalid thresholds: require 0.0 <= accept < reject <= 1.0")
        self.accept_threshold = accept
        self.reject_threshold = reject

    def evaluate_verdict(self, qber: float) -> str:
        """
        Multi-threshold non-AI decision logic:
        QBER <= accept_threshold -> ACCEPT
        accept_threshold < QBER <= reject_threshold -> SUSPICIOUS
        QBER > reject_threshold -> REJECT
        """
        if qber <= self.accept_threshold:
            return "ACCEPT"
        elif qber <= self.reject_threshold:
            return "SUSPICIOUS"
        else:
            return "REJECT"

# Global threshold manager instance
threshold_engine = ThresholdManager()
