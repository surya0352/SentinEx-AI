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

    same_case_exact_matches = 0

    different_case_exact_matches = 0

    same_case_similar_matches = 0

    different_case_similar_matches = 0


    for match in similarity_matches:

        distance = int(
            match["distance"]
        )

        match_context = match.get(
            "match_context"
        )


        # ----------------------------------------------------
        # Exact Match
        # ----------------------------------------------------

        if distance == 0:

            if match_context == "DIFFERENT_CASE":

                different_case_exact_matches += 1

            else:

                same_case_exact_matches += 1


        # ----------------------------------------------------
        # Similar Match
        # ----------------------------------------------------

        else:

            if match_context == "DIFFERENT_CASE":

                different_case_similar_matches += 1

            else:

                same_case_similar_matches += 1


    # ========================================================
    # 5. SAME CASE - Exact Matches
    # ========================================================

    if same_case_exact_matches > 0:

        risk_score += (
            same_case_exact_matches * 20
        )

        reasons.append(
            f"{same_case_exact_matches} exact "
            "match(es) found within the same case"
        )


    # ========================================================
    # 6. DIFFERENT CASE - Exact Matches
    # ========================================================

    if different_case_exact_matches > 0:

        risk_score += (
            different_case_exact_matches * 40
        )

        reasons.append(
            f"{different_case_exact_matches} exact "
            "match(es) found in different case(s)"
        )


    # ========================================================
    # 7. SAME CASE - Similar Matches
    # ========================================================

    if same_case_similar_matches > 0:

        risk_score += (
            same_case_similar_matches * 10
        )

        reasons.append(
            f"{same_case_similar_matches} similar "
            "match(es) found within the same case"
        )


    # ========================================================
    # 8. DIFFERENT CASE - Similar Matches
    # ========================================================

    if different_case_similar_matches > 0:

        risk_score += (
            different_case_similar_matches * 20
        )

        reasons.append(
            f"{different_case_similar_matches} similar "
            "match(es) found in different case(s)"
        )


    # ========================================================
    # 9. Cap Risk Score
    # ========================================================

    if risk_score > 100:

        risk_score = 100


    # ========================================================
    # 10. Calculate Overall Risk
    # ========================================================

    if risk_score >= 70:

        overall_risk = "HIGH"

    elif risk_score >= 30:

        overall_risk = "MEDIUM"

    else:

        overall_risk = "LOW"


    # ========================================================
    # 11. Return Risk Intelligence
    # ========================================================

    return {

        "overall_risk":
            overall_risk,

        "risk_score":
            risk_score,

        "reasons":
            reasons

    }