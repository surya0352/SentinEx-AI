def calculate_case_risk(
    images,
    similarity_matches
):

    # --------------------------------------------------------
    # 1. No images
    # --------------------------------------------------------

    if not images:

        return {
            "overall_risk": "UNKNOWN",
            "risk_score": 0,
            "reasons": [
                "No images available for analysis"
            ]
        }


    risk_score = 0

    reasons = []


    # --------------------------------------------------------
    # 2. Analyze AI content detection
    # --------------------------------------------------------

    for image in images:

        if image.is_sensitive:

            risk_score += 50

            reasons.append(
                f"Sensitive content detected in image {image.id}"
            )


    # --------------------------------------------------------
    # 3. Analyze image risk levels
    # --------------------------------------------------------

    for image in images:

        if image.risk_level == "HIGH":

            risk_score += 30

            reasons.append(
                f"High-risk image detected: {image.id}"
            )

        elif image.risk_level == "MEDIUM":

            risk_score += 15

            reasons.append(
                f"Medium-risk image detected: {image.id}"
            )


    # --------------------------------------------------------
    # 4. Analyze similarity matches
    # --------------------------------------------------------

    exact_matches = 0

    similar_matches = 0


    for match in similarity_matches:

        distance = int(
            match["distance"]
        )


        # ----------------------------------------------------
        # Exact fingerprint match
        # ----------------------------------------------------

        if distance == 0:

            exact_matches += 1


        # ----------------------------------------------------
        # Similar but not exact
        # ----------------------------------------------------

        else:

            similar_matches += 1


    # --------------------------------------------------------
    # 5. Add risk for exact matches
    # --------------------------------------------------------

    if exact_matches > 0:

        risk_score += 40

        reasons.append(
            f"{exact_matches} exact image match(es) detected"
        )


    # --------------------------------------------------------
    # 6. Add risk for visually similar images
    # --------------------------------------------------------

    if similar_matches > 0:

        risk_score += 20

        reasons.append(
            f"{similar_matches} similar image match(es) detected"
        )


    # --------------------------------------------------------
    # 7. Cap risk score
    # --------------------------------------------------------

    if risk_score > 100:

        risk_score = 100


    # --------------------------------------------------------
    # 8. Calculate overall risk
    # --------------------------------------------------------

    if risk_score >= 70:

        overall_risk = "HIGH"

    elif risk_score >= 30:

        overall_risk = "MEDIUM"

    else:

        overall_risk = "LOW"


    # --------------------------------------------------------
    # 9. Return risk intelligence
    # --------------------------------------------------------

    return {

        "overall_risk": overall_risk,

        "risk_score": risk_score,

        "reasons": reasons

    }