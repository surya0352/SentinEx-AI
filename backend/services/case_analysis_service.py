from sqlalchemy.orm import Session

from backend.models import (
    Case,
    Image,
    Fingerprint
)

from backend.services.matching_service import (
    find_similar_images
)

from backend.services.risk_intelligence_service import (
    calculate_case_risk
)


def analyze_case(
    case_id: int,
    db: Session
):

    # ========================================================
    # 1. Find Case
    # ========================================================

    case = db.query(
        Case
    ).filter(
        Case.id == case_id
    ).first()

    if case is None:

        return {
            "error": "Case not found"
        }


    # ========================================================
    # 2. Get all images belonging to case
    # ========================================================

    images = db.query(
        Image
    ).filter(
        Image.case_id == case_id
    ).all()


    # ========================================================
    # 3. Count total images
    # ========================================================

    total_images = len(
        images
    )


    # ========================================================
    # 4. Analyze image risk levels
    # ========================================================

    sensitive_images = 0

    high_risk_images = 0

    medium_risk_images = 0

    low_risk_images = 0


    for image in images:

        # Count sensitive images

        if image.is_sensitive:

            sensitive_images += 1


        # Count risk levels

        if image.risk_level == "HIGH":

            high_risk_images += 1

        elif image.risk_level == "MEDIUM":

            medium_risk_images += 1

        elif image.risk_level == "LOW":

            low_risk_images += 1


    # ========================================================
    # 5. Find similarity matches
    # ========================================================

    unique_matches = {}


    for image in images:

        # ----------------------------------------------------
        # Find fingerprint
        # ----------------------------------------------------

        fingerprint = db.query(
            Fingerprint
        ).filter(
            Fingerprint.image_id == image.id
        ).first()


        # ----------------------------------------------------
        # Skip image if fingerprint doesn't exist
        # ----------------------------------------------------

        if fingerprint is None:

            continue


        # ----------------------------------------------------
        # Find similar images
        # ----------------------------------------------------

        matches = find_similar_images(
            fingerprint.phash,
            db
        )


        # ----------------------------------------------------
        # Process matches
        # ----------------------------------------------------

        for match in matches:

            matched_image_id = match[
                "image_id"
            ]

            matched_case_id = match.get(
                "case_id"
            )


            # ------------------------------------------------
            # Don't match image with itself
            # ------------------------------------------------

            if matched_image_id == image.id:

                continue


            # ------------------------------------------------
            # Determine match context
            # ------------------------------------------------

            if matched_case_id == case_id:

                match_context = "SAME_CASE"

            else:

                match_context = "DIFFERENT_CASE"


            # ------------------------------------------------
            # Create unique image pair
            # ------------------------------------------------

            image_pair = tuple(
                sorted(
                    [
                        image.id,
                        matched_image_id
                    ]
                )
            )


            # ------------------------------------------------
            # Store unique match
            # ------------------------------------------------

            unique_matches[
                image_pair
            ] = {

                "image_id_1":
                    image_pair[0],

                "image_id_2":
                    image_pair[1],

                "case_id_1":
                    case_id,

                "case_id_2":
                    matched_case_id,

                "match_context":
                    match_context,

                "distance":
                    int(
                        match["distance"]
                    )

            }


    # ========================================================
    # 6. Convert unique matches to list
    # ========================================================

    all_matches = list(
        unique_matches.values()
    )


    # ========================================================
    # 7. Calculate Case-Level Risk Intelligence
    # ========================================================

    risk_intelligence = calculate_case_risk(
        images,
        all_matches
    )


    # ========================================================
    # 8. Count total unique similarity matches
    # ========================================================

    total_similarity_matches = len(
        all_matches
    )


    # ========================================================
    # 9. Return Complete Case Analysis
    # ========================================================

    return {

        "case_id":
            case.id,

        "case_number":
            case.case_number,

        "status":
            case.status,

        "analysis": {

            # -----------------------------------------------
            # Image Statistics
            # -----------------------------------------------

            "total_images":
                total_images,

            "sensitive_images":
                sensitive_images,


            # -----------------------------------------------
            # Risk Summary
            # -----------------------------------------------

            "risk_summary": {

                "high":
                    high_risk_images,

                "medium":
                    medium_risk_images,

                "low":
                    low_risk_images

            },


            # -----------------------------------------------
            # Risk Intelligence
            # -----------------------------------------------

            "risk_intelligence": {

                "overall_risk":
                    risk_intelligence[
                        "overall_risk"
                    ],

                "risk_score":
                    risk_intelligence[
                        "risk_score"
                    ],

                "reasons":
                    risk_intelligence[
                        "reasons"
                    ]

            },


            # -----------------------------------------------
            # Similarity Analysis
            # -----------------------------------------------

            "similarity_analysis": {

                "total_unique_matches":
                    total_similarity_matches,

                "matches":
                    all_matches

            }

        }

    }