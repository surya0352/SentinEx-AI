def calculate_risk(
    is_sensitive: bool,
    confidence: float
):
    """
    Convert AI content detection results
    into a risk level.
    """

    if not is_sensitive:
        return "LOW"

    if confidence >= 0.90:
        return "HIGH"

    if confidence >= 0.60:
        return "MEDIUM"

    return "LOW"