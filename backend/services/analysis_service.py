from sqlalchemy.orm import Session

from backend.models import Image, Fingerprint

from backend.services.matching_service import (
    find_similar_images
)


def analyze_image(
    image_id: int,
    db: Session
):

    # --------------------------------------------------------
    # 1. Find image
    # --------------------------------------------------------

    image = db.query(
        Image
    ).filter(
        Image.id == image_id
    ).first()

    if image is None:

        return None


    # --------------------------------------------------------
    # 2. Find fingerprint
    # --------------------------------------------------------

    fingerprint = db.query(
        Fingerprint
    ).filter(
        Fingerprint.image_id == image_id
    ).first()


    # --------------------------------------------------------
    # 3. Find similar images
    # --------------------------------------------------------

    matches = []

    if fingerprint is not None:

        matches = find_similar_images(
            fingerprint.phash,
            db
        )

        # Remove current image
        matches = [
            match
            for match in matches
            if match["image_id"] != image_id
        ]


    # --------------------------------------------------------
    # 4. Return combined analysis
    # --------------------------------------------------------

    return {

        "image_id": image.id,

        "case_id": image.case_id,

        "content_detection": {

            "label": image.ai_label,

            "confidence": image.ai_confidence,

            "is_sensitive": image.is_sensitive

        },

        "risk_assessment": {

            "risk_level": image.risk_level

        },

        "similarity_analysis": {

            "similar_images_found": len(matches),

            "matches": matches

        }

    }