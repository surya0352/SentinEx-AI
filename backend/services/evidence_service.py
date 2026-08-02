from sqlalchemy.orm import Session

from backend.models import (
    Case,
    Image,
    Fingerprint
)


def get_case_evidence(
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

        return None


    # ========================================================
    # 2. Get all images belonging to case
    # ========================================================

    images = db.query(
        Image
    ).filter(
        Image.case_id == case_id
    ).all()


    # ========================================================
    # 3. Prepare evidence list
    # ========================================================

    evidence = []


    # ========================================================
    # 4. Collect evidence for each image
    # ========================================================

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
        # Prepare fingerprint information
        # ----------------------------------------------------

        fingerprint_data = None


        if fingerprint is not None:

            fingerprint_data = {

                "phash":
                    fingerprint.phash,

                "dhash":
                    fingerprint.dhash

            }


        # ----------------------------------------------------
        # Prepare image evidence
        # ----------------------------------------------------

        image_evidence = {

            "image_id":
                image.id,

            "filename":
                image.filename,

            "file_path":
                image.file_path,

            "content_type":
                image.content_type,

            "ai_analysis": {

                "label":
                    image.ai_label,

                "confidence":
                    image.ai_confidence,

                "is_sensitive":
                    image.is_sensitive

            },

            "risk_level":
                image.risk_level,

            "fingerprints":
                fingerprint_data,

            "created_at":
                image.created_at

        }


        evidence.append(
            image_evidence
        )


    # ========================================================
    # 5. Return Case Evidence
    # ========================================================

    return {

        "case_id":
            case.id,

        "case_number":
            case.case_number,

        "status":
            case.status,

        "total_images":
            len(images),

        "evidence":
            evidence

    }